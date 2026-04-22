"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { 
    Fingerprint, LayoutGrid, Search, CheckCircle2, X, Layers, Phone, Mail, 
    Radar, Cpu, Building2, Briefcase, Crown, Music, Coffee, ChevronRight, 
    WifiOff, RefreshCw, Edit3, ShieldCheck, Zap, Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = '/api'; 
const EVENT_ID = 'evt_circulo_001';

const EMPRESAS_DOMINIOS: Record<string, string> = {
    "coopseguros.com": "Coopseguros",
    "coopmaimon.com": "Coopmaimon",
    "renace.tech": "RenaceTech",
    "gmail.com": "Invitado Particular"
};

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

    const [formData, setFormData] = useState({ nombre: "", empresa: "", correo: "", telefono: "", rol: "Invitado" });
    const [isEditingMesa, setIsEditingMesa] = useState(false);
    const [tempMesa, setTempMesa] = useState("");

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
            setFormData({ nombre: selectedGuest.nombre, empresa: selectedGuest.empresa, correo: "", telefono: "", rol: "Invitado" });
            setTempMesa(selectedGuest.mesa);
            setIsEditingMesa(false);
        }
    }, [selectedGuest]);

    useEffect(() => {
        if (formData.correo.includes("@")) {
            const domain = formData.correo.split("@")[1].toLowerCase();
            if (EMPRESAS_DOMINIOS[domain]) setFormData(f => ({ ...f, empresa: EMPRESAS_DOMINIOS[domain] }));
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
                    mesa: tempMesa // Usamos la mesa editada
                })
            });
            if (res.ok) {
                setStatus('success');
                setInvitados(prev => prev.map(inv => inv.id === selectedGuest.id ? { ...inv, status: 'cleared', nombre: formData.nombre, empresa: formData.empresa, mesa: tempMesa } : inv));
                setTimeout(() => { setSelectedGuest(null); setStatus('idle'); }, 2000);
            } else { setStatus('error'); }
        } catch (e) { setStatus('error'); }
    };

    const filtered = useMemo(() => invitados.filter(i => 
        i.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || i.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, invitados]);

    const mesasIds = useMemo(() => Array.from(new Set(invitados.map(i => i.mesa))).sort((a,b) => parseInt(a) - parseInt(b)), [invitados]);

    return (
        <div className="min-h-screen bg-[#020408] text-white flex flex-col overflow-hidden">
            <nav className="h-20 border-b border-white/5 bg-[#020408]/90 backdrop-blur-2xl flex items-center justify-between px-6 md:px-12 z-50">
                <div className="flex items-center gap-4">
                    <Fingerprint className="w-8 h-8 text-emerald-500" />
                    <span className="text-xl font-black italic tracking-tighter uppercase hidden sm:block">Jairo_OS</span>
                </div>
                <div className="flex-1 max-w-md mx-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Identificar..." className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm focus:border-emerald-500/50 outline-none" />
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setView('grid')} className={`p-3 rounded-xl ${view === 'grid' ? 'bg-emerald-600' : 'bg-white/5'}`}><LayoutGrid className="w-5 h-5" /></button>
                    <button onClick={() => setView('tables')} className={`p-3 rounded-xl ${view === 'tables' ? 'bg-emerald-600' : 'bg-white/5'}`}><Layers className="w-5 h-5" /></button>
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
                {view === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map(inv => (
                            <div key={inv.id} onClick={() => setSelectedGuest(inv)} className={`p-8 rounded-[2rem] border transition-all cursor-pointer group ${inv.status === 'cleared' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[0.01] border-white/5 hover:border-emerald-500/30'}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="px-3 py-1 bg-white/5 rounded-md text-[10px] font-black text-gray-500 uppercase">Mesa {inv.mesa}</div>
                                    {inv.status === 'cleared' && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                                </div>
                                <h3 className="text-xl font-black uppercase leading-tight group-hover:text-emerald-400">{inv.nombre}</h3>
                                <p className="text-[10px] text-gray-600 font-black mt-3 uppercase tracking-widest italic">{inv.empresa}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {mesasIds.map(m => {
                            const guests = filtered.filter(i => i.mesa === m);
                            if (guests.length === 0) return null;
                            return (
                                <div key={m} className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8">
                                    <h3 className="text-2xl font-black italic uppercase mb-8 border-b border-white/5 pb-4">Mesa {m}</h3>
                                    <div className="space-y-4">
                                        {guests.map(inv => (
                                            <div key={inv.id} onClick={() => setSelectedGuest(inv)} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all cursor-pointer flex justify-between items-center">
                                                <span className="text-sm font-black uppercase">{inv.nombre}</span>
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

            <AnimatePresence>
                {selectedGuest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 backdrop-blur-3xl bg-black/80">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full max-w-4xl bg-[#0a0d14] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col max-h-[95vh] relative overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                <span className="text-[11px] font-black tracking-[0.4em] uppercase text-emerald-500 flex items-center gap-4"><ShieldCheck className="w-6 h-6" /> Protocolo de Acceso</span>
                                <button onClick={() => setSelectedGuest(null)} className="p-3 hover:bg-white/5 rounded-full"><X className="w-7 h-7 text-gray-500" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 md:p-16 space-y-12 custom-scrollbar">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-600 uppercase">Identidad del Nodo</label>
                                    <input value={formData.nombre} onChange={(e) => setFormData(f => ({ ...f, nombre: e.target.value }))} className="w-full bg-transparent border-b-2 border-white/10 text-4xl md:text-6xl font-black uppercase py-4 outline-none focus:border-emerald-500/60 transition-all italic" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-600 uppercase">Identificador (Correo)</label>
                                            <input value={formData.correo} onChange={(e) => setFormData(f => ({ ...f, correo: e.target.value }))} placeholder="ejemplo@dominio.com" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold focus:border-emerald-500/50 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-600 uppercase">Organización</label>
                                            <input value={formData.empresa} onChange={(e) => setFormData(f => ({ ...f, empresa: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold focus:border-emerald-500/50 outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-600 uppercase">Contacto (WhatsApp)</label>
                                            <input value={formData.telefono} onChange={(e) => setFormData(f => ({ ...f, telefono: e.target.value }))} placeholder="809-000-0000" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold focus:border-emerald-500/50 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-600 uppercase">Rol Táctico</label>
                                            <select value={formData.rol} onChange={(e) => setFormData(f => ({ ...f, rol: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold focus:border-emerald-500/50 outline-none appearance-none">
                                                <option value="Invitado">Invitado Particular</option>
                                                <option value="CEO">CEO / Directivo</option>
                                                <option value="Socio">Socio Estratégico</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Mando de Mesa (RECUPERADO) */}
                                <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-emerald-600/20 rounded-xl flex items-center justify-center border border-emerald-500/20"><Coffee className="text-emerald-500" /></div>
                                        <div>
                                            <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Ubicación Estratégica</span>
                                            {!isEditingMesa ? (
                                                <p className="text-3xl font-black italic uppercase">Sector_Mesa {tempMesa}</p>
                                            ) : (
                                                <input autoFocus type="number" value={tempMesa} onChange={(e) => setTempMesa(e.target.value)} className="bg-white/10 border-2 border-emerald-500 rounded-lg px-4 py-1 text-2xl font-black w-24 outline-none" />
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => setIsEditingMesa(!isEditingMesa)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                                        {isEditingMesa ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Edit3 className="w-6 h-6 text-gray-500" />}
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 md:p-12 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row gap-6 items-center justify-between">
                                <button onClick={() => setSelectedGuest(null)} className="text-[12px] font-black text-gray-700 hover:text-white uppercase transition-colors">Cancelar</button>
                                <button onClick={handleGrantAccess} className="w-full md:w-auto px-16 py-6 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-4 group">
                                    Validar Acceso <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>

                            <AnimatePresence>
                                {status !== 'idle' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[150] bg-black/95 flex flex-col items-center justify-center p-12 text-center">
                                        {status === 'loading' && <div className="space-y-8"><div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" /><p className="text-2xl font-black uppercase italic text-emerald-500">Sincronizando...</p></div>}
                                        {status === 'success' && <div className="space-y-8"><div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-[0_0_50px_#10b981]"><CheckCircle2 className="w-12 h-12 text-white" /></div><p className="text-5xl font-black italic uppercase">LISTO</p></div>}
                                        {status === 'error' && <div className="space-y-8"><div className="w-24 h-24 bg-red-500/20 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-red-500/50"><WifiOff className="w-12 h-12 text-red-500" /></div><p className="text-5xl font-black text-red-500 uppercase">Fallo_de_Red</p><p className="text-gray-500 font-bold max-w-md">No se pudo contactar con la API (404). Verifica logs del servidor.</p><button onClick={() => setStatus('idle')} className="w-full py-5 bg-red-500 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"><RefreshCw className="w-5 h-5" /> Reintentar</button></div>}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <style jsx global>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.1); border-radius: 10px; } input, select { -webkit-appearance: none; }`}</style>
        </div>
    );
}
