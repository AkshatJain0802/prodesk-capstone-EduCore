import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

import Navbar          from './components/layout/Navbar'
import Footer          from './components/layout/Footer'
import ProtectedRoute  from './components/common/ProtectedRoute'
import Home            from './pages/Home'
import CourseCatalog   from './pages/CourseCatalog'
import CourseDetail    from './pages/CourseDetail'
import StudentDashboard from './pages/student/StudentDashboard'
import EducatorDashboard from './pages/educator/EducatorDashboard'
import CreateCourse    from './pages/educator/CreateCourse'
import SignIn          from './pages/SignIn'
import PaymentSuccess  from './pages/PaymentSuccess'
import NotFound        from './pages/NotFound'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"                  element={<Home />} />
              <Route path="/courses"           element={<CourseCatalog />} />
              <Route path="/courses/:id"       element={<CourseDetail />} />
              <Route path="/sign-in"          element={<SignIn />} />
              <Route path="/payment-success"  element={<PaymentSuccess />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard"       element={<StudentDashboard />} />
                <Route path="/educator"        element={<EducatorDashboard />} />
                <Route path="/educator/create" element={<CreateCourse />} />
              </Route>

              <Route path="*"                  element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
