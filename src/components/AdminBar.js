import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, ShieldCheck } from 'lucide-react'

export default function AdminBar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-400 text-amber-900 px-6 py-2 flex items-center justify-between text-sm font-sans shadow-md">
      <div className="flex items-center gap-2 font-semibold">
        <ShieldCheck size={16} />
        Admin Mode — Click any dashed box to edit content on this page
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 bg-amber-900/15 hover:bg-amber-900/25 px-3 py-1 rounded-lg transition font-medium"
      >
        <LogOut size={14} />
        Log Out
      </button>
    </div>
  )
}