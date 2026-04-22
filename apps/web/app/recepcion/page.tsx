"use client";

import { useState, useEffect } from "react";
import { 
    Users, Clock, ShieldCheck, Fingerprint, LayoutGrid, List, ChevronRight, 
    Search, Zap, CheckCircle2, X, Star, Layers, Plus, Save, Phone, Mail,
    Radar, Activity, Target, Shield, Globe, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- LISTA MAESTRA DE 103 INVITADOS (ACTUALIZADA) ---
const GUESTS_MAESTRO: any[] = [
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
    { id: "15", nombre: "Daylen Ventura", empresa: "Invitado", mesa: "15", status: 'pending' },
    { id: "16", nombre: "Rafael Olacio (Renso)", empresa: "Invitado", mesa: "16", status: 'pending' },
    { id: "17", nombre: "Yoco Oblate (Yaco)", empresa: "Invitado", mesa: "17", status: 'pending' },
    { id: "18", nombre: "Maximo Alcantara", empresa: "Invitado", mesa: "18", status: 'pending' },
    { id: "19", nombre: "Robinson Rodriguez", empresa: "Invitado", mesa: "19", status: 'pending' },
    { id: "20", nombre: "Ruben Perez", empresa: "Invitado", mesa: "20", status: 'pending' },
    { id: "21", nombre: "Jessica Duran", empresa: "Invitado", mesa: "21", status: 'pending' },
    { id: "22", nombre: "Cuba Deranis Chiong", empresa: "Invitado", mesa: "22", status: 'pending' },
    { id: "23", nombre: "Junior Baldera", empresa: "Invitado", mesa: "23", status: 'pending' },
    { id: "24", nombre: "Wellentong Baldera", empresa: "Invitado", mesa: "24", status: 'pending' },
    { id: "25", nombre: "Jose Baldera", empresa: "Invitado", mesa: "25", status: 'pending' },
    { id: "26", nombre: "Giancarlos Reynoso", empresa: "Invitado", mesa: "26", status: 'pending' },
    { id: "27", nombre: "Antonio Castillo (Maguiver)", empresa: "Invitado", mesa: "27", status: 'pending' },
    { id: "28", nombre: "Ramon Campusano (Chuky)", empresa: "Invitado", mesa: "28", status: 'pending' },
    { id: "29", nombre: "Felix Del Rosario (Chuky)", empresa: "Invitado", mesa: "29", status: 'pending' },
    { id: "30", nombre: "Luis Pabolo", empresa: "Invitado", mesa: "30", status: 'pending' },
    { id: "31", nombre: "Ramon Pascual (Mello)", empresa: "Invitado", mesa: "31", status: 'pending' },
    { id: "32", nombre: "Mirtha E. Perez (Popy)", empresa: "Invitado", mesa: "32", status: 'pending' },
    { id: "33", nombre: "Junior Santos", empresa: "Invitado", mesa: "33", status: 'pending' },
    { id: "34", nombre: "Juan de los Santos (Niño)", empresa: "Invitado", mesa: "34", status: 'pending' },
    { id: "35", nombre: "Ruben Mocana", empresa: "Invitado", mesa: "35", status: 'pending' },
    { id: "36", nombre: "Edward Lorenzo", empresa: "Invitado", mesa: "36", status: 'pending' },
    { id: "37", nombre: "Daniel Lorenzo", empresa: "Invitado", mesa: "37", status: 'pending' },
    { id: "38", nombre: "Maria Vazquez", empresa: "Invitado", mesa: "38", status: 'pending' },
    { id: "39", nombre: "Francisco Confesor", empresa: "Invitado", mesa: "39", status: 'pending' },
    { id: "40", nombre: "Eliandy Confesor", empresa: "Invitado", mesa: "40", status: 'pending' },
    { id: "41", nombre: "Mariely Andreina de la Cruz", empresa: "Invitado", mesa: "41", status: 'pending', isVIP: true },
    { id: "42", nombre: "Miguel Herasme", empresa: "Invitado", mesa: "42", status: 'pending' },
    { id: "43", nombre: "Sergio Calafat", empresa: "Invitado", mesa: "43", status: 'pending' },
    { id: "44", nombre: "Bladimir Nuñez", empresa: "Invitado", mesa: "44", status: 'pending' },
    { id: "45", nombre: "Alvaro Solano", empresa: "Invitado", mesa: "45", status: 'pending' },
    { id: "46", nombre: "Claudia Flores", empresa: "Invitado", mesa: "46", status: 'pending' },
    { id: "47", nombre: "Mark", empresa: "Invitado", mesa: "47", status: 'pending' },
    { id: "48", nombre: "Abiattar Contreras", empresa: "Invitado", mesa: "48", status: 'pending' },
    { id: "49", nombre: "Musico 1", empresa: "Musicos", mesa: "49", status: 'pending' },
    { id: "50", nombre: "Musico 2", empresa: "Musicos", mesa: "50", status: 'pending' },
    { id: "51", nombre: "Musico 3", empresa: "Musicos", mesa: "51", status: 'pending' },
    { id: "52", nombre: "Musico 4", empresa: "Musicos", mesa: "52", status: 'pending' },
    { id: "53", nombre: "Musico 5", empresa: "Musicos", mesa: "53", status: 'pending' },
    { id: "54", nombre: "Adderly Marte", empresa: "Invitado", mesa: "54", status: 'pending' },
    { id: "55", nombre: "Luciano", empresa: "Invitado", mesa: "55", status: 'pending' },
    { id: "56", nombre: "Cespedes", empresa: "Invitado", mesa: "56", status: 'pending' },
    { id: "57", nombre: "Anyra", empresa: "Invitado", mesa: "57", status: 'pending' },
    { id: "58", nombre: "Isaisas", empresa: "Invitado", mesa: "58", status: 'pending' },
    { id: "59", nombre: "Ass.", empresa: "Invitado", mesa: "59", status: 'pending' },
    { id: "64", nombre: "Lucia Lopez", empresa: "Invitado", mesa: "64", status: 'pending' },
    { id: "65", nombre: "Carvajal Claudio", empresa: "Invitado", mesa: "65", status: 'pending' },
    { id: "66", nombre: "Carlos Bido", empresa: "Invitado", mesa: "66", status: 'pending' },
    { id: "67", nombre: "Moscar Melo", empresa: "Invitado", mesa: "67", status: 'pending' },
    { id: "68", nombre: "Moscar Soto", empresa: "Invitado", mesa: "68", status: 'pending' },
    { id: "69", nombre: "Juan (Pan)", empresa: "Invitado", mesa: "69", status: 'pending' },
    { id: "70", nombre: "Eliel Bassa", empresa: "Invitado", mesa: "70", status: 'pending' },
    { id: "71", nombre: "Eduardo Dua", empresa: "Invitado", mesa: "71", status: 'pending' },
    { id: "72", nombre: "Elsa Encarnacion", empresa: "Invitado", mesa: "72", status: 'pending' },
    { id: "73", nombre: "J. Hanna Cordero", empresa: "Invitado", mesa: "73", status: 'pending', isVIP: true },
    { id: "74", nombre: "Melda Adams", empresa: "Invitado", mesa: "74", status: 'pending' },
    { id: "75", nombre: "Norman Lozano", empresa: "Invitado", mesa: "75", status: 'pending' },
    { id: "76", nombre: "Jesus Osorio", empresa: "Invitado", mesa: "76", status: 'pending' },
    { id: "77", nombre: "Ariel Peña", empresa: "Invitado", mesa: "77", status: 'pending' },
    { id: "78", nombre: "Sindry Gomez", empresa: "Invitado", mesa: "78", status: 'pending' },
    { id: "79", nombre: "Candida Duares", empresa: "Invitado", mesa: "79", status: 'pending' },
    { id: "80", nombre: "Leonela Contreras", empresa: "Invitado", mesa: "80", status: 'pending' },
    { id: "81", nombre: "Zailon", empresa: "Invitado", mesa: "81", status: 'pending' },
    { id: "82", nombre: "Maniga", empresa: "Invitado", mesa: "82", status: 'pending' },
    { id: "83", nombre: "Winston Santos", empresa: "Invitado", mesa: "83", status: 'pending' },
    { id: "84", nombre: "Romelio", empresa: "Invitado", mesa: "84", status: 'pending' },
    { id: "85", nombre: "Esmartin Mila", empresa: "Invitado", mesa: "85", status: 'pending' },
    { id: "86", nombre: "Stacy Milan", empresa: "Invitado", mesa: "86", status: 'pending' },
    { id: "87", nombre: "Morenito", empresa: "Invitado", mesa: "87", status: 'pending' },
    { id: "88", nombre: "Socrates Noris", empresa: "Invitado", mesa: "88", status: 'pending' },
    { id: "89", nombre: "Maximiliano Almonte", empresa: "Invitado", mesa: "89", status: 'pending' },
    { id: "90", nombre: "Digna Sanchez", empresa: "Invitado", mesa: "90", status: 'pending' },
    { id: "91", nombre: "Coopseguros 1", empresa: "Coopseguros", mesa: "91", status: 'pending' },
    { id: "92", nombre: "Coopseguros 2", empresa: "Coopseguros", mesa: "92", status: 'pending' },
    { id: "93", nombre: "Coopseguros 3", empresa: "Coopseguros", mesa: "93", status: 'pending' },
    { id: "94", nombre: "Coopseguros 4", empresa: "Coopseguros", mesa: "94", status: 'pending' },
    { id: "95", nombre: "Coopseguros 5", empresa: "Coopseguros", mesa: "95", status: 'pending' },
    { id: "96", nombre: "Coopseguros 6", empresa: "Coopseguros", mesa: "96", status: 'pending' },
    { id: "97", nombre: "Coopmaimon 1", empresa: "Coopmaimon", mesa: "97", status: 'pending' },
    { id: "98", nombre: "Coopmaimon 2", empresa: "Coopmaimon", mesa: "98", status: 'pending' },
    { id: "99", nombre: "Coopmaimon 3", empresa: "Coopmaimon", mesa: "99", status: 'pending' },
    { id: "100", nombre: "Coopmaimon 4", empresa: "Coopmaimon", mesa: "100", status: 'pending' },
    { id: "101", nombre: "Coopmaimon 5", empresa: "Coopmaimon", mesa: "101", status: 'pending' },
    { id: "102", nombre: "Coopmaimon 6", empresa: "Coopmaimon", mesa: "102", status: 'pending' },
    { id: "103", nombre: "Coopmaimon 7", empresa: "Coopmaimon", mesa: "103", status: 'pending' },
];

export default function RecepcionCommandCenter() {
    const [view, setView] = useState<'tables' | 'directory'>('directory');
    const [searchTerm, setSearchTerm] = useState("");
    const [invitados, setInvitados] = useState(GUESTS_MAESTRO);
    const [selectedGuest, setSelectedGuest] = useState<any>(null);
    const [aiProcessing, setAiProcessing] = useState(false);
    const [aiComplete, setAiComplete] = useState(false);
    
    const [isEditingMesa, setIsEditingMesa] = useState(false);
    const [tempMesa, setTempMesa] = useState("");

    const API_BASE = 'https://jairoapp.renace.tech/api';
    const EVENT_ID = 'evt_circulo_001';

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await fetch(`${API_BASE}/events/${EVENT_ID}/attendance`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setInvitados(prev => prev.map(inv => {
                        const isCleared = data.find((a: any) => String(a.guestId) === String(inv.id));
                        return isCleared ? { ...inv, status: 'cleared' } : inv;
                    }));
                }
            } catch (error) { console.error('Error:', error); }
        };
        fetchAttendance();
    }, []);

    const handleGrantAccess = async () => {
        if (!selectedGuest) return;
        setAiProcessing(true);
        try {
            const res = await fetch(`${API_BASE}/events/${EVENT_ID}/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestId: selectedGuest.id,
                    guestName: selectedGuest.nombre,
                    companyName: selectedGuest.empresa
                })
            });
            if (res.ok) {
                setTimeout(() => {
                    setAiComplete(true);
                    setInvitados(prev => prev.map(inv => inv.id === selectedGuest.id ? { ...inv, status: 'cleared' } : inv));
                    setTimeout(() => {
                        setAiProcessing(false);
                        setAiComplete(false);
                        setSelectedGuest(null);
                    }, 3000);
                }, 2000);
            }
        } catch (e) { setAiProcessing(false); }
    };

    const handleMoveGuest = (guestId: string, newMesa: string) => {
        setInvitados(prev => prev.map(inv => inv.id === guestId ? { ...inv, mesa: newMesa } : inv));
        if (selectedGuest && selectedGuest.id === guestId) {
            setSelectedGuest({ ...selectedGuest, mesa: newMesa });
        }
        setIsEditingMesa(false);
    };

    const filtered = invitados.filter(inv => 
        inv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        inv.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.mesa.includes(searchTerm)
    );

    const mesasIds = Array.from(new Set(invitados.map(i => i.mesa))).sort((a,b) => parseInt(a) - parseInt(b));

    return (
        <div className="min-h-screen bg-[#020408] text-white font-sans selection:bg-emerald-500/30 flex flex-col relative overflow-hidden">
            
            {/* Background 2026 Telemetry */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#10b98120,transparent_70%)]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="absolute top-20 right-20 flex flex-col items-end gap-2 font-mono text-[8px] text-emerald-500/40 uppercase tracking-widest">
                    <span>STRATEGIC_OS_v2026.04</span>
                    <span>LAT: 18.4861° N</span>
                    <span>LNG: 69.9312° W</span>
                    <div className="flex gap-1 mt-2">
                        <div className="w-1 h-1 bg-emerald-500/50 animate-pulse" />
                        <div className="w-1 h-1 bg-emerald-500/50 animate-pulse delay-75" />
                        <div className="w-1 h-1 bg-emerald-500/50 animate-pulse delay-150" />
                    </div>
                </div>
            </div>

            {/* Nav Principal - Responsivo */}
            <nav className="h-20 lg:h-24 border-b border-white/5 bg-[#020408]/80 backdrop-blur-3xl flex items-center justify-between px-6 lg:px-12 z-50 sticky top-0 shadow-2xl">
                <div className="flex items-center gap-6 lg:gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-400/20">
                            <Fingerprint className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl lg:text-2xl font-black uppercase tracking-tighter italic block leading-none">JairoAcceso</span>
                            <span className="text-[7px] lg:text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] mt-1">STRATEGY 2026</span>
                        </div>
                    </div>
                    <div className="relative w-[200px] md:w-[350px] lg:w-[450px]">
                        <Search className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-4 lg:w-5 h-4 lg:h-5 text-gray-700" />
                        <input 
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-full py-3 lg:py-5 pl-12 lg:pl-16 pr-6 lg:pr-8 text-sm lg:text-lg font-bold focus:border-emerald-500/50 outline-none transition-all placeholder:text-gray-800 shadow-inner"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setView('directory')} className={`p-3 lg:p-4 rounded-xl transition-all ${view === 'directory' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-gray-500 hover:text-gray-300'}`}><LayoutGrid className="w-5 h-5 lg:w-6 lg:h-6" /></button>
                    <button onClick={() => setView('tables')} className={`p-3 lg:p-4 rounded-xl transition-all ${view === 'tables' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-gray-500 hover:text-gray-300'}`}><Layers className="w-5 h-5 lg:w-6 lg:h-6" /></button>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden z-10">
                {/* Telemetría Lateral Compacta */}
                <aside className="hidden md:flex w-24 lg:w-72 border-r border-white/5 p-6 lg:p-10 flex-col gap-6 lg:gap-10 bg-[#020408]/50">
                    <div className="p-6 lg:p-8 rounded-[2rem] lg:rounded-[3rem] bg-white/[0.02] border border-white/5 text-center lg:text-left transition-all hover:bg-white/[0.04]">
                        <Users className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 mb-4 lg:mb-6 mx-auto lg:mx-0" />
                        <p className="hidden lg:block text-[10px] font-black text-gray-600 uppercase tracking-widest">Manifiesto</p>
                        <p className="text-3xl lg:text-6xl font-black mt-1 lg:mt-2 tracking-tighter">103</p>
                    </div>
                    <div className="p-6 lg:p-8 rounded-[2rem] lg:rounded-[3rem] bg-emerald-500/[0.03] border border-emerald-500/10 text-center lg:text-left transition-all hover:bg-emerald-500/[0.05]">
                        <CheckCircle2 className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-500 mb-4 lg:mb-6 mx-auto lg:mx-0" />
                        <p className="hidden lg:block text-[10px] font-black text-emerald-600 uppercase tracking-widest">Validados</p>
                        <p className="text-3xl lg:text-6xl font-black mt-1 lg:mt-2 text-emerald-500 tracking-tighter">
                            {invitados.filter(i => i.status === 'cleared').length}
                        </p>
                    </div>
                    <div className="mt-auto hidden lg:block p-8 border-t border-white/5">
                        <div className="flex items-center gap-3 text-emerald-500/40 animate-pulse">
                            <Activity className="w-4 h-4" />
                            <span className="text-[8px] font-black tracking-widest uppercase">Sistema Activo</span>
                        </div>
                    </div>
                </aside>

                {/* Grid Principal - Responsivo Real */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar pb-32">
                    {view === 'directory' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                            <AnimatePresence>
                                {filtered.map((inv) => (
                                    <motion.div 
                                        key={inv.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => setSelectedGuest(inv)}
                                        className={`p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3.5rem] border cursor-pointer transition-all bg-white/[0.02] relative group active:scale-95 ${inv.status === 'cleared' ? 'border-emerald-500/30 bg-emerald-500/[0.03]' : 'border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04]'}`}
                                    >
                                        <div className="flex justify-between items-center mb-6 lg:mb-8">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${inv.status === 'cleared' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-gray-800'}`} />
                                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">MESA {inv.mesa}</span>
                                            </div>
                                            {inv.isVIP && <div className="px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20"><Star className="w-3 h-3 text-amber-500 fill-amber-500" /></div>}
                                        </div>
                                        <h3 className="text-xl lg:text-2xl font-black uppercase leading-tight group-hover:text-emerald-400 transition-colors">{inv.nombre}</h3>
                                        <p className="text-[9px] lg:text-[11px] font-bold text-gray-700 uppercase mt-3 tracking-widest">{inv.empresa}</p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
                            {mesasIds.map(mesaId => {
                                const mesaInvs = filtered.filter(i => i.mesa === mesaId);
                                if (searchTerm && mesaInvs.length === 0) return null;
                                return (
                                    <div key={mesaId} className="p-8 lg:p-10 rounded-[3rem] lg:rounded-[4rem] bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all group">
                                        <h3 className="text-xl lg:text-2xl font-black uppercase mb-6 lg:mb-8 border-b border-white/5 pb-4 flex justify-between items-center">
                                            <span>Mesa {mesaId}</span>
                                            <span className="text-[9px] text-gray-700 tracking-[0.3em]">{mesaInvs.length} NODOS</span>
                                        </h3>
                                        <div className="space-y-4 lg:space-y-6">
                                            {mesaInvs.map(inv => (
                                                <div key={inv.id} onClick={() => setSelectedGuest(inv)} className={`p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border flex justify-between items-center cursor-pointer transition-all active:scale-95 ${inv.status === 'cleared' ? 'border-emerald-500/20 bg-emerald-500/[0.05]' : 'border-white/5 hover:border-emerald-500/30'}`}>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm lg:text-base font-black uppercase leading-tight">{inv.nombre}</span>
                                                        <span className="text-[8px] font-bold text-gray-700 uppercase mt-1 tracking-widest">{inv.empresa}</span>
                                                    </div>
                                                    {inv.status === 'cleared' && <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-500" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Táctico 2026 - Responsivo Real */}
            <AnimatePresence>
                {selectedGuest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 lg:p-20 backdrop-blur-[20px] bg-black/80 overflow-y-auto">
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-[1100px] bg-[#05080f] rounded-[3rem] lg:rounded-[5rem] border border-white/10 overflow-hidden flex flex-col lg:flex-row relative shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                            
                            {/* Decorative Background for Modal */}
                            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                                <Radar className="absolute -bottom-20 -left-20 w-80 h-80 text-emerald-500 animate-pulse" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[1px] bg-emerald-500/20 rotate-12" />
                            </div>

                            {/* Panel Izquierdo - Datos Estratégicos */}
                            <div className="w-full lg:w-[45%] bg-white/[0.02] p-8 lg:p-20 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center relative z-10">
                                <div className="flex justify-between items-center mb-10 lg:hidden">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-white" /></div>
                                        <span className="text-[10px] font-black tracking-widest">VERIFICACIÓN 2026</span>
                                    </div>
                                    <button onClick={() => { setSelectedGuest(null); setIsEditingMesa(false); }} className="p-3 bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
                                </div>
                                <div className="hidden lg:flex px-6 py-2 bg-emerald-500/10 text-emerald-500 rounded-full items-center gap-3 mb-10 font-black text-[9px] uppercase tracking-[0.3em] border border-emerald-500/10 w-fit"><Target className="w-4 h-4" /> ASIGNACIÓN TÁCTICA</div>
                                <h2 className="text-4xl lg:text-7xl font-black uppercase leading-[0.9] mb-4 lg:mb-8 tracking-tighter text-white">{selectedGuest.nombre}</h2>
                                <p className="text-xl lg:text-3xl font-bold text-gray-500 uppercase tracking-[0.2em] mb-12 lg:mb-16 italic">{selectedGuest.empresa}</p>
                                
                                <div className="p-8 lg:p-12 bg-white/[0.03] rounded-[2rem] lg:rounded-[3.5rem] border border-white/5 relative group shadow-2xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-[9px] lg:text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">UBICACIÓN_NODO</span>
                                        <Globe className="w-4 h-4 text-emerald-500/40" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        {!isEditingMesa ? (
                                            <>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-4xl lg:text-7xl font-black text-emerald-500 tracking-tighter"># {selectedGuest.mesa}</span>
                                                    <span className="text-[10px] font-black text-emerald-500/40 uppercase">Mesa</span>
                                                </div>
                                                <button 
                                                    onClick={() => { setTempMesa(selectedGuest.mesa); setIsEditingMesa(true); }}
                                                    className="w-16 h-16 lg:w-20 lg:h-20 bg-emerald-600 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-emerald-500"
                                                >
                                                    <Layers className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-3 w-full">
                                                <input 
                                                    autoFocus type="number" value={tempMesa} onChange={(e) => setTempMesa(e.target.value)}
                                                    className="bg-white/10 border-2 border-emerald-500 rounded-2xl px-6 py-4 lg:py-6 text-3xl lg:text-5xl font-black w-24 lg:w-40 outline-none text-center"
                                                />
                                                <button onClick={() => handleMoveGuest(selectedGuest.id, tempMesa)} className="flex-1 bg-emerald-500 rounded-2xl py-6 lg:py-8 font-black uppercase text-xs tracking-widest shadow-lg">ACTUALIZAR</button>
                                                <button onClick={() => setIsEditingMesa(false)} className="w-16 h-16 lg:w-20 lg:h-20 bg-white/5 rounded-2xl flex items-center justify-center"><X className="w-6 h-6" /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Panel Derecho - Inputs Estilo bx.renace.tech */}
                            <div className="flex-1 p-8 lg:p-24 relative flex flex-col justify-center bg-black/20 z-10">
                                <button onClick={() => { setSelectedGuest(null); setIsEditingMesa(false); }} className="absolute top-12 right-12 w-16 h-16 bg-white/5 rounded-3xl hidden lg:flex items-center justify-center hover:bg-white/10 transition-all shadow-xl group"><X className="group-hover:rotate-90 transition-transform" /></button>
                                
                                <div className="space-y-6 lg:space-y-8">
                                    <div className="group relative">
                                        <div className="absolute left-8 lg:left-10 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                            <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700 group-focus-within:text-emerald-500 transition-colors" />
                                            <div className="w-[1px] h-6 bg-white/10" />
                                        </div>
                                        <input placeholder="809-000-0000" className="w-full h-20 lg:h-24 bg-white/[0.02] rounded-[1.5rem] lg:rounded-[2rem] pl-24 lg:pl-32 pr-8 font-black text-2xl lg:text-3xl outline-none border border-white/5 focus:border-emerald-500/40 transition-all shadow-inner placeholder:text-gray-900" />
                                    </div>
                                    <div className="group relative">
                                        <div className="absolute left-8 lg:left-10 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                            <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700 group-focus-within:text-emerald-500 transition-colors" />
                                            <div className="w-[1px] h-6 bg-white/10" />
                                        </div>
                                        <input placeholder="CORREO_ELECTRÓNICO" className="w-full h-20 lg:h-24 bg-white/[0.02] rounded-[1.5rem] lg:rounded-[2rem] pl-24 lg:pl-32 pr-8 font-black text-2xl lg:text-3xl outline-none border border-white/5 focus:border-emerald-500/40 transition-all shadow-inner placeholder:text-gray-900" />
                                    </div>
                                </div>

                                <div className="mt-16 lg:mt-24 flex flex-col sm:flex-row gap-6 items-center justify-between">
                                    <button onClick={() => setSelectedGuest(null)} className="text-[10px] font-black text-gray-700 hover:text-white transition-all tracking-[0.4em] order-2 sm:order-1">ABORTAR_PROCESO</button>
                                    <button onClick={handleGrantAccess} className="w-full sm:w-auto px-16 lg:px-24 py-8 lg:py-10 bg-emerald-600 rounded-[2rem] text-white font-black uppercase tracking-[0.3em] shadow-[0_0_80px_rgba(16,185,129,0.3)] active:scale-95 transition-all text-lg lg:text-xl order-1 sm:order-2 flex items-center justify-center gap-4">
                                        CONCEDER ACCESO <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* AI Hud Optimization - 2026 Style */}
                                <AnimatePresence>
                                    {aiProcessing && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 bg-[#05080f]/99 flex flex-col items-center justify-center p-20 text-center">
                                            {!aiComplete ? (
                                                <div className="space-y-12">
                                                    <div className="relative w-48 h-48 mx-auto">
                                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-dashed border-emerald-500/30 rounded-full" />
                                                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} className="absolute inset-6 border-b-2 border-emerald-500 rounded-full shadow-[0_0_30px_#10b981]" />
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                            <Cpu className="w-12 h-12 text-emerald-500 mb-2" />
                                                            <span className="text-[8px] font-black text-emerald-500">SYNC_2026</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-3xl font-black uppercase italic tracking-widest text-emerald-500">Analizando Perfil Estratégico...</p>
                                                </div>
                                            ) : (
                                                <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} className="space-y-12">
                                                    <div className="w-32 h-32 bg-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_0_100px_rgba(16,185,129,0.6)]">
                                                        <ShieldCheck className="w-16 h-16 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-8xl font-black text-emerald-500 tracking-tighter">LISTO</p>
                                                        <p className="text-xl font-bold italic text-gray-500 uppercase tracking-widest mt-4">Acceso Estratégico_2026 Confirmado</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.1); border-radius: 20px; }
                input[type="number"]::-webkit-inner-spin-button, 
                input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            `}</style>
        </div>
    );
}
