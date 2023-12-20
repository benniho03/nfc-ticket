import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EventDetails } from "@/server/api/routers/events";
import Autoplay from "embla-carousel-autoplay";

export const EventSlider = ({ events }: { events: EventDetails[] }) => {
  const [emblaRef] = useEmblaCarousel( { loop: true, }, [Autoplay({delay : 10000})]);

  return (
    <div className="embla  bg-slate-200 " ref={emblaRef}>
      <div className="embla__container">
        {events.map((event) => {
          return <div className="embla__slide p-5 ">
            <div className="text-2xl ">{event.name}</div>
            <div className="text-lg ">{event.date.toLocaleDateString()}</div>
            <div className="text-lg ">{event.location}</div>
            <div className="text-lg ">Ein BILD FEHLT</div>
            
            </div>;
        })}
      </div>
    </div>
  );
};
