/* eslint-disable @next/next/no-img-element */
"use client";

import React, { HTMLAttributes, useCallback, useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

type PropType = {
  options?: EmblaOptionsType & {
    isDotButton?: boolean;
  };
  className?: HTMLAttributes<HTMLDivElement>["className"];
  classNameContainer?: HTMLAttributes<HTMLDivElement>["className"];
  style?: HTMLAttributes<HTMLDivElement>["style"];
  children: React.ReactNode;
};

const CarouselContainer: React.FC<PropType> = (props) => {
  const { options, children, className, classNameContainer } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [thumbnailRef, thumbnailApi] = useEmblaCarousel(
    {
      containScroll: "keepSnaps",
      dragFree: true,
    },
    [Autoplay()],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi || !thumbnailApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    thumbnailApi.scrollTo(emblaApi.selectedScrollSnap());
  }, [emblaApi, thumbnailApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();

    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const onThumbnailClick = useCallback(
    (index: number) => {
      if (!emblaApi || !thumbnailApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi, thumbnailApi],
  );

  return (
    <section
      className={cn("relative flex h-full flex-col", classNameContainer)}
    >
      <div
        className={cn("flex-1 overflow-hidden", className)}
        style={props.style}
        ref={emblaRef}
      >
        <div className="flex h-full touch-pan-y">{children}</div>
      </div>
      {options?.isDotButton && (
        <div
          className={cn("flex-1 overflow-hidden", className)}
          ref={thumbnailRef}
        >
          <div className="flex touch-pan-y">
            {React.Children.toArray(children).map((child, index) => (
              <button
                key={index}
                onClick={() => onThumbnailClick(index)}
                className={cn(
                  "aspect-video h-16 flex-shrink-0 border-2 border-white",
                  index === selectedIndex && "border-blue-500",
                )}
              >
                {child}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CarouselContainer;
