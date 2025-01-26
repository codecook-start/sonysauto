/* eslint-disable @next/next/no-img-element */
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "@/components/EmblaCarouselArrowButtons";
import Loader from "@/components/Loader";
import { useCars } from "@/hooks/useCars";
import { CarResponse } from "@/types/edit-car";
import { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

const Recomendation = () => {
  const { cars, isLoading, isError } = useCars();
  const [emblaRef, emblaApi] = useEmblaCarousel({}, [Autoplay()]);
  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi, onNavButtonClick);

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <div className="flex items-center justify-center">
        <span className="text-red-500">Failed to load cars</span>
      </div>
    );
  return (
    <div
      style={{
        width: "min(90%, 75rem)",
        marginInline: "auto",
      }}
    >
      <section className="relative flex-col">
        <div className="my-4 flex items-center justify-between">
          <div className="left flex items-center gap-2">
            <ArrowLeft size={"1em"} />
            <span className="font-semibold">Search Results</span>
          </div>
          <div className="embla__controls">
            <div className="embla__buttons flex gap-2">
              <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
              />
              <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
              />
            </div>
          </div>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div
            className="flex w-full touch-pan-y gap-4"
            style={{
              height: "min(40vw, 15rem)",
            }}
          >
            {cars.map((car, index) => (
              <RecomendationItem car={car} key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Recomendation;

const RecomendationItem = ({ car }: { car: CarResponse }) => {
  const slide = car.images?.[0]?.path;
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/inventory/${car._id}`)}
      className="mx-1 flex aspect-video h-full cursor-pointer flex-col space-y-2"
    >
      <div className="img-preview relative h-full overflow-hidden rounded">
        <img
          src={`/${slide}`}
          alt="japan1"
          className="aspect-video h-full w-full object-cover"
          loading="lazy"
          fetchPriority="low"
        />

        <span className="absolute bottom-0 right-0 transform bg-[#1D4ED8] px-3 py-2 text-xs font-semibold text-white">
          Price: {car.price || "N/A"}
        </span>
      </div>
      <h3 className="text-xs font-semibold">{car.title}</h3>
    </div>
  );
};
