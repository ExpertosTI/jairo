"use client";

import { useState } from "react";
import { Users, Plus, Edit, Trash2, Shield, Mail, Building2 } from "lucide-react";

const usuariosData = [
    {
        id: "1",
        nombre: "Carlos Méndez",
        email: "carlos@techsol.do",
        rol: "Super Admin",
        empresa: "Tech Solutions RD",
        estado: "Activo",
        ultimoAcceso: "Hace 5 min"
    },
    {
        id: "2",
        nombre: "María García",
        email: "maria@distcaribe.com",
        rol: "Administrador",
        empresa: "Distribuidora del Caribe",
        estado: "Activo",
        ultimoAcceso: "Hace 2 horas"
    },
    {
        id: "3",
        nombre: "Juan Pérez",
        email: "juan@constmarte.com",
        rol: "Gerente",
        empresa: "Constructora Marte",
        estado: "Activo",
        ultimoAcceso: "Ayer"
    },
    {
        id: "4",
        nombre: "Ana Rodríguez",
        email: "ana@farmcentral.do",
        rol: "Usuario",
        empresa: "Farmacia Central",
        estado: "Inactivo",
        ultimoAcceso: "Hace 1 semana"
    },
];

const roles = [
    { valor: "super_admin", etiqueta: "Super Admin", color: "bg-red-100 text-red-700", icono: "🔴" },
    { valor: "admin", etiqueta: "Administrador", color: "bg-orange-100 text-orange-700", icono: "🟠" },
    { valor: "manager", etiqueta: "Gerente", color: "bg-blue-100 text-blue-700", icono: "🔵" },
    { valor: "user", etiqueta: "Usuario", color: "bg-gray-100 text-gray-700", icono: "⚪" },
];

export default function UsuariosPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Usuarios</h1>
                    <p className="text-gray-500 mt-1">Gestiona los usuarios y sus permisos en la plataforma</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                    <Plus size={20} />
                    Nuevo Usuario
                </button>
            </div>

            {/* Roles Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {roles.map((rol) => (
                    <div key={rol.valor} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{rol.icono}</span>
                            <span className="font-medium text-gray-700">{rol.etiqueta}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {usuariosData.filter(u => u.rol === rol.etiqueta).length}
                        </p>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Usuario</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Empresa</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Rol</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Último Acceso</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {usuariosData.map((usuario) => (
                                <tr key={usuario.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                                                {usuario.nombre.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{usuario.nombre}</h4>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Mail size={12} />
                                                    {usuario.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Building2 size={16} className="text-gray-400" />
                                            {usuario.empresa}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${roles.find(r => r.etiqueta === usuario.rol)?.color || "bg-gray-100"
                                            }`}>
                                            <Shield size={12} />
                                            {usuario.rol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${usuario.estado === "Activo"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-500"
                                            }`}>
                                            {usuario.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {usuario.ultimoAcceso}
                                    </td>
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
