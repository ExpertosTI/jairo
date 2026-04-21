"use client";

import { useState, useEffect } from "react";
import { 
    Search, UserCheck, Clock, MapIcon, ChevronRight, 
    Check, Phone, Mail, Briefcase, Star, Fingerprint, 
    Zap, Users, Scan, CheckCircle
} from "lucide-react";

interface Guest {
    id: number;
    name: string;
    company: string;
    table: string;
    vip?: boolean;
    pax?: number;
    checkedIn?: boolean;
    checkinTime?: string;
}

export default function RecepcionPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [aiProfileResult, setAiProfileResult] = useState<any>(null);
    const [formData, setFormData] = useState({ phone: "", email: "" });

    // Cargar invitados reales desde la API
    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://jairoapp.renace.tech/api'}/events/evt_circulo_001/attendance`);
                const data = await res.json();
                if (data && data.length > 0) {
                    setGuests(data);
                } else {
                    // Fallback para demo si la DB está vacía
                    setGuests([
                        { id: 1, name: "Carlos Slim Domit", company: "Grupo Carso", table: "Presidencial A", vip: true },
                        { id: 2, name: "María Asunción Aramburuzabala", company: "Tresalia Capital", table: "Presidencial B", vip: true },
                        { id: 3, name: "Daniel Servitje", company: "Bimbo", table: "Mesa 04", pax: 2 },
                        { id: 4, name: "Alejandro Ramírez", company: "Cinépolis", table: "Mesa 08" },
                        { id: 5, name: "Blanca Treviño", company: "Softtek", table: "Mesa 12", vip: true },
                        { id: 6, name: "José Antonio Fernández", company: "FEMSA", table: "Mesa 05" },
                    ]);
                }
            } catch (error) {
                console.error("Error fetching guests:", error);
            }
        };
        fetchGuests();
    }, []);

    const filteredGuests = guests.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        g.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleConfirmCheckin = async () => {
        if (!selectedGuest) return;
        setIsCheckingIn(true);

        try {
            // 1. Registro de Asistencia Real
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://jairoapp.renace.tech/api'}/events/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: 'evt_circulo_001',
                    guestId: selectedGuest.id,
                    metadata: { ...formData, source: 'recepcion_portal' }
                })
            });

            // 2. Generación de Perfil IA (Networking Match)
            const aiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://jairoapp.renace.tech/api'}/events/ai/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guestId: selectedGuest.id })
            });
            const aiData = await aiRes.json();
            setAiProfileResult(aiData);

            // Actualizar lista local
            setGuests(guests.map(g => g.id === selectedGuest.id ? { ...g, checkedIn: true, checkinTime: new Date().toLocaleTimeString() } : g));

            // Auto-cerrar tras mostrar el match de IA por 4 segundos
            setTimeout(() => {
                setSelectedGuest(null);
                setAiProfileResult(null);
                setIsCheckingIn(false);
                setFormData({ phone: "", email: "" });
            }, 4000);

        } catch (error) {
            console.error("Check-in error:", error);
            setIsCheckingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#05070A] text-white font-sans selection:bg-primary selection:text-white overflow-hidden relative">
            
            {/* Background High-Fidelity Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-900/10 blur-[180px] rounded-full"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
            </div>

            {/* Top Navigation / Header */}
            <header className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-black/20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-green-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <UserCheck className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-[0.2em] leading-none">JairoApp <span className="text-primary">Reception</span></h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Portal de Acceso de Alta Fidelidad</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Círculo Empresarial</p>
                        <p className="text-lg font-black text-white">Evento Gala 2026</p>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                        <span className="text-xs font-bold uppercase tracking-widest">System Online</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 p-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-120px)]">
                
                {/* Left Column: Search & Filters */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-green-500/50 rounded-3xl blur opacity-25 group-focus-within:opacity-100 transition duration-500"></div>
                        <div className="relative bg-[#0D1117] border border-white/10 rounded-2xl flex items-center px-6 py-5 shadow-2xl">
                            <Search className="text-gray-500 group-focus-within:text-primary transition-colors" size={24} />
                            <input 
                                type="text" 
                                placeholder="IDENTIFICAR INVITADO O EMPRESA..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none w-full ml-4 text-lg font-bold placeholder:text-gray-700 tracking-wider"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {filteredGuests.map((guest) => (
                            <button 
                                key={guest.id}
                                onClick={() => setSelectedGuest(guest)}
                                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                                    selectedGuest?.id === guest.id 
                                    ? 'bg-primary/20 border-primary shadow-[0_0_30px_rgba(27,127,60,0.2)]' 
                                    : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                                } ${guest.checkedIn ? 'opacity-60 grayscale-[0.5]' : ''}`}
                            >
                                {guest.vip && (
                                    <div className="absolute top-0 right-0 p-2">
                                        <Star size={12} className="text-primary" fill="currentColor" />
                                    </div>
                                )}
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{guest.name}</h3>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{guest.company}</p>
                                    </div>
                                    {guest.checkedIn && (
                                        <div className="bg-green-500/20 text-green-400 p-1.5 rounded-lg border border-green-500/30">
                                            <Check size={16} />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span className="flex items-center gap-1.5"><MapIcon size={12}/> {guest.table}</span>
                                    {guest.pax && <span className="flex items-center gap-1.5"><Users size={12}/> +{guest.pax} PAX</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Interaction Zone */}
                <div className="lg:col-span-8 bg-[#0D1117]/50 border border-white/5 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center backdrop-blur-xl">
                    {!selectedGuest ? (
                        <div className="text-center space-y-6 max-w-md animate-in fade-in zoom-in duration-700">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-primary blur-3xl opacity-20 rounded-full animate-pulse"></div>
                                <Scan size={120} className="text-gray-800 relative z-10" strokeWidth={0.5} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-700 uppercase tracking-[0.3em]">Esperando Identificación</h2>
                            <p className="text-sm text-gray-600 font-bold uppercase tracking-widest leading-relaxed">
                                El sistema de acceso bihométrico está activo. Por favor, seleccione un perfil para iniciar la validación de credenciales.
                            </p>
                        </div>
                    ) : (
                        <div className="w-full h-full p-12 flex flex-col animate-in slide-in-from-right duration-500">
                            {/* Detailed Guest View */}
                            <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
                                <div className="mb-12">
                                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary mb-6">
                                        <Fingerprint size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Verificación de Identidad</span>
                                    </div>
                                    <h2 className="text-8xl font-black tracking-tighter leading-none mb-4">{selectedGuest.name}</h2>
                                    <p className="text-2xl font-bold text-gray-500 uppercase tracking-widest">{selectedGuest.company}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-12">
                                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Asignación de Mesa</p>
                                        <p className="text-4xl font-black text-white">{selectedGuest.table}</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Protocolo de Acceso</p>
                                        <p className="text-4xl font-black text-primary">{selectedGuest.vip ? "VIP EXECUTIVE" : "BUSINESS"}</p>
                                    </div>
                                </div>

                                {selectedGuest.checkedIn ? (
                                    <div className="bg-green-500/10 border border-green-500/20 p-10 rounded-[2rem] flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-black text-green-400 mb-1 tracking-tight">ACCESO VALIDADO</p>
                                            <p className="text-sm text-green-500/60 font-bold uppercase tracking-widest">Registrado a las {selectedGuest.checkinTime}</p>
                                        </div>
                                        <CheckCircle size={48} className="text-green-500" />
                                    </div>
                                ) : (
                                    <div className="flex gap-6">
                                        <button 
                                            onClick={() => setSelectedGuest(null)}
                                            className="px-10 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all"
                                        >
                                            Anular
                                        </button>
                                        <button 
                                            onClick={handleConfirmCheckin}
                                            className="flex-1 bg-primary hover:bg-green-600 text-white p-6 rounded-2xl font-black text-xl uppercase tracking-[0.4em] transition-all shadow-[0_20px_50px_rgba(27,127,60,0.3)] flex items-center justify-center gap-4 group"
                                        >
                                            <Check size={28} className="group-hover:scale-125 transition-transform"/> Conceder Acceso
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Check-in Modal with AI Networking Profile */}
            {selectedGuest && !selectedGuest.checkedIn && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-[50px] z-50 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="bg-[#0A0D14]/90 border border-white/20 rounded-[3rem] w-full max-w-5xl shadow-[0_0_150px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row relative">
                        
                        {/* Tech Borders */}
                        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-primary rounded-tl-[3rem] opacity-50"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-primary rounded-br-[3rem] opacity-50"></div>

                        {/* Left Panel - Guest Info */}
                        <div className="w-full md:w-2/5 bg-gradient-to-br from-primary/10 via-black/50 to-transparent p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Protocolo de Seguridad</p>
                                </div>
                                
                                <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter mb-6">{selectedGuest.name}</h2>
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl mb-12">
                                    <Briefcase size={14} className="text-gray-400" />
                                    <p className="text-sm font-black text-gray-300 uppercase tracking-widest">{selectedGuest.company}</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="bg-black/60 border border-white/10 p-5 rounded-2xl flex items-center gap-5">
                                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                            <MapIcon size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Asignación de Zona</p>
                                            <p className="text-2xl text-white font-black tracking-tight">{selectedGuest.table}</p>
                                        </div>
                                    </div>
                                    
                                    {selectedGuest.pax && (
                                        <div className="bg-black/60 border border-white/10 p-5 rounded-2xl flex items-center gap-5">
                                            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
                                                <Users size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Invitados Adicionales</p>
                                                <p className="text-2xl text-white font-black tracking-tight">+{selectedGuest.pax} PAX</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10 relative z-10 flex items-center gap-4 text-gray-500">
                                <Fingerprint size={32} className="opacity-50" />
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em]">Bypass biométrico activo</p>
                                    <p className="text-[9px] font-mono mt-1">SYS_ID: {selectedGuest.id.toString().padStart(6, '0')}-A</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Form & AI AI AI */}
                        <div className="w-full md:w-3/5 p-12 flex flex-col bg-black/40 relative overflow-hidden">
                            
                            {/* AI Match Overlay */}
                            {aiProfileResult && (
                                <div className="absolute inset-0 bg-[#0A0D14]/95 backdrop-blur-3xl z-20 flex flex-col p-12 animate-in fade-in zoom-in duration-500">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
                                    
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-primary/20 rounded-2xl">
                                            <Zap className="text-primary animate-pulse" size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white tracking-tighter">Insforge AI Match</h3>
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Análisis de Oportunidad B2B</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-8 relative z-10">
                                        <div className="bg-black/50 border border-white/10 rounded-[2rem] p-8">
                                            <p className="text-5xl font-black text-white mb-4">{aiProfileResult.matchScore}% Match</p>
                                            <p className="text-base text-gray-400 font-medium leading-relaxed">{aiProfileResult.aiSummary}</p>
                                        </div>
                                        
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-4">Etiquetas Semánticas</p>
                                            <div className="flex flex-wrap gap-3">
                                                {aiProfileResult.networkingTags?.map((tag: string, idx: number) => (
                                                    <span key={idx} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-gray-300">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 text-center relative z-10">
                                        <div className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-sm bg-primary/10 px-6 py-4 rounded-full border border-primary/20">
                                            <CheckCircle size={20} className="animate-bounce" /> Acceso Concedido
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Standard Form */}
                            <div className={`flex flex-col h-full transition-opacity duration-300 ${aiProfileResult ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                <div className="flex justify-between items-center mb-10">
                                    <p className="text-[12px] font-black text-gray-500 uppercase tracking-[0.3em]">Confirmación de Contacto</p>
                                    <button onClick={() => setSelectedGuest(null)} className="p-3 bg-white/5 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90">
                                        <ChevronRight size={24} className="rotate-180" />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                                            <Phone size={12} /> Móvil / WhatsApp
                                        </label>
                                        <input 
                                            type="tel" placeholder="+1 (000) 000-0000"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-[1.5rem] text-2xl text-white outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all font-medium placeholder:text-gray-700"
                                        />
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                                            <Mail size={12} /> Correo Corporativo
                                        </label>
                                        <input 
                                            type="email" placeholder="correo@empresa.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-[1.5rem] text-2xl text-white outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all font-medium placeholder:text-gray-700"
                                        />
                                    </div>
                                </div>

                                <div className="mt-12 flex gap-6">
                                    <button 
                                        onClick={() => setSelectedGuest(null)}
                                        className="px-8 py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        Posponer
                                    </button>
                                    <button 
                                        onClick={handleConfirmCheckin}
                                        disabled={isCheckingIn}
                                        className="flex-1 bg-gradient-to-r from-primary to-green-600 hover:from-green-500 hover:to-primary text-white p-6 rounded-[1.5rem] font-black text-lg uppercase tracking-[0.3em] transition-all shadow-[0_20px_50px_rgba(27,127,60,0.4)] flex items-center justify-center gap-4 disabled:opacity-50 group active:scale-95 relative overflow-hidden"
                                    >
                                        {isCheckingIn && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                                        {isCheckingIn ? (
                                            <span className="flex items-center gap-3 relative z-10">
                                                <Scan className="animate-spin" size={24} /> Sincronizando AI...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-3 relative z-10">
                                                <Check size={28} className="group-hover:scale-125 transition-transform"/> Conceder Acceso
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
