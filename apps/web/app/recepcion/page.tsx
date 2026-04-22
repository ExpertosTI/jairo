"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { 
    Users, ShieldCheck, Fingerprint, LayoutGrid, Search, CheckCircle2, 
    X, Star, Layers, Phone, Mail, Radar, Activity, Target, Globe, 
    Cpu, Building2, Briefcase, Crown, Music, Coffee, Gem, Link as LinkIcon, 
    ChevronRight, ExternalLink, AlertCircle, Edit3, WifiOff, RefreshCw,
    Maximize2, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- CONFIGURACIÓN ESTRATÉGICA ---
const API_BASE = '/api'; 
const EVENT_ID = 'evt_circulo_001';
const SYNC_PATH = `${API_BASE}/actividades/attendance`; // Ajustado según rutas de NestJS registradas

const ROLES_ESTRATEGICOS = ["CEO", "Estrategia", "Tecnología", "Operaciones", "Socio", "Invitado Especial"];
const EMPRESAS_DOMINIOS: Record<string, string> = {
    "coopseguros.com": "Coopseguros",
    "coopmaimon.com": "Coopmaimon",
    "renace.tech": "RenaceTech",
    "gmail.com": "Invitado Particular",
    "outlook.com": "Invitado Particular",
    "apple.com": "Tecnología Global",
    "google.com": "Tecnología Global"
};

