import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, LogIn } from 'lucide-react'
import DonateModal from './DonateModal'
import ContactModal from './ContactModal'

export default function Navbar() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [showDonate, setShowDonate] = useState(false)
  const [showContact, setShowContact] = useState(false)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/meet-mir', label: 'About Me' },
    { to: '/priorities', label: 'Priorities' },
    { to: '/articles', label: 'Articles' },
    { to: '/press', label: 'Press' },
  ]

  return (
    <>
      <nav className={`fixed left-0 right-0 z-50 bg-[#0D4F4F] shadow-md transition-all ${user ? 'top-9' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: '64px' }}>

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo2.png"
              alt="Abdullah Mir"
              style={{ height: '40px', width: 'auto' }}
              className="object-contain transition-all duration-300 hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[#FAF7F2]/75 hover:text-[#FAF7F2] font-sans text-sm uppercase tracking-widest transition"
              >
                {l.label}
              </Link>
            ))}

            {/* Contact button */}
            <button
              onClick={() => setShowContact(true)}
              className="bg-[#FAF7F2]/15 text-[#FAF7F2] px-5 py-2 rounded-full font-sans font-bold text-sm hover:bg-[#FAF7F2]/25 transition shadow-sm border border-[#FAF7F2]/20 ml-2"
            >
              Contact
            </button>

            {/* Donate button */}
            <button
              onClick={() => setShowDonate(true)}
              className="bg-[#FAF7F2] text-[#0D4F4F] px-5 py-2 rounded-full font-sans font-bold text-sm hover:bg-white transition shadow-sm"
            >
              Donate
            </button>

            {/* Admin link */}
            {!user && (
              <Link
                to="/admin-login"
                className="flex items-center gap-1 text-[#FAF7F2]/30 hover:text-[#FAF7F2]/60 text-xs transition"
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

            {/* Contact button (mobile) */}
            <button
              onClick={() => { setShowContact(true); setOpen(false) }}
              className="bg-[#FAF7F2]/15 text-[#FAF7F2] px-5 py-2 rounded-full font-sans font-bold text-sm text-center hover:bg-[#FAF7F2]/25 transition border border-[#FAF7F2]/20"
            >
              Contact
            </button>

            {/* Donate button (mobile) */}
            <button
              onClick={() => { setShowDonate(true); setOpen(false) }}
              className="bg-[#FAF7F2] text-[#0D4F4F] px-5 py-2 rounded-full font-sans font-bold text-sm text-center hover:bg-white transition"
            >
              Donate
            </button>

            {!user && (
              <Link to="/admin-login" onClick={() => setOpen(false)} className="text-[#FAF7F2]/30 text-xs">
                Admin Login
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Donate Modal */}
      {showDonate && <DonateModal onClose={() => setShowDonate(false)} />}

      {/* Contact Modal */}
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  )
}