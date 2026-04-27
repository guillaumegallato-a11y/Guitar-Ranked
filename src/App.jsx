import React, { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Lock, PlayCircle, FileText, X, Guitar, Upload, Download, Trash2, LogOut, ShieldCheck } from 'lucide-react'

const STORAGE_KEY = 'guitar-ranked-pro-songs-v2'
const ADMIN_KEY = 'guitar-ranked-pro-admin-v2'
const ADMIN_PASSWORD = 'guitarhero'

const categories = [
  ['bronze-1', 'Bronze 1', '🥉', 'bronze'], ['bronze-2', 'Bronze 2', '🥉', 'bronze'], ['bronze-3', 'Bronze 3', '🥉', 'bronze'],
  ['argent-1', 'Argent 1', '🥈', 'silver'], ['argent-2', 'Argent 2', '🥈', 'silver'], ['argent-3', 'Argent 3', '🥈', 'silver'],
  ['or-1', 'Or 1', '🥇', 'gold'], ['or-2', 'Or 2', '🥇', 'gold'], ['or-3', 'Or 3', '🥇', 'gold'],
  ['platine-1', 'Platine 1', '💠', 'platinum'], ['platine-2', 'Platine 2', '💠', 'platinum'], ['platine-3', 'Platine 3', '💠', 'platinum'],
  ['diamant-1', 'Diamant 1', '💎', 'diamond'], ['diamant-2', 'Diamant 2', '💎', 'diamond'], ['diamant-3', 'Diamant 3', '💎', 'diamond'],
  ['guitar-hero', 'Guitar Hero', '👑', 'hero']
].map(([id, name, icon, theme]) => ({ id, name, icon, theme }))

