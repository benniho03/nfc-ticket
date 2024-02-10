import { api } from "@/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { appRouter } from "@/server/api/root";
import { db } from '@/server/db';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HeaderNavigation from "@/components/header-navigation";
import { BanknotesIcon, MapIcon, MapPinIcon, CalendarIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";

export default function Page({ eventId }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const {
        data: event,
    } = api.event.getOne.useQuery({ eventId });

    if (!event) return (
        <div>
            <h1 className="font-bold text-4xl">404</h1>
            <Button><Link href="/event">Zurück</Link></Button>
        </div>
    )


    return (
        <>
            <HeaderNavigation />
            <div className="container">
                <div className="flex bg-slate-700 text-slate-50 rounded-lg">
                    <div className="md:w-1/2 rounded-l-lg ">
                        <img className="object-cover w-full" src={event.imageUrl} />
                    </div>
                    <div className="flex flex-col md:w-1/2 p-10 text-xl h-auto justify-between">
                        <div>
                            <h1 className="pt-3 text-4xl font-extrabold mb-5">{event.name}</h1>
                            <div className="mb-5">
                                <div className="flex gap-4 font-bold flex-wrap">
                                    <div className="flex gap-1 items-center bg-slate-800 px-4 py-1 rounded-3xl">
                                        <MapPinIcon className="h-5 w-5 inline-block text-slate-50" />
                                        <p className="text-slate-200">{event.location}</p>
                                    </div>
                                    <div className="flex gap-1 items-center bg-slate-800 px-4 py-1 rounded-3xl">
                                        <MapIcon className="h-5 w-5 inline-block text-slate-50" />
                                        <p className="py-1">{event.locationAdress}</p>
                                    </div>
                                    <div className="flex gap-1 items-center bg-slate-800 px-4 py-1 rounded-3xl">
                                        <CalendarIcon className="h-5 w-5 inline-block text-slate-50" />
                                        <p className="text-slate-200">{event.date.toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-1 items-center bg-slate-800 px-4 py-1 rounded-3xl">
                                        <BanknotesIcon className="h-5 w-5 inline-block text-slate-50" />
                                        <p className="text-slate-200">{event.ticketPrice}€</p>
                                    </div>
                                </div>
                            </div>
                            <p className="py-1 text-2xl font-medium">{event.description}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="mb-2">
                                Noch {getRemainingTicketPercentage(event.maxTicketAmount, event.ticketsSold)}% der Tickets verfügbar!
                            </p>
                            <Button className="flex gap-2 ">
                                <MusicalNoteIcon className="h-5 w-5 inline-block text-slate-50" />
                                <Link href={event.id + "/shop"}>Jetzt buchen!</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export function getRemainingTicketPercentage(
    maxTicketAmount: number,
    ticketsSold: number,
) {
    if (ticketsSold === 0) return 100;
    return ((1 - (ticketsSold / maxTicketAmount)) * 100).toFixed();
}



export async function getServerSideProps(context: GetServerSidePropsContext<{ eventId: string }>) {

    const ssr = createServerSideHelpers({
        router: appRouter,
        ctx: {
            db,
            userId: null
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