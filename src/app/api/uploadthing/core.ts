import { db } from "@/db";
import { pinecone } from "@/lib/pinecone";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = getUser();

      if (!user || !user.id) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const response = await fetch(
          `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
        );
        const blob = await response.blob();

        const loader = new PDFLoader(blob);

        const pageLavelDocs = await loader.load();

        const pageAmt = pageLavelDocs.length;

        // vectorizing & index entire doc
        const pineconeIndex = pinecone.Index("quill");

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

        await PineconeStore.fromDocuments(pageLavelDocs, embeddings, {
          pineconeIndex,
          namespace: createFile.id,
        });

        await db.file.update({
          where: {
            id: createFile.id,
          },
          data: {
            uploadStatus: "SUCCESS",
          },
        });
      } catch (error) {
        await db.file.update({
          where: {
            id: createFile.id,
          },
          data: {
            uploadStatus: "FAILED",
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
