import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import ArticleContentBlocks from '../../components/articles/ArticleContentBlocks'
import { ARTIKEL_DATA } from '../../data/artikelData'

export default function ArticleDetailPage() {
  const navigate = useNavigate()
  const { slug } = useParams()

  const article = useMemo(() => ARTIKEL_DATA.find((item) => item.slug === slug), [slug])

  const relatedArticles = useMemo(() => ARTIKEL_DATA.filter((item) => item.slug !== slug).slice(0, 3), [slug])

  const coverBg = article?.coverImage && article.coverImage.startsWith('assets/')
    ? new URL('../../assets/article/phissing.jpg', import.meta.url).href
    : article?.coverImage

  if (!article) {
    return (
      <div className="min-h-screen bg-[#900014] text-white flex flex-col">
        <Navbar />
        <main className="mx-auto flex max-w-4xl flex-1 items-center px-4 py-16">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-8 text-center backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/60">Artikel tidak ditemukan</p>
            <h1 className="mt-3 text-3xl font-black">Konten yang Anda cari belum tersedia</h1>
            <button
              onClick={() => navigate('/artikel')}
              className="mt-6 rounded-full bg-[#e82c57] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c82148]"
            >
              Kembali ke artikel
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#900014] text-white flex flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:py-12">
        <div className="mb-6">
          <button
            onClick={() => navigate('/artikel')}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#900014] shadow-sm transition hover:bg-gray-100"
          >
            ← Kembali
          </button>
        </div>

        <article className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="overflow-hidden border border-gray-200 bg-white shadow-sm rounded-2xl">

            <div className="px-6 py-8 md:px-8">
              <div className="mb-6 overflow-hidden rounded-2xl md:h-72">
                <img src={coverBg} alt={article.judul} className="w-full h-56 object-cover rounded-2xl md:h-72" />
              </div>

              <div className="mt-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                  <span>{article.kategori}</span>
                  <span>•</span>
                  <span>{article.tanggal}</span>
                  <span>•</span>
                  <span>{article.bacaan}</span>
                </div>
                <div className="mt-3">
                  <h1 className="text-3xl font-black text-gray-900 leading-tight md:text-4xl">{article.judul}</h1>
                  <p className="mt-4 text-base text-gray-700">{article.ringkasan}</p>
                </div>
              </div>

              <div className="space-y-5 text-gray-800">
                <ArticleContentBlocks blocks={article.konten} />
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {relatedArticles.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
                <p className="text-base font-bold text-gray-900">Related Articles</p>
                <div className="mt-4 space-y-4">
                  {relatedArticles.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(`/artikel/${item.slug}`)}
                      className="flex w-full items-start gap-3 text-left transition hover:opacity-90"
                    >
                      <div className={`h-20 w-28 shrink-0 rounded-xl bg-gradient-to-br ${item.coverClass}`} />
                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-3 text-sm font-semibold leading-snug text-gray-900">{item.judul}</h4>
                        <p className="mt-2 text-xs text-gray-500">{item.kategori}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </article>
      </main>
    </div>
  )
}   