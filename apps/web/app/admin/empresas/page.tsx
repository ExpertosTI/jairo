"use client";

import { useEffect, useState } from "react";
import { Check, X, Building2, Globe, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ValidateCompaniesPage() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchPending = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/companies/pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCompanies(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        if (!confirm(`¿Estás seguro de que deseas ${action === 'approve' ? 'APROBAR' : 'RECHAZAR'} esta empresa?`)) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/companies/${id}/${action}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                // Refresh list
                setCompanies(prev => prev.filter(c => c.id !== id));
                // Show toast or alert
            }
        } catch (error) {
            console.error(error);
            alert("Error al procesar la acción");
        }
    };

    if (loading) return <div>Cargando solicitudes...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Validar Empresas</h1>
                <p className="text-gray-500">Empresas pendientes de aprobación</p>
            </div>

            {companies.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">¡Todo al día!</h3>
                    <p className="text-gray-500">No hay empresas pendientes de validación.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {companies.map((company) => (
                        <div key={company.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                            {/* Logo / Icon */}
                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                                <Building2 size={32} className="text-gray-400" />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                                        <p className="text-sm text-gray-500">Solicitado el {new Date(company.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleAction(company.id, 'reject')}
                                            className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors flex items-center gap-2"
                                        >
                                            <X size={18} /> Rechazar
                                        </button>
                                        <button
                                            onClick={() => handleAction(company.id, 'approve')}
                                            className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium transition-colors shadow-lg shadow-green-200 flex items-center gap-2"
                                        >
                                            <Check size={18} /> Aprobar
                                        </button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
                                    <div className="space-y-2">
                                        <p><span className="font-semibold text-gray-700">Administrador:</span> {company.admin_name}</p>
                                        <p className="flex items-center gap-2">
                                            <Mail size={14} className="text-gray-400" />
                                            {company.admin_email}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p><span className="font-semibold text-gray-700">Sitio Web:</span> {company.website || 'No especificado'}</p>
                                        <p><span className="font-semibold text-gray-700">Descripción:</span> {company.description || 'Sin descripción'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
