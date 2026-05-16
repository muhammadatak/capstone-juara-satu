import React from 'react'
import octopusCimbNew from '../../assets/OctopusCIMB_New.webp'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const MENU_CARDS = [
  { label: 'Aplikasi OCTO', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/menu/icon/digital-banking-1.svg' },
  { label: 'Fitur Kartu Debit', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/menu/icon/tabungan-1.svg' },
  { label: 'Xtra Savers Valas', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/menu/icon/tabungan2-1.svg' },
  { label: 'Xtra Dana', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/menu/icon/kta-1.svg' },
  { label: 'SBN Ritel 2026', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/menu/icon/treasury-1.svg' },
  { label: 'Mastercard Platinum', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/menu/icon/kartu-kredit-1.svg' },
  { label: 'Sompo Asuransi Travel', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/menu/icon/bancassurence-1.svg' },
  { label: 'KPR', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/menu/icon/kpr-1.svg' },
  { label: 'Program Reksadana', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/menu/icon/reksadanaa-1.svg' },
]

const KEBUTUHAN_CARDS = [
  {
    title: 'Dana Darurat Aman',
    image: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/carousel-kebutuhanmu.png',
  },
  {
    title: 'Mulai Wujudkan Rumah Impian',
    image: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/personal-temukan-2.webp',
  },
  {
    title: 'Siapkan Pendidikan Anak Sejak Dini',
    image: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/carousel-3.png',
  },
]

const PROMO_CARDS = [
  {
    title: 'Tabungan',
    image: 'https://www.cimbniaga.co.id/content/dam/cimb/personal/thumb-promo-tabungan.webp',
  },
  {
    title: 'Kartu Kredit',
    image: 'https://www.cimbniaga.co.id/content/dam/cimb/personal/thumb-promo-kartu-kredit.webp',
  },
  {
    title: 'Kartu Debit',
    image: 'https://www.cimbniaga.co.id/content/dam/cimb/personal/thumb-promo-kartu-debit.webp',
  },
  {
    title: 'Aplikasi OCTO',
    image: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/promo-om.webp',
  },
  {
    title: 'Poin Xtra',
    image: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/poin-xtra.png',
  },
]

const CimbLandingPage = () => {
  return (
    <div className="min-h-screen bg-[#900014] text-white">
      <Navbar />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#00a7c715,transparent_35%),linear-gradient(180deg,#970016_0%,#9f0018_55%,#a7001a_100%)] px-4 pb-14 pt-8">
        <div className="pointer-events-none absolute inset-x-0 bottom-24 h-32 bg-[radial-gradient(circle,#ffffff50_1px,transparent_1px)] [background-size:8px_8px] opacity-25" />

        <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="flex max-w-md items-center justify-between rounded-lg border border-white/40 bg-white/5 px-4 py-2 text-xs text-white/90">
              <span>Cari kebutuhan Anda di sini</span>
              <span>⌄</span>
            </div>
            <h1 className="max-w-2xl text-3xl font-medium leading-tight md:text-5xl">
              CIMB Niaga berkomitmen membantu nasabah dan masyarakat Indonesia mewujudkan mimpi dan aspirasinya dengan semangat bekerja dari hati.
            </h1>
            <button className="rounded-full border border-white/40 bg-white/10 px-6 py-2.5 text-sm font-semibold transition hover:bg-white hover:text-[#8b0012]" type="button">
              Lihat Selengkapnya
            </button>
          </div>

          <div className="grid w-full max-w-[420px] grid-cols-3 gap-2 md:gap-3 md:justify-self-end">
            {MENU_CARDS.map((item) => (
              <div
                key={item.label}
                className="relative aspect-square overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-[#b65d66]/90 to-[#7d4d57]/90 shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
              >
                <div className="flex h-[66%] items-center justify-center px-3">
                  <img src={item.icon} alt={item.label} className="h-10 w-10 object-contain md:h-12 md:w-12" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex min-h-[42px] items-center justify-center rounded-tl-2xl rounded-tr-2xl bg-white px-1.5 py-2 text-center text-[10px] font-bold leading-tight text-[#e92929] md:min-h-[52px] md:text-sm">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-32 grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div className="relative h-[320px] w-full max-w-md overflow-hidden rounded-[2rem] bg-white/20 p-4 backdrop-blur-sm">
            <div className="rounded-full bg-white/70 px-3 py-2 text-xl font-semibold text-white">Hi, Saya OCTO!</div>
            <img src={octopusCimbNew} alt="Maskot OCTO CIMB" className="mx-auto mt-3 h-[300px] object-contain" />
          </div>
          <div className="space-y-4">
            <p className="text-2xl font-semibold uppercase tracking-wider text-red-100">Inspirasi Jadi Prestasi</p>
            <h2 className="text-7xl font-black">CIMB Niaga</h2>
            <p className="max-w-xl text-lg leading-relaxed text-red-50/90">
              Pesona dan keunikan ragam hias Nusantara telah memikat hati dunia. Satu per satu dirangkai penuh makna ungkapan jati diri Indonesia.<br></br>
              Bersama CIMB Niaga terus gali potensi, kejar mimpi, kobarkan inspirasi jadi prestasi. Mari rajut masa depan penuh asa, melangkah untuk Indonesia.
            </p>
            <button className="rounded-full border border-white/40 bg-white/10 px-6 py-2 text-sm font-semibold transition hover:bg-white hover:text-[#8b0012]" type="button">
              Lihat Selengkapnya
            </button>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#a7001a] to-[#1b1f26] px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-14">
          <div className="rounded-3xl bg-white/35 p-6 backdrop-blur-sm md:p-8">
            <div className="grid gap-6 md:grid-cols-[0.65fr_1.35fr] md:items-center">
              <div>
                <p className="text-xs text-white/90">Temukan kebutuhan Anda</p>
                <h3 className="mt-2 text-3xl font-black leading-tight">Jelajahi berbagai solusi pilihan</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {KEBUTUHAN_CARDS.map((item) => (
                  <div key={item.title} className="overflow-hidden rounded-2xl border border-white/40 bg-white/95 text-black shadow-lg">
                    <img src={item.image} alt={item.title} className="h-[260px] w-full object-cover" />
                    <div className="p-3 text-sm font-semibold">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-white/80">Penawaran spesial buat Anda</p>
            <h3 className="mt-2 text-3xl font-black">Cari penawaran istimewanya di sini</h3>
            <div className="mt-6 grid gap-1 sm:grid-cols-2 lg:grid-cols-5">
              {PROMO_CARDS.map((item) => (
                <div key={item.title} className="overflow-hidden rounded-2xl border-[10px] border-[#454545ce] bg-[#b30018] shadow-lg">
                  <img src={item.image} alt={item.title} className="h-[200px] w-full object-cover" />
                  <div className="p-4">
                  <p className="text-xs text-white/80">Promo</p>
                  <p className="mt-1 text-2xl font-black leading-tight">{item.title}</p>
                  <div className="flex justify-end text-lg">→</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#970014] px-4 py-14">
        <div className="mx-auto max-w-6xl space-y-12">
          <div>
            <p className="text-xs text-white/80">Jual beli kurs valas dengan harga bersahabat</p>
            <h3 className="mt-2 text-3xl font-black">Tersedia dalam 15 mata uang asing</h3>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl bg-white/25 p-6 backdrop-blur-sm">
                <div className="mb-4 flex gap-2">
                  <button className="rounded-full bg-[#e4001c] px-4 py-1 text-xs font-semibold" type="button">Beli</button>
                  <button className="rounded-full bg-white/30 px-4 py-1 text-xs" type="button">Jual</button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="rounded-lg bg-white p-3 text-black">USD  -  0.00</div>
                  <div className="rounded-lg bg-white p-3 text-black">IDR  -  0.00</div>
                </div>
                <button className="mt-5 rounded-full border border-white/50 px-4 py-2 text-sm hover:bg-white hover:text-[#8b0012]" type="button">Hitung Sekarang</button>
              </div>

              <div className="rounded-3xl bg-white/25 p-6 backdrop-blur-sm">
                <div className="mb-3 grid grid-cols-3 border-b border-white/30 pb-2 text-sm font-semibold text-white/90">
                  <span>Mata Uang</span>
                  <span>Beli</span>
                  <span>Jual</span>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    ['USD', '17.425,00', '17.460,00'],
                    ['SGD', '13.638,00', '13.658,00'],
                    ['EUR', '20.362,00', '20.384,00'],
                    ['GBP', '23.586,00', '23.611,00'],
                    ['HKD', '2.224,59', '2.225,54'],
                  ].map(([ccy, buy, sell]) => (
                    <div key={ccy} className="grid grid-cols-3 rounded-lg bg-black/20 px-3 py-2">
                      <span>{ccy}</span>
                      <span>{buy}</span>
                      <span>{sell}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-white/80">CIMB Niaga Update</p>
            <h3 className="mt-2 text-3xl font-black">Selalu terhubung dengan informasi terkini</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {['Berita Terkini', 'Penghargaan', 'Pengumuman Terbaru'].map((item) => (
                <div key={item} className="rounded-2xl bg-white/20 p-5 backdrop-blur-sm">
                  <h4 className="text-lg font-bold">{item}</h4>
                  <div className="mt-4 space-y-2 text-xs text-white/85">
                    <p>19 Mar 2026 - Pembaruan layanan digital dan keamanan nasabah.</p>
                    <p>21 Jan 2026 - Inovasi layanan transaksi perbankan harian.</p>
                    <p>09 Nov 2025 - Program edukasi keamanan finansial nasional.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default CimbLandingPage
