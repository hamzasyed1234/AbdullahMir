import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'

// Renders **bold**, *italic*, _underline_, \n line breaks
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
  const parts = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_)/g
  let last = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    if (match[2] !== undefined) parts.push(<strong key={match.index}>{match[2]}</strong>)
    else if (match[3] !== undefined) parts.push(<em key={match.index}>{match[3]}</em>)
    else if (match[4] !== undefined) parts.push(<u key={match.index}>{match[4]}</u>)
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function PlatformForm({ initial = {}, onSave, onCancel }) {
  const [icon, setIcon] = useState(initial.icon || '⭐')
  const [title, setTitle] = useState(initial.title || '')
  const [body, setBody] = useState(initial.body || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title || !body) return
    setSaving(true)
    await onSave({ icon, title, body })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h3 className="font-serif text-[#0D4F4F] text-2xl font-bold mb-6">
          {initial.id ? 'Edit Platform Item' : 'New Platform Item'}
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-sans text-gray-500 mb-1 block">Emoji Icon</label>
            <input type="text" placeholder="e.g. 🏠" value={icon} onChange={e => setIcon(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F] w-full text-2xl" />
          </div>
          <input type="text" placeholder="Title (e.g. Affordable Housing)" value={title} onChange={e => setTitle(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]" />
          <textarea placeholder="Description…" value={body} onChange={e => setBody(e.target.value)} rows={4} className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F] resize-none" />
          <p className="text-[10px] text-gray-400 font-sans -mt-2">**bold** · *italic* · _underline_ · Enter = line break</p>
          <div className="flex gap-3 justify-end mt-2">
            <button onClick={onCancel} className="border border-gray-200 px-5 py-2 rounded-xl font-sans text-sm flex items-center gap-1 hover:bg-gray-50">
              <X size={14} /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="bg-[#0D4F4F] text-white px-5 py-2 rounded-xl font-sans text-sm flex items-center gap-1 hover:bg-[#1a6b6b] transition disabled:opacity-50">
              <Check size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlatformModal({ priority, onClose }) {
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg md:max-w-3xl relative flex flex-col"
        style={{
          maxHeight: '90vh',
          animation: 'slideUp 0.25s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Sticky header */}
        <div className="flex-shrink-0 px-8 md:px-12 pt-8 md:pt-10 pb-4">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#0D4F4F]/40 hover:text-[#0D4F4F] transition rounded-full p-1 hover:bg-[#0D4F4F]/10"
          >
            <X size={20} />
          </button>
          <div className="text-5xl mb-5">{priority.icon}</div>
          <h2 className="font-serif text-[#0D4F4F] text-3xl font-bold mb-4 leading-tight">
            {priority.title}
          </h2>
          <div className="h-1 w-12 bg-[#0D4F4F] rounded-full" />
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-8 md:px-12 pb-10 flex-1">
          <p className="font-sans text-[#0D4F4F]/75 text-base leading-relaxed">
            <RenderFormatted value={priority.body} />
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default function Platform() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    const { data } = await supabase.from('priorities').select('*').order('sort_order')
    setItems(data || [])
    setLoading(false)
  }

  const handleSave = async (fields) => {
    if (editingItem) {
      await supabase.from('priorities').update(fields).eq('id', editingItem.id)
    } else {
      await supabase.from('priorities').insert([{ ...fields, sort_order: items.length }])
    }
    setShowForm(false)
    setEditingItem(null)
    fetchItems()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this platform item?')) return
    await supabase.from('priorities').delete().eq('id', id)
    fetchItems()
  }

  return (
    <div className="pt-20 min-h-screen bg-[#FAF7F2]">

      {/* Header */}
      <div className="bg-[#FAF7F2] px-10 md:px-20 pt-16 pb-12 flex flex-col items-center text-center">
        <span className="text-[#0D4F4F]/40 text-xs uppercase tracking-widest font-sans">What Matters</span>
        <h1 className="font-serif text-[#0D4F4F] text-5xl md:text-6xl font-bold mt-2 mb-4">Platform</h1>
        <div className="h-1 w-16 bg-[#0D4F4F] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {user && (
          <div className="flex justify-end mb-8">
            <button
              onClick={() => { setEditingItem(null); setShowForm(true) }}
              className="flex items-center gap-2 bg-[#0D4F4F] text-white px-5 py-2.5 rounded-xl font-sans text-sm hover:bg-[#1a6b6b] transition"
            >
              <Plus size={16} /> Add Platform Item
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-center text-[#0D4F4F]/40 font-sans">Loading…</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <div
                key={p.id}
                onClick={() => !user && setSelectedItem(p)}
                className={`bg-white rounded-2xl p-8 shadow-sm border border-[#0D4F4F]/10 hover:shadow-md transition flex flex-col group ${!user ? 'cursor-pointer hover:-translate-y-1 hover:border-[#0D4F4F]/30' : ''}`}
                style={{ transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s' }}
              >
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="font-serif text-[#0D4F4F] text-xl font-bold mb-3">{p.title}</h3>
                <p className="font-sans text-[#0D4F4F]/70 text-sm leading-relaxed flex-1 line-clamp-3">
                  <RenderFormatted value={p.body} />
                </p>

                {!user && (
                  <p className="text-[#0D4F4F]/40 text-xs font-sans mt-4 group-hover:text-[#0D4F4F]/70 transition">
                    Tap to read more →
                  </p>
                )}

                {user && (
                  <div className="flex gap-2 mt-5 pt-4 border-t border-[#0D4F4F]/10">
                    <button
                      onClick={() => { setEditingItem(p); setShowForm(true) }}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-[#0D4F4F]/20 text-[#0D4F4F] font-sans hover:bg-[#0D4F4F]/5 transition"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-400 font-sans hover:bg-red-50 transition"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <PlatformModal
          priority={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {showForm && (
        <PlatformForm
          initial={editingItem || {}}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingItem(null) }}
        />
      )}
    </div>
  )
}