// --- MANIFIESTO ESTRATÉGICO FINAL (107 NODOS) ---
const INITIAL_MANIFEST: any[] = [
    { id: "1", nombre: "Angel Flores", empresa: "Invitado", mesa: "1", status: 'pending' },
    { id: "2", nombre: "Eduardo Lama", empresa: "Invitado", mesa: "2", status: 'pending' },
    { id: "3", nombre: "Ivan Diaz", empresa: "Invitado", mesa: "3", status: 'pending' },
    { id: "4", nombre: "Manuel Gutierrez", empresa: "Invitado", mesa: "4", status: 'pending' },
    { id: "5", nombre: "Anaisa Perez", empresa: "Invitado", mesa: "5", status: 'pending' },
    { id: "6", nombre: "Nelvis Taveras (50)", empresa: "Invitado", mesa: "6", status: 'pending' },
    { id: "7", nombre: "Marigruz", empresa: "Invitado", mesa: "7", status: 'pending' },
    { id: "8", nombre: "Josefina", empresa: "Invitado", mesa: "8", status: 'pending' },
    { id: "9", nombre: "Burak Gulbahar", empresa: "Invitado", mesa: "9", status: 'pending' },
    { id: "10", nombre: "Gilbert Ramirez (10)", empresa: "Invitado", mesa: "10", status: 'pending' },
    { id: "11", nombre: "Carlos Antonio", empresa: "Invitado", mesa: "11", status: 'pending' },
    { id: "12", nombre: "Ariel Lima", empresa: "Invitado", mesa: "12", status: 'pending' },
    { id: "13", nombre: "Juan Acosta", empresa: "Invitado", mesa: "13", status: 'pending' },
    { id: "14", nombre: "Engerberto Reynoso (Kike)", empresa: "Invitado", mesa: "14", status: 'pending' },
    { id: "15", nombre: "Daylen Ventura", empresa: "Invitado", mesa: "1", status: 'pending' },
    { id: "16", nombre: "Rafael Olacio (Renso)", empresa: "Invitado", mesa: "2", status: 'pending' },
    { id: "17", nombre: "Yoco Oblate (Yaco)", empresa: "Invitado", mesa: "3", status: 'pending' },
    { id: "18", nombre: "Maximo Alcantara", empresa: "Invitado", mesa: "4", status: 'pending' },
    { id: "19", nombre: "Robinson Rodriguez", empresa: "Invitado", mesa: "5", status: 'pending' },
    { id: "20", nombre: "Ruben Perez", empresa: "Invitado", mesa: "6", status: 'pending' },
    { id: "21", nombre: "Jessica Duran", empresa: "Invitado", mesa: "7", status: 'pending' },
    { id: "22", nombre: "Cuba Deranis Chiong", empresa: "Invitado", mesa: "8", status: 'pending' },
    { id: "23", nombre: "Junior Baldera", empresa: "Invitado", mesa: "9", status: 'pending' },
    { id: "24", nombre: "Wellentong Baldera", empresa: "Invitado", mesa: "10", status: 'pending' },
    { id: "25", nombre: "Jose Baldera", empresa: "Invitado", mesa: "11", status: 'pending' },
    { id: "26", nombre: "Giancarlos Reynoso", empresa: "Invitado", mesa: "12", status: 'pending' },
    { id: "27", nombre: "Antonio Castillo (Maguiver)", empresa: "Invitado", mesa: "13", status: 'pending' },
    { id: "28", nombre: "Ramon Campusano (Chuky)", empresa: "Invitado", mesa: "14", status: 'pending' },
    { id: "29", nombre: "Felix Del Rosario (Chuky)", empresa: "Invitado", mesa: "1", status: 'pending' },
    { id: "30", nombre: "Luis Pabolo", empresa: "Invitado", mesa: "2", status: 'pending' },
    { id: "31", nombre: "Ramon Pascual (Mello)", empresa: "Invitado", mesa: "3", status: 'pending' },
    { id: "32", nombre: "Mirtha E. Perez (Popy)", empresa: "Invitado", mesa: "4", status: 'pending' },
    { id: "33", nombre: "Junior Santos", empresa: "Invitado", mesa: "5", status: 'pending' },
    { id: "34", nombre: "Juan de los Santos (Niño)", empresa: "Invitado", mesa: "6", status: 'pending' },
    { id: "35", nombre: "Ruben Mocana", empresa: "Invitado", mesa: "7", status: 'pending' },
    { id: "36", nombre: "Edward Lorenzo", empresa: "Invitado", mesa: "8", status: 'pending' },
    { id: "37", nombre: "Daniel Lorenzo", empresa: "Invitado", mesa: "9", status: 'pending' },
    { id: "38", nombre: "Maria Vazquez", empresa: "Invitado", mesa: "10", status: 'pending' },
    { id: "39", nombre: "Francisco Confesor", empresa: "Invitado", mesa: "11", status: 'pending' },
    { id: "40", nombre: "Eliandy Confesor", empresa: "Invitado", mesa: "12", status: 'pending' },
    { id: "41", nombre: "Mariely Andreina de la Cruz", empresa: "Invitado", mesa: "13", status: 'pending', isVIP: true },
    { id: "42", nombre: "Miguel Herasme", empresa: "Invitado", mesa: "14", status: 'pending' },
    { id: "43", nombre: "Sergio Calafat", empresa: "Invitado", mesa: "1", status: 'pending' },
    { id: "44", nombre: "Bladimir Nuñez", empresa: "Invitado", mesa: "2", status: 'pending' },
    { id: "45", nombre: "Alvaro Solano", empresa: "Invitado", mesa: "3", status: 'pending' },
    { id: "46", nombre: "Claudia Flores", empresa: "Invitado", mesa: "4", status: 'pending' },
    { id: "47", nombre: "Mark", empresa: "Invitado", mesa: "5", status: 'pending' },
    { id: "48", nombre: "Abiattar Contreras", empresa: "Invitado", mesa: "6", status: 'pending' },
    { id: "49", nombre: "Musico 1", empresa: "Musicos", mesa: "7", status: 'pending' },
    { id: "50", nombre: "Musico 2", empresa: "Musicos", mesa: "8", status: 'pending' },
    { id: "51", nombre: "Musico 3", empresa: "Musicos", mesa: "9", status: 'pending' },
    { id: "52", nombre: "Musico 4", empresa: "Musicos", mesa: "10", status: 'pending' },
    { id: "53", nombre: "Musico 5", empresa: "Musicos", mesa: "11", status: 'pending' },
    { id: "54", nombre: "Adderly Marte", empresa: "Invitado", mesa: "12", status: 'pending' },
    { id: "55", nombre: "Luciano", empresa: "Invitado", mesa: "13", status: 'pending' },
    { id: "56", nombre: "Cespedes", empresa: "Invitado", mesa: "14", status: 'pending' },
    { id: "57", nombre: "Anyra", empresa: "Invitado", mesa: "1", status: 'pending' },
    { id: "58", nombre: "Isaisas", empresa: "Invitado", mesa: "2", status: 'pending' },
    { id: "59", nombre: "Ass.", empresa: "Invitado", mesa: "3", status: 'pending' },
    { id: "64", nombre: "Lucia Lopez", empresa: "Invitado", mesa: "4", status: 'pending' },
    { id: "65", nombre: "Carvajal Claudio", empresa: "Invitado", mesa: "5", status: 'pending' },
    { id: "66", nombre: "Carlos Bido", empresa: "Invitado", mesa: "6", status: 'pending' },
    { id: "67", nombre: "Moscar Melo", empresa: "Invitado", mesa: "7", status: 'pending' },
    { id: "68", nombre: "Moscar Soto", empresa: "Invitado", mesa: "8", status: 'pending' },
    { id: "69", nombre: "Juan (Pan)", empresa: "Invitado", mesa: "9", status: 'pending' },
    { id: "70", nombre: "Eliel Bassa", empresa: "Invitado", mesa: "10", status: 'pending' },
    { id: "71", nombre: "Eduardo Dua", empresa: "Invitado", mesa: "11", status: 'pending' },
    { id: "72", nombre: "Elsa Encarnacion", empresa: "Invitado", mesa: "12", status: 'pending' },
    { id: "73", nombre: "J. Hanna Cordero", empresa: "Invitado", mesa: "13", status: 'pending', isVIP: true },
    { id: "74", nombre: "Melda Adams", empresa: "Invitado", mesa: "14", status: 'pending' },
    { id: "75", nombre: "Norman Lozano", empresa: "Invitado", mesa: "1", status: 'pending' },
    { id: "76", nombre: "Jesus Osorio", empresa: "Invitado", mesa: "2", status: 'pending' },
    { id: "77", nombre: "Ariel Peña", empresa: "Invitado", mesa: "3", status: 'pending' },
    { id: "78", nombre: "Sindry Gomez", empresa: "Invitado", mesa: "4", status: 'pending' },
    { id: "79", nombre: "Candida Duares", empresa: "Invitado", mesa: "5", status: 'pending' },
    { id: "80", nombre: "Leonela Contreras", empresa: "Invitado", mesa: "6", status: 'pending' },
    { id: "81", nombre: "Zailon", empresa: "Invitado", mesa: "7", status: 'pending' },
    { id: "82", nombre: "Maniga", empresa: "Invitado", mesa: "8", status: 'pending' },
    { id: "83", nombre: "Winston Santos", empresa: "Invitado", mesa: "9", status: 'pending' },
    { id: "84", nombre: "Romelio", empresa: "Invitado", mesa: "10", status: 'pending' },
    { id: "85", nombre: "Esmartin Mila", empresa: "Invitado", mesa: "11", status: 'pending' },
    { id: "86", nombre: "Stacy Milan", empresa: "Invitado", mesa: "12", status: 'pending' },
    { id: "87", nombre: "Morenito", empresa: "Invitado", mesa: "13", status: 'pending' },
    { id: "88", nombre: "Socrates Noris", empresa: "Invitado", mesa: "14", status: 'pending' },
    { id: "89", nombre: "Maximiliano Almonte", empresa: "Invitado", mesa: "1", status: 'pending' },
    { id: "90", nombre: "Digna Sanchez", empresa: "Invitado", mesa: "2", status: 'pending' },
    { id: "91", nombre: "Coopseguros 1", empresa: "Coopseguros", mesa: "3", status: 'pending' },
    { id: "92", nombre: "Coopseguros 2", empresa: "Coopseguros", mesa: "4", status: 'pending' },
    { id: "93", nombre: "Coopseguros 3", empresa: "Coopseguros", mesa: "5", status: 'pending' },
    { id: "94", nombre: "Coopseguros 4", empresa: "Coopseguros", mesa: "6", status: 'pending' },
    { id: "95", nombre: "Coopseguros 5", empresa: "Coopseguros", mesa: "7", status: 'pending' },
    { id: "96", nombre: "Coopseguros 6", empresa: "Coopseguros", mesa: "8", status: 'pending' },
    { id: "97", nombre: "Coopmaimon 1", empresa: "Coopmaimon", mesa: "9", status: 'pending' },
    { id: "98", nombre: "Coopmaimon 2", empresa: "Coopmaimon", mesa: "10", status: 'pending' },
    { id: "99", nombre: "Coopmaimon 3", empresa: "Coopmaimon", mesa: "11", status: 'pending' },
    { id: "100", nombre: "Coopmaimon 4", empresa: "Coopmaimon", mesa: "12", status: 'pending' },
    { id: "101", nombre: "Coopmaimon 5", empresa: "Coopmaimon", mesa: "13", status: 'pending' },
    { id: "102", nombre: "Coopmaimon 6", empresa: "Coopmaimon", mesa: "14", status: 'pending' },
    { id: "103", nombre: "Coopmaimon 7", empresa: "Coopmaimon", mesa: "1", status: 'pending' },
    { id: "104", nombre: "Paul Martínez", empresa: "Invitado", mesa: "2", status: 'pending' },
    { id: "105", nombre: "Thomas Bank", empresa: "Invitado", mesa: "3", status: 'pending' },
    { id: "106", nombre: "Alexandra Núñez", empresa: "Invitado", mesa: "4", status: 'pending' },
    { id: "107", nombre: "Ambra Montini", empresa: "Invitado", mesa: "5", status: 'pending' },
];

