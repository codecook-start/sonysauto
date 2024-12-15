import { Button } from "@/components/ui/button";
import { useCars } from "@/hooks/useCars";
import { useFilter } from "@/hooks/useFilter";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useAtom } from "jotai";
import { X } from "lucide-react";
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const ResultFilter = () => {
  const { refetch } = useCars();
  const { resetAll } = useFilter();
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const handleFilterChange = async (name: string, values: string[]) => {
    setPagination((prev) => {
      const details = prev.details;
      const index = details.findIndex((detail) => detail.name === name);
      if (index === -1) {
        details.push({ name, values });
      } else {
        details[index].values = values;
      }
      return { ...prev, details };
    });
    await refetch();
  };

  const isFilterActive = pagination.details.some(
    (detail) => detail.values.length > 0,
  );

  return (
    <div className="results space-x-1">
      {/* show all the filters */}
      <div className="filters mt-2 flex gap-2">
        {isFilterActive && (
          <Button onClick={resetAll} className="rounded-full text-xs">
            Clear All
          </Button>
        )}
        <ScrollArea>
          <div className="flex h-full gap-2">
            {pagination.details.map((detail, i) =>
              detail.values.map((value, j) => (
                <div
                  key={`${i}-${j}`}
                  className="flex items-center rounded-full bg-gray-200 px-4 py-2"
                >
                  <span className="text-xs capitalize">{detail.name}:</span>
                  <span className="ml-1 text-xs">{value}</span>
                  <X
                    onClick={() =>
                      handleFilterChange(detail.name, [
                        ...detail.values.filter((v) => v !== value),
                      ])
                    }
                    className="ml-1.5 cursor-pointer"
                    size={"1em"}
                  />
                </div>
              )),
            )}
          </div>
          <ScrollBar orientation="horizontal" className="opacity-80" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default ResultFilter;
