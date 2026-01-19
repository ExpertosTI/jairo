"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, Users, Building2, FileText,
    Settings, LogOut, Menu, X, ShieldAlert
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simple client-side role check
        // Ideally checking specific claim in token
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // Decode token payload simply to check role
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role !== 'super_admin') {
                router.push('/directorio'); // Redirect unauthorized
                return;
            }
            setAuthorized(true);
        } catch (e) {
            router.push('/login');
        } finally {
            setLoading(false);
        }
    }, [router]);

    if (loading) return <div className="h-screen flex items-center justify-center">Cargando admin...</div>;
    if (!authorized) return null;

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Validar Empresas", href: "/admin/empresas", icon: ShieldAlert },
        { name: "Usuarios", href: "/admin/usuarios", icon: Users },
        { name: "Empresas", href: "/admin/lista-empresas", icon: Building2 },
        { name: "Configuración", href: "/admin/config", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6">
                        <h1 className="text-2xl font-black tracking-tight">JairoApp<span className="text-primary-400">Admin</span></h1>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                            ? 'bg-primary text-white font-medium'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <button
                            onClick={() => router.push('/directorio')}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full px-4 py-2"
                        >
                            <LogOut size={18} />
                            <span>Volver a App</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
                    <span className="font-bold">Admin Panel</span>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <X /> : <Menu />}
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
