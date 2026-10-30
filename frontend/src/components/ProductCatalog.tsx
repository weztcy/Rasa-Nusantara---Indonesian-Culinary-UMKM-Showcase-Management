'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import ProductCard from './ProductCard';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Flame, 
  RotateCcw, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Layers 
} from 'lucide-react';

export default function ProductCatalog() {
  const { 
    products, 
    categories,
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery 
  } = useCart();

  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');
  const [filterBestSellerOnly, setFilterBestSellerOnly] = useState(false);
  const [filterDiscountOnly, setFilterDiscountOnly] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (activeCategory !== 'all') {
      result = result.filter((p) => {
        const catId = typeof p.category === 'string' ? p.category : (p as any).category?.id || (p as any).categoryId;
        return catId === activeCategory;
      });
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.producer.name.toLowerCase().includes(q) ||
          p.producer.city.toLowerCase().includes(q) ||
          (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Filter by Best Seller flag
    if (filterBestSellerOnly) {
      result = result.filter((p) => p.isBestSeller);
    }

    // Filter by Discount
    if (filterDiscountOnly) {
      result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // Sorting
    if (sortBy === 'popular') {
      result.sort((a, b) => b.soldCount - a.soldCount);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, activeCategory, searchQuery, filterBestSellerOnly, filterDiscountOnly, sortBy]);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, filterBestSellerOnly, filterDiscountOnly, sortBy, itemsPerPage]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const el = document.getElementById('katalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setFilterBestSellerOnly(false);
    setFilterDiscountOnly(false);
    setSortBy('popular');
    setCurrentPage(1);
  };

  // Generate pagination buttons
  const getPaginationNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <section id="katalog" className="py-14 bg-stone-50/60 scroll-mt-20 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-slideUp">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Etalase Makanan Terpilih</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Katalog Produk UMKM Kuliner
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Pilih dari beragam produk makanan lokal buatan pengrajin terverifikasi di seluruh Nusantara.
            </p>
          </div>

          <div className="text-xs text-stone-500 font-medium bg-white px-3.5 py-2 rounded-xl border border-stone-200 self-start md:self-auto shadow-2xs transition-all hover:shadow-xs">
            Menampilkan <span className="font-bold text-amber-800">{filteredProducts.length > 0 ? startIndex + 1 : 0} - {endIndex}</span> dari {filteredProducts.length} produk ({products.length} total terdaftar)
          </div>
        </div>

        {/* Filter Bar Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-xs mb-8 space-y-4 transition-all duration-300 hover:shadow-md">
          
          {/* Top row: Search input & Sorting */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan nama makanan, rasa, kota asal, atau produsen..."
                className="w-full bg-stone-50 pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-stone-200 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-all duration-200 shadow-inner/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 bg-stone-200 hover:bg-stone-300 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-stone-500 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold py-2.5 px-3.5 rounded-2xl focus:outline-hidden focus:border-amber-500 transition cursor-pointer hover:bg-stone-100"
              >
                <option value="popular">Terpopuler / Paling Laris</option>
                <option value="rating">Rating Tertinggi ⭐</option>
                <option value="price-asc">Harga: Terendah ke Tertinggi</option>
                <option value="price-desc">Harga: Tertinggi ke Terendah</option>
              </select>
            </div>
          </div>

          {/* Bottom row: Category Pills & Toggle Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
            {/* Category Pills (Loaded directly from live API) */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-amber-600 text-white font-bold shadow-xs scale-102'
                      : 'bg-stone-100 hover:bg-amber-50 hover:text-amber-800 text-stone-700'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.id !== 'all' && (
                    <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeCategory === cat.id ? 'bg-amber-700 text-amber-100' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {cat.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quick Extra Toggles */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <button
                onClick={() => setFilterBestSellerOnly(!filterBestSellerOnly)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  filterBestSellerOnly
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-2xs'
                    : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Hanya Best Seller</span>
                {filterBestSellerOnly && <Check className="w-3 h-3" />}
              </button>

              <button
                onClick={() => setFilterDiscountOnly(!filterDiscountOnly)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  filterDiscountOnly
                    ? 'bg-rose-100 text-rose-900 border border-rose-300 font-bold shadow-2xs'
                    : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>🏷️ Promo Hemat</span>
                {filterDiscountOnly && <Check className="w-3 h-3" />}
              </button>
            </div>
          </div>

        </div>

        {/* Product Cards Grid (Paginated with animation) */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slideUp">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 pt-8 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                
                {/* Per-page selector & info */}
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tampilkan per halaman:</span>
                  </div>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-bold text-stone-800 cursor-pointer shadow-2xs hover:border-amber-400 transition"
                  >
                    <option value={8}>8 Produk</option>
                    <option value={12}>12 Produk</option>
                    <option value={16}>16 Produk</option>
                    <option value={24}>24 Produk</option>
                  </select>
                </div>

                {/* Page Navigation Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer text-stone-700 shadow-2xs hover:shadow-xs"
                    title="Halaman Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {getPaginationNumbers().map((num, idx) => {
                      if (num === '...') {
                        return (
                          <span key={`dots-${idx}`} className="px-2 text-stone-400 text-xs font-bold">
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={`page-${num}`}
                          onClick={() => handlePageChange(Number(num))}
                          className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                            currentPage === num
                              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 scale-105'
                              : 'bg-white border border-stone-200 text-stone-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer text-stone-700 shadow-2xs hover:shadow-xs"
                    title="Halaman Berikutnya"
                  >
                    <span className="hidden sm:inline">Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 max-w-md mx-auto animate-scaleUp shadow-xs">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl animate-pulseSubtle">
              🔍
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-stone-500 text-sm mt-1 mb-6">
              Tidak ada produk makanan yang cocok dengan kata kunci atau filter yang Anda pilih.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Semua Filter</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
