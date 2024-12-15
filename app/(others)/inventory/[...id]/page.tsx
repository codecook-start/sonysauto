"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
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
import { Car, Pencil, Trash2 } from "lucide-react";
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

const Inventory = ({ params: { id } }: { params: { id: string } }) => {
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
        <div className="fixed bottom-2 right-2 z-10 flex gap-2">
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
      <Breadcrumb className="container-md-mx">
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
      <div className="container-md-mx">
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
        <div className="space-y-6 overflow-hidden md:col-span-7">
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
          <div className="price rounded bg-blue-500 py-3 text-center text-white">
            <h3 className="text-2xl font-bold">{car?.price || "0.00"}</h3>
          </div>
          {/* chat via whatsapp */}
          <Button
            className="w-full gap-2 rounded border-2 py-6 text-xs shadow hover:bg-blue-500 hover:text-white"
            variant={"outline"}
          >
            <MessageCircle size={"1em"} />
            <span>Chat via WhatsApp</span>
          </Button>
          {/* sms */}
          <Button
            className="w-full gap-2 rounded border-2 py-6 text-xs shadow hover:bg-blue-500 hover:text-white"
            variant={"outline"}
          >
            <MessageCircle size={"1em"} />
            <span>Message Us</span>
          </Button>
          {/* Trade in Form */}
          <Button
            className="w-full gap-2 rounded border-2 py-6 text-xs shadow hover:bg-blue-500 hover:text-white"
            variant={"outline"}
          >
            <Car size={"1em"} />
            <span>Trade in Form</span>
          </Button>
          {/* offer price */}
          <OfferPrice carName={car?.title} />
          {/* youtube iframe */}
          <iframe
            className="aspect-video w-full rounded shadow"
            src="https://www.youtube.com/embed/cUUH5fFXte4?si=ej5G8Aq6zXKVDD6J"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      </div>
      {/* insights */}
      <CarInsights />
      {/* car summary */}
      <CarSummary />
      {/* car highlights */}
      <CarHighlights />
      {/* car features */}
      <CarFeatures />
      {/* car overview */}
      <CarOverview />
      {/* message to dealer */}
      <MessageDealer />
      {/* recomendation */}
      <Recomendation />
      <Lightbox
        images={slides}
        visible={lightboxVisible !== -1}
        onClose={() => setLightboxVisible(-1)}
      />
    </div>
  );
};

export default Inventory;