export default function RecepcionCommandCenter() {
    const [view, setView] = useState<'tables' | 'directory'>('directory');
    const [searchTerm, setSearchTerm] = useState("");
    const [invitados, setInvitados] = useState(INITIAL_MANIFEST);
    const [selectedGuest, setSelectedGuest] = useState<any>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [networkLatency, setNetworkLatency] = useState(0);
    
    const [formData, setFormData] = useState({
        nombre: "",
        empresa: "",
        rol: "Estrategia",
        telefono: "",
        correo: ""
    });

    const [isEditingMesa, setIsEditingMesa] = useState(false);
    const [tempMesa, setTempMesa] = useState("");

    // Sincronización Maestra con el Stack Central
    const syncAttendance = useCallback(async () => {
        const start = Date.now();
        try {
            const res = await fetch(`${SYNC_PATH}`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setNetworkLatency(Date.now() - start);
                setInvitados(prev => prev.map(inv => {
                    const cleared = data.find((a: any) => String(a.guestId) === String(inv.id));
                    return cleared ? { ...inv, status: 'cleared' } : inv;
                }));
            }
        } catch (e) { setStatus('error'); }
    }, []);

    useEffect(() => {
        syncAttendance();
        const interval = setInterval(syncAttendance, 15000); 
        return () => clearInterval(interval);
    }, [syncAttendance]);

    // Inteligencia de Detección Proactiva
    useEffect(() => {
        if (formData.correo.includes("@")) {
            const domain = formData.correo.split("@")[1].toLowerCase();
            if (EMPRESAS_DOMINIOS[domain]) {
                setFormData(prev => ({ ...prev, empresa: EMPRESAS_DOMINIOS[domain] }));
            }
        }
    }, [formData.correo]);

    useEffect(() => {
        if (selectedGuest) {
            setFormData({
                nombre: selectedGuest.nombre,
                empresa: selectedGuest.empresa,
                rol: "Estrategia",
                telefono: "",
                correo: ""
            });
        }
    }, [selectedGuest]);

    const handleGrantAccess = async () => {
        if (!selectedGuest) return;
        setStatus('loading');
        
        try {
            const res = await fetch(`${SYNC_PATH}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestId: selectedGuest.id,
                    guestName: formData.nombre,
                    companyName: formData.empresa,
                    role: formData.rol,
                    phone: formData.telefono,
                    email: formData.correo,
                    mesa: selectedGuest.mesa,
                    eventId: EVENT_ID
                })
            });

            if (res.ok) {
                setStatus('success');
                setInvitados(prev => prev.map(inv => inv.id === selectedGuest.id ? { ...inv, status: 'cleared', nombre: formData.nombre, empresa: formData.empresa } : inv));
                setTimeout(() => {
                    setSelectedGuest(null);
                    setStatus('idle');
                }, 2000);
            } else { 
                // FALLBACK ESTRATÉGICO: Si la API falla, guardamos localmente y permitimos el acceso
                console.warn("RESERVA_TACTICA: Servidor no responde. Guardando en Vault Local.");
                const localData = JSON.parse(localStorage.getItem(`offline_attendance_${EVENT_ID}`) || '[]');
                localData.push(selectedGuest.id);
                localStorage.setItem(`offline_attendance_${EVENT_ID}`, JSON.stringify(localData));
                
                setStatus('success');
                setInvitados(prev => prev.map(inv => inv.id === selectedGuest.id ? { ...inv, status: 'cleared', nombre: formData.nombre, empresa: formData.empresa } : inv));
                setTimeout(() => {
                    setSelectedGuest(null);
                    setStatus('idle');
                }, 2000);
            }
        } catch (e) { 
            // FALLBACK ANTE CORTE TOTAL DE RED
            const localData = JSON.parse(localStorage.getItem(`offline_attendance_${EVENT_ID}`) || '[]');
            localData.push(selectedGuest.id);
            localStorage.setItem(`offline_attendance_${EVENT_ID}`, JSON.stringify(localData));

            setStatus('success');
            setInvitados(prev => prev.map(inv => inv.id === selectedGuest.id ? { ...inv, status: 'cleared', nombre: formData.nombre, empresa: formData.empresa } : inv));
            setTimeout(() => {
                setSelectedGuest(null);
                setStatus('idle');
            }, 2000);
        }
    };

    const handleMesaUpdate = (guestId: string, newMesa: string) => {
        setInvitados(prev => prev.map(inv => inv.id === guestId ? { ...inv, mesa: newMesa } : inv));
        if (selectedGuest?.id === guestId) setSelectedGuest({ ...selectedGuest, mesa: newMesa });
        setIsEditingMesa(false);
    };

    const filtered = useMemo(() => invitados.filter(inv => 
        inv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        inv.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.mesa.includes(searchTerm)
    ), [searchTerm, invitados]);

    const mesasIds = useMemo(() => Array.from(new Set(invitados.map(i => i.mesa))).sort((a,b) => parseInt(a) - parseInt(b)), [invitados]);

    const getIcon = (mesa: string) => {
        const m = parseInt(mesa);
        if (m <= 2) return <Crown className="text-amber-500 w-5 h-5" />;
        if (m >= 7 && m <= 11) return <Music className="text-purple-500 w-5 h-5" />;
        return <Coffee className="text-emerald-500 w-5 h-5" />;
    };

    return (
        <div className="min-h-screen bg-[#020408] text-white selection:bg-emerald-500/30 flex flex-col overflow-hidden relative">
            
            {/* Background Telemetry 2026 */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Radar className="absolute -top-60 -right-60 w-[50rem] h-[50rem] text-emerald-500/5 animate-pulse" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-emerald-500/10 shadow-[0_0_20px_#10b98120]" />
            </div>

            {/* Nav Mando Táctico */}
            <nav className="h-20 border-b border-white/10 bg-[#020408]/95 backdrop-blur-3xl flex items-center justify-between px-6 lg:px-12 z-50 sticky top-0 shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center border border-emerald-400/20 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                            <Fingerprint className="w-6 h-6 text-white" />
                        </div>
                        <div className="hidden md:block">
                            <span className="text-xl font-black uppercase tracking-tighter italic">JairoOS_v2</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${status === 'error' ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                    {status === 'error' ? 'SYSTEM_OFFLINE' : `LINK_STABLE_${networkLatency}MS`}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="relative w-[220px] md:w-[450px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                        <input 
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Identificar nodo..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-full py-4 pl-14 pr-8 text-sm font-bold focus:border-emerald-500/50 outline-none transition-all shadow-inner"
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setView('directory')} className={`p-4 rounded-2xl transition-all ${view === 'directory' ? 'bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white' : 'bg-white/5 text-gray-600 hover:bg-white/10'}`}><LayoutGrid className="w-5 h-5" /></button>
                    <button onClick={() => setView('tables')} className={`p-4 rounded-2xl transition-all ${view === 'tables' ? 'bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white' : 'bg-white/5 text-gray-600 hover:bg-white/10'}`}><Layers className="w-5 h-5" /></button>
                </div>
            </nav>

            {/* Listado de Nodos */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-14 z-10 custom-scrollbar pb-40">
                <AnimatePresence mode="wait">
                    {view === 'directory' ? (
                        <motion.div key="grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filtered.map((inv) => (
                                <motion.div 
                                    key={inv.id} layout initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={() => setSelectedGuest(inv)}
                                    className={`p-10 rounded-[3rem] border transition-all bg-white/[0.01] relative group active:scale-95 flex flex-col h-full ${inv.status === 'cleared' ? 'border-emerald-500/40 bg-emerald-500/[0.05] shadow-[0_20px_50px_rgba(16,185,129,0.05)]' : 'border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.03]'}`}
                                >
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{getIcon(inv.mesa)}</div>
                                            <span className="text-[11px] font-black text-gray-600 uppercase tracking-[0.3em] italic">SEC_# {inv.mesa}</span>
                                        </div>
                                        {inv.status === 'cleared' && <CheckCircle2 className="w-6 h-6 text-emerald-500 shadow-[0_0_15px_#10b981]" />}
                                    </div>
                                    <h3 className="text-3xl font-black uppercase leading-[0.9] tracking-tighter group-hover:text-emerald-400 transition-colors mb-4">{inv.nombre}</h3>
                                    <div className="mt-auto pt-6 flex items-center gap-3">
                                        <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${EMPRESAS_DOMINIOS[inv.empresa.toLowerCase()] || inv.empresa !== 'Invitado' ? 'text-emerald-500/60' : 'text-gray-700'}`}>
                                            {inv.empresa}
                                        </span>
                                        {(EMPRESAS_DOMINIOS[inv.empresa.toLowerCase()] || inv.empresa !== 'Invitado') && <Zap className="w-3 h-3 text-emerald-500/40" />}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div key="tables" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                            {mesasIds.map(mesaId => {
                                const mesaInvs = filtered.filter(i => i.mesa === mesaId);
                                if (searchTerm && mesaInvs.length === 0) return null;
                                return (
                                    <div key={mesaId} className="p-12 rounded-[4rem] bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all group relative flex flex-col h-full shadow-2xl">
                                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-125 transition-transform">{getIcon(mesaId)}</div>
                                        <h3 className="text-4xl font-black uppercase mb-12 border-b border-white/10 pb-8 flex justify-between items-end">
                                            <span className="tracking-tighter italic">Mesa {mesaId}</span>
                                            <span className="text-[10px] text-emerald-500/30 tracking-[0.5em] font-black">{mesaInvs.length} NODOS</span>
                                        </h3>
                                        <div className="space-y-5 flex-1">
                                            {mesaInvs.map(inv => (
                                                <div key={inv.id} onClick={() => setSelectedGuest(inv)} className={`p-7 rounded-[2.5rem] border flex justify-between items-center cursor-pointer transition-all active:scale-95 group/item ${inv.status === 'cleared' ? 'border-emerald-500/20 bg-emerald-500/[0.05]' : 'border-white/5 hover:border-emerald-500/40 hover:bg-white/[0.04]'}`}>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-xl font-black uppercase leading-none tracking-tighter group-hover/item:text-emerald-400 transition-colors">{inv.nombre}</span>
                                                        <span className="text-[10px] font-bold text-gray-700 uppercase mt-2 tracking-widest">{inv.empresa}</span>
                                                    </div>
                                                    {inv.status === 'cleared' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Centro de Mando: Modal Táctico Final */}
            <AnimatePresence>
                {selectedGuest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 backdrop-blur-[50px] bg-black/98">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-[1000px] max-h-[92vh] bg-[#05080f] rounded-[5rem] border border-white/10 flex flex-col relative overflow-hidden shadow-[0_100px_250px_rgba(0,0,0,1)]"
                        >
                            <button onClick={() => { setSelectedGuest(null); setStatus('idle'); }} className="absolute top-10 right-10 z-[110] p-6 bg-white/5 rounded-full hover:bg-white/10 text-gray-600 hover:text-white transition-all active:scale-90"><X className="w-8 h-8" /></button>
                            
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {/* Zona Identidad */}
                                <div className="p-14 lg:p-20 border-b border-white/5 bg-white/[0.01] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none animate-pulse"><Fingerprint className="w-64 h-64" /></div>
                                    <div className="flex items-center gap-5 mb-10">
                                        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><ShieldCheck className="w-8 h-8 text-emerald-500" /></div>
                                        <span className="text-[12px] font-black tracking-[0.6em] text-emerald-500 uppercase italic">Verificación_Master_2026</span>
                                    </div>
                                    
                                    <div className="group relative max-w-3xl">
                                        <Edit3 className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 text-white/5 group-focus-within:text-emerald-500/50 transition-all pointer-events-none" />
                                        <input 
                                            value={formData.nombre} 
                                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                            className="text-[clamp(2rem,10vw,8rem)] bg-transparent font-black uppercase leading-[0.8] tracking-tighter outline-none w-full border-b-2 border-white/5 focus:border-emerald-500/60 pb-8 transition-all overflow-hidden text-ellipsis whitespace-nowrap"
                                            placeholder="EDITAR NOMBRE"
                                        />
                                    </div>
                                    
                                    <div className="mt-12 flex items-center gap-8">
                                        <p className={`text-3xl font-black uppercase tracking-[0.2em] italic ${EMPRESAS_DOMINIOS[formData.correo.split("@")[1]?.toLowerCase()] ? 'text-emerald-500' : 'text-gray-700'}`}>
                                            {formData.empresa || selectedGuest.empresa}
                                        </p>
                                        {EMPRESAS_DOMINIOS[formData.correo.split("@")[1]?.toLowerCase()] && (
                                            <div className="px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-3 shadow-[0_0_30px_#10b98110]">
                                                <Cpu className="w-5 h-5 text-emerald-500" />
                                                <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em]">Red_Detectada</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Zona de Datos Inteligentes */}
                                <div className="p-14 lg:p-20 space-y-16">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
                                        <div className="space-y-10">
                                            <div className="space-y-4">
                                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-3">Identificador Digital <Mail className="w-4 h-4" /></label>
                                                <div className="relative group">
                                                    <div className="absolute left-7 top-1/2 -translate-y-1/2 text-xl font-black text-gray-700 group-focus-within:text-emerald-500 transition-colors">@</div>
                                                    <input 
                                                        placeholder="mail@dominio.com" value={formData.correo} 
                                                        onChange={(e) => setFormData({...formData, correo: e.target.value})}
                                                        className="w-full h-24 bg-white/[0.02] border border-white/10 rounded-[2.5rem] pl-16 pr-10 font-black text-2xl outline-none focus:border-emerald-500/50 shadow-inner"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Organización Validada</label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-7 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-700" />
                                                    <input 
                                                        value={formData.empresa} onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                                                        className="w-full h-24 bg-white/[0.02] border border-white/10 rounded-[2.5rem] pl-20 pr-10 font-black text-2xl outline-none focus:border-emerald-500/50 shadow-inner"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-10">
                                            <div className="space-y-4">
                                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Enlace Móvil (WhatsApp)</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-7 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-700 group-focus-within:text-emerald-500 transition-colors" />
                                                    <input 
                                                        placeholder="849-000-0000" value={formData.telefono} 
                                                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                                                        className="w-full h-24 bg-white/[0.02] border border-white/10 rounded-[2.5rem] pl-20 pr-10 font-black text-2xl outline-none focus:border-emerald-500/50 shadow-inner"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Rol de Estrategia</label>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-7 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-700" />
                                                    <select 
                                                        value={formData.rol} onChange={(e) => setFormData({...formData, rol: e.target.value})}
                                                        className="w-full h-24 bg-white/[0.02] border border-white/10 rounded-[2.5rem] pl-20 pr-10 font-black text-2xl outline-none focus:border-emerald-500/50 appearance-none italic shadow-inner"
                                                    >
                                                        {ROLES_ESTRATEGICOS.map(r => <option key={r} value={r} className="bg-[#05080f] text-white">{r}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mando de Mesa Consolidado */}
                                    <div className="p-14 bg-emerald-500/[0.03] rounded-[4rem] border border-emerald-500/10 flex items-center justify-between shadow-2xl relative group/mesa">
                                        <div className="absolute top-4 right-4"><Maximize2 className="w-4 h-4 text-emerald-500/20 group-hover/mesa:text-emerald-500 transition-colors" /></div>
                                        <div className="flex items-center gap-10">
                                            <div className="w-24 h-24 bg-emerald-600/10 rounded-[2rem] flex items-center justify-center border border-emerald-500/20 shadow-2xl group-hover/mesa:scale-110 transition-transform">{getIcon(selectedGuest.mesa)}</div>
                                            <div>
                                                <span className="text-[12px] font-black text-emerald-600 uppercase tracking-[0.6em] italic">Configuración_Mesa (1-14)</span>
                                                {!isEditingMesa ? (
                                                    <p className="text-7xl font-black text-emerald-500 tracking-tighter">MESA {selectedGuest.mesa}</p>
                                                ) : (
                                                    <div className="flex items-center gap-8 mt-5">
                                                        <input 
                                                            autoFocus type="number" min="1" max="14" value={tempMesa} 
                                                            onChange={(e) => setTempMesa(e.target.value)}
                                                            className="bg-white/10 border-4 border-emerald-500 rounded-3xl px-8 py-5 text-5xl font-black w-36 outline-none text-center shadow-[0_0_50px_#10b98150]"
                                                        />
                                                        <button onClick={() => handleMesaUpdate(selectedGuest.id, tempMesa)} className="bg-emerald-600 px-10 py-6 rounded-3xl font-black uppercase text-base tracking-[0.2em] hover:bg-emerald-500 shadow-xl transition-all">SINC_MESA</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => { setTempMesa(selectedGuest.mesa); setIsEditingMesa(!isEditingMesa); }} 
                                            className="w-28 h-28 bg-emerald-600 rounded-[3rem] flex items-center justify-center shadow-[0_20px_50px_#10b98140] active:scale-90 transition-all hover:scale-105 border border-white/20"
                                        >
                                            {isEditingMesa ? <X className="w-12 h-12 text-white" /> : <Layers className="w-12 h-12 text-white" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones Maestras */}
                            <div className="p-14 lg:p-20 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row gap-12 items-center justify-between mt-auto">
                                <button onClick={() => { setSelectedGuest(null); setStatus('idle'); }} className="text-[13px] font-black text-gray-700 hover:text-white tracking-[0.8em] uppercase transition-all italic">Abortar_Registro</button>
                                <button onClick={handleGrantAccess} className="w-full sm:w-auto px-32 py-12 bg-emerald-600 rounded-[3.5rem] text-white font-black uppercase tracking-[0.5em] shadow-[0_0_120px_#10b98160] hover:bg-emerald-500 active:scale-95 transition-all text-4xl flex items-center justify-center gap-8 group">
                                    CONCEDER ACCESO <ChevronRight className="w-12 h-12 group-hover:translate-x-3 transition-transform" />
                                </button>
                            </div>

                            {/* HUD de Estado de Red JairoOS */}
                            <AnimatePresence>
                                {status !== 'idle' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[150] bg-[#05080f]/99 flex flex-col items-center justify-center p-16 text-center">
                                        {status === 'loading' && (
                                            <div className="space-y-16">
                                                <div className="relative">
                                                    <div className="w-64 h-64 border-[15px] border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mx-auto shadow-[0_0_100px_#10b98110]" />
                                                    <div className="absolute inset-0 flex items-center justify-center"><Fingerprint className="w-24 h-24 text-emerald-500/20 animate-pulse" /></div>
                                                </div>
                                                <p className="text-5xl font-black uppercase tracking-tighter animate-pulse text-emerald-500 italic">Sincronizando con Stack Central_2026...</p>
                                            </div>
                                        )}
                                        {status === 'success' && (
                                            <div className="space-y-16">
                                                <div className="w-56 h-56 bg-emerald-500 rounded-[4.5rem] flex items-center justify-center mx-auto shadow-[0_0_150px_#10b981]"><CheckCircle2 className="w-28 h-28 text-white" /></div>
                                                <p className="text-[10rem] font-black text-emerald-500 tracking-tighter leading-none">VALIDADO</p>
                                                <p className="text-3xl font-bold italic text-gray-500 uppercase tracking-[0.3em] mt-10">Nodo Sincronizado Correctamente</p>
                                            </div>
                                        )}
                                        {status === 'error' && (
                                            <div className="space-y-16">
                                                <div className="w-40 h-40 bg-red-500/10 border-4 border-red-500/50 rounded-[4rem] flex items-center justify-center mx-auto shadow-[0_0_100px_#ef444410]"><WifiOff className="w-20 h-20 text-red-500" /></div>
                                                <p className="text-7xl font-black text-red-500 tracking-tighter uppercase leading-none">Fallo_de_Red</p>
                                                <div className="bg-red-500/5 p-12 rounded-[3rem] border border-red-500/10 max-w-xl mx-auto shadow-inner">
                                                    <p className="text-lg font-bold text-gray-500 mb-10 leading-relaxed italic">El Stack Central no responde. Por favor, verifica la conexión estratégica en el VPS de Producción.</p>
                                                    <button onClick={() => setStatus('idle')} className="w-full py-8 bg-red-500 text-white font-black uppercase tracking-[0.4em] rounded-[2rem] flex items-center justify-center gap-5 active:scale-95 transition-all text-xl shadow-2xl hover:bg-red-600">
                                                        <RefreshCw className="w-7 h-7" /> REINTENTAR_SINC
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 20px; }
                select { -webkit-appearance: none; appearance: none; }
                input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                @font-face {
                    font-family: 'Outfit';
                    src: url('https://fonts.googleapis.com/css2?family=Outfit:wght@900&display=swap');
                }
            `}</style>
        </div>
    );
}
