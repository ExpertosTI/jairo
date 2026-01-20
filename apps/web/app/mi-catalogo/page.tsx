"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Edit, Trash2, Upload, Search, Grid, List, Eye, DollarSign, RefreshCw } from "lucide-react";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    description: string;
    sku: string;
    price: number;
    price_dop?: number;
    currency: 'USD' | 'DOP';
    min_order_qty: number;
    images: string[];
    views: number;
    status: string;
    category_name: string;
    created_at: string;
}

type Currency = 'USD' | 'DOP';

export default function MiCatalogoPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showCreate, setShowCreate] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCurrency, setDisplayCurrency] = useState<Currency>('DOP');
    const [exchangeRate, setExchangeRate] = useState<number>(59.50); // Default DOP/USD rate
    const [rateLoading, setRateLoading] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        sku: '',
        price: 0,
        currency: 'DOP' as Currency,
        minOrderQty: 1
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jairoapp.renace.tech/api';

    useEffect(() => {
        loadProducts();
        fetchExchangeRate();
    }, []);

    const getToken = () => localStorage.getItem("token");

    // Fetch current DOP/USD exchange rate
    const fetchExchangeRate = async () => {
        setRateLoading(true);
        try {
            // Using a free exchange rate API
            const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await res.json();
            if (data.rates?.DOP) {
                setExchangeRate(data.rates.DOP);
            }
        } catch (error) {
            console.error("Error fetching exchange rate, using default:", error);
            // Keep default rate of 59.50
        } finally {
            setRateLoading(false);
        }
    };

    const loadProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/products/my/catalog`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const data = await res.json();
            setProducts(data.productos || []);
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async () => {
        try {
            const priceData = {
                ...newProduct,
                // Always store in USD for consistency, convert if entered in DOP
                price: newProduct.currency === 'DOP'
                    ? newProduct.price / exchangeRate
                    : newProduct.price,
                price_dop: newProduct.currency === 'DOP'
                    ? newProduct.price
                    : newProduct.price * exchangeRate
            };

            await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(priceData)
            });
            setShowCreate(false);
            setNewProduct({ name: '', description: '', sku: '', price: 0, currency: 'DOP', minOrderQty: 1 });
            loadProducts();
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            await fetch(`${API_URL}/products/${id}/delete`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            loadProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    // Format currency based on selected display currency
    const formatPrice = (usdPrice: number) => {
        if (!usdPrice) return '—';

        if (displayCurrency === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
            }).format(usdPrice);
        } else {
            const dopPrice = usdPrice * exchangeRate;
            return new Intl.NumberFormat('es-DO', {
                style: 'currency',
                currency: 'DOP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(dopPrice);
        }
    };

    // Format both currencies
    const formatDualPrice = (usdPrice: number) => {
        if (!usdPrice) return { usd: '—', dop: '—' };

        const usd = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(usdPrice);

        const dop = new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(usdPrice * exchangeRate);

        return { usd, dop };
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Package className="text-primary" size={24} />
                            <h1 className="text-xl font-bold text-gray-900">Mi Catálogo</h1>
                            <span className="text-sm text-gray-500">({products.length} productos)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowCreate(true)}
                                className="bg-primary text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-primary-600"
                            >
                                <Plus size={20} /> Agregar Producto
                            </button>
                        </div>
                    </div>

                    {/* Search, Currency Toggle & View Toggle */}
                    <div className="flex items-center gap-4 mt-4 flex-wrap">
                        <div className="flex-1 relative min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar productos..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Currency Toggle */}
                        <div className="flex items-center gap-2">
                            <div className="flex bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-1 border border-gray-200">
                                <button
                                    onClick={() => setDisplayCurrency('DOP')}
                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${displayCurrency === 'DOP'
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    🇩🇴 RD$
                                </button>
                                <button
                                    onClick={() => setDisplayCurrency('USD')}
                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${displayCurrency === 'USD'
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    🇺🇸 US$
                                </button>
                            </div>
                            <button
                                onClick={fetchExchangeRate}
                                disabled={rateLoading}
                                className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                                title={`Tasa: 1 USD = ${exchangeRate.toFixed(2)} DOP`}
                            >
                                <RefreshCw size={16} className={rateLoading ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                            >
                                <Grid size={20} className={viewMode === 'grid' ? 'text-primary' : 'text-gray-500'} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                            >
                                <List size={20} className={viewMode === 'list' ? 'text-primary' : 'text-gray-500'} />
                            </button>
                        </div>
                    </div>

                    {/* Exchange Rate Info */}
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <DollarSign size={12} />
                        <span>Tasa de cambio: 1 USD = {exchangeRate.toFixed(2)} DOP</span>
                        {rateLoading && <span className="text-primary">(actualizando...)</span>}
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border">
                        <Package className="mx-auto text-gray-300 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No hay productos</h3>
                        <p className="text-gray-500 mb-6">Agrega productos para que otras empresas puedan encontrarlos</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowCreate(true)}
                                className="bg-primary text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
                            >
                                <Plus size={20} /> Agregar Producto
                            </button>
                            <button className="border border-gray-200 px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-50">
                                <Upload size={20} /> Importar CSV
                            </button>
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all group">
                                <div className="h-48 bg-gray-100 flex items-center justify-center">
                                    {product.images && product.images[0] ? (
                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="text-gray-300" size={48} />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                                    {product.sku && <p className="text-sm text-gray-500">SKU: {product.sku}</p>}
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Eye size={14} /> {product.views || 0}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button className="flex-1 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-1">
                                            <Edit size={14} /> Editar
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="py-2 px-3 bg-red-50 rounded-lg text-red-600 hover:bg-red-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Producto</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">SKU</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Precio</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Vistas</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Package className="text-gray-400" size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{product.name}</p>
                                                    <p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{product.sku || '—'}</td>
                                        <td className="py-3 px-4 font-medium text-primary">{formatPrice(product.price)}</td>
                                        <td className="py-3 px-4 text-gray-600">{product.views || 0}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <Edit size={16} className="text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={16} className="text-red-500" />
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

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Agregar Producto</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    placeholder="Nombre del producto"
                                    className="w-full px-4 py-3 bg-white border rounded-xl text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    placeholder="Describe el producto..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white border rounded-xl text-gray-900 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                    <input
                                        type="text"
                                        value={newProduct.sku}
                                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                                        placeholder="ABC-123"
                                        className="w-full px-4 py-3 bg-white border rounded-xl text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio (USD)</label>
                                    <input
                                        type="number"
                                        value={newProduct.price || ''}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                        placeholder="0.00"
                                        className="w-full px-4 py-3 bg-white border rounded-xl text-gray-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad mínima de pedido</label>
                                <input
                                    type="number"
                                    value={newProduct.minOrderQty}
                                    onChange={(e) => setNewProduct({ ...newProduct, minOrderQty: parseInt(e.target.value) })}
                                    min="1"
                                    className="w-full px-4 py-3 bg-white border rounded-xl text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCreate(false)}
                                className="flex-1 py-3 border rounded-xl font-medium hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={createProduct}
                                disabled={!newProduct.name}
                                className="flex-1 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50"
                            >
                                Agregar Producto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
