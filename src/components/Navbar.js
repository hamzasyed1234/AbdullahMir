import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, LogIn } from 'lucide-react'

export default function Navbar() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/meet-mir', label: 'Meet Mir' },
    { to: '/priorities', label: 'Priorities' },
    { to: '/articles', label: 'Articles' },
    { to: '/press', label: 'Press' },
  ]

  return (
    <nav className={`fixed left-0 right-0 z-50 bg-[#0D4F4F] shadow-md transition-all ${user ? 'top-9' : 'top-0'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: '64px' }}>
        
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src="/logo.png"
            alt="Abdullah Mir"
            style={{ height: '40px', width: 'auto' }}
            className="object-contain transition-all duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[#FAF7F2]/75 hover:text-[#FAF7F2] font-sans text-sm uppercase tracking-widest transition"
            >
              {l.label}
            </Link>
          ))}
          {!user && (
            <Link
              to="/admin-login"
              className="flex items-center gap-1 text-[#FAF7F2]/35 hover:text-[#FAF7F2]/60 text-xs transition"
            >
              <LogIn size={13} />
              Admin
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-[#FAF7F2]" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0D4F4F] border-t border-[#FAF7F2]/10 px-6 pb-6 flex flex-col gap-4 pt-4">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="text-[#FAF7F2]/75 font-sans text-sm uppercase tracking-widest"
            >
              {l.label}
            </Link>
          ))}
          {!user && (
            <Link to="/admin-login" onClick={() => setOpen(false)} className="text-[#FAF7F2]/35 text-xs">
              Admin Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}