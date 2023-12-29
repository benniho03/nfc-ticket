import { api } from "@/utils/api";
import { SignInButton, auth, useUser } from "@clerk/nextjs";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { appRouter } from "@/server/api/root";
import { db } from '@/server/db';
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page({ eventId }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const { user, isSignedIn } = useUser();

    const {
        data: event,
    } = api.event.getOne.useQuery({ eventId });

    if (!event) return <div>
        <h1 className="font-bold text-4xl">404</h1>
        <Button><Link href="/event">Zurück</Link></Button>
    </div>;

    if (!user || !isSignedIn)
        return (
            <div>
                <SignInButton />
            </div>
        );
    const userId = user?.id;


    if (!userId) return <div>Not signed in</div>;

    if (!event) return <div>404</div>;

    return (
        <>

            <div className="container">
                <h1 className=" mb-6  text-6xl font-bold">DEIN EVENT</h1>

                <div className="flex bg-slate-700">
                    <div className="md:w-1/2 ">
                        <img className="object-cover w-full" src={event.imageUrl} />
                    </div>
                    <div className="flex md:w-1/2 flex-col p-10 text-xl ">
                        <h1 className="pt-3 text-4xl font-bold">{event.name}</h1>
                        <p className="pb-2">{event.date.toLocaleDateString()}</p>
                        <p className="py-1">{event.description}</p>
                        <p className="py-1">Location: {event.location}</p>
                        <p className="py-1">Adresse: {event.locationAdress}</p>
                        <p className="py-4 text-2xl font-semibold">
                            Ticketpreis: {event.ticketPrice}
                        </p>
                        <p className="py2">Maximale Besucher: {event.maxTicketAmount}</p>
                        <p>
                            Noch verfügbare Tickets: {event.maxTicketAmount - event.ticketsSold}
                            /{event.maxTicketAmount}
                        </p>
                        <Link href={event.id + "/shop"}>Shop</Link>
                    </div>
                </div>
            </div >
        </>
    );
}

function getRemainingTicketPercentage(
    maxTicketAmount: number,
    ticketsSold: number,
) {
    if (ticketsSold === 0) return 100;
    return (1 - (maxTicketAmount / ticketsSold) * 100).toFixed();
}



export async function getServerSideProps(context: GetServerSidePropsContext<{ eventId: string }>) {

    const ssr = createServerSideHelpers({
        router: appRouter,
        ctx: {
            db
        },
        transformer: superjson,
    });

    const eventId = context.params?.eventId as string;

    await ssr.event.getOne.prefetch({ eventId });

    return {
        props: {
            trpcState: ssr.dehydrate(),
            eventId
        }
    }
}