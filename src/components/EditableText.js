import { useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

export default function EditableText({ page, contentKey, value, onUpdate, className = '', multiline = false }) {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('page_content')
      .upsert({ page, key: contentKey, value: draft, updated_at: new Date() }, { onConflict: 'page,key' })
    setSaving(false)
    if (!error) { onUpdate(draft); setEditing(false) }
  }

  if (!user) return <span className={className}>{value}</span>

  return (
    <span className={`relative group ${className}`}>
      {editing ? (
        <span className="flex flex-col gap-2">
          {multiline
            ? <textarea className="border border-teal rounded p-2 w-full min-h-[120px] text-teal bg-cream font-sans text-base" value={draft} onChange={e => setDraft(e.target.value)} />
            : <input className="border border-teal rounded p-2 w-full text-teal bg-cream font-sans text-base" value={draft} onChange={e => setDraft(e.target.value)} />
          }
          <span className="flex gap-2">
            <button onClick={save} disabled={saving} className="flex items-center gap-1 bg-teal text-cream px-3 py-1 rounded text-sm">
              <Check size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => { setDraft(value); setEditing(false) }} className="flex items-center gap-1 border border-teal text-teal px-3 py-1 rounded text-sm">
              <X size={14} /> Cancel
            </button>
          </span>
        </span>
      ) : (
        <span className="flex items-start gap-2">
          <span>{value}</span>
          <button onClick={() => setEditing(true)} className="opacity-0 group-hover:opacity-100 transition text-teal hover:text-teal-light mt-1">
            <Pencil size={14} />
          </button>
        </span>
      )}
    </span>
  )
}