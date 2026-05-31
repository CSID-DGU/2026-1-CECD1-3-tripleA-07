import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getPaginationItems = (current: number, total: number) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i);
  }
  if (current < 3) {
    return [0, 1, 2, 3, 4, -1, total - 1];
  }
  if (current > total - 4) {
    return [0, -1, total - 5, total - 4, total - 3, total - 2, total - 1];
  }
  return [0, -1, current - 1, current, current + 1, -1, total - 1];
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages === 0) return null;

  return (
    <nav className="flex justify-center items-center gap-1 pt-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="h-9 w-9 rounded-lg text-foreground/64 disabled:opacity-20 hover:bg-info transition-colors flex items-center justify-center"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex justify-center p-1 border border-border gap-1 rounded-lg">
        {getPaginationItems(currentPage, totalPages).map((p, i) => {
          if (p === -1) return <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 flex items-center justify-center rounded-md text-sm font-regular transition-all ${
                p === currentPage
                  ? "bg-primary text-surface"
                  : "text-foreground hover:bg-info"
              }`}
            >
              {p + 1}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1 || totalPages === 0}
        className="h-9 w-9 rounded-lg text-foreground/64 disabled:opacity-20 hover:bg-info transition-colors flex items-center justify-center"
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
}
