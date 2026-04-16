import { useUser } from '@clerk/clerk-react'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return isSignedIn ? <Outlet /> : <Navigate to="/sign-in" replace />
}
