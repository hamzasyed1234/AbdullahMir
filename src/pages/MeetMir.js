import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import EditableText from '../components/EditableText'
import { useAuth } from '../context/AuthContext'
import { Pencil, Plus, Trash2, Check, X } from 'lucide-react'

const DEFAULT_BLOCK_1 = `For more than a decade, I have called the Rougemount neighbourhood in Ward 1 home, where I have been actively involved as a community organizer and advocate for residents both in my community and across Pickering.

Much of my work has focused on protecting the things that make Pickering such a special place to live, from our neighbourhood connections to our natural spaces and farmland.

As co-chair of Stop Sprawl Durham, I worked with residents across our region to push back against plans that would have opened protected Greenbelt lands in Pickering to development. Together, we stood up for responsible planning, protecting thousands of acres of farmland and natural spaces so that current residents and future generations can continue to enjoy them.

Working alongside residents across Durham Region, together we helped restore nearly 5,000 acres of Pickering land back into the Greenbelt, protecting farmland and green space that belongs to the community. By protecting these lands, we also helped avoid the kind of sprawling development that often leads to higher infrastructure costs and increased property taxes for residents.`

const DEFAULT_BLOCK_2 = `As a member of the board of Land Over Landings, I worked with residents and community partners to advocate for responsible land-use planning that protects farmland and ensures that growth in Pickering is managed in a way that supports our community.

I also joined residents advocating against plans for an airport in North Pickering that would have brought major environmental impacts, noise, and the loss of valuable farmland.

At the same time, I have always believed that building a strong city begins with building strong communities.

I am a co-founder and vice president of the Rougemount Community and Recreation Association, where I have helped organize neighbourhood events that bring residents together, including Party in the Park, the Fall Corn Roast, and Christmas Carols in the Park. Events like these help neighbours connect and strengthen the sense of community that makes Pickering such a great place to live.`

const DEFAULT_BLOCK_3 = `Through the association, I have also helped organize community information sessions on topics such as fire safety and police safety, and worked with residents to advocate with City Hall for improvements to Rouge Valley Park and traffic-calming measures in our neighbourhood.

I have also been proud to support one of Pickering's most important public institutions through my work on the Pickering Public Library Board. During my time on the board, I supported efforts to expand access to library services and strengthen the role libraries play in our community.

Initiatives such as Ovee were launched during this time, bringing library services directly into neighbourhoods across Pickering, including several stops in Ward 1. Programs like this help connect more residents with books, learning opportunities, and community resources.

Supporting community organizations has also been an important part of my work. As an advisor to the iTrust Community Centre, I helped the organization secure a permanent home at 469 Kingston Road. I also worked with the City to ensure the necessary permits and approvals were in place so the community could have a dedicated space for prayer, meetings, and local programs.`

