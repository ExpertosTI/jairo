"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Users, Search, CheckCircle2, AlertCircle, 
  RefreshCcw, UserPlus, ShieldCheck, ChevronRight,
  Database, WifiOff, Edit3, X
} from 'lucide-react'

// --- CONSTANTES ---
const API_BASE = '/api';
const EVENT_ID = 'evt_circulo_001';
const STORAGE_KEY = `jairo_attendance_${EVENT_ID}`;

// --- TIPOS ---
interface GuestNode {
  id: string;
  name: string;
  company: string;
  email: string;
  mesa: number | string;
  category: 'VIP' | 'Socio' | 'General';
}

// Manifiesto Táctico de 107 Invitados (Simulado para resiliencia absoluta)
const MASTER_GUEST_LIST: GuestNode[] = Array.from({ length: 107 }, (_, i) => {
  const id = `guest_${i + 1}`;
  const table = Math.floor(i / 8) + 1;
  return {
    id,
    name: i === 0 ? "Adavid FC" : i === 1 ? "Renso Cepeda" : `Invitado ${i + 1}`,
    company: i % 2 === 0 ? "RenaceTech" : "ExpertosTI",
    email: `user${i + 1}@${i % 2 === 0 ? 'renace.tech' : 'expertosti.com'}`,
    mesa: table,
    category: i < 20 ? 'VIP' : i < 60 ? 'Socio' : 'General'
  };
});

