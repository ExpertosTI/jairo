"use client";

import { useState, useEffect } from "react";
import { Building2, ArrowRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";

interface Sector {
    id: string;
    name: string;
    icon: string;
    color: string;
}

interface TipoEmpresa {
    id: string;
    name: string;
    description: string;
}

export default function RegistroEmpresa() {
    const [paso, setPaso] = useState(1);
    const [cargando, setCargando] = useState(false);
    const [sectores, setSectores] = useState<Sector[]>([]);
    const [tipos, setTipos] = useState<TipoEmpresa[]>([]);
    const [formulario, setFormulario] = useState({
        nombre: "",
        rnc: "",
        email: "",
        telefono: "",
        direccion: "",
        website: "",
        sectorId: "",
        tipoId: "",
        descripcion: "",
    });
    const [exito, setExito] = useState(false);

    useEffect(() => {
        cargarSectores();
        cargarTipos();
    }, []);

    const cargarSectores = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/sectores`);
            const data = await res.json();
            setSectores(data.sectores || []);
        } catch (error) {
            console.error("Error cargando sectores:", error);
        }
    };

    const cargarTipos = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/sectores/tipos`);
            const data = await res.json();
            setTipos(data.tipos || []);
        } catch (error) {
            // Cargar tipos por defecto si falla
            setTipos([
                { id: "1", name: "Proveedor", description: "Suministra productos o servicios" },
                { id: "2", name: "Distribuidor", description: "Distribuye productos al mercado" },
                { id: "3", name: "Fabricante", description: "Produce o manufactura bienes" },
                { id: "4", name: "Mayorista", description: "Vende al por mayor" },
                { id: "5", name: "Minorista", description: "Vende al consumidor final" },
            ]);
        }
    };

    const handleSubmit = async () => {
        setCargando(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/empresas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formulario),
            });

            if (res.ok) {
                setExito(true);
            }
        } catch (error) {
            console.error("Error registrando empresa:", error);
        } finally {
            setCargando(false);
        }
    };

    if (exito) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="text-green-600" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Registro Exitoso!</h1>
                    <p className="text-gray-500 mb-6">
                        Tu empresa ha sido registrada. Nuestro equipo revisará tu solicitud y te contactaremos pronto.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600"
                    >
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black text-primary">JairoApp</Link>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center ${paso >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</span>
                        <div className="w-8 h-0.5 bg-gray-200" />
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center ${paso >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</span>
                        <div className="w-8 h-0.5 bg-gray-200" />
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center ${paso >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>3</span>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-12">
                {/* Paso 1: Información Básica */}
                {paso === 1 && (
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Building2 className="text-primary" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Registra tu Empresa</h1>
                                <p className="text-gray-500">Únete a la red empresarial de República Dominicana</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa *</label>
                                <input
                                    type="text"
                                    value={formulario.nombre}
                                    onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                                    placeholder="Ej: Distribuidora del Caribe"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">RNC (opcional)</label>
                                <input
                                    type="text"
                                    value={formulario.rnc}
                                    onChange={(e) => setFormulario({ ...formulario, rnc: e.target.value })}
                                    placeholder="Ej: 101-12345-6"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={formulario.email}
                                        onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
                                        placeholder="contacto@empresa.com"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                                    <input
                                        type="tel"
                                        value={formulario.telefono}
                                        onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
                                        placeholder="809-555-0000"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                <input
                                    type="text"
                                    value={formulario.direccion}
                                    onChange={(e) => setFormulario({ ...formulario, direccion: e.target.value })}
                                    placeholder="Calle, Sector, Ciudad"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>

                            <button
                                onClick={() => setPaso(2)}
                                disabled={!formulario.nombre || !formulario.email || !formulario.telefono}
                                className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Continuar <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Paso 2: Sector y Tipo */}
                {paso === 2 && (
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Selecciona tu Sector</h2>
                        <p className="text-gray-500 mb-6">¿En qué industria opera tu empresa?</p>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {sectores.length > 0 ? sectores.map((sector) => (
                                <button
                                    key={sector.id}
                                    onClick={() => setFormulario({ ...formulario, sectorId: sector.id })}
                                    className={`p-4 rounded-xl border-2 text-center transition-all ${formulario.sectorId === sector.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-100 hover:border-primary/50'
                                        }`}
                                >
                                    <span className="text-2xl block mb-1">{sector.icon}</span>
                                    <span className="text-sm font-medium text-gray-700">{sector.name}</span>
                                </button>
                            )) : (
                                // Sectores por defecto si no carga del API
                                ['💻 Tecnología', '🛒 Comercio', '🏭 Manufactura', '🏗️ Construcción', '🏥 Salud', '🏖️ Turismo', '🌾 Agricultura', '💰 Finanzas', '📚 Educación'].map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setFormulario({ ...formulario, sectorId: String(i) })}
                                        className={`p-4 rounded-xl border-2 text-center transition-all ${formulario.sectorId === String(i)
                                                ? 'border-primary bg-primary/5'
                                                : 'border-gray-100 hover:border-primary/50'
                                            }`}
                                    >
                                        <span className="text-2xl block mb-1">{s.split(' ')[0]}</span>
                                        <span className="text-sm font-medium text-gray-700">{s.split(' ')[1]}</span>
                                    </button>
                                ))
                            )}
                        </div>

                        <h3 className="font-bold text-gray-900 mb-3">Tipo de Empresa</h3>
                        <div className="space-y-2 mb-6">
                            {tipos.map((tipo) => (
                                <button
                                    key={tipo.id}
                                    onClick={() => setFormulario({ ...formulario, tipoId: tipo.id })}
                                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${formulario.tipoId === tipo.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-100 hover:border-primary/50'
                                        }`}
                                >
                                    <span className="font-medium text-gray-900">{tipo.name}</span>
                                    <span className="text-sm text-gray-500 block">{tipo.description}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setPaso(1)} className="flex-1 py-3 border border-gray-200 rounded-lg font-medium">
                                Atrás
                            </button>
                            <button
                                onClick={() => setPaso(3)}
                                disabled={!formulario.sectorId}
                                className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-300"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                )}

                {/* Paso 3: Descripción y Enviar */}
                {paso === 3 && (
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cuéntanos sobre tu empresa</h2>
                        <p className="text-gray-500 mb-6">Esta información ayudará a otras empresas a conocerte</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web (opcional)</label>
                                <input
                                    type="url"
                                    value={formulario.website}
                                    onChange={(e) => setFormulario({ ...formulario, website: e.target.value })}
                                    placeholder="https://tuempresa.com"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la Empresa</label>
                                <textarea
                                    value={formulario.descripcion}
                                    onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
                                    placeholder="Describe los productos o servicios que ofrece tu empresa, tu experiencia en el mercado, etc."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                />
                            </div>

                            {/* Resumen */}
                            <div className="bg-gray-50 rounded-lg p-4 mt-4">
                                <h4 className="font-medium text-gray-700 mb-2">Resumen del Registro:</h4>
                                <p className="text-sm text-gray-600"><strong>Empresa:</strong> {formulario.nombre}</p>
                                <p className="text-sm text-gray-600"><strong>Email:</strong> {formulario.email}</p>
                                <p className="text-sm text-gray-600"><strong>Teléfono:</strong> {formulario.telefono}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setPaso(2)} className="flex-1 py-3 border border-gray-200 rounded-lg font-medium">
                                Atrás
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={cargando}
                                className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
                            >
                                {cargando ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                                {cargando ? 'Registrando...' : 'Registrar Empresa'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
