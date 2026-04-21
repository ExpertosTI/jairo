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

    const filteredInvitados = invitados.filter(inv => {
        const matchesSearch = inv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             inv.empresa.toLowerCase().includes(searchTerm.toLowerCase());
        if (filter === 'pending') return matchesSearch && inv.status === 'pending';
        if (filter === 'cleared') return matchesSearch && inv.status === 'cleared';
        if (filter === 'vip') return matchesSearch && inv.isVIP;
        return matchesSearch;
    });

    const mesas = Array.from(new Set(invitados.map(i => i.mesa))).sort((a,b) => parseInt(a) - parseInt(b));

    return (
        <div className="min-h-screen bg-[#020408] text-white font-sans selection:bg-emerald-500/30 flex flex-col relative overflow-hidden">
            
            {/* --- TOP NAV --- */}
            <nav className="h-20 border-b border-white/[0.03] bg-[#020408]/80 backdrop-blur-2xl flex items-center justify-between px-10 z-50">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Fingerprint className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight leading-none uppercase">JairoAcceso</span>
                            <span className="text-[10px] font-bold text-emerald-500/70 tracking-[0.3em] uppercase mt-1">Command Center</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
                        <button 
                            onClick={() => setView('directory')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black transition-all ${view === 'directory' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <List className="w-3.5 h-3.5" />
                            DIRECTORIO
                        </button>
                        <button 
                            onClick={() => setView('tables')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black transition-all ${view === 'tables' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            MESAS
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden">
                {/* --- TELEMETRY SIDEBAR --- */}
                <aside className="w-80 border-r border-white/[0.03] p-8 flex flex-col gap-8 bg-[#020408]/50 backdrop-blur-xl">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Live Telemetry</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-gray-400">Stream Conectado</span>
                            </div>
                        </div>

                        {/* Metric: Manifest */}
                        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 relative group">
                            <div className="flex justify-between items-start mb-2">
                                <Users className="w-5 h-5 text-blue-500/50" />
                                <span className="text-[8px] font-black text-blue-500/80 uppercase tracking-widest">Target</span>
                            </div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Manifesto Total</p>
                            <p className="text-5xl font-black mt-1 tracking-tighter">70</p>
                        </div>

                        {/* Metric: Cleared */}
                        <div className="p-6 rounded-[2rem] bg-emerald-500/[0.03] border border-emerald-500/10 relative group shadow-[0_0_40px_rgba(16,185,129,0.05)]">
                            <div className="flex justify-between items-start mb-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500/50" />
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Cleared</span>
                            </div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Accesos Concedidos</p>
                            <p className="text-5xl font-black mt-1 tracking-tighter text-emerald-500">{invitados.filter(i => i.status === 'cleared').length}</p>
                        </div>
                    </div>
                </aside>

                {/* --- MAIN CONTENT AREA --- */}
                <main className="flex-1 flex flex-col bg-[#020408]">
                    
                    <div className="p-8 border-b border-white/[0.03] flex items-center justify-between">
                        <div className="flex items-center gap-4 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl">
                            {['all', 'pending', 'cleared', 'vip'].map((f) => (
                                <button 
                                    key={f}
                                    onClick={() => setFilter(f as any)}
                                    className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${filter === f ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
                                >
                                    {f === 'all' ? 'Todos' : f === 'pending' ? 'Esperando' : f === 'cleared' ? 'Validados' : 'VIP Lounge'}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Filtrar por nombre o empresa..."
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 bg-[#03060c]">
                        {view === 'directory' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredInvitados.map((inv) => (
                                    <motion.div 
                                        key={inv.id}
                                        layoutId={inv.id}
                                        onClick={() => setSelectedGuest(inv)}
                                        className={`group p-6 rounded-[2.5rem] border transition-all cursor-pointer relative overflow-hidden ${
                                            inv.status === 'cleared' ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-white/[0.02] border-white/5 hover:border-emerald-500/30'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="px-3 py-1 bg-white/[0.05] rounded-full text-[8px] font-black tracking-widest text-gray-400 group-hover:text-emerald-400 transition-colors uppercase">
                                                Mesa {inv.mesa}
                                            </div>
                                            {inv.isVIP && <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />}
                                        </div>
                                        <h3 className="text-xl font-black tracking-tight leading-none group-hover:text-emerald-400 transition-colors uppercase">{inv.nombre}</h3>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">{inv.empresa}</p>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {mesas.map((mesaId) => {
                                    const mesaInvitados = invitados.filter(i => i.mesa === mesaId);
                                    return (
                                        <div key={mesaId} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6">
                                            <div className="flex justify-between items-center mb-6 px-2">
                                                <h3 className="text-lg font-black uppercase tracking-tight">Mesa {mesaId}</h3>
                                            </div>
                                            <div className="space-y-2">
                                                {mesaInvitados.map(inv => (
                                                    <div 
                                                        key={inv.id}
                                                        onClick={() => setSelectedGuest(inv)}
                                                        className="p-4 rounded-2xl bg-white/[0.03] border border-transparent hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all cursor-pointer flex items-center justify-between"
                                                    >
                                                        <div className="text-xs font-bold uppercase">{inv.nombre}</div>
                                                        <div className={`w-2 h-2 rounded-full ${inv.status === 'cleared' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-800'}`} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* --- MODAL DE CHECK-IN PREMIUM (CAPTURAS 2 + WOW EFFECT) --- */}
            <AnimatePresence>
                {selectedGuest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-[900px] bg-[#0a0f18] rounded-[3rem] border border-white/[0.05] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)] relative"
                        >
                            <div className="flex h-[550px]">
                                {/* Panel Izquierdo (Identidad) */}
                                <div className="w-[45%] bg-gradient-to-br from-emerald-600/10 to-transparent p-12 border-r border-white/[0.05]">
                                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full inline-flex items-center gap-2 mb-10">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protocolo de Seguridad</span>
                                    </div>

                                    <h2 className="text-5xl font-black tracking-tighter mb-4 uppercase">{selectedGuest.nombre}</h2>
                                    <div className="px-4 py-2 bg-white/[0.05] rounded-xl inline-flex items-center gap-2 mb-12">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Nivel de Acceso: {selectedGuest.nivel || 'Invitado'}</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Asignación de Zona</p>
                                                    <p className="text-xl font-black mt-1 uppercase tracking-tight">Mesa {selectedGuest.mesa}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Panel Derecho (Formulario / WOW Overlay) */}
                                <div className="flex-1 p-12 flex flex-col relative bg-[#0a0f18] overflow-hidden">
                                    <div className="flex justify-between items-center mb-12">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Confirmación de Contacto</p>
                                        <button onClick={() => setSelectedGuest(null)} className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.1] transition-all">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex-1 space-y-8">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Número de Contacto</p>
                                            <input type="text" placeholder="+1 (000) 000-0000" className="w-full bg-white text-black h-16 rounded-2xl px-6 font-bold text-lg focus:outline-none" />
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Correo Corporativo</p>
                                            <input type="email" placeholder="ejecutivo@empresa.com" className="w-full bg-white text-black h-16 rounded-2xl px-6 font-bold text-lg focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-8 flex items-center justify-between">
                                        <button onClick={() => setSelectedGuest(null)} className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cancelar</button>
                                        <button 
                                            onClick={handleGrantAccess}
                                            className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-emerald-900/40 transition-all"
                                        >
                                            Conceder Acceso
                                        </button>
                                    </div>

                                    {/* --- INSFORGE AI WOW OVERLAY --- */}
                                    <AnimatePresence>
                                        {aiProcessing && (
                                            <motion.div 
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="absolute inset-0 z-50 bg-[#0a0f18]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center"
                                            >
                                                {!aiComplete ? (
                                                    <div className="flex flex-col items-center gap-8">
                                                        <div className="relative">
                                                            <Loader2 className="w-20 h-20 text-emerald-500 animate-spin" />
                                                            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-emerald-500 animate-pulse" />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <p className="text-3xl font-black tracking-tighter uppercase italic text-emerald-500">Sincronizando AI...</p>
                                                            <p className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-[0.5em]">Insforge Semantic Match Engine</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full h-full flex flex-col justify-center">
                                                        <div className="mb-12">
                                                            <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 mx-auto flex items-center justify-center text-4xl font-black text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                                                                98%
                                                            </div>
                                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-4">Match B2B Detectado</p>
                                                        </div>

                                                        <div className="bg-white/[0.03] border border-emerald-500/20 p-8 rounded-[2rem] text-left relative overflow-hidden group mb-8">
                                                            <div className="absolute top-0 right-0 p-4 opacity-20"><Zap className="w-6 h-6 text-emerald-500" /></div>
                                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Resumen de Sinergia</p>
                                                            <p className="text-lg font-bold text-gray-300 leading-relaxed italic">
                                                                "Alto potencial estratégico. Líder en infraestructura con capacidad de escala inmediata para el sector logístico de su red."
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2 justify-center">
                                                            {['High Value', 'SaaS', 'Corporate', 'Strategic'].map(tag => (
                                                                <span key={tag} className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <div className="mt-12 flex items-center justify-center gap-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
                                                            <Lock className="w-4 h-4" />
                                                            Acceso Confirmado por Sistema
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
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
            `}</style>
        </div>
    );
}
