"use client";

import { useState, useEffect } from "react";
import { 
    LayoutDashboard, Users, TrendingUp, Activity, 
    Zap, ShieldCheck, Clock, ArrowUpRight,
    Briefcase, MessageSquare, BarChart3, PieChart,
    ChevronRight, Globe, Layers, Search, Bell, X,
    Sparkles, ArrowRight, Fingerprint, Database,
    Cpu, Network, Map as MapIcon, Filter, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function JairoCyberDemo() {
    const [activeModule, setActiveModule] = useState('overview');
    const [loadingStage, setLoadingStage] = useState(0);
    const [selectedEntity, setSelectedEntity] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [guests, setGuests] = useState<any[]>([]);
    
    const [liveMetrics, setLiveMetrics] = useState({
        sinergia: 94.2,
        rfqs: 128,
        volumen: 2.45,
        nodos: 70
    });
    
    const [aiInsight, setAiInsight] = useState("Analizando flujos de capital en sector logístico...");
    const [attendanceStats, setAttendanceStats] = useState({ cleared: 0, target: 103 });

    // --- Carga Inicial y Telemetría ---
    useEffect(() => {
        const timer = setTimeout(() => setLoadingStage(3), 1000);
        
        const fetchData = async () => {
            try {
                const apiUrl = 'https://jairoapp.renace.tech/api';
                const res = await fetch(`${apiUrl}/events/evt_circulo_001/guests`);
                const data = await res.json();
                if (Array.isArray(data)) setGuests(data);
                
                const attRes = await fetch(`${apiUrl}/events/evt_circulo_001/attendance`);
                const attData = await attRes.json();
                if (Array.isArray(attData)) setAttendanceStats({ cleared: attData.length, target: 103 });
            } catch (e) { console.error(e); }
        };
        fetchData();

        const metricsInterval = setInterval(() => {
            setLiveMetrics(prev => ({
                sinergia: Math.min(100, Math.max(90, prev.sinergia + (Math.random() * 0.4 - 0.2))),
                rfqs: prev.rfqs + (Math.random() > 0.8 ? 1 : 0),
                volumen: prev.volumen + (Math.random() * 0.01),
                nodos: 70
            }));
        }, 3000);

        return () => { clearTimeout(timer); clearInterval(metricsInterval); };
    }, []);

    const metrics = [
        { id: 'sin', title: "Índice de Sinergia", value: liveMetrics.sinergia.toFixed(1), unit: "%", icon: Zap, color: "emerald" },
        { id: 'rfq', title: "RFQs Activos", value: liveMetrics.rfqs, unit: "", icon: MessageSquare, color: "blue" },
        { id: 'vol', title: "Volumen B2B", value: liveMetrics.volumen.toFixed(2), unit: "M", icon: TrendingUp, color: "purple" },
        { id: 'nod', title: "Nodos Red", value: liveMetrics.nodos, unit: "", icon: Network, color: "orange" },
    ];

    // --- SUB-COMPONENTES DE VISTA ---

    const Overview = () => (
        <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
                {metrics.map((m, i) => (
                    <motion.div 
                        key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                        className="p-10 rounded-[3.5rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.05] relative group cursor-pointer hover:border-emerald-500/30 transition-all"
                    >
                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-emerald-500/30 transition-all w-fit mb-6`}>
                            <m.icon className="w-6 h-6 text-emerald-500" />
                        </div>
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">{m.title}</p>
                        <p className="text-6xl font-black tracking-tighter">{m.value}<span className="text-2xl text-white/20 ml-2 font-bold">{m.unit}</span></p>
                        <div className="mt-8 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div animate={{ width: '70%' }} className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2 p-14 rounded-[4.5rem] bg-[#05080f]/90 border border-white/[0.05] shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-3xl font-black uppercase italic">Radar de Sinergias</h3>
                            <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.5em] mt-2">Detección de Oportunidades B2B</p>
                        </div>
                        <BarChart3 className="text-gray-700 w-8 h-8" />
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "Global Logistics", score: 98, rfq: "12", trend: "+12%" },
                            { name: "TechNova SaaS", score: 92, rfq: "08", trend: "+5%" },
                            { name: "EcoGreen Energy", score: 85, rfq: "04", trend: "-2%" }
                        ].map((item, i) => (
                            <div key={i} className="p-7 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] flex items-center justify-between hover:bg-emerald-500/[0.05] transition-all cursor-pointer group">
                                <div className="flex items-center gap-6">
                                    <div className="text-2xl font-black text-gray-800">0{i+1}</div>
                                    <div>
                                        <p className="text-2xl font-black uppercase group-hover:text-emerald-400 transition-colors">{item.name}</p>
                                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{item.rfq} RFQs DISPONIBLES</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-emerald-500">{item.score}%</p>
                                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Match</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-12 rounded-[4rem] bg-emerald-500/[0.07] border border-emerald-500/20 relative overflow-hidden">
                    <Sparkles className="w-16 h-16 text-emerald-500/10 absolute -top-4 -right-4" />
                    <h3 className="text-2xl font-black uppercase italic mb-8">AI Strategy</h3>
                    <p className="text-lg font-bold text-gray-300 leading-relaxed italic border-l-4 border-emerald-500/40 pl-6">
                        "Se recomienda priorizar la integración con Global Logistics. El volumen proyectado para el Q4 supera en un 15% la media del sector."
                    </p>
                    <div className="mt-12 space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <span>Confianza IA</span>
                            <span className="text-emerald-500">99.2%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[99%]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const GeoStrategy = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-10">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 flex-1">
                <div className="xl:col-span-3 rounded-[4.5rem] bg-[#05080f] border border-white/[0.05] relative overflow-hidden p-12">
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-10">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter">Mapeo de Nodos Regionales</h3>
                            <div className="flex gap-4">
                                <span className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500">ZONA A: ACTIVA</span>
                                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-gray-500">FILTRAR NODOS</span>
                            </div>
                        </div>
                        
                        <div className="flex-1 relative flex items-center justify-center">
                            {/* Representación Visual de Nodos */}
                            <div className="relative w-full h-full max-w-4xl max-h-[500px]">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div 
                                        key={i}
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 3 + i, repeat: Infinity }}
                                        className="absolute w-4 h-4 bg-emerald-500 rounded-full blur-sm"
                                        style={{ 
                                            left: `${Math.random() * 80 + 10}%`, 
                                            top: `${Math.random() * 80 + 10}%` 
                                        }}
                                    />
                                ))}
                                <svg className="absolute inset-0 w-full h-full opacity-10">
                                    <path d="M100,100 L300,200 L500,150 L700,400" stroke="white" strokeWidth="1" fill="none" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Globe className="w-96 h-96 text-white/[0.02]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="p-10 rounded-[3.5rem] bg-white/[0.02] border border-white/10">
                        <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mb-6">Estado de Red</h4>
                        <div className="space-y-6">
                            {[
                                { label: "Latencia B2B", value: "12ms", status: "Optimal" },
                                { label: "Saturación", value: "42%", status: "Stable" },
                                { label: "Nodos Activos", value: "70/70", status: "100%" }
                            ].map((s, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-[10px] font-black text-gray-500 uppercase">{s.label}</span>
                                    <span className="text-sm font-black">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-10 rounded-[3.5rem] bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                        <Info className="text-blue-500 w-8 h-8 mb-6" />
                        <p className="text-sm font-bold text-blue-200">Nueva expansión detectada en Zona Norte. 5 nuevos nodos RFQ disponibles para integración.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const MarketData = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 p-14 rounded-[4.5rem] bg-[#05080f] border border-white/[0.05] relative overflow-hidden">
                    <div className="flex justify-between items-center mb-16">
                        <h3 className="text-3xl font-black uppercase italic">Flujo de Capital B2B</h3>
                        <div className="flex gap-2">
                            <div className="px-4 py-2 rounded-xl bg-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest">REAL TIME</div>
                        </div>
                    </div>
                    
                    <div className="h-80 flex items-end gap-4 px-4">
                        {[40, 70, 45, 90, 65, 80, 50, 100, 85, 95, 110, 120].map((h, i) => (
                            <motion.div 
                                key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.05 }}
                                className="flex-1 bg-gradient-to-t from-emerald-600/20 to-emerald-500 rounded-t-xl relative group"
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black">
                                    ${h}M
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-8 text-[9px] font-black text-gray-700 uppercase tracking-[0.4em]">
                        <span>ENE</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>DIC</span>
                    </div>
                </div>

                <div className="p-12 rounded-[4rem] bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic mb-10">Bolsa RFQ</h3>
                        <div className="space-y-8">
                            {[
                                { sector: "Construcción", vol: "1.2M", trend: "up" },
                                { sector: "Tecnología", vol: "0.8M", trend: "up" },
                                { sector: "Logística", vol: "2.1M", trend: "down" },
                                { sector: "Servicios", vol: "0.5M", trend: "up" }
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${s.trend === 'up' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                        <span className="text-sm font-black uppercase">{s.sector}</span>
                                    </div>
                                    <span className="text-sm font-black text-gray-500">${s.vol}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="w-full py-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 text-[11px] font-black uppercase tracking-widest transition-all">Ver Reporte Completo</button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#020408] text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex">
            
            {/* Background HUD */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_10%,rgba(16,185,129,0.06),transparent_60%)]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] mix-blend-overlay" />
            </div>

            {/* Sidebar Tactical */}
            <aside className="w-24 lg:w-80 border-r border-white/[0.05] bg-[#020408]/95 backdrop-blur-3xl z-50 flex flex-col relative">
                <div className="h-28 flex items-center px-10 gap-5 border-b border-white/[0.05]">
                    <motion.div animate={{ rotate: [0, 90, 90, 0] }} transition={{ duration: 6, repeat: Infinity }} className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] border border-emerald-400/30">
                        <Cpu className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="hidden lg:block">
                        <h1 className="text-2xl font-black tracking-tighter italic">JAIRO OS</h1>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Strategic Engine</p>
                    </div>
                </div>

                <nav className="flex-1 p-8 space-y-4">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Command Center' },
                        { id: 'map', icon: MapIcon, label: 'Geo-Strategy' },
                        { id: 'data', icon: Database, label: 'Market Data' }
                    ].map((item) => (
                        <button 
                            key={item.id} 
                            onClick={() => setActiveModule(item.id)} 
                            className={`w-full flex items-center gap-5 px-5 py-5 rounded-[2rem] transition-all relative ${activeModule === item.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-2xl' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <item.icon className={`w-6 h-6 ${activeModule === item.id ? 'text-emerald-400' : 'text-gray-600'}`} />
                            <span className="hidden lg:block text-[11px] font-black uppercase tracking-[0.25em]">{item.label}</span>
                            {activeModule === item.id && <motion.div layoutId="nav-active" className="absolute left-0 w-1.5 h-8 bg-emerald-500 rounded-r-full shadow-[0_0_15px_rgba(16,185,129,0.8)]" />}
                        </button>
                    ))}
                </nav>

                <div className="p-10 border-t border-white/[0.05]">
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Core Live</span>
                    </div>
                </div>
            </aside>

            {/* Main Stage */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden z-10">
                <header className="h-28 px-16 border-b border-white/[0.05] flex items-center justify-between bg-[#020408]/80 backdrop-blur-3xl shrink-0">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">
                            {activeModule === 'overview' ? 'Monitor Central' : 
                             activeModule === 'map' ? 'Mapeo Estratégico' : 'Análisis B2B'}
                        </h2>
                        <div className="flex items-center gap-5 mt-2">
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">B2B Core v4.5-Stable</p>
                            <div className="w-[1px] h-3 bg-white/10" />
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Invitados: {attendanceStats.cleared} / {attendanceStats.target}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="relative group hidden xl:block">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-600 group-focus-within:text-emerald-500 transition-colors" />
                            <input type="text" placeholder="ESCANEAR RED B2B..." className="w-96 bg-white/[0.03] border border-white/10 rounded-full py-4 pl-14 pr-6 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:border-emerald-500/50 transition-all shadow-inner" />
                        </div>
                        <div className="w-12 h-12 rounded-[1.2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center relative cursor-pointer hover:bg-white/[0.06] transition-all">
                            <Bell className="w-5 h-5 text-gray-500" />
                            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-emerald-500 rounded-full border-[3px] border-[#020408]" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-16 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeModule === 'overview' ? <Overview key="overview" /> :
                         activeModule === 'map' ? <GeoStrategy key="map" /> :
                         <MarketData key="data" />}
                    </AnimatePresence>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.1); border-radius: 20px; }
            `}</style>
        </div>
    );
}
