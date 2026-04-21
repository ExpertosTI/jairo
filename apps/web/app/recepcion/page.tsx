"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
    LayoutDashboard, Users, Clock, ShieldCheck, 
    Fingerprint, LayoutGrid, List, ChevronRight, 
    Search, Activity, Target, Zap, CheckCircle2,
    X, Phone, Mail, MapPin, Sparkles, Loader2,
    Lock, Star, Briefcase, ShieldAlert
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
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://jairoapp.renace.tech/api';
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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://jairoapp.renace.tech/api';
            
            // 1. Registrar asistencia y crear empresa automáticamente en el backend
            await fetch(`${apiUrl}/events/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: 'evt_circulo_001',
                    guestId: parseInt(selectedGuest.id),
                    metadata: {
                        nombre: selectedGuest.nombre,
                        empresa: selectedGuest.empresa,
                        mesa: selectedGuest.mesa
                    }
                })
            });

            // 2. Simulamos el tiempo de "Análisis" para el efecto WOW
            setTimeout(() => {
                setAiComplete(true);
                
                // Actualizar estado local
                setInvitados(prev => prev.map(inv => 
                    inv.id === selectedGuest.id ? { ...inv, status: 'cleared' } : inv
                ));

                // Cerrar modal tras mostrar el resultado
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
        setInvitados(prev => prev.map(inv => 
            inv.id === guestId ? { ...inv, mesa: targetMesa } : inv
        ));
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
        <div className="min-h-screen bg-[#05070a] text-white font-sans selection:bg-emerald-500/30 flex flex-col relative overflow-hidden">
            
            {/* --- BACKGROUND CINEMÁTICO (FÁCIL DE CAMBIAR) --- */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98115,transparent_50%)]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500/5 via-transparent to-black/80" />
            </div>

            {/* --- TOP NAV GLASS --- */}
            <nav className="h-20 border-b border-white/[0.05] bg-black/40 backdrop-blur-3xl flex items-center justify-between px-10 z-50 sticky top-0">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            <Fingerprint className="w-7 h-7 text-emerald-500" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black tracking-tighter leading-none uppercase bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">JairoAcceso</span>
                                <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[8px] font-black text-emerald-500 tracking-tighter">B2B PRO</div>
                            </div>
                            <span className="text-[9px] font-black text-gray-500 tracking-[0.4em] uppercase mt-1">Strategic Command Center</span>
                        </div>
                    </div>

                    <div className="relative w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Buscar por ID, nombre o empresa..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium placeholder:text-gray-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
                        <button 
                            onClick={() => setView('directory')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all tracking-widest ${view === 'directory' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <List className="w-4 h-4" />
                            DIRECTORIO
                        </button>
                        <button 
                            onClick={() => setView('tables')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all tracking-widest ${view === 'tables' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            MESAS
                        </button>
                    </div>
                    <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black tracking-widest hover:bg-white/10 transition-all">
                        <Zap className="w-4 h-4 text-emerald-500" />
                        INITIALIZE SCANNER
                    </button>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden z-10">
                {/* --- TELEMETRY SIDEBAR GLASS --- */}
                <aside className="w-80 border-r border-white/[0.05] p-8 flex flex-col gap-8 bg-black/20 backdrop-blur-md">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Live Telemetry</p>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
                                <div className="w-1 h-1 rounded-full bg-emerald-500/20" />
                            </div>
                        </div>

                        {/* Metric Cards */}
                        <div className="grid gap-4">
                            <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-blue-500/30 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                                        <Users className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <span className="text-[9px] font-black text-blue-500/50 uppercase tracking-widest">Target</span>
                                </div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Manifest</p>
                                <p className="text-5xl font-black mt-2 tracking-tighter">70</p>
                            </div>

                            <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-emerald-500/30 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest">Cleared</span>
                                </div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Access Granted</p>
                                <div className="flex items-end gap-3 mt-2">
                                    <p className="text-5xl font-black tracking-tighter text-emerald-500">
                                        {invitados.filter(i => i.status === 'cleared').length}
                                    </p>
                                    <p className="text-xs font-bold text-emerald-500/40 mb-2">0%</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-orange-500/30 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <span className="text-[9px] font-black text-orange-500/50 uppercase tracking-widest">Inbound</span>
                                </div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pending Entry</p>
                                <p className="text-5xl font-black mt-2 tracking-tighter text-orange-500">
                                    {70 - invitados.filter(i => i.status === 'cleared').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- MAIN CONTENT GLASS --- */}
                <main className="flex-1 flex flex-col bg-transparent">
                    
                    <div className="p-8 border-b border-white/[0.05] flex items-center justify-between bg-black/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
                            {['all', 'pending', 'cleared', 'vip'].map((f) => (
                                <button 
                                    key={f}
                                    onClick={() => setFilter(f as any)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${filter === f ? 'bg-white text-black shadow-2xl' : 'text-gray-500 hover:text-white'}`}
                                >
                                    {f === 'all' ? 'All Records' : f === 'pending' ? 'Awaiting Entry' : f === 'cleared' ? 'Cleared' : 'VIP Lounge'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                        {view === 'directory' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredInvitados.map((inv) => (
                                    <motion.div 
                                        key={inv.id}
                                        layoutId={inv.id}
                                        onClick={() => setSelectedGuest(inv)}
                                        className={`group p-8 rounded-[3rem] border transition-all cursor-pointer relative overflow-hidden backdrop-blur-xl ${
                                            inv.status === 'cleared' ? 'bg-emerald-500/[0.05] border-emerald-500/30' : 'bg-white/[0.03] border-white/5 hover:border-emerald-500/50'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="px-4 py-1.5 bg-black/40 border border-white/5 rounded-full text-[8px] font-black tracking-[0.2em] text-gray-500 group-hover:text-emerald-400 transition-colors uppercase">
                                                MESA {inv.mesa}
                                            </div>
                                            {inv.isVIP ? (
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                    <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                                                </div>
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-gray-800" />
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tighter leading-none group-hover:text-emerald-400 transition-colors uppercase">{inv.nombre}</h3>
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mt-3">{inv.empresa}</p>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 items-start">
                                {mesasIds.map((mesaId) => {
                                    const mesaInvitados = invitados.filter(i => i.mesa === mesaId);
                                    return (
                                        <div 
                                            key={mesaId} 
                                            className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 backdrop-blur-2xl relative group"
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => draggingGuest && handleMoveGuest(draggingGuest.id, mesaId)}
                                        >
                                            <div className="flex justify-between items-center mb-8 px-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center">
                                                        <LayoutGrid className="w-5 h-5 text-gray-500" />
                                                    </div>
                                                    <h3 className="text-xl font-black uppercase tracking-tighter">Mesa {mesaId}</h3>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest">{mesaInvitados.length} / 4</span>
                                                    <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">Occupancy</span>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                {mesaInvitados.map(inv => (
                                                    <motion.div 
                                                        key={inv.id}
                                                        draggable
                                                        onDragStart={() => setDraggingGuest(inv)}
                                                        onDragEnd={() => setDraggingGuest(null)}
                                                        onClick={() => setSelectedGuest(inv)}
                                                        className={`p-6 rounded-[2rem] bg-black/40 border transition-all cursor-pointer flex items-center justify-between group/item ${
                                                            inv.status === 'cleared' ? 'border-emerald-500/20 bg-emerald-500/[0.02]' : 'border-white/5 hover:border-emerald-500/40'
                                                        }`}
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${inv.status === 'cleared' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-700'}`} />
                                                                <div className="text-xs font-black uppercase tracking-tight">{inv.nombre}</div>
                                                            </div>
                                                            <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest pl-3">{inv.empresa}</div>
                                                        </div>
                                                        {inv.isVIP && <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />}
                                                    </motion.div>
                                                ))}
                                                {mesaInvitados.length === 0 && (
                                                    <div className="py-12 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-3">
                                                        <Plus className="w-6 h-6 text-gray-800" />
                                                        <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Espacio Disponible</span>
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

            {/* --- MODAL DE CHECK-IN PREMIUM --- */}
            <AnimatePresence>
                {selectedGuest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="w-full max-w-[1000px] bg-[#0a0f18] rounded-[4rem] border border-white/[0.1] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.8)] relative"
                        >
                            <div className="flex h-[600px]">
                                {/* Panel Izquierdo */}
                                <div className="w-[40%] bg-gradient-to-br from-emerald-600/20 via-transparent to-transparent p-16 border-r border-white/[0.05]">
                                    <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full inline-flex items-center gap-3 mb-12">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                        <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em]">Protocolo de Seguridad</span>
                                    </div>

                                    <h2 className="text-6xl font-black tracking-tighter mb-6 uppercase leading-none">{selectedGuest.nombre}</h2>
                                    <div className="px-5 py-2.5 bg-white/[0.05] rounded-2xl inline-flex items-center gap-3 mb-16">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                        <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Nivel {selectedGuest.nivel || 'Invitado'}</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                    <MapPin className="w-6 h-6 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Zona Asignada</p>
                                                    <p className="text-2xl font-black uppercase tracking-tight">Mesa {selectedGuest.mesa}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Panel Derecho */}
                                <div className="flex-1 p-16 flex flex-col relative bg-[#0a0f18] overflow-hidden">
                                    <div className="flex justify-between items-center mb-16">
                                        <div className="flex flex-col">
                                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">Data Enrichment</p>
                                            <div className="w-12 h-1 bg-emerald-500 mt-2" />
                                        </div>
                                        <button onClick={() => setSelectedGuest(null)} className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center hover:bg-white/[0.1] transition-all">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="flex-1 space-y-10">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] pl-2">Contacto Directo</p>
                                            <input type="text" placeholder="+1 (809) 000-0000" className="w-full bg-white text-black h-20 rounded-3xl px-8 font-black text-2xl focus:outline-none placeholder:text-gray-300 shadow-xl" />
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] pl-2">Email Corporativo</p>
                                            <input type="email" placeholder="ceo@empresa.com" className="w-full bg-white text-black h-20 rounded-3xl px-8 font-black text-2xl focus:outline-none placeholder:text-gray-300 shadow-xl" />
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-10 flex items-center justify-between">
                                        <button onClick={() => setSelectedGuest(null)} className="text-[11px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Cancelar Protocolo</button>
                                        <button 
                                            onClick={handleGrantAccess}
                                            className="px-16 py-6 bg-emerald-600 hover:bg-emerald-500 rounded-3xl text-sm font-black uppercase tracking-[0.2em] flex items-center gap-4 shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-1 active:scale-95"
                                        >
                                            Conceder Acceso <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* --- INSFORGE AI WOW OVERLAY --- */}
                                    <AnimatePresence>
                                        {aiProcessing && (
                                            <motion.div 
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="absolute inset-0 z-50 bg-[#0a0f18]/98 backdrop-blur-3xl flex flex-col items-center justify-center p-16 text-center"
                                            >
                                                {!aiComplete ? (
                                                    <div className="flex flex-col items-center gap-10">
                                                        <div className="relative">
                                                            <div className="w-32 h-32 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin" />
                                                            <Fingerprint className="absolute inset-0 m-auto w-12 h-12 text-emerald-500 animate-pulse" />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <p className="text-4xl font-black tracking-tighter uppercase italic text-emerald-500">Analizando Sinergia B2B...</p>
                                                            <p className="text-[11px] font-bold text-emerald-500/40 uppercase tracking-[0.6em]">Insforge Engine v4.0</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full h-full flex flex-col justify-center">
                                                        <div className="mb-16">
                                                            <div className="w-32 h-32 rounded-full border-8 border-emerald-500/10 border-t-emerald-500 mx-auto flex items-center justify-center text-5xl font-black text-emerald-500 shadow-[0_0_80px_rgba(16,185,129,0.3)]">
                                                                98%
                                                            </div>
                                                            <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] mt-6">Match Estratégico Detectado</p>
                                                        </div>

                                                        <div className="bg-white/[0.03] border border-emerald-500/30 p-10 rounded-[3rem] text-left relative overflow-hidden mb-12 shadow-2xl">
                                                            <div className="absolute top-0 right-0 p-6 opacity-30"><Zap className="w-8 h-8 text-emerald-500" /></div>
                                                            <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mb-6">AI Insight</p>
                                                            <p className="text-2xl font-bold text-gray-200 leading-tight italic">
                                                                "Invitado de alto valor. Su infraestructura logística en la región central es el engranaje perfecto para tu expansión trimestral."
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-wrap gap-3 justify-center">
                                                            {['High Value', 'Tier 1 Partner', 'Corporate', 'Logistics'].map(tag => (
                                                                <span key={tag} className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">
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
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            `}</style>
        </div>
    );
}

const Plus = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);
