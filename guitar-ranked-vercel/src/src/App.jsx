import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, FileText, Guitar, Image as ImageIcon, Lock, LogOut, PlayCircle, Plus, Search, ShieldCheck, Sparkles, Trash2, Upload, X } from 'lucide-react'

const STORAGE_KEY = 'guitar-ranked-pro-songs-v1'
const ADMIN_KEY = 'guitar-ranked-pro-admin-v1'
const ADMIN_PASSWORD = 'guitarhero'

const categories = [
  { id: 'bronze-1', name: 'Bronze 1', icon: '🥉', gradient: 'gradient-bronze' },
  { id: 'bronze-2', name: 'Bronze 2', icon: '🥉', gradient: 'gradient-bronze' },
  { id: 'bronze-3', name: 'Bronze 3', icon: '🥉', gradient: 'gradient-bronze' },
  { id: 'argent-1', name: 'Argent 1', icon: '🥈', gradient: 'gradient-argent' },
  { id: 'argent-2', name: 'Argent 2', icon: '🥈', gradient: 'gradient-argent' },
  { id: 'argent-3', name: 'Argent 3', icon: '🥈', gradient: 'gradient-argent' },
  { id: 'or-1', name: 'Or 1', icon: '🥇', gradient: 'gradient-or' },
  { id: 'or-2', name: 'Or 2', icon: '🥇', gradient: 'gradient-or' },
  { id: 'or-3', name: 'Or 3', icon: '🥇', gradient: 'gradient-or' },
  { id: 'platine-1', name: 'Platine 1', icon: '💠', gradient: 'gradient-platine' },
  { id: 'platine-2', name: 'Platine 2', icon: '💠', gradient: 'gradient-platine' },
  { id: 'platine-3', name: 'Platine 3', icon: '💠', gradient: 'gradient-platine' },
  { id: 'diamant-1', name: 'Diamant 1', icon: '💎', gradient: 'gradient-diamant' },
  { id: 'diamant-2', name: 'Diamant 2', icon: '💎', gradient: 'gradient-diamant' },
  { id: 'diamant-3', name: 'Diamant 3', icon: '💎', gradient: 'gradient-diamant' },
  { id: 'guitar-hero', name: 'Guitar Hero', icon: '👑', gradient: 'gradient-hero' },
]

