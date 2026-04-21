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
    const [liveMetrics, setLiveMetrics] = useState({
        sinergia: 94.2,
        rfqs: 128,
        volumen: 2.45,
        nodos: 70
    });
    const [aiInsight, setAiInsight] = useState("Analizando flujos de capital en sector logístico...");
    const [attendanceStats, setAttendanceStats] = useState({ cleared: 0, target: 103 });

    // --- Simulación de Inteligencia de Carga y Telemetría Viva ---
    useEffect(() => {
        const timer1 = setTimeout(() => setLoadingStage(1), 300);
        const timer2 = setTimeout(() => setLoadingStage(2), 600);
        const timer3 = setTimeout(() => setLoadingStage(3), 900);

        // Intervalo de Telemetría (Fluctuación Orgánica)
        const metricsInterval = setInterval(() => {
            setLiveMetrics(prev => ({
                sinergia: Math.min(100, Math.max(90, prev.sinergia + (Math.random() * 0.4 - 0.2))),
                rfqs: prev.rfqs + (Math.random() > 0.7 ? 1 : 0),
                volumen: prev.volumen + (Math.random() * 0.01),
                nodos: 70
            }));
        }, 3000);

        // Intervalo de Insights de IA
        const insights = [
            "Se ha detectado una anomalía positiva en el flujo de RFQs de construcción.",
            "Sinergia recomendada con proveedores de Zona 2 (Logística Pesada).",
            "Nivel de saturación B2B óptimo. 12 nuevas conexiones detectadas.",
            "Alerta: Demanda incrementada en sector SaaS/Fintech para el Q3.",
            "Análisis completado: Global Logistics muestra 98% de compatibilidad."
        ];
        let insightIdx = 0;
        const insightInterval = setInterval(() => {
            insightIdx = (insightIdx + 1) % insights.length;
            setAiInsight(insights[insightIdx]);
        }, 8000);

        // Cargar datos reales de asistencia
        const fetchRealStats = async () => {
            try {
                const apiUrl = 'https://jairoapp.renace.tech/api';
                const res = await fetch(`${apiUrl}/events/evt_circulo_001/attendance`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setAttendanceStats({ cleared: data.length, target: 103 });
                }
            } catch (e) { console.error(e); }
        };
        fetchRealStats();

        return () => { 
            clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); 
            clearInterval(metricsInterval); clearInterval(insightInterval);
        };
    }, []);

    const metrics = [
        { title: "Índice de Sinergia", value: liveMetrics.sinergia.toFixed(1), unit: "%", icon: Zap, color: "emerald", trend: "+12%" },
        { title: "RFQs Detectados", value: liveMetrics.rfqs, unit: "", icon: MessageSquare, color: "blue", trend: "Live" },
        { title: "Volumen Proyectado", value: liveMetrics.volumen.toFixed(2), unit: "M", icon: TrendingUp, color: "purple", trend: "+18%" },
        { title: "Nodos Activos", value: liveMetrics.nodos, unit: "", icon: Network, color: "orange", trend: "Optimal" },
    ];

    return (
        <div className="min-h-screen bg-[#020408] text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex">
            
            {/* --- HUD BACKGROUND ELEMENTS --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.05),transparent_70%)]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent blur-sm" />
            </div>

            {/* --- SIDEBAR: TACTICAL NAV --- */}
            <aside className="w-24 lg:w-80 border-r border-white/[0.05] bg-[#020408]/90 backdrop-blur-3xl z-50 flex flex-col relative">
                <div className="h-28 flex items-center px-10 gap-5 border-b border-white/[0.05]">
                    <motion.div 
                        animate={{ rotate: [0, 90, 90, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)] border border-emerald-400/30"
                    >
                        <Cpu className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="hidden lg:block">
                        <h1 className="text-2xl font-black tracking-tighter leading-none italic bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">JAIRO OS</h1>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mt-1.5">Tactical Interface</p>
                    </div>
                </div>

                <nav className="flex-1 p-8 space-y-4">
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
                            className={`w-full flex items-center gap-5 px-5 py-5 rounded-[2rem] transition-all group relative overflow-hidden ${activeModule === item.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-2xl' : 'text-gray-500 hover:bg-white/[0.02] hover:text-gray-300'}`}
                        >
                            <item.icon className={`w-6 h-6 ${activeModule === item.id ? 'text-emerald-400' : 'text-gray-600'}`} />
                            <span className="hidden lg:block text-[11px] font-black uppercase tracking-[0.25em]">{item.label}</span>
                            {activeModule === item.id && (
                                <motion.div layoutId="nav-active" className="absolute left-0 w-1.5 h-8 bg-emerald-500 rounded-r-full shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                            )}
                        </motion.button>
                    ))}
                </nav>

                <div className="p-10 border-t border-white/[0.05]">
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Quantum Engine Live</span>
                    </div>
                </div>
            </aside>

            {/* --- MAIN INTERFACE --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden z-10">
                {/* HUD Header */}
                <header className="h-28 px-16 border-b border-white/[0.05] flex items-center justify-between bg-[#020408]/60 backdrop-blur-3xl shrink-0">
                    <div className="flex items-center gap-10">
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">
                                {activeModule === 'overview' ? 'Monitor Central' : 
                                 activeModule === 'map' ? 'Mapeo Geográfico' :
                                 activeModule === 'ai' ? 'Insforge Neural Core' : 'Bolsa de Datos B2B'}
                            </h2>
                            <div className="flex items-center gap-5 mt-2">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Encaminamiento Activo</p>
                                </div>
                                <div className="w-[1px] h-4 bg-white/10" />
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">B2B Core v4.2.0-stable</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="relative group hidden xl:block">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-600 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="ESCANEAR RED EMPRESARIAL..."
                                className="w-96 bg-white/[0.03] border border-white/10 rounded-full py-4 pl-14 pr-6 text-[11px] font-black uppercase tracking-[0.2em] text-white placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                            />
                        </div>
                        <div className="w-12 h-12 rounded-[1.2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center relative cursor-pointer hover:bg-white/[0.06] transition-all">
                            <Bell className="w-5 h-5 text-gray-500" />
                            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-orange-500 rounded-full border-[3px] border-[#020408]" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Stage */}
                <div className="flex-1 overflow-y-auto p-16 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {loadingStage < 3 ? (
                            <div key="loader" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="h-44 rounded-[3rem] bg-white/[0.02] border border-white/10 animate-pulse overflow-hidden relative" />
                                ))}
                            </div>
                        ) : (
                            <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                                
                                {/* Metrics Flow */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
                                    {metrics.map((m, i) => (
                                        <div key={i} className="p-10 rounded-[3.5rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.05] relative group shadow-2xl hover:border-emerald-500/30 transition-all overflow-hidden">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-${m.color}-500/30 transition-all`}>
                                                    <m.icon className={`w-6 h-6 text-${m.color}-500`} />
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full border border-white/5">
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-${m.color}-500 animate-pulse`} />
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{m.trend}</span>
                                                </div>
                                            </div>
                                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] leading-none mb-2">{m.title}</p>
                                            <p className="text-6xl font-black tracking-tighter flex items-end">
                                                {m.value}
                                                <span className={`text-2xl text-${m.color}-500/30 ml-2 mb-1.5 font-bold`}>{m.unit}</span>
                                            </p>
                                            
                                            <div className="mt-8 h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(parseFloat(m.value) / (m.unit === 'M' ? 5 : 1.5)) * 100}%` }}
                                                    className={`h-full bg-${m.color}-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                                    {/* Main Tactical Feed */}
                                    <div className="xl:col-span-2 p-14 rounded-[4.5rem] bg-[#05080f]/90 border border-white/[0.05] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-12">
                                            <div>
                                                <h3 className="text-3xl font-black uppercase tracking-tight italic text-white">Radar de Sinergias IA</h3>
                                                <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.5em] mt-2">Escaneo Semántico Activo</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center cursor-pointer hover:bg-emerald-500/10 transition-all">
                                                    <BarChart3 className="w-5 h-5 text-gray-500" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {activeModule === 'overview' ? (
                                                [
                                                    { company: "Global Logistics", industry: "Supply Chain", score: 98, status: "High Sinergy" },
                                                    { company: "TechNova SaaS", industry: "Fintech", score: 92, status: "Strategic Match" },
                                                    { company: "EcoGreen Energy", industry: "Renewables", score: 85, status: "Growth Potential" },
                                                    { company: "Prime Builders", industry: "Infrastructure", score: 78, status: "Standard" },
                                                ].map((item, i) => (
                                                    <motion.div 
                                                        key={i} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1 + (i * 0.15) }}
                                                        className="p-7 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-emerald-500/[0.04] hover:border-emerald-500/40 transition-all flex items-center justify-between cursor-pointer group/item"
                                                    >
                                                        <div className="flex items-center gap-8">
                                                            <div className="text-3xl font-black text-gray-900 group-hover/item:text-emerald-500/20 transition-colors">0{i+1}</div>
                                                            <div>
                                                                <p className="text-2xl font-black tracking-tighter leading-none mb-1.5 uppercase group-hover/item:text-emerald-400 transition-colors">{item.company}</p>
                                                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">{item.industry}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-12">
                                                            <div className="hidden md:block px-5 py-2 rounded-full border border-white/10 text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover/item:border-emerald-500/30 group-hover/item:text-emerald-500 transition-all">
                                                                {item.status}
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-3xl font-black text-emerald-500 leading-none">{item.score}%</p>
                                                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1.5">Sinergia</p>
                                                            </div>
                                                            <ChevronRight className="w-6 h-6 text-gray-800 group-hover/item:text-emerald-500 group-hover/item:translate-x-2 transition-all" />
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="h-96 flex items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                                    <div className="text-center">
                                                        <Cpu className="w-16 h-16 text-gray-800 mx-auto mb-6 animate-pulse" />
                                                        <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em]">Inicializando Módulo {activeModule.toUpperCase()}...</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-14 pt-10 border-t border-white/[0.05] flex justify-between items-center">
                                            <div className="flex items-center gap-6">
                                                <div className="flex -space-x-3">
                                                    {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-[#05080f] bg-gradient-to-br from-gray-700 to-gray-900" />)}
                                                </div>
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Recepción Activa: <span className="text-emerald-500">{attendanceStats.cleared}</span> / {attendanceStats.target} Invitados</p>
                                            </div>
                                            <button className="flex items-center gap-3 text-[11px] font-black text-emerald-500 uppercase tracking-widest hover:gap-6 transition-all group">
                                                Escanear Sinergias <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Sidebar Intelligence */}
                                    <div className="space-y-12">
                                        <div className="p-12 rounded-[4rem] bg-emerald-500/[0.07] border border-emerald-500/20 relative overflow-hidden shadow-2xl">
                                            <Sparkles className="w-16 h-16 text-emerald-500/10 absolute top-[-15px] right-[-15px] rotate-12" />
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-emerald-500" />
                                                </div>
                                                <h3 className="text-2xl font-black uppercase tracking-tight italic">Insforge Insight</h3>
                                            </div>
                                            <p className="text-lg font-bold text-gray-300 leading-relaxed italic border-l-4 border-emerald-500/40 pl-6 py-2">
                                                "{aiInsight}"
                                            </p>
                                            <div className="mt-10 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Optimización Activa</span>
                                                </div>
                                                <Fingerprint className="w-8 h-8 text-emerald-500/20" />
                                            </div>
                                        </div>

                                        <div className="p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 shadow-2xl">
                                            <div className="flex items-center justify-between mb-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                                                        <Globe className="w-5 h-5 text-gray-500" />
                                                    </div>
                                                    <h3 className="text-xl font-black uppercase tracking-tight">Geo-Flujo</h3>
                                                </div>
                                                <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live</div>
                                            </div>
                                            <div className="h-48 bg-black/50 rounded-[2.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden group">
                                                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(16,185,129,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.2)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                                
                                                <div className="flex flex-col items-center gap-4 z-10">
                                                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            animate={{ x: ["-100%", "100%"] }}
                                                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                                            className="w-1/2 h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                                                        />
                                                    </div>
                                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] group-hover:text-emerald-500 transition-colors">Scanning Node Registry...</p>
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
                @keyframes shimmer { 100% { transform: translateX(100%); } }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.1); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            `}</style>
        </div>
    );
}

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
