'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Icon helper ──────────────────────────────────────────────────────────────
function Ico({ d, size = 16, color, className = '' }: { d: string; size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  )
}
const I = {
  grid:    'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  tag:     'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
  face:    'M9 10h.01M15 10h.01M12 16a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4zM3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2',
  bell:    'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  shield:  'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  layers:  'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  social:  'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  zap:     'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  db:      'M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zM12 12c-4.42 0-8-1.79-8-4s3.58-4 8-4 8 1.79 8 4-3.58 4-8 4z',
  bank:    'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
  alert:   'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  check:   'M20 6L9 17l-5-5',
  x:       'M18 6L6 18M6 6l12 12',
  upload:  'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  trend:   'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  mappin:  'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  fire:    'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  eye:     'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  activity:'M22 12h-4l-3 9L9 3l-3 9H2',
  logo:    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  lock:    'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
  cam:     'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function Pulse({ color = '#22c55e', size = 8 }: { color?: string; size?: number }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: color }} />
      <span className="relative rounded-full" style={{ width: size, height: size, backgroundColor: color }} />
    </span>
  )
}
function Clock() {
  const [t, setT] = useState('')
  useEffect(() => { const f = () => setT(new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })); f(); const id = setInterval(f, 1000); return () => clearInterval(id) }, [])
  return <span className="font-mono tabular-nums text-sm text-white">{t}</span>
}
function Battery({ pct }: { pct: number }) {
  const c = pct > 60 ? '#22c55e' : pct > 30 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-1">
      <div className="relative w-7 h-2.5 rounded-sm border border-gray-600 overflow-hidden">
        <div className="absolute inset-0" style={{ width: `${pct}%`, backgroundColor: c }} />
      </div>
      <span className="text-[9px] tabular-nums" style={{ color: c }}>{pct}%</span>
    </div>
  )
}
function Signal({ v }: { v: number }) {
  return (
    <div className="flex items-end gap-0.5">
      {[1,2,3,4].map(i => <div key={i} className="w-1 rounded-sm" style={{ height: 3+i*3, backgroundColor: i<=v ? '#22c55e' : '#374151' }} />)}
    </div>
  )
}
function Bar({ pct, color, h = 4 }: { pct: number; color: string; h?: number }) {
  return (
    <div className="rounded-full bg-gray-800 overflow-hidden" style={{ height: h }}>
      <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} />
    </div>
  )
}
function Ring({ pct, color, label, val }: { pct: number; color: string; label: string; val: string }) {
  const r = 26, c2 = 2*Math.PI*r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#1f2937" strokeWidth="5" />
        <motion.circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c2} initial={{ strokeDashoffset: c2 }} animate={{ strokeDashoffset: c2*(1-pct/100) }}
          transition={{ duration: 1.2 }} transform="rotate(-90 32 32)" />
        <text x="32" y="36" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{pct}%</text>
      </svg>
      <span className="text-[9px] text-gray-500">{label}</span>
      <span className="text-[10px] font-bold" style={{ color }}>{val}</span>
    </div>
  )
}
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const mx = Math.max(...data), mn = Math.min(...data), w = 72, h = 28, p = 2
  const pts = data.map((v, i) => `${p+(i/(data.length-1))*(w-2*p)},${h-p-((v-mn)/(mx-mn+1))*(h-2*p)}`).join(' ')
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.85" /></svg>
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Mod = 'overview'|'tracking'|'faces'|'alerts'|'zones'|'social'|'viral'|'iforge'|'banco'
type TagDevice = { id:string; name:string; zone:string; battery:number; rssi:number; lat:number; lng:number; lastSeen:string; status:'online'|'alert'|'lost'; owner:string; asset:string }
type FaceEv = { id:string; name:string; confidence:number; status:'authorized'|'unknown'|'restricted'; cam:string; time:string; zone:string }
type AlertItem = { id:string; level:'critical'|'high'|'medium'|'low'; msg:string; source:string; time:string; acked:boolean }

