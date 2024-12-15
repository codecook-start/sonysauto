import OfferPrice from "@/components/dialog/OfferPrice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { carAtom } from "@/jotai/carAtom";
import { useAtomValue } from "jotai";
import { Car, MessageCircle } from "lucide-react";
import React from "react";

const MessageDealer = () => {
  const car = useAtomValue(carAtom);
  return (
    <div className="bg-neutral-100 py-8">
      <div className="container-md-mx">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-2">
            {/* chat via whatsapp */}
            <Button
              className="w-full gap-2 rounded border-2 py-6 text-xs shadow"
              variant={"outline"}
            >
              <MessageCircle size={"1em"} />
              <span>Chat via WhatsApp</span>
            </Button>
            {/* sms */}
            <Button
              className="w-full gap-2 rounded border-2 py-6 text-xs shadow"
              variant={"outline"}
            >
              <MessageCircle size={"1em"} />
              <span>Message Us</span>
            </Button>
            {/* Trade in Form */}
            <Button
              className="w-full gap-2 rounded border-2 py-6 text-xs shadow"
              variant={"outline"}
            >
              <Car size={"1em"} />
              <span>Trade in Form</span>
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