const initialSongs = [
  { id: 1, category: 'bronze-1', title: 'Glue Song', artist: 'beabadoobee', youtube: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Accords simples, rythme calme, parfait pour débuter proprement.', tabName: '', tabData: '', tabType: '' },
  { id: 2, category: 'bronze-3', title: 'Run', artist: 'Joji', youtube: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Travail du son, du sustain et des petites phrases mélodiques.', tabName: '', tabData: '', tabType: '' },
  { id: 3, category: 'argent-1', title: 'Don’t Fear The Reaper', artist: 'Blue Öyster Cult', youtube: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Arpèges réguliers, précision main droite, son clair.', tabName: '', tabData: '', tabType: '' },
]

function getCategory(id) { return categories.find((c) => c.id === id) || categories[0] }
function emptyForm() { return { category: 'bronze-1', title: '', artist: '', youtube: '', description: '', tabName: '', tabData: '', tabType: '' } }
function youtubeToEmbed(url) {
  if (!url) return ''
  if (url.includes('/embed/')) return url
  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`
  return url
}
function loadSongs() {
  try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : initialSongs } catch { return initialSongs }
}

export default function App() {
  const [songs, setSongs] = useState(loadSongs)
  const [selectedCategory, setSelectedCategory] = useState('bronze-1')
  const [selectedSong, setSelectedSong] = useState(() => loadSongs()[0] || null)
  const [query, setQuery] = useState('')
  const [adminOpen, setAdminOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ADMIN_KEY) === 'true')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [form, setForm] = useState(emptyForm())

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(songs)) }, [songs])

  const activeCategory = getCategory(selectedCategory)
  const filteredSongs = useMemo(() => {
    const q = query.trim().toLowerCase()
    return songs.filter((song) => song.category === selectedCategory && (!q || `${song.title} ${song.artist}`.toLowerCase().includes(q)))
  }, [songs, selectedCategory, query])

  function selectCategory(categoryId) {
    setSelectedCategory(categoryId)
    setSelectedSong(songs.find((song) => song.category === categoryId) || null)
  }
  function login(event) {
    event.preventDefault()
    if (password === ADMIN_PASSWORD) { setIsAdmin(true); localStorage.setItem(ADMIN_KEY, 'true'); setPassword(''); setPasswordError('') }
    else setPasswordError('Mot de passe incorrect.')
  }
  function logout() { setIsAdmin(false); localStorage.removeItem(ADMIN_KEY) }
  function handleTabUpload(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((current) => ({ ...current, tabName: file.name, tabData: String(reader.result || ''), tabType: file.type }))
    reader.readAsDataURL(file)
  }
  function addSong(event) {
    event.preventDefault()
    if (!form.title.trim()) return
    const newSong = { id: Date.now(), category: form.category, title: form.title.trim(), artist: form.artist.trim(), youtube: youtubeToEmbed(form.youtube.trim()), description: form.description.trim(), tabName: form.tabName, tabData: form.tabData, tabType: form.tabType }
    setSongs((current) => [...current, newSong])
    setSelectedCategory(form.category); setSelectedSong(newSong); setForm(emptyForm()); setAdminOpen(false)
  }
  function deleteSong(songId) {
    const nextSongs = songs.filter((song) => song.id !== songId)
    setSongs(nextSongs)
    setSelectedSong(nextSongs.find((song) => song.category === selectedCategory) || nextSongs[0] || null)
  }
  function exportBackup() {
    const blob = new Blob([JSON.stringify(songs, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = url; a.download = 'guitar-ranked-backup.json'; a.click(); URL.revokeObjectURL(url)
  }
  function importBackup(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { try { const imported = JSON.parse(String(reader.result || '[]')); if (Array.isArray(imported)) { setSongs(imported); setSelectedCategory(imported[0]?.category || 'bronze-1'); setSelectedSong(imported[0] || null) } } catch { alert('Fichier backup invalide.') } }
    reader.readAsText(file)
  }

  return <div className="app"><div className="layout"><Sidebar songs={songs} selectedCategory={selectedCategory} selectCategory={selectCategory} />
    <main className="main">
      <header className="header">
        <div className="headerDesktopTitle"><div className="eyebrow">Catégorie actuelle</div><h1>{activeCategory.name}</h1></div>
        <div className="actions"><div className="searchWrap"><Search size={20}/><input className="input searchInput" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Rechercher un morceau…" /></div><button className="btn btnWhite" onClick={()=>setAdminOpen(true)}><Plus size={18}/> Admin</button></div>
      </header>
      <div className="mobileCats">{categories.map((c)=><button key={c.id} onClick={()=>selectCategory(c.id)} className={`mobileCat ${c.id===selectedCategory?'active':''}`}>{c.icon} {c.name}</button>)}</div>
      <section className="contentGrid"><SongList songs={filteredSongs} selectedSong={selectedSong} setSelectedSong={setSelectedSong} category={activeCategory}/><SongDetail song={selectedSong} category={selectedSong?getCategory(selectedSong.category):activeCategory} isAdmin={isAdmin} onDelete={deleteSong}/></section>
    </main>
  </div>
  <AnimatePresence>{adminOpen && <AdminModal isAdmin={isAdmin} password={password} setPassword={setPassword} passwordError={passwordError} login={login} logout={logout} onClose={()=>setAdminOpen(false)} form={form} setForm={setForm} handleTabUpload={handleTabUpload} addSong={addSong} exportBackup={exportBackup} importBackup={importBackup} songsCount={songs.length}/>}</AnimatePresence></div>
}

function Sidebar({ songs, selectedCategory, selectCategory }) { return <aside className="sidebar"><Logo/><div className="categoryList">{categories.map((category)=>{ const count=songs.filter((song)=>song.category===category.id).length; return <button key={category.id} onClick={()=>selectCategory(category.id)} className={`categoryButton ${category.id===selectedCategory?'active':''}`}><div className={`catIcon ${category.gradient}`}>{category.icon}</div><div><div className="catName">{category.name}</div><div className="catCount">{count} morceau{count>1?'x':''}</div></div></button> })}</div></aside> }
function Logo(){ return <div className="logo"><div className="logoIcon"><Guitar size={28}/></div><div><div className="logoTitle">Guitar Ranked</div><div className="logoSub">Apprendre par niveaux</div></div></div> }
function SongList({ songs, selectedSong, setSelectedSong, category }) { return <div className="card"><div className="cardPad"><div className="categoryHeader"><div className={`catIcon ${category.gradient}`}>{category.icon}</div><div><h2 style={{margin:0}}>{category.name}</h2><div className="muted">Choisis une vidéo</div></div></div><div className="songList">{songs.map((song)=><button key={song.id} onClick={()=>setSelectedSong(song)} className={`songButton ${selectedSong?.id===song.id?'active':''}`}><div><div className="songTitle">{song.title}</div><div className="songArtist">{song.artist}</div></div><PlayCircle size={20}/></button>)}{songs.length===0 && <div className="empty" style={{minHeight:160}}>Aucun morceau ici pour le moment.</div>}</div></div></div> }
function AdminModal(props){ const { isAdmin,password,setPassword,passwordError,login,logout,onClose,form,setForm,handleTabUpload,addSong,exportBackup,importBackup,songsCount }=props; return <motion.div className="modalOverlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.div className="modal" initial={{scale:.96,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.96,opacity:0}}><div className="modalTop"><div><div className="modalTitle">Espace admin</div><div className="muted">Sauvegarde automatique sur ce navigateur + backup JSON.</div></div><button className="btn btnGhost" onClick={onClose}><X size={18}/></button></div>{!isAdmin?<form onSubmit={login} className="formGrid"><div className="cardPad"><div style={{display:'flex',gap:10,alignItems:'center',fontWeight:950,marginBottom:10}}><ShieldCheck/> Connexion admin</div><p className="muted">Mot de passe par défaut : <b style={{color:'#c084fc'}}>guitarhero</b>. Tu pourras le changer dans le code.</p><input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Mot de passe" />{passwordError&&<p style={{color:'#fca5a5'}}>{passwordError}</p>}</div><button className="btn btnWhite" type="submit">Entrer</button></form>:<div className="formGrid"><div className="backupBox"><button className="btn btnWhite" onClick={exportBackup}><Download size={17}/> Exporter</button><label className="btn btnGhost" style={{cursor:'pointer'}}><input type="file" accept="application/json" hidden onChange={(e)=>importBackup(e.target.files?.[0])}/>Importer backup</label><button className="btn btnGhost" onClick={logout}><LogOut size={17}/> Déconnexion</button><p>{songsCount} morceau{songsCount>1?'x':''} sauvegardé{songsCount>1?'s':''} dans ce navigateur.</p></div><form onSubmit={addSong} className="formGrid"><label>Catégorie<select className="select" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}>{categories.map((c)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><div className="twoCols"><TextField label="Titre" value={form.title} onChange={(v)=>setForm({...form,title:v})} required/><TextField label="Artiste" value={form.artist} onChange={(v)=>setForm({...form,artist:v})}/></div><TextField label="Lien YouTube" value={form.youtube} onChange={(v)=>setForm({...form,youtube:v})} placeholder="https://www.youtube.com/watch?v=..."/><label>Description courte<textarea className="textarea" rows="4" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Ex : accords simples, barrés, riff principal…"/></label><label className="uploadBox"><input type="file" accept="image/png,image/jpeg,application/pdf" hidden onChange={(e)=>handleTabUpload(e.target.files?.[0])}/><Upload/><div style={{fontWeight:950}}>Uploader la tablature</div><div className="muted">PNG, JPG ou PDF</div>{form.tabName&&<div style={{color:'#c084fc'}}>{form.tabName}</div>}</label>{form.tabData&&form.tabType.startsWith('image/')&&<img className="previewImg" src={form.tabData}/>} {form.tabData&&form.tabType==='application/pdf'&&<div className="cardPad">PDF chargé : {form.tabName}</div>}<button type="submit" className="btn btnPurple"><Plus size={18}/> Publier sur le site</button></form></div>}</motion.div></motion.div> }
function TextField({label,value,onChange,placeholder='',required=false}){return <label>{label}<input className="input" required={required} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder}/></label>}
function SongDetail({ song, category, isAdmin, onDelete }) { if(!song) return <div className="card empty"><div><Sparkles/><h2>Aucune vidéo dans cette catégorie</h2><p>Ajoute une vidéo depuis l’espace admin.</p></div></div>; return <div className="card"><div className={`heroStrip ${category.gradient}`}/><div className="songDetailHead"><div className="badges"><div><span className={`badge ${category.gradient}`}>{category.icon} {category.name}</span> <span className="badge badgeGhost">Cours vidéo</span></div>{isAdmin&&<button className="btn btnRed" onClick={()=>onDelete(song.id)}><Trash2 size={17}/> Supprimer</button>}</div><h2 className="songName">{song.title}</h2>{song.artist&&<p className="songArtist" style={{fontSize:18}}>{song.artist}</p>}{song.description&&<p className="description">{song.description}</p>}</div><div className="videoWrap">{song.youtube?<iframe src={song.youtube} title={song.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>:<div className="videoPlaceholder"><PlayCircle/> Ajoute un lien YouTube dans l’admin.</div>}</div><div className="tabSection"><div className="sectionTitle"><FileText/> Tablature</div>{song.tabData&&song.tabType?.startsWith('image/')?<img className="tabImage" src={song.tabData} alt={`Tablature ${song.title}`}/>:song.tabData&&song.tabType==='application/pdf'?<div><iframe className="pdfFrame" title={`PDF ${song.title}`} src={song.tabData}/><br/><br/><a className="btn btnWhite" href={song.tabData} download={song.tabName||'tablature.pdf'}><Download size={17}/> Télécharger le PDF</a></div>:song.tabName?<div className="cardPad"><ImageIcon/> {song.tabName}</div>:<div className="cardPad muted">Aucune tablature ajoutée pour ce morceau.</div>}</div></div> }
