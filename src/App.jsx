import React, { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Lock, Upload, Download, Trash2, X, Guitar, Star, Play, FileText, ShieldCheck, LogOut } from 'lucide-react'

const STORAGE_KEY = 'guitar-ranked-riot-v1'
const ADMIN_KEY = 'guitar-ranked-riot-admin-v1'
const ADMIN_PASSWORD = 'guitarhero'

const levels = [
  { id: 'bronze-1', group: 'Bronze', label: 'Bronze 1', range: '1', color: '#c47a37', icon: '/icons/bronze-1.png', xp: 10 },
  { id: 'bronze-2', group: 'Bronze', label: 'Bronze 2', range: '2', color: '#c47a37', icon: '/icons/bronze-2.png', xp: 15 },
  { id: 'bronze-3', group: 'Bronze', label: 'Bronze 3', range: '3', color: '#c47a37', icon: '/icons/bronze-3.png', xp: 20 },
  { id: 'argent-1', group: 'Argent', label: 'Argent 1', range: '4', color: '#d6d9df', icon: '/icons/argent-1.png', xp: 25 },
  { id: 'argent-2', group: 'Argent', label: 'Argent 2', range: '5', color: '#d6d9df', icon: '/icons/argent-2.png', xp: 30 },
  { id: 'argent-3', group: 'Argent', label: 'Argent 3', range: '6', color: '#d6d9df', icon: '/icons/argent-3.png', xp: 35 },
  { id: 'or-1', group: 'Or', label: 'Or 1', range: '7', color: '#f4b62a', icon: '/icons/or-1.png', xp: 40 },
  { id: 'or-2', group: 'Or', label: 'Or 2', range: '8', color: '#f4b62a', icon: '/icons/or-2.png', xp: 45 },
  { id: 'or-3', group: 'Or', label: 'Or 3', range: '9', color: '#f4b62a', icon: '/icons/or-3.png', xp: 50 },
  { id: 'platine-1', group: 'Platine', label: 'Platine 1', range: '10', color: '#69e7ee', icon: '/icons/platine-1.png', xp: 55 },
  { id: 'platine-2', group: 'Platine', label: 'Platine 2', range: '11', color: '#69e7ee', icon: '/icons/platine-2.png', xp: 60 },
  { id: 'platine-3', group: 'Platine', label: 'Platine 3', range: '12', color: '#69e7ee', icon: '/icons/platine-3.png', xp: 65 },
  { id: 'diamant-1', group: 'Diamant', label: 'Diamant 1', range: '13', color: '#7a8dff', icon: '/icons/diamant-1.png', xp: 70 },
  { id: 'diamant-2', group: 'Diamant', label: 'Diamant 2', range: '14', color: '#7a8dff', icon: '/icons/diamant-2.png', xp: 75 },
  { id: 'diamant-3', group: 'Diamant', label: 'Diamant 3', range: '15', color: '#7a8dff', icon: '/icons/diamant-3.png', xp: 80 },
  { id: 'guitar-hero', group: 'Guitar Hero', label: 'Guitar Hero', range: '16', color: '#c655ff', icon: '/icons/guitar-hero.png', xp: 100 },
]

const groups = [
  { id: 'bronze', name: 'Bronze', range: '1 - 3', icon: '/icons/bronze-3.png', color: '#c47a37', levelIds: ['bronze-1','bronze-2','bronze-3'], desc: 'Les premiers pas du guitariste.' },
  { id: 'argent', name: 'Argent', range: '4 - 6', icon: '/icons/argent-3.png', color: '#d6d9df', levelIds: ['argent-1','argent-2','argent-3'], desc: 'Accords plus propres, riffs plus fluides.' },
  { id: 'or', name: 'Or', range: '7 - 9', icon: '/icons/or-3.png', color: '#f4b62a', levelIds: ['or-1','or-2','or-3'], desc: 'Technique solide et vrais classiques.' },
  { id: 'platine', name: 'Platine', range: '10 - 12', icon: '/icons/platine-3.png', color: '#69e7ee', levelIds: ['platine-1','platine-2','platine-3'], desc: 'Groove, solos, nuances et endurance.' },
  { id: 'diamant', name: 'Diamant', range: '13 - 15', icon: '/icons/diamant-3.png', color: '#7a8dff', levelIds: ['diamant-1','diamant-2','diamant-3'], desc: 'Morceaux exigeants et jeu précis.' },
  { id: 'guitar-hero', name: 'Guitar Hero', range: '16', icon: '/icons/guitar-hero.png', color: '#c655ff', levelIds: ['guitar-hero'], desc: 'Le boss final.' },
]

const starterSongs = [
  { id: 1, title: 'Basket Case', artist: 'Green Day', level: 'bronze-1', youtube: '', description: 'Un classique punk rock avec des accords simples mais efficaces.', tabName: '', tabData: '', tabType: '' },
  { id: 2, title: 'Run', artist: 'Joji', level: 'bronze-3', youtube: '', description: 'Travail du son, du sustain et des phrases mélodiques.', tabName: '', tabData: '', tabType: '' },
  { id: 3, title: 'Don’t Fear The Reaper', artist: 'Blue Öyster Cult', level: 'argent-1', youtube: '', description: 'Arpèges réguliers, précision main droite, son clair.', tabName: '', tabData: '', tabType: '' },
]

