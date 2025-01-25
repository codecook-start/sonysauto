import { carAtom } from "@/jotai/carAtom";
import { SellerNote } from "@/types/car";
import { useAtomValue } from "jotai";
import React from "react";

const CarOverview = () => {
  const car = useAtomValue(carAtom);
  const sellerNotes = (car?.sellerNotes || []) as SellerNote[];
  if (!sellerNotes.length) return null;
  return (
    <div className="container-md-mx grid gap-4 md:grid-cols-4">
      <h3 className="font-[family-name:var(--font-harkshock)] text-4xl font-bold">
        Overview
      </h3>
      <div className="col-span-3 space-y-4">
        {sellerNotes.map((note, index) => (
          <p key={index} className="space-y-2 text-xs leading-normal">
            <span className="flex font-bold capitalize leading-snug underline">
              {note.note?.title || ""}
            </span>
            <div
              dangerouslySetInnerHTML={{
                __html: note.texts.map((text) => text.text).join(""),
              }}
            />
          </p>
        ))}
      </div>
    </div>
  );
};

export default CarOverview;
