import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to EduCore</h1>
        <SignIn path="/sign-in" routing="path" />
      </div>
    </div>
  )
}
