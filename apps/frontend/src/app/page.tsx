'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Activity, 
  AlertTriangle, 
  Lock, 
  Search, 
  Building2, 
  GitBranch, 
  Users, 
  TrendingUp, 
  MapPin, 
  Battery, 
  RefreshCw,
  Sliders,
  Award
} from 'lucide-react';
import Link from 'next/link';


export default function DashboardPage() {
  const [selectedCompany, setSelectedCompany] = useState('Invernandez Group');
  const [selectedBranch, setSelectedBranch] = useState('Todas las sucursales');

  // Datos demostrativos de telemetría en tiempo real
  const mockDevices = [
    { id: '1', name: 'Galaxy Tab A9 (Caja 01)', serial: 'SN-99821-A', company: 'Invernandez SRL', branch: 'Santo Domingo Central', status: 'online', battery: 94, app: 'Punto de Venta POS', focusIndex: 98, locked: false },
    { id: '2', name: 'Galaxy A15 (Logística #04)', serial: 'SN-88412-B', company: 'Invernandez SRL', branch: 'Santiago Norte', status: 'online', battery: 78, app: 'Waze GPS Navigation', focusIndex: 94, locked: false },
    { id: '3', name: 'Nokia G42 (Supervisión)', serial: 'SN-77301-C', company: 'Invernandez SRL', branch: 'La Vega Central', status: 'warning', battery: 45, app: 'YouTube (No Permitido)', focusIndex: 62, locked: false },
    { id: '4', name: 'Galaxy Tab A9 (Caja 02)', serial: 'SN-99822-D', company: 'Invernandez SRL', branch: 'Santo Domingo Central', status: 'online', battery: 88, app: 'Punto de Venta POS', focusIndex: 99, locked: false },
    { id: '5', name: 'Galaxy A05 (Entregas #12)', serial: 'SN-55210-E', company: 'Invernandez SRL', branch: 'Puerto Plata', status: 'locked', battery: 12, app: 'Sistema Bloqueado', focusIndex: 0, locked: true },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050A14] text-slate-100">
      
      {/* Sidebar Oscuro (Estilo SOC 2026) */}
      <aside className="w-64 bg-[#0A1525] border-r border-white/10 flex flex-col">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2DD4BF] to-[#3B82F6] flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.3)]">
            <ShieldCheck className="w-6 h-6 text-[#050A14]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white">CENTRYX</h1>
            <p className="text-xs text-[#2DD4BF] font-mono">ENTERPRISE MDM v1.0</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Plataforma Core</div>
          
          <Link href="/" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-[#101D42] text-[#2DD4BF] font-medium border border-[#2DD4BF]/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]">
            <Activity className="w-5 h-5 text-[#2DD4BF]" />
            <span>Monitoreo en Vivo</span>
          </Link>

          <Link href="/mapa" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <MapPin className="w-5 h-5 text-[#3B82F6]" />
            <span>Mapa & Tracking GPS</span>
          </Link>

          <Link href="/ranking" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Award className="w-5 h-5 text-[#FACC15]" />
            <span>Índice de Foco & Ranking</span>
          </Link>

          <Link href="/alertas" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <AlertTriangle className="w-5 h-5 text-[#F97316]" />
            <span>Alertas & Anomalías</span>
          </Link>

          <Link href="/reportes" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <TrendingUp className="w-5 h-5 text-[#10B981]" />
            <span>Reportes PDF Semanales</span>
          </Link>

          <div className="pt-6 px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Estructura & Config</div>

          <Link href="/estructura" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Building2 className="w-5 h-5" />
            <span>Empresas & Sucursales</span>
          </Link>
        </nav>


        {/* Current Tenant Footer */}
        <div className="p-4 border-t border-white/10 bg-[#050A14]/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#101D42] border border-[#2DD4BF]/40 flex items-center justify-center font-bold text-xs text-[#2DD4BF]">
              M
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white">Usuario Master</p>
              <p className="text-[11px] text-slate-400 truncate">master@centryx.io</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Topbar Filter */}
        <header className="h-16 bg-[#0A1525]/80 backdrop-blur border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-[#0D1B2E] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <Building2 className="w-4 h-4 text-[#2DD4BF]" />
              <span>Empresa:</span>
              <select className="bg-transparent text-white font-medium focus:outline-none cursor-pointer">
                <option className="bg-[#0D1B2E]">Invernandez Group (3 Empresas)</option>
                <option className="bg-[#0D1B2E]">Empresa #1 (Logística)</option>
                <option className="bg-[#0D1B2E]">Empresa #2 (Retail)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 bg-[#0D1B2E] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <GitBranch className="w-4 h-4 text-[#3B82F6]" />
              <span>Sucursal:</span>
              <select className="bg-transparent text-white font-medium focus:outline-none cursor-pointer">
                <option className="bg-[#0D1B2E]">Todas las sucursales (12)</option>
                <option className="bg-[#0D1B2E]">Santo Domingo Central</option>
                <option className="bg-[#0D1B2E]">Santiago Norte</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-[#101D42] text-[#2DD4BF] hover:bg-[#2DD4BF]/10 px-4 py-2 rounded-xl text-xs font-semibold border border-[#2DD4BF]/30 transition-all">
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Sincronizando (500 pings/min)</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-8 space-y-8">
          
          {/* Header Title */}
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Centro de Control de Dispositivos</h2>
            <p className="text-sm text-slate-400 mt-1">Estado de flota en tiempo real, Índice de Foco diario y telemetría de uso.</p>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Dispositivos Totales */}
            <div className="centryx-card p-5 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Dispositivos Activos</p>
                  <h3 className="text-3xl font-bold text-white mt-2">500</h3>
                </div>
                <div className="p-3 bg-[#3B82F6]/10 rounded-xl border border-[#3B82F6]/20">
                  <Smartphone className="w-6 h-6 text-[#3B82F6]" />
                </div>
              </div>
              <p className="text-xs text-[#10B981] mt-4 flex items-center font-medium">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> 100% Asignados a Personal
              </p>
            </div>

            {/* En Línea */}
            <div className="centryx-card p-5 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-400 font-medium">En Línea Ahora</p>
                  <h3 className="text-3xl font-bold text-[#10B981] mt-2">482</h3>
                </div>
                <div className="p-3 bg-[#10B981]/10 rounded-xl border border-[#10B981]/20">
                  <div className="w-4 h-4 rounded-full bg-[#10B981] animate-pulse-dot" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">96.4% de presencia continua</p>
            </div>

            {/* Promedio Índice de Foco */}
            <div className="centryx-card p-5 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Índice de Foco Promedio</p>
                  <h3 className="text-3xl font-bold text-[#2DD4BF] mt-2">91.4%</h3>
                </div>
                <div className="p-3 bg-[#2DD4BF]/10 rounded-xl border border-[#2DD4BF]/20">
                  <Award className="w-6 h-6 text-[#2DD4BF]" />
                </div>
              </div>
              <p className="text-xs text-[#2DD4BF] mt-4 font-medium">Productividad Alta (+4.2%)</p>
            </div>

            {/* Alertas Atencion */}
            <div className="centryx-card p-5 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Alertas / Bloqueos</p>
                  <h3 className="text-3xl font-bold text-[#F97316] mt-2">3</h3>
                </div>
                <div className="p-3 bg-[#F97316]/10 rounded-xl border border-[#F97316]/20">
                  <AlertTriangle className="w-6 h-6 text-[#F97316]" />
                </div>
              </div>
              <p className="text-xs text-[#EF4444] mt-4 font-medium">1 Dispositivo Bloqueado</p>
            </div>

          </div>

          {/* Device Table Section */}
          <div className="centryx-card overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Monitoreo de Telemetría en Vivo</h3>
                <p className="text-xs text-slate-400 mt-0.5">Última app detectada en primer plano y nivel de foco por dispositivo.</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    placeholder="Buscar por IMEI, Serie o Nombre..." 
                    className="bg-[#050A14] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]/50 w-64"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0A1525] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-6">Dispositivo</th>
                    <th className="py-3.5 px-6">Sucursal</th>
                    <th className="py-3.5 px-6">Estado</th>
                    <th className="py-3.5 px-6">Batería</th>
                    <th className="py-3.5 px-6">App en primer plano</th>
                    <th className="py-3.5 px-6">Índice de Foco</th>
                    <th className="py-3.5 px-6 text-right">Acción Remota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockDevices.map((device) => (
                    <tr key={device.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 font-medium text-white">
                        <div>{device.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{device.serial}</div>
                      </td>

                      <td className="py-4 px-6 text-slate-400">
                        {device.branch}
                      </td>

                      <td className="py-4 px-6">
                        {device.status === 'online' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5 animate-pulse-dot" />
                            En Línea
                          </span>
                        )}
                        {device.status === 'warning' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30">
                            Desvío Perfil
                          </span>
                        )}
                        {device.status === 'locked' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30">
                            <Lock className="w-3 h-3 mr-1" />
                            Bloqueado
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Battery className={`w-4 h-4 ${device.battery < 20 ? 'text-[#EF4444]' : 'text-[#10B981]'}`} />
                          <span className="font-mono">{device.battery}%</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-200">
                        <span className="font-semibold text-[#2DD4BF]">{device.app}</span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-[#050A14] h-2 rounded-full overflow-hidden border border-white/10">
                            <div 
                              className={`h-full rounded-full ${device.focusIndex > 80 ? 'bg-[#10B981]' : device.focusIndex > 50 ? 'bg-[#FACC15]' : 'bg-[#EF4444]'}`} 
                              style={{ width: `${device.focusIndex}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-white">{device.focusIndex}%</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button className="px-3 py-1.5 rounded-lg bg-[#101D42] hover:bg-[#EF4444]/20 hover:text-[#EF4444] hover:border-[#EF4444]/40 text-slate-300 border border-white/10 text-xs transition-all">
                          {device.locked ? 'Desbloquear' : 'Comandos'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
