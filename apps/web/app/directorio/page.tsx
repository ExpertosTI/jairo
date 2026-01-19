"use client";

import { useState, useEffect } from "react";
import { Building2, Search, Filter, MapPin, Globe, Phone, Mail, Network } from "lucide-react";
import Link from "next/link";

interface Empresa {
    id: string;
    name: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    sector_nombre: string;
    tipo_nombre: string;
    descripcion: string;
    conexiones: number;
}

interface Sector {
    id: string;
    name: string;
    icon: string;
}

export default function DirectorioPage() {
    const [cargando, setCargando] = useState(true);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [sectores, setSectores] = useState<Sector[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [sectorFiltro, setSectorFiltro] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        cargarDatos();
    }, [busqueda, sectorFiltro]);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const params = new URLSearchParams();
            if (busqueda) params.append('busqueda', busqueda);
            if (sectorFiltro) params.append('sector', sectorFiltro);
            params.append('estado', 'active');

            const [empresasRes, sectoresRes] = await Promise.all([
                fetch(`${API_URL}/empresas?${params.toString()}`),
                fetch(`${API_URL}/sectores`)
            ]);

            if (empresasRes.ok) {
                const data = await empresasRes.json();
                setEmpresas(data.empresas || []);
            }
            if (sectoresRes.ok) {
                const data = await sectoresRes.json();
                setSectores(data.sectores || []);
            }
        } catch (error) {
            console.error("Error cargando directorio:", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-orange-500 text-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/" className="text-2xl font-black">JairoApp</Link>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/login" className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10">
                                Iniciar Sesión
                            </Link>
                            <Link href="/registro" className="px-4 py-2 bg-white text-primary rounded-lg font-medium hover:bg-gray-100">
                                Registrar Empresa
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Directorio Empresarial</h1>
                        <p className="text-xl text-white/80 mb-8">
                            Encuentra y conecta con empresas de República Dominicana
                        </p>

                        {/* Search */}
                        <div className="max-w-2xl mx-auto flex gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar empresas..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
                                />
                            </div>
                            <select
                                value={sectorFiltro}
                                onChange={(e) => setSectorFiltro(e.target.value)}
                                className="px-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
                            >
                                <option value="">Todos los sectores</option>
                                {sectores.map(s => (
                                    <option key={s.id} value={s.name}>{s.icon} {s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sectors Quick Filter */}
            <div className="border-b bg-white">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => setSectorFiltro("")}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${!sectorFiltro ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Todos
                        </button>
                        {sectores.slice(0, 10).map((sector) => (
                            <button
                                key={sector.id}
                                onClick={() => setSectorFiltro(sector.name)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 ${sectorFiltro === sector.name ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <span>{sector.icon}</span>
                                {sector.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Companies Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {cargando ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-500">Cargando empresas...</p>
                    </div>
                ) : empresas.length === 0 ? (
                    <div className="text-center py-12">
                        <Building2 className="mx-auto mb-4 text-gray-300" size={64} />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No hay empresas</h3>
                        <p className="text-gray-500 mb-4">
                            {busqueda || sectorFiltro
                                ? "No se encontraron empresas con esos filtros"
                                : "Sé el primero en registrar tu empresa"}
                        </p>
                        <Link
                            href="/registro"
                            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600"
                        >
                            Registrar mi Empresa
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-500 mb-6">{empresas.length} empresas encontradas</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {empresas.map((empresa) => (
                                <div
                                    key={empresa.id}
                                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                                            <Building2 className="text-primary" size={28} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-lg truncate">{empresa.name}</h3>
                                            <p className="text-sm text-primary">{empresa.sector_nombre}</p>
                                            {empresa.tipo_nombre && (
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                                    {empresa.tipo_nombre}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {empresa.descripcion && (
                                        <p className="text-gray-500 text-sm mt-4 line-clamp-2">{empresa.descripcion}</p>
                                    )}

                                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                                        {empresa.address && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-gray-400" />
                                                <span className="truncate">{empresa.address}</span>
                                            </div>
                                        )}
                                        {empresa.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-gray-400" />
                                                <span>{empresa.phone}</span>
                                            </div>
                                        )}
                                        {empresa.website && (
                                            <div className="flex items-center gap-2">
                                                <Globe size={14} className="text-gray-400" />
                                                <a href={empresa.website} target="_blank" className="text-primary hover:underline truncate">
                                                    {empresa.website.replace(/https?:\/\//, '')}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                                            <Network size={14} />
                                            <span>{empresa.conexiones || 0} conexiones</span>
                                        </div>
                                        <button className="text-primary font-medium text-sm hover:underline">
                                            Ver perfil
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-black text-primary mb-2">JairoApp</h2>
                    <p className="text-gray-400">Plataforma B2B de República Dominicana</p>
                    <div className="flex justify-center gap-6 mt-6 text-sm text-gray-400">
                        <Link href="/terms" className="hover:text-white">Términos</Link>
                        <Link href="/privacy" className="hover:text-white">Privacidad</Link>
                        <Link href="/registro" className="hover:text-white">Registrar Empresa</Link>
                    </div>
                    <p className="text-gray-500 text-xs mt-6">© 2026 JairoApp. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