function getLevel(id) { return levels.find(l => l.id === id) || levels[0] }
function getGroup(id) { return groups.find(g => g.id === id) || groups[0] }
function loadSongs() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || starterSongs } catch { return starterSongs } }
function youtubeToEmbed(url) {
  if (!url) return ''
  if (url.includes('/embed/')) return url
  const watch = url.match(/[?&]v=([^&]+)/)
  if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`
  const short = url.match(/youtu\.be\/([^?&]+)/)
  if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`
  return url
}
function blankForm(){ return { title:'', artist:'', level:'bronze-1', youtube:'', description:'', tabName:'', tabData:'', tabType:'' } }

export default function App(){
  const [songs, setSongs] = useState(loadSongs)
  const [groupId, setGroupId] = useState('bronze')
  const [selectedId, setSelectedId] = useState(loadSongs()[0]?.id || null)
  const [query, setQuery] = useState('')
  const [adminOpen, setAdminOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem(ADMIN_KEY) === 'true')
  const [password, setPassword] = useState('')
  const [form, setForm] = useState(blankForm())

  useEffect(()=>localStorage.setItem(STORAGE_KEY, JSON.stringify(songs)), [songs])

  const activeGroup = getGroup(groupId)
  const groupLevels = levels.filter(l => activeGroup.levelIds.includes(l.id))
  const filtered = useMemo(()=>{
    const q = query.toLowerCase().trim()
    return songs
      .filter(s => activeGroup.levelIds.includes(s.level))
      .filter(s => !q || `${s.title} ${s.artist}`.toLowerCase().includes(q))
      .sort((a,b)=> levels.findIndex(l=>l.id===a.level) - levels.findIndex(l=>l.id===b.level))
  }, [songs, activeGroup, query])
  const selectedSong = songs.find(s=>s.id === selectedId) || filtered[0] || null
  const progressXp = songs.reduce((sum, s)=>sum + getLevel(s.level).xp, 0)

  function selectGroup(id){
    const group = getGroup(id)
    setGroupId(id)
    const first = songs.find(s => group.levelIds.includes(s.level))
    setSelectedId(first?.id || null)
  }
  function login(e){ e.preventDefault(); if(password === ADMIN_PASSWORD){ setIsAdmin(true); localStorage.setItem(ADMIN_KEY,'true'); setPassword('') } }
  function logout(){ setIsAdmin(false); localStorage.removeItem(ADMIN_KEY) }
  function uploadTab(file){
    if(!file) return
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({...f, tabName:file.name, tabData:String(reader.result||''), tabType:file.type}))
    reader.readAsDataURL(file)
  }
  function addSong(e){
    e.preventDefault()
    if(!form.title.trim()) return
    const song = {...form, id: Date.now(), youtube: youtubeToEmbed(form.youtube)}
    setSongs([...songs, song])
    const group = groups.find(g => g.levelIds.includes(song.level)) || groups[0]
    setGroupId(group.id); setSelectedId(song.id); setForm(blankForm()); setAdminOpen(false)
  }
  function removeSong(id){ const next = songs.filter(s=>s.id!==id); setSongs(next); setSelectedId(next[0]?.id || null) }
  function exportBackup(){
    const blob = new Blob([JSON.stringify(songs,null,2)], {type:'application/json'})
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = url; a.download = 'guitar-ranked-backup.json'; a.click(); URL.revokeObjectURL(url)
  }
  function importBackup(file){
    if(!file) return; const r = new FileReader(); r.onload = () => { try{ const data = JSON.parse(r.result); if(Array.isArray(data)) setSongs(data) }catch{ alert('Backup invalide') }}; r.readAsText(file)
  }

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Guitar size={34}/></div><div><b>GUITAR</b><span>RANKED</span></div></div>
      <nav className="tier-nav">
        {groups.map(g => <button key={g.id} onClick={()=>selectGroup(g.id)} className={`tier ${g.id===groupId?'active':''}`} style={{'--accent':g.color}}>
          <img src={g.icon} alt="" />
          <div className="tier-text"><strong>{g.name}</strong><small>{g.range}</small></div>
          <span className="chev">›</span>
        </button>)}
      </nav>
    </aside>

    <main className="main">
      <header className="topbar">
        <div><h1>CLASSEMENT DES MORCEAUX</h1><p>Classement par niveau de difficulté</p></div>
        <div className="top-actions"><span className="xp"><Star size={22}/> {progressXp} XP</span><button onClick={()=>setAdminOpen(true)} className="admin-btn"><Lock size={17}/> Admin</button></div>
      </header>

      <section className="hero-card" style={{'--accent':activeGroup.color}}>
        <div className="hero-title"><img src={activeGroup.icon} /><div><h2>{activeGroup.name}</h2><p>Niveaux {activeGroup.range}</p><small>{activeGroup.desc}</small></div></div>
        <div className="progress-box"><span>PROGRESSION</span><b>{progressXp} XP</b><div className="bar"><i style={{width: `${Math.min(100, progressXp/5)}%`}} /></div><em>PROCHAIN NIVEAU <b>{Math.max(0, 500-progressXp)} XP</b></em></div>
      </section>

      <div className="mobile-tiers">{groups.map(g=><button key={g.id} onClick={()=>selectGroup(g.id)} className={g.id===groupId?'active':''}><img src={g.icon}/><span>{g.name}</span></button>)}</div>

      <div className="search-row"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un morceau ou un artiste..." /></div>

      <section className="table-card">
        <div className="table-head"><span>#</span><span>MORCEAU</span><span>ARTISTE</span><span>DIFFICULTÉ</span><span>XP</span></div>
        {filtered.length ? filtered.map((song, i) => {
          const lvl = getLevel(song.level)
          return <button key={song.id} onClick={()=>setSelectedId(song.id)} className={`song-row ${selectedSong?.id===song.id?'selected':''}`}>
            <span>{i+1}</span><span className="song-title"><b>{song.title}</b><small>{song.artist}</small></span><span>{song.artist}</span><span className="difficulty"><img src={lvl.icon}/><b style={{color:lvl.color}}>{lvl.label}</b></span><span>{lvl.xp} XP</span>
          </button>
        }) : <div className="empty">Aucun morceau dans ce niveau pour le moment.</div>}
      </section>

      <SongPanel song={selectedSong} isAdmin={isAdmin} onDelete={removeSong} />
    </main>

    {adminOpen && <AdminModal isAdmin={isAdmin} password={password} setPassword={setPassword} login={login} logout={logout} close={()=>setAdminOpen(false)} form={form} setForm={setForm} uploadTab={uploadTab} addSong={addSong} exportBackup={exportBackup} importBackup={importBackup}/>} 
  </div>
}

