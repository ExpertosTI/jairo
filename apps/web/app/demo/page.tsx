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

// --- Animación de Contadores Orgánicos ---
const CountUp = ({ value, duration = 2 }: { value: number, duration?: number }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = value;
        const totalFrames = duration * 60;
        const increment = end / totalFrames;
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{count.toLocaleString()}</span>;
};

export default function JairoCyberDemo() {
    const [activeModule, setActiveModule] = useState('overview');
    const [loadingStage, setLoadingStage] = useState(0);
    const [selectedEntity, setSelectedEntity] = useState<any>(null);

    // --- Simulación de Inteligencia de Carga ---
    useEffect(() => {
        const timer1 = setTimeout(() => setLoadingStage(1), 400);
        const timer2 = setTimeout(() => setLoadingStage(2), 800);
        const timer3 = setTimeout(() => setLoadingStage(3), 1200);
        return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
    }, []);

    const metrics = [
        { title: "Índice de Sinergia", value: 94, unit: "%", icon: Zap, color: "emerald", trend: "+12%" },
        { title: "RFQs Detectados", value: 128, unit: "", icon: MessageSquare, color: "blue", trend: "Live" },
        { title: "Volumen Proyectado", value: 2.4, unit: "M", icon: TrendingUp, color: "purple", trend: "+18%" },
        { title: "Nodos Activos", value: 70, unit: "", icon: Network, color: "orange", trend: "Optimal" },
    ];

    return (
        <div className="min-h-screen bg-[#04060a] text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex">
            
            {/* --- HUD BACKGROUND ELEMENTS --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.02),transparent_70%)]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent blur-sm" />
            </div>

            {/* --- SIDEBAR: TACTICAL NAV --- */}
            <aside className="w-24 lg:w-72 border-r border-white/[0.03] bg-[#04060a]/80 backdrop-blur-3xl z-50 flex flex-col relative">
                <div className="h-24 flex items-center px-8 gap-4 border-b border-white/[0.03]">
                    <motion.div 
                        animate={{ rotate: [0, 90, 90, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                        <Cpu className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="hidden lg:block">
                        <h1 className="text-xl font-black tracking-tighter leading-none italic">JAIRO OS</h1>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.3em] mt-1">Tactical Interface</p>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-3">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Command Center' },
                        { id: 'map', icon: Globe, label: 'Geo-Strategy' },
                        { id: 'ai', icon: Sparkles, label: 'Insforge AI' },
                        { id: 'data', icon: Database, label: 'Market Data' }
                    ].map((item, i) => (
                        <motion.button
                            key={item.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * i }}
                            onClick={() => setActiveModule(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative overflow-hidden ${activeModule === item.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'text-gray-500 hover:bg-white/[0.02] hover:text-gray-300'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                            {activeModule === item.id && (
                                <motion.div layoutId="nav-active" className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" />
                            )}
                        </motion.button>
                    ))}
                </nav>

                <div className="p-8 border-t border-white/[0.03]">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Live</span>
                    </div>
                </div>
            </aside>

            {/* --- MAIN INTERFACE --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden z-10">
                {/* HUD Header */}
                <header className="h-24 px-12 border-b border-white/[0.03] flex items-center justify-between bg-[#04060a]/50 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-8">
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                                {activeModule === 'overview' ? 'Monitor Central' : 'Módulo de Análisis'}
                            </h2>
                            <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Encaminamiento Activo</p>
                                </div>
                                <div className="w-px h-3 bg-white/10" />
                                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">B2B Core v4.0</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Escanear red empresarial..."
                                className="w-72 bg-white/[0.02] border border-white/5 rounded-full py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/30 transition-all"
                            />
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center relative cursor-pointer hover:bg-white/[0.05] transition-all">
                            <Bell className="w-4 h-4 text-gray-400" />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#04060a]" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Stage */}
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {loadingStage < 3 ? (
                            /* --- INTELLIGENT LOADING SKELETON --- */
                            <div key="loader" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="h-40 rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <motion.div 
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-12"
                            >
                                {/* Metrics Flow */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                                    {metrics.map((m, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                                            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 relative group cursor-default hover:border-emerald-500/30 transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-3 rounded-2xl bg-${m.color}-500/10 border border-${m.color}-500/20`}>
                                                    <m.icon className={`w-5 h-5 text-${m.color}-500`} />
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.03] rounded-full">
                                                    <div className={`w-1 h-1 rounded-full bg-${m.color}-500 animate-pulse`} />
                                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{m.trend}</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">{m.title}</p>
                                            <p className="text-5xl font-black tracking-tighter">
                                                <CountUp value={m.value} duration={1.5} />
                                                <span className={`text-2xl text-${m.color}-500/40 ml-1`}>{m.unit}</span>
                                            </p>
                                            
                                            {/* Micro Sparkline Simulation */}
                                            <div className="mt-6 h-1 w-full bg-white/[0.02] rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "70%" }}
                                                    transition={{ duration: 2, delay: 0.5 }}
                                                    className={`h-full bg-${m.color}-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]`}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    {/* Main Tactical Feed */}
                                    <div className="xl:col-span-2 p-10 rounded-[3.5rem] bg-[#080c14]/80 border border-white/[0.03] shadow-2xl relative overflow-hidden group">
                                        <div className="flex items-center justify-between mb-10">
                                            <div>
                                                <h3 className="text-2xl font-black uppercase tracking-tight italic">Radar de Sinergias IA</h3>
                                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.4em] mt-1">Escaneo Semántico Activo</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center cursor-pointer hover:bg-emerald-500/10 transition-all">
                                                    <BarChart3 className="w-4 h-4 text-gray-500" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { company: "Global Logistics", industry: "Supply Chain", score: 98, status: "High Sinergy" },
                                                { company: "TechNova SaaS", industry: "Fintech", score: 92, status: "Strategic Match" },
                                                { company: "EcoGreen Energy", industry: "Renewables", score: 85, status: "Growth Potential" },
                                                { company: "Prime Builders", industry: "Infrastructure", score: 78, status: "Standard" },
                                            ].map((item, i) => (
                                                <motion.div 
                                                    key={i}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 1.5 + (i * 0.1) }}
                                                    className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-emerald-500/[0.03] hover:border-emerald-500/30 transition-all flex items-center justify-between cursor-pointer group/item"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-2xl font-black text-gray-800 group-hover/item:text-emerald-500/40 transition-colors">0{i+1}</div>
                                                        <div>
                                                            <p className="text-lg font-black tracking-tight leading-none mb-1">{item.company}</p>
                                                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{item.industry}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-8">
                                                        <div className="hidden md:block px-4 py-1.5 rounded-full border border-white/5 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                                            {item.status}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-black text-emerald-500 leading-none">{item.score}%</p>
                                                            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">Sinergia</p>
                                                        </div>
                                                        <ChevronRight className="w-5 h-5 text-gray-700 group-hover/item:text-emerald-500 group-hover/item:translate-x-1 transition-all" />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Bottom HUD info */}
                                        <div className="mt-10 pt-8 border-t border-white/[0.03] flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-2">
                                                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#080c14] bg-gray-800" />)}
                                                </div>
                                                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">+12 conexiones recomendadas</p>
                                            </div>
                                            <button className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:gap-4 transition-all">
                                                Ver Análisis Completo <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Sidebar Intelligence */}
                                    <div className="space-y-8">
                                        <div className="p-10 rounded-[3.5rem] bg-emerald-500/10 border border-emerald-500/20 relative overflow-hidden">
                                            <Sparkles className="w-12 h-12 text-emerald-500/20 absolute top-[-10px] right-[-10px] rotate-12" />
                                            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Insforge Insight</h3>
                                            <p className="text-sm font-bold text-gray-400 leading-relaxed italic border-l-2 border-emerald-500/30 pl-4">
                                                "Se ha detectado una anomalía positiva en el flujo de RFQs de construcción. Sinergia recomendada con proveedores de Zona 2."
                                            </p>
                                            <div className="mt-8 flex items-center justify-between">
                                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Optimización Activa</span>
                                                <Fingerprint className="w-6 h-6 text-emerald-500/30" />
                                            </div>
                                        </div>

                                        <div className="p-10 rounded-[3.5rem] bg-white/[0.02] border border-white/5">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="text-lg font-black uppercase tracking-tight">Geo-Flujo</h3>
                                                <Globe className="w-5 h-5 text-gray-700" />
                                            </div>
                                            <div className="h-40 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-16 h-1 bg-emerald-500/10 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            animate={{ x: ["-100%", "100%"] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="w-1/2 h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                                        />
                                                    </div>
                                                    <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Mapping Nodos...</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <style jsx global>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.3); }
            `}</style>
        </div>
    );
}
