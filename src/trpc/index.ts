import { TRPCError } from "@trpc/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";

import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { INFINITY_QUERY_LIMIT } from "@/config/infinite-query";
import { absoluteUrl } from "@/lib/utils";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user || !user.id)
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email!,
        },
      });
    }

    return { success: true };
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await db.file.findMany({
      where: { userId },
    });
  }),
  createStripeSession: privateProcedure.mutation(
    async ({ ctx: { userId } }) => {
      const billingUrl = absoluteUrl("/dashboard/billing");

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const dbUesr = await db.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!dbUesr) throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  ),
  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(
      async ({
        ctx: { userId },
        input: { fileId, cursor, limit: tempLimit },
      }) => {
        const limit = tempLimit ?? INFINITY_QUERY_LIMIT;

        const file = await db.file.findFirst({
          where: {
            id: fileId,
            userId,
          },
        });
        if (!file) throw new TRPCError({ code: "NOT_FOUND" });

        const messages = await db.message.findMany({
          take: limit + 1,
          where: {
            fileId,
          },
          orderBy: {
            createdAt: "desc",
          },
          cursor: cursor ? { id: cursor } : undefined,
          select: {
            id: true,
            isUserMessage: true,
            createdAt: true,
            text: true,
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (messages.length > limit) {
          const nextItem = messages.pop();
          nextCursor = nextItem?.id;
        }

        return {
          messages,
          nextCursor,
        };
      }
    ),
  getFileUploadStatus: privateProcedure
    .input(
      z.object({
        fileId: z.string(),
      })
    )
    .query(async ({ input: { fileId }, ctx }) => {
      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId: ctx.userId,
        },
      });

      if (!file) return { status: "PENDING" as const };

      return { status: file.uploadStatus };
    }),
  getFile: privateProcedure
    .input(
      z.object({
        key: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),
  deleteFile: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      await db.file.delete({
        where: {
          id: input.id,
          userId,
        },
      });

      return file;
    }),
});

export type AppRouter = typeof appRouter;
