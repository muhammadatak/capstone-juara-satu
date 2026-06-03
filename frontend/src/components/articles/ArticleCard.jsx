import { Link } from 'react-router-dom'

export default function ArticleCard({ article, to, onClick, featured = false }) {
  const hasCoverImage = Boolean(article.coverImage)
  const coverSrc = article?.coverImage && article.coverImage.startsWith('assets/')
    ? new URL('../../assets/article/phissing.jpg', import.meta.url).href
    : article?.coverImage

  const content = (
    <>
      <div className={`relative shrink-0 ${featured ? 'h-[280px]' : 'h-[190px]'} overflow-hidden bg-gradient-to-br ${article.coverClass}`}>
        {hasCoverImage ? (
          <>
            <img src={coverSrc} alt={article.judul} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.16),transparent_28%)]" />
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/15 blur-2xl" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
          </>
        )}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e82c57] shadow-sm">
          {article.kategori}
        </div>
      </div>

      <div className="flex flex-1 flex-col border-t border-gray-100 p-4 md:p-5">
        <h3 className={`font-bold leading-tight text-gray-900 transition-colors group-hover:text-[#e82c57] ${featured ? 'text-xl' : 'text-[17px]'}`}>
          {article.judul}
        </h3>
        <p className={`mt-3 text-sm leading-relaxed text-gray-500 ${featured ? 'line-clamp-3' : 'line-clamp-4'}`}>{article.ringkasan}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>{article.tanggal}</span>
            <span>·</span>
            <span>{article.bacaan}</span>
          </div>
          <span className="font-semibold text-[#e82c57] transition group-hover:translate-x-0.5">Read more</span>
        </div>
      </div>
    </>
  )

  if (to) {
    return (
      <Link
        to={to}
        className={`group flex h-full w-full flex-col overflow-hidden border bg-white text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)] ${featured ? 'shadow-sm' : ''}`}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      onClick={() => onClick?.(article)}
      className={`group flex h-full w-full flex-col overflow-hidden border bg-white text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)] ${featured ? 'shadow-sm' : ''}`}
    >
      {content}
    </button>
  )
}