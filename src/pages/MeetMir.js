import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import EditableText from '../components/EditableText'
import { useAuth } from '../context/AuthContext'
import { Pencil, Plus, Trash2, Check, X } from 'lucide-react'

const DEFAULT_INTRO = `My name is Abdullah Mir, and I am running to be your City Councillor for Ward 1. I'm a community builder and a dedicated advocate for residents.

I have proudly called the Rougemount community home for the past decade, and I've spent years working alongside neighbours to make our community stronger by co-founding the Rougemount Community and Recreation Association, serving on the Pickering Public Library Board, helping iTrust Community Centre find a permanent home on Kingston Road, and leading the fight against sprawl development during the Greenbelt scandal as co-chair of Stop Sprawl Durham.

I'm running for city council because I believe Pickering should be a place you can afford to live, feel safe, and be proud of at every stage of life. That means strong, healthy neighbourhoods where families can put down roots, seniors can grow old close to the people they love, and kids have parks and programs to thrive.

This election isn't about me — it's about you and the community you want to build. Over the next 6 months, I will be visiting every household in this ward to talk to you directly.

I want to hear from you: votemirward1@gmail.com or 289-992-3647.

We can build a stronger city together. I'm here to work for you!`

function CommunityForm({ initial = {}, onSave, onCancel }) {
  const [role, setRole] = useState(initial.role || '')
  const [org, setOrg] = useState(initial.org || '')
  const [periodStart, setPeriodStart] = useState(initial.period_start || '')
  const [periodEnd, setPeriodEnd] = useState(initial.period_end || 'Present')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!role || !org || !periodStart) return
    setSaving(true)
    await onSave({ role, org, period_start: periodStart, period_end: periodEnd })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h3 className="font-serif text-[#0D4F4F] text-2xl font-bold mb-6">
          {initial.id ? 'Edit Involvement' : 'Add Involvement'}
        </h3>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Role (e.g. Co-Chair)"
            value={role}
            onChange={e => setRole(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]"
          />
          <input
            type="text"
            placeholder="Organization"
            value={org}
            onChange={e => setOrg(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]"
          />
          <input
            type="text"
            placeholder="Start (e.g. December 2022)"
            value={periodStart}
            onChange={e => setPeriodStart(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]"
          />
          <input
            type="text"
            placeholder="End (e.g. Present or June 2024)"
            value={periodEnd}
            onChange={e => setPeriodEnd(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]"
          />
          <div className="flex gap-3 justify-end mt-2">
            <button
              onClick={onCancel}
              className="border border-gray-200 px-5 py-2 rounded-xl font-sans text-sm flex items-center gap-1 hover:bg-gray-50"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#0D4F4F] text-white px-5 py-2 rounded-xl font-sans text-sm flex items-center gap-1 hover:bg-[#1a6b6b] transition disabled:opacity-50"
            >
              <Check size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MeetMir() {
  const { user } = useAuth()
  const [content, setContent] = useState({ about_intro: DEFAULT_INTRO })
  const [photo, setPhoto] = useState('/DSCF4950.jpg')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [community, setCommunity] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    supabase.from('page_content').select('*').eq('page', 'meet').then(({ data }) => {
      if (data) {
        const map = {}
        data.forEach(r => { map[r.key] = r.value })
        setContent(prev => ({ ...prev, ...map }))
        if (map.photo_url) setPhoto(map.photo_url)
      }
    })
    fetchCommunity()
  }, [])

  const fetchCommunity = async () => {
    const { data } = await supabase
      .from('community_involvement')
      .select('*')
      .order('sort_order')
    setCommunity(data || [])
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingPhoto(true)
    const fileName = `meet-photo-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      const url = data.publicUrl
      setPhoto(url)
      await supabase.from('page_content').upsert(
        { page: 'meet', key: 'photo_url', value: url, updated_at: new Date() },
        { onConflict: 'page,key' }
      )
    }
    setUploadingPhoto(false)
  }

  const handleSave = async (fields) => {
    if (editingItem) {
      await supabase.from('community_involvement').update(fields).eq('id', editingItem.id)
    } else {
      await supabase.from('community_involvement').insert([{ ...fields, sort_order: community.length }])
    }
    setShowForm(false)
    setEditingItem(null)
    fetchCommunity()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return
    await supabase.from('community_involvement').delete().eq('id', id)
    fetchCommunity()
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]" style={{ paddingTop: '64px' }}>

      {/* Main content — photo left, text right */}
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-12 items-start">

        {/* LEFT — Photo */}
        <div className="relative flex-shrink-0 w-full md:w-96">
          <img
            src={photo}
            alt="Abdullah Mir"
            className="w-full rounded-2xl shadow-2xl object-cover object-top"
          />
          {user && (
            <label className="absolute bottom-4 right-4 bg-[#0D4F4F] text-[#FAF7F2] px-3 py-2 rounded-xl text-xs font-sans flex items-center gap-1 cursor-pointer hover:bg-[#1a6b6b] transition">
              <Pencil size={12} />
              {uploadingPhoto ? 'Uploading…' : 'Change Photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          )}
        </div>

        {/* RIGHT — Text */}
        <div className="flex-1">
          <span className="text-[#0D4F4F]/40 text-xs uppercase tracking-widest font-sans">Get to Know</span>
          <h1 className="font-serif text-[#0D4F4F] text-5xl font-bold mt-2 mb-6">Meet Mir</h1>
          <div className="h-1 w-16 bg-[#0D4F4F] rounded-full mb-8" />
          <div className="font-sans text-[#0D4F4F]/80 text-base leading-relaxed whitespace-pre-line">
            <EditableText
              page="meet"
              contentKey="about_intro"
              value={content.about_intro}
              onUpdate={v => setContent(c => ({ ...c, about_intro: v }))}
              multiline
              className="block"
            />
          </div>
        </div>
      </div>

      {/* Community involvement */}
      <div className="bg-[#0D4F4F] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-[#FAF7F2] text-3xl font-bold">
              Community Involvement
            </h2>
            {user && (
              <button
                onClick={() => { setEditingItem(null); setShowForm(true) }}
                className="flex items-center gap-2 bg-[#FAF7F2] text-[#0D4F4F] px-4 py-2 rounded-xl font-sans text-sm font-semibold hover:bg-[#FAF7F2]/90 transition"
              >
                <Plus size={15} /> Add
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {community.map((item) => (
              <div key={item.id} className="bg-[#FAF7F2]/10 rounded-2xl p-6 border border-[#FAF7F2]/10 relative group">
                <p className="text-[#FAF7F2]/50 font-sans text-xs uppercase tracking-widest mb-1">
                  {item.period_start} – {item.period_end}
                </p>
                <p className="text-[#FAF7F2] font-serif text-lg font-semibold">{item.role}</p>
                <p className="text-[#FAF7F2]/80 font-sans text-sm mt-1">{item.org}</p>
                {user && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => { setEditingItem(item); setShowForm(true) }}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-[#FAF7F2]/30 text-[#FAF7F2] font-sans hover:bg-[#FAF7F2]/10 transition"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-red-400/40 text-red-300 font-sans hover:bg-red-400/10 transition"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <CommunityForm
          initial={editingItem || {}}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingItem(null) }}
        />
      )}

    </div>
  )
}