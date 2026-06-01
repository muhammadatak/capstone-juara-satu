export default function ArticleContentBlocks({ blocks }) {
  const calloutStyles = {
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '⚠️' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'ℹ️' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '✅' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: '💡' },
  }

  return blocks.map((block, index) => {
    if (block.tipe === 'paragraf') return <p key={index} className="text-sm leading-relaxed text-gray-600">{block.isi}</p>
    if (block.tipe === 'subjudul') return <h3 key={index} className="mt-2 text-base font-bold text-gray-800">{block.isi}</h3>

    if (block.tipe === 'list') {
      return (
        <ul key={index} className="space-y-3">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cimb-light text-[11px] font-bold text-cimb-red">
                {itemIndex + 1}
              </span>
              <div>
                <span className="text-sm font-semibold text-gray-800">{item.judul}: </span>
                <span className="text-sm text-gray-600">{item.isi}</span>
              </div>
            </li>
          ))}
        </ul>
      )
    }

    if (block.tipe === 'contoh') {
      return (
        <div key={index} className="space-y-2">
          {block.items.map((item, itemIndex) => (
            <div key={itemIndex} className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 ${item.aman ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <span className="w-16 flex-shrink-0 text-xs font-bold text-gray-600">{item.label}</span>
              <span className={`font-mono text-xs ${item.aman ? 'text-green-700' : 'line-through text-red-700'}`}>{item.url}</span>
              {!item.aman && <span className="ml-auto flex-shrink-0 text-xs font-semibold text-red-500">Phishing</span>}
              {item.aman && <span className="ml-auto flex-shrink-0 text-xs font-semibold text-green-600">Aman</span>}
            </div>
          ))}
        </div>
      )
    }

    if (block.tipe === 'callout') {
      const style = calloutStyles[block.warna] || calloutStyles.blue
      return (
        <div key={index} className={`flex items-start gap-3 rounded-xl border p-4 ${style.bg} ${style.border}`}>
          <span className="flex-shrink-0 text-lg">{style.icon}</span>
          <p className={`text-sm font-medium leading-relaxed ${style.text}`}>{block.isi}</p>
        </div>
      )
    }

    return null
  })
}