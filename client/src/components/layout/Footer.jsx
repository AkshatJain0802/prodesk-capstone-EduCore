import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">E</span>
            </div>
            <span className="text-white font-semibold">EduCore</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">My Learning</Link>
            <Link to="/educator" className="hover:text-white transition-colors">Teach</Link>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} EduCore. Built with MERN Stack.</p>
        </div>
      </div>
    </footer>
  )
}
