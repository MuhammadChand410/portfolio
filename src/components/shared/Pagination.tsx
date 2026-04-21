"use client";

export type PaginationMeta = {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
};

export default function Pagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  if (meta.total_pages <= 1) return null;

  const pages = Array.from({ length: meta.total_pages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(meta.page - 1)}
        disabled={!meta.has_previous}
        className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ‹ Prev
      </button>
      {pages.map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
            n === meta.page
              ? "bg-violet-600 border-violet-600 text-white"
              : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => onPageChange(meta.page + 1)}
        disabled={!meta.has_next}
        className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next ›
      </button>
    </div>
  );
}
