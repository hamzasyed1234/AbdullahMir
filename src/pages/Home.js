import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import EditableText from '../components/EditableText'

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

      {/* Hero — split layout */}
      <div className="relative h-screen w-full overflow-hidden bg-[#FAF7F2]">

        {/* Right side — full height photo */}
        <div className="absolute right-0 top-0 h-full w-1/2 md:w-[55%]">
          <img
            src="/DSCF4981.jpg"
            alt="Abdullah Mir"
            className="w-full h-full object-cover object-center"
          />
          {/* subtle gradient fade on the left edge of photo so it blends */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/10 to-transparent" />
        </div>

        {/* Left side — text */}
        <div className="relative z-10 flex flex-col justify-center h-full px-10 md:px-20 max-w-2xl">
          <span className="text-[#0D4F4F]/50 font-sans text-xs uppercase tracking-[0.3em] mb-6">
            Pickering · Ward 1
          </span>
          <h1 className="font-serif text-[#0D4F4F] text-6xl md:text-8xl font-bold leading-tight mb-4">
            Abdullah<br />
            <span className="bold">MIR</span>
          </h1>
          <div className="h-1 w-16 bg-[#0D4F4F] mb-6 rounded-full" />
          <p className="text-[#0D4F4F]/80 font-sans text-lg md:text-xl max-w-sm leading-relaxed mb-10">
            Community builder. Resident advocate. Running for City Councillor.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="#support"
              className="bg-[#0D4F4F] text-[#FAF7F2] px-8 py-3 rounded-full font-sans font-semibold hover:bg-[#1a6b6b] transition shadow-lg"
            >
              Show Your Support
            </a>
            <a
              href="/meet-mir"
              className="border-2 border-[#0D4F4F] text-[#0D4F4F] px-8 py-3 rounded-full font-sans font-semibold hover:bg-[#0D4F4F]/10 transition"
            >
              Meet Abdullah
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#0D4F4F]/30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>

      {/* Support Form */}
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
              <input
                type="text"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="bg-white/10 border border-[#FAF7F2]/20 text-[#FAF7F2] placeholder-[#FAF7F2]/40 rounded-xl px-5 py-3 font-sans focus:outline-none focus:border-[#FAF7F2]/60"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="bg-white/10 border border-[#FAF7F2]/20 text-[#FAF7F2] placeholder-[#FAF7F2]/40 rounded-xl px-5 py-3 font-sans focus:outline-none focus:border-[#FAF7F2]/60"
              />
              <input
                type="text"
                placeholder="Postal Code"
                required
                value={form.postal_code}
                onChange={e => setForm({ ...form, postal_code: e.target.value })}
                className="bg-white/10 border border-[#FAF7F2]/20 text-[#FAF7F2] placeholder-[#FAF7F2]/40 rounded-xl px-5 py-3 font-sans focus:outline-none focus:border-[#FAF7F2]/60"
              />
              {submitError && <p className="text-red-300 text-sm">{submitError}</p>}
              <button
                type="submit"
                className="bg-[#FAF7F2] text-[#0D4F4F] py-3 rounded-xl font-sans font-semibold hover:bg-[#FAF7F2]/90 transition"
              >
                Add My Name
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Vision Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-[#0D4F4F]/20 flex-1" />
          <span className="text-[#0D4F4F]/40 text-xs uppercase tracking-widest font-sans">Vision</span>
          <div className="h-px bg-[#0D4F4F]/20 flex-1" />
        </div>
        <h2 className="font-serif text-[#0D4F4F] text-4xl md:text-5xl font-bold text-center mb-8">
          <EditableText
            page="home"
            contentKey="vision_title"
            value={content.vision_title}
            onUpdate={v => setContent(c => ({ ...c, vision_title: v }))}
          />
        </h2>
        <div className="font-sans text-[#0D4F4F]/80 text-lg leading-relaxed text-center max-w-2xl mx-auto">
          <EditableText
            page="home"
            contentKey="vision_body"
            value={content.vision_body}
            onUpdate={v => setContent(c => ({ ...c, vision_body: v }))}
            multiline
          />
        </div>
      </div>

    </div>
  )
}