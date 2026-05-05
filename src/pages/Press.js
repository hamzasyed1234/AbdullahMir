import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Plus, Pencil, Trash2, Check, X, ExternalLink } from 'lucide-react'

const TEAL = '#0D4F4F'
const CREAM = '#FAF7F2'

function PressForm({ initial = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(initial.title || '')
  const [source, setSource] = useState(initial.source || '')
  const [url, setUrl] = useState(initial.url || '')
  const [body, setBody] = useState(initial.body || '')
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(initial.image_url || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    let finalUrl = imageUrl
    if (imageFile) {
      const fileName = `press-${Date.now()}.${imageFile.name.split('.').pop()}`
      const { error } = await supabase.storage.from('images').upload(fileName, imageFile, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('images').getPublicUrl(fileName)
        finalUrl = data.publicUrl
      }
    }
    await onSave({ title, source, url, body, image_url: finalUrl })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <h3 className="font-serif text-[#0D4F4F] text-2xl font-bold mb-6">{initial.id ? 'Edit Press Item' : 'New Press Item'}</h3>
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Headline / Title" value={title} onChange={e => setTitle(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]" />
          <input type="text" placeholder="Source (e.g. Toronto Star)" value={source} onChange={e => setSource(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]" />
          <input type="url" placeholder="URL (optional)" value={url} onChange={e => setUrl(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]" />
          <textarea placeholder="Summary / excerpt…" value={body} onChange={e => setBody(e.target.value)} rows={5}
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F] resize-none" />
          <div>
            <label className="text-sm font-sans text-gray-500 mb-1 block">Image</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="text-sm font-sans" />
          </div>
          <div className="flex gap-3 justify-end mt-2">
            <button onClick={onCancel} className="border border-gray-200 px-5 py-2 rounded-xl font-sans text-sm flex items-center gap-1">
              <X size={14} /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="bg-[#0D4F4F] text-white px-5 py-2 rounded-xl font-sans text-sm flex items-center gap-1">
              <Check size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Press() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const fetchPress = async () => {
    const { data } = await supabase.from('press').select('*').order('sort_order').order('published_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPress() }, [])

  const handleSave = async (fields) => {
    if (editingItem) {
      await supabase.from('press').update(fields).eq('id', editingItem.id)
    } else {
      await supabase.from('press').insert([{ ...fields, sort_order: items.length }])
    }
    setShowForm(false)
    setEditingItem(null)
    fetchPress()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this press item?')) return
    await supabase.from('press').delete().eq('id', id)
    fetchPress()
  }

  return (
    <div className="pt-20 min-h-screen" style={{ background: CREAM }}>
      <div className="py-16 px-6 text-center" style={{ background: TEAL }}>
        <span className="text-white/50 text-xs uppercase tracking-widest font-sans">In The News</span>
        <h1 className="font-serif text-white text-5xl font-bold mt-2">Press</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {user && (
          <div className="flex justify-end mb-8">
            <button onClick={() => { setEditingItem(null); setShowForm(true) }}
              className="flex items-center gap-2 bg-[#0D4F4F] text-white px-5 py-2.5 rounded-xl font-sans text-sm hover:bg-[#1a6b6b] transition">
              <Plus size={16} /> Add Press Item
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-center font-sans text-[#0D4F4F]/50">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-center font-sans text-[#0D4F4F]/50">No press items yet.</p>
        ) : (
          <div>
            {items.map((item, i) => {
              const isTeal = i % 2 === 1
              return (
                <div key={item.id} className="rounded-2xl overflow-hidden mb-6 shadow-sm"
                  style={{ background: isTeal ? TEAL : 'white' }}>
                  <div className="md:flex">
                    {item.image_url && (
                      <div className="md:w-56 flex-shrink-0">
                        <img src={item.image_url} alt={item.title} className="w-full h-40 md:h-full object-cover" />
                      </div>
                    )}
                    <div className="p-8 flex-1">
                      {item.source && (
                        <p className="font-sans text-xs uppercase tracking-widest mb-2 font-semibold"
                          style={{ color: isTeal ? 'rgba(250,247,242,0.6)' : 'rgba(13,79,79,0.5)' }}>
                          {item.source} · {new Date(item.published_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      )}
                      <h2 className="font-serif text-xl font-bold mb-3" style={{ color: isTeal ? CREAM : TEAL }}>
                        {item.title}
                      </h2>
                      {item.body && (
                        <p className="font-sans text-sm leading-relaxed mb-3" style={{ color: isTeal ? 'rgba(250,247,242,0.75)' : 'rgba(13,79,79,0.7)' }}>
                          {item.body}
                        </p>
                      )}
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-sans font-semibold"
                          style={{ color: isTeal ? CREAM : TEAL }}>
                          Read Full Story <ExternalLink size={12} />
                        </a>
                      )}
                      {user && (
                        <div className="flex gap-3 mt-4">
                          <button onClick={() => { setEditingItem(item); setShowForm(true) }}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-sans"
                            style={{ borderColor: isTeal ? 'rgba(250,247,242,0.3)' : 'rgba(13,79,79,0.3)', color: isTeal ? CREAM : TEAL }}>
                            <Pencil size={12} /> Edit
                          </button>
                          <button onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-sans text-red-400 border-red-200">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && (
        <PressForm
          initial={editingItem || {}}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingItem(null) }}
        />
      )}
    </div>
  )
}