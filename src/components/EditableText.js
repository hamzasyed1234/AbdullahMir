import { useState, useEffect } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

// Renders text with \n as actual line breaks
function WithLineBreaks({ value }) {
  if (!value) return null
  const lines = value.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

export default function EditableText({ page, contentKey, value, onUpdate, className = '', multiline = false }) {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setDraft(value)
  }, [value])

  const save = async () => {
    setSaving(true)
    setError('')

    const { error: supabaseError } = await supabase
      .from('page_content')
      .upsert(
        { page, key: contentKey, value: draft, updated_at: new Date().toISOString() },
        { onConflict: 'page,key' }
      )

    setSaving(false)

    if (supabaseError) {
      console.error('Save error:', supabaseError)
      setError('Failed to save: ' + supabaseError.message)
    } else {
      onUpdate(draft)
      setEditing(false)
    }
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
    setError('')
  }

  // Not admin — render with line breaks
  if (!user) {
    return (
      <span className={className}>
        {multiline ? <WithLineBreaks value={value} /> : value}
      </span>
    )
  }

  if (editing) {
    return (
      <span className="flex flex-col gap-2 w-full">
        {multiline ? (
          <textarea
            className="border-2 border-[#0D4F4F] rounded-xl p-3 w-full min-h-[120px] text-[#0D4F4F] bg-white font-sans text-base focus:outline-none focus:ring-2 focus:ring-[#0D4F4F]/30 resize-y"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
          />
        ) : (
          <input
            className="border-2 border-[#0D4F4F] rounded-xl p-3 w-full text-[#0D4F4F] bg-white font-sans text-base focus:outline-none focus:ring-2 focus:ring-[#0D4F4F]/30"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
          />
        )}
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <span className="flex gap-2">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1 bg-[#0D4F4F] text-white px-4 py-1.5 rounded-lg text-sm font-sans hover:bg-[#1a6b6b] transition disabled:opacity-50"
          >
            <Check size={14} /> {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={cancel}
            className="flex items-center gap-1 border border-[#0D4F4F] text-[#0D4F4F] px-4 py-1.5 rounded-lg text-sm font-sans hover:bg-[#0D4F4F]/10 transition"
          >
            <X size={14} /> Cancel
          </button>
        </span>
      </span>
    )
  }

  // Admin not editing — show text with pencil on hover, with line breaks
  return (
    <span className={`group relative inline-block ${className}`}>
      <span
        className="border-2 border-dashed border-[#0D4F4F]/25 rounded-lg px-2 py-1 block hover:border-[#0D4F4F]/60 hover:bg-[#0D4F4F]/5 transition-all cursor-text"
        onClick={() => { setDraft(value); setEditing(true) }}
      >
        {multiline ? <WithLineBreaks value={value} /> : value}
        <span className="inline-flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition bg-[#0D4F4F] text-white text-xs px-2 py-0.5 rounded-md font-sans align-middle">
          <Pencil size={10} /> Edit
        </span>
      </span>
    </span>
  )
}