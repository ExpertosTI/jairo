"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, Shield, Mail, Building2, Loader2, Search } from "lucide-react";

interface Usuario {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar: string | null;
    empresa_nombre: string | null;
    created_at: string;
}

const roles = [
    { valor: "super_admin", etiqueta: "Super Admin", color: "bg-red-100 text-red-700", icono: "🔴" },
    { valor: "admin", etiqueta: "Administrador", color: "bg-orange-100 text-orange-700", icono: "🟠" },
    { valor: "manager", etiqueta: "Gerente", color: "bg-blue-100 text-blue-700", icono: "🔵" },
    { valor: "user", etiqueta: "Usuario", color: "bg-gray-100 text-gray-700", icono: "⚪" },
];

export default function UsuariosPage() {
    const [cargando, setCargando] = useState(true);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroRol, setFiltroRol] = useState("");
    const [total, setTotal] = useState(0);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jairoapp.renace.tech/api';

    useEffect(() => {
        cargarUsuarios();
    }, [busqueda, filtroRol]);

    const cargarUsuarios = async () => {
        setCargando(true);
        try {
            const params = new URLSearchParams();
            if (busqueda) params.append('busqueda', busqueda);
            if (filtroRol) params.append('rol', filtroRol);

            const res = await fetch(`${API_URL}/usuarios?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setUsuarios(data.usuarios || []);
                setTotal(data.total || 0);
            }
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        } finally {
            setCargando(false);
        }
    };

    const cambiarRol = async (userId: string, nuevoRol: string) => {
        try {
            await fetch(`${API_URL}/usuarios/${userId}/rol`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rol: nuevoRol })
            });
            cargarUsuarios();
        } catch (error) {
            console.error("Error cambiando rol:", error);
        }
    };

    const eliminarUsuario = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
        try {
            await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
            cargarUsuarios();
        } catch (error) {
            console.error("Error eliminando usuario:", error);
        }
    };

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-DO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Usuarios</h1>
                    <p className="text-gray-500 mt-1">{total} usuarios registrados en la plataforma</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                    <Plus size={20} />
                    Invitar Usuario
                </button>
            </div>

            {/* Roles Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {roles.map((rol) => {
                    const count = usuarios.filter(u => u.role === rol.valor).length;
                    return (
                        <div key={rol.valor} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">{rol.icono}</span>
                                <span className="font-medium text-gray-700">{rol.etiqueta}</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-4">
                <div className="flex-1 relative min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar usuario..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                </div>
                <select
                    value={filtroRol}
                    onChange={(e) => setFiltroRol(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
                >
                    <option value="">Todos los roles</option>
                    {roles.map(r => (
                        <option key={r.valor} value={r.valor}>{r.etiqueta}</option>
                    ))}
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {cargando ? (
                    <div className="p-12 text-center">
                        <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
                        <p className="text-gray-500">Cargando usuarios...</p>
                    </div>
                ) : usuarios.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="mx-auto mb-4 text-gray-300" size={48} />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No hay usuarios</h3>
                        <p className="text-gray-500">
                            {busqueda || filtroRol ? "No se encontraron usuarios con esos filtros" : "Aún no hay usuarios registrados"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Usuario</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Empresa</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Rol</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Registrado</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                                                    {usuario.name ? usuario.name.split(' ').map(n => n[0]).join('').slice(0, 2) : '?'}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{usuario.name || 'Sin nombre'}</h4>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Mail size={12} />
                                                        {usuario.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {usuario.empresa_nombre ? (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Building2 size={16} className="text-gray-400" />
                                                    {usuario.empresa_nombre}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={usuario.role}
                                                onChange={(e) => cambiarRol(usuario.id, e.target.value)}
                                                className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${roles.find(r => r.valor === usuario.role)?.color || "bg-gray-100"
                                                    }`}
                                            >
                                                {roles.map(r => (
                                                    <option key={r.valor} value={r.valor}>{r.etiqueta}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatearFecha(usuario.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-500">
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => eliminarUsuario(usuario.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500"
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
