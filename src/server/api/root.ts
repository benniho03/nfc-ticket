import { postRouter } from "@/server/api/routers/post";
import { ticketRouter } from "@/server/api/routers/tickets";
import { eventRouter } from "@/server/api/routers/events";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  ticket: ticketRouter,
  event: eventRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
