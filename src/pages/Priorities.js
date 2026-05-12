import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'

function PriorityForm({ initial = {}, onSave, onCancel }) {
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
          {initial.id ? 'Edit Priority' : 'New Priority'}
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-sans text-gray-500 mb-1 block">Emoji Icon</label>
            <input
              type="text"
              placeholder="e.g. 🏠"
              value={icon}
              onChange={e => setIcon(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F] w-full text-2xl"
            />
          </div>
          <input
            type="text"
            placeholder="Title (e.g. Affordable Housing)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]"
          />
          <textarea
            placeholder="Description…"
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={4}
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F] resize-none"
          />
          <div className="flex gap-3 justify-end mt-2">
            <button onClick={onCancel} className="border border-gray-200 px-5 py-2 rounded-xl font-sans text-sm flex items-center gap-1 hover:bg-gray-50">
              <X size={14} /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="bg-[#0D4F4F] text-white px-5 py-2 rounded-xl font-sans text-sm flex items-center gap-1 hover:bg-[#1a6b6b] transition disabled:opacity-50">
              <Check size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Priorities() {
  const { user } = useAuth()
  const [priorities, setPriorities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => { fetchPriorities() }, [])

  const fetchPriorities = async () => {
    const { data } = await supabase.from('priorities').select('*').order('sort_order')
    setPriorities(data || [])
    setLoading(false)
  }

  const handleSave = async (fields) => {
    if (editingItem) {
      await supabase.from('priorities').update(fields).eq('id', editingItem.id)
    } else {
      await supabase.from('priorities').insert([{ ...fields, sort_order: priorities.length }])
    }
    setShowForm(false)
    setEditingItem(null)
    fetchPriorities()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this priority?')) return
    await supabase.from('priorities').delete().eq('id', id)
    fetchPriorities()
  }

  return (
    <div className="pt-20 min-h-screen bg-[#FAF7F2]">

      {/* Header — cream bg, teal text, line underneath */}
      <div className="bg-[#FAF7F2] px-10 md:px-20 pt-16 pb-12 flex flex-col items-center text-center">
        <span className="text-[#0D4F4F]/40 text-xs uppercase tracking-widest font-sans">What Matters</span>
        <h1 className="font-serif text-[#0D4F4F] text-5xl md:text-6xl font-bold mt-2 mb-4">Priorities</h1>
        <div className="h-1 w-16 bg-[#0D4F4F] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {user && (
          <div className="flex justify-end mb-8">
            <button
              onClick={() => { setEditingItem(null); setShowForm(true) }}
              className="flex items-center gap-2 bg-[#0D4F4F] text-white px-5 py-2.5 rounded-xl font-sans text-sm hover:bg-[#1a6b6b] transition"
            >
              <Plus size={16} /> Add Priority
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-center text-[#0D4F4F]/40 font-sans">Loading…</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {priorities.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-8 shadow-sm border border-[#0D4F4F]/10 hover:shadow-md transition flex flex-col">
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="font-serif text-[#0D4F4F] text-xl font-bold mb-3">{p.title}</h3>
                <p className="font-sans text-[#0D4F4F]/70 text-sm leading-relaxed flex-1">{p.body}</p>
                {user && (
                  <div className="flex gap-2 mt-5 pt-4 border-t border-[#0D4F4F]/10">
                    <button onClick={() => { setEditingItem(p); setShowForm(true) }}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-[#0D4F4F]/20 text-[#0D4F4F] font-sans hover:bg-[#0D4F4F]/5 transition">
                      <Pencil size={11} /> Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-400 font-sans hover:bg-red-50 transition">
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <PriorityForm
          initial={editingItem || {}}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingItem(null) }}
        />
      )}
    </div>
  )
}