'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Store, ArrowLeft, Lock, Mail, ShieldAlert, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useCart();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'partner'>('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi');
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push('/admin');
      } else {
        setError(res.message || 'Email atau kata sandi tidak sesuai.');
      }
    } catch {
      setError('Gagal menghubungkan ke server. Pastikan backend aktif.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRolePreset = (selectedRole: 'admin' | 'partner') => {
    setRole(selectedRole);
    setError('');
    if (selectedRole === 'admin') {
      setEmail('admin@rasanusantara.id');
      setPassword('admin123');
    } else {
      setEmail('buharti@malang.id');
      setPassword('mitra123');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/70 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      {/* Return link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl mb-6">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-amber-700 transition-colors p-2 rounded-xl hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Etalase Utama</span>
        </a>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="text-center animate-slideUp">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-linear-to-tr from-amber-500 to-orange-500 items-center justify-center text-white shadow-lg shadow-orange-500/25 mb-4 animate-float">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            Portal Pengelolaan UMKM
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
            Masuk untuk mengelola etalase makanan, memproses pesanan pembeli, dan koordinasi mitra.
          </p>
        </div>

        {/* Card Login Diperlebar (sm:max-w-xl) */}
        <div className="mt-8 bg-white py-10 px-6 sm:px-12 shadow-xl shadow-stone-200/60 rounded-3xl border border-stone-200/90 animate-scaleUp transition-all duration-300 hover:shadow-2xl">
          
          {/* Role selector tabs */}
          <div className="flex bg-stone-100 p-1.5 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => handleSelectRolePreset('admin')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-white text-stone-900 shadow-sm scale-101'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>👑 Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectRolePreset('partner')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                role === 'partner'
                  ? 'bg-white text-stone-900 shadow-sm scale-101'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>🍳 Mitra UMKM</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-rose-50 text-rose-700 text-xs rounded-2xl border border-rose-200 flex items-start gap-2.5 animate-fadeIn">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Alamat Email Terdaftar
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-amber-500 focus:ring-3 focus:ring-amber-500/10 transition-all duration-200 shadow-inner/50"
                  placeholder="nama@email.com"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-amber-500 focus:ring-3 focus:ring-amber-500/10 transition-all duration-200 shadow-inner/50"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform active:scale-98"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akun ke Database...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
