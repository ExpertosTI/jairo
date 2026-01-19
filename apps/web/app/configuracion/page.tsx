"use client";

import { useState, useEffect } from "react";
import {
    Settings, User, Building2, Bell, Shield, CreditCard,
    Globe, Moon, Sun, ChevronRight, LogOut, Camera
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ConfiguracionPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [activeSection, setActiveSection] = useState('profile');
    const [darkMode, setDarkMode] = useState(false);
    const [notifPrefs, setNotifPrefs] = useState({
        emailConnections: true,
        emailMessages: true,
        emailRfqs: true,
        pushEnabled: true
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jairoapp.renace.tech/api';

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        loadPreferences();
    }, []);

    const getToken = () => localStorage.getItem("token");

    const loadPreferences = async () => {
        // Load from local storage or API
        const savedDarkMode = localStorage.getItem("darkMode") === "true";
        setDarkMode(savedDarkMode);
    };

    const saveNotificationPrefs = async () => {
        try {
            await fetch(`${API_URL}/notifications/preferences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(notifPrefs)
            });
        } catch (error) {
            console.error("Error saving preferences:", error);
        }
    };

    const toggleDarkMode = () => {
        const newValue = !darkMode;
        setDarkMode(newValue);
        localStorage.setItem("darkMode", String(newValue));
        // Apply to document
        document.documentElement.classList.toggle('dark', newValue);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        router.push("/login");
    };

    const sections = [
        { id: 'profile', icon: User, label: 'Perfil' },
        { id: 'company', icon: Building2, label: 'Mi Empresa' },
        { id: 'notifications', icon: Bell, label: 'Notificaciones' },
        { id: 'security', icon: Shield, label: 'Seguridad' },
        { id: 'appearance', icon: Moon, label: 'Apariencia' },
        { id: 'language', icon: Globe, label: 'Idioma' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/directorio" className="text-gray-500 hover:text-gray-700">
                        <ChevronRight className="rotate-180" size={24} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Configuración</h1>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <nav className="space-y-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeSection === section.id
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <section.icon size={20} />
                                        <span className="font-medium">{section.label}</span>
                                    </button>
                                ))}
                                <hr className="my-4" />
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={20} />
                                    <span className="font-medium">Cerrar Sesión</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {activeSection === 'profile' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Información del Perfil</h2>

                                <div className="flex items-center gap-6 mb-8">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                                            <span className="text-white text-3xl font-bold">
                                                {user?.nombre?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border hover:bg-gray-50">
                                            <Camera size={16} className="text-gray-600" />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{user?.nombre || 'Usuario'}</h3>
                                        <p className="text-gray-500">{user?.email}</p>
                                        <p className="text-sm text-primary capitalize mt-1">{user?.rol || 'Usuario'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.nombre}
                                            className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            defaultValue={user?.email}
                                            className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900"
                                        />
                                    </div>
                                    <button className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-600">
                                        Guardar Cambios
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeSection === 'notifications' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Preferencias de Notificaciones</h2>

                                <div className="space-y-4">
                                    {[
                                        { key: 'emailConnections', label: 'Notificaciones de conexiones', desc: 'Recibe emails cuando alguien quiere conectar contigo' },
                                        { key: 'emailMessages', label: 'Notificaciones de mensajes', desc: 'Recibe emails cuando recibes nuevos mensajes' },
                                        { key: 'emailRfqs', label: 'Notificaciones de RFQs', desc: 'Recibe emails sobre nuevas solicitudes de cotización' },
                                        { key: 'pushEnabled', label: 'Notificaciones push', desc: 'Recibe notificaciones en el navegador' }
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.label}</p>
                                                <p className="text-sm text-gray-500">{item.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setNotifPrefs({ ...notifPrefs, [item.key]: !notifPrefs[item.key as keyof typeof notifPrefs] });
                                                }}
                                                className={`w-12 h-6 rounded-full transition-colors ${notifPrefs[item.key as keyof typeof notifPrefs] ? 'bg-primary' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifPrefs[item.key as keyof typeof notifPrefs] ? 'translate-x-6' : 'translate-x-0.5'
                                                    }`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={saveNotificationPrefs}
                                    className="w-full mt-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-600"
                                >
                                    Guardar Preferencias
                                </button>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Seguridad</h2>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Cambiar Contraseña</p>
                                                <p className="text-sm text-gray-500">Actualiza tu contraseña regularmente</p>
                                            </div>
                                            <button className="text-primary font-medium hover:underline">
                                                Cambiar
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Autenticación de dos factores</p>
                                                <p className="text-sm text-gray-500">Añade una capa extra de seguridad</p>
                                            </div>
                                            <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                                                Próximamente
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Sesiones activas</p>
                                                <p className="text-sm text-gray-500">Revisa y cierra sesiones en otros dispositivos</p>
                                            </div>
                                            <button className="text-primary font-medium hover:underline">
                                                Ver
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'appearance' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Apariencia</h2>

                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {darkMode ? <Moon className="text-primary" size={24} /> : <Sun className="text-orange-500" size={24} />}
                                            <div>
                                                <p className="font-medium text-gray-900">Modo Oscuro</p>
                                                <p className="text-sm text-gray-500">
                                                    {darkMode ? 'Activado' : 'Desactivado'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={toggleDarkMode}
                                            className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-gray-300'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'language' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Idioma</h2>

                                <div className="space-y-2">
                                    {[
                                        { code: 'es', label: 'Español', flag: '🇪🇸' },
                                        { code: 'en', label: 'English', flag: '🇺🇸' },
                                        { code: 'pt', label: 'Português', flag: '🇧🇷' }
                                    ].map((lang) => (
                                        <button
                                            key={lang.code}
                                            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${lang.code === 'es' ? 'bg-primary/10 border-2 border-primary' : 'bg-gray-50 hover:bg-gray-100'
                                                }`}
                                        >
                                            <span className="text-2xl">{lang.flag}</span>
                                            <span className="font-medium text-gray-900">{lang.label}</span>
                                            {lang.code === 'es' && (
                                                <span className="ml-auto text-primary text-sm">Actual</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'company' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Mi Empresa</h2>

                                {user?.empresa ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                                                <Building2 className="text-primary" size={32} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{user.empresa.nombre}</h3>
                                                <p className="text-sm text-gray-500">/{user.empresa.slug}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/empresa/${user.empresa.slug}/editar`}
                                            className="block w-full py-3 text-center bg-primary text-white rounded-xl font-medium"
                                        >
                                            Editar Empresa
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Building2 className="mx-auto text-gray-300 mb-4" size={48} />
                                        <p className="text-gray-500 mb-4">No tienes una empresa asociada</p>
                                        <Link
                                            href="/registro"
                                            className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-medium"
                                        >
                                            Registrar Empresa
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
