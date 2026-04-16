import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach Clerk JWT to every request automatically
api.interceptors.request.use(async (config) => {
  try {
    // window.__clerk is set by ClerkProvider after mount
    const token = await window.__clerk?.session?.getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch (_) {}
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api
