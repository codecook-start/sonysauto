"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DollarSign, ShipWheel } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const OfferPrice = ({ carName }: { carName?: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 py-6 text-xs" variant={"outline"}>
          <DollarSign size={"1em"} />
          <span>Make an Offer Price</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center gap-2">
          <ShipWheel size={"2em"} />
          <div className="!m-0 flex flex-col justify-center">
            <DialogTitle className="uppercase">
              Schedule a test drive
            </DialogTitle>
            {carName && <DialogDescription>{carName}</DialogDescription>}
          </div>
        </DialogHeader>
        <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
          <div className="form-group space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              className="input"
            />
          </div>
          <div className="form-group space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="input"
            />
          </div>
          <div className="form-group space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Enter your phone number"
              className="input"
            />
          </div>
          <div className="form-group space-y-2">
            <Label htmlFor="best-time">Trade price</Label>
            <Input
              type="text"
              name="best-time"
              id="best-time"
              placeholder="Enter your best time"
              className="input"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Request</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OfferPrice;
