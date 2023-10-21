import { TRPCError } from "@trpc/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  authCallback: publicProcedure.query(() => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user || !user.id)
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });

    // TODO: Check for user in DB.

    return { success: true };
  }),
});

export type AppRouter = typeof appRouter;
