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
  const { carouselData, isLoading } = useCarouselData("Landing Page Carousel");
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

  if (isLoading)
    return (
      <div
        className="flex h-96 items-center justify-center"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="5em"
          height="5em"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="0" fill="currentColor">
            <animate
              id="svgSpinnersPulse30"
              fill="freeze"
              attributeName="r"
              begin="0;svgSpinnersPulse32.begin+0.4s"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              values="0;11"
            ></animate>
            <animate
              fill="freeze"
              attributeName="opacity"
              begin="0;svgSpinnersPulse32.begin+0.4s"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              values="1;0"
            ></animate>
          </circle>
          <circle cx="12" cy="12" r="0" fill="currentColor">
            <animate
              id="svgSpinnersPulse31"
              fill="freeze"
              attributeName="r"
              begin="svgSpinnersPulse30.begin+0.4s"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              values="0;11"
            ></animate>
            <animate
              fill="freeze"
              attributeName="opacity"
              begin="svgSpinnersPulse30.begin+0.4s"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              values="1;0"
            ></animate>
          </circle>
          <circle cx="12" cy="12" r="0" fill="currentColor">
            <animate
              id="svgSpinnersPulse32"
              fill="freeze"
              attributeName="r"
              begin="svgSpinnersPulse30.begin+0.8s"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              values="0;11"
            ></animate>
            <animate
              fill="freeze"
              attributeName="opacity"
              begin="svgSpinnersPulse30.begin+0.8s"
              calcMode="spline"
              dur="1.2s"
              keySplines=".52,.6,.25,.99"
              values="1;0"
            ></animate>
          </circle>
        </svg>
      </div>
    );

  return (
    <section className="relative h-screen">
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {carouselData.map((slide, index) => (
            <div className="relative h-full w-full flex-shrink-0" key={index}>
              <img
                src={slide}
                alt={"slide"}
                className="h-full w-full object-cover brightness-[50%]"
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