function SongPanel({song, isAdmin, onDelete}){
  if(!song) return <section className="detail-card empty-detail"><h2>Aucune vidéo</h2><p>Ajoute un morceau depuis l’espace admin.</p></section>
  const lvl = getLevel(song.level)
  return <section className="detail-card" style={{'--accent':lvl.color}}>
    <div className="detail-left"><img src={lvl.icon} className="big-badge"/><div><h2>{song.title}</h2><p>{song.artist}</p><div className="level-chip"><img src={lvl.icon}/>{lvl.label}</div><small>{song.description || 'Ajoute une description dans l’admin.'}</small></div></div>
    <div className="detail-mid"><h3>VIDÉO</h3>{song.youtube ? <iframe src={song.youtube} title={song.title} allowFullScreen/> : <div className="placeholder"><Play/>Ajoute un lien YouTube</div>}</div>
    <div className="detail-right"><h3>TABLATURE</h3>{song.tabData ? (song.tabType==='application/pdf' ? <><iframe className="pdf" src={song.tabData}/><a className="gold-button" href={song.tabData} download={song.tabName}><Download size={16}/> PDF</a></> : <img src={song.tabData} className="tab-img"/>) : <div className="placeholder"><FileText/>Aucune tab</div>}{isAdmin && <button className="delete" onClick={()=>onDelete(song.id)}><Trash2 size={16}/> Supprimer</button>}</div>
  </section>
}

function AdminModal({isAdmin,password,setPassword,login,logout,close,form,setForm,uploadTab,addSong,exportBackup,importBackup}){
  return <div className="modal-backdrop"><div className="modal"><button className="close" onClick={close}><X/></button><h2>ESPACE ADMIN</h2>
    {!isAdmin ? <form onSubmit={login} className="admin-login"><ShieldCheck/><p>Mot de passe par défaut : <b>guitarhero</b></p><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe"/><button className="gold-button">Entrer</button></form> : <>
      <div className="backup-row"><button onClick={exportBackup}><Download size={16}/> Export backup</button><label>Importer backup<input type="file" accept="application/json" onChange={e=>importBackup(e.target.files?.[0])}/></label><button onClick={logout}><LogOut size={16}/> Déconnexion</button></div>
      <form onSubmit={addSong} className="admin-form">
        <select value={form.level} onChange={e=>setForm({...form,level:e.target.value})}>{levels.map(l=><option key={l.id} value={l.id}>{l.label}</option>)}</select>
        <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Titre"/>
        <input value={form.artist} onChange={e=>setForm({...form,artist:e.target.value})} placeholder="Artiste"/>
        <input value={form.youtube} onChange={e=>setForm({...form,youtube:e.target.value})} placeholder="Lien YouTube"/>
        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description courte"/>
        <label className="upload"><Upload/> Uploader tablature PNG/JPG/PDF<input type="file" accept="image/png,image/jpeg,application/pdf" onChange={e=>uploadTab(e.target.files?.[0])}/></label>
        {form.tabName && <p className="file-ok">Fichier : {form.tabName}</p>}
        <button className="gold-button"><Plus size={16}/> Publier</button>
      </form>
    </>}
  </div></div>
}
