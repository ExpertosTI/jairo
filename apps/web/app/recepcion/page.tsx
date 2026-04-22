"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Users, Search, CheckCircle2, AlertCircle, 
  RefreshCcw, UserPlus, ShieldCheck, Activity,
  Database, Wifi, WifiOff, Edit3, X, Zap, 
  ChevronRight, Fingerprint, Lock, Radio
} from 'lucide-react'

// --- CONFIGURACIÓN TÉCNICA ---
const API_BASE = '/api';
const EVENT_ID = 'evt_circulo_2026';
const STORAGE_KEY = `jairo_vault_${EVENT_ID}`;

// --- MANIFIESTO DE DATOS ---
interface GuestNode {
  id: string;
  name: string;
  company: string;
  email: string;
  mesa: number | string;
  category: 'VIP' | 'Socio' | 'General';
}

const MASTER_GUEST_LIST: GuestNode[] = Array.from({ length: 107 }, (_, i) => {
  const id = `NODE_${(i + 1).toString().padStart(3, '0')}`;
  return {
    id,
    name: i === 0 ? "ADAVID FC" : i === 1 ? "RENSO CEPEDA" : `GUEST_ID_${i + 1}`,
    company: i % 2 === 0 ? "RENACE_TECH" : "EXPERTOSTI_GLOBAL",
    email: `ops_${i + 1}@domain.com`,
    mesa: Math.floor(i / 8) + 1,
    category: i < 20 ? 'VIP' : i < 60 ? 'Socio' : 'General'
  };
});

