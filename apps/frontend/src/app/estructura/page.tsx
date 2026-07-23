'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  GitBranch, 
  Users, 
  Sliders, 
  Plus, 
  QrCode, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  X,
  Layers,
  ArrowLeft,
  UserCheck,
  KeyRound,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export default function StructurePage() {
  const [activeTab, setActiveTab] = useState<'companies' | 'branches' | 'groups' | 'profiles' | 'auditors'>('companies');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAuditorModal, setShowAuditorModal] = useState(false);

  const mockCompanies = [
    { id: '1', name: 'Empresa Corporativa SRL', taxId: '1-30-99812-1', branchesCount: 5, devicesCount: 220, status: 'Activa' },
    { id: '2', name: 'Logística & Transporte Central', taxId: '1-31-44510-9', branchesCount: 4, devicesCount: 180, status: 'Activa' },
    { id: '3', name: 'Retail Dominis SRL', taxId: '1-32-88102-3', branchesCount: 3, devicesCount: 100, status: 'Activa' },
  ];

  const mockProfiles = [
    { id: 'p1', name: 'Perfil Cajeros POS', group: 'Cajeros & Punto de Venta', apps: ['Punto de Venta POS', 'Calculadora'], allowedCount: 2 },
    { id: 'p2', name: 'Perfil Entregas & Waze', group: 'Choferes & Rutas', apps: ['Waze GPS', 'Centryx Delivery'], allowedCount: 2 },
    { id: 'p3', name: 'Perfil Supervisión General', group: 'Personal Auditado en Campo', apps: ['Waze', 'POS Admin'], allowedCount: 2 },
  ];

  // Auditores Autorizados para acceder al Dashboard
  const [auditors, setAuditors] = useState([
    { id: 'a1', username: 'master', fullName: 'Administrador Máster', role: 'Máster Total', email: 'master@centryx.io', status: 'Activo' },
    { id: 'a2', username: 'auditor_central', fullName: 'Auditor General de Operaciones', role: 'Auditor de Campo', email: 'auditoria@empresa.com', status: 'Activo' },
    { id: 'a3', username: 'auditor_seguridad', fullName: 'Auditor de Seguridad IT', role: 'Auditor de Seguridad', email: 'security@centryx.io', status: 'Activo' },
  ]);

  return (
    <div className="min-h-screen bg-[#050A14] text-slate-100 p-8 space-y-8">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-xl bg-[#0D1B2E] border border-white/10 hover:border-[#2DD4BF]/50 text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Estructura Organizacional & Control de Acceso</h1>
            <p className="text-xs text-slate-400 mt-0.5">Gestión Multi-Tenant de Empresas, Perfiles de Apps y Auditores Autorizados para acceder a la Plataforma.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAuditorModal(true)}
            className="flex items-center space-x-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-[#2DD4BF]" />
            <span>Nuevo Auditor Autorizado</span>
          </button>

          <button 
            onClick={() => setShowQrModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-[#050A14] px-4 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:opacity-90 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Generar QR Enrolamiento DPC</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex space-x-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'companies' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Empresas ({mockCompanies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'profiles' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Perfiles de Apps Auditadas ({mockProfiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('auditors')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'auditors' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Auditores Autorizados ({auditors.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockCompanies.map((c) => (
            <div key={c.id} className="bg-[#0D1B2E] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#3B82F6]">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {c.status}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{c.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">RNC/TaxID: {c.taxId}</p>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between text-xs text-slate-400">
                <span>{c.branchesCount} Sucursales</span>
                <span className="text-white font-semibold">{c.devicesCount} Equipos Auditados</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockProfiles.map((p) => (
            <div key={p.id} className="bg-[#0D1B2E] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF]">
                  <Sliders className="w-6 h-6" />
                </div>
                <span className="text-xs text-slate-400 font-mono">{p.group}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Apps Permitidas en el Agente DPC:</p>
              </div>
              <div className="space-y-1.5 pt-2">
                {p.apps.map((app, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#050A14] text-xs">
                    <span className="text-slate-300">{app}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'auditors' && (
        <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Lista de Auditores Autorizados para acceder a la Plataforma Web</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">El personal auditado en campo NO tiene acceso a esta web. Solo los auditores autorizados aquí pueden iniciar sesión.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050A14] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-6">Usuario (Login)</th>
                  <th className="py-3.5 px-6">Nombre Completo</th>
                  <th className="py-3.5 px-6">Rol de Auditoría</th>
                  <th className="py-3.5 px-6">Correo</th>
                  <th className="py-3.5 px-6 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {auditors.map((aud) => (
                  <tr key={aud.id} className="hover:bg-white/5 transition-all">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 font-bold font-mono">
                          {aud.username}
                        </div>
                        <span className="text-white font-bold">{aud.username}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-200">{aud.fullName}</td>

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">
                        {aud.role}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-400 font-mono">{aud.email}</td>

                    <td className="py-4 px-6 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {aud.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal QR Enrolamiento */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-[#2DD4BF]" />
                <span>QR Enrolamiento Android DPC</span>
              </h3>
              <button onClick={() => setShowQrModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center p-6 rounded-2xl bg-white text-slate-950">
              <div className="w-48 h-48 bg-slate-950 p-3 rounded-xl flex items-center justify-center">
                <div className="w-full h-full border-4 border-dashed border-[#2DD4BF] flex flex-col items-center justify-center text-center p-2">
                  <QrCode className="w-24 h-24 text-[#2DD4BF]" />
                  <span className="text-[10px] text-slate-400 font-mono mt-1">Centryx-DPC-v2</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-4 text-center font-medium">
                Toque 6 veces la pantalla inicial de bienvenida de Android y escanee este código para convertir el teléfono en <strong>Device Owner</strong>.
              </p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 bg-[#101D42] border border-[#2DD4BF]/30 text-[#2DD4BF] font-bold rounded-xl text-xs hover:bg-[#2DD4BF] hover:text-slate-950 transition-all"
            >
              Cerrar Modal de Enrolamiento
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
