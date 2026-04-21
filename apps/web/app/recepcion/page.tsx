"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
    LayoutDashboard, Users, Clock, ShieldCheck, 
    Fingerprint, LayoutGrid, List, ChevronRight, 
    Search, Activity, Target, Zap, CheckCircle2,
    X, Phone, Mail, MapPin, Sparkles, Loader2,
    Lock, Star, Briefcase, ShieldAlert, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Tipos de Datos ---
interface Invitado {
    id: string;
    nombre: string;
    empresa: string;
    mesa: string;
    status: 'pending' | 'cleared';
    isVIP?: boolean;
    nivel?: 'VIP' | 'Directivo' | 'Invitado';
}

// --- DATA DIGITADA DESDE EL CUADERNO ---
const GUESTS_FROM_NOTEBOOK: Invitado[] = [
    { id: "1", nombre: "Angel Flores", empresa: "Invitado", mesa: "1", status: 'pending' },
    { id: "2", nombre: "Eduardo Lama", empresa: "Invitado", mesa: "2", status: 'pending' },
    { id: "3", nombre: "Ivan Diaz", empresa: "Invitado", mesa: "3", status: 'pending' },
    { id: "4", nombre: "Manuel Gutierrez", empresa: "Invitado", mesa: "4", status: 'pending' },
    { id: "5", nombre: "Anaisa Perez", empresa: "Invitado", mesa: "5", status: 'pending' },
    { id: "6", nombre: "Nelvis Taveras", empresa: "Invitado", mesa: "6", status: 'pending' },
    { id: "7", nombre: "Marigruz", empresa: "Invitado", mesa: "7", status: 'pending' },
    { id: "8", nombre: "Josefina", empresa: "Invitado", mesa: "8", status: 'pending' },
    { id: "9", nombre: "Burak Gulbahar", empresa: "Invitado", mesa: "9", status: 'pending' },
    { id: "10", nombre: "Gilbert Ramirez", empresa: "Invitado", mesa: "10", status: 'pending' },
    { id: "11", nombre: "Carlos Antonio", empresa: "Invitado", mesa: "11", status: 'pending' },
    { id: "12", nombre: "Ariel Lima", empresa: "Invitado", mesa: "12", status: 'pending' },
    { id: "13", nombre: "Juan Acosta", empresa: "Invitado", mesa: "13", status: 'pending' },
    { id: "14", nombre: "Engerberto Reynoso (Kike)", empresa: "Invitado", mesa: "14", status: 'pending' },
    { id: "15", nombre: "Daylen Ventura", empresa: "Invitado", mesa: "15", status: 'pending' },
    { id: "16", nombre: "Rafael Olacio (Renso)", empresa: "Invitado", mesa: "16", status: 'pending' },
    { id: "17", nombre: "Yoco Olbite (Yaco)", empresa: "Invitado", mesa: "17", status: 'pending' },
    { id: "18", nombre: "Maximo Alcantara", empresa: "Invitado", mesa: "18", status: 'pending' },
    { id: "19", nombre: "Robinson Rodriguez", empresa: "Invitado", mesa: "19", status: 'pending' },
    { id: "20", nombre: "Ruben Perez", empresa: "Invitado", mesa: "20", status: 'pending' },
    { id: "21", nombre: "Jessica Duran", empresa: "Invitado", mesa: "21", status: 'pending' },
    { id: "22", nombre: "Cuba Denanis Chiong", empresa: "Invitado", mesa: "22", status: 'pending' },
    { id: "23", nombre: "Junior Baldera", empresa: "Invitado", mesa: "23", status: 'pending' },
    { id: "24", nombre: "Wellentong Baldera", empresa: "Invitado", mesa: "24", status: 'pending' },
    { id: "25", nombre: "Jose Baldera", empresa: "Invitado", mesa: "25", status: 'pending' },
    { id: "26", nombre: "Giancarlos Reynoso", empresa: "Invitado", mesa: "26", status: 'pending' },
    { id: "27", nombre: "Antonio Castillo (Maguiver)", empresa: "Invitado", mesa: "27", status: 'pending' },
    { id: "28", nombre: "Ramon Campusano (Chuky)", empresa: "Invitado", mesa: "28", status: 'pending' },
    { id: "29", nombre: "Felix del Rosario (Chuky)", empresa: "Invitado", mesa: "29", status: 'pending' },
    { id: "30", nombre: "Luis Pablo", empresa: "Invitado", mesa: "30", status: 'pending' },
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
    { id: "41", nombre: "Mariely Andreina de la Cruz", empresa: "Invitado", mesa: "41", status: 'pending', isVIP: true, nivel: 'VIP' },
    { id: "42", nombre: "Miguel Herasme", empresa: "Invitado", mesa: "42", status: 'pending' },
    { id: "43", nombre: "Sergio Calafat", empresa: "Invitado", mesa: "43", status: 'pending' },
    { id: "44", nombre: "Bladimir Nuñez", empresa: "Invitado", mesa: "44", status: 'pending' },
    { id: "45", nombre: "Alvaro Solano", empresa: "Invitado", mesa: "45", status: 'pending' },
    { id: "46", nombre: "Claudia Flores", empresa: "Invitado", mesa: "46", status: 'pending' },
    { id: "47", nombre: "Mark", empresa: "Invitado", mesa: "47", status: 'pending' },
    { id: "48", nombre: "Abiatar Contreras", empresa: "Invitado", mesa: "48", status: 'pending' },
    { id: "54", nombre: "Adherlin", empresa: "Invitado", mesa: "54", status: 'pending' },
    { id: "55", nombre: "Luciano", empresa: "Invitado", mesa: "55", status: 'pending' },
    { id: "56", nombre: "Cespedes", empresa: "Invitado", mesa: "56", status: 'pending' },
    { id: "64", nombre: "Lucia Lopez", empresa: "Invitado", mesa: "64", status: 'pending' },
    { id: "65", nombre: "Carvajal Claudio", empresa: "Invitado", mesa: "65", status: 'pending' },
    { id: "66", nombre: "Carlos Bido", empresa: "Invitado", mesa: "66", status: 'pending' },
    { id: "67", nombre: "Moscar Melo", empresa: "Invitado", mesa: "67", status: 'pending' },
    { id: "68", nombre: "Moscar Soto", empresa: "Invitado", mesa: "68", status: 'pending' },
    { id: "73", nombre: "J. Hanna Cordero", empresa: "Invitado", mesa: "73", status: 'pending', isVIP: true, nivel: 'VIP' },
    { id: "74", nombre: "Melda Adams", empresa: "Invitado", mesa: "74", status: 'pending' },
    { id: "75", nombre: "Norman Lozano", empresa: "Invitado", mesa: "75", status: 'pending' },
    { id: "76", nombre: "Jesus Osorio", empresa: "Invitado", mesa: "76", status: 'pending' },
    { id: "83", nombre: "Winston Santos", empresa: "Invitado", mesa: "83", status: 'pending', nivel: 'Directivo' },
    { id: "84", nombre: "Romelio", empresa: "Invitado", mesa: "84", status: 'pending' },
    { id: "87", nombre: "Morenito", empresa: "Invitado", mesa: "87", status: 'pending' },
    { id: "90", nombre: "Digna Sanchez", empresa: "Invitado", mesa: "90", status: 'pending' },
    { id: "91", nombre: "Coopseguros 01", empresa: "Coopseguros", mesa: "91", status: 'pending' },
    { id: "97", nombre: "Coopmaimon 01", empresa: "Coopmaimon", mesa: "97", status: 'pending' },
];

