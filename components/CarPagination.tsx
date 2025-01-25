import { useCars } from "@/hooks/useCars";
import { cn } from "@/lib/utils";
import { useState } from "react";

const CarPagination = () => {
  const { pagination, loadNext, setPagination, cars } = useCars();
  const { page, totalPages, totalItems } = pagination;
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    if (page < totalPages && !loading) {
      setLoading(true);
      // Increase the limit to load 100 more cars
      setPagination((prev) => ({
        ...prev,
        limit: prev.limit + 100, // Increase limit by 100
      }));
      // Load the next set of cars based on the updated limit
      await loadNext();
      setLoading(false);
    }
  };

  return (
    // <Pagination className="w-full">
    //   <PaginationContent className="flex flex-col items-center gap-3">
    //     <div className="text-sm font-medium text-gray-600">
    //       Page {page} of {totalPages}
    //     </div>

    //     <div className="flex items-center justify-center gap-2">
    //       <PaginationItem>
    //         <PaginationPrevious
    //           onClick={page > 1 ? loadPrev : undefined}
    //           className={cn(
    //             "rounded px-4 py-2 transition-all",
    //             page === 1
    //               ? "cursor-not-allowed bg-gray-200 text-gray-400"
    //               : "cursor-pointer bg-blue-500 text-white hover:bg-blue-600",
    //           )}
    //         />
    //       </PaginationItem>

    //       {pageNumbers.map((pageNum, index) =>
    //         pageNum === "ellipsis" ? (
    //           <PaginationItem key={`ellipsis-${index}`}>
    //             <PaginationEllipsis />
    //           </PaginationItem>
    //         ) : (
    //           <PaginationItem key={pageNum}>
    //             <PaginationLink
    //               onClick={() => setPage(+pageNum)}
    //               className={cn(
    //                 "rounded px-4 py-2 transition-all",
    //                 pageNum === page
    //                   ? "cursor-not-allowed bg-blue-600 text-white"
    //                   : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white",
    //               )}
    //             >
    //               {pageNum}
    //             </PaginationLink>
    //           </PaginationItem>
    //         ),
    //       )}

    //       <PaginationItem>
    //         <PaginationNext
    //           onClick={page < totalPages ? loadNext : undefined}
    //           className={cn(
    //             "rounded px-4 py-2 transition-all",
    //             page === totalPages
    //               ? "cursor-not-allowed bg-gray-200 text-gray-400"
    //               : "cursor-pointer bg-blue-500 text-white hover:bg-blue-600",
    //           )}
    //         />
    //       </PaginationItem>
    //     </div>
    //   </PaginationContent>
    // </Pagination>

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
