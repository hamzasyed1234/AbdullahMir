import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError('Invalid credentials. Please try again.')
    else navigate('/')
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="bg-white border border-teal/20 rounded-2xl shadow-xl p-10 w-full max-w-md">
        <h1 className="font-serif text-3xl text-[#0D4F4F] mb-2">Admin Login</h1>
        <p className="text-sm text-gray-500 mb-8">Authorized personnel only</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#0D4F4F] font-sans" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#0D4F4F] font-sans" required />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="bg-[#0D4F4F] text-cream py-3 rounded-lg font-sans font-medium hover:bg-[#1a6b6b] transition">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}