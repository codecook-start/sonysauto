"use client";

/* eslint-disable @next/next/no-img-element */

import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "@/components/EmblaCarouselArrowButtons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { slides } from "@/data";
import { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import React, { useCallback, useEffect } from "react";
import AOS from "aos"; // Import AOS JS
import "aos/dist/aos.css"; // Import AOS CSS

const About = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
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

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Animation occurs only once
    });
  }, []);
  return (
    <div>
      <div
        className="py-16"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/1.jpg)",
          backgroundSize: "cover",
        }}
        data-aos="fade-up"
      >
        <div className="container-md text-white">
          <h2 className="text-4xl font-bold">About Us</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut
            vestibulum enim.
          </p>
        </div>
      </div>
      {/* breadcrumb */}
      <Breadcrumb className="container-md" data-aos="fade-up">
        <BreadcrumbList className="border-b py-4 text-xs text-neutral-800">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Sony{"'"}s Auto</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">About Us</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* image, title, paragraph, alternate image from left to right, and vice versa */}
      <section
        className="container-md my-16 flex flex-col items-center gap-8 lg:flex-row"
        data-aos="fade-left"
      >
        <div className="lg:w-1/2">
          <img
            src="/1.jpg"
            alt="about us"
            className="w-full"
            loading="lazy"
            fetchPriority="low"
          />
        </div>
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="my-4 text-neutral-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut
            vestibulum enim. Morbi nec purus nec nisl fermentum vehicula. Nam ut
            vestibulum enim. Morbi nec purus nec nisl fermentum vehicula.
          </p>
        </div>
      </section>
      {/* image, title, paragraph, alternate image from left to right, and vice versa */}
      <section
        className="container-md my-16 flex flex-col items-center gap-8 lg:flex-row"
        data-aos="fade-right"
      >
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="my-4 text-neutral-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut
            vestibulum enim. Morbi nec purus nec nisl fermentum vehicula. Nam ut
            vestibulum enim. Morbi nec purus nec nisl fermentum vehicula.
          </p>
        </div>
        <div className="lg:w-1/2">
          <img
            src="/2.jpg"
            alt="about us"
            className="w-full"
            loading="lazy"
            fetchPriority="low"
          />
        </div>
      </section>
      {/* carousal */}
      <section className="bg-black py-32" data-aos="zoom-in">
        <div className="container-md space-y-8">
          <h3 className="text-4xl font-bold text-white">Gallery</h3>
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
                {slides.map((slide, index) => (
                  <img
                    src={slide}
                    alt=""
                    key={index}
                    className="mx-1 aspect-video h-full w-[80%] rounded object-cover"
                    loading="lazy"
                    fetchPriority="low"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* our team */}
      <section className="container-md my-16" data-aos="fade-up">
        <h3 className="text-4xl font-bold">Our Team</h3>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <img
              src="/1.jpg"
              alt="team member"
              className="rounded-xl object-cover"
              loading="lazy"
              fetchPriority="low"
            />
            <h4 className="mt-4 text-xl font-bold">John Doe</h4>
            <p className="text-neutral-600">CEO</p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/2.jpg"
              alt="team member"
              className="rounded-xl object-cover"
              loading="lazy"
              fetchPriority="low"
            />
            <h4 className="mt-4 text-xl font-bold">Jane Doe</h4>
            <p className="text-neutral-600">CFO</p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/3.jpg"
              alt="team member"
              className="rounded-xl object-cover"
              loading="lazy"
              fetchPriority="low"
            />
            <h4 className="mt-4 text-xl font-bold">John Doe</h4>
            <p className="text-neutral-600">CTO</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
