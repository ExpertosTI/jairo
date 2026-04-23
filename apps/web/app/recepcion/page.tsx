"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
    Users, ShieldCheck, Fingerprint, LayoutGrid, Search, CheckCircle2,
    X, Layers, Phone, Mail, Activity, Building2, Briefcase, Crown,
    Music, Coffee, Link as LinkIcon, ChevronRight, Edit3, WifiOff,
    RefreshCw, Zap, ArrowRight, Clock, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = '/api';
const EVENT_ID = 'evt_circulo_001';
const SYNC_PATH_GET = `${API_BASE}/events/${EVENT_ID}/attendance`;
const SYNC_PATH_POST = `${API_BASE}/events/attendance`;

const ROLES_ESTRATEGICOS = ["CEO", "Estrategia", "Tecnología", "Operaciones", "Socio", "Invitado Especial"];
const TIPOS_RELACION = [
    { value: 'socio', label: 'Socio Estratégico' },
    { value: 'cliente', label: 'Cliente' },
    { value: 'proveedor', label: 'Proveedor' },
    { value: 'distribuidor', label: 'Distribuidor' },
];
const EMPRESAS_DOMINIOS: Record<string, string> = {
    "coopseguros.com": "Coopseguros",
    "coopmaimon.com": "Coopmaimon",
    "renace.tech": "RenaceTech",
    "gmail.com": "Invitado Particular",
    "outlook.com": "Invitado Particular",
};

