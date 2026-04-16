import { Link } from 'react-router-dom'

export default function PaymentSuccess() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-xl text-center bg-white shadow-lg rounded-3xl p-10">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">✓</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful</h1>
        <p className="text-gray-600 mb-8">
          Thank you for enrolling! Your course purchase is complete and your learning dashboard is updated.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard" className="btn-primary px-6 py-3 w-full sm:w-auto">
            Go to Dashboard
          </Link>
          <Link to="/courses" className="btn-outline px-6 py-3 w-full sm:w-auto">
            Browse More Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
