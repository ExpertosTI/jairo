import { Building2, Users, Network, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Datos de ejemplo (después vendrán del API)
const stats = [
    {
        label: "Total Empresas",
        value: "127",
        change: "+12%",
        trend: "up",
        icon: Building2,
        color: "bg-blue-500"
    },
    {
        label: "Usuarios Activos",
        value: "1,429",
        change: "+8%",
        trend: "up",
        icon: Users,
        color: "bg-green-500"
    },
    {
        label: "Conexiones",
        value: "89",
        change: "+23%",
        trend: "up",
        icon: Network,
        color: "bg-purple-500"
    },
    {
        label: "Transacciones",
        value: "$45,231",
        change: "-3%",
        trend: "down",
        icon: TrendingUp,
        color: "bg-orange-500"
    },
];

const recentCompanies = [
    { name: "Distribuidora del Caribe", sector: "Retail", status: "Activa", date: "Hoy" },
    { name: "Tech Solutions RD", sector: "Tecnología", status: "Pendiente", date: "Ayer" },
    { name: "Constructora Marte", sector: "Construcción", status: "Activa", date: "Hace 2 días" },
    { name: "Farmacia Central", sector: "Salud", status: "Activa", date: "Hace 3 días" },
];

const sectors = [
    { name: "Tecnología", count: 34, color: "bg-blue-500" },
    { name: "Retail", count: 28, color: "bg-green-500" },
    { name: "Manufactura", count: 22, color: "bg-yellow-500" },
    { name: "Servicios", count: 19, color: "bg-purple-500" },
    { name: "Construcción", count: 15, color: "bg-red-500" },
    { name: "Otros", count: 9, color: "bg-gray-500" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900">Panel Principal</h1>
                <p className="text-gray-500 mt-1">Bienvenido al panel de administración de JairoApp</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="text-white" size={24} />
                            </div>
                            <span className={`flex items-center text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"
                                }`}>
                                {stat.change}
                                {stat.trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Companies */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Empresas Recientes</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentCompanies.map((company) => (
                            <div key={company.name} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Building2 className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{company.name}</h4>
                                        <p className="text-sm text-gray-500">{company.sector}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${company.status === "Activa"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {company.status}
                                    </span>
                                    <p className="text-xs text-gray-400 mt-1">{company.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                        <a href="/admin/empresas" className="text-primary font-medium text-sm hover:underline">
                            Ver todas las empresas →
                        </a>
                    </div>
                </div>

                {/* Sectors Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Distribución por Sector</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {sectors.map((sector) => (
                            <div key={sector.name} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${sector.color}`} />
                                <span className="flex-1 text-sm text-gray-700">{sector.name}</span>
                                <span className="text-sm font-medium text-gray-900">{sector.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
