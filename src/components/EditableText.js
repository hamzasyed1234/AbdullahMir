import { useState, useEffect, useRef } from 'react'
import { Pencil, Check, X, Bold, Italic, Underline } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

// Renders stored markdown-lite: **bold**, *italic*, _underline_, \n line breaks
function RenderFormatted({ value }) {
  if (!value) return null

  const lines = value.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {parseInline(line)}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

function parseInline(text) {
  // Parse **bold**, *italic*, _underline_ — in that order
  const parts = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_)/g
  let last = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))

    if (match[2] !== undefined) {
      parts.push(<strong key={match.index}>{match[2]}</strong>)
    } else if (match[3] !== undefined) {
      parts.push(<em key={match.index}>{match[3]}</em>)
    } else if (match[4] !== undefined) {
      parts.push(<u key={match.index}>{match[4]}</u>)
    }

    last = match.index + match[0].length
  }

  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function FormatToolbar({ textareaRef, draft, setDraft }) {
  const wrap = (before, after) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = draft.slice(start, end)
    const newText = draft.slice(0, start) + before + selected + after + draft.slice(end)
    setDraft(newText)
    // Restore cursor after state update
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  return (
    <div className="flex gap-1 border border-[#0D4F4F]/20 rounded-lg p-1 bg-[#0D4F4F]/5 w-fit">
      <button
        type="button"
        onMouseDown={e => { e.preventDefault(); wrap('**', '**') }}
        className="p-1.5 rounded hover:bg-[#0D4F4F]/10 text-[#0D4F4F] transition"
        title="Bold (**text**)"
      >
        <Bold size={14} />
      </button>
      <button
        type="button"
        onMouseDown={e => { e.preventDefault(); wrap('*', '*') }}
        className="p-1.5 rounded hover:bg-[#0D4F4F]/10 text-[#0D4F4F] transition"
        title="Italic (*text*)"
      >
        <Italic size={14} />
      </button>
      <button
        type="button"
        onMouseDown={e => { e.preventDefault(); wrap('_', '_') }}
        className="p-1.5 rounded hover:bg-[#0D4F4F]/10 text-[#0D4F4F] transition"
        title="Underline (_text_)"
      >
        <Underline size={14} />
      </button>
      <div className="w-px bg-[#0D4F4F]/20 mx-0.5" />
      <span className="text-[10px] text-[#0D4F4F]/40 font-sans self-center px-1">
        Select text then click
      </span>
    </div>
  )
}

export default function EditableText({ page, contentKey, value, onUpdate, className = '', multiline = false, renderValue }) {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef(null)

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

  // Non-admin: render formatted
  if (!user) {
    const rendered = renderValue ? renderValue(value) : <RenderFormatted value={value} />
    return <span className={className}>{multiline ? rendered : (renderValue ? rendered : value)}</span>
  }

  if (editing) {
    return (
      <span className="flex flex-col gap-2 w-full">
        {multiline && (
          <FormatToolbar textareaRef={textareaRef} draft={draft} setDraft={setDraft} />
        )}
        {multiline ? (
          <textarea
            ref={textareaRef}
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
        {multiline && (
          <p className="text-[10px] text-[#0D4F4F]/40 font-sans -mt-1">
            **bold** &nbsp;·&nbsp; *italic* &nbsp;·&nbsp; _underline_ &nbsp;·&nbsp; Enter = line break
          </p>
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

  // Admin not editing
  return (
    <span className={`group relative inline-block ${className}`}>
      <span
        className="border-2 border-dashed border-[#0D4F4F]/25 rounded-lg px-2 py-1 block hover:border-[#0D4F4F]/60 hover:bg-[#0D4F4F]/5 transition-all cursor-text"
        onClick={() => { setDraft(value); setEditing(true) }}
      >
        {multiline ? <RenderFormatted value={value} /> : value}
        <span className="inline-flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition bg-[#0D4F4F] text-white text-xs px-2 py-0.5 rounded-md font-sans align-middle">
          <Pencil size={10} /> Edit
        </span>
      </span>
    </span>
  )
}