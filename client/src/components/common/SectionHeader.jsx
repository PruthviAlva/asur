import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SectionHeader({ title, viewAllLink, icon: Icon }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {/* Orange left-border accent — signature Enma-style detail */}
        <div className="w-1 h-6 bg-orange-500 rounded-full" />
        {Icon && <Icon className="w-5 h-5 text-orange-500" />}
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>

      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-400 transition-colors"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}