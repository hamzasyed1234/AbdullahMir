import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Plus, Pencil, Trash2, Check, X, ExternalLink, Link, Loader } from 'lucide-react'

const CREAM = '#FAF7F2'

async function fetchLinkPreview(url) {
  try {
    const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=true`)
    const data = await res.json()
    if (data.status === 'success') {
      return {
        title: data.data.title || '',
        description: data.data.description || '',
        image: data.data.image?.url || data.data.screenshot?.url || '',
        publisher: data.data.publisher || new URL(url).hostname.replace('www.', ''),
      }
    }
  } catch (e) {}
  return null
}

function PressForm({ initial = {}, onSave, onCancel }) {
  const [url, setUrl] = useState(initial.url || '')
  const [title, setTitle] = useState(initial.title || '')
  const [source, setSource] = useState(initial.source || '')
  const [body, setBody] = useState(initial.body || '')
  const [previewImage, setPreviewImage] = useState(initial.preview_image || '')
  const [fetching, setFetching] = useState(false)
  const [fetched, setFetched] = useState(!!initial.title)
  const [saving, setSaving] = useState(false)

  const handleFetch = async () => {
    if (!url) return
    setFetching(true)
    const preview = await fetchLinkPreview(url)
    if (preview) {
      setTitle(preview.title)
      setSource(preview.publisher)
      setBody(preview.description)
      setPreviewImage(preview.image)
      setFetched(true)
    }
    setFetching(false)
  }

  const handleSave = async () => {
    if (!url || !title) return
    setSaving(true)
    await onSave({ url, title, source, body, preview_image: previewImage, image_url: previewImage })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <h3 className="font-serif text-[#0D4F4F] text-2xl font-bold mb-6">
          {initial.id ? 'Edit Press Item' : 'Add Press Item'}
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-sans text-gray-500 mb-1 block">Article URL</label>
            <div className="flex gap-2">
              <input type="url" placeholder="https://toronto-star.com/article..." value={url}
                onChange={e => { setUrl(e.target.value); setFetched(false) }}
                className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F] flex-1" />
              <button onClick={handleFetch} disabled={fetching || !url}
                className="bg-[#0D4F4F] text-white px-4 py-3 rounded-xl font-sans text-sm flex items-center gap-2 hover:bg-[#1a6b6b] transition disabled:opacity-50 whitespace-nowrap">
                {fetching ? <Loader size={14} className="animate-spin" /> : <Link size={14} />}
                {fetching ? 'Fetching…' : 'Fetch Preview'}
              </button>
            </div>
          </div>
          {previewImage && (
            <div className="rounded-xl overflow-hidden border border-gray-100">
              <img src={previewImage} alt="preview" className="w-full h-40 object-cover" />
            </div>
          )}
          {fetched && (
            <>
              <input type="text" placeholder="Headline / Title" value={title} onChange={e => setTitle(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]" />
              <input type="text" placeholder="Source (e.g. Toronto Star)" value={source} onChange={e => setSource(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]" />
              <textarea placeholder="Description / excerpt…" value={body} onChange={e => setBody(e.target.value)} rows={3}
                className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F] resize-none" />
            </>
          )}
          <div className="flex gap-3 justify-end mt-2">
            <button onClick={onCancel} className="border border-gray-200 px-5 py-2 rounded-xl font-sans text-sm flex items-center gap-1 hover:bg-gray-50">
              <X size={14} /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving || !fetched}
              className="bg-[#0D4F4F] text-white px-5 py-2 rounded-xl font-sans text-sm flex items-center gap-1 hover:bg-[#1a6b6b] transition disabled:opacity-50">
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

      {/* Header — cream bg, teal text, line underneath */}
      <div className="px-10 md:px-20 pt-16 pb-12 flex flex-col items-center text-center" style={{ background: CREAM }}>
        <span className="text-[#0D4F4F]/40 text-xs uppercase tracking-widest font-sans">In The News</span>
        <h1 className="font-serif text-[#0D4F4F] text-5xl md:text-6xl font-bold mt-2 mb-4">Press</h1>
        <div className="h-1 w-16 bg-[#0D4F4F] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col rounded-2xl overflow-hidden shadow-sm bg-white border border-[#0D4F4F]/10 hover:shadow-lg transition group">
                <a href={item.url} target="_blank" rel="noreferrer" className="block flex-shrink-0">
                  {item.preview_image || item.image_url ? (
                    <img src={item.preview_image || item.image_url} alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-48 bg-[#0D4F4F]/10 flex items-center justify-center">
                      <ExternalLink size={32} className="text-[#0D4F4F]/20" />
                    </div>
                  )}
                </a>
                <div className="p-5 flex flex-col flex-1">
                  {item.source && (
                    <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[#0D4F4F]/40 mb-2">{item.source}</p>
                  )}
                  <a href={item.url} target="_blank" rel="noreferrer"
                    className="font-serif text-[#0D4F4F] text-lg font-bold leading-snug mb-2 hover:underline">
                    {item.title}
                  </a>
                  {item.body && (
                    <p className="font-sans text-sm text-[#0D4F4F]/60 leading-relaxed flex-1">
                      {item.body.slice(0, 120)}{item.body.length > 120 ? '…' : ''}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#0D4F4F]/10">
                    <a href={item.url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-sans font-semibold text-[#0D4F4F] hover:underline">
                      Read Full Story <ExternalLink size={11} />
                    </a>
                    {user && (
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingItem(item); setShowForm(true) }}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-[#0D4F4F]/20 text-[#0D4F4F] font-sans hover:bg-[#0D4F4F]/5">
                          <Pencil size={10} /> Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-red-200 text-red-400 font-sans hover:bg-red-50">
                          <Trash2 size={10} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <PressForm initial={editingItem || {}} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingItem(null) }} />
      )}
    </div>
  )
}