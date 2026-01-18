import { ProductCard } from "@/components/product-card";

export default function Home() {
  const products = [
    { title: "Wireless Earbuds Pro Max", price: 12.99, originalPrice: 59.99, image: "https://placehold.co/400", soldCount: 5000, isFlashSale: true },
    { title: "Smart Watch Series 8 Ultra Clone", price: 25.50, originalPrice: 120.00, image: "https://placehold.co/400", soldCount: 1200 },
    { title: "Portable Blender USB Rechargeable", price: 8.99, originalPrice: 29.99, image: "https://placehold.co/400", soldCount: 850, isFlashSale: true },
    { title: "LED Gaming Keyboard RGB", price: 15.99, originalPrice: 45.00, image: "https://placehold.co/400", soldCount: 3000 },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-primary py-2 text-white text-center text-sm font-bold animate-pulse">
        ⚡ FLASH SALE: UP TO 90% OFF - ENDING SOON! ⚡
      </div>

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-black text-center mb-8 text-gray-900">
          Recommended For You
        </h1>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
          {products.map((p, i) => (
            <ProductCard key={i} {...p} />
          ))}
        </div>
      </div>
    </main>
  );
}
