"use client";

import { useState, useEffect } from "react";
import { 
    Users, Clock, ShieldCheck, Fingerprint, LayoutGrid, List, ChevronRight, 
    Search, Zap, CheckCircle2, X, Star, Layers, Plus, Save, Phone, Mail,
    Radar, Activity, Target, Shield, Globe, Cpu, Building2, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- LISTA MAESTRA DE 103 INVITADOS ---
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

const ROLES_ESTRATEGICOS = ["CEO", "Estrategia", "Tecnología", "Operaciones", "Socio", "Invitado Especial"];
const EMPRESAS_LISTA = Array.from(new Set(GUESTS_MAESTRO.map(g => g.empresa))).sort();

export default function RecepcionCommandCenter() {
    const [view, setView] = useState<'tables' | 'directory'>('directory');
    const [searchTerm, setSearchTerm] = useState("");
    const [invitados, setInvitados] = useState(GUESTS_MAESTRO);
    const [selectedGuest, setSelectedGuest] = useState<any>(null);
    const [aiProcessing, setAiProcessing] = useState(false);
    const [aiComplete, setAiComplete] = useState(false);
    
    // Formulario extendido
    const [formData, setFormData] = useState({
        empresa: "",
        rol: "Estrategia",
        telefono: "",
        correo: ""
    });

    const [isEditingMesa, setIsEditingMesa] = useState(false);
    const [tempMesa, setTempMesa] = useState("");

    const API_BASE = '/api'; // Ruta relativa para evitar problemas de CORS y 404
    const EVENT_ID = 'evt_circulo_001';

    useEffect(() => {
        if (selectedGuest) {
            setFormData({
                empresa: selectedGuest.empresa,
                rol: "Estrategia",
                telefono: "",
                correo: ""
            });
        }
    }, [selectedGuest]);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await fetch(`${API_BASE}/events/${EVENT_ID}/attendance`);
                if (!res.ok) throw new Error("API Offline");
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
                    companyName: formData.empresa,
                    role: formData.rol,
                    phone: formData.telefono,
                    email: formData.correo
                })
            });
            if (res.ok) {
                setTimeout(() => {
                    setAiComplete(true);
                    setInvitados(prev => prev.map(inv => inv.id === selectedGuest.id ? { ...inv, status: 'cleared', empresa: formData.empresa } : inv));
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
            
            {/* Background Telemetry */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
                <Radar className="absolute -top-20 -right-20 w-96 h-96 text-emerald-500 animate-pulse" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-emerald-500/20" />
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-emerald-500/20" />
            </div>

            <nav className="h-20 border-b border-white/5 bg-[#020408]/90 backdrop-blur-3xl flex items-center justify-between px-6 lg:px-12 z-50 sticky top-0 shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <Fingerprint className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter italic hidden sm:block">JairoOS_2026</span>
                    </div>
                    <div className="relative w-[200px] md:w-[350px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                        <input 
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar nodo..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm font-bold focus:border-emerald-500/50 outline-none transition-all"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setView('directory')} className={`p-3 rounded-xl ${view === 'directory' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-500'}`}><LayoutGrid className="w-5 h-5" /></button>
                    <button onClick={() => setView('tables')} className={`p-3 rounded-xl ${view === 'tables' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-500'}`}><Layers className="w-5 h-5" /></button>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden z-10">
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar pb-32">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filtered.map((inv) => (
                                <motion.div 
                                    key={inv.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedGuest(inv)}
                                    className={`p-6 lg:p-8 rounded-[2.5rem] border cursor-pointer transition-all bg-white/[0.01] relative group active:scale-95 ${inv.status === 'cleared' ? 'border-emerald-500/30 bg-emerald-500/[0.03]' : 'border-white/5 hover:border-emerald-500/30'}`}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">MESA {inv.mesa}</span>
                                        {inv.status === 'cleared' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                    </div>
                                    <h3 className="text-lg font-black uppercase leading-tight group-hover:text-emerald-400">{inv.nombre}</h3>
                                    <p className="text-[9px] font-bold text-gray-700 uppercase mt-2 tracking-widest">{inv.empresa}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Modal de Validación - RECONSTRUIDO PARA RESPONSIVIDAD TOTAL */}
            <AnimatePresence>
                {selectedGuest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl bg-black/90 overflow-hidden">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                            className="w-full max-w-[900px] max-h-[95vh] bg-[#05080f] rounded-[3rem] border border-white/10 flex flex-col relative shadow-[0_50px_100px_rgba(0,0,0,1)] overflow-y-auto custom-scrollbar"
                        >
                            <button onClick={() => setSelectedGuest(null)} className="absolute top-6 right-6 z-[110] p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all"><X className="w-6 h-6" /></button>
                            
                            {/* Header del Modal */}
                            <div className="p-8 lg:p-12 border-b border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-3 mb-6">
                                    <Target className="w-5 h-5 text-emerald-500" />
                                    <span className="text-[10px] font-black tracking-[0.3em] text-emerald-500">ASIGNACIÓN ESTRATÉGICA 2026</span>
                                </div>
                                <h2 className="text-4xl lg:text-6xl font-black uppercase leading-[0.9] tracking-tighter">{selectedGuest.nombre}</h2>
                                <p className="text-xl font-bold text-gray-600 uppercase tracking-widest mt-2 italic">{selectedGuest.empresa}</p>
                            </div>

                            {/* Contenido del Formulario */}
                            <div className="p-8 lg:p-12 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Empresa & Rol */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Empresa / Organización</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                                <select 
                                                    value={formData.empresa} 
                                                    onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 font-black text-lg outline-none focus:border-emerald-500/50 appearance-none"
                                                >
                                                    {EMPRESAS_LISTA.map(e => <option key={e} value={e} className="bg-[#05080f]">{e}</option>)}
                                                    <option value="OTRA" className="bg-[#05080f]">OTRA...</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rol Estratégico</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                                <select 
                                                    value={formData.rol} 
                                                    onChange={(e) => setFormData({...formData, rol: e.target.value})}
                                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 font-black text-lg outline-none focus:border-emerald-500/50 appearance-none"
                                                >
                                                    {ROLES_ESTRATEGICOS.map(r => <option key={r} value={r} className="bg-[#05080f]">{r}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Teléfono & Correo */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Contacto Directo</label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                                <input 
                                                    placeholder="809-000-0000"
                                                    value={formData.telefono}
                                                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 font-black text-lg outline-none focus:border-emerald-500/50"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Correo Electrónico</label>
                                            <div className="relative">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                                <input 
                                                    placeholder="nombre@empresa.com"
                                                    value={formData.correo}
                                                    onChange={(e) => setFormData({...formData, correo: e.target.value})}
                                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 font-black text-lg outline-none focus:border-emerald-500/50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ubicación de Mesa */}
                                <div className="p-8 bg-emerald-500/[0.03] rounded-3xl border border-emerald-500/10 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ASIGNACIÓN DE NODO</span>
                                        <p className="text-5xl font-black text-emerald-500 tracking-tighter">MESA {selectedGuest.mesa}</p>
                                    </div>
                                    <button onClick={() => setIsEditingMesa(true)} className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg active:scale-95"><Layers className="w-8 h-8 text-white" /></button>
                                </div>
                            </div>

                            {/* Footer con Acciones */}
                            <div className="p-8 lg:p-12 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row gap-6 items-center justify-between mt-auto">
                                <button onClick={() => setSelectedGuest(null)} className="text-[10px] font-black text-gray-700 hover:text-white transition-all tracking-[0.4em]">DESCARTAR</button>
                                <button onClick={handleGrantAccess} className="w-full sm:w-auto px-16 py-8 bg-emerald-600 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all text-xl">CONCEDER ACCESO</button>
                            </div>

                            {/* Overlay de Procesamiento AI */}
                            <AnimatePresence>
                                {aiProcessing && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[150] bg-[#05080f]/98 flex flex-col items-center justify-center p-12 text-center">
                                        {!aiComplete ? (
                                            <div className="space-y-10">
                                                <div className="w-32 h-32 border-8 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                                                <p className="text-3xl font-black uppercase tracking-tighter animate-pulse text-emerald-500">Sincronizando con JairoOS 2026...</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-10">
                                                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_60px_#10b981]"><ShieldCheck className="w-12 h-12 text-white" /></div>
                                                <p className="text-7xl font-black text-emerald-500 tracking-tighter">ACCESO OK</p>
                                                <p className="text-xl font-bold italic text-gray-500 uppercase">Nodo Validado en Red Estratégica</p>
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
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 20px; }
            `}</style>
        </div>
    );
}