const DEFAULT_BLOCK_4 = `I have also helped bring people together through sports and cultural events. In 2025 and 2026, I organized the Pickering Classic Cricket Tournament, the first event of its kind in the city, raising funds for the Pickering Food Bank while bringing residents together from across our diverse community.

Alongside my community work, I have spent more than a decade serving Canadians as a federal public servant. Through that work I have gained valuable experience in how government policy is developed and implemented, and how public institutions can navigate complex challenges to deliver meaningful results for people.

Everything I have done over the past decade has been driven by the same belief: strong communities are built when people come together, stand up for their neighbours, and work collaboratively to shape the future of their city.

That is the spirit I hope to bring to City Council!`

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
          <input type="text" placeholder="Role (e.g. Co-Chair)" value={role} onChange={e => setRole(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]" />
          <input type="text" placeholder="Organization" value={org} onChange={e => setOrg(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]" />
          <input type="text" placeholder="Start (e.g. December 2022)" value={periodStart} onChange={e => setPeriodStart(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]" />
          <input type="text" placeholder="End (e.g. Present or June 2024)" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-[#0D4F4F]" />
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

export default function MeetMir() {
  const { user } = useAuth()

  const [content, setContent] = useState({
    block_1: DEFAULT_BLOCK_1,
    block_2: DEFAULT_BLOCK_2,
    block_3: DEFAULT_BLOCK_3,
    block_4: DEFAULT_BLOCK_4,
  })

  const [photo1, setPhoto1] = useState('/DSCF4885-3.jpg')
  const [photo2, setPhoto2] = useState('/DSCF5109.jpg')
  const [photo3, setPhoto3] = useState('/DSCF5002.jpg')
  const [photo4, setPhoto4] = useState('/DSCF5028.jpg')
  const [uploading, setUploading] = useState({ p1: false, p2: false, p3: false, p4: false })

  const [community, setCommunity] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    supabase.from('page_content').select('*').eq('page', 'meet').then(({ data }) => {
      if (data) {
        const map = {}
        data.forEach(r => { map[r.key] = r.value })
        setContent(prev => ({ ...prev, ...map }))
        if (map.photo_url)  setPhoto1(map.photo_url)
        if (map.photo2_url) setPhoto2(map.photo2_url)
        if (map.photo3_url) setPhoto3(map.photo3_url)
        if (map.photo4_url) setPhoto4(map.photo4_url)
      }
    })
    fetchCommunity()
  }, [])

  const fetchCommunity = async () => {
    const { data } = await supabase.from('community_involvement').select('*').order('sort_order')
    setCommunity(data || [])
  }

  const makePhotoUploader = (photoKey, setPhoto, uploadKey) => async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(u => ({ ...u, [uploadKey]: true }))
    const fileName = `meet-photo-${photoKey}-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      setPhoto(data.publicUrl)
      await supabase.from('page_content').upsert(
        { page: 'meet', key: photoKey, value: data.publicUrl, updated_at: new Date() },
        { onConflict: 'page,key' }
      )
    }
    setUploading(u => ({ ...u, [uploadKey]: false }))
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

  const toWebP = (src) => {
    if (!src || src.startsWith('http')) return null
    const [path, query] = src.split('?')
    const webp = path.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    return query ? `${webp}?${query}` : webp
  }

  // Photo column — fills exact height of sibling text col using absolute fill inside self-stretch
  const PhotoCol = ({ photo, uploadKey, photoKey, setPhoto, objPos = 'center top', eager = false, useAspectRatio = false }) => (
    <div className="w-full md:w-1/2 flex-shrink-0 self-stretch relative min-h-[350px]">
      {useAspectRatio ? (
        <div className="w-full" style={{ aspectRatio: '3/4' }}>
          <picture>
            {toWebP(photo) && <source srcSet={toWebP(photo)} type="image/webp" />}
            <img
              src={photo}
              alt="Abdullah Mir"
              className="w-full h-full object-cover rounded-2xl shadow-xl"
              style={{ objectPosition: objPos }}
              loading={eager ? 'eager' : 'lazy'}
              decoding="async"
            />
          </picture>
        </div>
      ) : (
        <picture>
          {toWebP(photo) && <source srcSet={toWebP(photo)} type="image/webp" />}
          <img
            src={photo}
            alt="Abdullah Mir"
            className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl"
            style={{ objectPosition: objPos }}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        </picture>
      )}
      {user && (
        <label className="absolute bottom-4 right-4 bg-[#0D4F4F] text-[#FAF7F2] px-3 py-2 rounded-xl text-xs font-sans flex items-center gap-1 cursor-pointer hover:bg-[#1a6b6b] transition z-10">
          <Pencil size={12} /> {uploading[uploadKey] ? 'Uploading…' : 'Change Photo'}
          <input type="file" accept="image/*" className="hidden" onChange={makePhotoUploader(photoKey, setPhoto, uploadKey)} />
        </label>
      )}
    </div>
  )

  // Text column
  const TextCol = ({ contentKey, value, onUpdate }) => (
    <div className="w-full md:w-1/2 flex items-center py-8 px-0 md:px-12">
      <div className="font-sans text-[#0D4F4F]/80 text-base leading-relaxed w-full">
        <EditableText page="meet" contentKey={contentKey} value={value} onUpdate={onUpdate} multiline className="block" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF7F2]" style={{ paddingTop: '64px' }}>

      {/* Page title */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-4">
        <span className="text-[#0D4F4F]/40 text-xs uppercase tracking-widest font-sans">Get to Know</span>
        <h1 className="font-serif text-[#0D4F4F] text-5xl font-bold mt-2 mb-4">About Me</h1>
        <div className="h-1 w-16 bg-[#0D4F4F] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 flex flex-col gap-16">

        {/* ROW 1: Photo left, Text right */}
        <div className="flex flex-col md:flex-row md:items-stretch gap-8 md:gap-12">
          <PhotoCol photo={photo1} uploadKey="p1" photoKey="photo_url" setPhoto={setPhoto1} objPos="center top" eager={true} useAspectRatio={true} />
          <TextCol contentKey="block_1" value={content.block_1} onUpdate={v => setContent(c => ({ ...c, block_1: v }))} />
        </div>

        {/* ROW 2: Text left, Photo right */}
        <div className="flex flex-col md:flex-row md:items-stretch gap-8 md:gap-12">
          <div className="w-full md:w-1/2 order-2 md:order-1 flex items-center py-8 px-0 md:px-12">
            <div className="font-sans text-[#0D4F4F]/80 text-base leading-relaxed w-full">
              <EditableText page="meet" contentKey="block_2" value={content.block_2} onUpdate={v => setContent(c => ({ ...c, block_2: v }))} multiline className="block" />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex-shrink-0 self-stretch relative min-h-[350px] order-1 md:order-2">
            <picture>
              {toWebP(photo2) && <source srcSet={toWebP(photo2)} type="image/webp" />}
              <img src={photo2} alt="Abdullah Mir" className="absolute inset-0 w-full h-full object-cover object-top rounded-2xl shadow-xl" loading="lazy" decoding="async" />
            </picture>
            {user && (
              <label className="absolute bottom-4 right-4 bg-[#0D4F4F] text-[#FAF7F2] px-3 py-2 rounded-xl text-xs font-sans flex items-center gap-1 cursor-pointer hover:bg-[#1a6b6b] transition z-10">
                <Pencil size={12} /> {uploading.p2 ? 'Uploading…' : 'Change Photo'}
                <input type="file" accept="image/*" className="hidden" onChange={makePhotoUploader('photo2_url', setPhoto2, 'p2')} />
              </label>
            )}
          </div>
        </div>

        {/* ROW 3: Photo left, Text right */}
        <div className="flex flex-col md:flex-row md:items-stretch gap-8 md:gap-12">
          <div className="w-full md:w-1/2 flex-shrink-0 self-stretch relative min-h-[350px]">
            <picture>
              {toWebP(photo3) && <source srcSet={toWebP(photo3)} type="image/webp" />}
              <img src={photo3} alt="Abdullah Mir" className="absolute inset-0 w-full h-full object-cover object-top rounded-2xl shadow-xl" loading="lazy" decoding="async" />
            </picture>
            {user && (
              <label className="absolute bottom-4 right-4 bg-[#0D4F4F] text-[#FAF7F2] px-3 py-2 rounded-xl text-xs font-sans flex items-center gap-1 cursor-pointer hover:bg-[#1a6b6b] transition z-10">
                <Pencil size={12} /> {uploading.p3 ? 'Uploading…' : 'Change Photo'}
                <input type="file" accept="image/*" className="hidden" onChange={makePhotoUploader('photo3_url', setPhoto3, 'p3')} />
              </label>
            )}
          </div>
          <TextCol contentKey="block_3" value={content.block_3} onUpdate={v => setContent(c => ({ ...c, block_3: v }))} />
        </div>

        {/* ROW 4: Text left, Photo right */}
        <div className="flex flex-col md:flex-row md:items-stretch gap-8 md:gap-12">
          <div className="w-full md:w-1/2 order-2 md:order-1 flex items-center py-8 px-0 md:px-12">
            <div className="font-sans text-[#0D4F4F]/80 text-base leading-relaxed w-full">
              <EditableText page="meet" contentKey="block_4" value={content.block_4} onUpdate={v => setContent(c => ({ ...c, block_4: v }))} multiline className="block" />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex-shrink-0 self-stretch relative min-h-[350px] order-1 md:order-2">
            <picture>
              {toWebP(photo4) && <source srcSet={toWebP(photo4)} type="image/webp" />}
              <img src={photo4} alt="Abdullah Mir" className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl" style={{ objectPosition: '65% center' }} loading="lazy" decoding="async" />
            </picture>
            {user && (
              <label className="absolute bottom-4 right-4 bg-[#0D4F4F] text-[#FAF7F2] px-3 py-2 rounded-xl text-xs font-sans flex items-center gap-1 cursor-pointer hover:bg-[#1a6b6b] transition z-10">
                <Pencil size={12} /> {uploading.p4 ? 'Uploading…' : 'Change Photo'}
                <input type="file" accept="image/*" className="hidden" onChange={makePhotoUploader('photo4_url', setPhoto4, 'p4')} />
              </label>
            )}
          </div>
        </div>

      </div>

      {/* ── Community — teal bg ── */}
      <div className="bg-[#0D4F4F] py-16 px-6 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-[#FAF7F2] text-3xl font-bold">Community</h2>
            {user && (
              <button onClick={() => { setEditingItem(null); setShowForm(true) }} className="flex items-center gap-2 bg-[#FAF7F2] text-[#0D4F4F] px-4 py-2 rounded-xl font-sans text-sm font-semibold hover:bg-white transition">
                <Plus size={15} /> Add
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {community.map((item) => (
              <div key={item.id} className="bg-[#FAF7F2]/10 rounded-2xl p-6 border border-[#FAF7F2]/15 shadow-sm">
                <p className="text-[#FAF7F2]/50 font-sans text-xs uppercase tracking-widest mb-1">
                  {item.period_start} – {item.period_end}
                </p>
                <p className="text-[#FAF7F2] font-serif text-lg font-semibold">{item.role}</p>
                <p className="text-[#FAF7F2]/70 font-sans text-sm mt-1">{item.org}</p>
                {user && (
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => { setEditingItem(item); setShowForm(true) }} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-[#FAF7F2]/30 text-[#FAF7F2] font-sans hover:bg-[#FAF7F2]/10 transition">
                      <Pencil size={11} /> Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-red-300/40 text-red-300 font-sans hover:bg-red-900/20 transition">
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

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