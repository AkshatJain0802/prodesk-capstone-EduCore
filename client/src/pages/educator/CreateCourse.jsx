import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const CATEGORIES = ['Web Development', 'Data Science', 'Design', 'Business', 'Marketing', 'General']

export default function CreateCourse() {
  const navigate = useNavigate()
  const { authAxios } = useAppContext()

  const [form, setForm] = useState({
    title: '', description: '', category: 'Web Development', price: '',
  })
  const [thumbnail, setThumbnail] = useState(null)
  const [preview,   setPreview]   = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleThumbnail = e => {
    const file = e.target.files[0]
    if (!file) return
    setThumbnail(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title.trim()) return setError('Course title is required')
    setLoading(true)
    setError('')

    try {
      const fd = new FormData()
      fd.append('title',       form.title)
      fd.append('description', form.description)
      fd.append('category',    form.category)
      fd.append('price',       form.price || '0')
      if (thumbnail) fd.append('thumbnail', thumbnail)

      const ax = await authAxios()
      const { data } = await ax.post('/courses', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      navigate('/educator')
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/educator')} className="text-sm text-gray-400 hover:text-gray-600 mb-3 flex items-center gap-1">
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-500 mt-1">Fill in the details below to set up your course</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Course Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Complete React Developer Bootcamp"
            className="input"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="What will students learn in this course?"
            className="input resize-none"
          />
        </div>

        {/* Category + Price row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Price (₹) <span className="text-gray-400 font-normal">— leave 0 for free</span>
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="input"
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Thumbnail</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary-300 transition-colors">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="thumbnail preview" className="w-full max-h-48 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => { setThumbnail(null); setPreview(null) }}
                  className="absolute top-2 right-2 bg-white text-gray-600 rounded-full w-7 h-7 flex items-center justify-center text-sm border border-gray-200 hover:bg-gray-50"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <span className="text-3xl">🖼️</span>
                <span className="text-sm text-gray-500">Click to upload thumbnail</span>
                <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Creating...' : 'Create Course'}
          </button>
          <button type="button" onClick={() => navigate('/educator')} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
