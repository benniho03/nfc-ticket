import { EventDetails } from "@/server/api/routers/events";
import { api } from "@/utils/api";
import { SignInButton, auth, useUser } from "@clerk/nextjs";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const eventId = router.query.eventId as string;

  const { user, isSignedIn } = useUser();
  if (!user || !isSignedIn)
    return (
      <div>
        <SignInButton />
      </div>
    );
  const userId = user?.id;

  const {
    data: event,
    isLoading,
    error,
  } = api.event.getOne.useQuery({ eventId });

  if (!userId) return <div>Not signed in</div>;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An Error Occured</div>;
  if (!event) return <div>404</div>;

  return (  
    <>
      <div className="container">
        <h1 className=" mb-6  text-6xl font-bold">DEIN EVENT</h1>
      
      <div className="flex bg-slate-700">
        <div className="md:w-1/2 ">
          <img className="object-cover w-full" src={event.imageUrl}/>
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
            /{event.maxTicketAmount}{" "}
          </p>
        </div>
      </div>
      </div>
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
