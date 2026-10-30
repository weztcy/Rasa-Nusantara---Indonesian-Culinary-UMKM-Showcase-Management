'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { 
  Utensils, 
  Cookie, 
  Flame, 
  Soup, 
  Cake, 
  Snowflake, 
  Coffee 
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Utensils: <Utensils className="w-6 h-6" />,
  Cookie: <Cookie className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />,
  Soup: <Soup className="w-6 h-6" />,
  Cake: <Cake className="w-6 h-6" />,
  Snowflake: <Snowflake className="w-6 h-6" />,
  Coffee: <Coffee className="w-6 h-6" />,
  snack: <Cookie className="w-6 h-6" />,
  sambal: <Flame className="w-6 h-6" />,
  lauk: <Soup className="w-6 h-6" />,
  kue: <Cake className="w-6 h-6" />,
  frozen: <Snowflake className="w-6 h-6" />,
  minuman: <Coffee className="w-6 h-6" />,
};

export default function CategorySection() {
  const { activeCategory, setActiveCategory, categories } = useCart();

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    const catalogEl = document.getElementById('katalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="kategori" className="py-12 bg-white border-b border-stone-100 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 animate-slideUp">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            Kategori Unggulan
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Jelajahi Berdasarkan Jenis Makanan
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Dari camilan renyah untuk teman ngopi hingga lauk tradisional siap santap bersama keluarga.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat, idx) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 cursor-pointer border text-left group hover:-translate-y-1 hover:shadow-md ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/25 scale-102 ring-2 ring-amber-400/50'
                    : 'bg-stone-50 hover:bg-amber-50/70 border-stone-200/80 text-stone-700 hover:border-amber-300'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-all duration-300 ${
                    isSelected
                      ? 'bg-white/20 text-white scale-110'
                      : 'bg-white text-amber-600 shadow-2xs group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110'
                  }`}
                >
                  {ICON_MAP[cat.icon] || ICON_MAP[cat.id] || <Utensils className="w-6 h-6" />}
                </div>
                <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-stone-800'}`}>
                  {cat.name}
                </span>
                <span className={`text-[11px] mt-1 font-medium ${isSelected ? 'text-amber-100' : 'text-stone-400 group-hover:text-amber-700'}`}>
                  {cat.id === 'all' ? 'Semua Pilihan' : `${cat.count} Produk`}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
