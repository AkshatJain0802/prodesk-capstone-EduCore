import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { useAppContext } from '../../context/AppContext'
import Spinner from '../../components/common/Spinner'

export default function EducatorDashboard() {
  const { isSignedIn } = useUser()
  const { dbUser, authAxios, profileLoading } = useAppContext()

  const [courses,  setCourses]  = useState([])
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    if (!isSignedIn || !dbUser || dbUser.role !== 'educator') {
      setLoading(false)
      return
    }

    setLoading(true)
    const fetch = async () => {
      try {
        const ax = await authAxios()
        const { data } = await ax.get('/courses/educator/my-courses')
        setCourses(data.courses)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [isSignedIn, dbUser?.role, dbUser?._id])

  const togglePublish = async (courseId, current) => {
    try {
      const ax = await authAxios()
      await ax.put(`/courses/${courseId}/publish`)
      setCourses(prev => prev.map(c =>
        c._id === courseId ? { ...c, isPublished: !current } : c
      ))
    } catch (e) {
      alert('Failed to update publish status')
    }
  }

  // Stats
  const totalRevenue  = courses.reduce((s, c) => s + (c.price * c.enrolledCount), 0)
  const totalStudents = courses.reduce((s, c) => s + c.enrolledCount, 0)
  const published     = courses.filter(c => c.isPublished).length

  if (!isSignedIn) return (
    <div className="text-center py-24">
      <p className="text-5xl mb-4">🔐</p>
      <p className="text-lg font-medium text-gray-700">Please sign in to access the educator panel.</p>
    </div>
  )

  if (profileLoading || !dbUser) return <Spinner size="lg" />

  if (dbUser && dbUser.role !== 'educator') return (
    <div className="text-center py-24 max-w-md mx-auto px-4">
      <p className="text-5xl mb-4">👨‍🏫</p>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Become an Educator</h2>
      <p className="text-gray-500 mb-6">Switch your account to educator mode to start creating and publishing courses.</p>
      <BecomeEducatorButton />
    </div>
  )

  if (loading) return <Spinner size="lg" />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Educator Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your courses and track earnings</p>
        </div>
        <Link to="/educator/create" className="btn-primary">
          + Create Course
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Courses',   value: courses.length,                  color: 'text-primary-600' },
          { label: 'Published',       value: published,                        color: 'text-green-600'   },
          { label: 'Total Students',  value: totalStudents.toLocaleString(),   color: 'text-blue-600'    },
          { label: 'Est. Revenue',    value: `₹${totalRevenue.toLocaleString()}`, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Courses table */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Courses</h2>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-5xl mb-4">🎬</p>
          <p className="text-lg font-semibold text-gray-700 mb-2">No courses yet</p>
          <p className="text-gray-400 mb-6">Create your first course and start earning</p>
          <Link to="/educator/create" className="btn-primary inline-block">Create Course</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Course', 'Category', 'Price', 'Students', 'Revenue', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map(course => (
                <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-400 text-xs">📚</span>
                        </div>
                      )}
                      <span className="font-medium text-gray-900 line-clamp-1 max-w-[180px]">{course.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{course.category || '—'}</td>
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {course.price === 0 ? 'Free' : `₹${course.price.toLocaleString()}`}
                  </td>
                  <td className="px-5 py-4 text-gray-500">{course.enrolledCount}</td>
                  <td className="px-5 py-4 font-medium text-gray-900">
                    ₹{(course.price * course.enrolledCount).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      course.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {course.isPublished ? '● Live' : '○ Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePublish(course._id, course.isPublished)}
                        className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors ${
                          course.isPublished
                            ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            : 'border-green-200 text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {course.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link
                        to={`/courses/${course._id}`}
                        className="text-xs px-3 py-1.5 rounded-md border border-primary-200 text-primary-600 hover:bg-primary-50 transition-colors font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function BecomeEducatorButton() {
  const { authAxios, setDbUser } = useAppContext()
  const [loading, setLoading] = useState(false)

  const handleSwitch = async () => {
    setLoading(true)
    try {
      const ax = await authAxios()
      const { data } = await ax.put('/user/role', { role: 'educator' })
      setDbUser(data.user)
    } catch (e) {
      alert('Failed to switch role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleSwitch} disabled={loading} className="btn-primary">
      {loading ? 'Switching...' : 'Switch to Educator'}
    </button>
  )
}
