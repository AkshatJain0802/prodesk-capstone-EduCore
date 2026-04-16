import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { useAppContext } from '../context/AppContext'
import Spinner from '../components/common/Spinner'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const { API, authAxios } = useAppContext()

  const [course,     setCourse]     = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [enrolling,  setEnrolling]  = useState(false)
  const [openChapter, setOpenChapter] = useState(0)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`${API}/courses/${id}`)
        setCourse(data.course)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  const handleEnroll = async () => {
    if (!isSignedIn) return navigate('/sign-in')
    setEnrolling(true)
    try {
      const ax = await authAxios()
      const { data } = await ax.post('/purchase', { courseId: id })
      if (data.sessionUrl) window.location.href = data.sessionUrl
    } catch (e) {
      alert(e.response?.data?.message || 'Enrollment failed')
    } finally {
      setEnrolling(false)
    }
  }

  const totalLectures = course?.chapters?.reduce((s, ch) => s + ch.lectures.length, 0) || 0
  const totalDuration  = course?.chapters?.reduce((s, ch) =>
    s + ch.lectures.reduce((ls, l) => ls + (l.duration || 0), 0), 0) || 0

  if (loading) return <Spinner size="lg" />
  if (!course)  return <div className="text-center py-20 text-gray-400">Course not found.</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Left: Course Info ── */}
        <div className="lg:col-span-2">
          {/* Breadcrumb */}
          <p className="text-sm text-gray-400 mb-3">
            Courses / <span className="text-primary-600">{course.category}</span>
          </p>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
          <p className="text-gray-600 leading-relaxed mb-5">{course.description}</p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-8">
            <span>⭐ {course.rating ? course.rating.toFixed(1) : 'New'}</span>
            <span>👥 {course.enrolledCount} students</span>
            <span>📹 {totalLectures} lectures</span>
            <span>⏱ {Math.round(totalDuration / 60)} min total</span>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-3 mb-8 p-4 bg-gray-50 rounded-xl">
            <img
              src={course.educatorId?.imageUrl || '/avatar.png'}
              alt="educator"
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Your instructor</p>
              <p className="font-semibold text-gray-900">{course.educatorId?.name}</p>
            </div>
          </div>

          {/* Curriculum */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
          <div className="space-y-3">
            {course.chapters?.map((chapter, idx) => (
              <div key={chapter._id} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex justify-between items-center px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  onClick={() => setOpenChapter(openChapter === idx ? -1 : idx)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary-600">Chapter {idx + 1}</span>
                    <span className="font-medium text-gray-900">{chapter.title}</span>
                    {chapter.isFree && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Free</span>
                    )}
                  </div>
                  <span className="text-gray-400">{openChapter === idx ? '▲' : '▼'}</span>
                </button>

                {openChapter === idx && (
                  <ul className="divide-y divide-gray-100">
                    {chapter.lectures.map((lec, li) => (
                      <li key={lec._id} className="flex items-center gap-3 px-5 py-3 text-sm">
                        <span className="text-gray-400">{lec.isFree ? '▶' : '🔒'}</span>
                        <span className="flex-1 text-gray-700">{lec.title}</span>
                        <span className="text-gray-400 text-xs">
                          {lec.duration ? `${Math.round(lec.duration / 60)} min` : '—'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Enroll Card ── */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            {/* Thumbnail */}
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} className="w-full rounded-lg mb-5 aspect-video object-cover" />
            )}

            {/* Price */}
            <div className="mb-5">
              <span className="text-3xl font-bold text-gray-900">
                {course.price === 0 ? 'Free' : `₹${course.price.toLocaleString()}`}
              </span>
            </div>

            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="btn-primary w-full text-center mb-4"
            >
              {enrolling ? 'Redirecting...' : course.price === 0 ? 'Enroll for Free' : 'Buy Now'}
            </button>

            <p className="text-xs text-gray-400 text-center">30-day money-back guarantee</p>

            {/* What's included */}
            <div className="mt-5 pt-5 border-t border-gray-100 space-y-2 text-sm text-gray-600">
              <p>✅ {totalLectures} on-demand video lectures</p>
              <p>✅ Full lifetime access</p>
              <p>✅ Access on mobile & desktop</p>
              {course.chapters?.some(ch => ch.isFree) && (
                <p>✅ Free preview lectures available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