const TAGS: TagDevice[] = [
  { id:'AT-001', name:'MacBook Pro Dirección', zone:'Oficina Ejecutiva', battery:87, rssi:4, lat:32, lng:28, lastSeen:'Ahora', status:'online', owner:'CEO', asset:'Laptop' },
  { id:'AT-002', name:'Mochila Sistemas', zone:'Sala de Juntas', battery:62, rssi:3, lat:52, lng:18, lastSeen:'hace 1 min', status:'online', owner:'IT', asset:'Mochila' },
  { id:'AT-003', name:'Servidor Rack-01', zone:'Data Center', battery:100, rssi:4, lat:68, lng:58, lastSeen:'Ahora', status:'online', owner:'IT', asset:'Hardware' },
  { id:'AT-004', name:'Toyota Hilux · SDQ-8821', zone:'Estacionamiento', battery:45, rssi:2, lat:78, lng:78, lastSeen:'hace 3 min', status:'alert', owner:'Operaciones', asset:'Vehículo' },
  { id:'AT-005', name:'Tablet Ventas RD', zone:'Zona Comercial', battery:18, rssi:1, lat:22, lng:62, lastSeen:'hace 8 min', status:'alert', owner:'Ventas', asset:'Tablet' },
  { id:'AT-006', name:'Cámara Sony α7', zone:'Desconocida', battery:71, rssi:0, lat:10, lng:42, lastSeen:'hace 24 min', status:'lost', owner:'Marketing', asset:'Cámara' },
  { id:'AT-007', name:'Caja de Valores', zone:'Bodega Norte', battery:94, rssi:3, lat:44, lng:73, lastSeen:'hace 2 min', status:'online', owner:'Seguridad', asset:'Activo' },
  { id:'AT-008', name:'Drone DJI Mavic 3', zone:'Azotea', battery:38, rssi:2, lat:58, lng:12, lastSeen:'hace 5 min', status:'online', owner:'Ops', asset:'Drone' },
  { id:'AT-009', name:'iPad Gerencia', zone:'Sala de Juntas', battery:55, rssi:3, lat:50, lng:24, lastSeen:'hace 1 min', status:'online', owner:'Gerencia', asset:'Tablet' },
  { id:'AT-010', name:'Generador Portátil', zone:'Almacén B', battery:89, rssi:2, lat:35, lng:82, lastSeen:'hace 4 min', status:'online', owner:'Mantenimiento', asset:'Equipo' },
]
const FACES: FaceEv[] = [
  { id:'F001', name:'Carlos Méndez Reyes', confidence:98.4, status:'authorized', cam:'CAM-01', time:'14:32:11', zone:'Entrada Principal' },
  { id:'F002', name:'DESCONOCIDO', confidence:0, status:'unknown', cam:'CAM-02', time:'14:31:58', zone:'Estacionamiento' },
  { id:'F003', name:'Ana García López', confidence:95.1, status:'authorized', cam:'CAM-03', time:'14:31:44', zone:'Pasillo Central' },
  { id:'F004', name:'LISTA NEGRA · REF-447', confidence:87.3, status:'restricted', cam:'CAM-01', time:'14:30:22', zone:'Entrada Principal' },
  { id:'F005', name:'Roberto Almonte', confidence:92.7, status:'authorized', cam:'CAM-04', time:'14:29:55', zone:'Data Center' },
  { id:'F006', name:'María Concepción V.', confidence:96.2, status:'authorized', cam:'CAM-03', time:'14:29:10', zone:'Pasillo Central' },
  { id:'F007', name:'DESCONOCIDO', confidence:0, status:'unknown', cam:'CAM-02', time:'14:28:10', zone:'Estacionamiento' },
  { id:'F008', name:'Juan Bautista Peralta', confidence:91.5, status:'authorized', cam:'CAM-05', time:'14:27:33', zone:'Sala de Juntas' },
]
const INIT_ALERTS: AlertItem[] = [
  { id:'A1', level:'critical', msg:'Rostro en lista negra · Entrada Principal · Ref-447', source:'Face AI', time:'14:30:22', acked:false },
  { id:'A2', level:'critical', msg:'AT-006 sin señal 24 min · Cámara Sony extraviada', source:'AirTrack', time:'14:10:00', acked:false },
  { id:'A3', level:'high', msg:'AT-004 salió de zona autorizada · Vehículo SDQ-8821', source:'AirTrack', time:'14:28:05', acked:false },
  { id:'A4', level:'high', msg:'2 personas desconocidas · Estacionamiento', source:'Face AI', time:'14:28:10', acked:false },
  { id:'A5', level:'medium', msg:'Batería crítica 18% · AT-005 · Tablet Ventas', source:'AirTrack', time:'14:25:33', acked:false },
  { id:'A6', level:'medium', msg:'Scraping bloqueado · LinkedIn · Proxy agotado', source:'iForge', time:'14:20:00', acked:false },
  { id:'A7', level:'low', msg:'CAM-07 sin señal · Perímetro Norte', source:'Video', time:'14:18:00', acked:true },
  { id:'A8', level:'low', msg:'Post programado sin publicar · Instagram 12:00', source:'Social', time:'12:05:00', acked:true },
]

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV: { id:Mod; label:string; icon:keyof typeof I; color:string }[] = [
  { id:'overview',  label:'Centro de Control',       icon:'grid',    color:'#6366f1' },
  { id:'tracking',  label:'Rastreo de Dispositivos', icon:'tag',     color:'#22c55e' },
  { id:'faces',     label:'Detección Facial · CAM',  icon:'face',    color:'#3b82f6' },
  { id:'alerts',    label:'Alertas & Eventos',        icon:'alert',   color:'#ef4444' },
  { id:'zones',     label:'Zonas de Seguridad',       icon:'layers',  color:'#f59e0b' },
  { id:'social',    label:'Redes Sociales',           icon:'social',  color:'#ec4899' },
  { id:'viral',     label:'Contenido Viral · IA',     icon:'fire',    color:'#f97316' },
  { id:'iforge',    label:'iForge · Bases de Datos',  icon:'db',      color:'#10b981' },
  { id:'banco',     label:'Banco Contrainteligencia', icon:'bank',    color:'#a855f7' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE MAP
// ═══════════════════════════════════════════════════════════════════════════════
function LiveMap({ tags, selected, onSelect }: { tags:TagDevice[]; selected:string|null; onSelect:(id:string)=>void }) {
  const zones = [
    { label:'Oficina Ejecutiva', x:24, y:20, w:26, h:20, c:'#6366f120' },
    { label:'Sala de Juntas', x:46, y:10, w:18, h:18, c:'#3b82f620' },
    { label:'Data Center', x:60, y:50, w:20, h:20, c:'#f59e0b20' },
    { label:'Estacionamiento', x:68, y:70, w:22, h:22, c:'#8b5cf620' },
    { label:'Bodega Norte', x:36, y:65, w:18, h:16, c:'#22c55e20' },
    { label:'Zona Comercial', x:15, y:55, w:16, h:18, c:'#ec489920' },
  ]
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10" style={{ background:'#08090d' }}>
      <svg className="absolute inset-0 w-full h-full opacity-8" preserveAspectRatio="none">
        {Array.from({length:14}).map((_,i)=>(
          <g key={i}>
            <line x1={`${i*8}%`} y1="0" x2={`${i*8}%`} y2="100%" stroke="#4f46e5" strokeWidth="0.4"/>
            <line x1="0" y1={`${i*8}%`} x2="100%" y2={`${i*8}%`} stroke="#4f46e5" strokeWidth="0.4"/>
          </g>
        ))}
      </svg>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="18" y="5" width="65" height="90" rx="1" fill="none" stroke="#1f2937" strokeWidth="0.6"/>
        {zones.map((z,i)=>(
          <g key={i}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="0.5" fill={z.c} stroke={z.c.replace('20','50')} strokeWidth="0.3"/>
            <text x={z.x+z.w/2} y={z.y+z.h/2} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.35)" fontSize="2.1">{z.label}</text>
          </g>
        ))}
      </svg>
      {tags.map(tag=>{
        const col = tag.status==='online'?'#22c55e':tag.status==='alert'?'#f59e0b':'#ef4444'
        const sel = selected===tag.id
        return (
          <motion.button key={tag.id} className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left:`${tag.lat}%`, top:`${tag.lng}%` }} onClick={()=>onSelect(tag.id)} whileHover={{ scale:1.5 }}>
            <motion.div className="rounded-full border-2 flex items-center justify-center"
              style={{ width:sel?22:15, height:sel?22:15, backgroundColor:`${col}25`, borderColor:col }}
              animate={tag.status!=='lost'?{ boxShadow:[`0 0 5px ${col}50`,`0 0 14px ${col}90`,`0 0 5px ${col}50`] }:{}}
              transition={{ duration:2, repeat:Infinity }}>
              <div className="rounded-full" style={{ width:5, height:5, backgroundColor:col }}/>
            </motion.div>
            {sel&&<motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}}
              className="absolute left-1/2 -translate-x-1/2 -top-7 whitespace-nowrap text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background:col, color:'#000' }}>{tag.name}</motion.div>}
          </motion.button>
        )
      })}
      <div className="absolute bottom-2 left-2 flex gap-3 text-[9px]">
        {[['#22c55e','Online'],['#f59e0b','Alerta'],['#ef4444','Perdido']].map(([c,l])=>(
          <div key={l} className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{background:c as string}}/><span className="text-gray-500">{l}</span></div>
        ))}
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[9px] text-gray-600 font-mono">
        <Pulse color="#22c55e" size={5}/> RASTREO EN VIVO · SDQ
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FACE CAM
// ═══════════════════════════════════════════════════════════════════════════════
function FaceCam({ camId, location, status, faces }: { camId:string; location:string; status:'online'|'alert'|'offline'; faces:{x:number;y:number;label:string;ok:boolean}[] }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/8" style={{ background:'#050a0f' }}>
      <div className="relative" style={{ height:120 }}>
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at center,#0a1628,#030508)' }}/>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,100,0.05) 2px,rgba(0,255,100,0.06) 4px)' }}/>
        {status!=='offline'&&<motion.div className="absolute inset-x-0 h-0.5 opacity-25" style={{ background:'linear-gradient(90deg,transparent,#22c55e,transparent)' }} animate={{ top:['0%','100%'] }} transition={{ duration:3, repeat:Infinity, ease:'linear' }}/>}
        {status!=='offline'&&faces.map((f,i)=>(
          <motion.div key={i} className="absolute border rounded-sm" style={{ left:`${f.x}%`, top:`${f.y}%`, width:32, height:40, borderColor:f.ok?'#22c55e':'#ef4444', background:f.ok?'rgba(34,197,94,0.04)':'rgba(239,68,68,0.06)', transform:'translate(-50%,-50%)' }}
            animate={{ borderColor:f.ok?['#22c55e','#22c55e60','#22c55e']:['#ef4444','#ef444460','#ef4444'] }} transition={{ duration:1.5, repeat:Infinity, delay:i*0.3 }}>
            {[0,1,2,3].map(c=>(
              <div key={c} className="absolute w-1.5 h-1.5" style={{ borderColor:f.ok?'#22c55e':'#ef4444', borderStyle:'solid', borderWidth:c<2?'1.5px 0 0 1.5px':'0 1.5px 1.5px 0', top:c===0||c===2?-1:undefined, bottom:c===1||c===3?-1:undefined, left:c===0||c===1?-1:undefined, right:c===2||c===3?-1:undefined }}/>
            ))}
            <div className="absolute -bottom-4 left-0 right-0 text-center">
              <span className="text-[7px] font-bold" style={{ color:f.ok?'#22c55e':'#ef4444' }}>{f.label}</span>
            </div>
          </motion.div>
        ))}
        {status==='offline'&&<div className="absolute inset-0 flex items-center justify-center bg-black/70"><p className="text-xs text-gray-500">SIN SEÑAL</p></div>}
        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5">
          <Pulse color={status==='online'?'#22c55e':status==='alert'?'#ef4444':'#6b7280'} size={5}/>
          <span className="text-[9px] font-mono text-gray-300">{camId}</span>
        </div>
        {status==='alert'&&<motion.div className="absolute top-1.5 right-1.5 text-[8px] font-bold text-red-400 bg-red-500/20 border border-red-500/40 rounded px-1.5 py-0.5" animate={{ opacity:[1,0.4,1] }} transition={{ duration:0.8, repeat:Infinity }}>ALERTA</motion.div>}
      </div>
      <div className="px-2.5 py-1.5 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">{location}</span>
        <span className="text-[9px] font-medium" style={{ color:status==='online'?'#22c55e':status==='alert'?'#ef4444':'#6b7280' }}>{faces.length} rostros</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════════════════════════════
function StatCard({ label, value, sub, color, icon, trend, spark }: { label:string; value:string|number; sub:string; color:string; icon:keyof typeof I; trend:number; spark:number[] }) {
  return (
    <motion.div className="rounded-xl p-4 border border-white/5" style={{ background:'rgba(255,255,255,0.03)' }} whileHover={{ scale:1.02 }} transition={{ type:'spring', stiffness:400 }}>
      <div className="flex items-center justify-between mb-2">
        <div className="rounded-lg p-1.5" style={{ background:`${color}20` }}><Ico d={I[icon]} size={14} color={color}/></div>
        <span className={`text-xs font-semibold ${trend>=0?'text-emerald-400':'text-red-400'}`}>{trend>=0?'↑':'↓'} {Math.abs(trend)}%</span>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>
      <div className="flex items-end justify-between mt-2">
        <span className="text-[9px] text-gray-600">{label}</span>
        <Sparkline data={spark} color={color}/>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function Overview({ tags, alerts, onNav }: { tags:TagDevice[]; alerts:AlertItem[]; onNav:(m:Mod)=>void }) {
  const online = tags.filter(t=>t.status==='online').length
  const unacked = alerts.filter(a=>!a.acked).length
  const activity = [
    { icon:'face', color:'#ef4444', msg:'Rostro en lista negra detectado · Entrada Principal', t:'hace 2 min' },
    { icon:'tag', color:'#f59e0b', msg:'AT-004 · Toyota Hilux salió de zona autorizada', t:'hace 5 min' },
    { icon:'social', color:'#ec4899', msg:'Post viral · 28K impresiones · Instagram RD', t:'hace 8 min' },
    { icon:'db', color:'#10b981', msg:'iForge importó 420 registros · DGII + CNSS', t:'hace 12 min' },
    { icon:'fire', color:'#f97316', msg:'#RepúblicaDominicana trending #4 · TikTok', t:'hace 15 min' },
    { icon:'bank', color:'#a855f7', msg:'Nuevo expediente clasificado · Caso #0089', t:'hace 20 min' },
    { icon:'tag', color:'#22c55e', msg:'AT-003 · Servidor Rack-01 · Sincronizado', t:'hace 22 min' },
    { icon:'social', color:'#3b82f6', msg:'LinkedIn · 340 nuevas conexiones esta semana', t:'hace 30 min' },
  ]
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Dispositivos Online" value={online} sub={`de ${tags.length} registrados`} color="#22c55e" icon="tag" trend={5} spark={[5,6,5,7,6,8,7,9,8,online]}/>
        <StatCard label="Alertas Activas" value={unacked} sub="requieren atención" color="#ef4444" icon="alert" trend={-12} spark={[8,6,9,5,7,4,6,3,5,unacked]}/>
        <StatCard label="Seguidores Totales" value="63.4K" sub="5 plataformas · SDQ" color="#ec4899" icon="social" trend={18} spark={[40,48,55,52,60,58,65,62,70,75]}/>
        <StatCard label="Registros iForge" value="1.42M" sub="18 fuentes conectadas" color="#10b981" icon="db" trend={9} spark={[30,40,38,52,48,60,58,72,68,80]}/>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Mapa de Instalaciones · Santo Domingo</h2>
            <div className="flex items-center gap-2"><Pulse size={6}/><span className="text-[10px] text-gray-500">Actualizando cada 3s</span></div>
          </div>
          <div style={{ height:320 }}><LiveMap tags={tags} selected={null} onSelect={()=>{}}/></div>
        </div>
        <div className="col-span-4 flex flex-col gap-3">
          <div className="rounded-xl border border-white/5 p-4 flex-1" style={{ background:'rgba(255,255,255,0.02)' }}>
            <h3 className="text-xs font-bold text-white mb-3">Actividad en Tiempo Real</h3>
            <div className="space-y-2.5">
              {activity.map((a,i)=>(
                <motion.div key={i} className="flex items-start gap-2" initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.06 }}>
                  <div className="rounded-full p-1 flex-shrink-0 mt-0.5" style={{ background:`${a.color}20` }}>
                    <Ico d={I[a.icon as keyof typeof I]} size={10} color={a.color}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-300 leading-tight">{a.msg}</p>
                    <p className="text-[9px] text-gray-600 mt-0.5">{a.t}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {NAV.filter(n=>n.id!=='overview').map(n=>(
          <motion.button key={n.id} onClick={()=>onNav(n.id)}
            className="rounded-xl p-3.5 border border-white/5 text-left hover:border-white/15 transition-all flex items-center gap-3"
            style={{ background:`${n.color}08` }} whileHover={{ scale:1.02, x:2 }}>
            <div className="rounded-lg p-2" style={{ background:`${n.color}20` }}><Ico d={I[n.icon]} size={14} color={n.color}/></div>
            <span className="text-xs font-medium text-gray-300">{n.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: TRACKING
// ═══════════════════════════════════════════════════════════════════════════════
function TrackingModule({ tags }: { tags:TagDevice[] }) {
  const [sel, setSel] = useState<string|null>(null)
  const device = tags.find(t=>t.id===sel)
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-7 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Rastreo en Tiempo Real · AirTag / BLE · Santo Domingo</h2>
            <p className="text-[10px] text-gray-600 mt-0.5">Haz clic en un dispositivo para ver detalles</p>
          </div>
          <div className="flex gap-4 text-[10px]">
            <span className="text-green-400">{tags.filter(t=>t.status==='online').length} online</span>
            <span className="text-amber-400">{tags.filter(t=>t.status==='alert').length} alerta</span>
            <span className="text-red-400">{tags.filter(t=>t.status==='lost').length} perdido</span>
          </div>
        </div>
        <div style={{ height:360 }}><LiveMap tags={tags} selected={sel} onSelect={id=>setSel(id===sel?null:id)}/></div>
        <AnimatePresence>
          {device&&(
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}
              className="rounded-xl p-4 border grid grid-cols-4 gap-3"
              style={{ background:device.status==='online'?'#22c55e08':device.status==='alert'?'#f59e0b08':'#ef444408', borderColor:device.status==='online'?'#22c55e30':device.status==='alert'?'#f59e0b30':'#ef444430' }}>
              {[['ID', device.id],['Zona', device.zone],['Propietario', device.owner],['Tipo', device.asset]].map(([k,v])=>(
                <div key={k}><p className="text-[9px] text-gray-600">{k}</p><p className="text-xs font-bold text-white">{v}</p></div>
              ))}
              <div><p className="text-[9px] text-gray-600 mb-1">Batería</p><Battery pct={device.battery}/></div>
              <div><p className="text-[9px] text-gray-600 mb-1">Señal BLE</p><Signal v={device.rssi}/></div>
              <div><p className="text-[9px] text-gray-600">Último visto</p><p className="text-xs text-white">{device.lastSeen}</p></div>
              <div><p className="text-[9px] text-gray-600">Estado</p>
                <p className="text-xs font-bold" style={{ color:device.status==='online'?'#22c55e':device.status==='alert'?'#f59e0b':'#ef4444' }}>
                  {device.status==='online'?'En línea':device.status==='alert'?'Fuera de zona':'Sin señal'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="col-span-5 rounded-xl border border-white/5 flex flex-col" style={{ background:'rgba(255,255,255,0.02)' }}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Dispositivos Registrados</h3>
          <span className="text-[10px] text-gray-500">{tags.length} dispositivos</span>
        </div>
        <div className="overflow-y-auto divide-y divide-white/5" style={{ maxHeight:560 }}>
          {tags.map(tag=>{
            const col = tag.status==='online'?'#22c55e':tag.status==='alert'?'#f59e0b':'#ef4444'
            return (
              <button key={tag.id} onClick={()=>setSel(tag.id===sel?null:tag.id)}
                className="w-full p-3 text-left hover:bg-white/3 transition-colors"
                style={sel===tag.id?{ background:`${col}10` }:{}}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg flex-shrink-0" style={{ background:`${col}15` }}><Pulse color={col} size={7}/></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-white truncate">{tag.name}</span>
                      <span className="text-[9px] font-mono text-gray-600 flex-shrink-0">{tag.id}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{tag.zone} · {tag.lastSeen}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <Battery pct={tag.battery}/>
                      <Signal v={tag.rssi}/>
                      <span className="text-[9px]" style={{ color:col }}>{tag.status==='online'?'Online':tag.status==='alert'?'Fuera de zona':'Sin señal'}</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: FACES
// ═══════════════════════════════════════════════════════════════════════════════
function FacesModule() {
  const cams = [
    { camId:'CAM-01', location:'Entrada Principal', status:'alert' as const, faces:[{ x:35,y:45,label:'LISTA NEGRA',ok:false },{ x:65,y:40,label:'Autorizado',ok:true }] },
    { camId:'CAM-02', location:'Estacionamiento', status:'alert' as const, faces:[{ x:40,y:50,label:'DESCONOCIDO',ok:false }] },
    { camId:'CAM-03', location:'Pasillo Central', status:'online' as const, faces:[{ x:55,y:45,label:'Autorizado',ok:true },{ x:70,y:55,label:'Autorizado',ok:true }] },
    { camId:'CAM-04', location:'Data Center', status:'online' as const, faces:[{ x:50,y:50,label:'Autorizado',ok:true }] },
    { camId:'CAM-05', location:'Sala de Juntas', status:'online' as const, faces:[{ x:45,y:48,label:'Autorizado',ok:true }] },
    { camId:'CAM-06', location:'Bodega Norte', status:'online' as const, faces:[] },
    { camId:'CAM-07', location:'Perímetro Norte', status:'offline' as const, faces:[] },
    { camId:'CAM-08', location:'Azotea / Drones', status:'online' as const, faces:[] },
  ]
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[{ l:'Cámaras Activas', v:'7/8', c:'#22c55e' },{ l:'Rostros Detectados', v:'8', c:'#3b82f6' },{ l:'Autorizados', v:'6', c:'#22c55e' },{ l:'Alertas Faciales', v:'2', c:'#ef4444' }].map(s=>(
          <div key={s.l} className="rounded-xl p-3.5 border border-white/5" style={{ background:`${s.c}08` }}>
            <p className="text-xl font-black text-white">{s.v}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 grid grid-cols-4 gap-2.5">
          {cams.map(c=><FaceCam key={c.camId} {...c}/>)}
        </div>
        <div className="col-span-4 rounded-xl border border-white/5 flex flex-col" style={{ background:'rgba(255,255,255,0.02)' }}>
          <div className="p-3.5 border-b border-white/5">
            <h3 className="text-sm font-bold text-white">Registro de Detecciones</h3>
          </div>
          <div className="overflow-y-auto divide-y divide-white/5" style={{ maxHeight:480 }}>
            {FACES.map(ev=>{
              const col = ev.status==='authorized'?'#22c55e':ev.status==='restricted'?'#ef4444':'#f59e0b'
              return (
                <div key={ev.id} className="p-3" style={ev.status==='restricted'?{ background:'rgba(239,68,68,0.05)' }:{}}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded" style={{ color:col, background:`${col}20` }}>
                      {ev.status==='authorized'?'AUTORIZADO':ev.status==='restricted'?'⚠ RESTRINGIDO':'DESCONOCIDO'}
                    </span>
                    <span className="text-[9px] font-mono text-gray-600">{ev.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-white">{ev.name}</p>
                  <p className="text-[9px] text-gray-500 mt-0.5">{ev.cam} · {ev.zone}</p>
                  {ev.confidence>0&&(
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1"><Bar pct={ev.confidence} color={col} h={3}/></div>
                      <span className="text-[9px] text-gray-600">{ev.confidence}%</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: ALERTS
// ═══════════════════════════════════════════════════════════════════════════════
function AlertsModule({ alerts, onAck }: { alerts:AlertItem[]; onAck:(id:string)=>void }) {
  const cfg = {
    critical:{ color:'#ef4444', bg:'rgba(239,68,68,0.08)', border:'rgba(239,68,68,0.25)', label:'CRÍTICO' },
    high:{ color:'#f97316', bg:'rgba(249,115,22,0.08)', border:'rgba(249,115,22,0.25)', label:'ALTO' },
    medium:{ color:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)', label:'MEDIO' },
    low:{ color:'#6b7280', bg:'rgba(107,114,128,0.08)', border:'rgba(107,114,128,0.25)', label:'BAJO' },
  }
  const unacked = alerts.filter(a=>!a.acked)
  const acked = alerts.filter(a=>a.acked)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {(['critical','high','medium','low'] as const).map(l=>(
          <div key={l} className="rounded-xl p-3.5 border" style={{ background:cfg[l].bg, borderColor:cfg[l].border }}>
            <p className="text-2xl font-black text-white">{alerts.filter(a=>a.level===l).length}</p>
            <p className="text-[10px] font-bold mt-0.5" style={{ color:cfg[l].color }}>{cfg[l].label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-2"><Pulse color="#ef4444" size={6}/>Sin resolver ({unacked.length})</h3>
          <div className="space-y-2">
            {unacked.map(a=>(
              <motion.div key={a.id} layout className="rounded-lg p-3 border" style={{ background:cfg[a.level].bg, borderColor:cfg[a.level].border }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-bold tracking-wider" style={{ color:cfg[a.level].color }}>{cfg[a.level].label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-gray-600">{a.time}</span>
                    <button onClick={()=>onAck(a.id)} className="text-[9px] px-2 py-0.5 rounded border hover:opacity-80 transition-opacity" style={{ borderColor:cfg[a.level].color, color:cfg[a.level].color }}>Resolver</button>
                  </div>
                </div>
                <p className="text-xs font-semibold text-white">{a.msg}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Fuente: {a.source}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold text-gray-600 mb-2">Resueltas ({acked.length})</h3>
          <div className="space-y-2 opacity-60">
            {acked.map(a=>(
              <div key={a.id} className="rounded-lg p-3 border border-white/5 flex items-start gap-2" style={{ background:'rgba(255,255,255,0.02)' }}>
                <Ico d={I.check} size={12} color="#22c55e" className="mt-0.5 flex-shrink-0"/>
                <div><p className="text-xs text-gray-400">{a.msg}</p><p className="text-[9px] text-gray-600">{a.source} · {a.time}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: ZONES
// ═══════════════════════════════════════════════════════════════════════════════
function ZonesModule() {
  const zones = [
    { name:'Entrada Principal', level:'Alto', cams:2, devs:3, access:'Todos los empleados', color:'#22c55e', incident:true },
    { name:'Data Center', level:'Máximo', cams:2, devs:2, access:'Solo IT + Dirección', color:'#ef4444', incident:false },
    { name:'Sala de Juntas', level:'Medio', cams:1, devs:2, access:'Empleados + Visitas con pase', color:'#f59e0b', incident:false },
    { name:'Bodega Norte', level:'Alto', cams:1, devs:2, access:'Operaciones + Seguridad', color:'#f59e0b', incident:false },
    { name:'Estacionamiento', level:'Medio', cams:2, devs:3, access:'Empleados autorizados', color:'#3b82f6', incident:true },
    { name:'Azotea / Drones', level:'Restringido', cams:1, devs:1, access:'Solo Mantenimiento', color:'#ef4444', incident:false },
    { name:'Oficinas Ejecutivas', level:'Alto', cams:1, devs:2, access:'Dirección + Asistentes', color:'#ef4444', incident:false },
    { name:'Zona Comercial / SDQ', level:'Bajo', cams:0, devs:1, access:'Público general', color:'#22c55e', incident:false },
  ]
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[{ l:'Zonas Definidas', v:zones.length, c:'#6366f1' },{ l:'Nivel Máximo/Restringido', v:2, c:'#ef4444' },{ l:'Con Incidente Activo', v:2, c:'#f59e0b' },{ l:'Dispositivos Totales', v:zones.reduce((s,z)=>s+z.devs,0), c:'#22c55e' }].map(s=>(
          <div key={s.l} className="rounded-xl p-3.5 border border-white/5" style={{ background:`${s.c}08` }}>
            <p className="text-2xl font-black text-white">{s.v}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {zones.map(z=>(
          <div key={z.name} className="rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors"
            style={{ background:z.incident?'rgba(245,158,11,0.04)':'rgba(255,255,255,0.02)', borderColor:z.incident?'rgba(245,158,11,0.2)':undefined }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background:z.color }}/>
                <span className="text-sm font-semibold text-white">{z.name}</span>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background:`${z.color}20`, color:z.color }}>Nivel {z.level}</span>
            </div>
            <p className="text-[10px] text-gray-500 mb-2">Acceso: {z.access}</p>
            <div className="flex items-center gap-4 text-[10px] text-gray-600">
              <span className="flex items-center gap-1"><Ico d={I.cam} size={10}/> {z.cams} cámaras</span>
              <span className="flex items-center gap-1"><Ico d={I.tag} size={10}/> {z.devs} dispositivos</span>
              {z.incident&&<span className="text-amber-400 font-semibold">⚠ Incidente</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: SOCIAL MEDIA
// ═══════════════════════════════════════════════════════════════════════════════
function SocialModule() {
  const [tab, setTab] = useState<'feed'|'schedule'|'analytics'>('feed')
  const nets = [
    { net:'Instagram', handle:'@renace.do', followers:18400, growth:11.2, color:'#E1306C', likes:2840, shares:420, reach:68000, time:'hace 2h', content:'🚀 Santo Domingo conecta — únete a la red empresarial más grande del Caribe. 250+ empresas activas. #RenaceRD #NetworkingDO' },
    { net:'TikTok', handle:'@renace.oficial', followers:34900, growth:52.3, color:'#FF0050', likes:18400, shares:5200, reach:124000, time:'hace 4h', content:'¿Tu empresa ya está en el mapa de oportunidades? 📊 Te mostramos cómo en 60 segundos... #EmpresasRD #SantoDomingo' },
    { net:'LinkedIn', handle:'Renace RD', followers:4200, growth:14.5, color:'#0A66C2', likes:340, shares:98, reach:12900, time:'hace 6h', content:'Anunciamos alianza estratégica con líderes del sector manufacturero dominicano. Más de 800 empresas en nuestra red B2B.' },
    { net:'Facebook', handle:'Renace Network RD', followers:11200, growth:3.1, color:'#1877F2', likes:980, shares:145, reach:22000, time:'hace 8h', content:'📣 Evento VXV Summit Santo Domingo — Registra tu empresa antes del viernes. 250+ tomadores de decisión.' },
    { net:'Twitter', handle:'@renace_do', followers:6200, growth:7.8, color:'#1DA1F2', likes:280, shares:134, reach:8900, time:'hace 10h', content:'HILO: Cómo el networking inteligente está transformando el mercado B2B en RD 🧵 #StartupDO #EmpresasRD' },
  ]
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {nets.map(n=>(
          <div key={n.net} className="rounded-xl p-3 border border-white/5 text-center" style={{ background:`${n.color}08` }}>
            <div className="text-xl font-black text-white">{(n.followers/1000).toFixed(1)}K</div>
            <div className="text-[10px] font-bold mt-0.5" style={{ color:n.color }}>{n.net}</div>
            <div className={`text-[9px] mt-1 ${n.growth>=0?'text-emerald-400':'text-red-400'}`}>↑ {n.growth}%</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {(['feed','schedule','analytics'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
            style={tab===t?{ background:'#ec489920', color:'#ec4899', border:'1px solid #ec489940' }:{ color:'#6b7280', border:'1px solid transparent' }}>
            {t==='feed'?'Feed en vivo':t==='schedule'?'Programados':'Analíticas'}
          </button>
        ))}
      </div>
      {tab==='feed'&&(
        <div className="grid grid-cols-2 gap-4">
          {nets.map(n=>(
            <div key={n.net} className="rounded-xl p-4 border border-white/5" style={{ background:`${n.color}06` }}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="rounded-full w-7 h-7 flex items-center justify-center text-[11px] font-black" style={{ background:`${n.color}25`, color:n.color }}>{n.net[0]}</div>
                <div><p className="text-xs font-bold text-white">{n.handle}</p><p className="text-[9px] text-gray-500">{n.net} · {n.time}</p></div>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed mb-3">{n.content}</p>
              <div className="flex gap-4 text-[10px] text-gray-500">
                <span>♥ {n.likes.toLocaleString()}</span>
                <span>⟳ {n.shares.toLocaleString()}</span>
                <span>👁 {n.reach.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==='schedule'&&(
        <div className="grid grid-cols-2 gap-4">
          {[
            { net:'Instagram', handle:'@renace.do', content:'📣 VXV Summit SDQ — Regístrate antes del viernes. ¡Cupos limitados!', time:'Hoy 18:00', color:'#E1306C' },
            { net:'TikTok', handle:'@renace.oficial', content:'🔥 El networking que cambia empresas — mira cómo lo hacemos en Santo Domingo.', time:'Mañana 10:00', color:'#FF0050' },
            { net:'LinkedIn', handle:'Renace RD', content:'📊 El estado del mercado B2B en RD 2026: tendencias, oportunidades y posicionamiento.', time:'Jue 09:00', color:'#0A66C2' },
            { net:'Facebook', handle:'Renace Network RD', content:'🎯 ¿Buscas proveedores certificados en RD? Descubre cómo nuestra plataforma conecta empresas.', time:'Vie 15:00', color:'#1877F2' },
          ].map(n=>(
            <div key={n.net} className="rounded-xl p-4 border border-white/5" style={{ background:`${n.color}06` }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full w-7 h-7 flex items-center justify-center text-[11px] font-black" style={{ background:`${n.color}25`, color:n.color }}>{n.net[0]}</div>
                <div><p className="text-xs font-bold text-white">{n.handle}</p><p className="text-[9px] text-gray-500">{n.net}</p></div>
                <span className="ml-auto text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded px-1.5 py-0.5">PROGRAMADO {n.time}</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>
      )}
      {tab==='analytics'&&(
        <div className="grid grid-cols-3 gap-4">
          {[
            { l:'Alcance Total', v:'234,500', chg:'+31%', c:'#3b82f6' },
            { l:'Engagement Rate', v:'5.2%', chg:'+1.4%', c:'#10b981' },
            { l:'Clics a Landing', v:'3,840', chg:'+22%', c:'#f59e0b' },
            { l:'Nuevos Seguidores', v:'+1,240', chg:'+41%', c:'#8b5cf6' },
            { l:'Impresiones', v:'512K', chg:'+55%', c:'#ec4899' },
            { l:'Mejor Plataforma', v:'TikTok', chg:'124K reach', c:'#FF0050' },
            { l:'Stories Vistas', v:'48K', chg:'+18%', c:'#E1306C' },
            { l:'Mensajes Directos', v:'284', chg:'+67%', c:'#0A66C2' },
            { l:'CPC Promedio', v:'$0.12', chg:'-8%', c:'#22c55e' },
          ].map(m=>(
            <div key={m.l} className="rounded-xl p-4 border border-white/5" style={{ background:`${m.c}08` }}>
              <p className="text-xs text-gray-500 mb-1">{m.l}</p>
              <p className="text-2xl font-black text-white">{m.v}</p>
              <p className="text-xs mt-1" style={{ color:m.c }}>{m.chg} vs sem. anterior</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: VIRAL
// ═══════════════════════════════════════════════════════════════════════════════
function ViralModule() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { tag:'#VXVSummitSDQ', plat:'Twitter / TikTok', score:96, trend:'trending', mentions:8820, c:'#f97316' },
          { tag:'#EmpresasRD', plat:'Instagram / LinkedIn', score:88, trend:'subiendo', mentions:15300, c:'#f97316' },
          { tag:'#NetworkingDO', plat:'TikTok', score:82, trend:'subiendo', mentions:34900, c:'#f97316' },
          { tag:'#RepúblicaDominicana', plat:'Todas', score:74, trend:'estable', mentions:89000, c:'#f97316' },
          { tag:'#SantoDomingoTech', plat:'LinkedIn', score:68, trend:'nuevo', mentions:2100, c:'#f97316' },
          { tag:'#CaribeBusiness', plat:'TikTok / Reels', score:61, trend:'nuevo', mentions:4500, c:'#f97316' },
        ].map(t=>(
          <div key={t.tag} className="rounded-xl p-4 border border-white/5" style={{ background:'rgba(255,255,255,0.02)' }}>
            <div className="flex items-start justify-between mb-2">
              <div><p className="text-sm font-bold text-orange-400">{t.tag}</p><p className="text-[10px] text-gray-500 mt-0.5">{t.plat}</p></div>
              <div className="text-right"><p className="text-2xl font-black text-white">{t.score}</p><p className="text-[9px] text-orange-400">Score viral</p></div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">{t.mentions.toLocaleString()} menciones</span>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${t.trend==='trending'?'bg-orange-500/20 text-orange-400':t.trend==='subiendo'?'bg-emerald-500/20 text-emerald-400':t.trend==='nuevo'?'bg-blue-500/20 text-blue-400':'bg-gray-500/20 text-gray-400'}`}>{t.trend}</span>
            </div>
            <Bar pct={t.score} color="#f97316" h={3}/>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/5 p-5" style={{ background:'rgba(255,255,255,0.02)' }}>
          <h3 className="text-sm font-bold text-white mb-4">Motor de Contenido IA · RD</h3>
          <div className="space-y-3">
            {[
              { type:'Video corto 30s', plat:'TikTok / Reels', prob:92 },
              { type:'Carrusel 5 slides', plat:'Instagram / LinkedIn', prob:79 },
              { type:'Hilo 8 tweets', plat:'Twitter / X', prob:73 },
              { type:'Artículo 800 palabras', plat:'LinkedIn', prob:68 },
              { type:'Reel detrás de cámaras', plat:'Instagram', prob:84 },
            ].map(c=>(
              <div key={c.type}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-300">{c.type}</span>
                  <span className="text-[10px] text-orange-400">{c.prob}% viral</span>
                </div>
                <Bar pct={c.prob} color="#f97316" h={4}/>
                <p className="text-[9px] text-gray-600 mt-0.5">{c.plat}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/5 p-5" style={{ background:'rgba(255,255,255,0.02)' }}>
          <h3 className="text-sm font-bold text-white mb-4">Targets Audiencia · RD</h3>
          <div className="space-y-3">
            {[
              { seg:'CEOs / Directivos RD', size:'14K', match:96, c:'#8b5cf6' },
              { seg:'Gerentes de Compras', size:'32K', match:89, c:'#3b82f6' },
              { seg:'Emprendedores 28-45', size:'95K', match:81, c:'#10b981' },
              { seg:'Sector Manufactura DO', size:'21K', match:84, c:'#f59e0b' },
              { seg:'Zona Franca Industrial', size:'18K', match:77, c:'#ec4899' },
              { seg:'Turismo & Hospitalidad', size:'56K', match:69, c:'#06b6d4' },
            ].map(s=>(
              <div key={s.seg} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:s.c }}/>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-300">{s.seg}</span>
                    <span className="text-[10px] font-semibold" style={{ color:s.c }}>{s.match}%</span>
                  </div>
                  <p className="text-[9px] text-gray-600">{s.size} personas</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: IFORGE
// ═══════════════════════════════════════════════════════════════════════════════
function IForgeModule() {
  const [prog, setProg] = useState(0)
  const [imp, setImp] = useState(false)
  const start = () => {
    setImp(true); setProg(0)
    const t = setInterval(()=>setProg(p=>{ if(p>=100){clearInterval(t);setImp(false);return 100} return p+Math.random()*7 }),150)
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[{ l:'Registros Totales', v:'1.42M', c:'#10b981' },{ l:'Fuentes Conectadas', v:'18', c:'#3b82f6' },{ l:'Última Importación', v:'420 reg.', c:'#8b5cf6' },{ l:'Calidad de Datos', v:'96%', c:'#f59e0b' }].map(s=>(
          <div key={s.l} className="rounded-xl p-4 border border-white/5" style={{ background:`${s.c}08` }}>
            <p className="text-2xl font-black text-white">{s.v}</p>
            <p className="text-xs text-gray-500 mt-1">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/5 p-5" style={{ background:'rgba(255,255,255,0.02)' }}>
          <h3 className="text-sm font-bold text-white mb-4">Fuentes de Datos · RD</h3>
          <div className="space-y-3">
            {[
              { name:'CRM Empresarial', records:847, status:'sync', c:'#10b981' },
              { name:'Scraping Web · Mercado RD', records:14200, status:'sync', c:'#10b981' },
              { name:'DGII · Registro Contribuyentes', records:98400, status:'sync', c:'#10b981' },
              { name:'CNSS · Empresas Activas', records:45200, status:'sync', c:'#10b981' },
              { name:'Cámara de Comercio SDQ', records:8900, status:'sync', c:'#10b981' },
              { name:'LinkedIn Empresas RD', records:5300, status:'pending', c:'#f59e0b' },
              { name:'Directorio Industrial ZF', records:2100, status:'sync', c:'#10b981' },
              { name:'Base Proveedores VXV', records:620, status:'importing', c:'#3b82f6' },
              { name:'Google Maps · Negocios SDQ', records:31000, status:'sync', c:'#10b981' },
              { name:'Facebook Business · RD', records:18700, status:'pending', c:'#f59e0b' },
            ].map(s=>(
              <div key={s.name} className="flex items-center gap-3">
                <Pulse color={s.c} size={6}/>
                <div className="flex-1"><p className="text-[11px] text-gray-300">{s.name}</p></div>
                <span className="text-[9px] text-gray-600">{s.records.toLocaleString()}</span>
                <span className="text-[9px] font-medium" style={{ color:s.c }}>{s.status==='sync'?'Sync':s.status==='pending'?'Pendiente':'Importando'}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-white/5 p-5" style={{ background:'rgba(255,255,255,0.02)' }}>
            <h3 className="text-sm font-bold text-white mb-4">Importar Nueva Base</h3>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-5 text-center mb-4 hover:border-emerald-700 transition-colors cursor-pointer">
              <Ico d={I.upload} size={26} className="mx-auto mb-2 text-gray-600"/>
              <p className="text-sm text-gray-500">Arrastra CSV, Excel, JSON o conecta API</p>
            </div>
            {imp&&<div className="mb-4"><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Importando...</span><span className="text-emerald-400">{Math.min(100,Math.floor(prog))}%</span></div><Bar pct={Math.min(100,prog)} color="#10b981" h={6}/></div>}
            <button onClick={start} disabled={imp} className="w-full py-2.5 rounded-lg text-sm font-bold transition-all" style={{ background:imp?'rgba(16,185,129,0.2)':'#10b981', color:imp?'#10b981':'#000' }}>
              {imp?'Importando...':'Iniciar Importación'}
            </button>
            <div className="mt-4 space-y-1.5">
              {['Deduplicación automática','Validación de emails RD','Enriquecimiento IA','Geolocalización SDQ','Score de calidad por registro'].map(f=>(
                <div key={f} className="flex items-center gap-2"><Ico d={I.check} size={11} color="#10b981"/><span className="text-[10px] text-gray-400">{f}</span></div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/5 p-4" style={{ background:'rgba(255,255,255,0.02)' }}>
            <h3 className="text-xs font-bold text-white mb-3">Cobertura por Sector · RD</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <Ring pct={94} color="#10b981" label="CRM" val="847"/>
              <Ring pct={82} color="#3b82f6" label="Scraping" val="14.2K"/>
              <Ring pct={96} color="#f59e0b" label="DGII" val="98.4K"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: BANCO CONTRAINTELIGENCIA
// ═══════════════════════════════════════════════════════════════════════════════
function BancoModule() {
  const expedientes = [
    { pri:'ALTO', subj:'Entidad Corp. · ████████ SRL', src:'OSINT + DGII', tags:['Fraude','Evasión','RNC Duplicado'], score:89, date:'22 Abr 2026 · 14:30', col:'#ef4444' },
    { pri:'ALTO', subj:'Persona de Interés · Ref-447', src:'Face AI + CNSS', tags:['Lista Negra','Acceso Restringido'], score:76, date:'22 Abr 2026 · 14:30', col:'#ef4444' },
    { pri:'MEDIO', subj:'Proveedor Riesgo · Licitación Norte', src:'Directorio + LinkedIn', tags:['Empresa Fantasma','Shell'], score:54, date:'21 Abr 2026 · 11:20', col:'#f59e0b' },
    { pri:'MEDIO', subj:'Competencia · Campaña Scraping', src:'Scraping Web', tags:['Precios','Estrategia'], score:41, date:'20 Abr 2026 · 09:00', col:'#f59e0b' },
    { pri:'BAJO', subj:'Monitoreo Rutinario · Sector Logística RD', src:'OSINT', tags:['Rutina','Competencia'], score:22, date:'19 Abr 2026 · 16:00', col:'#6b7280' },
  ]
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-purple-500/20 p-3.5" style={{ background:'rgba(168,85,247,0.05)' }}>
        <div className="flex items-center gap-2">
          <Ico d={I.shield} size={14} color="#a855f7"/>
          <span className="text-xs font-black text-purple-400 tracking-wider">BANCO DE CONTRAINTELIGENCIA · CLASIFICADO · ACCESO NIVEL 3</span>
        </div>
        <p className="text-[10px] text-gray-600 mt-1">Sistema de inteligencia empresarial · Santo Domingo, RD · Uso exclusivo autorizado</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[{ l:'Expedientes Activos', v:'412', c:'#a855f7' },{ l:'Fuentes OSINT', v:'34', c:'#6366f1' },{ l:'Alertas Inteligencia', v:'9', c:'#ef4444' },{ l:'Score Riesgo Promedio', v:'48/100', c:'#f59e0b' }].map(s=>(
          <div key={s.l} className="rounded-xl p-4 border border-white/5" style={{ background:`${s.c}08` }}>
            <p className="text-2xl font-black text-white">{s.v}</p>
            <p className="text-xs text-gray-500 mt-1">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/5 p-5" style={{ background:'rgba(255,255,255,0.02)' }}>
          <h3 className="text-sm font-bold text-white mb-4">Expedientes Recientes</h3>
          <div className="space-y-3">
            {expedientes.map((e,i)=>(
              <div key={i} className="rounded-lg p-3.5 border border-white/5 hover:border-purple-500/20 transition-colors" style={{ background:'rgba(255,255,255,0.02)' }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color:e.col, background:`${e.col}15` }}>{e.pri}</span>
                    <span className="text-xs font-semibold text-white">{e.subj}</span>
                  </div>
                  <span className="text-lg font-black flex-shrink-0" style={{ color:e.score>70?'#ef4444':e.score>40?'#f59e0b':'#10b981' }}>{e.score}</span>
                </div>
                <p className="text-[10px] text-gray-500 mb-2">Fuente: {e.src}</p>
                <div className="flex flex-wrap gap-1">
                  {e.tags.map(t=><span key={t} className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded px-1.5 py-0.5">{t}</span>)}
                </div>
                <p className="text-[9px] text-gray-600 mt-1.5">{e.date}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-white/5 p-5" style={{ background:'rgba(255,255,255,0.02)' }}>
            <h3 className="text-sm font-bold text-white mb-3">Módulo OSINT Activo · RD</h3>
            <div className="space-y-2">
              {[
                { src:'Twitter/X · Menciones RD', status:'activo', n:4820 },
                { src:'Facebook Público · SDQ', status:'activo', n:12300 },
                { src:'LinkedIn Empresas RD', status:'activo', n:5200 },
                { src:'DGII · RFC/RNC Público', status:'activo', n:98400 },
                { src:'CNSS · Nóminas Registradas', status:'activo', n:45200 },
                { src:'Noticias · Diario Libre / Listín', status:'indexando', n:8900 },
                { src:'Instagram · Hashtags RD', status:'activo', n:34900 },
                { src:'Google Maps · Negocios SDQ', status:'activo', n:31000 },
              ].map(s=>(
                <div key={s.src} className="flex items-center gap-2">
                  <Pulse color={s.status==='activo'?'#10b981':'#f59e0b'} size={5}/>
                  <span className="text-[10px] text-gray-400 flex-1">{s.src}</span>
                  <span className="text-[9px] text-gray-600">{s.n.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/5 p-4" style={{ background:'rgba(255,255,255,0.02)' }}>
            <h3 className="text-xs font-bold text-white mb-3">Distribución de Riesgos</h3>
            <div className="flex gap-3 justify-center">
              <Ring pct={19} color="#ef4444" label="Alto" val="78 exp."/>
              <Ring pct={43} color="#f59e0b" label="Medio" val="177 exp."/>
              <Ring pct={38} color="#10b981" label="Bajo" val="157 exp."/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function SentinelApp() {
  const [mod, setMod] = useState<Mod>('overview')
  const [tags, setTags] = useState<TagDevice[]>(TAGS)
  const [alerts, setAlerts] = useState<AlertItem[]>(INIT_ALERTS)

  useEffect(()=>{
    const t = setInterval(()=>{
      setTags(prev=>prev.map(tag=>tag.status==='lost'?tag:{
        ...tag,
        lat:Math.max(5,Math.min(93,tag.lat+(Math.random()-0.5)*2)),
        lng:Math.max(5,Math.min(93,tag.lng+(Math.random()-0.5)*2)),
        battery:Math.max(1,tag.battery-(Math.random()<0.04?1:0)),
      }))
    },3000)
    return ()=>clearInterval(t)
  },[])

  const ackAlert = useCallback((id:string)=>setAlerts(prev=>prev.map(a=>a.id===id?{...a,acked:true}:a)),[])

  const unacked = alerts.filter(a=>!a.acked).length
  const critical = alerts.filter(a=>a.level==='critical'&&!a.acked).length
  const headers: Record<Mod,{title:string;sub:string}> = {
    overview: { title:'Centro de Control', sub:'Vista consolidada del sistema · Santo Domingo, RD' },
    tracking: { title:'Rastreo de Dispositivos', sub:`AirTag / BLE en tiempo real · ${tags.filter(t=>t.status==='online').length} de ${tags.length} online` },
    faces:    { title:'Detección Facial con IA', sub:'8 cámaras · Reconocimiento automático de acceso' },
    alerts:   { title:'Alertas & Eventos', sub:`${unacked} alertas sin resolver · Centro de incidentes` },
    zones:    { title:'Zonas de Seguridad', sub:'Esquemas de control de acceso por área' },
    social:   { title:'Redes Sociales · SDQ', sub:'5 plataformas · 74.9K seguidores · Dominican Republic' },
    viral:    { title:'Motor de Contenido Viral', sub:'IA de targeting activa · Audiencias dominicanas' },
    iforge:   { title:'iForge · Bases de Datos', sub:'1.42M registros · DGII + CNSS + Scraping RD' },
    banco:    { title:'Banco Contrainteligencia', sub:'412 expedientes clasificados · Nivel 3 · SDQ' },
  }
  const h = headers[mod]

  return (
    <div className="flex h-screen overflow-hidden text-white" style={{ background:'#050709', fontFamily:"'Inter',system-ui,sans-serif" }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-58 flex-shrink-0 flex flex-col border-r border-white/5" style={{ background:'#07090f', width:224 }}>
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:'linear-gradient(135deg,#22c55e,#6366f1)' }}>
              <Ico d={I.logo} size={15} color="white"/>
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-white leading-none">SENTINEL</p>
              <p className="text-[9px] text-gray-600 tracking-widest mt-0.5">SUPER APP · SDQ</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {NAV.map(item=>{
            const active = mod===item.id
            const badge = item.id==='alerts'?unacked:item.id==='faces'?critical:0
            return (
              <motion.button key={item.id} onClick={()=>setMod(item.id)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left"
                style={active?{ background:`${item.color}15`, border:`1px solid ${item.color}30` }:{ border:'1px solid transparent' }}
                whileHover={!active?{ x:2, backgroundColor:'rgba(255,255,255,0.03)' }:{}}>
                <div className="p-1.5 rounded-md flex-shrink-0" style={{ background:active?`${item.color}25`:'rgba(255,255,255,0.06)' }}>
                  <Ico d={I[item.icon]} size={12} color={active?item.color:'#6b7280'}/>
                </div>
                <span className="text-[11px] font-medium flex-1 text-left" style={{ color:active?'white':'#9ca3af' }}>{item.label}</span>
                {badge>0&&<span className="text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0" style={{ background:item.id==='alerts'?'#ef4444':'#f59e0b', color:'white' }}>{badge}</span>}
              </motion.button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-600">Sistema</span>
            <div className="flex items-center gap-1.5"><Pulse size={5}/><span className="text-[10px] text-green-400 font-medium">Operacional</span></div>
          </div>
          <div className="rounded-lg p-2 text-center" style={{ background:'rgba(255,255,255,0.04)' }}>
            <Clock/><p className="text-[9px] text-gray-600 mt-0.5">22 ABR 2026 · SDQ</p>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[
              { v:tags.filter(t=>t.status==='online').length, l:'Online', c:'#22c55e' },
              { v:unacked, l:'Alertas', c:'#ef4444' },
              { v:'74.9K', l:'Follows', c:'#ec4899' },
            ].map(s=>(
              <div key={s.l} className="rounded-md p-1.5 text-center" style={{ background:`${s.c}15` }}>
                <p className="text-[11px] font-black" style={{ color:s.c }}>{s.v}</p>
                <p className="text-[8px] text-gray-600">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[{ v:'250', l:'Empresas', c:'#6366f1' },{ v:'800', l:'CRM', c:'#10b981' },{ v:'200', l:'Scraping', c:'#3b82f6' }].map(s=>(
              <div key={s.l} className="rounded-md p-1.5 text-center" style={{ background:`${s.c}15` }}>
                <p className="text-[11px] font-black" style={{ color:s.c }}>{s.v}</p>
                <p className="text-[8px] text-gray-600">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 flex-shrink-0 border-b border-white/5 flex items-center justify-between px-5" style={{ background:'#07090f' }}>
          <div>
            <span className="text-sm font-bold text-white">{h.title}</span>
            <span className="text-[10px] text-gray-600 ml-3">{h.sub}</span>
          </div>
          <div className="flex items-center gap-2">
            {critical>0&&(
              <motion.button onClick={()=>setMod('alerts')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-red-400 border border-red-500/30"
                style={{ background:'rgba(239,68,68,0.1)' }}
                animate={{ borderColor:['rgba(239,68,68,0.3)','rgba(239,68,68,0.8)','rgba(239,68,68,0.3)'] }}
                transition={{ duration:1.5, repeat:Infinity }}>
                <Pulse color="#ef4444" size={5}/>{critical} CRÍTICO{critical>1?'S':''}
              </motion.button>
            )}
            <button className="relative p-1.5 rounded-lg hover:bg-white/5 transition-colors" onClick={()=>setMod('alerts')}>
              <Ico d={I.bell} size={15} color="#6b7280"/>
              {unacked>0&&<span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500"/>}
            </button>
            <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"><Ico d={I.settings} size={15} color="#6b7280"/></button>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black" style={{ background:'linear-gradient(135deg,#22c55e,#6366f1)' }}>A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            <motion.div key={mod} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }} transition={{ duration:0.15 }}>
              {mod==='overview' &&<Overview tags={tags} alerts={alerts} onNav={setMod}/>}
              {mod==='tracking'&&<TrackingModule tags={tags}/>}
              {mod==='faces'   &&<FacesModule/>}
              {mod==='alerts'  &&<AlertsModule alerts={alerts} onAck={ackAlert}/>}
              {mod==='zones'   &&<ZonesModule/>}
              {mod==='social'  &&<SocialModule/>}
              {mod==='viral'   &&<ViralModule/>}
              {mod==='iforge'  &&<IForgeModule/>}
              {mod==='banco'   &&<BancoModule/>}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
