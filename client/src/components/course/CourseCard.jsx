import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  const { _id, title, thumbnail, educatorId, price, rating, enrolledCount, category } = course

  return (
    <Link to={`/courses/${_id}`} className="card group block overflow-hidden">
      {/* Thumbnail */}
      <div className="relative overflow-hidden bg-gray-100 aspect-video">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-50">
            <span className="text-primary-300 text-4xl">📚</span>
          </div>
        )}
        <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-md font-medium">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        <p className="text-xs text-gray-500 mb-3">
          by {educatorId?.name || 'Instructor'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            {rating ? rating.toFixed(1) : 'New'}
          </span>
          <span>·</span>
          <span>{enrolledCount} students</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">
            {price === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `₹${price.toLocaleString()}`
            )}
          </span>
          <span className="text-xs text-primary-600 font-medium group-hover:underline">
            View Course →
          </span>
        </div>
      </div>
    </Link>
  )
}
