"use client";

import { useState, useEffect, useRef } from "react";
import {
    LayoutDashboard, Users, TrendingUp, Activity, Zap, ShieldCheck,
    MessageSquare, BarChart3, ChevronRight, Globe, Search, Bell,
    Sparkles, Network, Filter, Building2, Link as LinkIcon,
    ArrowUpRight, CheckCircle2, Clock, Package, FileText,
    Star, Send, Inbox, Settings, LogOut, Plus, Eye, Hash,
    Layers, RefreshCw, Database, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── STATIC DEMO DATA ────────────────────────────────────────────────────────
const DEMO_COMPANIES = [
    { id: 1, name: "Global Logistics RD", sector: "Logística", match: 98, rfqs: 12, status: "active", country: "DO" },
    { id: 2, name: "TechNova SaaS", sector: "Tecnología", match: 92, rfqs: 8, status: "active", country: "DO" },
    { id: 3, name: "EcoGreen Energy", sector: "Energía", match: 85, rfqs: 4, status: "active", country: "US" },
    { id: 4, name: "MedSupply Corp", sector: "Salud", match: 79, rfqs: 6, status: "pending", country: "DO" },
    { id: 5, name: "Construmax SA", sector: "Construcción", match: 74, rfqs: 3, status: "active", country: "MX" },
    { id: 6, name: "FinTech Capital", sector: "Finanzas", match: 68, rfqs: 9, status: "active", country: "DO" },
];

const DEMO_MESSAGES = [
    { id: 1, from: "Global Logistics RD", avatar: "GL", msg: "Interesados en tu propuesta de distribución norte. ¿Podemos agendar una llamada esta semana?", time: "2m", unread: true },
    { id: 2, from: "TechNova SaaS", avatar: "TN", msg: "Adjuntamos el RFQ #128 para revisión. El volumen proyectado es de $2.4M en Q4.", time: "18m", unread: true },
    { id: 3, from: "EcoGreen Energy", avatar: "EG", msg: "Gracias por la reunión. Enviamos el contrato marco para tu revisión.", time: "1h", unread: false },
    { id: 4, from: "FinTech Capital", avatar: "FC", msg: "¿Tienes capacidad para manejar la línea de crédito Q1? Necesitamos confirmar antes del viernes.", time: "3h", unread: false },
];

const DEMO_RFQS = [
    { id: "RFQ-128", company: "TechNova SaaS", product: "Servicio Cloud Enterprise", value: "$2.4M", deadline: "15 May", status: "reviewing" },
    { id: "RFQ-127", company: "Global Logistics", product: "Flota de Transporte Q2", value: "$890K", deadline: "20 May", status: "pending" },
    { id: "RFQ-126", company: "MedSupply Corp", product: "Insumos Hospitalarios", value: "$340K", deadline: "28 May", status: "approved" },
    { id: "RFQ-125", company: "Construmax SA", product: "Materiales Fase III", value: "$1.2M", deadline: "30 May", status: "closed" },
];

const DEMO_CONNECTIONS = [
    { a: "JairoApp Inc", b: "Global Logistics RD", type: "socio", since: "Ene 2026", active: true },
    { a: "JairoApp Inc", b: "TechNova SaaS", type: "cliente", since: "Feb 2026", active: true },
    { a: "JairoApp Inc", b: "FinTech Capital", type: "proveedor", since: "Mar 2026", active: false },
];

const TIPO_COLORS: Record<string, string> = {
    socio: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    cliente: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    proveedor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    distribuidor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const STATUS_RFQ: Record<string, { label: string; cls: string }> = {
    reviewing: { label: "En revisión", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    pending: { label: "Pendiente", cls: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
    approved: { label: "Aprobado", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    closed: { label: "Cerrado", cls: "text-zinc-600 bg-zinc-800/50 border-zinc-700/20" },
};

// ─── SUB-VIEWS ────────────────────────────────────────────────────────────────
function Dashboard({ metrics }: { metrics: any }) {
    return (
        <div className="space-y-5">
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { label: "Índice de Sinergia", value: `${metrics.sinergia.toFixed(1)}%`, sub: "+0.4% este mes", icon: Zap, up: true },
                    { label: "RFQs Activos", value: String(metrics.rfqs), sub: "3 por vencer esta semana", icon: FileText, up: true },
                    { label: "Volumen B2B", value: `$${metrics.volumen.toFixed(2)}M`, sub: "Proyección Q4", icon: TrendingUp, up: true },
                    { label: "Nodos de Red", value: String(metrics.nodos), sub: "En toda la región", icon: Network, up: false },
                ].map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:border-emerald-500/20 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{m.label}</span>
                            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:border-emerald-500/20 transition-all">
                                <m.icon className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                        </div>
                        <p className="text-2xl font-black tracking-tight">{m.value}</p>
                        <p className="text-[10px] text-zinc-600 mt-1">{m.sub}</p>
                        <div className="mt-3 h-0.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500/60 rounded-full" style={{ width: `${60 + i * 10}%` }} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Radar sinergias */}
                <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-tight">Radar de Sinergias</h3>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-0.5">Detección de oportunidades B2B</p>
                        </div>
                        <BarChart3 className="w-4 h-4 text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                        {DEMO_COMPANIES.slice(0, 4).map((c, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-emerald-500/[0.04] hover:border-emerald-500/15 transition-all group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black text-zinc-700 w-5 tabular-nums">0{i + 1}</span>
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
                                        <span className="text-[8px] font-black text-white">{c.name.slice(0, 2).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold group-hover:text-emerald-300 transition-colors">{c.name}</p>
                                        <p className="text-[9px] text-zinc-600">{c.rfqs} RFQs disponibles</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-emerald-400">{c.match}%</p>
                                    <p className="text-[9px] text-zinc-700 uppercase tracking-wider">match</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Strategy */}
                <div className="flex flex-col gap-3">
                    <div className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-2xl p-5 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">AI Strategy</span>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-emerald-500/30 pl-3 italic">
                            "Priorizar integración con Global Logistics. Volumen Q4 proyectado supera en 15% la media del sector."
                        </p>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-zinc-600 uppercase">
                                <span>Confianza IA</span>
                                <span className="text-emerald-400">99.2%</span>
                            </div>
                            <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99%' }} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-wider mb-3">Actividad Reciente</h4>
                        <div className="space-y-2.5">
                            {[
                                { text: "Nueva conexión con TechNova", time: "2m", dot: "emerald" },
                                { text: "RFQ #128 recibido", time: "18m", dot: "blue" },
                                { text: "Contrato EcoGreen firmado", time: "1h", dot: "violet" },
                            ].map((a, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.dot === 'emerald' ? 'bg-emerald-500' : a.dot === 'blue' ? 'bg-blue-500' : 'bg-violet-500'}`} />
                                    <p className="text-[11px] text-zinc-400 flex-1 truncate">{a.text}</p>
                                    <span className="text-[10px] text-zinc-700 shrink-0">{a.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Directorio({ search }: { search: string }) {
    const filtered = DEMO_COMPANIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.sector.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">{filtered.length} empresas · Ordenadas por match</p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-lg text-[10px] font-bold text-zinc-500 hover:text-zinc-300 transition-all">
                    <Filter className="w-3 h-3" /> Filtrar
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filtered.map((c, i) => (
                    <motion.div
                        key={c.id}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:border-emerald-500/20 transition-all group cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/[0.07] flex items-center justify-center">
                                    <span className="text-xs font-black text-white">{c.name.slice(0, 2)}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold group-hover:text-emerald-300 transition-colors leading-tight">{c.name}</p>
                                    <p className="text-[10px] text-zinc-600">{c.sector} · {c.country}</p>
                                </div>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-1 rounded-full border ${c.status === 'active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-zinc-500 bg-zinc-800/50 border-zinc-700'}`}>
                                {c.status === 'active' ? 'Activa' : 'Pendiente'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1">
                                <span className="text-zinc-600">Match</span>
                                <span className="font-black text-emerald-400">{c.match}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FileText className="w-3 h-3 text-zinc-600" />
                                <span className="text-zinc-500">{c.rfqs} RFQs</span>
                            </div>
                        </div>
                        <div className="mt-2.5 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500/70 rounded-full transition-all" style={{ width: `${c.match}%` }} />
                        </div>
                        <button className="mt-3 w-full py-2 bg-white/[0.03] hover:bg-emerald-500/[0.08] border border-white/[0.06] hover:border-emerald-500/20 rounded-xl text-[10px] font-black text-zinc-600 hover:text-emerald-400 transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider">
                            <Eye className="w-3 h-3" /> Ver Perfil
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function RedB2B() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 mb-1">
                {[
                    { label: "Conexiones activas", value: "2", cls: "text-emerald-400" },
                    { label: "Pendientes", value: "1", cls: "text-amber-400" },
                    { label: "Total en red", value: "3", cls: "text-zinc-300" },
                ].map((s, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 text-center">
                        <p className={`text-2xl font-black ${s.cls}`}>{s.value}</p>
                        <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                {DEMO_CONNECTIONS.map((c, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4 hover:border-white/[0.1] transition-all">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center shrink-0 border border-white/[0.07]">
                            <span className="text-xs font-black text-white">{c.b.slice(0, 2)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{c.b}</p>
                            <p className="text-[10px] text-zinc-600">Desde {c.since}</p>
                        </div>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border capitalize ${TIPO_COLORS[c.type]}`}>{c.type}</span>
                        <div className={`w-2 h-2 rounded-full shrink-0 ${c.active ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]' : 'bg-zinc-700'}`} />
                    </div>
                ))}
            </div>

            <div className="bg-violet-500/[0.04] border border-violet-500/15 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                    <p className="text-sm font-bold text-violet-300">Solicitar nueva conexión</p>
                    <p className="text-[10px] text-zinc-600">Conecta con empresas de la red B2B JairoApp</p>
                </div>
                <button className="ml-auto px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-[11px] font-black text-white uppercase tracking-wider transition-all shrink-0">
                    Vincular
                </button>
            </div>
        </div>
    );
}

function RFQs() {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">{DEMO_RFQS.length} solicitudes activas</p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-[10px] font-black text-white uppercase tracking-wider transition-all">
                    <Plus className="w-3 h-3" /> Nueva RFQ
                </button>
            </div>
            <div className="space-y-2">
                {DEMO_RFQS.map((r, i) => (
                    <motion.div
                        key={r.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4 hover:border-white/[0.1] transition-all group cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                            <Hash className="w-4 h-4 text-zinc-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-zinc-600">{r.id}</span>
                            </div>
                            <p className="text-sm font-bold group-hover:text-emerald-300 transition-colors truncate">{r.product}</p>
                            <p className="text-[10px] text-zinc-600">{r.company} · Vence {r.deadline}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-sm font-black text-white">{r.value}</p>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${STATUS_RFQ[r.status].cls}`}>
                                {STATUS_RFQ[r.status].label}
                            </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function Mensajeria() {
    const [active, setActive] = useState(0);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[420px]">
            {/* Inbox */}
            <div className="lg:col-span-1 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider">Mensajes</span>
                    <span className="w-5 h-5 bg-emerald-600 rounded-full text-[9px] font-black text-white flex items-center justify-center">2</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {DEMO_MESSAGES.map((m, i) => (
                        <div
                            key={m.id}
                            onClick={() => setActive(i)}
                            className={`px-4 py-3 border-b border-white/[0.04] cursor-pointer transition-all ${active === i ? 'bg-emerald-500/[0.06]' : 'hover:bg-white/[0.03]'}`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center shrink-0">
                                    <span className="text-[9px] font-black text-white">{m.avatar}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className={`text-[11px] font-bold truncate ${m.unread ? 'text-white' : 'text-zinc-400'}`}>{m.from}</p>
                                        <span className="text-[9px] text-zinc-700 shrink-0 ml-1">{m.time}</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-600 truncate">{m.msg}</p>
                                </div>
                                {m.unread && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Thread */}
            <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                        <span className="text-[9px] font-black text-white">{DEMO_MESSAGES[active].avatar}</span>
                    </div>
                    <div>
                        <p className="text-xs font-black">{DEMO_MESSAGES[active].from}</p>
                        <p className="text-[9px] text-emerald-500">En línea</p>
                    </div>
                </div>
                <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
                    <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[8px] font-black text-white">{DEMO_MESSAGES[active].avatar}</span>
                        </div>
                        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm p-3 max-w-sm">
                            <p className="text-xs text-zinc-300 leading-relaxed">{DEMO_MESSAGES[active].msg}</p>
                            <p className="text-[9px] text-zinc-700 mt-1.5">{DEMO_MESSAGES[active].time} ago</p>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <div className="bg-emerald-600/20 border border-emerald-500/20 rounded-2xl rounded-tr-sm p-3 max-w-sm">
                            <p className="text-xs text-zinc-200 leading-relaxed">Recibido, gracias. Revisaremos el documento y respondemos antes del EOD.</p>
                            <p className="text-[9px] text-emerald-700 mt-1.5">Tú · 1m ago</p>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 border-t border-white/[0.05] flex items-center gap-3">
                    <input className="flex-1 h-9 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 text-xs outline-none focus:border-emerald-500/30 transition-all" placeholder="Escribe un mensaje..." />
                    <button className="w-9 h-9 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center justify-center transition-all">
                        <Send className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'directorio', icon: Building2, label: 'Directorio' },
    { id: 'red', icon: LinkIcon, label: 'Red B2B' },
    { id: 'rfqs', icon: FileText, label: 'RFQs' },
    { id: 'mensajes', icon: MessageSquare, label: 'Mensajería' },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function DemoPage() {
    const [activeModule, setActiveModule] = useState('dashboard');
    const [search, setSearch] = useState("");
    const [metrics, setMetrics] = useState({ sinergia: 94.1, rfqs: 128, volumen: 2.47, nodos: 70 });
    const [attendanceStats, setAttendanceStats] = useState({ cleared: 0, total: 107 });
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const tick = setInterval(() => {
            setMetrics(p => ({
                sinergia: Math.min(100, Math.max(90, p.sinergia + (Math.random() * 0.3 - 0.15))),
                rfqs: p.rfqs + (Math.random() > 0.85 ? 1 : 0),
                volumen: p.volumen + (Math.random() * 0.004),
                nodos: 70,
            }));
        }, 4000);

        // Fetch live attendance count from production
        fetch('/api/events/evt_circulo_001/attendance', { cache: 'no-store' })
            .then(r => r.ok ? r.json() : [])
            .then(data => { if (Array.isArray(data)) setAttendanceStats(p => ({ ...p, cleared: data.length })); })
            .catch(() => null);

        return () => clearInterval(tick);
    }, []);

    const activeNav = NAV_ITEMS.find(n => n.id === activeModule)!;

    return (
        <div className="min-h-screen bg-[#030711] text-white selection:bg-emerald-500/20 flex overflow-hidden font-sans">

            {/* Ambient */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-64 w-[800px] h-[600px] rounded-full bg-emerald-950/25 blur-[150px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-indigo-950/15 blur-[120px]" />
            </div>

            {/* ── SIDEBAR ───────────────────────────────────────────── */}
            <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} border-r border-white/[0.06] bg-[#030711]/95 backdrop-blur-2xl z-50 flex flex-col shrink-0 transition-all duration-300`}>
                {/* Logo */}
                <div className="h-14 flex items-center px-4 gap-3 border-b border-white/[0.05]">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
                        <Cpu className="w-4 h-4 text-white" />
                    </div>
                    {sidebarOpen && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-black tracking-tight whitespace-nowrap">JAIRO OS</p>
                            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap">Strategic Engine</p>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 p-2 space-y-0.5 mt-2">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveModule(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative ${activeModule === item.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03]'}`}
                        >
                            <item.icon className={`w-4 h-4 shrink-0 ${activeModule === item.id ? 'text-emerald-400' : 'text-zinc-600'}`} />
                            {sidebarOpen && (
                                <span className="text-[11px] font-bold uppercase tracking-wide whitespace-nowrap overflow-hidden">{item.label}</span>
                            )}
                            {activeModule === item.id && (
                                <motion.div layoutId="sidebar-indicator" className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Attendance live indicator */}
                <div className="p-3 border-t border-white/[0.05]">
                    {sidebarOpen ? (
                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">Evento Live</span>
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            </div>
                            <p className="text-base font-black text-emerald-400 tabular-nums">{attendanceStats.cleared}<span className="text-zinc-600 text-xs font-bold">/{attendanceStats.total}</span></p>
                            <p className="text-[9px] text-zinc-600 mt-0.5">Ingresos confirmados</p>
                            <div className="mt-2 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500/60 rounded-full transition-all duration-700" style={{ width: `${(attendanceStats.cleared / attendanceStats.total) * 100}%` }} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                    )}
                </div>
            </aside>

            {/* ── MAIN ──────────────────────────────────────────────── */}
            <main className="flex-1 flex flex-col min-w-0 z-10">
                {/* Header */}
                <header className="h-14 border-b border-white/[0.05] bg-[#030711]/80 backdrop-blur-2xl flex items-center justify-between px-5 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 rounded-lg hover:bg-white/[0.05] text-zinc-600 hover:text-zinc-300 transition-all"
                        >
                            <Layers className="w-4 h-4" />
                        </button>
                        <div>
                            <h1 className="text-sm font-black uppercase tracking-tight">{activeNav.label}</h1>
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">B2B Core v4.5 · Demo interactiva</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar en la red..."
                                className="w-52 h-8 bg-white/[0.04] border border-white/[0.07] rounded-xl pl-8 pr-3 text-xs outline-none focus:border-emerald-500/30 transition-all placeholder:text-zinc-700"
                            />
                        </div>
                        {/* Notification */}
                        <div className="relative p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.06] transition-all">
                            <Bell className="w-4 h-4 text-zinc-500" />
                            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        </div>
                        {/* CTA */}
                        <a
                            href="/login"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-[11px] font-black text-white uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                        >
                            Acceder <ArrowUpRight className="w-3 h-3" />
                        </a>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeModule}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeModule === 'dashboard' && <Dashboard metrics={metrics} />}
                            {activeModule === 'directorio' && <Directorio search={search} />}
                            {activeModule === 'red' && <RedB2B />}
                            {activeModule === 'rfqs' && <RFQs />}
                            {activeModule === 'mensajes' && <Mensajeria />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.1); border-radius: 20px; }
                select { -webkit-appearance: none; }
            `}</style>
        </div>
    );
}
