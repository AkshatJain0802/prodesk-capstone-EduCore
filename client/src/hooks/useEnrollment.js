import { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'

export const useEnrollment = (courseId) => {
  const { authAxios } = useAppContext()
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [progress,   setProgress]   = useState(null)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    if (!courseId) return
    const check = async () => {
      try {
        const ax = await authAxios()
        const { data } = await ax.get(`/progress/${courseId}`)
        setIsEnrolled(!!data.progress)
        setProgress(data.progress)
      } catch (e) {
        setIsEnrolled(false)
      } finally {
        setLoading(false)
      }
    }
    check()
  }, [courseId])

  return { isEnrolled, progress, loading }
}
