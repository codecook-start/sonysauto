import { useCars } from "@/hooks/useCars";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useAtom } from "jotai";
import { X } from "lucide-react";

const ResultFilter = () => {
  const { refetch } = useCars();
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

  return (
    <div className="results mb-4 mt-4 space-x-1">
      {/* show all the filters */}
      <div className="filters mt-2 flex gap-2">
        <div className="filters mt-2 flex flex-wrap items-center gap-2">
          <div className="flex h-full flex-wrap gap-2">
            {pagination.details.map((detail, i) =>
              detail.values.map((value, j) => (
                <div
                  key={`${i}-${j}`}
                  className="flex items-center rounded-full bg-gray-200 px-2 py-1"
                >
                  {/* <span className="text-xs capitalize">{detail.name}:</span> */}
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
        </div>
      </div>
    </div>
  );
};

export default ResultFilter;
