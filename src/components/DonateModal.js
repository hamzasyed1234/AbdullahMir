import { useState } from 'react'
import { X, Heart, Loader, CheckCircle } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL

const CARD_STYLE = {
  style: {
    base: {
      fontSize: '16px',
      fontFamily: '"DM Sans", sans-serif',
      color: '#0D4F4F',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
}

const PRESET_AMOUNTS = [10, 25, 50, 100]

function DonateForm({ onClose }) {
  const stripe = useStripe()
  const elements = useElements()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState(25)
  const [customAmount, setCustomAmount] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const finalAmount = useCustom ? parseFloat(customAmount) : amount

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    if (!name || !email || !finalAmount || finalAmount < 1) {
      setError('Please fill in all fields and enter a valid amount.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ amount: finalAmount, name, email }),
      })

      const { clientSecret, error: fnError } = await res.json()
      if (fnError) throw new Error(fnError)

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name, email },
        },
      })

      if (stripeError) {
        setError(stripeError.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
        <CheckCircle size={56} className="text-[#0D4F4F] mb-4" />
        <h2 className="font-serif text-[#0D4F4F] text-3xl font-bold mb-3">Thank You!</h2>
        <p className="font-sans text-[#0D4F4F]/70 text-base mb-2">
          Your donation of <strong>${finalAmount}</strong> has been received.
        </p>
        <p className="font-sans text-[#0D4F4F]/50 text-sm mb-8">
          A receipt has been sent to {email}.
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
      <div className="text-center mb-2">
        <div className="flex justify-center mb-3">
          <div className="bg-[#0D4F4F]/10 rounded-full p-3">
            <Heart size={24} className="text-[#0D4F4F]" />
          </div>
        </div>
        <h2 className="font-serif text-[#0D4F4F] text-3xl font-bold">Support Abdullah</h2>
        <p className="font-sans text-[#0D4F4F]/60 text-sm mt-1">Your donation helps build a stronger Ward 1</p>
        <p className="font-sans text-[#0D4F4F]/50 text-xs mt-1.5">
          Prefer e-Transfer? Send to{' '}
          <a href="mailto:abdullah93@gmail.com" className="text-[#0D4F4F] underline underline-offset-2 hover:text-[#1a6b6b] transition">
            votemirward1@gmail.com
          </a>
        </p>
      </div>

      {/* Preset amounts */}
      <div>
        <label className="text-xs font-sans text-[#0D4F4F]/80 uppercase tracking-widest mb-2 block">Select Amount</label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {PRESET_AMOUNTS.map(a => (
            <button
              key={a}
              type="button"
              onClick={() => { setAmount(a); setUseCustom(false) }}
              className={`py-2.5 rounded-xl font-sans font-semibold text-sm transition border-2 ${
                !useCustom && amount === a
                  ? 'bg-[#0D4F4F] text-white border-[#0D4F4F]'
                  : 'bg-white text-[#0D4F4F] border-[#0D4F4F]/20 hover:border-[#0D4F4F]/50'
              }`}
            >
              ${a}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUseCustom(true)}
            className={`text-xs font-sans px-3 py-1.5 rounded-lg border transition ${
              useCustom ? 'bg-[#0D4F4F] text-white border-[#0D4F4F]' : 'text-[#0D4F4F]/60 border-[#0D4F4F]/20 hover:border-[#0D4F4F]/40'
            }`}
          >
            Custom
          </button>
          {useCustom && (
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0D4F4F]/50 font-sans">$</span>
              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                className="w-full border-2 border-[#0D4F4F] rounded-xl pl-7 pr-4 py-2 font-sans text-[#0D4F4F] focus:outline-none"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="text-xs font-sans text-[#0D4F4F]/80 uppercase tracking-widest mb-1.5 block">Full Name</label>
        <input
          type="text"
          placeholder="John Smith"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-sans text-[#0D4F4F] focus:outline-none focus:border-[#0D4F4F] transition"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-xs font-sans text-[#0D4F4F]/80 uppercase tracking-widest mb-1.5 block">Email</label>
        <input
          type="email"
          placeholder="john@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-sans text-[#0D4F4F] focus:outline-none focus:border-[#0D4F4F] transition"
        />
      </div>

      {/* Card */}
      <div>
        <label className="text-xs font-sans text-[#0D4F4F]/80 uppercase tracking-widest mb-1.5 block">Card Details</label>
        <div className="border-2 border-gray-200 rounded-xl px-4 py-3.5 focus-within:border-[#0D4F4F] transition">
          <CardElement options={CARD_STYLE} />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm font-sans bg-red-50 rounded-xl px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="bg-[#0D4F4F] text-white py-3.5 rounded-xl font-sans font-bold text-base hover:bg-[#1a6b6b] transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader size={18} className="animate-spin" /> Processing…</>
        ) : (
          <><Heart size={16} /> Donate ${useCustom ? (customAmount || '0') : amount} CAD</>
        )}
      </button>

      <p className="text-center text-xs font-sans text-[#0D4F4F]/40">
        🔒 Secure payment powered by Stripe
      </p>
    </form>
  )
}

export default function DonateModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#FAF7F2] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#0D4F4F]/10 hover:bg-[#0D4F4F]/20 rounded-full p-2 transition z-20"
        >
          <X size={18} className="text-[#0D4F4F]" />
        </button>

        <Elements stripe={stripePromise}>
          <DonateForm onClose={onClose} />
        </Elements>
      </div>
    </div>
  )
}