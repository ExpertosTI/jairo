"use client";

import { useState } from "react";
import { Tags, Plus, Edit, Trash2, Building2 } from "lucide-react";

const sectoresData = [
    {
        id: "1",
        nombre: "Tecnología",
        descripcion: "Empresas de software, hardware y servicios tecnológicos",
        icono: "💻",
        color: "#3B82F6",
        empresas: 34
    },
    {
        id: "2",
        nombre: "Retail",
        descripcion: "Comercio al por menor y distribución",
        icono: "🛒",
        color: "#10B981",
        empresas: 28
    },
    {
        id: "3",
        nombre: "Manufactura",
        descripcion: "Producción y fabricación de bienes",
        icono: "🏭",
        color: "#F59E0B",
        empresas: 22
    },
    {
        id: "4",
        nombre: "Construcción",
        descripcion: "Proyectos de construcción e infraestructura",
        icono: "🏗️",
        color: "#EF4444",
        empresas: 15
    },
    {
        id: "5",
        nombre: "Salud",
        descripcion: "Servicios médicos, farmacias y equipos",
        icono: "🏥",
        color: "#8B5CF6",
        empresas: 19
    },
    {
        id: "6",
        nombre: "Servicios",
        descripcion: "Servicios profesionales y consultoría",
        icono: "💼",
        color: "#EC4899",
        empresas: 9
    },
];

const tiposEmpresa = [
    { id: "1", nombre: "Proveedor", descripcion: "Suministra productos o servicios" },
    { id: "2", nombre: "Distribuidor", descripcion: "Distribuye productos al mercado" },
    { id: "3", nombre: "Fabricante", descripcion: "Produce o manufactura bienes" },
    { id: "4", nombre: "Mayorista", descripcion: "Vende al por mayor" },
    { id: "5", nombre: "Minorista", descripcion: "Vende al consumidor final" },
];

export default function SectoresPage() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Sectores y Tipos</h1>
                    <p className="text-gray-500 mt-1">Configura los sectores empresariales y tipos de empresa</p>
                </div>
                <button
                    onClick={() => setMostrarFormulario(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                    <Plus size={20} />
                    Nuevo Sector
                </button>
            </div>

            {/* Sectors Grid */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sectores Empresariales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectoresData.map((sector) => (
                        <div
                            key={sector.id}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                    style={{ backgroundColor: `${sector.color}20` }}
                                >
                                    {sector.icono}
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-500">
                                        <Edit size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mt-4">{sector.nombre}</h3>
                            <p className="text-sm text-gray-500 mt-1">{sector.descripcion}</p>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                <Building2 size={16} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">{sector.empresas} empresas</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Company Types */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Tipos de Empresa</h2>
                    <button className="flex items-center gap-2 text-primary font-medium text-sm hover:underline">
                        <Plus size={16} />
                        Agregar Tipo
                    </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Tipo</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Descripción</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tiposEmpresa.map((tipo) => (
                                <tr key={tipo.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900">{tipo.nombre}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{tipo.descripcion}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
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
            </div>
        </div>
    );
}
