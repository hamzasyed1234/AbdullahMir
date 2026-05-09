import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'

const TEAL = '#0D4F4F'
const CREAM = '#FAF7F2'

function ArticleForm({ initial = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(initial.title || '')
  const [body, setBody] = useState(initial.body || '')
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl] = useState(initial.image_url || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    let finalUrl = imageUrl
    if (imageFile) {
      const fileName = `article-${Date.now()}.${imageFile.name.split('.').pop()}`
      const { error } = await supabase.storage.from('images').upload(fileName, imageFile, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('images').getPublicUrl(fileName)
        finalUrl = data.publicUrl
      }
    }
    await onSave({ title, body, image_url: finalUrl })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <h3 className="font-serif text-[#0D4F4F] text-2xl font-bold mb-6">{initial.id ? 'Edit Article' : 'New Article'}</h3>
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]" />
          <textarea placeholder="Article body…" value={body} onChange={e => setBody(e.target.value)} rows={8}
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F] resize-none" />
          <div>
            <label className="text-sm font-sans text-gray-500 mb-1 block">Image</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="text-sm font-sans" />
            {(imageUrl && !imageFile) && <img src={imageUrl} alt="preview" className="mt-2 h-24 rounded-lg object-cover" />}
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

export default function Articles() {
  const { user } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)

  const fetchArticles = async () => {
    const { data } = await supabase.from('articles').select('*').order('sort_order').order('published_at', { ascending: false })
    setArticles(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchArticles() }, [])

  const handleSave = async (fields) => {
    if (editingArticle) {
      await supabase.from('articles').update(fields).eq('id', editingArticle.id)
    } else {
      await supabase.from('articles').insert([{ ...fields, sort_order: articles.length }])
    }
    setShowForm(false)
    setEditingArticle(null)
    fetchArticles()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return
    await supabase.from('articles').delete().eq('id', id)
    fetchArticles()
  }

  return (
    <div className="pt-20 min-h-screen" style={{ background: CREAM }}>
      <div className="py-16 px-6 text-center" style={{ background: TEAL }}>
        <span className="text-white/50 text-xs uppercase tracking-widest font-sans">Latest Updates</span>
        <h1 className="font-serif text-white text-5xl font-bold mt-2">Articles</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {user && (
          <div className="flex justify-end mb-8">
            <button onClick={() => { setEditingArticle(null); setShowForm(true) }}
              className="flex items-center gap-2 bg-[#0D4F4F] text-white px-5 py-2.5 rounded-xl font-sans text-sm hover:bg-[#1a6b6b] transition">
              <Plus size={16} /> New Article
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-center font-sans text-[#0D4F4F]/50">Loading…</p>
        ) : articles.length === 0 ? (
          <p className="text-center font-sans text-[#0D4F4F]/50">No articles yet.</p>
        ) : (
          <div>
            {articles.map((article, i) => {
              const isTeal = i % 2 === 1
              return (
                <div key={article.id} className="rounded-2xl overflow-hidden mb-6 shadow-sm"
                  style={{ background: isTeal ? TEAL : 'white' }}>
                  <div className="md:flex">
                    {article.image_url && (
                      <div className="md:w-64 flex-shrink-0">
                        <img src={article.image_url} alt={article.title} className="w-full h-48 md:h-full object-cover" />
                      </div>
                    )}
                    <div className="p-8 flex-1">
                      <p className="font-sans text-xs uppercase tracking-widest mb-2" style={{ color: isTeal ? 'rgba(250,247,242,0.5)' : 'rgba(13,79,79,0.4)' }}>
                        {new Date(article.published_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: isTeal ? CREAM : TEAL }}>
                        {article.title}
                      </h2>
                      <p className="font-sans text-base leading-relaxed" style={{ color: isTeal ? 'rgba(250,247,242,0.8)' : 'rgba(13,79,79,0.7)' }}>
                        {article.body.slice(0, 300)}{article.body.length > 300 ? '…' : ''}
                      </p>
                      {user && (
                        <div className="flex gap-3 mt-4">
                          <button onClick={() => { setEditingArticle(article); setShowForm(true) }}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-sans"
                            style={{ borderColor: isTeal ? 'rgba(250,247,242,0.3)' : 'rgba(13,79,79,0.3)', color: isTeal ? CREAM : TEAL }}>
                            <Pencil size={12} /> Edit
                          </button>
                          <button onClick={() => handleDelete(article.id)}
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
        <ArticleForm
          initial={editingArticle || {}}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingArticle(null) }}
        />
      )}
    </div>
  )
}