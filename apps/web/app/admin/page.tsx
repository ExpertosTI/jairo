"use client";

import { useEffect, useState } from "react";
import { Users, Building2, FileText, Package, ArrowUpRight, CheckCircle, Clock } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Cargando estadísticas...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard General</h1>
                <p className="text-gray-500">Vista general del estado de la plataforma</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Usuarios Totales", value: stats?.counts?.users || 0, icon: Users, color: "bg-blue-500" },
                    { label: "Empresas", value: stats?.counts?.companies || 0, icon: Building2, color: "bg-purple-500" },
                    { label: "RFQs Activos", value: stats?.counts?.rfqs || 0, icon: FileText, color: "bg-orange-500" },
                    { label: "Productos", value: stats?.counts?.products || 0, icon: Package, color: "bg-emerald-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Companies / Recent Companies */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Clock className="text-gray-400" size={20} />
                        Empresas Recientes
                    </h2>
                    <div className="space-y-4">
                        {stats?.recent?.companies?.map((c: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-semibold text-gray-900">{c.name}</p>
                                    <p className="text-xs text-gray-500">Registrado: {new Date(c.created_at).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-green-100 text-green-700' :
                                        c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
                                    }`}>
                                    {c.status}
                                </span>
                            </div>
                        ))}
                        {(!stats?.recent?.companies || stats.recent.companies.length === 0) && (
                            <p className="text-gray-400 text-center py-4">No hay actividad reciente</p>
                        )}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Users className="text-gray-400" size={20} />
                        Usuarios Recientes
                    </h2>
                    <div className="space-y-4">
                        {stats?.recent?.users?.map((u: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                    {u.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{u.name}</p>
                                    <p className="text-xs text-gray-500">{u.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
