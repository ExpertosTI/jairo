"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
    LayoutDashboard, Users, Clock, ShieldCheck, 
    Fingerprint, LayoutGrid, List, ChevronRight, 
    Search, Activity, Target, Zap, CheckCircle2,
    X, Phone, Mail, MapPin, Sparkles, Loader2,
    Lock, Star, Briefcase, ShieldAlert, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Tipos de Datos ---
interface Invitado {
    id: string;
    nombre: string;
    empresa: string;
    mesa: string;
    status: 'pending' | 'cleared';
    isVIP?: boolean;
    nivel?: 'VIP' | 'Directivo' | 'Invitado';
}

// --- DATA INICIAL (FALLBACK) ---
const GUESTS_FROM_NOTEBOOK: Invitado[] = [
    { id: "1", nombre: "Angel Flores", empresa: "Invitado", mesa: "1", status: 'pending' },
    { id: "2", nombre: "Eduardo Lama", empresa: "Invitado", mesa: "2", status: 'pending' },
    { id: "3", nombre: "Ivan Diaz", empresa: "Invitado", mesa: "3", status: 'pending' },
    { id: "4", nombre: "Manuel Gutierrez", empresa: "Invitado", mesa: "4", status: 'pending' },
    { id: "5", nombre: "Anaisa Perez", empresa: "Invitado", mesa: "5", status: 'pending' },
    { id: "6", nombre: "Nelvis Taveras", empresa: "Invitado", mesa: "6", status: 'pending' },
    { id: "7", nombre: "Marigruz", empresa: "Invitado", mesa: "7", status: 'pending' },
    { id: "8", nombre: "Josefina", empresa: "Invitado", mesa: "8", status: 'pending' },
    { id: "9", nombre: "Burak Gulbahar", empresa: "Invitado", mesa: "9", status: 'pending' },
    { id: "10", nombre: "Gilbert Ramirez", empresa: "Invitado", mesa: "10", status: 'pending' },
    { id: "11", nombre: "Carlos Antonio", empresa: "Invitado", mesa: "11", status: 'pending' },
    { id: "12", nombre: "Ariel Lima", empresa: "Invitado", mesa: "12", status: 'pending' },
    { id: "13", nombre: "Juan Acosta", empresa: "Invitado", mesa: "13", status: 'pending' },
    { id: "14", nombre: "Engerberto Reynoso (Kike)", empresa: "Invitado", mesa: "14", status: 'pending' },
    { id: "15", nombre: "Daylen Ventura", empresa: "Invitado", mesa: "15", status: 'pending' },
    { id: "16", nombre: "Rafael Olacio (Renso)", empresa: "Invitado", mesa: "16", status: 'pending' },
    { id: "17", nombre: "Yoco Olbite (Yaco)", empresa: "Invitado", mesa: "17", status: 'pending' },
    { id: "18", nombre: "Maximo Alcantara", empresa: "Invitado", mesa: "18", status: 'pending' },
    { id: "19", nombre: "Robinson Rodriguez", empresa: "Invitado", mesa: "19", status: 'pending' },
    { id: "20", nombre: "Ruben Perez", empresa: "Invitado", mesa: "20", status: 'pending' },
    { id: "21", nombre: "Jessica Duran", empresa: "Invitado", mesa: "21", status: 'pending' },
    { id: "22", nombre: "Cuba Denanis Chiong", empresa: "Invitado", mesa: "22", status: 'pending' },
    { id: "23", nombre: "Junior Baldera", empresa: "Invitado", mesa: "23", status: 'pending' },
    { id: "24", nombre: "Wellentong Baldera", empresa: "Invitado", mesa: "24", status: 'pending' },
    { id: "25", nombre: "Jose Baldera", empresa: "Invitado", mesa: "25", status: 'pending' },
    { id: "26", nombre: "Giancarlos Reynoso", empresa: "Invitado", mesa: "26", status: 'pending' },
    { id: "27", nombre: "Antonio Castillo (Maguiver)", empresa: "Invitado", mesa: "27", status: 'pending' },
    { id: "28", nombre: "Ramon Campusano (Chuky)", empresa: "Invitado", mesa: "28", status: 'pending' },
    { id: "29", nombre: "Felix del Rosario (Chuky)", empresa: "Invitado", mesa: "29", status: 'pending' },
    { id: "30", nombre: "Luis Pablo", empresa: "Invitado", mesa: "30", status: 'pending' },
    { id: "31", nombre: "Ramon Pascual (Mello)", empresa: "Invitado", mesa: "31", status: 'pending' },
    { id: "32", nombre: "Mirtha E. Perez (Popy)", empresa: "Invitado", mesa: "32", status: 'pending' },
    { id: "33", nombre: "Junior Santos", empresa: "Invitado", mesa: "33", status: 'pending' },
    { id: "34", nombre: "Juan de los Santos (Niño)", empresa: "Invitado", mesa: "34", status: 'pending' },
    { id: "35", nombre: "Ruben Mocana", empresa: "Invitado", mesa: "35", status: 'pending' },
    { id: "36", nombre: "Edward Lorenzo", empresa: "Invitado", mesa: "36", status: 'pending' },
    { id: "37", nombre: "Daniel Lorenzo", empresa: "Invitado", mesa: "37", status: 'pending' },
    { id: "38", nombre: "Maria Vazquez", empresa: "Invitado", mesa: "38", status: 'pending' },
    { id: "39", nombre: "Francisco Confesor", empresa: "Invitado", mesa: "39", status: 'pending' },
    { id: "40", nombre: "Eliandy Confesor", empresa: "Invitado", mesa: "40", status: 'pending' },
    { id: "41", nombre: "Mariely Andreina de la Cruz", empresa: "Invitado", mesa: "41", status: 'pending', isVIP: true, nivel: 'VIP' },
    { id: "42", nombre: "Miguel Herasme", empresa: "Invitado", mesa: "42", status: 'pending' },
    { id: "43", nombre: "Sergio Calafat", empresa: "Invitado", mesa: "43", status: 'pending' },
    { id: "44", nombre: "Bladimir Nuñez", empresa: "Invitado", mesa: "44", status: 'pending' },
    { id: "45", nombre: "Alvaro Solano", empresa: "Invitado", mesa: "45", status: 'pending' },
    { id: "46", nombre: "Claudia Flores", empresa: "Invitado", mesa: "46", status: 'pending' },
    { id: "47", nombre: "Mark", empresa: "Invitado", mesa: "47", status: 'pending' },
    { id: "48", nombre: "Abiatar Contreras", empresa: "Invitado", mesa: "48", status: 'pending' },
    { id: "73", nombre: "J. Hanna Cordero", empresa: "Invitado", mesa: "73", status: 'pending', isVIP: true, nivel: 'VIP' },
    { id: "83", nombre: "Winston Santos", empresa: "Invitado", mesa: "83", status: 'pending', nivel: 'Directivo' },
];

