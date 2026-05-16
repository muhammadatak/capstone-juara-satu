export function RiskBadge({ score }) {
  if (score >= 70) return (
    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-red-200">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
      Tinggi · {score}
    </span>
  )
  if (score >= 40) return (
    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
      Sedang · {score}
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
      Rendah · {score}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = {
    Open:        'bg-blue-50 text-blue-700 border-blue-200',
    Investigasi: 'bg-amber-50 text-amber-700 border-amber-200',
    Closed:      'bg-green-50 text-green-700 border-green-200',
  }
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${map[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  )
}

export function ValidationBadge({ validated }) {
  if (validated) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
      ✓ Tervalidasi
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
      ⏳ Pending validasi
    </span>
  )
}

export function ScoreRing({ score, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-9 h-9 text-xs' : 'w-12 h-12 text-sm'
  const colorClass = score >= 70
    ? 'border-red-400 text-red-700 bg-red-50'
    : score >= 40
    ? 'border-amber-400 text-amber-700 bg-amber-50'
    : 'border-green-400 text-green-700 bg-green-50'
  return (
    <div className={`${sizeClass} ${colorClass} rounded-full border-2 flex items-center justify-center font-bold flex-shrink-0`}>
      {score}
    </div>
  )
}

export function JenisBadge({ jenis }) {
  const map = {
    URL:       'bg-purple-50 text-purple-700 border-purple-200',
    SMS:       'bg-blue-50 text-blue-700 border-blue-200',
    WhatsApp:  'bg-green-50 text-green-700 border-green-200',
    Email:     'bg-orange-50 text-orange-700 border-orange-200',
  }
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${map[jenis] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {jenis}
    </span>
  )
}
