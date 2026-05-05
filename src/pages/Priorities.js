import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import EditableText from '../components/EditableText'

export default function Priorities() {
  const [content, setContent] = useState({ body: 'Loading…' })

  useEffect(() => {
    supabase.from('page_content').select('*').eq('page', 'priorities').then(({ data }) => {
      if (data) {
        const map = {}
        data.forEach(r => { map[r.key] = r.value })
        setContent(prev => ({ ...prev, ...map }))
      }
    })
  }, [])

  const priorities = [
    { icon: '🏠', title: 'Affordable Housing', body: content.housing || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.' },
    { icon: '🌱', title: 'Environment & Greenbelt', body: content.environment || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique.' },
    { icon: '🏗️', title: 'Responsible Growth', body: content.growth || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vehicula sapien et urna tincidunt.' },
    { icon: '🤝', title: 'Community Safety', body: content.safety || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.' },
    { icon: '📚', title: 'Libraries & Recreation', body: content.libraries || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet.' },
    { icon: '💼', title: 'Local Economy', body: content.economy || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed odio dui consequat pretium.' },
  ]

  return (
    <div className="pt-20 min-h-screen bg-cream">
      <div className="bg-[#0D4F4F] py-16 px-6 text-center">
        <span className="text-cream/50 text-xs uppercase tracking-widest font-sans">What Matters</span>
        <h1 className="font-serif text-cream text-5xl font-bold mt-2">Priorities</h1>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Intro — editable */}
        <div className="text-center mb-16">
          <p className="font-sans text-[#0D4F4F]/70 text-lg leading-relaxed max-w-2xl mx-auto">
            <EditableText page="priorities" contentKey="body" value={content.body}
              onUpdate={v => setContent(c => ({ ...c, body: v }))} multiline />
          </p>
        </div>

        {/* Priority cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {priorities.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-[#0D4F4F]/10 hover:shadow-md transition">
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="font-serif text-[#0D4F4F] text-xl font-bold mb-3">{p.title}</h3>
              <p className="font-sans text-[#0D4F4F]/70 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}