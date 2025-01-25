/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

type Image = string;

type LightboxProps = {
  images: Image[];
  visible: boolean;
  onClose: () => void;
};

const Lightbox: React.FC<LightboxProps> = ({ images, visible, onClose }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="h-screen max-h-[100vh] w-screen max-w-[100vw] items-center justify-center rounded-none border-none bg-black/10"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "min(60rem, calc(100vw - 2rem))",
            maxHeight: "min(50rem, calc(100vh - 2rem))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="relative col-span-3 overflow-hidden rounded">
            <div className="embla__button">
              <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2">
                <PrevButton
                  onClick={onPrevButtonClick}
                  disabled={prevBtnDisabled}
                />
              </div>
              <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                <NextButton
                  onClick={onNextButtonClick}
                  disabled={nextBtnDisabled}
                />
              </div>
            </div>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex touch-pan-y">
                {images.map((slide, index) => (
                  <img
                    src={`${window.location.origin}/${slide}`}
                    alt=""
                    key={index}
                    className="mx-1 w-full rounded object-cover object-center"
                    style={{
                      maxWidth: "min(60rem, calc(100vw - 2rem))",
                      maxHeight: "min(50rem, calc(100vh - 2rem))",
                    }}
                    loading="lazy"
                    fetchPriority="low"
                  />
                ))}
              </div>
            </div>
            {/* thumbnail */}
            <div className="overflow-hidden" ref={thumbnailRef}>
              <div className="flex touch-pan-y">
                {images.map((child, index) => (
                  <button
                    key={index}
                    onClick={() => onThumbnailClick(index)}
                    className={cn(
                      "aspect-video h-16 flex-shrink-0 overflow-hidden rounded border-2 border-transparent",
                      index === selectedIndex && "border-blue-500",
                    )}
                  >
                    <img
                      src={`${window.location.origin}/${child}`}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                      fetchPriority="low"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogClose className="absolute right-4 top-4 rounded-full bg-white/75 p-2 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default Lightbox;
