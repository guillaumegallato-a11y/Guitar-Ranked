import React, { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Lock, Upload, Download, Trash2, X, Guitar, Play, FileText, ShieldCheck, LogOut, ChevronDown, ChevronRight } from 'lucide-react'

const STORAGE_KEY = 'guitar-ranked-riot-v2-songs'
const ADMIN_KEY = 'guitar-ranked-riot-admin-v1'
const ADMIN_PASSWORD = 'guitarhero'

const levels = [
  { id: 'bronze-1', group: 'bronze', groupName: 'Bronze', label: 'Bronze 1', color: '#c47a37', icon: '/icons/bronze-1.png' },
  { id: 'bronze-2', group: 'bronze', groupName: 'Bronze', label: 'Bronze 2', color: '#c47a37', icon: '/icons/bronze-2.png' },
  { id: 'bronze-3', group: 'bronze', groupName: 'Bronze', label: 'Bronze 3', color: '#c47a37', icon: '/icons/bronze-3.png' },
  { id: 'argent-1', group: 'argent', groupName: 'Argent', label: 'Argent 1', color: '#d6d9df', icon: '/icons/argent-1.png' },
  { id: 'argent-2', group: 'argent', groupName: 'Argent', label: 'Argent 2', color: '#d6d9df', icon: '/icons/argent-2.png' },
  { id: 'argent-3', group: 'argent', groupName: 'Argent', label: 'Argent 3', color: '#d6d9df', icon: '/icons/argent-3.png' },
  { id: 'or-1', group: 'or', groupName: 'Or', label: 'Or 1', color: '#f4b62a', icon: '/icons/or-1.png' },
  { id: 'or-2', group: 'or', groupName: 'Or', label: 'Or 2', color: '#f4b62a', icon: '/icons/or-2.png' },
  { id: 'or-3', group: 'or', groupName: 'Or', label: 'Or 3', color: '#f4b62a', icon: '/icons/or-3.png' },
  { id: 'platine-1', group: 'platine', groupName: 'Platine', label: 'Platine 1', color: '#69e7ee', icon: '/icons/platine-1.png' },
  { id: 'platine-2', group: 'platine', groupName: 'Platine', label: 'Platine 2', color: '#69e7ee', icon: '/icons/platine-2.png' },
  { id: 'platine-3', group: 'platine', groupName: 'Platine', label: 'Platine 3', color: '#69e7ee', icon: '/icons/platine-3.png' },
  { id: 'diamant-1', group: 'diamant', groupName: 'Diamant', label: 'Diamant 1', color: '#7a8dff', icon: '/icons/diamant-1.png' },
  { id: 'diamant-2', group: 'diamant', groupName: 'Diamant', label: 'Diamant 2', color: '#7a8dff', icon: '/icons/diamant-2.png' },
  { id: 'diamant-3', group: 'diamant', groupName: 'Diamant', label: 'Diamant 3', color: '#7a8dff', icon: '/icons/diamant-3.png' },
  { id: 'guitar-hero', group: 'guitar-hero', groupName: 'Guitar Hero', label: 'Guitar Hero', color: '#c655ff', icon: '/icons/guitar-hero.png' },
]

const groups = [
  { id: 'bronze', name: 'Bronze', icon: '/icons/bronze-3.png', color: '#c47a37' },
  { id: 'argent', name: 'Argent', icon: '/icons/argent-3.png', color: '#d6d9df' },
  { id: 'or', name: 'Or', icon: '/icons/or-3.png', color: '#f4b62a' },
  { id: 'platine', name: 'Platine', icon: '/icons/platine-3.png', color: '#69e7ee' },
  { id: 'diamant', name: 'Diamant', icon: '/icons/diamant-3.png', color: '#7a8dff' },
  { id: 'guitar-hero', name: 'Guitar Hero', icon: '/icons/guitar-hero.png', color: '#c655ff' },
]

