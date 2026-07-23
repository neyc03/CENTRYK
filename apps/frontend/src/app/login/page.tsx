'use client';

import React, { useState } from 'react';
import { CentryxLogo } from '../../components/CentryxLogo';
import { Lock, User, KeyRound, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('master');
  const [password, setPassword] = useState('CentryxMaster2026!');
  const [totpToken, setTotpToken] = useState('');
  const [step, setStep] = useState<'credentials' | 'totp'>('credentials');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    setLoading(true);

    // Simulación de autenticación JWT + Validación de Usuario
    setTimeout(() => {
      setLoading(false);
      if (username === 'master' || username.includes('@')) {
        setStep('totp');
      } else {
        setError('Credenciales no válidas');
      }
    }, 800);
  };

  const handleTotpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (totpToken.length < 6) {
      setError('Ingrese el código de 6 dígitos de Google Authenticator');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('centryx_token', 'jwt_session_active_2026');
      localStorage.setItem('centryx_user', username);
      router.push('/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#050A14] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Neon Grid Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050A14] to-[#050A14] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2DD4BF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="w-full max-w-md bg-[#0D1B2E]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <CentryxLogo size="lg" />
          <p className="text-slate-400 text-xs mt-3 text-center tracking-wider">
            PLATAFORMA ENTERPRISE MDM & CONTROL DE DISPOSITIVOS
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Usuario o Correo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej: master o admin@empresa.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#050A14] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-[#050A14] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-[#2DD4BF] text-slate-950 font-bold rounded-xl shadow-[0_0_25px_rgba(45,212,191,0.3)] hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Verificando credenciales...</span>
              ) : (
                <>
                  <span>Continuar a Seguridad 2FA</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTotpSubmit} className="space-y-6">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
              <ShieldCheck className="w-10 h-10 text-[#2DD4BF] mx-auto mb-2" />
              <h3 className="text-white font-semibold text-sm">Autenticación de 2 Factores (TOTP)</h3>
              <p className="text-slate-400 text-xs mt-1">
                Ingrese el código temporal de 6 dígitos generado en su aplicación Authenticator.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider text-center">
                Código TOTP (Google Authenticator)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-center font-mono text-xl tracking-[0.4em] placeholder-slate-600 focus:outline-none focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] transition-all"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="w-1/3 py-3 px-4 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-xl hover:bg-white/10 transition-all text-xs"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-[#2DD4BF] text-slate-950 font-bold rounded-xl shadow-[0_0_25px_rgba(45,212,191,0.3)] hover:opacity-95 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <span>Accediendo...</span>
                ) : (
                  <>
                    <span>Ingresar al Sistema</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
          <span>Servicio de Autenticación Supabase</span>
          <span className="text-[#2DD4BF] font-mono">v2.4.0 Live</span>
        </div>
      </div>
    </div>
  );
}