export default function RecepcionPortalPremium() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<GuestNode | null>(null);
  const [isEditingMesa, setIsEditingMesa] = useState(false);
  const [tempMesa, setTempMesa] = useState('');
  
  // Persistencia Híbrida (Resiliencia Silenciosa)
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setAttendance(JSON.parse(saved));
    setLastSync(new Date().toLocaleTimeString());
  }, []);

  const stats = useMemo(() => {
    const active = Object.values(attendance).filter(v => v).length;
    return { total: 107, active, percent: Math.round((active / 107) * 100) };
  }, [attendance]);

  const filteredGuests = useMemo(() => 
    MASTER_GUEST_LIST.filter(g => 
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.company.toLowerCase().includes(searchTerm.toLowerCase())
    )
  , [searchTerm]);

  const handleCheckIn = async (guest: GuestNode) => {
    setIsSyncing(true);
    const updated = { ...attendance, [guest.id]: true };
    
    // Guardado Inmediato (Local)
    setAttendance(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Intento de Sincronización (Background)
    try {
      await fetch(`${API_BASE}/events/${EVENT_ID}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...guest, timestamp: new Date().toISOString() })
      });
      setLastSync(new Date().toLocaleTimeString());
    } catch (e) {
      console.warn("SYNC_DELAY: Guardado en Bóveda Local");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSelectedGuest(null), 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#020406] text-slate-300 font-sans selection:bg-emerald-500/30 flex flex-col overflow-hidden">
      
      {/* HUD DE TELEMETRÍA (HEADER) */}
      <nav className="h-24 border-b border-white/5 bg-black/80 backdrop-blur-2xl flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Fingerprint className="text-black w-8 h-8" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
              JAIRO_OS <span className="text-emerald-500 px-2 py-0.5 bg-emerald-500/10 rounded text-sm tracking-widest border border-emerald-500/20">RECEPTION_v4</span>
            </h1>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1.5"><Radio className="w-3 h-3 text-emerald-500 animate-pulse" /> Uplink_Active</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full" />
              <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Secure_Protocol_v26</span>
            </div>
          </div>
        </div>

        {/* STATUS TILES */}
        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-2 flex items-center gap-8">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Nodes_Active</p>
              <p className="text-xl font-mono text-white leading-none">{stats.active}<span className="text-slate-600 text-sm">/{stats.total}</span></p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="space-y-1">
              <p className="text-[10px] text-emerald-500 font-black tracking-widest uppercase">Capacity</p>
              <p className="text-xl font-mono text-emerald-400 leading-none">{stats.percent}%</p>
            </div>
          </div>
        </div>
      </nav>

      {/* SEARCH ENGINE (GLASS) */}
      <div className="px-8 py-6 bg-gradient-to-b from-black to-transparent">
        <div className="relative max-w-5xl mx-auto group">
          <div className="absolute inset-0 bg-emerald-500/5 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/50 w-6 h-6 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text"
            placeholder="SISTEMA DE IDENTIFICACIÓN: BUSCAR NODO..."
            className="w-full bg-[#0d1117]/80 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-xl font-medium focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-700 uppercase tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TACTICAL GRID */}
      <main className="flex-1 overflow-y-auto px-8 pb-12 custom-scrollbar">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredGuests.map(guest => (
            <div
              key={guest.id}
              onClick={() => setSelectedGuest(guest)}
              className={`relative group h-40 rounded-[2rem] border p-6 transition-all cursor-pointer overflow-hidden
                ${attendance[guest.id] 
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' 
                  : 'bg-white/[0.02] border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.05] shadow-xl'
                }`}
            >
              {attendance[guest.id] && (
                <div className="absolute top-0 right-0 p-3">
                  <div className="bg-emerald-500/20 text-emerald-500 p-1.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              )}

              <div className="flex flex-col h-full justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 tracking-[0.2em]">{guest.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white truncate group-hover:text-emerald-400 transition-colors uppercase">
                    {guest.name}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest truncate">
                    {guest.company}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs font-mono font-black text-white uppercase">MESA_{guest.mesa}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-[10px] font-black tracking-tighter uppercase">{guest.category}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/20 transition-all" />
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DE ACCESO TÁCTICO */}
      {selectedGuest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setSelectedGuest(null)} />
          
          <div className="relative w-full max-w-2xl h-full bg-[#05070a] border-l border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col animate-in slide-in-from-right duration-500">
            
            <div className="p-12 space-y-12 flex-1 flex flex-col justify-center">
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-500/50" />
                  <span className="text-[12px] font-black tracking-[0.5em] text-emerald-500 uppercase">Verifying_Node</span>
                  <div className="h-px w-12 bg-emerald-500/50" />
                </div>
                
                <h2 className="text-[8vw] font-black leading-[0.8] text-white tracking-tighter uppercase break-words">
                  {selectedGuest.name}
                </h2>
                <div className="flex items-center gap-4 py-2">
                  <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10">
                    <span className="text-xl font-mono font-bold text-white tracking-widest uppercase">{selectedGuest.company}</span>
                  </div>
                  <span className="text-slate-500 text-lg font-medium">{selectedGuest.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:bg-white/[0.05] transition-all group">
                  <p className="text-xs font-black text-slate-500 tracking-[0.3em] uppercase">Sector_Asignado</p>
                  <div className="flex items-end justify-between">
                    {isEditingMesa ? (
                      <div className="flex items-center gap-4">
                        <input 
                          autoFocus
                          type="number"
                          className="bg-emerald-500/10 border-2 border-emerald-500 rounded-2xl w-32 py-4 text-center text-5xl font-black text-white outline-none shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                          value={tempMesa}
                          onChange={(e) => setTempMesa(e.target.value)}
                        />
                        <button 
                          onClick={() => { selectedGuest.mesa = tempMesa; setIsEditingMesa(false); }}
                          className="w-16 h-16 bg-emerald-500 text-black rounded-2xl flex items-center justify-center font-black"
                        >OK</button>
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer group-hover:scale-110 transition-transform"
                        onClick={() => { setIsEditingMesa(true); setTempMesa(String(selectedGuest.mesa)); }}
                      >
                        <p className="text-8xl font-black text-white leading-none tracking-tighter">
                          {selectedGuest.mesa.toString().padStart(2, '0')}
                        </p>
                      </div>
                    )}
                    {!isEditingMesa && <Edit3 className="text-emerald-500/50 group-hover:text-emerald-500 w-8 h-8" />}
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-4">
                  <p className="text-xs font-black text-slate-500 tracking-[0.3em] uppercase">Node_Status</p>
                  <div className="flex flex-col h-full justify-center">
                    <div className="flex items-center gap-3">
                      <Zap className={`w-8 h-8 ${attendance[selectedGuest.id] ? 'text-emerald-500' : 'text-slate-700'}`} />
                      <span className={`text-2xl font-black ${attendance[selectedGuest.id] ? 'text-white' : 'text-slate-800'}`}>
                        {attendance[selectedGuest.id] ? 'ACTIVE' : 'STANDBY'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                disabled={attendance[selectedGuest.id] || isSyncing}
                onClick={() => handleCheckIn(selectedGuest)}
                className={`group relative w-full py-10 rounded-[3rem] text-4xl font-black transition-all overflow-hidden
                  ${attendance[selectedGuest.id] 
                    ? 'bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/30' 
                    : 'bg-emerald-500 text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_50px_rgba(16,185,129,0.3)]'
                  }`}
              >
                {isSyncing ? (
                  <RefreshCcw className="animate-spin w-12 h-12 mx-auto" />
                ) : attendance[selectedGuest.id] ? (
                  <div className="flex items-center justify-center gap-4 uppercase">
                    <ShieldCheck className="w-12 h-12" />
                    ACCESS_GRANTED
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4 tracking-tighter uppercase">
                    INICIAR_ACCESO
                    <ChevronRight className="w-12 h-12 group-hover:translate-x-4 transition-transform" />
                  </div>
                )}
                {!attendance[selectedGuest.id] && (
                  <div className="absolute inset-0 w-2 bg-white/20 blur-xl skew-x-12 -translate-x-full group-hover:animate-scan" />
                )}
              </button>
            </div>

            <div className="p-8 border-t border-white/5 bg-black/40 flex justify-between items-center text-[10px] font-black text-slate-600 tracking-widest uppercase">
              <div className="flex items-center gap-4">
                <span>SECURITY_CLEARANCE: LEVEL_05</span>
                <span className="w-1 h-1 bg-slate-800 rounded-full" />
                <span>UPLINK: SECURE</span>
              </div>
              <button onClick={() => setSelectedGuest(null)} className="flex items-center gap-2 hover:text-white transition-colors">
                <X className="w-4 h-4" /> ABORT_ACCESS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL TELEMETRY FOOTER */}
      <footer className="h-10 bg-black border-t border-white/5 px-8 flex items-center justify-between text-[10px] font-mono text-slate-700">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3" />
            <span>VAULT_ID: {STORAGE_KEY}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            <span>LAST_SYNC: {lastSync || 'STANDALONE'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 uppercase font-black tracking-tighter">
          <span>System_Engine</span>
          <div className="w-20 h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-2/3 animate-pulse" />
          </div>
          <span>Jairo_OS</span>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes scan {
          from { transform: translateX(-100%) skewX(-20deg); }
          to { transform: translateX(500%) skewX(-20deg); }
        }
        .animate-scan {
          animation: scan 3s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #111;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #10b981;
        }
      `}</style>
    </div>
  );
}
