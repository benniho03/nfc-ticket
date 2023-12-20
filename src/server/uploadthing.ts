import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();

export const imageRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 }, })
        .middleware(async ({ req, res }) => {
            const { userId } = getAuth(req);

            //TODO: Check if user is admin

            console.log(userId)

            if (!userId) throw new Error("Unauthorized");

            return { userId }
        })
        .onUploadComplete(async ({ metadata, file }) => {

            return {
                name: file.name,
                size: file.size,
                url: file.url,
                userId: metadata.userId,
            };
        }),
} satisfies FileRouter;

export type ImageRouter = typeof imageRouter;