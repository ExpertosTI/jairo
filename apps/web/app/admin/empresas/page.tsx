"use client";

import { useState } from "react";
import { Building2, Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

// Datos de ejemplo
const empresas = [
    {
        id: "1",
        nombre: "Distribuidora del Caribe",
        sector: "Retail",
        tipo: "Distribuidor",
        email: "info@distcaribe.com",
        telefono: "809-555-0101",
        estado: "Activa",
        conexiones: 12,
        fechaRegistro: "2024-01-15"
    },
    {
        id: "2",
        nombre: "Tech Solutions RD",
        sector: "Tecnología",
        tipo: "Proveedor",
        email: "contacto@techsol.do",
        telefono: "809-555-0202",
        estado: "Pendiente",
        conexiones: 5,
        fechaRegistro: "2024-01-18"
    },
    {
        id: "3",
        nombre: "Constructora Marte",
        sector: "Construcción",
        tipo: "Fabricante",
        email: "ventas@constmarte.com",
        telefono: "809-555-0303",
        estado: "Activa",
        conexiones: 8,
        fechaRegistro: "2024-01-10"
    },
    {
        id: "4",
        nombre: "Farmacia Central",
        sector: "Salud",
        tipo: "Distribuidor",
        email: "admin@farmcentral.do",
        telefono: "809-555-0404",
        estado: "Activa",
        conexiones: 15,
        fechaRegistro: "2024-01-05"
    },
    {
        id: "5",
        nombre: "Alimentos del Norte",
        sector: "Manufactura",
        tipo: "Fabricante",
        email: "info@alimnorte.com",
        telefono: "809-555-0505",
        estado: "Suspendida",
        conexiones: 3,
        fechaRegistro: "2023-12-20"
    },
];

const sectores = ["Todos", "Tecnología", "Retail", "Manufactura", "Construcción", "Salud", "Servicios"];
const estados = ["Todos", "Activa", "Pendiente", "Suspendida"];

export default function EmpresasPage() {
    const [busqueda, setBusqueda] = useState("");
    const [sectorFiltro, setSectorFiltro] = useState("Todos");
    const [estadoFiltro, setEstadoFiltro] = useState("Todos");

    const empresasFiltradas = empresas.filter(emp => {
        const matchBusqueda = emp.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const matchSector = sectorFiltro === "Todos" || emp.sector === sectorFiltro;
        const matchEstado = estadoFiltro === "Todos" || emp.estado === estadoFiltro;
        return matchBusqueda && matchSector && matchEstado;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Empresas</h1>
                    <p className="text-gray-500 mt-1">Gestiona todas las empresas registradas en la plataforma</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                    <Plus size={20} />
                    Nueva Empresa
                </button>
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
                        {sectores.map(s => (
                            <option key={s} value={s}>{s === "Todos" ? "Todos los Sectores" : s}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                        {estados.map(e => (
                            <option key={e} value={e}>{e === "Todos" ? "Todos los Estados" : e}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                            {empresasFiltradas.map((empresa) => (
                                <tr key={empresa.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Building2 className="text-primary" size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{empresa.nombre}</h4>
                                                <p className="text-sm text-gray-500">{empresa.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{empresa.sector}</td>
                                    <td className="px-6 py-4 text-gray-700">{empresa.tipo}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 text-gray-700">
                                            <span className="font-semibold">{empresa.conexiones}</span>
                                            <span className="text-xs text-gray-400">empresas</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${empresa.estado === "Activa"
                                                ? "bg-green-100 text-green-700"
                                                : empresa.estado === "Pendiente"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}>
                                            {empresa.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-500">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-500">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Mostrando {empresasFiltradas.length} de {empresas.length} empresas
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50">Anterior</button>
                        <button className="px-3 py-1 bg-primary text-white rounded text-sm">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50">3</button>
                        <button className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
