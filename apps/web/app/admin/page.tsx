"use client";

import { useEffect, useState } from "react";
import { Building2, Users, Network, TrendingUp, ArrowUpRight, Clock, Activity } from "lucide-react";
import Link from "next/link";

interface Estadisticas {
    empresas: { total: number; activas: number; pendientes: number; nuevas_semana: number };
    usuarios: { total: number; super_admins: number; admins: number; nuevos_semana: number };
    conexiones: { total: number; activas: number; pendientes: number };
    sectores: { total: number };
}

interface EmpresaReciente {
    id: string;
    name: string;
    email: string;
    status: string;
    created_at: string;
    sector_nombre: string;
    sector_icono: string;
}

interface Actividad {
    id: string;
    type: string;
    description: string;
    created_at: string;
    empresa_nombre: string;
}

interface SectorDistribucion {
    id: string;
    name: string;
    icon: string;
    color: string;
    total_empresas: number;
}

export default function AdminDashboard() {
    const [cargando, setCargando] = useState(true);
    const [stats, setStats] = useState<Estadisticas | null>(null);
    const [empresasRecientes, setEmpresasRecientes] = useState<EmpresaReciente[]>([]);
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [sectores, setSectores] = useState<SectorDistribucion[]>([]);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [statsRes, empresasRes, actividadesRes, sectoresRes] = await Promise.all([
                fetch(`${API_URL}/dashboard/estadisticas`),
                fetch(`${API_URL}/dashboard/empresas-recientes`),
                fetch(`${API_URL}/dashboard/actividades-recientes`),
                fetch(`${API_URL}/dashboard/sectores-distribucion`),
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (empresasRes.ok) {
                const data = await empresasRes.json();
                setEmpresasRecientes(data.empresas || []);
            }
            if (actividadesRes.ok) {
                const data = await actividadesRes.json();
                setActividades(data.actividades || []);
            }
            if (sectoresRes.ok) {
                const data = await sectoresRes.json();
                setSectores(data.sectores || []);
            }
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setCargando(false);
        }
    };

    const formatearFecha = (fecha: string) => {
        const date = new Date(fecha);
        const ahora = new Date();
        const diff = ahora.getTime() - date.getTime();
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (dias === 0) return "Hoy";
        if (dias === 1) return "Ayer";
        if (dias < 7) return `Hace ${dias} días`;
        return date.toLocaleDateString('es-DO');
    };

    const statsCards = [
        {
            label: "Total Empresas",
            value: stats?.empresas.total || 0,
            subValue: `+${stats?.empresas.nuevas_semana || 0} esta semana`,
            icon: Building2,
            color: "bg-blue-500",
            href: "/admin/empresas"
        },
        {
            label: "Usuarios Activos",
            value: stats?.usuarios.total || 0,
            subValue: `${stats?.usuarios.admins || 0} administradores`,
            icon: Users,
            color: "bg-green-500",
            href: "/admin/usuarios"
        },
        {
            label: "Conexiones",
            value: stats?.conexiones.activas || 0,
            subValue: `${stats?.conexiones.pendientes || 0} pendientes`,
            icon: Network,
            color: "bg-purple-500",
            href: "/admin/relaciones"
        },
        {
            label: "Sectores",
            value: stats?.sectores.total || 0,
            subValue: "categorías activas",
            icon: TrendingUp,
            color: "bg-orange-500",
            href: "/admin/sectores"
        },
    ];

    if (cargando) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Cargando panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900">Panel Principal</h1>
                <p className="text-gray-500 mt-1">Bienvenido al panel de administración de JairoApp</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="text-white" size={24} />
                            </div>
                            <ArrowUpRight className="text-gray-300" size={20} />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className="text-xs text-gray-400 mt-1">{stat.subValue}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Companies */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Empresas Recientes</h2>
                        <Link href="/admin/empresas" className="text-primary text-sm font-medium hover:underline">
                            Ver todas
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {empresasRecientes.length > 0 ? empresasRecientes.slice(0, 5).map((empresa) => (
                            <div key={empresa.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">
                                        {empresa.sector_icono || "🏢"}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{empresa.name}</h4>
                                        <p className="text-sm text-gray-500">{empresa.sector_nombre || "Sin sector"}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${empresa.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {empresa.status === "active" ? "Activa" : "Pendiente"}
                                    </span>
                                    <p className="text-xs text-gray-400 mt-1">{formatearFecha(empresa.created_at)}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-400">
                                <Building2 className="mx-auto mb-2 opacity-50" size={32} />
                                <p>No hay empresas registradas</p>
                                <Link href="/registro" className="text-primary text-sm hover:underline">
                                    Registrar primera empresa
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sectors Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Distribución por Sector</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {sectores.length > 0 ? sectores.slice(0, 8).map((sector) => (
                            <div key={sector.id} className="flex items-center gap-3">
                                <span className="text-xl">{sector.icon}</span>
                                <span className="flex-1 text-sm text-gray-700">{sector.name}</span>
                                <span className="text-sm font-medium text-gray-900">{sector.total_empresas}</span>
                            </div>
                        )) : (
                            <p className="text-gray-400 text-center py-4">Cargando sectores...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                    <Activity className="text-primary" size={20} />
                    <h2 className="text-lg font-bold text-gray-900">Actividad Reciente</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {actividades.length > 0 ? actividades.slice(0, 8).map((actividad) => (
                        <div key={actividad.id} className="p-4 flex items-center gap-4">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-700">{actividad.description}</p>
                                {actividad.empresa_nombre && (
                                    <p className="text-xs text-gray-400">{actividad.empresa_nombre}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock size={12} />
                                {formatearFecha(actividad.created_at)}
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-gray-400">
                            <Activity className="mx-auto mb-2 opacity-50" size={32} />
                            <p>No hay actividad reciente</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