export default function RecepcionCommandCenter() {
    const [view, setView] = useState<'tables' | 'directory'>('directory');
    const [filter, setFilter] = useState<'all' | 'pending' | 'cleared' | 'vip'>('all');
    const [searchTerm, setSearchTerm] = useState("");
    const [invitados, setInvitados] = useState<Invitado[]>(GUESTS_FROM_NOTEBOOK);
    const [selectedGuest, setSelectedGuest] = useState<Invitado | null>(null);
    const [aiProcessing, setAiProcessing] = useState(false);
    const [aiComplete, setAiComplete] = useState(false);
    const [cargandoDB, setCargandoDB] = useState(true);
    const [draggingGuest, setDraggingGuest] = useState<Invitado | null>(null);

    // --- Cargar estado real desde la DB ---
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const apiUrl = 'https://jairoapp.renace.tech/api';
                const res = await fetch(`${apiUrl}/events/evt_circulo_001/attendance`);
                const data = await res.json();
                
                if (Array.isArray(data)) {
                    setInvitados(prev => prev.map(inv => {
                        const isCleared = data.find((a: any) => a.guestId === inv.id);
                        return isCleared ? { ...inv, status: 'cleared' } : inv;
                    }));
                }
            } catch (error) {
                console.error('Error cargando asistencia:', error);
            } finally {
                setCargandoDB(false);
            }
        };
        fetchAttendance();
    }, []);

    // --- Efecto de Check-in Real con IA ---
    const handleGrantAccess = async () => {
        if (!selectedGuest) return;
        setAiProcessing(true);
        try {
            const apiUrl = 'https://jairoapp.renace.tech/api';
            await fetch(`${apiUrl}/events/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: 'evt_circulo_001',
                    guestId: parseInt(selectedGuest.id),
                    metadata: { nombre: selectedGuest.nombre, empresa: selectedGuest.empresa, mesa: selectedGuest.mesa }
                })
            });

            setTimeout(() => {
                setAiComplete(true);
                setInvitados(prev => prev.map(inv => inv.id === selectedGuest.id ? { ...inv, status: 'cleared' } : inv));
                setTimeout(() => {
                    setAiProcessing(false);
                    setAiComplete(false);
                    setSelectedGuest(null);
                }, 3500);
            }, 2500);
        } catch (error) {
            console.error('Error en el check-in:', error);
            setAiProcessing(false);
            setSelectedGuest(null);
        }
    };

    const handleMoveGuest = (guestId: string, targetMesa: string) => {
        setInvitados(prev => prev.map(inv => inv.id === guestId ? { ...inv, mesa: targetMesa } : inv));
    };

    const filteredInvitados = invitados.filter(inv => {
        const matchesSearch = inv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             inv.empresa.toLowerCase().includes(searchTerm.toLowerCase());
        if (filter === 'pending') return matchesSearch && inv.status === 'pending';
        if (filter === 'cleared') return matchesSearch && inv.status === 'cleared';
        if (filter === 'vip') return matchesSearch && inv.isVIP;
        return matchesSearch;
    });

    const mesasIds = Array.from(new Set(invitados.map(i => i.mesa))).sort((a,b) => parseInt(a) - parseInt(b));

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-500/30 flex flex-col relative overflow-hidden">
            
            {/* --- BACKGROUND EXECUTIVE WHITE --- */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98105,transparent_50%)]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
            </div>

            {/* --- TOP NAV CORPORATE --- */}
            <nav className="h-24 border-b border-slate-200 bg-white/70 backdrop-blur-2xl flex items-center justify-between px-12 z-50 sticky top-0 shadow-sm">
                <div className="flex items-center gap-16">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_10px_25px_rgba(16,185,129,0.2)]">
                            <Fingerprint className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-black tracking-tighter leading-none uppercase text-slate-900">JairoAcceso</span>
                                <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-[9px] font-black text-emerald-600 tracking-tighter uppercase">Corporate v5.0</div>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase mt-1.5">Executive Synergy Portal</span>
                        </div>
                    </div>

                    <div className="relative w-[500px] group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Buscar invitado, empresa o mesa..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] py-4 pl-16 pr-8 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all font-semibold placeholder:text-slate-300 shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 border border-slate-200 rounded-2xl">
                        <button 
                            onClick={() => setView('directory')}
                            className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black transition-all tracking-widest ${view === 'directory' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List className="w-5 h-5" />
                            DIRECTORIO
                        </button>
                        <button 
                            onClick={() => setView('tables')}
                            className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black transition-all tracking-widest ${view === 'tables' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                            MESAS
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden z-10">
                {/* --- TELEMETRY SIDEBAR CLEAN --- */}
                <aside className="w-[380px] border-r border-slate-200 p-10 flex flex-col gap-10 bg-white/40 backdrop-blur-md">
                    <div className="space-y-8">
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">Live Event Telemetry</p>
                        
                        <div className="grid gap-6">
                            <div className="p-8 rounded-[3.5rem] bg-white border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] group hover:border-blue-500/20 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                                        <Users className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                                </div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Manifest</p>
                                <p className="text-6xl font-black mt-3 tracking-tighter text-slate-800">93</p>
                            </div>

                            <div className="p-8 rounded-[3.5rem] bg-white border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] group hover:border-emerald-500/20 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">LIVE</span>
                                </div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Access Granted</p>
                                <div className="flex items-end gap-3 mt-3">
                                    <p className="text-6xl font-black tracking-tighter text-emerald-600">
                                        {invitados.filter(i => i.status === 'cleared').length}
                                    </p>
                                    <p className="text-sm font-bold text-emerald-600/40 mb-3 uppercase tracking-tighter">Verified</p>
                                </div>
                            </div>

                            <div className="p-8 rounded-[3.5rem] bg-white border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] group hover:border-slate-300 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200">
                                        <Clock className="w-6 h-6 text-slate-400" />
                                    </div>
                                </div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Awaiting Entry</p>
                                <p className="text-6xl font-black mt-3 tracking-tighter text-slate-300">
                                    {93 - invitados.filter(i => i.status === 'cleared').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- MAIN CONTENT AREA --- */}
                <main className="flex-1 flex flex-col bg-transparent overflow-hidden">
                    
                    <div className="px-12 py-8 border-b border-slate-200 bg-white/30 flex items-center justify-between">
                        <div className="flex items-center gap-3 p-1.5 bg-slate-100/50 border border-slate-200 rounded-2xl">
                            {['all', 'pending', 'cleared', 'vip'].map((f) => (
                                <button 
                                    key={f}
                                    onClick={() => setFilter(f as any)}
                                    className={`px-8 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all uppercase ${filter === f ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {f === 'all' ? 'All Records' : f === 'pending' ? 'Pending' : f === 'cleared' ? 'Cleared' : 'VIP List'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                        {view === 'directory' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                <AnimatePresence>
                                    {filteredInvitados.map((inv) => (
                                        <motion.div 
                                            key={inv.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                            onClick={() => setSelectedGuest(inv)}
                                            className={`group p-10 rounded-[3.5rem] border transition-all cursor-pointer relative overflow-hidden bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                                                inv.status === 'cleared' ? 'border-emerald-500/30 ring-4 ring-emerald-500/5' : 'border-slate-100 hover:border-emerald-300'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-10">
                                                <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors uppercase">
                                                    Mesa {inv.mesa}
                                                </div>
                                                {inv.isVIP && <Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
                                            </div>
                                            <h3 className="text-3xl font-black tracking-tighter leading-none text-slate-800 uppercase">{inv.nombre}</h3>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">{inv.empresa}</p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 items-start">
                                {mesasIds.map((mesaId) => {
                                    const mesaInvitados = invitados.filter(i => i.mesa === mesaId);
                                    return (
                                        <div 
                                            key={mesaId} className="bg-white border border-slate-200 rounded-[4rem] p-10 shadow-sm relative group"
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => draggingGuest && handleMoveGuest(draggingGuest.id, mesaId)}
                                        >
                                            <div className="flex justify-between items-center mb-10 px-2">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                                                        <LayoutGrid className="w-6 h-6 text-slate-400" />
                                                    </div>
                                                    <h3 className="text-2xl font-black uppercase tracking-tighter">Mesa {mesaId}</h3>
                                                </div>
                                                <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-widest">{mesaInvitados.length} / 4</span>
                                            </div>
                                            <div className="space-y-5">
                                                {mesaInvitados.map(inv => (
                                                    <motion.div 
                                                        key={inv.id} draggable onDragStart={() => setDraggingGuest(inv)} onDragEnd={() => setDraggingGuest(null)} onClick={() => setSelectedGuest(inv)}
                                                        className={`p-7 rounded-[2.5rem] bg-slate-50/50 border transition-all cursor-pointer flex items-center justify-between group/item ${
                                                            inv.status === 'cleared' ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-100 hover:border-emerald-300'
                                                        }`}
                                                    >
                                                        <div>
                                                            <div className="text-sm font-black uppercase tracking-tight text-slate-700">{inv.nombre}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{inv.empresa}</div>
                                                        </div>
                                                        {inv.isVIP ? <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> : <ChevronRight className="w-5 h-5 text-slate-200 group-hover/item:text-emerald-500 transition-all" />}
                                                    </motion.div>
                                                ))}
                                                {mesaInvitados.length === 0 && (
                                                    <div className="py-16 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center gap-4 opacity-30">
                                                        <Plus className="w-8 h-8 text-slate-300" />
                                                        <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Slot Libre</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* --- MODAL DE CHECK-IN EXECUTIVE --- */}
            <AnimatePresence>
                {selectedGuest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-10 backdrop-blur-2xl bg-white/60">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="w-full max-w-[1100px] bg-white rounded-[5rem] border border-slate-200 overflow-hidden shadow-[0_100px_200px_rgba(0,0,0,0.1)] flex relative"
                        >
                            {/* Panel Izquierdo */}
                            <div className="w-[45%] bg-slate-50 p-20 border-r border-slate-200 flex flex-col justify-center">
                                <div className="px-6 py-2 bg-emerald-600 rounded-full inline-flex items-center gap-3 mb-10 shadow-lg">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                    <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Protocolo de Verificación</span>
                                </div>

                                <h2 className="text-8xl font-black tracking-tighter mb-8 uppercase leading-none text-slate-900">{selectedGuest.nombre}</h2>
                                <p className="text-4xl font-bold text-slate-300 uppercase tracking-widest mb-16">{selectedGuest.empresa}</p>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-10 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm">
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-3">Asignación</p>
                                        <p className="text-3xl font-black text-slate-800 uppercase tracking-tight">Mesa {selectedGuest.mesa}</p>
                                    </div>
                                    <div className="p-10 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm">
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-3">Categoría</p>
                                        <p className="text-3xl font-black text-emerald-600 uppercase tracking-tight">{selectedGuest.nivel || 'Invitado'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Panel Derecho */}
                            <div className="flex-1 p-24 flex flex-col relative bg-white">
                                <div className="flex justify-between items-center mb-20">
                                    <div className="flex flex-col">
                                        <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.5em]">Confirmación de Contacto</p>
                                        <div className="w-16 h-1.5 bg-emerald-500 mt-4 rounded-full" />
                                    </div>
                                    <button onClick={() => setSelectedGuest(null)} className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-all">
                                        <X className="w-8 h-8 text-slate-400" />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-12">
                                    <div className="space-y-6">
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] pl-4">Teléfono Móvil</p>
                                        <input type="text" placeholder="+1 (809) 000-0000" className="w-full bg-slate-50 text-slate-900 h-24 rounded-[3rem] px-12 font-black text-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 border border-slate-100 transition-all" />
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] pl-4">Correo Corporativo</p>
                                        <input type="email" placeholder="ejemplo@corporacion.com" className="w-full bg-slate-50 text-slate-900 h-24 rounded-[3rem] px-12 font-black text-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 border border-slate-100 transition-all" />
                                    </div>
                                </div>

                                <div className="mt-auto pt-16 flex items-center justify-between">
                                    <button onClick={() => setSelectedGuest(null)} className="text-[12px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors">Volver al Directorio</button>
                                    <button 
                                        onClick={handleGrantAccess}
                                        className="px-24 py-8 bg-slate-900 hover:bg-emerald-600 rounded-[3rem] text-lg font-black uppercase tracking-[0.3em] text-white flex items-center gap-6 shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all transform hover:-translate-y-2 active:scale-95 group"
                                    >
                                        Validar Acceso <ChevronRight className="w-7 h-7 group-hover:translate-x-2 transition-all" />
                                    </button>
                                </div>

                                {/* --- INSFORGE AI WOW OVERLAY (WHITE EDITION) --- */}
                                <AnimatePresence>
                                    {aiProcessing && (
                                        <motion.div 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-50 bg-white/98 backdrop-blur-3xl flex flex-col items-center justify-center p-24 text-center"
                                        >
                                            {!aiComplete ? (
                                                <div className="flex flex-col items-center gap-12">
                                                    <div className="relative">
                                                        <div className="w-40 h-40 rounded-full border-8 border-emerald-500/5 border-t-emerald-500 animate-spin" />
                                                        <Fingerprint className="absolute inset-0 m-auto w-16 h-16 text-emerald-500" />
                                                    </div>
                                                    <div className="space-y-6">
                                                        <p className="text-5xl font-black tracking-tighter uppercase italic text-slate-900">Procesando Sinergia...</p>
                                                        <p className="text-[12px] font-black text-emerald-600 uppercase tracking-[0.8em]">Insforge Alpha v5.0</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full h-full flex flex-col justify-center">
                                                    <div className="mb-20">
                                                        <div className="w-48 h-48 rounded-full bg-emerald-50 border-8 border-white mx-auto flex items-center justify-center text-7xl font-black text-emerald-600 shadow-2xl relative">
                                                            98%
                                                            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                                                <Star className="w-8 h-8 text-white fill-white" />
                                                            </div>
                                                        </div>
                                                        <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.5em] mt-10">Match Estratégico de Alto Nivel</p>
                                                    </div>

                                                    <div className="bg-slate-50 border border-slate-200 p-16 rounded-[4rem] text-left relative overflow-hidden mb-16 shadow-inner">
                                                        <div className="absolute top-0 right-0 p-10 opacity-10"><Zap className="w-12 h-12 text-emerald-600" /></div>
                                                        <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-8">Executive Insight</p>
                                                        <p className="text-3xl font-bold text-slate-700 leading-tight italic">
                                                            "Invitado de alto valor. Su infraestructura logística es el engranaje perfecto para tu expansión trimestral."
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 justify-center">
                                                        {['High Value', 'Tier 1 Partner', 'Strategic Asset'].map(tag => (
                                                            <span key={tag} className="px-10 py-3 bg-white border border-slate-200 rounded-full text-[11px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                                                                {tag}
                                                            </span>
                                                        ))}
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
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            `}</style>
        </div>
    );
}