// ─── MANIFEST (107 NODOS) ─────────────────────────────────────────────────────
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

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getInitials(name: string) {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getMesaIcon(mesa: string, size = "w-4 h-4") {
    const m = parseInt(mesa);
    if (m <= 2) return <Crown className={`${size} text-amber-400`} />;
    if (m >= 7 && m <= 11) return <Music className={`${size} text-violet-400`} />;
    return <Coffee className={`${size} text-emerald-400`} />;
}

function getAvatarColor(empresa: string) {
    if (empresa === 'Coopseguros') return 'from-blue-600 to-blue-800';
    if (empresa === 'Coopmaimon') return 'from-indigo-600 to-indigo-800';
    if (empresa === 'Musicos') return 'from-violet-600 to-violet-800';
    if (empresa === 'RenaceTech') return 'from-emerald-600 to-emerald-800';
    return 'from-zinc-700 to-zinc-900';
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function RecepcionCommandCenter() {
    const [view, setView] = useState<'directory' | 'tables'>('directory');
    const [searchTerm, setSearchTerm] = useState("");
    const [invitados, setInvitados] = useState(INITIAL_MANIFEST);
    const [selectedGuest, setSelectedGuest] = useState<any>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [networkLatency, setNetworkLatency] = useState<number | null>(null);
    const [isOnline, setIsOnline] = useState(true);
    const [lastSync, setLastSync] = useState<Date | null>(null);

    const [formData, setFormData] = useState({ nombre: "", empresa: "", rol: "Estrategia", telefono: "", correo: "" });
    const [isEditingMesa, setIsEditingMesa] = useState(false);
    const [tempMesa, setTempMesa] = useState("");

    // Vincular state
    const [showVincular, setShowVincular] = useState(false);
    const [vincularStatus, setVincularStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [vincularForm, setVincularForm] = useState({ empresaDestino: "", tipo: "socio", notas: "" });
    const [lastCheckedInCompanyId, setLastCheckedInCompanyId] = useState<string | null>(null);

    // ─── SYNC ──────────────────────────────────────────────────────────────
    const syncAttendance = useCallback(async () => {
        const start = Date.now();
        try {
            const res = await fetch(SYNC_PATH_GET, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setNetworkLatency(Date.now() - start);
                setIsOnline(true);
                setLastSync(new Date());
                setInvitados(prev => prev.map(inv => {
                    const cleared = data.find((a: any) => String(a.guestId) === String(inv.id));
                    return cleared ? { ...inv, status: 'cleared' } : inv;
                }));
            }
        } catch {
            setIsOnline(false);
        }
    }, []);

    useEffect(() => {
        syncAttendance();
        const interval = setInterval(syncAttendance, 15000);
        return () => clearInterval(interval);
    }, [syncAttendance]);

    // Auto-detect company from email domain
    useEffect(() => {
        if (formData.correo.includes("@")) {
            const domain = formData.correo.split("@")[1]?.toLowerCase();
            if (domain && EMPRESAS_DOMINIOS[domain]) {
                setFormData(prev => ({ ...prev, empresa: EMPRESAS_DOMINIOS[domain] }));
            }
        }
    }, [formData.correo]);

    // Populate form when guest is selected
    useEffect(() => {
        if (selectedGuest) {
            setFormData({ nombre: selectedGuest.nombre, empresa: selectedGuest.empresa, rol: "Estrategia", telefono: "", correo: "" });
            setShowVincular(false);
            setVincularStatus('idle');
            setLastCheckedInCompanyId(null);
        }
    }, [selectedGuest]);

    // ─── CONFIRM ATTENDANCE ────────────────────────────────────────────────
    const handleGrantAccess = async () => {
        if (!selectedGuest) return;
        setStatus('loading');

        const payload = {
            eventId: EVENT_ID,
            guestId: Number(selectedGuest.id),
            metadata: {
                nombre: formData.nombre,
                empresa: formData.empresa,
                email: formData.correo,
                mesa: selectedGuest.mesa,
                timestamp: new Date().toISOString()
            }
        };

        const markCleared = (companyId?: string) => {
            setStatus('success');
            if (companyId) setLastCheckedInCompanyId(companyId);
            setInvitados(prev => prev.map(inv =>
                inv.id === selectedGuest.id
                    ? { ...inv, status: 'cleared', nombre: formData.nombre, empresa: formData.empresa }
                    : inv
            ));
            setTimeout(() => setStatus('idle'), 2200);
        };

        try {
            const res = await fetch(SYNC_PATH_POST, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                const companyId = data[0]?.metadata ? JSON.parse(data[0].metadata)?.companyId : null;
                markCleared(companyId);
            } else {
                // Offline fallback: persist locally
                const stored = JSON.parse(localStorage.getItem(`offline_${EVENT_ID}`) || '[]');
                stored.push({ ...payload, storedAt: new Date().toISOString() });
                localStorage.setItem(`offline_${EVENT_ID}`, JSON.stringify(stored));
                markCleared();
            }
        } catch {
            const stored = JSON.parse(localStorage.getItem(`offline_${EVENT_ID}`) || '[]');
            stored.push({ ...payload, storedAt: new Date().toISOString() });
            localStorage.setItem(`offline_${EVENT_ID}`, JSON.stringify(stored));
            markCleared();
        }
    };

    // ─── VINCULAR EMPRESA ──────────────────────────────────────────────────
    const handleVincular = async () => {
        if (!vincularForm.empresaDestino.trim()) return;
        setVincularStatus('loading');

        try {
            const guestEmpresa = formData.empresa || selectedGuest?.empresa || 'Invitado';

            // Search source company
            const srcRes = await fetch(`${API_BASE}/empresas?busqueda=${encodeURIComponent(guestEmpresa)}`);
            const srcData = srcRes.ok ? await srcRes.json() : [];

            // Search destination company
            const dstRes = await fetch(`${API_BASE}/empresas?busqueda=${encodeURIComponent(vincularForm.empresaDestino)}`);
            const dstData = dstRes.ok ? await dstRes.json() : [];

            if (!srcData.length || !dstData.length) {
                // Companies might not exist yet – record intent in attendance metadata for admin processing
                const intentPayload = {
                    eventId: EVENT_ID,
                    guestId: Number(selectedGuest?.id),
                    metadata: {
                        nombre: formData.nombre,
                        empresa: guestEmpresa,
                        vincularIntent: {
                            empresaDestino: vincularForm.empresaDestino,
                            tipo: vincularForm.tipo,
                            notas: vincularForm.notas,
                            timestamp: new Date().toISOString()
                        }
                    }
                };
                await fetch(SYNC_PATH_POST, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(intentPayload)
                }).catch(() => null);

                setVincularStatus('success');
                return;
            }

            const relRes = await fetch(`${API_BASE}/relaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    empresaOrigenId: srcData[0].id,
                    empresaDestinoId: dstData[0].id,
                    tipo: vincularForm.tipo,
                    notas: vincularForm.notas || `Conexión generada en Círculo 001 — ${new Date().toLocaleDateString('es-DO')}`
                })
            });

            setVincularStatus(relRes.ok ? 'success' : 'error');
        } catch {
            setVincularStatus('error');
        }
    };

    // ─── MESA UPDATE ───────────────────────────────────────────────────────
    const handleMesaUpdate = (guestId: string, newMesa: string) => {
        setInvitados(prev => prev.map(inv => inv.id === guestId ? { ...inv, mesa: newMesa } : inv));
        if (selectedGuest?.id === guestId) setSelectedGuest((p: any) => ({ ...p, mesa: newMesa }));
        setIsEditingMesa(false);
    };

    // ─── COMPUTED DATA ─────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const cleared = invitados.filter(i => i.status === 'cleared').length;
        const total = invitados.length;
        const mesasActivas = new Set(invitados.filter(i => i.status === 'cleared').map(i => i.mesa)).size;
        return { cleared, total, pending: total - cleared, mesasActivas, pct: Math.round((cleared / total) * 100) };
    }, [invitados]);

    const filtered = useMemo(() => invitados.filter(inv =>
        inv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.mesa.includes(searchTerm)
    ), [searchTerm, invitados]);

    const mesasIds = useMemo(() =>
        Array.from(new Set(invitados.map(i => i.mesa))).sort((a, b) => parseInt(a) - parseInt(b)),
        [invitados]
    );

    const closeModal = () => {
        setSelectedGuest(null);
        setStatus('idle');
        setIsEditingMesa(false);
        setShowVincular(false);
        setVincularStatus('idle');
    };

    // ─── RENDER ────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#020408] text-white selection:bg-emerald-500/20 flex flex-col overflow-hidden">

            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-[30rem] -right-[20rem] w-[70rem] h-[70rem] rounded-full bg-emerald-950/30 blur-[120px]" />
                <div className="absolute -bottom-[20rem] -left-[10rem] w-[50rem] h-[50rem] rounded-full bg-indigo-950/20 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAxNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
            </div>

            {/* ── NAV ─────────────────────────────────────────────────────── */}
            <nav className="sticky top-0 z-50 h-16 sm:h-20 border-b border-white/[0.06] bg-[#020408]/90 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-8 lg:px-12 gap-4">
                {/* Logo */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                        <Fingerprint className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="hidden sm:block">
                        <div className="text-sm font-black uppercase tracking-tight">JairoOS v2</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                                {isOnline ? `SYNC ${networkLatency != null ? `${networkLatency}ms` : '—'}` : 'OFFLINE'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar invitado, empresa o mesa..."
                        className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:border-emerald-500/40 focus:bg-white/[0.06] outline-none transition-all placeholder:text-zinc-700"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* View toggle */}
                <div className="flex gap-1.5 shrink-0">
                    <button
                        onClick={() => setView('directory')}
                        className={`p-2.5 sm:p-3 rounded-xl transition-all ${view === 'directory' ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.35)] text-white' : 'bg-white/[0.04] text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.07]'}`}
                    >
                        <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                        onClick={() => setView('tables')}
                        className={`p-2.5 sm:p-3 rounded-xl transition-all ${view === 'tables' ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.35)] text-white' : 'bg-white/[0.04] text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.07]'}`}
                    >
                        <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </nav>

            {/* ── STATS BAR ────────────────────────────────────────────────── */}
            <div className="sticky top-16 sm:top-20 z-40 bg-[#020408]/80 backdrop-blur-xl border-b border-white/[0.04] px-4 sm:px-8 lg:px-12 py-3">
                <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
                    {/* Progress */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative flex-1 min-w-[80px] max-w-[200px] h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.pct}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                        <span className="text-xs font-black text-emerald-400 tabular-nums">{stats.pct}%</span>
                    </div>

                    <div className="h-4 w-px bg-white/[0.08] hidden sm:block" />

                    {/* Stats pills */}
                    <div className="flex items-center gap-3 text-xs font-bold">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-400 tabular-nums">{stats.cleared}</span>
                            <span className="text-zinc-700">ingresados</span>
                        </div>
                        <div className="h-3 w-px bg-white/[0.08]" />
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-600" />
                            <span className="text-zinc-500 tabular-nums">{stats.pending}</span>
                            <span className="text-zinc-700">pendientes</span>
                        </div>
                        <div className="h-3 w-px bg-white/[0.08] hidden sm:block" />
                        <div className="hidden sm:flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                            <span className="text-zinc-400 tabular-nums">{stats.mesasActivas}</span>
                            <span className="text-zinc-700">mesas activas</span>
                        </div>
                    </div>

                    {/* Search result count */}
                    {searchTerm && (
                        <>
                            <div className="h-3 w-px bg-white/[0.08]" />
                            <span className="text-xs text-zinc-600 tabular-nums">
                                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                            </span>
                        </>
                    )}

                    {lastSync && (
                        <div className="hidden lg:flex items-center gap-1.5 ml-auto text-[10px] text-zinc-700">
                            <Activity className="w-3 h-3" />
                            <span>Sync {lastSync.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 z-10 custom-scrollbar pb-24">
                <AnimatePresence mode="wait">

                    {/* Directory view */}
                    {view === 'directory' && (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4"
                        >
                            {filtered.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4 text-zinc-700">
                                    <Search className="w-10 h-10 opacity-30" />
                                    <p className="text-sm font-semibold">Sin resultados para "{searchTerm}"</p>
                                </div>
                            )}
                            {filtered.map((inv, i) => (
                                <motion.div
                                    key={inv.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.94 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: Math.min(i * 0.015, 0.3), duration: 0.2 }}
                                    onClick={() => setSelectedGuest(inv)}
                                    className={`
                                        relative p-4 sm:p-5 rounded-2xl border cursor-pointer
                                        transition-all duration-200 group select-none active:scale-[0.97]
                                        ${inv.status === 'cleared'
                                            ? 'border-emerald-500/25 bg-emerald-500/[0.06] shadow-[0_0_30px_rgba(16,185,129,0.04)]'
                                            : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                                        }
                                    `}
                                >
                                    {/* VIP badge */}
                                    {inv.isVIP && (
                                        <div className="absolute top-3 right-3 w-5 h-5 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center">
                                            <Crown className="w-2.5 h-2.5 text-amber-400" />
                                        </div>
                                    )}

                                    {/* Avatar */}
                                    <div className={`
                                        w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(inv.empresa)}
                                        flex items-center justify-center mb-4 border border-white/[0.08]
                                        group-hover:scale-105 transition-transform duration-200
                                    `}>
                                        <span className="text-xs sm:text-sm font-black text-white/90 tracking-tight">
                                            {getInitials(inv.nombre)}
                                        </span>
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-xs sm:text-sm font-bold leading-tight mb-1 group-hover:text-emerald-300 transition-colors line-clamp-2">
                                        {inv.nombre}
                                    </h3>

                                    {/* Footer */}
                                    <div className="mt-3 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            {getMesaIcon(inv.mesa, "w-3 h-3")}
                                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">M.{inv.mesa}</span>
                                        </div>
                                        {inv.status === 'cleared'
                                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                            : <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 shrink-0" />
                                        }
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Tables view */}
                    {view === 'tables' && (
                        <motion.div
                            key="tables"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        >
                            {mesasIds.map(mesaId => {
                                const mesaInvs = invitados.filter(i => i.mesa === mesaId);
                                const filteredMesaInvs = filtered.filter(i => i.mesa === mesaId);
                                if (searchTerm && filteredMesaInvs.length === 0) return null;

                                const clearedCount = mesaInvs.filter(i => i.status === 'cleared').length;
                                const total = mesaInvs.length;
                                const pct = Math.round((clearedCount / total) * 100);
                                const displayList = searchTerm ? filteredMesaInvs : mesaInvs;

                                return (
                                    <div key={mesaId} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all overflow-hidden">
                                        {/* Table header */}
                                        <div className="px-5 pt-5 pb-4 border-b border-white/[0.05]">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2.5">
                                                    {getMesaIcon(mesaId, "w-4 h-4")}
                                                    <span className="text-base font-black uppercase tracking-tight">Mesa {mesaId}</span>
                                                </div>
                                                <span className="text-xs font-bold text-zinc-600 tabular-nums">{clearedCount}/{total}</span>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500/60 rounded-full transition-all duration-700"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Guest list */}
                                        <div className="p-3 space-y-1">
                                            {displayList.map(inv => (
                                                <div
                                                    key={inv.id}
                                                    onClick={() => setSelectedGuest(inv)}
                                                    className={`
                                                        flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl
                                                        cursor-pointer transition-all active:scale-[0.98] group/item
                                                        ${inv.status === 'cleared'
                                                            ? 'bg-emerald-500/[0.08] border border-emerald-500/20'
                                                            : 'hover:bg-white/[0.04] border border-transparent'
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${getAvatarColor(inv.empresa)} flex items-center justify-center shrink-0`}>
                                                            <span className="text-[8px] font-black text-white">{getInitials(inv.nombre)}</span>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-bold leading-tight truncate group-hover/item:text-emerald-300 transition-colors">{inv.nombre}</p>
                                                            {inv.empresa !== 'Invitado' && (
                                                                <p className="text-[9px] text-zinc-600 font-semibold truncate">{inv.empresa}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {inv.status === 'cleared'
                                                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                        : <ChevronRight className="w-3.5 h-3.5 text-zinc-800 group-hover/item:text-zinc-500 transition-colors shrink-0" />
                                                    }
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

            {/* ── MODAL ─────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedGuest && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 60, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.97 }}
                            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                            className="w-full sm:max-w-2xl lg:max-w-3xl max-h-[95vh] sm:max-h-[90vh] bg-[#06090f] rounded-t-3xl sm:rounded-3xl border border-white/[0.08] flex flex-col relative overflow-hidden shadow-[0_-40px_100px_rgba(0,0,0,0.8)] sm:shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
                        >
                            {/* Close button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 p-2 bg-white/[0.06] hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Mobile drag handle */}
                            <div className="sm:hidden flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1 bg-white/10 rounded-full" />
                            </div>

                            {/* Scrollable body */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">

                                {/* Identity header */}
                                <div className="px-6 sm:px-8 pt-5 sm:pt-7 pb-6 border-b border-white/[0.06]">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className={`
                                            w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${getAvatarColor(selectedGuest.empresa)}
                                            flex items-center justify-center border border-white/10 shrink-0
                                            shadow-[0_8px_30px_rgba(0,0,0,0.4)]
                                        `}>
                                            <span className="text-xl font-black text-white">{getInitials(selectedGuest.nombre)}</span>
                                        </div>

                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Verificación de Acceso</span>
                                                {selectedGuest.isVIP && (
                                                    <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-[9px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                                        <Crown className="w-2.5 h-2.5" /> VIP
                                                    </span>
                                                )}
                                                {selectedGuest.status === 'cleared' && (
                                                    <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                                        <CheckCircle2 className="w-2.5 h-2.5" /> Confirmado
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                value={formData.nombre}
                                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                                className="text-xl sm:text-2xl font-black uppercase tracking-tight bg-transparent outline-none border-b-2 border-transparent focus:border-emerald-500/50 transition-all pb-0.5 w-full truncate"
                                                placeholder="Nombre del invitado"
                                            />
                                            <div className="flex items-center gap-2 mt-1.5">
                                                {getMesaIcon(selectedGuest.mesa, "w-3.5 h-3.5")}
                                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Mesa {selectedGuest.mesa}</span>
                                                <span className="text-zinc-800">·</span>
                                                <span className="text-xs font-semibold text-zinc-600">{formData.empresa || selectedGuest.empresa}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form fields */}
                                <div className="px-6 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                                            <Mail className="w-3 h-3" /> Correo electrónico
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                placeholder="nombre@empresa.com"
                                                value={formData.correo}
                                                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                                                className="w-full h-12 bg-white/[0.03] border border-white/[0.07] focus:border-emerald-500/40 rounded-xl px-4 text-sm font-semibold outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Company */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                                            <Building2 className="w-3 h-3" /> Organización
                                        </label>
                                        <input
                                            value={formData.empresa}
                                            onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                                            className="w-full h-12 bg-white/[0.03] border border-white/[0.07] focus:border-emerald-500/40 rounded-xl px-4 text-sm font-semibold outline-none transition-all"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                                            <Phone className="w-3 h-3" /> Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="849-000-0000"
                                            value={formData.telefono}
                                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                            className="w-full h-12 bg-white/[0.03] border border-white/[0.07] focus:border-emerald-500/40 rounded-xl px-4 text-sm font-semibold outline-none transition-all"
                                        />
                                    </div>

                                    {/* Role */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                                            <Briefcase className="w-3 h-3" /> Rol
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={formData.rol}
                                                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                                                className="w-full h-12 bg-white/[0.03] border border-white/[0.07] focus:border-emerald-500/40 rounded-xl px-4 text-sm font-semibold outline-none appearance-none transition-all"
                                            >
                                                {ROLES_ESTRATEGICOS.map(r => <option key={r} value={r} className="bg-[#06090f]">{r}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Mesa control */}
                                <div className="px-6 sm:px-8 pb-6">
                                    <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/[0.06] flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                                                {getMesaIcon(selectedGuest.mesa)}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Mesa asignada</div>
                                                {!isEditingMesa ? (
                                                    <span className="text-2xl font-black text-emerald-400 tracking-tighter">#{selectedGuest.mesa}</span>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            autoFocus
                                                            type="number" min="1" max="14"
                                                            value={tempMesa}
                                                            onChange={(e) => setTempMesa(e.target.value)}
                                                            className="bg-white/10 border-2 border-emerald-500 rounded-lg px-2 py-1 text-lg font-black w-16 outline-none text-center"
                                                        />
                                                        <button
                                                            onClick={() => handleMesaUpdate(selectedGuest.id, tempMesa)}
                                                            className="px-3 py-1 bg-emerald-600 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-emerald-500 transition-all"
                                                        >
                                                            OK
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setTempMesa(selectedGuest.mesa); setIsEditingMesa(!isEditingMesa); }}
                                            className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.07] rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-all"
                                        >
                                            {isEditingMesa ? 'Cancelar' : 'Cambiar'}
                                        </button>
                                    </div>
                                </div>

                                {/* ── VINCULAR SECTION ────────────────────────────────── */}
                                <div className="px-6 sm:px-8 pb-6">
                                    <button
                                        onClick={() => setShowVincular(!showVincular)}
                                        className={`
                                            w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all
                                            ${showVincular
                                                ? 'border-violet-500/30 bg-violet-500/[0.06]'
                                                : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${showVincular ? 'bg-violet-500/20' : 'bg-white/[0.04]'}`}>
                                                <LinkIcon className={`w-4 h-4 ${showVincular ? 'text-violet-400' : 'text-zinc-600'}`} />
                                            </div>
                                            <div className="text-left">
                                                <div className={`text-sm font-bold ${showVincular ? 'text-violet-300' : 'text-zinc-400'}`}>Vincular Empresa</div>
                                                <div className="text-[10px] text-zinc-700">Crear conexión B2B con otra organización</div>
                                            </div>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${showVincular ? 'rotate-90 text-violet-400' : 'text-zinc-700'}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showVincular && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-3 p-4 bg-violet-500/[0.04] rounded-2xl border border-violet-500/20 space-y-3">
                                                    {vincularStatus === 'success' ? (
                                                        <div className="flex flex-col items-center py-4 gap-3 text-center">
                                                            <CheckCircle2 className="w-10 h-10 text-violet-400" />
                                                            <p className="text-sm font-bold text-violet-300">¡Conexión registrada!</p>
                                                            <p className="text-xs text-zinc-600">La relación entre empresas ha sido guardada en el sistema.</p>
                                                            <button onClick={() => { setVincularStatus('idle'); setVincularForm({ empresaDestino: "", tipo: "socio", notas: "" }); }} className="text-xs text-zinc-600 hover:text-white underline">Nueva conexión</button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div>
                                                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1.5">Empresa origen</label>
                                                                <div className="h-10 bg-white/[0.03] rounded-xl border border-white/[0.06] px-3 flex items-center text-sm font-semibold text-zinc-400">
                                                                    {formData.empresa || selectedGuest.empresa}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1.5">Conectar con empresa</label>
                                                                <input
                                                                    value={vincularForm.empresaDestino}
                                                                    onChange={(e) => setVincularForm({ ...vincularForm, empresaDestino: e.target.value })}
                                                                    placeholder="Nombre de la empresa destino"
                                                                    className="w-full h-10 bg-white/[0.03] border border-white/[0.07] focus:border-violet-500/40 rounded-xl px-3 text-sm font-semibold outline-none transition-all"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1.5">Tipo de relación</label>
                                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                                                    {TIPOS_RELACION.map(t => (
                                                                        <button
                                                                            key={t.value}
                                                                            onClick={() => setVincularForm({ ...vincularForm, tipo: t.value })}
                                                                            className={`py-2 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${vincularForm.tipo === t.value ? 'bg-violet-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'bg-white/[0.03] border border-white/[0.06] text-zinc-600 hover:text-zinc-300'}`}
                                                                        >
                                                                            {t.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={handleVincular}
                                                                disabled={!vincularForm.empresaDestino || vincularStatus === 'loading'}
                                                                className="w-full h-11 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                                                            >
                                                                {vincularStatus === 'loading' ? (
                                                                    <><RefreshCw className="w-4 h-4 animate-spin" /> Registrando...</>
                                                                ) : (
                                                                    <><LinkIcon className="w-4 h-4" /> Crear Conexión</>
                                                                )}
                                                            </button>
                                                            {vincularStatus === 'error' && (
                                                                <p className="text-xs text-red-400 text-center">Error al crear la conexión. Intente nuevamente.</p>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                            </div>

                            {/* ── ACTION FOOTER ────────────────────────────────── */}
                            <div className="px-6 sm:px-8 py-5 bg-white/[0.01] border-t border-white/[0.05] flex items-center justify-between gap-4 shrink-0">
                                <button
                                    onClick={closeModal}
                                    className="text-xs font-bold text-zinc-700 hover:text-zinc-400 uppercase tracking-widest transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleGrantAccess}
                                    disabled={selectedGuest.status === 'cleared' || status === 'loading'}
                                    className={`
                                        flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider
                                        transition-all active:scale-[0.97] shadow-[0_0_30px_rgba(16,185,129,0.25)]
                                        ${selectedGuest.status === 'cleared'
                                            ? 'bg-emerald-900/50 text-emerald-500 border border-emerald-500/30 cursor-default'
                                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                        }
                                    `}
                                >
                                    {selectedGuest.status === 'cleared' ? (
                                        <><CheckCircle2 className="w-4 h-4" /> Acceso confirmado</>
                                    ) : status === 'loading' ? (
                                        <><RefreshCw className="w-4 h-4 animate-spin" /> Procesando...</>
                                    ) : (
                                        <>Confirmar acceso <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            </div>

                            {/* ── STATUS OVERLAY ───────────────────────────────── */}
                            <AnimatePresence>
                                {(status === 'loading' || status === 'success') && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-[#06090f]/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-t-3xl sm:rounded-3xl"
                                    >
                                        {status === 'loading' && (
                                            <div className="flex flex-col items-center gap-6">
                                                <div className="relative w-20 h-20">
                                                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin" />
                                                    <Fingerprint className="absolute inset-0 m-auto w-8 h-8 text-emerald-500/40 animate-pulse" />
                                                </div>
                                                <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500">Sincronizando...</p>
                                            </div>
                                        )}
                                        {status === 'success' && (
                                            <motion.div
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                className="flex flex-col items-center gap-6"
                                            >
                                                <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.6)]">
                                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tighter">ACCESO CONFIRMADO</p>
                                                    <p className="text-sm text-zinc-600 mt-2 font-semibold">{formData.nombre}</p>
                                                </div>
                                            </motion.div>
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
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.15); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.3); }
                select { -webkit-appearance: none; appearance: none; }
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            `}</style>
        </div>
    );
}