export default function RecepcionCommandCenter() {
    const [view, setView] = useState<'tables' | 'directory'>('directory');
    const [filter, setFilter] = useState<'all' | 'pending' | 'cleared' | 'vip'>('all');
    const [searchTerm, setSearchTerm] = useState("");
    const [invitados, setInvitados] = useState<Invitado[]>(GUESTS_FROM_NOTEBOOK);
    const [selectedGuest, setSelectedGuest] = useState<Invitado | null>(null);
    const [aiProcessing, setAiProcessing] = useState(false);
    const [aiComplete, setAiComplete] = useState(false);
    const [cargandoDB, setCargandoDB] = useState(true);
    const [draggingGuest, setDraggingGuest] = useState<Invitado | null>(null);

    const API_BASE = 'https://jairoapp.renace.tech/api';
    const EVENT_ID = 'evt_circulo_001';

    // --- Cargar estado real ---
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await fetch(`${API_BASE}/events/${EVENT_ID}/attendance`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setInvitados(prev => prev.map(inv => {
                        const isCleared = data.find((a: any) => String(a.guestId) === String(inv.id));
                        return isCleared ? { ...inv, status: 'cleared' } : inv;
                    }));
                }
            } catch (error) { console.error('Error:', error); }
            finally { setCargandoDB(false); }
        };
        fetchAttendance();
    }, []);

    // --- Check-in Real ---
    const handleGrantAccess = async () => {
        if (!selectedGuest) return;
        setAiProcessing(true);
        try {
            // CORRECCIÓN: Endpoint estandarizado con EVENT_ID en la URL
            const res = await fetch(`${API_BASE}/events/${EVENT_ID}/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestId: selectedGuest.id,
                    companyName: selectedGuest.empresa,
                    guestName: selectedGuest.nombre
                })
            });

            if (res.ok) {
                setTimeout(() => {
                    setAiComplete(true);
                    setInvitados(prev => prev.map(inv => inv.id === selectedGuest.id ? { ...inv, status: 'cleared' } : inv));
                    setTimeout(() => {
                        setAiProcessing(false);
                        setAiComplete(false);
                        setSelectedGuest(null);
                    }, 3500);
                }, 2000);
            }
        } catch (error) {
            console.error('Error:', error);
            setAiProcessing(false);
        }
    };

    const handleMoveGuest = (guestId: string, targetMesa: string) => {
        setInvitados(prev => prev.map(inv => inv.id === guestId ? { ...inv, mesa: targetMesa } : inv));
        // Opcional: Sincronizar con DB aquí si se desea persistencia inmediata del movimiento
        console.log(`Invitado ${guestId} movido a mesa ${targetMesa}`);
    };

    // --- Buscador Unificado ---
    const filteredInvitados = invitados.filter(inv => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = inv.nombre.toLowerCase().includes(query) || 
                             inv.empresa.toLowerCase().includes(query) ||
                             inv.mesa.includes(query);
        
        if (filter === 'pending') return matchesSearch && inv.status === 'pending';
        if (filter === 'cleared') return matchesSearch && inv.status === 'cleared';
        if (filter === 'vip') return matchesSearch && inv.isVIP;
        return matchesSearch;
    });

    const mesasIds = Array.from(new Set(invitados.map(i => i.mesa))).sort((a,b) => parseInt(a) - parseInt(b));

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-500/30 flex flex-col relative overflow-hidden">
            
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98105,transparent_50%)]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
            </div>

            <nav className="h-24 border-b border-slate-200 bg-white/70 backdrop-blur-2xl flex items-center justify-between px-12 z-50 sticky top-0 shadow-sm">
                <div className="flex items-center gap-16">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Fingerprint className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black uppercase text-slate-900 leading-none">JairoAcceso</span>
                            <span className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase mt-1.5">Executive Synergy Portal</span>
                        </div>
                    </div>

                    <div className="relative w-[500px] group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500" />
                        <input 
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            type="text" placeholder="Buscar por nombre, empresa o mesa..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] py-4 pl-16 pr-8 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all font-semibold shadow-inner"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 border border-slate-200 rounded-2xl">
                        <button onClick={() => setView('directory')} className={`px-8 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all ${view === 'directory' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-400'}`}>DIRECTORIO</button>
                        <button onClick={() => setView('tables')} className={`px-8 py-3 rounded-xl text-[11px] font-black transition-all ${view === 'tables' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-400'}`}>MESAS</button>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden z-10">
                <aside className="w-[380px] border-r border-slate-200 p-10 flex flex-col gap-10 bg-white/40 backdrop-blur-md">
                    <div className="space-y-8">
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">Live Event Telemetry</p>
                        <div className="grid gap-6">
                            <div className="p-8 rounded-[3.5rem] bg-white border border-slate-100 shadow-sm">
                                <Users className="w-6 h-6 text-blue-500 mb-6" />
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Manifest</p>
                                <p className="text-6xl font-black mt-3 text-slate-800 tracking-tighter">{invitados.length}</p>
                            </div>
                            <div className="p-8 rounded-[3.5rem] bg-white border border-slate-100 shadow-sm">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-6" />
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Access Granted</p>
                                <p className="text-6xl font-black mt-3 text-emerald-600 tracking-tighter">{invitados.filter(i => i.status === 'cleared').length}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col bg-transparent overflow-hidden">
                    <div className="px-12 py-8 border-b border-slate-200 bg-white/30">
                        <div className="flex gap-3 p-1.5 bg-slate-100/50 border border-slate-200 rounded-2xl w-fit">
                            {['all', 'pending', 'cleared', 'vip'].map((f) => (
                                <button key={f} onClick={() => setFilter(f as any)} className={`px-8 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all uppercase ${filter === f ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}>
                                    {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : f === 'cleared' ? 'Cleared' : 'VIP'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                        {view === 'directory' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                <AnimatePresence>
                                    {filteredInvitados.map((inv) => (
                                        <motion.div 
                                            key={inv.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedGuest(inv)}
                                            className={`group p-10 rounded-[3.5rem] border transition-all cursor-pointer bg-white shadow-sm hover:shadow-xl ${inv.status === 'cleared' ? 'border-emerald-500/30 ring-4 ring-emerald-500/5' : 'border-slate-100'}`}
                                        >
                                            <div className="flex justify-between mb-8"><span className="px-3 py-1 bg-slate-50 border rounded-full text-[9px] font-black text-slate-400 uppercase">Mesa {inv.mesa}</span>{inv.isVIP && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}</div>
                                            <h3 className="text-2xl font-black text-slate-800 uppercase leading-none">{inv.nombre}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">{inv.empresa}</p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 items-start">
                                {mesasIds.map((mesaId) => {
                                    const mesaInvitados = filteredInvitados.filter(i => i.mesa === mesaId);
                                    if (searchTerm && mesaInvitados.length === 0) return null; // Ocultar mesas vacías en búsqueda
                                    return (
                                        <div key={mesaId} className="bg-white border border-slate-200 rounded-[4rem] p-10 shadow-sm relative group">
                                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Mesa {mesaId}</h3>
                                            <div className="space-y-4">
                                                {mesaInvitados.map(inv => (
                                                    <div key={inv.id} onClick={() => setSelectedGuest(inv)} className={`p-6 rounded-[2.5rem] bg-slate-50 border transition-all cursor-pointer flex justify-between items-center ${inv.status === 'cleared' ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100'}`}>
                                                        <div className="text-sm font-black uppercase text-slate-700">{inv.nombre}</div>
                                                        {inv.isVIP && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <AnimatePresence>
                {selectedGuest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-10 backdrop-blur-2xl bg-white/60">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[1100px] bg-white rounded-[5rem] border border-slate-200 overflow-hidden shadow-2xl flex relative">
                            <div className="w-[45%] bg-slate-50 p-20 border-r flex flex-col justify-center">
                                <div className="px-6 py-2 bg-emerald-600 rounded-full inline-flex items-center gap-3 mb-10 text-white font-black text-[10px] uppercase tracking-widest"><ShieldCheck className="w-4 h-4" /> VERIFICACIÓN</div>
                                <h2 className="text-7xl font-black uppercase text-slate-900 leading-none mb-6">{selectedGuest.nombre}</h2>
                                <p className="text-3xl font-bold text-slate-300 uppercase tracking-widest mb-12">{selectedGuest.empresa}</p>
                                <div className="p-8 bg-white rounded-[3rem] border shadow-sm">
                                    <p className="text-[10px] font-black text-slate-300 uppercase mb-2">UBICACIÓN</p>
                                    <p className="text-3xl font-black text-slate-800">MESA {selectedGuest.mesa}</p>
                                </div>
                            </div>
                            <div className="flex-1 p-24 flex flex-col relative bg-white">
                                <button onClick={() => setSelectedGuest(null)} className="absolute top-10 right-10 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center"><X /></button>
                                <div className="flex-1 space-y-10 flex flex-col justify-center">
                                    <input type="text" placeholder="TELÉFONO MÓVIL" className="w-full bg-slate-50 h-24 rounded-[3rem] px-12 font-black text-3xl focus:outline-none border" />
                                    <input type="email" placeholder="EMAIL CORPORATIVO" className="w-full bg-slate-50 h-24 rounded-[3rem] px-12 font-black text-3xl focus:outline-none border" />
                                </div>
                                <div className="mt-auto flex justify-between items-center">
                                    <button onClick={() => setSelectedGuest(null)} className="text-[11px] font-black text-slate-300 uppercase">CANCELAR</button>
                                    <button onClick={handleGrantAccess} className="px-20 py-8 bg-slate-900 rounded-[3rem] text-white font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">CONCEDER ACCESO</button>
                                </div>
                                <AnimatePresence>
                                    {aiProcessing && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 bg-white/98 backdrop-blur-3xl flex flex-col items-center justify-center p-24">
                                            {!aiComplete ? (
                                                <div className="text-center">
                                                    <div className="w-24 h-24 border-8 border-emerald-500/10 border-t-emerald-500 animate-spin rounded-full mx-auto mb-10" />
                                                    <p className="text-4xl font-black uppercase italic">Analizando Perfil...</p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="text-8xl font-black text-emerald-600 mb-6">98%</div>
                                                    <p className="text-xl font-bold italic text-slate-600">"Match Estratégico Detectado"</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
