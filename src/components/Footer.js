import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#0D4F4F] text-cream/80 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div>
          <p className="font-serif text-xl text-cream font-bold mb-2">Abdullah Mir</p>
          <p className="text-sm">Candidate for Ward 1 City Councillor<br />Pickering, Ontario</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/" className="hover:text-cream transition">Home</Link>
          <Link to="/meet-mir" className="hover:text-cream transition">Meet Mir</Link>
          <Link to="/priorities" className="hover:text-cream transition">Priorities</Link>
          <Link to="/articles" className="hover:text-cream transition">Articles</Link>
          <Link to="/press" className="hover:text-cream transition">Press</Link>
        </div>
        <div>
          <p className="text-sm mb-3">Follow Abdullah</p>
          <div className="flex gap-4 items-center">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cream transition text-xs font-sans border border-cream/30 px-2 py-1 rounded"
            >
              FB
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cream transition text-xs font-sans border border-cream/30 px-2 py-1 rounded"
            >
              X
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cream transition text-xs font-sans border border-cream/30 px-2 py-1 rounded"
            >
              IG
            </a>
            <a
              href="mailto:votemirward1@gmail.com"
              className="hover:text-cream transition"
            >
              <Mail size={20} />
            </a>
          </div>
          <p className="text-xs mt-4 opacity-50">© {new Date().getFullYear()} Abdullah Mir. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}