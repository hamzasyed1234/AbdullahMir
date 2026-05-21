import { useState } from 'react'
import { X, Mail, Loader, CheckCircle, Phone } from 'lucide-react'

function ContactForm({ onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !subject || !body) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Using FormSubmit.co — no backend needed, sends to your email
      const res = await fetch('https://formsubmit.co/ajax/votemirward1@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message: body,
          _subject: `[Ward 1 Contact] ${subject}`,
          _template: 'table',
        }),
      })

      const data = await res.json()
      if (data.success === 'true' || data.success === true) {
        setSuccess(true)
      } else {
        throw new Error('Submission failed')
      }
    } catch (err) {
      setError('Something went wrong. Please try again or call/text us directly.')
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <CheckCircle size={56} className="text-[#0D4F4F] mb-4" />
        <h2 className="font-serif text-[#0D4F4F] text-3xl font-bold mb-3">Message Sent!</h2>
        <p className="font-sans text-[#0D4F4F]/70 text-base mb-2">
          Thanks for reaching out, <strong>{name}</strong>.
        </p>
        <p className="font-sans text-[#0D4F4F]/50 text-sm mb-8">
          We'll get back to you at {email} as soon as possible.
        </p>
        <button
          onClick={onClose}
          className="bg-[#0D4F4F] text-white px-8 py-3 rounded-full font-sans font-semibold hover:bg-[#1a6b6b] transition"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="flex justify-center mb-3">
          <div className="bg-[#0D4F4F]/10 rounded-full p-3">
            <Mail size={24} className="text-[#0D4F4F]" />
          </div>
        </div>
        <h2 className="font-serif text-[#0D4F4F] text-3xl font-bold">Get in Touch</h2>
        <p className="font-sans text-[#0D4F4F]/60 text-sm mt-1">
          Have a question or concern? We'd love to hear from you.
        </p>
      </div>

      {/* Phone callout */}
      <div className="flex items-center gap-3 bg-[#0D4F4F]/8 border border-[#0D4F4F]/15 rounded-xl px-4 py-3">
        <Phone size={16} className="text-[#0D4F4F] flex-shrink-0" />
        <p className="font-sans text-[#0D4F4F]/75 text-sm">
          You can also call or text us at{' '}
          <a
            href="tel:+12899923647"
            className="font-bold text-[#0D4F4F] hover:underline"
          >
            289-992-3647
          </a>
        </p>
      </div>

      {/* Name */}
      <div>
        <label className="text-xs font-sans text-[#0D4F4F]/80 uppercase tracking-widest mb-1.5 block">
          Full Name
        </label>
        <input
          type="text"
          placeholder="John Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-sans text-[#0D4F4F] focus:outline-none focus:border-[#0D4F4F] transition"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-xs font-sans text-[#0D4F4F]/80 uppercase tracking-widest mb-1.5 block">
          Email
        </label>
        <input
          type="email"
          placeholder="john@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-sans text-[#0D4F4F] focus:outline-none focus:border-[#0D4F4F] transition"
        />
      </div>

      {/* Subject */}
      <div>
        <label className="text-xs font-sans text-[#0D4F4F]/80 uppercase tracking-widest mb-1.5 block">
          Subject
        </label>
        <input
          type="text"
          placeholder="e.g. Question about local transit"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-sans text-[#0D4F4F] focus:outline-none focus:border-[#0D4F4F] transition"
        />
      </div>

      {/* Message body */}
      <div>
        <label className="text-xs font-sans text-[#0D4F4F]/80 uppercase tracking-widest mb-1.5 block">
          Message
        </label>
        <textarea
          placeholder="Write your message here…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={5}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-sans text-[#0D4F4F] focus:outline-none focus:border-[#0D4F4F] transition resize-none"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm font-sans bg-red-50 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-[#0D4F4F] text-white py-3.5 rounded-xl font-sans font-bold text-base hover:bg-[#1a6b6b] transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader size={18} className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Mail size={16} /> Send Message
          </>
        )}
      </button>

      <p className="text-center text-xs font-sans text-[#0D4F4F]/40">
        🔒 Your information is kept private and secure.
      </p>
    </form>
  )
}

export default function ContactModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal — wider than Donate */}
      <div className="relative bg-[#FAF7F2] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#0D4F4F]/10 hover:bg-[#0D4F4F]/20 rounded-full p-2 transition z-20"
        >
          <X size={18} className="text-[#0D4F4F]" />
        </button>

        <ContactForm onClose={onClose} />
      </div>
    </div>
  )
}