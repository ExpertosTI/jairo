"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
    LayoutDashboard, Users, Briefcase, FileText, Settings, 
    Bell, Search, Menu, X, ArrowUpRight, TrendingUp, 
    Activity, BarChart3, PieChart, ChevronRight, Zap,
    ShieldCheck, Clock, Target, Fingerprint, LayoutGrid, List
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Tipos para el Command Center ---
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
    const [scannedCount, setScannedCount] = useState(0);
    
    // Simulación de datos del evento
    const invitados: Invitado[] = [
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

    const mesas = ["1", "2", "10", "20", "21", "30", "31", "32"];

    return (
        <div className="min-h-screen bg-[#0a0f18] text-white font-sans selection:bg-emerald-500/30">
            {/* --- TOP NAV (Identidad JairoApp) --- */}
            <nav className="h-16 border-b border-white/5 bg-[#0a0f18]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Image src="https://jairoapp.renace.tech/logo.png" alt="Jairo Logo" width={32} height={32} className="object-contain" />
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">JairoApp</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                        <span className="hover:text-emerald-400 cursor-pointer transition-colors">Directorio</span>
                        <span className="hover:text-emerald-400 cursor-pointer transition-colors">RFQs</span>
                        <span className="hover:text-emerald-400 cursor-pointer transition-colors">Analytics</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Iniciar Sesión</button>
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold rounded-lg transition-all shadow-lg shadow-emerald-900/20">Registrar</button>
                </div>
            </nav>

            <div className="flex h-[calc(100-4rem)]">
                {/* --- LEFT SIDEBAR (Telemetría Live) --- */}
                <aside className="w-80 border-r border-white/5 p-6 flex flex-col gap-6 bg-[#0a0f18]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-none">JairoAcceso</h1>
                            <p className="text-[10px] text-emerald-500/70 tracking-[0.2em] uppercase mt-1 font-semibold">Command Center</p>
                        </div>
                    </div>

                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-[-12px]">Live Telemetry</p>

                    {/* Metric 1 */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Total Manifest</p>
                        <p className="text-4xl font-black mt-1">70</p>
                        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-blue-500/5 blur-[40px] group-hover:bg-blue-500/10 transition-colors" />
                    </div>

                    {/* Metric 2 */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 flex items-center justify-center border-t-emerald-500 rotate-45">
                                <ShieldCheck className="w-4 h-4 text-emerald-500 -rotate-45" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-500">0%</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Cleared</p>
                        <p className="text-4xl font-black mt-1">0</p>
                        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-emerald-500/5 blur-[40px] group-hover:bg-emerald-500/10 transition-colors" />
                    </div>

                    {/* Metric 3 */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                            <Clock className="w-5 h-5 text-orange-400" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Pending Entry</p>
                        <p className="text-4xl font-black mt-1">70</p>
                        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-orange-500/5 blur-[40px] group-hover:bg-orange-500/10 transition-colors" />
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5">
                        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white">
                            <Fingerprint className="w-4 h-4" />
                            Initialize Scanner
                        </button>
                    </div>
                </aside>

                {/* --- MAIN CONTENT (Command Grid) --- */}
                <main className="flex-1 p-8 overflow-y-auto bg-[#080c14]">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-10">
                        <div className="relative w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search via ID, name or company..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-xl">
                            <button 
                                onClick={() => setView('directory')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'directory' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                DIRECTORY
                            </button>
                            <button 
                                onClick={() => setView('tables')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'tables' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <List className="w-4 h-4" />
                                TABLES
                            </button>
                        </div>
                    </div>

                    {/* Tables Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {mesas.map((mesaId) => {
                            const mesaInvitados = invitados.filter(i => i.mesa === mesaId);
                            const occupancy = mesaInvitados.length;
                            const maxOccupancy = mesaId === "1" ? 4 : 2;

                            return (
                                <motion.div 
                                    key={mesaId}
                                    layout
                                    className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 hover:border-emerald-500/30 transition-all group hover:bg-white/[0.04]"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                                <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-emerald-400" />
                                            </div>
                                            <h3 className="text-xl font-black tracking-tight uppercase">Mesa {mesaId}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-emerald-500/80 tracking-tighter">{occupancy}/{maxOccupancy}</p>
                                            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Occupancy</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {mesaInvitados.map((invitado) => (
                                            <div 
                                                key={invitado.id}
                                                className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-transparent hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full border-2 ${invitado.status === 'cleared' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`} />
                                                    <div>
                                                        <p className={`text-xs font-bold leading-tight ${invitado.isVIP ? 'text-white' : 'text-gray-300'}`}>
                                                            {invitado.nombre}
                                                            {invitado.isVIP && <span className="ml-1 text-[10px] text-emerald-500">★</span>}
                                                        </p>
                                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{invitado.empresa}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-3 h-3 text-gray-600" />
                                            </div>
                                        ))}
                                        
                                        {/* Placeholder for remaining seats */}
                                        {Array.from({ length: maxOccupancy - occupancy }).map((_, i) => (
                                            <div key={i} className="p-3 rounded-2xl border border-dashed border-white/5 flex items-center justify-center">
                                                <p className="text-[8px] font-bold text-gray-700 uppercase tracking-widest italic">Seat Available</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </main>
            </div>

            {/* Background elements for depth */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
