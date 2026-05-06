import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import EditableText from '../components/EditableText'
import { useAuth } from '../context/AuthContext'
import { Pencil } from 'lucide-react'

const DEFAULT_INTRO = `My name is Abdullah Mir, and I am running to be your City Councillor for Ward 1. I'm a community builder and a dedicated advocate for residents.

I have proudly called the Rougemount community home for the past decade, and I've spent years working alongside neighbours to make our community stronger by co-founding the Rougemount Community and Recreation Association, serving on the Pickering Public Library Board, helping iTrust Community Centre find a permanent home on Kingston Road, and leading the fight against sprawl development during the Greenbelt scandal as co-chair of Stop Sprawl Durham.

I'm running for city council because I believe Pickering should be a place you can afford to live, feel safe, and be proud of at every stage of life. That means strong, healthy neighbourhoods where families can put down roots, seniors can grow old close to the people they love, and kids have parks and programs to thrive.

This election isn't about me — it's about you and the community you want to build. Over the next 6 months, I will be visiting every household in this ward to talk to you directly.

I want to hear from you: votemirward1@gmail.com or 289-992-3647.

We can build a stronger city together. I'm here to work for you!`

const community = [
  { role: 'Co-Chair', org: 'Stop Sprawl Durham (SSD)', period: 'December 2022 – Present' },
  { role: 'Vice President', org: 'Rougemount Community and Recreation Association (RCRA)', period: 'October 2023 – Present' },
  { role: 'Board Member', org: 'Pickering Public Library', period: 'December 2022 – Present' },
  { role: 'Board Member', org: 'Land Over Landings', period: 'December 2023 – Present' },
]

export default function MeetMir() {
  const { user } = useAuth()
  const [content, setContent] = useState({ about_intro: DEFAULT_INTRO })
  const [photo, setPhoto] = useState('/DSCF4950.jpg')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  useEffect(() => {
    supabase.from('page_content').select('*').eq('page', 'meet').then(({ data }) => {
      if (data) {
        const map = {}
        data.forEach(r => { map[r.key] = r.value })
        setContent(prev => ({ ...prev, ...map }))
        if (map.photo_url) setPhoto(map.photo_url)
      }
    })
  }, [])

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

  return (
    <div className="min-h-screen bg-[#FAF7F2]" style={{ paddingTop: '64px' }}>

      {/* Main content — photo left, text right */}
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-12 items-start">

        {/* LEFT — Photo, fixed width, natural height */}
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

        {/* RIGHT — All text flows naturally */}
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
          <h2 className="font-serif text-[#FAF7F2] text-3xl font-bold mb-10 text-center">
            Community Involvement
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {community.map((item, i) => (
              <div key={i} className="bg-[#FAF7F2]/10 rounded-2xl p-6 border border-[#FAF7F2]/10">
                <p className="text-[#FAF7F2]/50 font-sans text-xs uppercase tracking-widest mb-1">{item.period}</p>
                <p className="text-[#FAF7F2] font-serif text-lg font-semibold">{item.role}</p>
                <p className="text-[#FAF7F2]/80 font-sans text-sm mt-1">{item.org}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}