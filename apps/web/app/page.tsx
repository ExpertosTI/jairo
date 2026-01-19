"use client";

import Link from "next/link";
import { Building2, Network, Search, ArrowRight, ChevronRight, Star, Shield, Zap, Globe, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [stats, setStats] = useState([
    { value: "—", label: "Empresas" },
    { value: "—", label: "Sectores" },
    { value: "—", label: "Conexiones" },
    { value: "—", label: "Satisfacción" },
  ]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://jairoapp.renace.tech/api';
        const res = await fetch(`${apiUrl}/dashboard/estadisticas`);
        if (res.ok) {
          const data = await res.json();
          setStats([
            { value: `${data.totalEmpresas || 0}+`, label: "Empresas" },
            { value: `${data.totalSectores || 12}`, label: "Sectores" },
            { value: `${data.totalConexiones || 0}+`, label: "Conexiones" },
            { value: "98%", label: "Satisfacción" },
          ]);
        }
      } catch (e) {
        console.log("Stats no disponibles");
      }
    };
    cargarStats();
  }, []);

  const features = [
    {
      icon: Building2,
      title: "Directorio Empresarial",
      description: "Encuentra y conecta con empresas verificadas por sector y ubicación.",
    },
    {
      icon: Network,
      title: "Red de Conexiones",
      description: "Establece relaciones comerciales: proveedores, clientes, socios y distribuidores.",
    },
    {
      icon: Shield,
      title: "Empresas Verificadas",
      description: "Todas las empresas pasan por un proceso de verificación para garantizar confiabilidad.",
    },
    {
      icon: Zap,
      title: "Oportunidades B2B",
      description: "Recibe notificaciones de empresas buscando tus productos o servicios.",
    },
  ];

  const sectors = [
    { icon: "💻", name: "Tecnología" },
    { icon: "🛒", name: "Comercio" },
    { icon: "🏭", name: "Manufactura" },
    { icon: "🏗️", name: "Construcción" },
    { icon: "🏥", name: "Salud" },
    { icon: "🏖️", name: "Turismo" },
    { icon: "🌾", name: "Agricultura" },
    { icon: "💰", name: "Finanzas" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (busqueda.trim()) {
      window.location.href = `/directorio?busqueda=${encodeURIComponent(busqueda)}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">J</span>
            </div>
            <span className="text-2xl font-black">
              <span className="text-primary">Jairo</span>
              <span className="text-secondary">App</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/directorio" className="text-gray-600 hover:text-primary font-medium">Directorio</Link>
            <Link href="#features" className="text-gray-600 hover:text-primary font-medium">Características</Link>
            <Link href="#sectors" className="text-gray-600 hover:text-primary font-medium">Sectores</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-600 hover:text-primary font-medium">
              Iniciar Sesión
            </Link>
            <Link href="/registro" className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors">
              Registrar Empresa
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-primary-600 to-primary-700 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm mb-6">
              <Star className="text-secondary" size={16} />
              <span>La red empresarial B2B líder de la región</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              Conecta tu empresa con
              <span className="text-secondary"> nuevos mercados</span>
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              JairoApp es la plataforma B2B que conecta proveedores, distribuidores y empresas. Encuentra socios comerciales, expande tu red y haz crecer tu negocio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/registro" className="bg-secondary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-secondary-600 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                Registrar mi Empresa <ArrowRight size={20} />
              </Link>
              <Link href="/directorio" className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all flex items-center justify-center gap-2">
                Explorar Directorio
              </Link>
            </div>

            {/* Search Bar - Functional */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 flex shadow-xl max-w-xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar empresas, sectores..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="flex-1 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors">
                Buscar
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats - Dynamic */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-black text-primary">{stat.value}</p>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Todo lo que necesitas para <span className="text-primary">hacer negocios</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Herramientas diseñadas para conectar empresas y facilitar el comercio B2B
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section id="sectors" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Explora por <span className="text-secondary">Sector</span>
            </h2>
            <p className="text-xl text-gray-500">
              Encuentra empresas en el sector que necesitas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sectors.map((sector, i) => (
              <Link
                key={i}
                href={`/directorio?sector=${sector.name}`}
                className="bg-white rounded-xl p-6 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all group border border-gray-100"
              >
                <span className="text-3xl">{sector.icon}</span>
                <span className="text-lg font-semibold text-gray-700 group-hover:text-primary">{sector.name}</span>
                <ChevronRight className="ml-auto text-gray-300 group-hover:text-primary" size={20} />
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/directorio" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
              Ver todos los sectores <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            ¿Listo para hacer crecer tu negocio?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Únete a cientos de empresas que ya usan JairoApp para expandir su red comercial
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro" className="bg-secondary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-secondary-600 transition-all inline-flex items-center justify-center gap-2">
              Registrar Empresa Gratis <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-lg">J</span>
                </div>
                <span className="text-2xl font-black">JairoApp</span>
              </div>
              <p className="text-gray-400">
                Plataforma B2B líder para conectar empresas y expandir negocios.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/directorio" className="hover:text-white">Directorio</Link></li>
                <li><Link href="/registro" className="hover:text-white">Registrar Empresa</Link></li>
                <li><Link href="/login" className="hover:text-white">Iniciar Sesión</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Términos de Uso</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacidad</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@jairoapp.com</li>
                <li>Soporte 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} JairoApp. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