function getLevel(id) { return levels.find(l => l.id === id) || levels[0] }
function loadSongs() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] } }
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
  const [openGroups, setOpenGroups] = useState({ bronze: true })
  const [selectedLevel, setSelectedLevel] = useState('bronze-1')
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [adminOpen, setAdminOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem(ADMIN_KEY) === 'true')
  const [password, setPassword] = useState('')
  const [form, setForm] = useState(blankForm())

  useEffect(()=>localStorage.setItem(STORAGE_KEY, JSON.stringify(songs)), [songs])

  const level = getLevel(selectedLevel)
  const filtered = useMemo(()=>{
    const q = query.toLowerCase().trim()
    return songs
      .filter(s => s.level === selectedLevel)
      .filter(s => !q || `${s.title} ${s.artist}`.toLowerCase().includes(q))
  }, [songs, selectedLevel, query])
  const selectedSong = songs.find(s=>s.id === selectedId && s.level === selectedLevel) || filtered[0] || null

  function toggleGroup(groupId){
    setOpenGroups(current => ({ ...current, [groupId]: !current[groupId] }))
  }
  function chooseLevel(levelId){
    const nextLevel = getLevel(levelId)
    setSelectedLevel(levelId)
    setOpenGroups(current => ({ ...current, [nextLevel.group]: true }))
    const first = songs.find(s => s.level === levelId)
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
    setSongs(current => [...current, song])
    chooseLevel(song.level)
    setSelectedId(song.id)
    setForm(blankForm())
    setAdminOpen(false)
  }
  function removeSong(id){
    const next = songs.filter(s=>s.id!==id)
    setSongs(next)
    const first = next.find(s=>s.level===selectedLevel)
    setSelectedId(first?.id || null)
  }
  function exportBackup(){
    const blob = new Blob([JSON.stringify(songs,null,2)], {type:'application/json'})
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = url; a.download = 'guitar-ranked-backup.json'; a.click(); URL.revokeObjectURL(url)
  }
  function importBackup(file){
    if(!file) return
    const r = new FileReader()
    r.onload = () => { try{ const data = JSON.parse(r.result); if(Array.isArray(data)) setSongs(data) }catch{ alert('Backup invalide') }}
    r.readAsText(file)
  }

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Guitar size={34}/></div><div><b>GUITAR</b><span>RANKED</span></div></div>
      <nav className="tier-nav">
        {groups.map(g => {
          const groupLevels = levels.filter(l => l.group === g.id)
          const isOpen = openGroups[g.id]
          return <div className="tier-block" key={g.id}>
            <button onClick={()=>toggleGroup(g.id)} className={`tier ${isOpen?'open':''}`} style={{'--accent':g.color}}>
              <img src={g.icon} alt="" />
              <div className="tier-text"><strong>{g.name}</strong></div>
              <span className="chev">{isOpen ? <ChevronDown/> : <ChevronRight/>}</span>
            </button>
            {isOpen && <div className="level-list">
              {groupLevels.map(l => {
                const count = songs.filter(s=>s.level===l.id).length
                return <button key={l.id} onClick={()=>chooseLevel(l.id)} className={`level-button ${selectedLevel===l.id?'active':''}`} style={{'--accent':l.color}}>
                  <img src={l.icon} alt="" />
                  <span>{l.label}</span>
                  <small>{count}</small>
                </button>
              })}
            </div>}
          </div>
        })}
      </nav>
    </aside>

    <main className="main">
      <header className="topbar">
        <div><h1>CLASSEMENT DES MORCEAUX</h1><p>Classement par niveau de difficulté</p></div>
        <button onClick={()=>setAdminOpen(true)} className="admin-btn"><Lock size={17}/> Admin</button>
      </header>

      <div className="mobile-tiers">{levels.map(l=><button key={l.id} onClick={()=>chooseLevel(l.id)} className={l.id===selectedLevel?'active':''} style={{'--accent':l.color}}><img src={l.icon}/><span>{l.label}</span></button>)}</div>

      <section className="hero-card" style={{'--accent':level.color}}>
        <div className="hero-title"><img src={level.icon} /><div><h2>{level.label}</h2><p>{level.groupName}</p><small>Les morceaux ajoutés dans cette catégorie apparaissent ici.</small></div></div>
      </section>

      <div className="search-row"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un morceau ou un artiste..." /></div>

      <section className="table-card">
        <div className="table-head"><span>#</span><span>MORCEAU</span><span>ARTISTE</span><span>DIFFICULTÉ</span></div>
        {filtered.length ? filtered.map((song, i) => {
          const lvl = getLevel(song.level)
          return <button key={song.id} onClick={()=>setSelectedId(song.id)} className={`song-row ${selectedSong?.id===song.id?'selected':''}`}>
            <span>{i+1}</span>
            <span className="song-title"><b>{song.title}</b></span>
            <span>{song.artist}</span>
            <span className="difficulty"><img src={lvl.icon}/>{lvl.label}</span>
          </button>
        }) : <div className="empty">Aucun morceau dans {level.label}. Ajoute ton premier morceau depuis l’admin.</div>}
      </section>

      <SongDetail song={selectedSong} isAdmin={isAdmin} onDelete={removeSong}/>
    </main>

    {adminOpen && <AdminModal isAdmin={isAdmin} password={password} setPassword={setPassword} login={login} logout={logout} onClose={()=>setAdminOpen(false)} form={form} setForm={setForm} uploadTab={uploadTab} addSong={addSong} exportBackup={exportBackup} importBackup={importBackup}/>} 
  </div>
}

function SongDetail({song, isAdmin, onDelete}){
  if(!song) return <section className="detail-card empty-detail"><h2>Aucun morceau sélectionné</h2><p>Ajoute un morceau pour afficher la vidéo et la tablature ici.</p></section>
  const lvl = getLevel(song.level)
  return <section className="detail-card" style={{'--accent':lvl.color}}>
    <div className="detail-left">
      <img className="big-badge" src={lvl.icon}/>
      <div>
        <h2>{song.title}</h2>
        <p>{song.artist}</p>
        <span className="level-chip"><img src={lvl.icon}/> {lvl.label}</span>
        {song.description && <small>{song.description}</small>}
        {isAdmin && <button onClick={()=>onDelete(song.id)} className="delete"><Trash2 size={16}/> Supprimer</button>}
      </div>
    </div>
    <div className="detail-mid"><h3>VIDÉO</h3>{song.youtube ? <iframe src={song.youtube} allowFullScreen /> : <div className="placeholder"><Play/>Ajoute un lien YouTube pour ce morceau.</div>}</div>
    <div className="detail-right"><h3>TABLATURE</h3>{renderTab(song)}</div>
  </section>
}
function renderTab(song){
  if(song.tabData && song.tabType?.startsWith('image/')) return <img className="tab-img" src={song.tabData}/>
  if(song.tabData && song.tabType === 'application/pdf') return <><iframe className="pdf" src={song.tabData}/><a className="download" href={song.tabData} download={song.tabName || 'tablature.pdf'}><Download size={16}/> Télécharger</a></>
  return <div className="placeholder"><FileText/>Aucune tablature ajoutée.</div>
}
function AdminModal({isAdmin,password,setPassword,login,logout,onClose,form,setForm,uploadTab,addSong,exportBackup,importBackup}){
  return <div className="modal-backdrop"><div className="modal"><button className="close" onClick={onClose}><X/></button><h2>Espace admin</h2>
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
