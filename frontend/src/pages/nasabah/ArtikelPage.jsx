import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import ArticleCard from '../../components/articles/ArticleCard'
import ArticleSearchBar from '../../components/articles/ArticleSearchBar'
import { ARTIKEL_DATA, KATEGORI_LIST } from '../../data/artikelData'

export default function ArtikelPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [query, setQuery] = useState('')

  const filteredArticles = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase()

    return ARTIKEL_DATA.filter((article) => {
      const matchCategory = activeCategory === 'Semua' || article.kategori === activeCategory
      const matchQuery = !lowerQuery || article.judul.toLowerCase().includes(lowerQuery) || article.ringkasan.toLowerCase().includes(lowerQuery)
      return matchCategory && matchQuery
    })
  }, [activeCategory, query])

  const handleOpenArticle = (article) => {
    navigate(`/artikel/${article.slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const featuredArticle = filteredArticles[0]
  const regularArticles = activeCategory === 'Semua' && !query ? filteredArticles.slice(1) : filteredArticles

  return (
    <div className="min-h-screen  bg-[#900014] text-white flex flex-col">
      <Navbar />

      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#ffffff] shadow-sm">
            Latest News & Article
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">Artikel Keamanan Digital</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white md:text-base">
            Panduan singkat, tips praktis, dan artikel edukasi untuk mengenali phishing, melindungi akun, dan membangun kebiasaan aman.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <ArticleSearchBar
          query={query}
          onQueryChange={setQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categories={KATEGORI_LIST}
          resultCount={filteredArticles.length}
        />

        {activeCategory === 'Semua' && !query && featuredArticle && (
          <section className="my-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white">Featured</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-white md:text-3xl">Artikel unggulan untuk dibaca dulu</h2>
              </div>
              <button className="hidden rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-white  md:inline-flex">View all</button>
            </div>
            <ArticleCard article={featuredArticle} to={`/artikel/${featuredArticle.slug}`} featured />
          </section>
        )}

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-white md:text-3xl">Semua artikel</h2>
            </div>
            <p className="text-xs text-white">{filteredArticles.length} artikel ditemukan</p>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
              <div className="text-4xl">📭</div>
              <p className="mt-4 text-sm text-white">Tidak ada artikel yang cocok dengan filter saat ini.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {regularArticles.map((article) => (
                <ArticleCard key={article.id} article={article} to={`/artikel/${article.slug}`} />
              ))}
            </div>
          )}
        </section>

        <div className="mt-10 flex justify-center">
          <button className="rounded-full bg-[#e82c57] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-[#c82148]">
            Load more
          </button>
        </div>

        <section className="mt-12 rounded-3xl bg-[#111827] px-6 py-8 text-white shadow-sm md:px-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Contribute</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">Ada pengalaman phishing yang ingin dibagikan?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                Laporan Anda membantu kami memperkaya edukasi dan memberi konteks nyata untuk artikel keamanan berikutnya.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}