import { createNextPageApiHandler } from "uploadthing/next-legacy";
 
import { imageRouter } from "@/server/uploadthing";
 
const handler = createNextPageApiHandler({
  router: imageRouter,
});
 
export default handler;