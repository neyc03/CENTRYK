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
  Users,
  Trash2,
  Edit3
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
  const [notification, setNotification] = useState<string | null>(null);

  // Modales CRUD Empresa
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyTaxId, setNewCompanyTaxId] = useState('');

  // Modales CRUD Sucursal
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any | null>(null);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');

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

  // Guardar o Editar Empresa en Supabase
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName) return;

    try {
      if (editingCompany) {
        const { error } = await supabase
          .from('companies')
          .update({
            name: newCompanyName,
            tax_id: newCompanyTaxId || '1-00-00000-0'
          })
          .eq('id', editingCompany.id);

        if (error) throw error;
        setNotification(`Empresa '${newCompanyName}' actualizada exitosamente.`);
      } else {
        const { error } = await supabase
          .from('companies')
          .insert({
            name: newCompanyName,
            tax_id: newCompanyTaxId || '1-00-00000-0',
            is_active: true
          });

        if (error) throw error;
        setNotification(`Empresa '${newCompanyName}' agregada exitosamente a Supabase.`);
      }

      fetchDataFromSupabase();
      setShowCompanyModal(false);
      setEditingCompany(null);
      setNewCompanyName('');
      setNewCompanyTaxId('');
    } catch (err: any) {
      setNotification(`Error: ${err.message}`);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  // Eliminar Empresa de Supabase
  const handleDeleteCompany = async (compId: string, compName: string) => {
    if (!confirm(`¿Está seguro de eliminar la empresa '${compName}' de la base de datos?`)) return;

    try {
      const { error } = await supabase.from('companies').delete().eq('id', compId);
      if (error) throw error;

      setCompanies(prev => prev.filter(c => c.id !== compId));
      setNotification(`Empresa '${compName}' eliminada exitosamente de Supabase.`);
    } catch (err: any) {
      setNotification(`Error eliminando empresa: ${err.message}`);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  // Guardar o Editar Sucursal en Supabase
  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName || !selectedCompanyId) return;

    try {
      if (editingBranch) {
        const { error } = await supabase
          .from('branches')
          .update({
            name: newBranchName,
            code: newBranchCode || 'SUC-001'
          })
          .eq('id', editingBranch.id);

        if (error) throw error;
        setNotification(`Sucursal '${newBranchName}' actualizada exitosamente.`);
      } else {
        const { error } = await supabase
          .from('branches')
          .insert({
            company_id: selectedCompanyId,
            name: newBranchName,
            code: newBranchCode || 'SUC-001'
          });

        if (error) throw error;
        setNotification(`Sucursal '${newBranchName}' creada en Supabase.`);
      }

      fetchDataFromSupabase();
      setShowBranchModal(false);
      setEditingBranch(null);
      setNewBranchName('');
      setNewBranchCode('');
    } catch (err: any) {
      setNotification(`Error: ${err.message}`);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  // Eliminar Sucursal de Supabase
  const handleDeleteBranch = async (branchId: string, branchName: string) => {
    if (!confirm(`¿Está seguro de eliminar la sucursal '${branchName}' de la base de datos?`)) return;

    try {
      const { error } = await supabase.from('branches').delete().eq('id', branchId);
      if (error) throw error;

      setBranches(prev => prev.filter(b => b.id !== branchId));
      setNotification(`Sucursal '${branchName}' eliminada exitosamente de Supabase.`);
    } catch (err: any) {
      setNotification(`Error eliminando sucursal: ${err.message}`);
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
            <p className="text-xs text-slate-400 mt-0.5">Control Total CRUD (Crear, Editar, Eliminar) en tablas Supabase companies y branches</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              setEditingCompany(null);
              setNewCompanyName('');
              setNewCompanyTaxId('');
              setShowCompanyModal(true);
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Empresa</span>
          </button>

          <button 
            onClick={() => {
              if (companies.length === 0) {
                alert('Primero debe crear una empresa antes de agregar sucursales.');
                return;
              }
              setSelectedCompanyId(companies[0].id);
              setEditingBranch(null);
              setNewBranchName('');
              setNewBranchCode('');
              setShowBranchModal(true);
            }}
            className="flex items-center space-x-2 bg-[#101D42] border border-[#2DD4BF]/30 text-[#2DD4BF] px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#2DD4BF] hover:text-slate-950 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Sucursal</span>
          </button>
        </div>
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
          <span>Generador de Código QR DPC</span>
        </button>
      </div>

      {/* Pestaña Empresas con Editar y Eliminar */}
      {activeTab === 'companies' && (
        <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white">Empresas Registradas</h3>
          {companies.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No hay empresas creadas en Supabase. Presione <strong>Agregar Empresa</strong> arriba para registrar su primera organización.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companies.map((c) => (
                <div key={c.id} className="p-5 rounded-2xl bg-[#050A14] border border-white/10 flex items-center justify-between group">
                  <div>
                    <h4 className="text-sm font-bold text-white">{c.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">RNC / ID Fiscal: {c.tax_id}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingCompany(c);
                        setNewCompanyName(c.name);
                        setNewCompanyTaxId(c.tax_id || '');
                        setShowCompanyModal(true);
                      }}
                      className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-[#2DD4BF] hover:bg-white/10 transition-all"
                      title="Editar Empresa"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteCompany(c.id, c.name)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                      title="Eliminar Empresa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pestaña Sucursales con Editar y Eliminar */}
      {activeTab === 'branches' && (
        <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white">Sucursales Registradas</h3>
          {branches.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No hay sucursales registradas en Supabase. Presione <strong>Agregar Sucursal</strong> arriba para crear una.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map((b) => (
                <div key={b.id} className="p-5 rounded-2xl bg-[#050A14] border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{b.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Código: {b.code || 'SUC-001'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingBranch(b);
                        setNewBranchName(b.name);
                        setNewBranchCode(b.code || '');
                        setSelectedCompanyId(b.company_id);
                        setShowBranchModal(true);
                      }}
                      className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-[#2DD4BF] hover:bg-white/10 transition-all"
                      title="Editar Sucursal"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteBranch(b.id, b.name)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                      title="Eliminar Sucursal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pestaña Generador de Código QR DPC */}
      {activeTab === 'qr' && (
        <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl p-8 space-y-6 text-center shadow-xl">
          <QrCode className="w-16 h-16 text-[#2DD4BF] mx-auto" />
          <h3 className="text-lg font-bold text-white">Código QR de Enrolamiento DPC Android</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Escanee este código QR al encender cualquier teléfono Android nuevo (tras tocar 6 veces la pantalla de bienvenida) para enrolarlo directamente en su base de datos.
          </p>
          <div className="p-6 bg-white rounded-3xl w-56 h-56 mx-auto flex flex-col items-center justify-center border-4 border-[#2DD4BF] shadow-[0_0_30px_rgba(45,212,191,0.3)]">
            <QrCode className="w-32 h-32 text-slate-950" />
            <span className="text-slate-950 font-mono text-[10px] font-bold mt-2">CENTRYX MDM DPC</span>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar Empresa */}
      {showCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#2DD4BF]" />
                <span>{editingCompany ? 'Editar Empresa' : 'Agregar Empresa'} en Supabase</span>
              </h3>
              <button onClick={() => setShowCompanyModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Ej: Mi Empresa SRL"
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

      {/* Modal Crear / Editar Sucursal */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <GitBranch className="w-5 h-5 text-[#2DD4BF]" />
                <span>{editingBranch ? 'Editar Sucursal' : 'Agregar Sucursal'} en Supabase</span>
              </h3>
              <button onClick={() => setShowBranchModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Sucursal</label>
                <input
                  type="text"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="Ej: Sucursal Central Zona Norte"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Código Identificador</label>
                <input
                  type="text"
                  value={newBranchCode}
                  onChange={(e) => setNewBranchCode(e.target.value)}
                  placeholder="Ej: SUC-001"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>

              <div className="pt-4 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBranchModal(false)}
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
