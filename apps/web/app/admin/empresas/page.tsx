"use client";

import { useState, useEffect } from "react";
import { Building2, Plus, Search, Eye, Edit, Trash2, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";

interface Empresa {
    id: string;
    name: string;
    email: string;
    phone: string;
    sector_nombre: string;
    tipo_nombre: string;
    status: string;
    conexiones: number;
    created_at: string;
}

interface Sector {
    id: string;
    name: string;
}

export default function EmpresasPage() {
    const [cargando, setCargando] = useState(true);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [sectores, setSectores] = useState<Sector[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [sectorFiltro, setSectorFiltro] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [total, setTotal] = useState(0);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        cargarEmpresas();
        cargarSectores();
    }, [busqueda, sectorFiltro, estadoFiltro]);

    const cargarEmpresas = async () => {
        setCargando(true);
        try {
            const params = new URLSearchParams();
            if (busqueda) params.append('busqueda', busqueda);
            if (sectorFiltro) params.append('sector', sectorFiltro);
            if (estadoFiltro) params.append('estado', estadoFiltro);

            const res = await fetch(`${API_URL}/empresas?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setEmpresas(data.empresas || []);
                setTotal(data.total || 0);
            }
        } catch (error) {
            console.error("Error cargando empresas:", error);
        } finally {
            setCargando(false);
        }
    };

    const cargarSectores = async () => {
        try {
            const res = await fetch(`${API_URL}/sectores`);
            if (res.ok) {
                const data = await res.json();
                setSectores(data.sectores || []);
            }
        } catch (error) {
            console.error("Error cargando sectores:", error);
        }
    };

    const aprobarEmpresa = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/empresas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: 'active' })
            });
            if (res.ok) cargarEmpresas();
        } catch (error) {
            console.error("Error aprobando empresa:", error);
        }
    };

    const eliminarEmpresa = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta empresa?')) return;
        try {
            const res = await fetch(`${API_URL}/empresas/${id}`, { method: 'DELETE' });
            if (res.ok) cargarEmpresas();
        } catch (error) {
            console.error("Error eliminando empresa:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Empresas</h1>
                    <p className="text-gray-500 mt-1">
                        {total} empresas registradas en la plataforma
                    </p>
                </div>
                <Link
                    href="/registro"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                    <Plus size={20} />
                    Nueva Empresa
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar empresa..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Sector Filter */}
                    <select
                        value={sectorFiltro}
                        onChange={(e) => setSectorFiltro(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                        <option value="">Todos los Sectores</option>
                        {sectores.map(s => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                        <option value="">Todos los Estados</option>
                        <option value="active">Activas</option>
                        <option value="pending">Pendientes</option>
                        <option value="suspended">Suspendidas</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {cargando ? (
                    <div className="p-12 text-center">
                        <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
                        <p className="text-gray-500">Cargando empresas...</p>
                    </div>
                ) : empresas.length === 0 ? (
                    <div className="p-12 text-center">
                        <Building2 className="mx-auto mb-4 text-gray-300" size={48} />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No hay empresas</h3>
                        <p className="text-gray-500 mb-4">
                            {busqueda || sectorFiltro || estadoFiltro
                                ? "No se encontraron empresas con esos filtros"
                                : "Aún no hay empresas registradas"}
                        </p>
                        <Link href="/registro" className="text-primary font-medium hover:underline">
                            Registrar primera empresa →
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Empresa</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Sector</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Tipo</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Conexiones</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {empresas.map((empresa) => (
                                    <tr key={empresa.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <Building2 className="text-primary" size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{empresa.name}</h4>
                                                    <p className="text-sm text-gray-500">{empresa.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{empresa.sector_nombre || "-"}</td>
                                        <td className="px-6 py-4 text-gray-700">{empresa.tipo_nombre || "-"}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-700">{empresa.conexiones || 0}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${empresa.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : empresa.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}>
                                                {empresa.status === "active" ? "Activa" : empresa.status === "pending" ? "Pendiente" : "Suspendida"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                {empresa.status === "pending" && (
                                                    <button
                                                        onClick={() => aprobarEmpresa(empresa.id)}
                                                        className="p-2 hover:bg-green-50 rounded-lg text-gray-500 hover:text-green-600"
                                                        title="Aprobar"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary" title="Ver">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-500" title="Editar">
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => eliminarEmpresa(empresa.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
