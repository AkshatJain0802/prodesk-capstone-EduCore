import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import CourseCard from '../components/course/CourseCard'
import Spinner from '../components/common/Spinner'

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Design', 'Business', 'Marketing']

export default function CourseCatalog() {
  const { courses, loading, fetchCourses } = useAppContext()
  const [searchParams, setSearchParams] = useSearchParams()

  const [search,   setSearch]   = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')

  useEffect(() => {
    const params = {}
    if (search)              params.search   = search
    if (category !== 'All')  params.category = category
    fetchCourses(params)
  }, [category])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = {}
    if (search)              params.search   = search
    if (category !== 'All')  params.category = category
    fetchCourses(params)
    setSearchParams(params)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h1>
        <p className="text-gray-500">{courses.length} courses available</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input flex-1 max-w-md"
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              category === cat
                ? 'bg-primary-600 text-white border-primary-600'
                : 'border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {loading ? (
        <Spinner />
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">No courses found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
