import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

export const api = axios.create({ baseURL: API_BASE })

export const authApi = (token) =>
  axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${token}` },
  })
