"use client";

import { useState, useEffect, useMemo } from "react";
import { 
    Users, ShieldCheck, Fingerprint, LayoutGrid, Search, CheckCircle2, 
    X, Star, Layers, Phone, Mail, Radar, Activity, Target, Globe, 
    Cpu, Building2, Briefcase, Crown, Music, Coffee, Gem, Link as LinkIcon, 
    ChevronRight, ExternalLink, AlertCircle, Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- CONFIGURACIÓN ESTRATÉGICA ---
const API_BASE = '/api'; 
const EVENT_ID = 'evt_circulo_001';

const ROLES_ESTRATEGICOS = ["CEO", "Estrategia", "Tecnología", "Operaciones", "Socio", "Invitado Especial"];
const EMPRESAS_DOMINIOS: Record<string, string> = {
    "coopseguros.com": "Coopseguros",
    "coopmaimon.com": "Coopmaimon",
    "renace.tech": "RenaceTech",
    "gmail.com": "Invitado Particular",
    "outlook.com": "Invitado Particular"
};

// --- MANIFIESTO ESTRATÉGICO (107 NODOS) ---
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
    
    // Formulario de Validación Inteligente
    const [formData, setFormData] = useState({
        nombre: "",
        empresa: "",
        rol: "Estrategia",
        telefono: "",
        correo: ""
    });

    const [isEditingMesa, setIsEditingMesa] = useState(false);
    const [tempMesa, setTempMesa] = useState("");

    // Detección Automática por Correo
    useEffect(() => {
        if (formData.correo.includes("@")) {
            const domain = formData.correo.split("@")[1];
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

    useEffect(() => {
        const syncAttendance = async () => {
            try {
                const res = await fetch(`${API_BASE}/events/${EVENT_ID}/attendance`);
                if (res.ok) {
                    const data = await res.json();
                    setInvitados(prev => prev.map(inv => {
                        const cleared = data.find((a: any) => String(a.guestId) === String(inv.id));
                        return cleared ? { ...inv, status: 'cleared' } : inv;
                    }));
                }
            } catch (e) { console.error("Sync Error:", e); }
        };
        syncAttendance();
    }, []);

    const handleGrantAccess = async () => {
        if (!selectedGuest) return;
        setStatus('loading');
        
        try {
            const res = await fetch(`${API_BASE}/events/${EVENT_ID}/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestId: selectedGuest.id,
                    guestName: formData.nombre, // Enviamos el nombre corregido
                    companyName: formData.empresa,
                    role: formData.rol,
                    phone: formData.telefono,
                    email: formData.correo
                })
            });

            if (res.ok) {
                setTimeout(() => {
                    setStatus('success');
                    setInvitados(prev => prev.map(inv => inv.id === selectedGuest.id ? { ...inv, status: 'cleared', nombre: formData.nombre, empresa: formData.empresa } : inv));
                    setTimeout(() => {
                        setSelectedGuest(null);
                        setStatus('idle');
                    }, 2500);
                }, 1500);
            } else { setStatus('error'); }
        } catch (e) { setStatus('error'); }
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
            <div className="fixed inset-0 z-0 pointer-events-none opacity-5">
                <Radar className="absolute -top-40 -right-40 w-[40rem] h-[40rem] text-emerald-500 animate-pulse" />
            </div>

            <nav className="h-20 border-b border-white/5 bg-[#020408]/95 backdrop-blur-3xl flex items-center justify-between px-6 lg:px-12 z-50 sticky top-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center border border-emerald-400/20">
                            <Fingerprint className="w-6 h-6" />
                        </div>
                        <div className="hidden sm:block text-left">
                            <span className="text-xl font-black uppercase tracking-tighter italic">JairoOS</span>
                            <span className="block text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">DB_REACTIVE_v2026</span>
                        </div>
                    </div>
                    <div className="relative w-[220px] md:w-[400px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                        <input 
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar nodo..."
                            className="w-full bg-white/[0.02] border border-white/10 rounded-full py-3.5 pl-14 pr-6 text-sm font-bold outline-none focus:border-emerald-500/50"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setView('directory')} className={`p-3.5 rounded-2xl ${view === 'directory' ? 'bg-emerald-600 shadow-lg' : 'bg-white/5 text-gray-600'}`}><LayoutGrid className="w-5 h-5" /></button>
                    <button onClick={() => setView('tables')} className={`p-3.5 rounded-2xl ${view === 'tables' ? 'bg-emerald-600 shadow-lg' : 'bg-white/5 text-gray-600'}`}><Layers className="w-5 h-5" /></button>
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto p-6 lg:p-12 z-10 custom-scrollbar pb-40">
                {view === 'directory' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filtered.map((inv) => (
                                <motion.div 
                                    key={inv.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedGuest(inv)}
                                    className={`p-8 rounded-[2.5rem] border cursor-pointer transition-all bg-white/[0.01] relative group active:scale-95 ${inv.status === 'cleared' ? 'border-emerald-500/30 bg-emerald-500/[0.04]' : 'border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.03]'}`}
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">{getIcon(inv.mesa)}</div>
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">MESA {inv.mesa}</span>
                                        </div>
                                        {inv.status === 'cleared' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shadow-[0_0_10px_#10b981]" />}
                                    </div>
                                    <h3 className="text-xl font-black uppercase leading-tight group-hover:text-emerald-400 transition-colors">{inv.nombre}</h3>
                                    <p className="text-[10px] font-bold text-gray-700 uppercase mt-3 tracking-widest">{inv.empresa}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {mesasIds.map(mesaId => {
                            const mesaInvs = filtered.filter(i => i.mesa === mesaId);
                            if (searchTerm && mesaInvs.length === 0) return null;
                            return (
                                <div key={mesaId} className="p-10 rounded-[3.5rem] bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-20">{getIcon(mesaId)}</div>
                                    <h3 className="text-2xl font-black uppercase mb-8 border-b border-white/5 pb-4 flex justify-between items-center">
                                        <span>Mesa {mesaId}</span>
                                        <span className="text-[10px] text-gray-700 tracking-[0.3em]">{mesaInvs.length} NODOS</span>
                                    </h3>
                                    <div className="space-y-4">
                                        {mesaInvs.map(inv => (
                                            <div key={inv.id} onClick={() => setSelectedGuest(inv)} className={`p-6 rounded-[2rem] border flex justify-between items-center cursor-pointer transition-all active:scale-95 ${inv.status === 'cleared' ? 'border-emerald-500/20 bg-emerald-500/[0.05]' : 'border-white/5 hover:border-emerald-500/30'}`}>
                                                <div className="flex flex-col text-left">
                                                    <span className="text-base font-black uppercase leading-tight group-hover:text-emerald-400">{inv.nombre}</span>
                                                    <span className="text-[9px] font-bold text-gray-700 uppercase mt-1 tracking-widest">{inv.empresa}</span>
                                                </div>
                                                {inv.status === 'cleared' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <AnimatePresence>
                {selectedGuest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl bg-black/95">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
                            className="w-full max-w-[950px] max-h-[95vh] bg-[#05080f] rounded-[4rem] border border-white/10 flex flex-col relative overflow-y-auto custom-scrollbar shadow-[0_50px_100px_rgba(0,0,0,1)]"
                        >
                            <button onClick={() => { setSelectedGuest(null); setStatus('idle'); }} className="absolute top-8 right-8 z-[110] p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all"><X className="w-6 h-6" /></button>
                            
                            <div className="p-10 lg:p-14 border-b border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><ShieldCheck className="w-6 h-6 text-emerald-500" /></div>
                                    <span className="text-[11px] font-black tracking-[0.4em] text-emerald-500 uppercase">Validación_Inteligente_2026</span>
                                </div>
                                
                                {/* Edición Maestra de Nombre */}
                                <div className="group relative">
                                    <Edit3 className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-white/10 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                                    <input 
                                        value={formData.nombre} 
                                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                        className="text-4xl lg:text-7xl bg-transparent font-black uppercase leading-[0.85] tracking-tighter outline-none w-full border-b border-white/5 focus:border-emerald-500/50 pb-4 transition-all"
                                        placeholder="NOMBRE DEL INVITADO"
                                    />
                                </div>
                                
                                <div className="mt-8 flex items-center gap-4">
                                    <p className={`text-2xl font-bold uppercase tracking-widest italic ${EMPRESAS_DOMINIOS[formData.correo.split("@")[1]] ? 'text-emerald-500' : 'text-gray-600'}`}>
                                        {formData.empresa || selectedGuest.empresa}
                                    </p>
                                    {EMPRESAS_DOMINIOS[formData.correo.split("@")[1]] && (
                                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                                            <Cpu className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Empresa Detectada</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-10 lg:p-14 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Identificador (Correo)</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-700 group-focus-within:text-emerald-500 transition-colors" />
                                                <input 
                                                    placeholder="mail@dominio.com" value={formData.correo} 
                                                    onChange={(e) => setFormData({...formData, correo: e.target.value})}
                                                    className="w-full h-20 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-8 font-black text-xl outline-none focus:border-emerald-500/50"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Empresa Detectada/Asignada</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-700" />
                                                <input 
                                                    value={formData.empresa} onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                                                    className="w-full h-20 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-8 font-black text-xl outline-none focus:border-emerald-500/50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Canal Móvil</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-700 group-focus-within:text-emerald-500 transition-colors" />
                                                <input 
                                                    placeholder="809-000-0000" value={formData.telefono} 
                                                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                                                    className="w-full h-20 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-8 font-black text-xl outline-none focus:border-emerald-500/50"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Rol Táctico</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-700" />
                                                <select 
                                                    value={formData.rol} onChange={(e) => setFormData({...formData, rol: e.target.value})}
                                                    className="w-full h-20 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-8 font-black text-xl outline-none focus:border-emerald-500/50 appearance-none"
                                                >
                                                    {ROLES_ESTRATEGICOS.map(r => <option key={r} value={r} className="bg-[#05080f]">{r}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reconfiguración de Mesa (1-14) */}
                                <div className="p-10 bg-emerald-500/[0.03] rounded-[2.5rem] border border-emerald-500/10 flex items-center justify-between shadow-2xl">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">{getIcon(selectedGuest.mesa)}</div>
                                        <div>
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">RECONFIGURACIÓN_MESA (1-14)</span>
                                            {!isEditingMesa ? (
                                                <p className="text-5xl font-black text-emerald-500 tracking-tighter">MESA {selectedGuest.mesa}</p>
                                            ) : (
                                                <div className="flex items-center gap-4 mt-2">
                                                    <input 
                                                        autoFocus type="number" min="1" max="14" value={tempMesa} 
                                                        onChange={(e) => setTempMesa(e.target.value)}
                                                        className="bg-white/10 border-2 border-emerald-500 rounded-xl px-4 py-2 text-3xl font-black w-24 outline-none text-center"
                                                    />
                                                    <button onClick={() => handleMesaUpdate(selectedGuest.id, tempMesa)} className="bg-emerald-600 px-6 py-4 rounded-xl font-black uppercase text-xs">ACTUALIZAR</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { setTempMesa(selectedGuest.mesa); setIsEditingMesa(!isEditingMesa); }} 
                                        className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-lg active:scale-90 transition-all hover:scale-105"
                                    >
                                        {isEditingMesa ? <X className="w-10 h-10 text-white" /> : <Layers className="w-10 h-10 text-white" />}
                                    </button>
                                </div>
                            </div>

                            <div className="p-10 lg:p-14 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row gap-8 items-center justify-between mt-auto">
                                <button onClick={() => { setSelectedGuest(null); setStatus('idle'); }} className="text-[12px] font-black text-gray-700 hover:text-white tracking-[0.5em] uppercase">DESCARTAR_NODO</button>
                                <button onClick={handleGrantAccess} className="w-full sm:w-auto px-24 py-10 bg-emerald-600 rounded-[2.5rem] text-white font-black uppercase tracking-[0.3em] shadow-[0_0_80px_#10b98150] hover:bg-emerald-500 active:scale-95 transition-all text-2xl flex items-center justify-center gap-4">
                                    CONCEDER ACCESO <ChevronRight className="w-8 h-8" />
                                </button>
                            </div>

                            <AnimatePresence>
                                {status !== 'idle' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[150] bg-[#05080f]/99 flex flex-col items-center justify-center p-12 text-center">
                                        {status === 'loading' && (
                                            <div className="space-y-12">
                                                <div className="w-40 h-40 border-[10px] border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                                                <p className="text-4xl font-black uppercase tracking-tighter animate-pulse text-emerald-500 italic">Analizando Nodo con DB_REACTIVE...</p>
                                            </div>
                                        )}
                                        {status === 'success' && (
                                            <div className="space-y-12">
                                                <div className="w-32 h-32 bg-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_0_100px_#10b981]"><CheckCircle2 className="w-16 h-16 text-white" /></div>
                                                <p className="text-8xl font-black text-emerald-500 tracking-tighter">LISTO</p>
                                                <p className="text-2xl font-bold italic text-gray-500 uppercase tracking-widest mt-6">Nodo Sincronizado en Red_2026</p>
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
            `}</style>
        </div>
    );
}
