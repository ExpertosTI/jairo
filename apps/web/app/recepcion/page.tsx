"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
    LayoutDashboard, Users, Clock, ShieldCheck, 
    Fingerprint, LayoutGrid, List, ChevronRight, 
    Search, Activity, Target, Zap, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Tipos ---
interface Invitado {
    id: string;
    nombre: string;
    empresa: string;
    mesa: string;
    status: 'pending' | 'cleared';
    isVIP?: boolean;
}

export default function RecepcionCommandCenter() {
    const [view, setView] = useState<'tables' | 'directory'>('tables');
    const [searchTerm, setSearchTerm] = useState("");
    const [invitados, setInvitados] = useState<Invitado[]>([]);
    const [loading, setLoading] = useState(true);

    // Métricas calculadas
    const totalManifest = 70;
    const clearedCount = invitados.filter(i => i.status === 'cleared').length;
    const pendingCount = totalManifest - clearedCount;
    const progress = Math.round((clearedCount / totalManifest) * 100);

    // Cargar datos iniciales
    useEffect(() => {
        // Simulación de carga inicial desde la API
        const initialData: Invitado[] = [
            { id: "1", nombre: "Ángel Donid", empresa: "Invitado VIP", mesa: "1", status: 'pending', isVIP: true },
            { id: "2", nombre: "Maimón", empresa: "MKMGH", mesa: "1", status: 'pending' },
            { id: "3", nombre: "GBC", empresa: "FARMACIAS GBC", mesa: "1", status: 'pending', isVIP: true },
            { id: "4", nombre: "Renso", empresa: "RENACETECH", mesa: "1", status: 'pending' },
            { id: "5", nombre: "Jessica", empresa: "INVITADO", mesa: "10", status: 'pending' },
            { id: "6", nombre: "Rapelito Confesor", empresa: "INVITADO", mesa: "10", status: 'pending' },
            { id: "7", nombre: "Jama", empresa: "INVITADO", mesa: "2", status: 'pending' },
            { id: "8", nombre: "Iván", empresa: "INVITADO", mesa: "2", status: 'pending' },
            { id: "9", nombre: "Wascar Melo", empresa: "INVITADO", mesa: "30", status: 'pending' },
            { id: "10", nombre: "Lucía", empresa: "INVITADO", mesa: "31", status: 'pending' },
        ];
        setInvitados(initialData);
        setLoading(false);
    }, []);

    // Acción: Marcar Asistencia
    const handleCheckIn = async (invitadoId: string) => {
        setInvitados(prev => prev.map(inv => 
            inv.id === invitadoId 
                ? { ...inv, status: inv.status === 'cleared' ? 'pending' : 'cleared' } 
                : inv
        ));

        // Aquí iría la llamada real a la API:
        // await fetch('/api/events/attendance', { method: 'POST', body: JSON.stringify({ guestId: invitadoId }) });
    };

    const mesas = ["1", "2", "10", "20", "21", "30", "31", "32"];

    return (
        <div className="min-h-screen bg-[#080c14] text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col">
            
            {/* --- CLEAN HEADER (Unified Identity) --- */}
            <nav className="h-20 border-b border-white/[0.03] bg-[#080c14]/80 backdrop-blur-xl flex items-center justify-between px-10 z-50">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Fingerprint className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight leading-none">JairoAcceso</span>
                            <span className="text-[10px] font-bold text-emerald-500/70 tracking-[0.3em] uppercase mt-1">Command Center</span>
                        </div>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-8">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl">
                            <Search className="w-4 h-4 text-gray-500" />
                            <input 
                                type="text"
                                placeholder="Search entity..."
                                className="bg-transparent border-none outline-none text-xs w-48 placeholder:text-gray-600 focus:w-64 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
                        <button 
                            onClick={() => setView('directory')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black transition-all ${view === 'directory' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <LayoutGrid className="w-3 h-3" />
                            DIRECTORY
                        </button>
                        <button 
                            onClick={() => setView('tables')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black transition-all ${view === 'tables' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <List className="w-3 h-3" />
                            TABLES
                        </button>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center cursor-pointer hover:bg-white/[0.08] transition-colors">
                        <Image src="https://jairoapp.renace.tech/logo.png" alt="Profile" width={20} height={20} className="opacity-60" />
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden">
                {/* --- TELEMETRY SIDEBAR (Dynamic & Elegant) --- */}
                <aside className="w-80 border-r border-white/[0.03] p-8 flex flex-col gap-8 bg-[#080c14] relative">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">System Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-gray-300">Live Telemetry Active</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Metric: Manifest */}
                        <div className="group cursor-default">
                            <div className="flex items-end justify-between mb-2">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Manifest</p>
                                <Users className="w-4 h-4 text-blue-500 opacity-40" />
                            </div>
                            <div className="text-5xl font-black tracking-tighter group-hover:text-blue-400 transition-colors">{totalManifest}</div>
                        </div>

                        {/* Metric: Cleared */}
                        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/[0.08] to-transparent border border-emerald-500/10 relative overflow-hidden group">
                            <div className="flex items-end justify-between mb-2">
                                <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Cleared</p>
                                <div className="text-xl font-black text-emerald-500">{progress}%</div>
                            </div>
                            <div className="text-5xl font-black tracking-tighter text-emerald-500">{clearedCount}</div>
                            {/* Progress bar sutil */}
                            <div className="mt-4 h-1 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-emerald-500" 
                                />
                            </div>
                        </div>

                        {/* Metric: Pending */}
                        <div className="group cursor-default">
                            <div className="flex items-end justify-between mb-2">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Inbound / Pending</p>
                                <Clock className="w-4 h-4 text-orange-500 opacity-40" />
                            </div>
                            <div className="text-5xl font-black tracking-tighter group-hover:text-orange-400 transition-colors">{pendingCount}</div>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button className="w-full py-4 rounded-2xl bg-white/[0.02] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-emerald-400">
                            <Fingerprint className="w-5 h-5" />
                            Initialize Scanner
                        </button>
                    </div>

                    {/* Gradient depth side */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-500/[0.02] to-transparent pointer-events-none" />
                </aside>

                {/* --- COMMAND GRID (Interactivo) --- */}
                <main className="flex-1 p-10 overflow-y-auto bg-[#06080c] relative custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {mesas.map((mesaId) => {
                                const mesaInvitados = invitados.filter(i => i.mesa === mesaId);
                                const occupancy = mesaInvitados.length;
                                const maxOccupancy = mesaId === "1" ? 4 : 2;

                                return (
                                    <motion.div 
                                        key={mesaId}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative group"
                                    >
                                        <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                                        
                                        <div className="relative bg-[#0d121b]/80 backdrop-blur-xl border border-white/[0.03] rounded-[2.5rem] p-6 shadow-2xl transition-all duration-300 group-hover:bg-[#0d121b] group-hover:translate-y-[-4px]">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                                                        <LayoutDashboard className="w-6 h-6 text-gray-500 group-hover:text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black tracking-tight uppercase leading-none">Mesa {mesaId}</h3>
                                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Strategic Table</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-emerald-500 tracking-tighter leading-none">{occupancy}/{maxOccupancy}</p>
                                                    <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">Occupancy</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {mesaInvitados.map((invitado) => (
                                                    <motion.div 
                                                        key={invitado.id}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleCheckIn(invitado.id)}
                                                        className={`group/item flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                                                            invitado.status === 'cleared' 
                                                            ? 'bg-emerald-500/[0.05] border-emerald-500/20 hover:bg-emerald-500/10' 
                                                            : 'bg-white/[0.02] border-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-3 h-3 rounded-full border-2 transition-all ${
                                                                invitado.status === 'cleared' 
                                                                ? 'bg-emerald-400 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' 
                                                                : 'border-gray-700'
                                                            }`} />
                                                            <div>
                                                                <p className={`text-xs font-bold leading-none ${invitado.status === 'cleared' ? 'text-emerald-400' : 'text-gray-300'}`}>
                                                                    {invitado.nombre}
                                                                    {invitado.isVIP && <span className="ml-2 text-[10px] text-emerald-500">★</span>}
                                                                </p>
                                                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter mt-1 group-hover/item:text-gray-400 transition-colors">{invitado.empresa}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`p-2 rounded-lg transition-all ${invitado.status === 'cleared' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-700 opacity-0 group-hover/item:opacity-100'}`}>
                                                            {invitado.status === 'cleared' ? <CheckCircle2 className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                
                                                {/* Seat Available Placeholders */}
                                                {Array.from({ length: maxOccupancy - occupancy }).map((_, i) => (
                                                    <div key={i} className="p-4 rounded-2xl border border-dashed border-white/[0.02] flex items-center justify-center group/empty">
                                                        <p className="text-[8px] font-black text-gray-800 uppercase tracking-[0.3em] group-hover/empty:text-gray-700 transition-colors">Available</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Background elements for depth */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#06080c]">
                <div className="absolute top-[20%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/[0.03] blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-blue-500/[0.03] blur-[150px] rounded-full" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] mix-blend-overlay" />
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.2);
                }
            `}</style>
        </div>
    );
}
