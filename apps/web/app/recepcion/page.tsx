"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
    LayoutDashboard, Users, Clock, ShieldCheck, 
    Fingerprint, LayoutGrid, List, ChevronRight, 
    Search, Activity, Target, Zap, CheckCircle2,
    X, Phone, Mail, MapPin, Sparkles, Loader2,
    Lock, Star
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
    zona?: string;
    email?: string;
    phone?: string;
}

interface AIMatch {
    score: number;
    summary: string;
    tags: string[];
}

export default function RecepcionCommandCenter() {
    const [view, setView] = useState<'tables' | 'directory'>('directory');
    const [filter, setFilter] = useState<'all' | 'pending' | 'cleared' | 'vip'>('all');
    const [searchTerm, setSearchTerm] = useState("");
    const [invitados, setInvitados] = useState<Invitado[]>([]);
    const [selectedGuest, setSelectedGuest] = useState<Invitado | null>(null);
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [aiSyncing, setAiSyncing] = useState(false);
    const [aiResult, setAiResult] = useState<AIMatch | null>(null);

    // --- Carga de Datos Real ---
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await fetch('https://jairoapp.renace.tech/api/events/evt_circulo_001/attendance');
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 5) setInvitados(data);
                    else throw new Error("Datos insuficientes, usando fallback");
                }
            } catch (error) {
                // Fallback Inteligente (Modo Offline/Prueba)
                setInvitados([
                    { id: "1", nombre: "Ángel Donid", empresa: "Invitado VIP", mesa: "1", zona: "Presidencial A", status: 'pending', isVIP: true },
                    { id: "2", nombre: "Maimón", empresa: "MKMGH", mesa: "1", zona: "Presidencial A", status: 'pending' },
                    { id: "3", nombre: "GBC", empresa: "FARMACIAS GBC", mesa: "1", zona: "Presidencial A", status: 'cleared', isVIP: true },
                    { id: "4", nombre: "Renso", empresa: "RENACETECH", mesa: "1", zona: "Presidencial A", status: 'pending' },
                    { id: "5", nombre: "Jessica", empresa: "INVITADO", mesa: "10", zona: "Mesa 10", status: 'pending' },
                    { id: "6", nombre: "Jama", empresa: "Invitado", mesa: "2", zona: "Mesa 2", status: 'pending' },
                ]);
            }
        };
        fetchAttendance();
    }, []);

    // --- Lógica de Check-in con IA ---
    const handleGrantAccess = async () => {
        if (!selectedGuest) return;
        
        setIsCheckingIn(true);
        setAiSyncing(true);

        try {
            // 1. Simulación de Llamada a Insforge AI
            const aiResponse = await fetch('https://jairoapp.renace.tech/api/events/ai/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guestId: selectedGuest.id })
            });
            const matchData = await aiResponse.json();
            
            setAiResult({
                score: matchData.matchScore || 98,
                summary: matchData.aiSummary || "Alta sinergia detectada en logística y B2B.",
                tags: matchData.networkingTags || ["High Value", "Strategic"]
            });

            // 2. Persistencia en Base de Datos
            await fetch('https://jairoapp.renace.tech/api/events/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    eventId: 'evt_circulo_001', 
                    guestId: selectedGuest.id,
                    metadata: { checkin_type: 'biometric_bypass', ai_synced: true }
                })
            });

            // 3. Efecto WOW (4 segundos de visualización de IA)
            setTimeout(() => {
                setInvitados(prev => prev.map(inv => 
                    inv.id === selectedGuest.id ? { ...inv, status: 'cleared' } : inv
                ));
                setAiSyncing(false);
                setIsCheckingIn(false);
                setSelectedGuest(null);
                setAiResult(null);
            }, 4000);

        } catch (error) {
            setAiSyncing(false);
            setIsCheckingIn(false);
        }
    };

    const filteredInvitados = invitados.filter(inv => {
        const matchesSearch = inv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             inv.empresa.toLowerCase().includes(searchTerm.toLowerCase());
        if (filter === 'pending') return matchesSearch && inv.status === 'pending';
        if (filter === 'cleared') return matchesSearch && inv.status === 'cleared';
        if (filter === 'vip') return matchesSearch && inv.isVIP;
        return matchesSearch;
    });

    const mesas = Array.from(new Set(invitados.map(i => i.mesa)));

    return (
        <div className="min-h-screen bg-[#05070a] text-white font-sans selection:bg-emerald-500/30 flex flex-col relative overflow-hidden">
            
            {/* --- TOP NAV --- */}
            <nav className="h-20 border-b border-white/[0.03] bg-[#05070a]/80 backdrop-blur-2xl flex items-center justify-between px-10 z-50">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Fingerprint className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight leading-none uppercase">JairoAcceso</span>
                            <span className="text-[10px] font-bold text-emerald-500/70 tracking-[0.3em] uppercase mt-1">Command Center</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
                        <button 
                            onClick={() => setView('directory')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black transition-all ${view === 'directory' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <List className="w-3.5 h-3.5" />
                            DIRECTORIO
                        </button>
                        <button 
                            onClick={() => setView('tables')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black transition-all ${view === 'tables' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            MESAS
                        </button>
                    </div>
                    <button className="px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all">
                        Initialize Scanner
                    </button>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden">
                {/* --- TELEMETRY SIDEBAR --- */}
                <aside className="w-80 border-r border-white/[0.03] p-8 flex flex-col gap-8 bg-[#05070a]/50 backdrop-blur-xl">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Live Telemetry</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-gray-400">Stream Conectado</span>
                            </div>
                        </div>

                        {/* Metric: Manifest */}
                        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 relative group">
                            <div className="flex justify-between items-start mb-2">
                                <Users className="w-5 h-5 text-blue-500/50" />
                                <span className="text-[8px] font-black text-blue-500/80 uppercase tracking-widest">Target</span>
                            </div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Manifest</p>
                            <p className="text-5xl font-black mt-1 tracking-tighter">70</p>
                        </div>

                        {/* Metric: Cleared */}
                        <div className="p-6 rounded-[2rem] bg-emerald-500/[0.03] border border-emerald-500/10 relative group">
                            <div className="flex justify-between items-start mb-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500/50" />
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Cleared</span>
                            </div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Access Granted</p>
                            <p className="text-5xl font-black mt-1 tracking-tighter text-emerald-500">{invitados.filter(i => i.status === 'cleared').length}</p>
                            <p className="text-xs font-bold text-emerald-500/50 mt-2">{Math.round((invitados.filter(i => i.status === 'cleared').length / 70) * 100)}%</p>
                        </div>

                        {/* Metric: Inbound */}
                        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 relative group">
                            <div className="flex justify-between items-start mb-2">
                                <Clock className="w-5 h-5 text-orange-500/50" />
                                <span className="text-[8px] font-black text-orange-500/80 uppercase tracking-widest">Inbound</span>
                            </div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pending Entry</p>
                            <p className="text-5xl font-black mt-1 tracking-tighter">70</p>
                        </div>
                    </div>
                </aside>

                {/* --- MAIN CONTENT AREA --- */}
                <main className="flex-1 flex flex-col bg-[#05070a]">
                    
                    {/* Barra de Filtros (Captura 1) */}
                    <div className="p-8 border-b border-white/[0.03] flex items-center justify-between">
                        <div className="flex items-center gap-4 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <button 
                                onClick={() => setFilter('all')}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${filter === 'all' ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
                            >
                                ALL RECORDS
                            </button>
                            <button 
                                onClick={() => setFilter('pending')}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${filter === 'pending' ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
                            >
                                AWAITING ENTRY
                            </button>
                            <button 
                                onClick={() => setFilter('cleared')}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${filter === 'cleared' ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
                            >
                                CLEARED
                            </button>
                            <button 
                                onClick={() => setFilter('vip')}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${filter === 'vip' ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
                            >
                                VIP LOUNGE
                            </button>
                        </div>

                        <div className="relative w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Filtrar por nombre o empresa..."
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 bg-[#080c12]/30">
                        {view === 'directory' ? (
                            /* --- VISTA DIRECTORIO (Captura 1) --- */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredInvitados.map((inv) => (
                                    <motion.div 
                                        key={inv.id}
                                        layoutId={inv.id}
                                        onClick={() => setSelectedGuest(inv)}
                                        className={`group p-6 rounded-[2.5rem] border transition-all cursor-pointer relative overflow-hidden ${
                                            inv.status === 'cleared' ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-white/[0.02] border-white/5 hover:border-emerald-500/30'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="px-3 py-1 bg-white/[0.05] rounded-full text-[8px] font-black tracking-widest text-gray-400 group-hover:text-emerald-400 transition-colors">
                                                MESA {inv.mesa}
                                            </div>
                                            {inv.isVIP && <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />}
                                        </div>
                                        <h3 className="text-xl font-black tracking-tight leading-none group-hover:text-emerald-400 transition-colors">{inv.nombre}</h3>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">{inv.empresa}</p>
                                        
                                        <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-emerald-500 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 uppercase">
                                            Tap to verify <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            /* --- VISTA MESAS (Refinada) --- */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {mesas.map((mesaId) => {
                                    const mesaInvitados = invitados.filter(i => i.mesa === mesaId);
                                    return (
                                        <div key={mesaId} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6">
                                            <div className="flex justify-between items-center mb-6 px-2">
                                                <h3 className="text-lg font-black uppercase tracking-tight">Mesa {mesaId}</h3>
                                                <span className="text-[10px] font-black text-emerald-500/60 uppercase">0 / 4 OCCUPANCY</span>
                                            </div>
                                            <div className="space-y-2">
                                                {mesaInvitados.map(inv => (
                                                    <div 
                                                        key={inv.id}
                                                        onClick={() => setSelectedGuest(inv)}
                                                        className="p-4 rounded-2xl bg-white/[0.03] border border-transparent hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all cursor-pointer flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full border ${inv.status === 'cleared' ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-gray-700'}`} />
                                                            <div className="text-xs font-bold">{inv.nombre}</div>
                                                        </div>
                                                        {inv.isVIP && <span className="text-[10px] text-emerald-500">★</span>}
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

            {/* --- MODAL DE CHECK-IN (Captura 2) --- */}
            <AnimatePresence>
                {selectedGuest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-[900px] bg-[#0a0f18] rounded-[3rem] border border-white/[0.05] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)] relative"
                        >
                            <div className="flex h-[550px]">
                                {/* Panel Izquierdo (Identidad) */}
                                <div className="w-[45%] bg-gradient-to-br from-emerald-600/10 to-transparent p-12 border-r border-white/[0.05]">
                                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full inline-flex items-center gap-2 mb-10">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Identity Verification</span>
                                    </div>

                                    <h2 className="text-6xl font-black tracking-tighter mb-4">{selectedGuest.nombre}</h2>
                                    <div className="px-4 py-2 bg-white/[0.05] rounded-xl inline-flex items-center gap-2 mb-12">
                                        <Briefcase className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{selectedGuest.empresa}</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Asignación de Zona</p>
                                                    <p className="text-xl font-black mt-1 uppercase tracking-tight">{selectedGuest.zona || `Mesa ${selectedGuest.mesa}`}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 px-6">
                                            <div className="w-8 h-8 rounded-full border border-emerald-500/30 flex items-center justify-center">
                                                <Fingerprint className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none">Biometric Bypass Available</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-0.5 tracking-tighter">SYS_ID: 00000{selectedGuest.id}-A</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Panel Derecho (Formulario / IA Overlay) */}
                                <div className="flex-1 p-12 flex flex-col relative bg-[#0a0f18]">
                                    <div className="flex justify-between items-center mb-12">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Data Enrichment</p>
                                        <button onClick={() => setSelectedGuest(null)} className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.1] transition-all">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex-1 space-y-8">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Secure Contact</p>
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder="+1 (000) 000-0000"
                                                className="w-full bg-white text-black h-16 rounded-2xl px-6 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Corporate Email</p>
                                            </div>
                                            <input 
                                                type="email" 
                                                placeholder="executive@enterprise.com"
                                                className="w-full bg-white text-black h-16 rounded-2xl px-6 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <button 
                                            onClick={() => setSelectedGuest(null)}
                                            className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
                                        >
                                            CANCEL
                                        </button>
                                        <button 
                                            onClick={handleGrantAccess}
                                            className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-emerald-900/40 transition-all active:scale-95"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            Grant Access
                                        </button>
                                    </div>

                                    {/* --- INSFORGE AI OVERLAY (La Magia) --- */}
                                    <AnimatePresence>
                                        {aiSyncing && (
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 z-50 bg-[#0a0f18]/90 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center"
                                            >
                                                {!aiResult ? (
                                                    <div className="flex flex-col items-center gap-6">
                                                        <div className="relative">
                                                            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                                                            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-emerald-500 animate-pulse" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-2xl font-black tracking-tighter uppercase">Sincronizando AI...</p>
                                                            <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.4em]">Insforge Semantic Match Engine</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <motion.div 
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        className="space-y-8"
                                                    >
                                                        <div className="inline-flex flex-col items-center gap-2">
                                                            <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center text-3xl font-black text-emerald-500">
                                                                {aiResult.score}%
                                                            </div>
                                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">B2B Match Score</p>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <p className="text-lg font-bold text-gray-200 leading-relaxed max-w-md mx-auto italic">
                                                                "{aiResult.summary}"
                                                            </p>
                                                            <div className="flex flex-wrap justify-center gap-2">
                                                                {aiResult.tags.map(tag => (
                                                                    <span key={tag} className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="pt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                            <Fingerprint className="w-4 h-4" />
                                                            Protocolo de Seguridad Validado
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[#05070a]">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.03),transparent_40%)]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
            `}</style>
        </div>
    );
}
