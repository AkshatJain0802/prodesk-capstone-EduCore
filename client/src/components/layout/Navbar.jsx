import { Link, useNavigate } from 'react-router-dom'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../../context/AppContext'

export default function Navbar() {
  const { user, isSignedIn } = useUser()
  const { dbUser } = useAppContext()
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EduCore</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/courses" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Browse Courses
            </Link>
            {isSignedIn && dbUser?.role === 'educator' && (
              <Link to="/educator" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Educator Panel
              </Link>
            )}
            {isSignedIn && (
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                My Learning
              </Link>
            )}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="btn-outline text-sm py-2 px-4">Log in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-primary text-sm py-2 px-4">Sign up</button>
                </SignUpButton>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 hidden md:block">
                  {dbUser?.role === 'educator' ? '👨‍🏫 Educator' : '🎓 Student'}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
