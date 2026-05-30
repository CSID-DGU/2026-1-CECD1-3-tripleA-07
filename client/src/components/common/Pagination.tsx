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
  return (
    <nav className="flex justify-center items-center gap-1 pt-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="h-8 px-3 rounded-lg bg-gray-200 text-gray-700 text-sm disabled:opacity-50 hover:bg-gray-300 transition-colors flex items-center justify-center"
      >
        이전
      </button>

      {getPaginationItems(currentPage, totalPages).map((p, i) => {
        if (p === -1) return <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition-all ${
              p === currentPage
                ? "bg-[#7e62ca] border-[#7e62ca] text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:border-[#7e62ca]"
            }`}
          >
            {p + 1}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1 || totalPages === 0}
        className="h-8 px-3 rounded-lg bg-gray-200 text-gray-700 text-sm disabled:opacity-50 hover:bg-gray-300 transition-colors flex items-center justify-center"
      >
        다음
      </button>
    </nav>
  );
}
