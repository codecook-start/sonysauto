import { useCars } from "@/hooks/useCars";
import { cn } from "@/lib/utils";
import { useState } from "react";

const CarPagination = () => {
  const { pagination, setPage, cars } = useCars();
  const { page, totalPages, totalItems, limit } = pagination;
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (newPage: number) => {
	  if (newPage === page || loading) return;
	  setLoading(true);
	  await setPage(newPage);
	  setLoading(false);
	};

  const getPageRange = () => {
    const visiblePages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) visiblePages.push(1);
    if (start > 2) visiblePages.push('...');

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    if (end < totalPages - 1) visiblePages.push('...');
    if (end < totalPages) visiblePages.push(totalPages);

    return visiblePages;
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 py-4">
      <div className="text-sm font-medium text-gray-600">
        Showing {(page - 1) * limit + 1}-{Math.min(page * limit, totalItems)} of {totalItems} cars
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1 || loading}
          className={cn(
            "rounded px-3 py-1 text-sm",
            page <= 1 || loading ? "text-gray-400" : "hover:bg-gray-100"
          )}
        >
          Prev
        </button>

        {getPageRange().map((pageNum, i) => (
          pageNum === '...' ? (
            <span key={i} className="px-1">...</span>
          ) : (
            <button
              key={i}
              onClick={() => handlePageChange(Number(pageNum))}
              disabled={loading}
              className={cn(
                "rounded px-3 py-1 text-sm",
                page === pageNum 
                  ? "bg-blue-500 text-white" 
                  : "hover:bg-gray-100"
              )}
            >
              {pageNum}
            </button>
          )
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages || loading}
          className={cn(
            "rounded px-3 py-1 text-sm",
            page >= totalPages || loading ? "text-gray-400" : "hover:bg-gray-100"
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CarPagination;