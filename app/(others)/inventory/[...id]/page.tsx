"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, Clock, MessageCircle, Printer } from "react-feather";
import CarouselContainer from "@/components/CarouselContainer";
import { Button } from "@/components/ui/button";
import { Car, Mail, Pencil, Trash2 } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import CarInsights from "./_CarInsights";
import CarSummary from "./_CarSummary";
import CarFeatures from "./_CarFeatures";
import CarOverview from "./_CarOverview";
import MessageDealer from "./_MessageDealer";
import Recomendation from "./_Recomendation";
import CarHighlights from "./_CarHighlights";
import { useCar } from "@/hooks/useCar";
import ScheduleTestDrive from "@/components/dialog/ScheduleTestDrive";
import OfferPrice from "@/components/dialog/OfferPrice";
import Loader from "@/components/Loader";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { dealer } from "@/data";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

const Inventory = ({ params: { id } }: { params: { id: string } }) => {
  useEffect(() => {
    AOS.init({
      duration: 600, // Animation duration (0.6 seconds)
      delay: 100, // Initial delay for the first item
      once: true, // Trigger animation only once
      easing: "ease-out", // Easing function
      offset: 200, // Trigger when the element is 200px away from the viewport
    });
  }, []);
  const {
    car,
    isLoading,
    isError,
    deleteCar: { mutate: deleteCar, isLoading: isDeleting },
  } = useCar(id);
  const slides = (car?.images || []).map((image) => image.path);
  const [lightboxVisible, setLightboxVisible] = useState(-1);
  const { isAuthenticated } = useAuth();
  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div
        className="flex h-96 items-center justify-center"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        Error fetching car data
      </div>
    );

  return (
    <div className="my-8 space-y-8">
      {isAuthenticated && (
        <div
          className="fixed bottom-2 right-2 z-10 flex gap-2"
          data-aos="fade-up"
        >
          <Link
            shallow
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="rounded-full bg-white p-2 text-black hover:shadow-md"
            href={`/dashboard/${id}/`}
          >
            <Pencil size={"1em"} color="black" />
          </Link>
          <button
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              deleteCar();
            }}
            className="rounded-full bg-white p-2 text-black hover:shadow-md disabled:animate-pulse disabled:cursor-not-allowed disabled:bg-white/75"
          >
            {!isDeleting ? <Trash2 size={"1em"} color="red" /> : <Loader />}
          </button>
        </div>
      )}
      <Breadcrumb className="container-md-mx" data-aos="fade-down">
        <BreadcrumbList className="border-b py-4 text-xs text-neutral-800">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Sony{"'"}s Auto</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Listings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>2023</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{car?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="container-md-mx" data-aos="fade-right">
        {/* previous */}
        <button className="flex items-center space-x-4 rounded border p-4 text-xs">
          <ArrowLeft size={"1em"} />
          <div className="text-left font-semibold">
            <h3 className="text-blue-500">Previous</h3>
            <p>{car?.title}</p>
          </div>
        </button>
      </div>
      <div className="container-md-mx grid gap-y-4 text-xs md:grid-cols-10 md:gap-8">
        <div
          className="space-y-6 overflow-hidden md:col-span-7"
          data-aos="fade-up"
        >
          <div className="header">
            {/* car name */}
            <h2 className="text-2xl font-bold">{car?.title}</h2>
            {/* added in */}
            <div className="flex items-center gap-2">
              <Clock size={"1em"} />
              <span>
                Added:{" "}
                {new Date(car?.createdAt || Date.now()).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </span>
            </div>
          </div>
          {/* image slider */}
          <CarouselContainer
            classNameContainer="h-auto"
            options={{
              loop: true,
              isDotButton: true,
            }}
          >
            {slides.map((slide, index) => (
              <img
                key={index}
                className="aspect-video w-full cursor-pointer object-cover"
                src={`/${slide}`}
                alt={`japan${index + 1}`}
                onClick={() => setLightboxVisible(index)}
                loading="lazy"
                fetchPriority="low"
                data-aos="zoom-in"
              />
            ))}
          </CarouselContainer>

          {/* call to action buttons */}
          <div className="flex items-center justify-between gap-3">
            <ScheduleTestDrive carName={car?.title} />
            <Button
              onClick={() => window.print()}
              className="flex-1 gap-2 rounded py-6 text-xs"
            >
              <Printer size={"1em"} />
              <span>Print page</span>
            </Button>
          </div>
        </div>
        <div className="space-y-4 md:col-span-3">
          {/* price */}
          <div
            className="price rounded bg-blue-500 py-3 text-center text-white"
            data-aos="flip-left"
          >
            <h3 className="text-2xl font-bold">{car?.price || "0.00"}</h3>
          </div>
          {/* chat via whatsapp */}
          <a
            href={`https://wa.me/${dealer.phone}`}
            className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background text-xs font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            data-aos="flip-left"
          >
            <Button
              className="m-0 flex w-full items-center rounded border-2 p-0 text-xs shadow hover:text-red-500"
              variant="outline"
              size={"lg"}
              data-aos="flip-left"
            >
              <div className="m-0 flex h-full w-[50px] items-center justify-center bg-green-500">
                <MessageCircle size="2.5em" color="white" />
              </div>
              {/* Text Section - Takes Remaining Space */}
              <span className="flex-1 text-center" style={{ fontSize: "16px" }}>
                Chat via WhatsApp
              </span>
            </Button>
          </a>
          {/* sms */}
          <a
            href={`sms:${dealer.phone}`}
            className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background text-xs font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            data-aos="flip-left"
          >
            <Button
              className="m-0 flex w-full items-center rounded border-2 p-0 text-xs shadow hover:text-red-500"
              variant="outline"
              size={"lg"}
              data-aos="flip-left"
            >
              <div className="m-0 flex h-full w-[50px] items-center justify-center bg-violet-500">
                <Mail size="2.5em" color="white" />
              </div>
              <span className="flex-1 text-center" style={{ fontSize: "16px" }}>
                Contact Seller Via Email
              </span>
            </Button>
          </a>
          {/* Trade in Form */}
          <Button
            className="m-0 flex w-full items-center rounded border-2 p-0 text-xs shadow hover:text-red-500"
            variant="outline"
            size={"lg"}
            data-aos="flip-left"
          >
            <div className="m-0 flex h-full w-[50px] items-center justify-center bg-yellow-500">
              <Car size="2.5em" color="white" />
            </div>
            <span className="flex-1 text-center" style={{ fontSize: "16px" }}>
              Trade in Form
            </span>
          </Button>
          {/* offer price */}
          <div data-aos="flip-left">
            <OfferPrice carName={car?.title} />
          </div>
          {/* youtube iframe */}
          <div data-aos="flip-left">
            <iframe
              className="aspect-video w-full rounded shadow"
              src="https://www.youtube.com/embed/cUUH5fFXte4?si=ej5G8Aq6zXKVDD6J"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        </div>
      </div>
      {/* insights */}
      <div data-aos="fade-up">
        <CarInsights />
      </div>
      {/* car summary */}
      <div data-aos="fade-up">
        <CarSummary />
      </div>
      {/* car highlights */}
      <div data-aos="fade-up">
        <CarHighlights />
      </div>
      {/* car features */}
      <div data-aos="fade-up">
        <CarFeatures />
      </div>
      {/* car overview */}
      <div data-aos="fade-up">
        <CarOverview />
      </div>
      {/* message to dealer */}
      <div data-aos="fade-up">
        <MessageDealer />
      </div>
      {/* recomendation */}
      <div data-aos="fade-up">
        <Recomendation />
      </div>
      <div data-aos="fade-up">
        <Lightbox
          images={slides}
          visible={lightboxVisible !== -1}
          onClose={() => setLightboxVisible(-1)}
        />
      </div>
    </div>
  );
};

export default Inventory;
