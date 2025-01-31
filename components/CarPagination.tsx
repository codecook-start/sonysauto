import { useCars } from "@/hooks/useCars";
import { cn } from "@/lib/utils";
import { useState } from "react";

const CarPagination = () => {
  const { pagination, loadNext, cars } = useCars();
  const { page, totalPages, totalItems } = pagination;
  console.log({ pagination });

  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    if (page < totalPages && !loading) {
      setLoading(true);

      await loadNext();
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="text-sm font-medium text-gray-600">
        Showing {cars.length} cars of {totalItems} total
      </div>
      {/* Show More Button */}
      <button
        onClick={handleLoadMore}
        disabled={page >= totalPages || loading}
        className={cn(
          "mt-4 rounded px-6 py-2 text-white transition-all",
          page >= totalPages || loading
            ? "cursor-not-allowed bg-gray-300"
            : "bg-blue-500 hover:bg-blue-600",
        )}
      >
        {loading
          ? "Loading..."
          : page >= totalPages
            ? "No More Cars"
            : "Show More"}
      </button>
    </div>
  );
};

export default CarPagination;
