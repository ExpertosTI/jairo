"use client";

import { useState } from "react";
import { Network, Plus, ArrowRight, Building2, Filter } from "lucide-react";

const relacionesData = [
    {
        id: "1",
        empresaA: { nombre: "Tech Solutions RD", sector: "Tecnología" },
        empresaB: { nombre: "Distribuidora del Caribe", sector: "Retail" },
        tipo: "Proveedor",
        estado: "Activa",
        fecha: "2024-01-15"
    },
    {
        id: "2",
        empresaA: { nombre: "Alimentos del Norte", sector: "Manufactura" },
        empresaB: { nombre: "Farmacia Central", sector: "Salud" },
        tipo: "Distribuidor",
        estado: "Activa",
        fecha: "2024-01-10"
    },
    {
        id: "3",
        empresaA: { nombre: "Constructora Marte", sector: "Construcción" },
        empresaB: { nombre: "Tech Solutions RD", sector: "Tecnología" },
        tipo: "Cliente",
        estado: "Pendiente",
        fecha: "2024-01-18"
    },
    {
        id: "4",
        empresaA: { nombre: "Distribuidora del Caribe", sector: "Retail" },
        empresaB: { nombre: "Alimentos del Norte", sector: "Manufactura" },
        tipo: "Socio",
        estado: "Activa",
        fecha: "2024-01-08"
    },
];

const tiposRelacion = [
    { valor: "supplier", etiqueta: "Proveedor", color: "bg-blue-100 text-blue-700" },
    { valor: "client", etiqueta: "Cliente", color: "bg-green-100 text-green-700" },
    { valor: "partner", etiqueta: "Socio", color: "bg-purple-100 text-purple-700" },
    { valor: "distributor", etiqueta: "Distribuidor", color: "bg-orange-100 text-orange-700" },
];

export default function RelacionesPage() {
    const [filtroTipo, setFiltroTipo] = useState("Todos");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Engranajes</h1>
                    <p className="text-gray-500 mt-1">Visualiza y gestiona las conexiones entre empresas</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                    <Plus size={20} />
                    Nueva Conexión
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tiposRelacion.map((tipo) => (
                    <div key={tipo.valor} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${tipo.color}`}>
                            {tipo.etiqueta}
                        </span>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {relacionesData.filter(r => r.tipo === tipo.etiqueta).length}
                        </p>
                    </div>
                ))}
            </div>

            {/* Network Visualization Placeholder */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Mapa de Conexiones</h2>
                <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <Network className="mx-auto text-gray-300" size={64} />
                        <p className="text-gray-400 mt-2">Visualización interactiva de la red empresarial</p>
                        <p className="text-xs text-gray-300 mt-1">(Se activará con datos reales)</p>
                    </div>
                </div>
            </div>

            {/* Relationships Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Todas las Conexiones</h2>
                    <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="Todos">Todos los tipos</option>
                        {tiposRelacion.map(t => (
                            <option key={t.valor} value={t.etiqueta}>{t.etiqueta}</option>
                        ))}
                    </select>
                </div>
                <div className="divide-y divide-gray-100">
                    {relacionesData
                        .filter(r => filtroTipo === "Todos" || r.tipo === filtroTipo)
                        .map((rel) => (
                            <div key={rel.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    {/* Empresa A */}
                                    <div className="flex-1 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Building2 className="text-blue-600" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{rel.empresaA.nombre}</h4>
                                            <p className="text-xs text-gray-500">{rel.empresaA.sector}</p>
                                        </div>
                                    </div>

                                    {/* Relationship Arrow */}
                                    <div className="flex flex-col items-center">
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${tiposRelacion.find(t => t.etiqueta === rel.tipo)?.color || "bg-gray-100"
                                            }`}>
                                            {rel.tipo}
                                        </span>
                                        <ArrowRight className="text-gray-300 mt-1" size={20} />
                                    </div>

                                    {/* Empresa B */}
                                    <div className="flex-1 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <Building2 className="text-green-600" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{rel.empresaB.nombre}</h4>
                                            <p className="text-xs text-gray-500">{rel.empresaB.sector}</p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="text-right">
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${rel.estado === "Activa"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {rel.estado}
                                        </span>
                                        <p className="text-xs text-gray-400 mt-1">{rel.fecha}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
