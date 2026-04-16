import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'

const AppContext = createContext()

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

export const AppProvider = ({ children }) => {
  const { getToken } = useAuth()
  const { user: clerkUser, isLoaded, isSignedIn } = useUser()

  const [dbUser,   setDbUser]   = useState(null)
  const [courses,  setCourses]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)

  // Axios helper that injects Bearer token
  const authAxios = async () => {
    const token = await getToken()
    return axios.create({
      baseURL: API,
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  // Fetch user profile from our DB
  const fetchProfile = async () => {
    setProfileLoading(true)
    try {
      const ax = await authAxios()
      const { data } = await ax.get('/user/profile')
      setDbUser(data.user)
    } catch (e) {
      console.error('Profile fetch error', e)
      setDbUser(null)
    } finally {
      setProfileLoading(false)
    }
  }

  // Fetch all published courses
  const fetchCourses = async (params = {}) => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${API}/courses`, { params })
      setCourses(data.courses)
    } catch (e) {
      console.error('Courses fetch error', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      setDbUser(null)
      setProfileLoading(false)
      return
    }

    fetchProfile()
  }, [isLoaded, isSignedIn, clerkUser?.id])

  useEffect(() => { fetchCourses() }, [])

  return (
    <AppContext.Provider value={{
      dbUser, setDbUser, courses, loading, profileLoading,
      fetchCourses, authAxios, API,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
