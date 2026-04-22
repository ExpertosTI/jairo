"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { 
    Fingerprint, LayoutGrid, Search, CheckCircle2, X, Layers, Phone, Mail, 
    Radar, Cpu, Building2, Briefcase, Crown, Music, Coffee, ChevronRight, 
    WifiOff, RefreshCw, Edit3, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- CONFIGURACIÓN ESTRATÉGICA ---
const API_BASE = '/api'; 
const EVENT_ID = 'evt_circulo_001';

const EMPRESAS_DOMINIOS: Record<string, string> = {
    "coopseguros.com": "Coopseguros",
    "coopmaimon.com": "Coopmaimon",
    "renace.tech": "RenaceTech",
    "gmail.com": "Invitado Particular"
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

export default function RecepcionPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [view, setView] = useState<'grid' | 'tables'>('grid');
    const [invitados, setInvitados] = useState(INITIAL_MANIFEST);
    const [selectedGuest, setSelectedGuest] = useState<any>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Estado del Formulario
    const [formData, setFormData] = useState({
        nombre: "",
        empresa: "",
        correo: "",
        telefono: "",
        rol: "Invitado"
    });

    // --- LÓGICA DE NEGOCIO ---
    const handleSync = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/events/${EVENT_ID}/attendance`);
            if (res.ok) {
                const data = await res.json();
                setInvitados(prev => prev.map(inv => {
                    const found = data.find((d: any) => String(d.guestId) === String(inv.id));
                    return found ? { ...inv, status: 'cleared' } : inv;
                }));
            }
        } catch (e) { console.warn("API Offline"); }
    }, []);

    useEffect(() => { handleSync(); }, [handleSync]);

    useEffect(() => {
        if (selectedGuest) {
            setFormData({
                nombre: selectedGuest.nombre,
                empresa: selectedGuest.empresa,
                correo: "",
                telefono: "",
                rol: "Invitado"
            });
        }
    }, [selectedGuest]);

    // Detección de Empresa por Dominio
    useEffect(() => {
        if (formData.correo.includes("@")) {
            const domain = formData.correo.split("@")[1].toLowerCase();
            if (EMPRESAS_DOMINIOS[domain]) {
                setFormData(f => ({ ...f, empresa: EMPRESAS_DOMINIOS[domain] }));
            }
        }
    }, [formData.correo]);

    const handleGrantAccess = async () => {
        if (!selectedGuest) return;
        setStatus('loading');
        try {
            const res = await fetch(`${API_BASE}/events/${EVENT_ID}/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestId: selectedGuest.id,
                    guestName: formData.nombre,
                    companyName: formData.empresa,
                    email: formData.correo,
                    phone: formData.telefono,
                    role: formData.rol,
                    mesa: selectedGuest.mesa
                })
            });
            if (res.ok) {
                setStatus('success');
                setInvitados(prev => prev.map(inv => inv.id === selectedGuest.id ? { ...inv, status: 'cleared', nombre: formData.nombre, empresa: formData.empresa } : inv));
                setTimeout(() => { setSelectedGuest(null); setStatus('idle'); }, 2000);
            } else { setStatus('error'); }
        } catch (e) { setStatus('error'); }
    };

    const filtered = useMemo(() => invitados.filter(i => 
        i.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        i.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, invitados]);

    const mesas = useMemo(() => Array.from(new Set(invitados.map(i => i.mesa))).sort((a,b) => parseInt(a) - parseInt(b)), [invitados]);

    return (
        <div className="min-h-screen bg-[#05070a] text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col">
            
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <Radar className="absolute -top-20 -right-20 w-96 h-96 text-emerald-500 animate-pulse" />
            </div>

            {/* Header Responsivo */}
            <header className="h-20 border-b border-white/5 bg-[#05070a]/80 backdrop-blur-xl flex items-center justify-between px-6 md:px-12 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        <Fingerprint className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-black tracking-tighter uppercase italic hidden sm:block">Jairo_Reception</h1>
                </div>

                <div className="flex-1 max-w-md mx-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar invitado..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm focus:border-emerald-500/50 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => setView('grid')} className={`p-2.5 rounded-lg transition-all ${view === 'grid' ? 'bg-emerald-600' : 'bg-white/5 text-gray-500'}`}><LayoutGrid className="w-5 h-5" /></button>
                    <button onClick={() => setView('tables')} className={`p-2.5 rounded-lg transition-all ${view === 'tables' ? 'bg-emerald-600' : 'bg-white/5 text-gray-500'}`}><Layers className="w-5 h-5" /></button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                {view === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map(inv => (
                            <div 
                                key={inv.id} onClick={() => setSelectedGuest(inv)}
                                className={`p-6 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98] ${inv.status === 'cleared' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[0.02] border-white/5 hover:border-emerald-500/30'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="px-3 py-1 bg-white/5 rounded-md text-[10px] font-black tracking-widest text-gray-400">MESA {inv.mesa}</div>
                                    {inv.status === 'cleared' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{inv.nombre}</h3>
                                <p className="text-xs text-gray-500 font-bold mt-2 uppercase">{inv.empresa}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {mesas.map(m => {
                            const guests = filtered.filter(i => i.mesa === m);
                            if (guests.length === 0) return null;
                            return (
                                <div key={m} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                                        <h3 className="text-xl font-black italic">Mesa {m}</h3>
                                        <span className="text-[10px] text-gray-600 font-black tracking-widest">{guests.length} NODOS</span>
                                    </div>
                                    <div className="space-y-3">
                                        {guests.map(inv => (
                                            <div key={inv.id} onClick={() => setSelectedGuest(inv)} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-emerald-500/30 transition-all cursor-pointer flex justify-between items-center">
                                                <span className="text-sm font-bold uppercase">{inv.nombre}</span>
                                                {inv.status === 'cleared' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Modal Profesional Responsivo */}
            <AnimatePresence>
                {selectedGuest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-2xl bg-black/80">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-4xl bg-[#0a0d14] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <ShieldCheck className="text-emerald-500 w-6 h-6" />
                                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-500">Protocolo de Acceso</span>
                                </div>
                                <button onClick={() => setSelectedGuest(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-6 h-6 text-gray-500" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
                                {/* Nombre Editable */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-600 tracking-widest uppercase">Corregir Nombre del Invitado</label>
                                    <div className="relative group">
                                        <Edit3 className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10 group-focus-within:text-emerald-500 transition-colors" />
                                        <input 
                                            value={formData.nombre} onChange={(e) => setFormData(f => ({ ...f, nombre: e.target.value }))}
                                            className="w-full bg-transparent border-b-2 border-white/10 text-3xl md:text-5xl font-black uppercase py-4 outline-none focus:border-emerald-500/50 transition-all tracking-tighter"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-600 tracking-widest uppercase">Correo Electrónico</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                                <input 
                                                    value={formData.correo} onChange={(e) => setFormData(f => ({ ...f, correo: e.target.value }))}
                                                    placeholder="ejemplo@dominio.com"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 outline-none focus:border-emerald-500/50"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-600 tracking-widest uppercase">Empresa / Institución</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                                <input 
                                                    value={formData.empresa} onChange={(e) => setFormData(f => ({ ...f, empresa: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 outline-none focus:border-emerald-500/50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-600 tracking-widest uppercase">Teléfono de Contacto</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                                <input 
                                                    value={formData.telefono} onChange={(e) => setFormData(f => ({ ...f, telefono: e.target.value }))}
                                                    placeholder="809-000-0000"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 outline-none focus:border-emerald-500/50"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-600 tracking-widest uppercase">Rol Estratégico</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                                <select 
                                                    value={formData.rol} onChange={(e) => setFormData(f => ({ ...f, rol: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 outline-none focus:border-emerald-500/50 appearance-none italic"
                                                >
                                                    <option value="Invitado">Invitado Particular</option>
                                                    <option value="CEO">CEO / Directivo</option>
                                                    <option value="Socio">Socio Estratégico</option>
                                                    <option value="Prensa">Prensa / Media</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center border border-emerald-500/20"><Coffee className="text-emerald-500" /></div>
                                        <div>
                                            <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Ubicación Asignada</span>
                                            <p className="text-2xl font-black italic">MESA {selectedGuest.mesa}</p>
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Sector Central</div>
                                </div>
                            </div>

                            <div className="p-8 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                                <button onClick={() => setSelectedGuest(null)} className="text-[10px] font-black text-gray-600 hover:text-white tracking-widest uppercase">Cancelar</button>
                                <button onClick={handleGrantAccess} className="w-full md:w-auto px-12 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg">
                                    Conceder Acceso <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Status Overlays */}
                            <AnimatePresence>
                                {status !== 'idle' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[150] bg-black/95 flex flex-col items-center justify-center p-10 text-center">
                                        {status === 'loading' && (
                                            <div className="space-y-6">
                                                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                                                <p className="text-xl font-black uppercase italic animate-pulse text-emerald-500">Sincronizando Nodo...</p>
                                            </div>
                                        )}
                                        {status === 'success' && (
                                            <div className="space-y-6">
                                                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_#10b981]"><CheckCircle2 className="w-10 h-10 text-white" /></div>
                                                <p className="text-4xl font-black uppercase tracking-tighter">VALIDADO</p>
                                                <p className="text-gray-500 font-bold">Registro persistido en el Stack Central</p>
                                            </div>
                                        )}
                                        {status === 'error' && (
                                            <div className="space-y-6">
                                                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/50"><WifiOff className="w-10 h-10 text-red-500" /></div>
                                                <p className="text-4xl font-black text-red-500 tracking-tighter">FALLO_DE_RED</p>
                                                <div className="max-w-xs space-y-4">
                                                    <p className="text-sm text-gray-500">No se pudo conectar con la API (404). Por favor, verifica la configuración de Traefik en el servidor.</p>
                                                    <button onClick={() => setStatus('idle')} className="w-full py-4 bg-red-500 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Reintentar</button>
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
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
                input, select { -webkit-appearance: none; }
            `}</style>
        </div>
    );
}
