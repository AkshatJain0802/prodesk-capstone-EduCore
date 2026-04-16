import { Link } from 'react-router-dom'
import { SignUpButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'
import CourseCard from '../components/course/CourseCard'
import Spinner from '../components/common/Spinner'

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Design', 'Business', 'Marketing']

export default function Home() {
  const { isSignedIn } = useUser()
  const { courses, loading } = useAppContext()

  const featured = courses.slice(0, 4)

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full mb-5">
              🎓 ProDesk Capstone Project
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              Learn Without Limits
            </h1>
            <p className="text-lg text-primary-100 mb-8 leading-relaxed">
              Explore thousands of courses taught by expert educators.
              Learn at your own pace, on any device.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/courses" className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors">
                Browse Courses
              </Link>
              {!isSignedIn && (
                <SignUpButton mode="modal">
                  <button className="border border-white/60 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
                    Start for Free →
                  </button>
                </SignUpButton>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Courses', value: '500+' },
              { label: 'Students', value: '12,000+' },
              { label: 'Educators', value: '200+' },
              { label: 'Categories', value: '15+' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-primary-400">{s.value}</p>
                <p className="text-sm text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Pills ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              to={`/courses?category=${cat}`}
              className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
          <Link to="/courses" className="text-sm text-primary-600 hover:underline font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : featured.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-lg">No courses yet — be the first to publish one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-primary-50 border-t border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to start teaching?</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Share your knowledge and earn revenue from every student who enrolls.
          </p>
          <Link to="/educator" className="btn-primary inline-block">
            Become an Educator →
          </Link>
        </div>
      </section>
    </div>
  )
}
