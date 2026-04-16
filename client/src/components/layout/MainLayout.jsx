import { Outlet } from 'react-router-dom'
import { AppProvider } from '../../context/AppContext'
import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AppProvider>
  )
}