const starterSongs = [
  { id: 1, category: 'bronze-1', title: 'Glue Song', artist: 'beabadoobee', youtube: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Accords simples, rythme calme, parfait pour débuter proprement.', tabName: '', tabData: '', tabType: '' },
  { id: 2, category: 'bronze-3', title: 'Run', artist: 'Joji', youtube: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Travail du son, du sustain et des phrases mélodiques.', tabName: '', tabData: '', tabType: '' },
  { id: 3, category: 'argent-1', title: 'Don’t Fear The Reaper', artist: 'Blue Öyster Cult', youtube: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Arpèges réguliers, précision main droite, son clair.', tabName: '', tabData: '', tabType: '' }
]

function loadSongs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : starterSongs
  } catch {
    return starterSongs
  }
}

function getCategory(id) {
  return categories.find(c => c.id === id) || categories[0]
}

function youtubeToEmbed(url) {
  if (!url) return ''
  if (url.includes('/embed/')) return url
  const watch = url.match(/[?&]v=([^&]+)/)
  if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`
  const short = url.match(/youtu\.be\/([^?&]+)/)
  if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`
  return url
}

const emptyForm = () => ({ category: 'bronze-1', title: '', artist: '', youtube: '', description: '', tabName: '', tabData: '', tabType: '' })

export default function App() {
  const [songs, setSongs] = useState(loadSongs)
  const [selectedCategory, setSelectedCategory] = useState('bronze-1')
  const [selectedSong, setSelectedSong] = useState(() => loadSongs()[0] || null)
  const [query, setQuery] = useState('')
  const [adminOpen, setAdminOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ADMIN_KEY) === 'true')
  const [password, setPassword] = useState('')
  const [form, setForm] = useState(emptyForm())

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(songs)), [songs])

  const activeCategory = getCategory(selectedCategory)
  const filteredSongs = useMemo(() => {
    const q = query.trim().toLowerCase()
    return songs.filter(song => song.category === selectedCategory && (!q || `${song.title} ${song.artist}`.toLowerCase().includes(q)))
  }, [songs, selectedCategory, query])

  function selectCategory(id) {
    setSelectedCategory(id)
    setSelectedSong(songs.find(s => s.category === id) || null)
  }

  function login(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      localStorage.setItem(ADMIN_KEY, 'true')
      setPassword('')
    } else alert('Mot de passe incorrect')
  }

  function logout() {
    setIsAdmin(false)
    localStorage.removeItem(ADMIN_KEY)
  }

  function handleFile(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({ ...f, tabName: file.name, tabData: String(reader.result || ''), tabType: file.type }))
    reader.readAsDataURL(file)
  }

  function addSong(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    const newSong = { ...form, id: Date.now(), title: form.title.trim(), artist: form.artist.trim(), youtube: youtubeToEmbed(form.youtube.trim()), description: form.description.trim() }
    setSongs([...songs, newSong])
    setSelectedCategory(newSong.category)
    setSelectedSong(newSong)
    setForm(emptyForm())
    setAdminOpen(false)
  }

  function deleteSong(id) {
    const next = songs.filter(s => s.id !== id)
    setSongs(next)
    setSelectedSong(next.find(s => s.category === selectedCategory) || next[0] || null)
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(songs, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'guitar-ranked-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importBackup(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result || '[]'))
        if (Array.isArray(imported)) {
          setSongs(imported)
          setSelectedCategory(imported[0]?.category || 'bronze-1')
          setSelectedSong(imported[0] || null)
        }
      } catch { alert('Backup invalide') }
    }
    reader.readAsText(file)
  }

  return <div className="app">
    <aside className="sidebar">
      <div className="logo"><div className="logoIcon"><Guitar size={28}/></div><div><h1>Guitar Ranked</h1><p>Apprendre par niveaux</p></div></div>
      <nav>{categories.map(cat => {
        const count = songs.filter(s => s.category === cat.id).length
        return <button key={cat.id} onClick={() => selectCategory(cat.id)} className={`cat ${cat.theme} ${cat.id === selectedCategory ? 'active' : ''}`}>
          <span className="badge">{cat.icon}</span><span><b>{cat.name}</b><small>{count} morceau{count > 1 ? 'x' : ''}</small></span>
        </button>
      })}</nav>
    </aside>

    <main className="main">
      <header className="topbar">
        <div><p>Catégorie actuelle</p><h2>{activeCategory.icon} {activeCategory.name}</h2></div>
        <div className="actions"><div className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un morceau…"/></div><button onClick={() => setAdminOpen(true)}><Lock size={16}/> Admin</button></div>
      </header>

      <div className="mobileCats">{categories.map(cat => <button key={cat.id} onClick={() => selectCategory(cat.id)} className={cat.id === selectedCategory ? 'active' : ''}>{cat.icon} {cat.name}</button>)}</div>

      <section className="layout">
        <div className="songList"><div className="listTitle"><span className={`largeBadge ${activeCategory.theme}`}>{activeCategory.icon}</span><div><h3>{activeCategory.name}</h3><p>Choisis une vidéo</p></div></div>
          {filteredSongs.length ? filteredSongs.map(song => <button key={song.id} onClick={() => setSelectedSong(song)} className={`songButton ${selectedSong?.id === song.id ? 'active' : ''}`}><span><b>{song.title}</b><small>{song.artist}</small></span><PlayCircle size={20}/></button>) : <p className="empty">Aucun morceau ici pour le moment.</p>}
        </div>
        <SongDetail song={selectedSong} category={selectedSong ? getCategory(selectedSong.category) : activeCategory} isAdmin={isAdmin} onDelete={deleteSong}/>
      </section>
    </main>

    {adminOpen && <div className="modal"><div className="modalBox"><div className="modalHead"><div><h2>Espace admin</h2><p>Sauvegarde automatique dans ce navigateur + backup JSON.</p></div><button className="iconBtn" onClick={() => setAdminOpen(false)}><X/></button></div>
      {!isAdmin ? <form onSubmit={login} className="form"><div className="info"><ShieldCheck/><p>Mot de passe par défaut : <code>guitarhero</code></p></div><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe"/><button>Entrer</button></form> : <div className="form">
        <div className="backup"><button onClick={exportBackup}><Download size={16}/> Exporter</button><label>Importer backup<input type="file" accept="application/json" onChange={e => importBackup(e.target.files?.[0])}/></label><button onClick={logout}><LogOut size={16}/> Déconnexion</button></div>
        <form onSubmit={addSong} className="form"><select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><div className="grid"><input required value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="Titre"/><input value={form.artist} onChange={e => setForm({...form, artist:e.target.value})} placeholder="Artiste"/></div><input value={form.youtube} onChange={e => setForm({...form, youtube:e.target.value})} placeholder="Lien YouTube"/><textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Description courte"/><label className="upload"><Upload/>Uploader tablature PNG/JPG/PDF<input type="file" accept="image/png,image/jpeg,application/pdf" onChange={e => handleFile(e.target.files?.[0])}/></label>{form.tabName && <p className="fileName">{form.tabName}</p>}<button><Plus size={16}/> Publier sur le site</button></form>
      </div>}
    </div></div>}
  </div>
}

function SongDetail({ song, category, isAdmin, onDelete }) {
  if (!song) return <div className="detail emptyDetail"><h2>Aucune vidéo dans cette catégorie</h2><p>Ajoute une vidéo depuis l’espace admin.</p></div>
  return <article className="detail"><div className={`stripe ${category.theme}`}></div><div className="detailHead"><div><span className={`pill ${category.theme}`}>{category.icon} {category.name}</span><h2>{song.title}</h2>{song.artist && <p>{song.artist}</p>}{song.description && <p className="desc">{song.description}</p>}</div>{isAdmin && <button className="delete" onClick={() => onDelete(song.id)}><Trash2 size={16}/> Supprimer</button>}</div><div className="videoBox">{song.youtube ? <iframe src={song.youtube} title={song.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/> : <p>Ajoute un lien YouTube dans l’admin.</p>}</div><div className="tabs"><h3><FileText/> Tablature</h3>{song.tabData && song.tabType?.startsWith('image/') ? <img src={song.tabData} alt="Tablature"/> : song.tabData && song.tabType === 'application/pdf' ? <><iframe className="pdf" src={song.tabData} title="PDF tablature"/><a className="download" href={song.tabData} download={song.tabName || 'tablature.pdf'}><Download size={16}/> Télécharger le PDF</a></> : <p className="empty">Aucune tablature ajoutée pour ce morceau.</p>}</div></article>
}
