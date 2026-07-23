'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  GitBranch, 
  Layers, 
  QrCode, 
  Plus, 
  Search, 
  CheckCircle2, 
  X, 
  ArrowLeft,
  RefreshCw,
  Database,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sylwwjuwxtziljjkowsz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bHd3anV3eHR6aWxqamtvd3N6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgxMjk0NSwiZXhwIjoyMTAwMzg4OTQ1fQ.16CCyu_5JhbsMUEhQh78_Pzm_649LJb-DgasnUlqDwU';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EstructuraPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'companies' | 'branches' | 'qr'>('companies');
  const [companies, setCompanies] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyTaxId, setNewCompanyTaxId] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('centryx_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDataFromSupabase();
  }, [router]);

  const fetchDataFromSupabase = async () => {
    try {
      setLoading(true);
      const { data: compData } = await supabase.from('companies').select('*');
      const { data: branchData } = await supabase.from('branches').select('*');

      if (compData) setCompanies(compData);
      if (branchData) setBranches(branchData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName) return;

    try {
      const { data, error } = await supabase.from('companies').insert({
        name: newCompanyName,
        tax_id: newCompanyTaxId || '1-00-00000-0',
        is_active: true
      }).select().single();

      if (error) {
        setNotification(`Error guardando empresa: ${error.message}`);
      } else {
        fetchDataFromSupabase();
        setShowCompanyModal(false);
        setNewCompanyName('');
        setNewCompanyTaxId('');
        setNotification(`Empresa '${newCompanyName}' agregada exitosamente a Supabase.`);
      }
    } catch (err: any) {
      setNotification(`Error: ${err.message}`);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#050A14] text-slate-100 p-8 space-y-8 font-sans">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-xl bg-[#0D1B2E] border border-white/10 hover:border-[#2DD4BF]/50 text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Estructura Multi-Tenant &amp; Aprovisionamiento QR</h1>
            <p className="text-xs text-slate-400 mt-0.5">Gestión directa en las tablas Supabase companies y branches</p>
          </div>
        </div>

        <button 
          onClick={() => setShowCompanyModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:opacity-90 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Nueva Empresa</span>
        </button>
      </div>

      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 px-6 py-3 rounded-2xl flex items-center space-x-3 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex space-x-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'companies' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Empresas en Supabase ({companies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'branches' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Sucursales ({branches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('qr')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'qr' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Código QR DPC de Enrolamiento</span>
        </button>
      </div>

      {activeTab === 'companies' && (
        <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Empresas Registradas</h3>
          {companies.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No hay empresas creadas en Supabase. Presione <strong>Agregar Nueva Empresa</strong> para registrar su primera organización.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companies.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-[#050A14] border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{c.name}</h4>
                    <p className="text-xs text-slate-400">RNC/ID: {c.tax_id}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                    ACTIVA
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'qr' && (
        <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl p-8 space-y-6 text-center">
          <QrCode className="w-16 h-16 text-[#2DD4BF] mx-auto" />
          <h3 className="text-lg font-bold text-white">Código QR de Enrolamiento DPC Android</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Escanee este código QR al encender cualquier teléfono Android nuevo (tras tocar 6 veces la pantalla de bienvenida) para enrolarlo directamente en su base de datos.
          </p>
          <div className="p-6 bg-white rounded-2xl w-48 h-48 mx-auto flex items-center justify-center border-4 border-[#2DD4BF]">
            <span className="text-slate-950 font-mono text-xs font-bold text-center">CENTRYX MDM<br/>DPC QR PAYLOAD</span>
          </div>
        </div>
      )}

      {showCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#2DD4BF]" />
                <span>Agregar Nueva Empresa en Supabase</span>
              </h3>
              <button onClick={() => setShowCompanyModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Ej: Mi Empresa Corporativa SRL"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">RNC o ID Fiscal</label>
                <input
                  type="text"
                  value={newCompanyTaxId}
                  onChange={(e) => setNewCompanyTaxId(e.target.value)}
                  placeholder="Ej: 1-30-99812-1"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>

              <div className="pt-4 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCompanyModal(false)}
                  className="w-1/2 py-2.5 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-xl text-xs hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-slate-950 font-bold rounded-xl text-xs hover:opacity-90 transition-all"
                >
                  Guardar en Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
