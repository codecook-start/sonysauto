import { useCars } from "@/hooks/useCars";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";
import { cn } from "@/lib/utils";

const CarPagination = () => {
  const { pagination, loadNext, loadPrev, setPage } = useCars();
  const { page, totalPages } = pagination;

  const generatePageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, "ellipsis", totalPages];
    }

    if (page >= totalPages - 2) {
      return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages];
  };

  const pageNumbers = generatePageNumbers();

  return (
    <Pagination className="w-full">
      <PaginationContent className="flex flex-col items-center gap-3">
        <div className="text-sm font-medium text-gray-600">
          Page {page} of {totalPages}
        </div>

        <div className="flex items-center justify-center gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={page > 1 ? loadPrev : undefined}
              className={cn(
                "rounded px-4 py-2 transition-all",
                page === 1
                  ? "cursor-not-allowed bg-gray-200 text-gray-400"
                  : "cursor-pointer bg-blue-500 text-white hover:bg-blue-600",
              )}
            />
          </PaginationItem>

          {pageNumbers.map((pageNum, index) =>
            pageNum === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => setPage(+pageNum)}
                  className={cn(
                    "rounded px-4 py-2 transition-all",
                    pageNum === page
                      ? "cursor-not-allowed bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white",
                  )}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              onClick={page < totalPages ? loadNext : undefined}
              className={cn(
                "rounded px-4 py-2 transition-all",
                page === totalPages
                  ? "cursor-not-allowed bg-gray-200 text-gray-400"
                  : "cursor-pointer bg-blue-500 text-white hover:bg-blue-600",
              )}
            />
          </PaginationItem>
        </div>
      </PaginationContent>
    </Pagination>
  );
};

export default CarPagination;
