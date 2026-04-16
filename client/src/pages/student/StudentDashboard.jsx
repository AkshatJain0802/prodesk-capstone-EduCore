import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { useAppContext } from '../../context/AppContext'
import Spinner from '../../components/common/Spinner'

export default function StudentDashboard() {
  const { isSignedIn } = useUser()
  const { authAxios } = useAppContext()

  const [enrollments, setEnrollments] = useState([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    if (!isSignedIn) return
    const fetch = async () => {
      try {
        const ax = await authAxios()
        const { data } = await ax.get('/user/enrollments')
        setEnrollments(data.enrollments)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [isSignedIn])

  if (!isSignedIn) return (
    <div className="text-center py-24">
      <p className="text-5xl mb-4">🔐</p>
      <p className="text-lg font-medium text-gray-700 mb-2">Please sign in to view your dashboard</p>
      <Link to="/" className="btn-primary inline-block mt-4">Go Home</Link>
    </div>
  )

  if (loading) return <Spinner size="lg" />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
        <p className="text-gray-500 mt-1">{enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <p className="text-5xl mb-4">📚</p>
          <p className="text-xl font-semibold text-gray-700 mb-2">No courses yet</p>
          <p className="text-gray-400 mb-6">Start learning by enrolling in a course</p>
          <Link to="/courses" className="btn-primary inline-block">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(({ course, completionPercent, lastWatchedId }) => (
            <div key={course._id} className="card p-0 overflow-hidden">
              {/* Thumbnail */}
              <div className="relative bg-gray-100 aspect-video">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-50">
                    <span className="text-4xl text-primary-200">📚</span>
                  </div>
                )}
                {/* Completion badge */}
                {completionPercent === 100 && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    ✓ Completed
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{course.title}</h3>
                <p className="text-xs text-gray-400 mb-4">by {course.educatorId?.name}</p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span className="font-medium text-primary-600">{Math.round(completionPercent)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={`/courses/${course._id}`}
                  className="btn-primary w-full text-center block text-sm py-2"
                >
                  {completionPercent === 0 ? 'Start Learning' : completionPercent === 100 ? 'Review Course' : 'Continue →'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
