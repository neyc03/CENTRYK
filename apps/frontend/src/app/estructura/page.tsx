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
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function StructurePage() {
  const [activeTab, setActiveTab] = useState<'companies' | 'branches' | 'groups' | 'profiles'>('companies');
  const [showQrModal, setShowQrModal] = useState(false);

  const mockCompanies = [
    { id: '1', name: 'Invernandez Group SRL', taxId: '1-30-99812-1', branchesCount: 5, devicesCount: 220, status: 'Activa' },
    { id: '2', name: 'Logística & Transporte Central', taxId: '1-31-44510-9', branchesCount: 4, devicesCount: 180, status: 'Activa' },
    { id: '3', name: 'Retail Dominis SRL', taxId: '1-32-88102-3', branchesCount: 3, devicesCount: 100, status: 'Activa' },
  ];

  const mockProfiles = [
    { id: 'p1', name: 'Perfil Cajeros POS', group: 'Cajeros & Punto de Venta', apps: ['Punto de Venta POS', 'Calculadora'], allowedCount: 2 },
    { id: 'p2', name: 'Perfil Entregas & Waze', group: 'Choferes & Rutas', apps: ['Waze GPS', 'Centryx Delivery'], allowedCount: 2 },
    { id: 'p3', name: 'Perfil Supervisión General', group: 'Supervisores de Campo', apps: ['Waze', 'WhatsApp Busines', 'Gmail', 'POS Admin'], allowedCount: 4 },
  ];

  return (
    <div className="min-h-screen bg-[#050A14] text-slate-100 p-8 space-y-8">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-xl bg-[#0D1B2E] border border-white/10 hover:border-[#2DD4BF]/50 text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Estructura Organizacional & Perfiles</h1>
            <p className="text-xs text-slate-400 mt-0.5">Gestión Multi-Tenant de Empresas, Sucursales, Grupos y Perfiles de Aplicaciones.</p>
          </div>
        </div>

        <button 
          onClick={() => setShowQrModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-[#050A14] px-4 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:opacity-90 transition-all cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>Generar QR de Enrolamiento</span>
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex space-x-2 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('companies')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'companies' ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/40' : 'text-slate-400 hover:bg-white/5'}`}
        >
          <Building2 className="w-4 h-4" />
          <span>Empresas (Tenants)</span>
        </button>

        <button 
          onClick={() => setActiveTab('branches')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'branches' ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/40' : 'text-slate-400 hover:bg-white/5'}`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Sucursales</span>
        </button>

        <button 
          onClick={() => setActiveTab('groups')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'groups' ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/40' : 'text-slate-400 hover:bg-white/5'}`}
        >
          <Users className="w-4 h-4" />
          <span>Grupos de Personal</span>
        </button>

        <button 
          onClick={() => setActiveTab('profiles')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'profiles' ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/40' : 'text-slate-400 hover:bg-white/5'}`}
        >
          <Sliders className="w-4 h-4" />
          <span>Perfiles de Apps</span>
        </button>
      </div>

      {/* Tab Content: Companies */}
      {activeTab === 'companies' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-300">Listado de Empresas Aisladas (Multi-Tenant)</h3>
            <button className="flex items-center space-x-2 bg-[#0D1B2E] border border-white/10 hover:border-[#2DD4BF]/50 text-white px-3 py-1.5 rounded-xl text-xs transition-all">
              <Plus className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>Registrar Nueva Empresa</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockCompanies.map((comp) => (
              <div key={comp.id} className="centryx-card p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#101D42] border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                    {comp.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white">{comp.name}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">RNC: {comp.taxId}</p>
                </div>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-500">Sucursales</p>
                    <p className="text-base font-bold text-white mt-0.5">{comp.branchesCount}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Dispositivos</p>
                    <p className="text-base font-bold text-[#2DD4BF] mt-0.5">{comp.devicesCount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Profiles */}
      {activeTab === 'profiles' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-300">Perfiles de Productividad Definidos</h3>
            <button className="flex items-center space-x-2 bg-[#0D1B2E] border border-white/10 hover:border-[#2DD4BF]/50 text-white px-3 py-1.5 rounded-xl text-xs transition-all">
              <Plus className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>Crear Nuevo Perfil de Apps</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockProfiles.map((prof) => (
              <div key={prof.id} className="centryx-card p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10">
                    {prof.allowedCount} Apps Esperadas
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white">{prof.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Grupo: <span className="text-[#2DD4BF] font-semibold">{prof.group}</span></p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <p className="text-[11px] uppercase font-mono text-slate-500 tracking-wider">Aplicaciones de Perfil:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {prof.apps.map((app, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#050A14] border border-white/10 text-xs text-slate-200">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Code Enrollment Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="centryx-card max-w-md w-full p-6 space-y-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2DD4BF] to-[#3B82F6] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(45,212,191,0.3)]">
                <QrCode className="w-6 h-6 text-[#050A14]" />
              </div>
              <h3 className="text-lg font-bold text-white">Enrolamiento Android Device Owner</h3>
              <p className="text-xs text-slate-400">Escanee este código QR desde el asistente de bienvenida de Android recién formateado (6 toques en pantalla).</p>
            </div>

            {/* QR Mock Display */}
            <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center border-4 border-[#2DD4BF]/40 shadow-[0_0_40px_rgba(45,212,191,0.2)]">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=%7B%22android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME%22%3A%22io.centryx.mdm%2F.CentryxDeviceAdminReceiver%22%7D" 
                alt="Enrolamiento Centryx QR"
                className="w-48 h-48"
              />
              <p className="text-[10px] text-slate-800 font-mono mt-3 font-semibold">payload: io.centryx.mdm / DeviceOwner</p>
            </div>

            <div className="space-y-2 text-xs text-slate-300 bg-[#050A14] p-3 rounded-xl border border-white/10">
              <div className="flex items-center space-x-2 text-[#10B981]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-semibold">Modo Device Owner Automático</span>
              </div>
              <p className="text-[11px] text-slate-400">Instala el agente DPC, desactiva apps no autorizadas y aplica políticas de bloqueo instantáneamente.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
