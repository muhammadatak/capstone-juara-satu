export default function ArticleSearchBar({
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
  categories,
  resultCount,
}) {
  return (
    <div className="space-y-4">

      {/* Search input */}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari artikel, topik, atau kata kunci..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm text- placeholder-gray-400 shadow-sm outline-none transition focus:border-[#e82c57] focus:ring-2 focus:ring-[#e82c57]/15"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            className="absolute inset-y-0 right-3 flex items-center text-white transition hover:text-white"
            aria-label="Hapus pencarian"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Category filter + result count */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'border-[#e82c57] bg-[#e82c57] text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-[#e82c57] hover:text-[#e82c57]'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        <p className="flex-shrink-0 text-xs text-white">
          <span className="font-semibold text-white">{resultCount}</span> artikel ditemukan
        </p>
      </div>
    </div>
  )
}