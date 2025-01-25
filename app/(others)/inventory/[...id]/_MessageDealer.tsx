import OfferPrice from "@/components/dialog/OfferPrice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { dealer } from "@/data";
import { carAtom } from "@/jotai/carAtom";
import { useAtomValue } from "jotai";
import { Car, MessageCircle, Mail } from "lucide-react";
import React from "react";

const MessageDealer = () => {
  const car = useAtomValue(carAtom);
  return (
    <div className="bg-neutral-100 py-8">
      <div className="container-md-mx">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-2">
            {/* chat via whatsapp */}
            <a href={`https://wa.me/${dealer.phone}`}>
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
                <span
                  className="flex-1 text-center"
                  style={{ fontSize: "16px" }}
                >
                  Chat via WhatsApp
                </span>
              </Button>
            </a>
            {/* sms */}
            <a href={`sms:${dealer.phone}`}>
              <Button
                className="mt-2 flex w-full items-center rounded border-2 p-0 text-xs shadow hover:text-red-500"
                variant="outline"
                size={"lg"}
                data-aos="flip-left"
              >
                <div className="m-0 flex h-full w-[50px] items-center justify-center bg-violet-500">
                  <Mail size="2.5em" color="white" />
                </div>
                <span
                  className="flex-1 text-center"
                  style={{ fontSize: "16px" }}
                >
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
            <OfferPrice carName={car?.title} />
          </div>
          <div className="form space-y-4 md:col-span-3">
            <Label htmlFor="message" className="text-lg font-bold">
              Message to Dealer
            </Label>
            <textarea
              id="message"
              placeholder="Your message"
              className="mt-4 w-full rounded border p-4"
            ></textarea>
            <div className="grid grid-cols-3 gap-4">
              <div className="form-group flex flex-col gap-2">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Name*
                </Label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="rounded border p-4 text-sm"
                />
              </div>
              <div className="form-group flex flex-col gap-2">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Email*
                </Label>
                <input
                  type="email"
                  placeholder="Your email"
                  className="rounded border p-4 text-sm"
                />
              </div>
              <div className="form-group flex flex-col gap-2">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Phone*
                </Label>
                <input
                  type="tel"
                  placeholder="Your phone"
                  className="rounded border p-4 text-sm"
                />
              </div>
            </div>
            <Button className="w-full rounded py-6 text-xs">
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDealer;
