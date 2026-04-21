"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
    LayoutDashboard, Users, TrendingUp, Activity, 
    Target, Zap, ShieldCheck, Clock, ArrowUpRight,
    Briefcase, MessageSquare, BarChart3, PieChart,
    ChevronRight, Globe, Layers, Search, Bell, X,
    Sparkles, ArrowRight, Fingerprint, Database,
    Cpu, Network
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function JairoCyberDemo() {
    const [activeModule, setActiveModule] = useState('overview');
    const [loadingStage, setLoadingStage] = useState(0);
    const [selectedGuest, setSelectedGuest] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [guests, setGuests] = useState<any[]>([]);
    const [filteredGuests, setFilteredGuests] = useState<any[]>([]);
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [checkinStage, setCheckinStage] = useState('none'); // none, analysis, ready, success

    const [liveMetrics, setLiveMetrics] = useState({
        sinergia: 94.2,
        rfqs: 128,
        volumen: 2.45,
        nodos: 70
    });
    const [aiInsight, setAiInsight] = useState("Analizando flujos de capital en sector logístico...");
    const [attendanceStats, setAttendanceStats] = useState({ cleared: 0, target: 103 });

    // --- Carga Inicial de Datos Reales ---
    useEffect(() => {
        const timer1 = setTimeout(() => setLoadingStage(1), 300);
        const timer2 = setTimeout(() => setLoadingStage(2), 600);
        const timer3 = setTimeout(() => setLoadingStage(3), 900);

        const fetchData = async () => {
            try {
                const apiUrl = 'https://jairoapp.renace.tech/api';
                const eventId = 'evt_circulo_001';
                
                // Fetch Guests
                const gRes = await fetch(`${apiUrl}/events/${eventId}/guests`);
                const gData = await gRes.json();
                if (Array.isArray(gData)) {
                    setGuests(gData);
                    setFilteredGuests(gData.slice(0, 5));
                }

                // Fetch Attendance Stats
                const aRes = await fetch(`${apiUrl}/events/${eventId}/attendance`);
                const aData = await aRes.json();
                if (Array.isArray(aData)) {
                    setAttendanceStats({ cleared: aData.length, target: 103 });
                }
            } catch (e) { console.error("Error fetching data:", e); }
        };

        fetchData();

        // Telemetría Viva
        const metricsInterval = setInterval(() => {
            setLiveMetrics(prev => ({
                sinergia: Math.min(100, Math.max(90, prev.sinergia + (Math.random() * 0.4 - 0.2))),
                rfqs: prev.rfqs + (Math.random() > 0.7 ? 1 : 0),
                volumen: prev.volumen + (Math.random() * 0.01),
                nodos: 70
            }));
        }, 3000);

        return () => { 
            clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); 
            clearInterval(metricsInterval); 
        };
    }, []);

    // --- Lógica de Búsqueda en Tiempo Real ---
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredGuests(guests.slice(0, 5));
            return;
        }
        const filtered = guests.filter(g => 
            g.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredGuests(filtered.slice(0, 8));
    }, [searchQuery, guests]);

    const handleSelectGuest = (guest: any) => {
        setSelectedGuest(guest);
        setCheckinStage('analysis');
        setIsCheckingIn(true);
        
        // Efecto WOW: Simulación de Análisis de IA durante 3.5 segundos
        setTimeout(() => {
            setCheckinStage('ready');
        }, 3500);
    };

    const confirmCheckin = async () => {
        if (!selectedGuest) return;
        try {
            const apiUrl = 'https://jairoapp.renace.tech/api';
            await fetch(`${apiUrl}/events/evt_circulo_001/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    guestId: selectedGuest.id,
                    companyName: selectedGuest.company,
                    guestName: selectedGuest.name
                })
            });
            setCheckinStage('success');
            setTimeout(() => {
                setIsCheckingIn(false);
                setSelectedGuest(null);
                setCheckinStage('none');
                setAttendanceStats(prev => ({ ...prev, cleared: prev.cleared + 1 }));
                // Update local list status
                setGuests(prev => prev.map(g => g.id === selectedGuest.id ? { ...g, cleared: true } : g));
            }, 2000);
        } catch (e) { console.error(e); }
    };

    const metrics = [
        { title: "Índice de Sinergia", value: liveMetrics.sinergia.toFixed(1), unit: "%", icon: Zap, color: "emerald", trend: "+12%" },
        { title: "RFQs Detectados", value: liveMetrics.rfqs, unit: "", icon: MessageSquare, color: "blue", trend: "Live" },
        { title: "Volumen Proyectado", value: liveMetrics.volumen.toFixed(2), unit: "M", icon: TrendingUp, color: "purple", trend: "+18%" },
        { title: "Nodos Activos", value: liveMetrics.nodos, unit: "", icon: Network, color: "orange", trend: "Optimal" },
    ];

    return (
        <div className="min-h-screen bg-[#010204] text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex">
            
            {/* HUD Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_10%,rgba(16,185,129,0.06),transparent_60%)]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] mix-blend-overlay" />
            </div>

            {/* Sidebar Táctico */}
            <aside className="w-24 lg:w-80 border-r border-white/[0.05] bg-[#010204]/95 backdrop-blur-3xl z-50 flex flex-col relative">
                <div className="h-28 flex items-center px-10 gap-5 border-b border-white/[0.05]">
                    <motion.div animate={{ rotate: [0, 90, 90, 0] }} transition={{ duration: 5, repeat: Infinity }} className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] border border-emerald-400/30">
                        <Cpu className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="hidden lg:block">
                        <h1 className="text-2xl font-black tracking-tighter italic">JAIRO OS</h1>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Tactical Core</p>
                    </div>
                </div>

                <nav className="flex-1 p-8 space-y-4">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Command Center' },
                        { id: 'map', icon: Globe, label: 'Geo-Strategy' },
                        { id: 'ai', icon: Sparkles, label: 'Insforge AI' },
                        { id: 'data', icon: Database, label: 'Market Data' }
                    ].map((item) => (
                        <button key={item.id} onClick={() => setActiveModule(item.id)} className={`w-full flex items-center gap-5 px-5 py-5 rounded-[2rem] transition-all relative ${activeModule === item.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}>
                            <item.icon className="w-6 h-6" />
                            <span className="hidden lg:block text-[11px] font-black uppercase tracking-[0.25em]">{item.label}</span>
                            {activeModule === item.id && <motion.div layoutId="nav-active" className="absolute left-0 w-1.5 h-8 bg-emerald-500 rounded-r-full shadow-[0_0_15px_rgba(16,185,129,0.8)]" />}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Center */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden z-10">
                <header className="h-28 px-16 border-b border-white/[0.05] flex items-center justify-between bg-[#010204]/80 backdrop-blur-3xl shrink-0">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">{activeModule === 'overview' ? 'Monitor Central' : 'Análisis Táctico'}</h2>
                        <div className="flex items-center gap-5 mt-2">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">SISTEMA ACTIVO</p></div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-600 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                type="text" 
                                placeholder="BUSCAR INVITADO O EMPRESA..."
                                className="w-96 bg-white/[0.03] border border-white/10 rounded-full py-4 pl-14 pr-6 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:border-emerald-500/50 transition-all shadow-inner"
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-16 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {loadingStage < 3 ? (
                            <div key="loader" className="grid grid-cols-4 gap-10">
                                {[1,2,3,4].map(i => <div key={i} className="h-44 rounded-[3rem] bg-white/[0.02] animate-pulse" />)}
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                                
                                {/* Telemetría */}
                                <div className="grid grid-cols-4 gap-10">
                                    {metrics.map((m, i) => (
                                        <div key={i} className="p-10 rounded-[3.5rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.05] relative overflow-hidden">
                                            <m.icon className={`w-8 h-8 text-${m.color}-500 mb-6`} />
                                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">{m.title}</p>
                                            <p className="text-6xl font-black tracking-tighter">{m.value}<span className="text-2xl text-white/20 ml-2 font-bold">{m.unit}</span></p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-3 gap-12">
                                    {/* Radar - Lista Real de Invitados */}
                                    <div className="col-span-2 p-14 rounded-[4.5rem] bg-[#05080f]/90 border border-white/[0.05] shadow-2xl relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-12">
                                            <div>
                                                <h3 className="text-3xl font-black uppercase italic">Radar de Invitados</h3>
                                                <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.5em] mt-2">Base de Datos Conectada</p>
                                            </div>
                                            <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{attendanceStats.cleared} / {attendanceStats.target} Cleared</div>
                                        </div>

                                        <div className="space-y-4">
                                            {filteredGuests.length > 0 ? filteredGuests.map((guest, i) => (
                                                <motion.div 
                                                    key={guest.id} onClick={() => handleSelectGuest(guest)}
                                                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                                                    className="p-7 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-emerald-500/[0.06] hover:border-emerald-500/40 transition-all flex items-center justify-between cursor-pointer group"
                                                >
                                                    <div className="flex items-center gap-8">
                                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center font-black text-gray-700 group-hover:text-emerald-500 transition-colors uppercase">{guest.name?.charAt(0)}</div>
                                                        <div>
                                                            <p className="text-2xl font-black tracking-tighter uppercase leading-none mb-1.5">{guest.name}</p>
                                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">{guest.company || 'PARTICULAR'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-8">
                                                        <div className="text-right">
                                                            <p className={`text-xl font-black uppercase italic transition-colors ${guest.cleared ? 'text-emerald-500' : 'text-emerald-500/40 group-hover:text-emerald-500'}`}>{guest.cleared ? 'CONCEDIDO' : 'PENDIENTE'}</p>
                                                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">Status</p>
                                                        </div>
                                                        <ChevronRight className="w-6 h-6 text-gray-800 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
                                                    </div>
                                                </motion.div>
                                            )) : (
                                                <div className="h-40 flex items-center justify-center border border-dashed border-white/5 rounded-3xl text-gray-600 uppercase font-black tracking-widest">No se encontraron resultados</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Panel AI Insight */}
                                    <div className="space-y-12">
                                        <div className="p-12 rounded-[4rem] bg-emerald-500/[0.07] border border-emerald-500/20 relative overflow-hidden shadow-2xl">
                                            <Sparkles className="w-16 h-16 text-emerald-500/10 absolute top-[-15px] right-[-15px] rotate-12" />
                                            <h3 className="text-2xl font-black uppercase italic mb-8">Insforge Insight</h3>
                                            <p className="text-lg font-bold text-gray-300 leading-relaxed italic border-l-4 border-emerald-500/40 pl-6">"{aiInsight}"</p>
                                            <div className="mt-10 flex items-center justify-between">
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Optimización Activa</span>
                                                <Fingerprint className="w-8 h-8 text-emerald-500/20" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* --- MODAL DE CHECK-IN WOW --- */}
            <AnimatePresence>
                {isCheckingIn && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-10 bg-[#010204]/90 backdrop-blur-2xl">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-6xl aspect-video bg-[#05080f] rounded-[5rem] border border-white/10 shadow-[0_100px_200px_rgba(0,0,0,0.8)] overflow-hidden flex relative"
                        >
                            {/* Panel Izquierdo: Datos */}
                            <div className="flex-1 p-20 flex flex-col justify-center">
                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                    <p className="text-emerald-500 text-[12px] font-black uppercase tracking-[0.5em] mb-6">Protocolo de Identificación</p>
                                    <h3 className="text-7xl font-black tracking-tighter uppercase italic text-white mb-4 leading-none">{selectedGuest?.name}</h3>
                                    <p className="text-3xl font-bold text-gray-500 uppercase tracking-widest mb-16">{selectedGuest?.company || 'GUEST INDIVIDUAL'}</p>
                                    
                                    <div className="flex gap-4">
                                        {checkinStage === 'ready' && (
                                            <button onClick={confirmCheckin} className="px-12 py-6 bg-emerald-500 rounded-full font-black uppercase tracking-widest text-black hover:bg-emerald-400 transition-all shadow-[0_0_40px_rgba(16,185,129,0.4)]">Conceder Acceso</button>
                                        )}
                                        <button onClick={() => { setIsCheckingIn(false); setSelectedGuest(null); setCheckinStage('none'); }} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full font-black uppercase tracking-widest text-gray-400 hover:bg-white/10 transition-all">Cancelar</button>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Panel Derecho: AI Match WOW */}
                            <div className="w-[45%] bg-[#080c14] border-l border-white/5 relative p-20 flex flex-col justify-center overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at:50%_50%,rgba(16,185,129,0.2),transparent_70%)]" />
                                
                                {checkinStage === 'analysis' ? (
                                    <div className="relative z-10 text-center">
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-32 h-32 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full mx-auto mb-10" />
                                        <p className="text-2xl font-black uppercase italic tracking-tighter text-emerald-500">Escaneando Perfil B2B...</p>
                                        <p className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.3em] mt-4">Analizando compatibilidad con red JairoApp</p>
                                    </div>
                                ) : checkinStage === 'ready' ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
                                        <div className="mb-12">
                                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4">Sinergia Detectada</p>
                                            <p className="text-8xl font-black text-emerald-500 leading-none">98<span className="text-4xl text-emerald-500/30">%</span></p>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem]">
                                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Análisis Estratégico</p>
                                                <p className="text-lg font-bold text-gray-300 leading-relaxed italic">"Alto potencial de Match para el proyecto 'Círculo de Líderes'. Compatible con el 85% de los miembros actuales."</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <span className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-gray-500 uppercase">High Value</span>
                                                <span className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-gray-500 uppercase">Corporate</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : checkinStage === 'success' && (
                                    <div className="relative z-10 text-center">
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-32 h-32 bg-emerald-500 rounded-full mx-auto mb-10 flex items-center justify-center">
                                            <ShieldCheck className="w-16 h-16 text-black" />
                                        </motion.div>
                                        <p className="text-4xl font-black uppercase italic text-white">ACCESO CONCEDIDO</p>
                                        <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-[0.4em] mt-4">Registro en Cadena Completado</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.1); border-radius: 20px; }
            `}</style>
        </div>
    );
}
