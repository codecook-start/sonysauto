/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useCallback } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "@/components/EmblaCarouselArrowButtons";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCarouselData } from "@/hooks/useCarouselData";

type PropType = {
  options?: EmblaOptionsType;
};

const HomeCarousel: React.FC<PropType> = (props) => {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);
  const { carouselData } = useCarouselData("Landing Page Carousel");
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

  return (
    <section className="relative h-screen">
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {(
            carouselData || [
              "/1.jpg",
              "/2.jpg",
              "/3.jpg",
              "/4.jpg",
              "/1.jpg",
              "/2.jpg",
              "/3.jpg",
              "/4.jpg",
              "/1.jpg",
              "/2.jpg",
              "/3.jpg",
              "/4.jpg",
            ]
          ).map((slide, index) => (
            <div className="relative h-full w-full flex-shrink-0" key={index}>
              <img
                src={slide}
                alt={"slide"}
                className="h-full w-full object-cover brightness-[50%]"
                loading="lazy"
                fetchPriority="low"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <PrevButton
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
          className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-500 p-2 text-white transition hover:bg-gray-600 disabled:opacity-50"
        />
        <NextButton
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-500 p-2 text-white transition hover:bg-gray-600 disabled:opacity-50"
        />
      </div>
    </section>
  );
};

export default HomeCarousel;
