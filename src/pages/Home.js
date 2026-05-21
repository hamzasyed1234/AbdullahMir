import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import EditableText from '../components/EditableText'

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
}

function ThreadsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" fill="currentColor" width="20" height="20">
      <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.372-39.134 15.265-38.105 34.569.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.608 125.202.195 97.07 0h-.113C68.882.194 47.292 9.642 32.788 28.08 19.882 44.485 13.224 67.315 13.001 95.932L13 96v.067c.224 28.617 6.882 51.447 19.788 67.854C47.292 182.358 68.882 191.806 96.957 192h.113c24.96-.173 42.554-6.708 57.048-21.189 18.963-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-18.945-24.723-24.553zM98.44 129.507c-10.44.588-21.286-4.098-21.82-14.135-.397-7.442 5.296-15.746 22.461-16.735 1.966-.113 3.895-.169 5.79-.169 6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.567 28.713-23.802 29.274z"/>
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

function FormattedText({ value }) {
  if (!value) return null
  return (
    <>
      {value.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

const SocialLinks = ({ dark = false }) => {
  const base = dark
    ? 'text-[#FAF7F2]/60 hover:text-[#FAF7F2]'
    : 'text-[#0D4F4F]/50 hover:text-[#0D4F4F]'
  return (
    <div className="flex gap-4 items-center flex-wrap">
      <a href="https://www.instagram.com/theabdullahmir/" target="_blank" rel="noreferrer" className={`${base} transition`} aria-label="Instagram"><InstagramIcon /></a>
      <a href="https://www.facebook.com/theabdullahmir/" target="_blank" rel="noreferrer" className={`${base} transition`} aria-label="Facebook"><FacebookIcon /></a>
      <a href="https://www.tiktok.com/@theabdullahmir" target="_blank" rel="noreferrer" className={`${base} transition`} aria-label="TikTok"><TikTokIcon /></a>
      <a href="https://www.threads.net/@theabdullahmir" target="_blank" rel="noreferrer" className={`${base} transition`} aria-label="Threads"><ThreadsIcon /></a>
      <a href="https://www.youtube.com/@theabdullahmir" target="_blank" rel="noreferrer" className={`${base} transition`} aria-label="YouTube"><YouTubeIcon /></a>
    </div>
  )
}

export default function Home() {
  const [form, setForm] = useState({ name: '', email: '', postal_code: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [content, setContent] = useState({ vision_title: "Abdullah Mir's Vision", vision_body: 'Loading…' })

  useEffect(() => {
    supabase.from('page_content').select('*').eq('page', 'home').then(({ data }) => {
      if (data) {
        const map = {}
        data.forEach(row => { map[row.key] = row.value })
        setContent(prev => ({ ...prev, ...map }))
      }
    })
  }, [])

  const handleSupport = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const { error } = await supabase.from('supporters').insert([form])
    if (error) setSubmitError('Something went wrong. Please try again.')
    else { setSubmitted(true); setForm({ name: '', email: '', postal_code: '' }) }
  }

  return (
    <div className="pt-0">

      {/* ── MOBILE LAYOUT ── */}
      <div className="md:hidden" style={{ paddingTop: '64px' }}>

        {/* Full-width hero photo with name overlaid at bottom */}
        <div className="relative w-full" style={{ height: '55vw', minHeight: '260px', maxHeight: '420px' }}>
          <picture>
            <source srcSet="/DSCF4977-E.webp" type="image/webp" />
            <img
              src="/DSCF4977-E.jpg"
              alt="Abdullah Mir"
              className="w-full h-full object-cover object-top"
              fetchpriority="high"
              decoding="async"
            />
          </picture>
          {/* Gradient + name overlay at bottom of photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D4F4F]/80 via-[#0D4F4F]/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
            <span className="text-[#FAF7F2]/70 font-sans text-xs uppercase tracking-[0.25em] mb-1 block">Pickering · Ward 1</span>
            <h1 className="font-serif text-[#FAF7F2] text-4xl font-bold leading-tight">
              Abdullah <span className="font-black">Mir</span>
            </h1>
          </div>
        </div>

        {/* Content below the photo */}
        <div className="bg-[#FAF7F2] px-5 py-8 flex flex-col gap-5">
          <p className="text-[#0D4F4F]/80 font-sans text-base leading-relaxed">
            Candidate, City Councillor Ward 1 in Pickering
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="#support" className="bg-[#0D4F4F] text-[#FAF7F2] px-6 py-3 rounded-full font-sans font-semibold text-sm hover:bg-[#1a6b6b] transition shadow-md">Show Your Support</a>
            <a href="/meet-mir" className="border-2 border-[#0D4F4F] text-[#0D4F4F] px-6 py-3 rounded-full font-sans font-semibold text-sm hover:bg-[#0D4F4F]/10 transition">Meet Abdullah</a>
          </div>
          <SocialLinks />
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:flex bg-[#FAF7F2] min-h-screen flex-col md:flex-row md:items-stretch">

        {/* Desktop left — text */}
        <div className="relative z-10 flex flex-col justify-center px-8 md:px-20 py-10 md:py-0 md:w-1/2 w-full flex-shrink-0">
          <h1 className="font-serif text-[#0D4F4F] text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 whitespace-nowrap">
            Abdullah Mir
          </h1>
          <p className="text-[#0D4F4F]/80 font-sans text-base md:text-lg lg:text-xl leading-relaxed mb-8 md:mb-10 whitespace-nowrap">
            Candidate, City Councillor Ward 1 in Pickering
          </p>
          <div className="flex gap-3 md:gap-4 flex-wrap mb-6">
            <a href="#support" className="bg-[#0D4F4F] text-[#FAF7F2] px-6 md:px-8 py-3 rounded-full font-sans font-semibold hover:bg-[#1a6b6b] transition shadow-lg text-sm md:text-base">Show Your Support</a>
            <a href="/meet-mir" className="border-2 border-[#0D4F4F] text-[#0D4F4F] px-6 md:px-8 py-3 rounded-full font-sans font-semibold hover:bg-[#0D4F4F]/10 transition text-sm md:text-base">Meet Abdullah</a>
          </div>
          <SocialLinks />
        </div>

        {/* Desktop right — photo */}
        <div className="absolute right-0 top-0 h-full w-[55%]">
          <picture>
            <source srcSet="/DSCF4977-E.webp" type="image/webp" />
            <img
              src="/DSCF4977-E.jpg"
              alt="Abdullah Mir"
              className="w-full h-full object-cover"
              style={{ objectPosition: '72% top' }}
              fetchpriority="high"
              decoding="async"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/10 to-transparent" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#0D4F4F]/30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>

      {/* ── SHARED: Support Form ── */}
      <div id="support" className="bg-[#0D4F4F] py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-[#FAF7F2] text-3xl font-bold mb-2">Stand With Abdullah</h2>
          <p className="text-[#FAF7F2]/70 font-sans mb-8">Add your name to show your support for Ward 1.</p>
          {submitted ? (
            <div className="bg-[#FAF7F2]/10 rounded-2xl p-8 text-[#FAF7F2]">
              <p className="text-xl font-serif">Thank you for your support! 🙏</p>
              <p className="text-sm mt-2 opacity-70">We'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSupport} className="flex flex-col gap-4">
              <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-white/10 border border-[#FAF7F2]/20 text-[#FAF7F2] placeholder-[#FAF7F2]/40 rounded-xl px-5 py-3 font-sans focus:outline-none focus:border-[#FAF7F2]/60" />
              <input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-white/10 border border-[#FAF7F2]/20 text-[#FAF7F2] placeholder-[#FAF7F2]/40 rounded-xl px-5 py-3 font-sans focus:outline-none focus:border-[#FAF7F2]/60" />
              <input type="text" placeholder="Postal Code" required value={form.postal_code} onChange={e => setForm({ ...form, postal_code: e.target.value })} className="bg-white/10 border border-[#FAF7F2]/20 text-[#FAF7F2] placeholder-[#FAF7F2]/40 rounded-xl px-5 py-3 font-sans focus:outline-none focus:border-[#FAF7F2]/60" />
              {submitError && <p className="text-red-300 text-sm">{submitError}</p>}
              <button type="submit" className="bg-[#FAF7F2] text-[#0D4F4F] py-3 rounded-xl font-sans font-semibold hover:bg-[#FAF7F2]/90 transition">Add My Name</button>
            </form>
          )}
        </div>
      </div>

      {/* ── SHARED: Vision Section ── */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-[#0D4F4F]/20 flex-1" />
          <span className="text-[#0D4F4F]/40 text-xs uppercase tracking-widest font-sans">Vision</span>
          <div className="h-px bg-[#0D4F4F]/20 flex-1" />
        </div>
        <h2 className="font-serif text-[#0D4F4F] text-4xl md:text-5xl font-bold text-center mb-8">
          <EditableText page="home" contentKey="vision_title" value={content.vision_title} onUpdate={v => setContent(c => ({ ...c, vision_title: v }))} />
        </h2>
        <div className="font-sans text-[#0D4F4F]/80 text-lg leading-relaxed max-w-4xl mx-auto">
          <EditableText
            page="home"
            contentKey="vision_body"
            value={content.vision_body}
            onUpdate={v => setContent(c => ({ ...c, vision_body: v }))}
            multiline
            renderValue={(v) => <FormattedText value={v} />}
          />
        </div>
      </div>

    </div>
  )
}