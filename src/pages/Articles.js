import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Plus, Pencil, Trash2, Check, X, Heart, Eye } from 'lucide-react'

const TEAL = '#0D4F4F'
const CREAM = '#FAF7F2'

function getSessionId() {
  let id = localStorage.getItem('session_id')
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('session_id', id)
  }
  return id
}

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
        <h3 className="font-serif text-[#0D4F4F] text-2xl font-bold mb-6">
          {initial.id ? 'Edit Article' : 'New Article'}
        </h3>
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

function ArticleModal({ article, onClose, onLike, liked }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10">
        <button onClick={onClose} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition z-20">
          <X size={18} />
        </button>
        {article.image_url && (
          <img src={article.image_url} alt={article.title} className="w-full h-64 object-cover rounded-t-2xl" />
        )}
        <div className="p-8">
          <p className="font-sans text-xs uppercase tracking-widest text-[#0D4F4F]/40 mb-3">
            {new Date(article.published_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h2 className="font-serif text-[#0D4F4F] text-3xl font-bold mb-6">{article.title}</h2>
          <div className="font-sans text-[#0D4F4F]/80 text-base leading-relaxed whitespace-pre-line">{article.body}</div>
          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100">
            <button onClick={() => onLike(article.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-sans text-sm transition ${
                liked ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-400'
              }`}>
              <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
              {article.likes || 0} {article.likes === 1 ? 'Like' : 'Likes'}
            </button>
            <span className="flex items-center gap-2 text-sm text-[#0D4F4F]/40 font-sans">
              <Eye size={15} /> {article.views || 0} views
            </span>
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
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [likedArticles, setLikedArticles] = useState(new Set())
  const sessionId = getSessionId()

  const fetchArticles = async () => {
    const { data } = await supabase.from('articles').select('*').order('sort_order').order('published_at', { ascending: false })
    setArticles(data || [])
    setLoading(false)
  }

  const fetchLikes = useCallback(async () => {
  const { data } = await supabase
    .from('article_likes')
    .select('article_id')
    .eq('session_id', sessionId)

  if (data) {
    setLikedArticles(new Set(data.map(l => l.article_id)))
  }
}, [sessionId])

  useEffect(() => {
  fetchArticles()
  fetchLikes()
}, [fetchLikes])

  const openArticle = async (article) => {
    setSelectedArticle(article)
    await supabase.from('articles').update({ views: (article.views || 0) + 1 }).eq('id', article.id)
    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, views: (a.views || 0) + 1 } : a))
  }

  const handleLike = async (articleId) => {
    const already = likedArticles.has(articleId)
    const article = articles.find(a => a.id === articleId)
    if (!article) return
    if (already) {
      await supabase.from('article_likes').delete().eq('article_id', articleId).eq('session_id', sessionId)
      await supabase.from('articles').update({ likes: Math.max(0, (article.likes || 0) - 1) }).eq('id', articleId)
      setLikedArticles(prev => { const s = new Set(prev); s.delete(articleId); return s })
      setArticles(prev => prev.map(a => a.id === articleId ? { ...a, likes: Math.max(0, (a.likes || 0) - 1) } : a))
      if (selectedArticle?.id === articleId) setSelectedArticle(a => ({ ...a, likes: Math.max(0, (a.likes || 0) - 1) }))
    } else {
      await supabase.from('article_likes').insert([{ article_id: articleId, session_id: sessionId }])
      await supabase.from('articles').update({ likes: (article.likes || 0) + 1 }).eq('id', articleId)
      setLikedArticles(prev => new Set([...prev, articleId]))
      setArticles(prev => prev.map(a => a.id === articleId ? { ...a, likes: (a.likes || 0) + 1 } : a))
      if (selectedArticle?.id === articleId) setSelectedArticle(a => ({ ...a, likes: (a.likes || 0) + 1 }))
    }
  }

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

      {/* Header — cream bg, teal text, line underneath */}
      <div className="px-10 md:px-20 pt-16 pb-12 flex flex-col items-center text-center" style={{ background: CREAM }}>
        <span className="text-[#0D4F4F]/40 text-xs uppercase tracking-widest font-sans">Latest Updates</span>
        <h1 className="font-serif text-[#0D4F4F] text-5xl md:text-6xl font-bold mt-2 mb-4">Articles</h1>
        <div className="h-1 w-16 bg-[#0D4F4F] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-12">
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
              const liked = likedArticles.has(article.id)
              return (
                <div key={article.id} className="rounded-2xl overflow-hidden mb-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  style={{ background: isTeal ? TEAL : 'white' }}>
                  <div className="md:flex" onClick={() => openArticle(article)}>
                    {article.image_url && (
                      <div className="md:w-64 flex-shrink-0">
                        <img src={article.image_url} alt={article.title} className="w-full h-48 md:h-full object-cover" />
                      </div>
                    )}
                    <div className="p-8 flex-1">
                      <p className="font-sans text-xs uppercase tracking-widest mb-2"
                        style={{ color: isTeal ? 'rgba(250,247,242,0.5)' : 'rgba(13,79,79,0.4)' }}>
                        {new Date(article.published_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: isTeal ? CREAM : TEAL }}>
                        {article.title}
                      </h2>
                      <p className="font-sans text-base leading-relaxed mb-4"
                        style={{ color: isTeal ? 'rgba(250,247,242,0.8)' : 'rgba(13,79,79,0.7)' }}>
                        {article.body.slice(0, 200)}{article.body.length > 200 ? '…' : ''}
                      </p>
                      <div className="flex items-center gap-4">
                        <button onClick={e => { e.stopPropagation(); handleLike(article.id) }}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition font-sans ${
                            liked ? 'bg-red-500/20 text-red-400 border border-red-400/30'
                              : isTeal ? 'bg-white/10 text-white/60 border border-white/20 hover:bg-red-500/20 hover:text-red-300'
                              : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-red-50 hover:text-red-400'
                          }`}>
                          <Heart size={12} fill={liked ? 'currentColor' : 'none'} />
                          {article.likes || 0}
                        </button>
                        <span className="flex items-center gap-1.5 text-xs font-sans"
                          style={{ color: isTeal ? 'rgba(250,247,242,0.4)' : 'rgba(13,79,79,0.35)' }}>
                          <Eye size={12} /> {article.views || 0} views
                        </span>
                      </div>
                    </div>
                  </div>
                  {user && (
                    <div className="flex gap-3 px-8 pb-6" onClick={e => e.stopPropagation()}>
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
              )
            })}
          </div>
        )}
      </div>

      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} onLike={handleLike} liked={likedArticles.has(selectedArticle.id)} />
      )}
      {showForm && (
        <ArticleForm initial={editingArticle || {}} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingArticle(null) }} />
      )}
    </div>
  )
}