export default function RecepcionPortal() {
  // --- ESTADO ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<GuestNode | null>(null);
  const [isEditingMesa, setIsEditingMesa] = useState(false);
  const [tempMesa, setTempMesa] = useState('');
  
  // Persistencia Híbrida
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [syncStatus, setSyncStatus] = useState<'online' | 'local' | 'syncing'>('online');
  const [errorLog, setErrorLog] = useState<string | null>(null);

  // --- EFECTOS ---
  // Cargar backup local al iniciar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setAttendance(JSON.parse(saved));
        setSyncStatus('local');
      } catch (e) {
        console.error("Error cargando backup", e);
      }
    }
  }, []);

  // --- LÓGICA DE NEGOCIO ---
  const filteredGuests = useMemo(() => {
    return MASTER_GUEST_LIST.filter(g => 
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const stats = useMemo(() => {
    const checkedIn = Object.values(attendance).filter(v => v).length;
    return {
      total: MASTER_GUEST_LIST.length,
      checkedIn,
      pending: MASTER_GUEST_LIST.length - checkedIn
    };
  }, [attendance]);

  const handleCheckIn = async (guest: GuestNode) => {
    setSyncStatus('syncing');
    setErrorLog(null);

    const newAttendance = { ...attendance, [guest.id]: true };
    
    // 1. Guardar siempre en LocalStorage primero (Seguridad ante todo)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAttendance));
    setAttendance(newAttendance);

    // 2. Intentar Sincronizar con API
    try {
      const response = await fetch(`${API_BASE}/events/${EVENT_ID}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: guest.id,
          name: guest.name,
          email: guest.email,
          mesa: guest.mesa,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSyncStatus('online');
      } else {
        console.warn(`API Falló con status ${response.status}. Usando Backup Local.`);
        setSyncStatus('local');
        if (response.status === 404) setErrorLog("Endpoint API no encontrado. Datos guardados en la Tablet.");
      }
    } catch (err) {
      setSyncStatus('local');
      setErrorLog("Sin conexión. Los datos están seguros en esta tablet.");
    }

    setTimeout(() => setSelectedGuest(null), 1500);
  };

  const updateMesa = (newMesa: string) => {
    if (selectedGuest) {
      selectedGuest.mesa = newMesa;
      setIsEditingMesa(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col">
      
      {/* HEADER / HUD */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl p-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="text-black w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">JairoOS <span className="text-emerald-500 font-medium ml-1">Recepcion</span></h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-2 h-2 rounded-full animate-pulse ${syncStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                {syncStatus === 'online' ? 'Sincronizado' : syncStatus === 'syncing' ? 'Sincronizando...' : 'Modo Backup Local'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-1.5 hidden sm:flex items-center gap-6">
             <div className="text-center">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Total</p>
                <p className="text-sm font-mono text-white">{stats.total}</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] uppercase text-emerald-500 font-bold">Entraron</p>
                <p className="text-sm font-mono text-emerald-400">{stats.checkedIn}</p>
             </div>
          </div>
        </div>
      </nav>

      {/* SEARCH BAR */}
      <div className="p-4 bg-white/5 border-b border-white/5">
        <div className="relative max-w-4xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar por nombre o empresa..."
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* MAIN GRID */}
      <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-20">
          {filteredGuests.map(guest => (
            <button
              key={guest.id}
              onClick={() => setSelectedGuest(guest)}
              className={`relative group p-4 rounded-2xl border transition-all text-left flex flex-col gap-1 overflow-hidden
                ${attendance[guest.id] 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-white/5 border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.07]'
                }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider
                  ${guest.category === 'VIP' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-500/20 text-slate-400'}`}>
                  {guest.category}
                </span>
                <span className="text-xs font-mono text-slate-500">Mesa {guest.mesa}</span>
              </div>
              
              <h3 className="text-base font-bold text-white truncate mt-2">{guest.name}</h3>
              <p className="text-xs text-slate-500 truncate">{guest.company}</p>

              {attendance[guest.id] && (
                <div className="absolute bottom-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      </main>

      {/* MODAL DE ACCESO */}
      {selectedGuest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedGuest(null)} />
          
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-8 space-y-6">
              {/* Header Modal */}
              <div className="flex justify-between items-start">
                <div className="bg-emerald-500/10 p-4 rounded-3xl">
                  <UserPlus className="w-8 h-8 text-emerald-500" />
                </div>
                <button onClick={() => setSelectedGuest(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              {/* Info Invitado */}
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white leading-tight">Confirmar Acceso</h2>
                <div className="flex flex-col gap-1">
                  <p className="text-xl text-emerald-400 font-medium">{selectedGuest.name}</p>
                  <p className="text-slate-400">{selectedGuest.company} • {selectedGuest.email}</p>
                </div>
              </div>

              {/* Tactical Table Editor */}
              <div className="bg-black/30 border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Mesa Asignada</p>
                  {isEditingMesa ? (
                    <div className="flex gap-2">
                      <input 
                        autoFocus
                        type="number"
                        className="bg-slate-800 border border-emerald-500/50 rounded-lg w-20 px-3 py-1 text-white focus:outline-none"
                        value={tempMesa}
                        onChange={(e) => setTempMesa(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && updateMesa(tempMesa)}
                      />
                      <button onClick={() => updateMesa(tempMesa)} className="bg-emerald-500 text-black px-3 rounded-lg font-bold text-sm">OK</button>
                    </div>
                  ) : (
                    <p className="text-4xl font-mono text-white font-black">{selectedGuest.mesa}</p>
                  )}
                </div>
                
                {!isEditingMesa && (
                  <button 
                    onClick={() => { setIsEditingMesa(true); setTempMesa(String(selectedGuest.mesa)); }}
                    className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm font-bold">Cambiar Mesa</span>
                  </button>
                )}
              </div>

              {/* Status / Error HUD */}
              {errorLog && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <p className="text-[11px] text-amber-200 leading-tight font-medium">{errorLog}</p>
                </div>
              )}

              {/* Botón Principal */}
              <button
                disabled={attendance[selectedGuest.id] || syncStatus === 'syncing'}
                onClick={() => handleCheckIn(selectedGuest)}
                className={`w-full py-5 rounded-3xl text-xl font-black transition-all flex items-center justify-center gap-3
                  ${attendance[selectedGuest.id] 
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-default' 
                    : 'bg-emerald-500 text-black hover:scale-[1.02] active:scale-95 shadow-xl shadow-emerald-500/20'
                  }`}
              >
                {syncStatus === 'syncing' ? (
                  <RefreshCcw className="animate-spin w-6 h-6" />
                ) : attendance[selectedGuest.id] ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    ACCESO CONCEDIDO
                  </>
                ) : (
                  'CONFIRMAR ENTRADA'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER STATUS */}
      <footer className="p-2 px-4 bg-black border-t border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3 text-slate-500" />
            <span className="text-[9px] text-slate-500 font-mono tracking-tighter">NODE_ID: {EVENT_ID}</span>
          </div>
          {syncStatus === 'local' && (
            <div className="flex items-center gap-1.5">
              <WifiOff className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] text-amber-500 font-bold uppercase tracking-tighter">Backup Local Activo</span>
            </div>
          )}
        </div>
        <p className="text-[9px] text-slate-700 font-medium">JairoOS Infrastructure © 2026</p>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
