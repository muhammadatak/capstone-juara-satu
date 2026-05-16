const FOOTER_SECTIONS = [
  {
    title: 'Kantor Pusat',
    icon: 'https://www.cimbniaga.co.id/content/dam/footer-revamp-assets/kantor-pusat.png',
    content: 'Graha CIMB Niaga, Jl. Jend. Sudirman Kav.58, Jakarta Selatan 12190',
  },
  {
    title: 'Hubungi Kami',
    icon: 'https://www.cimbniaga.co.id/content/dam/footer-revamp-assets/call-center.png',
    content: ['14041', '1500800', '+6221 2997 8888'],
  },
  {
    title: 'Bantuan',
    icon: 'https://www.cimbniaga.co.id/content/dam/footer-revamp-assets/call-center.png',
    content: ['Hubungi Kami', 'Lindungi Informasi', 'Tips Keamanan'],
  },
  {
    title: 'Media Sosial',
    icon: 'https://www.cimbniaga.co.id/content/dam/footer-revamp-assets/social-links.png',
    content: 'social',
  },
]

const SOCIAL_ICONS = [
  { name: 'Facebook', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/icon-facebook.png' },
  { name: 'Twitter', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/icon-x-twitter.png' },
  { name: 'Instagram', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/icon-x-twitter.png' },
  { name: 'TikTok', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/icon-tiktok.png' },
  { name: 'YouTube', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/icon-youtube.png' },
  { name: 'LinkedIn', icon: 'https://www.cimbniaga.co.id/content/dam/cimb/revamp/icon-linkedin.png' },
]

const Footer = () => {
  return (
    <footer className="bg-[#05080d] px-4 pb-10 pt-12 text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-8 border-b border-white/10 pb-8 md:grid-cols-4">
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="mb-3 flex items-center gap-3">
              <img src={section.icon} alt={section.title} className="h-10 w-10 object-contain" />
              <h4 className="text-lg font-bold text-white uppercase">{section.title}</h4>
            </div>
            {section.content === 'social' ? (
              <div className="mt-3 flex gap-3">
                {SOCIAL_ICONS.map((social) => (
                  <a key={social.name} href="#" className="transition hover:opacity-75">
                    <img src={social.icon} alt={social.name} className="h-12 w-12 object-contain" />
                  </a>
                ))}
              </div>
            ) : Array.isArray(section.content) ? (
              <div className="mt-3 space-y-2">
                {section.content.map((item, idx) => (
                  <p key={idx} className="text-md">{item}</p>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-md leading-relaxed">{section.content}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-6 max-w-6xl text-[11px] text-gray-400">
        © 2026 PT Bank CIMB Niaga Tbk. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  )
}

export default Footer
