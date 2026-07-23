'use client';

import React, { useState, useEffect } from 'react';
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
  Award,
  Filter,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { CentryxLogo } from '../components/CentryxLogo';
import { DeviceManagementModal, Device } from '../components/DeviceManagementModal';

export default function DashboardPage() {
  const [selectedCompany, setSelectedCompany] = useState('Invernandez Group');
  const [selectedBranch, setSelectedBranch] = useState('Todas las sucursales');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'warning' | 'locked'>('all');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('master');

  useEffect(() => {
    const user = localStorage.getItem('centryx_user');
    if (user) setCurrentUser(user);
  }, []);

  // Lista inicial de Dispositivos Corporativos
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Galaxy Tab A9 (Caja 01)', serial: 'SN-99821-A', imei: '358992109281201', company: 'Invernandez SRL', branch: 'Santo Domingo Central', status: 'online', battery: 94, app: 'Punto de Venta POS', focusIndex: 98, locked: false },
    { id: '2', name: 'Galaxy A15 (Logística #04)', serial: 'SN-88412-B', imei: '358992109281202', company: 'Invernandez SRL', branch: 'Santiago Norte', status: 'online', battery: 78, app: 'Waze GPS Navigation', focusIndex: 94, locked: false },
    { id: '3', name: 'Nokia G42 (Supervisión)', serial: 'SN-77301-C', imei: '358992109281203', company: 'Invernandez SRL', branch: 'La Vega Central', status: 'warning', battery: 45, app: 'YouTube (No Permitido)', focusIndex: 62, locked: false },
    { id: '4', name: 'Galaxy Tab A9 (Caja 02)', serial: 'SN-99822-D', imei: '358992109281204', company: 'Invernandez SRL', branch: 'Santo Domingo Central', status: 'online', battery: 88, app: 'Punto de Venta POS', focusIndex: 99, locked: false },
    { id: '5', name: 'Galaxy A05 (Entregas #12)', serial: 'SN-55210-E', imei: '358992109281205', company: 'Invernandez SRL', branch: 'Puerto Plata', status: 'locked', battery: 12, app: 'Sistema Bloqueado', focusIndex: 0, locked: true },
  ]);

  // Filtrado dinámico por búsqueda y por estado
  const filteredDevices = devices.filter(dev => {
    const matchesSearch = 
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dev.imei && dev.imei.toLowerCase().includes(searchQuery.toLowerCase())) ||
      dev.branch.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || dev.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateDevice = (updatedDevice: Device) => {
    setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
    setSelectedDevice(updatedDevice);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050A14] text-slate-100 font-sans">
      
      {/* Sidebar Oscuro (Estilo SOC 2026) */}
      <aside className="w-64 bg-[#0A1525] border-r border-white/10 flex flex-col">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <CentryxLogo size="md" />
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
            <Award className="w-5 h-5 text-[#F59E0B]" />
            <span>Listado de Honor</span>
          </Link>

          <Link href="/alertas" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            <span>Alertas de Seguridad</span>
          </Link>

          <div className="pt-6 px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Administración</div>

          <Link href="/estructura" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Building2 className="w-5 h-5 text-[#10B981]" />
            <span>Multi-Tenant & QR</span>
          </Link>

          <Link href="/reportes" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
            <span>Reportes Ejecutivo PDF</span>
          </Link>
        </nav>

        {/* Footer del User Profile */}
        <div className="p-4 border-t border-white/10 bg-[#050A14]/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 flex items-center justify-center text-[#2DD4BF] font-bold text-xs uppercase">
              {currentUser.substring(0, 2)}
            </div>
            <div>
              <div className="text-xs font-bold text-white capitalize">{currentUser}</div>
              <div className="text-[10px] text-[#2DD4BF]">Admin Máster</div>
            </div>
          </div>

          <Link href="/login" className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Cerrar Sesión">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Operational Header Bar */}
        <header className="h-16 bg-[#0A1525] border-b border-white/10 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold text-white tracking-wide">Centro de Control de Dispositivos</h1>
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Agente DPC Conectado</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Buscador de Dispositivos */}
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por Nombre, IMEI o Serial..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#050A14] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>

            <Link href="/login" className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all">
              Cambiar Sesión
            </Link>
          </div>
        </header>

        {/* Dashboard Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Métricas Principales de Telemetría */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#0D1B2E] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Dispositivos</span>
                <Smartphone className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-white font-mono">{devices.length}</div>
              <div className="mt-1 text-[11px] text-emerald-400 flex items-center">
                <span>100% Bajo Política DPC</span>
              </div>
            </div>

            <div className="bg-[#0D1B2E] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">En Línea (Productivo)</span>
                <Activity className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-emerald-400 font-mono">
                {devices.filter(d => d.status === 'online').length}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Transmitiendo cada 30s</div>
            </div>

            <div className="bg-[#0D1B2E] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Alertas de Uso</span>
                <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-amber-400 font-mono">
                {devices.filter(d => d.status === 'warning').length}
              </div>
              <div className="mt-1 text-[11px] text-amber-400/80">App no autorizada activa</div>
            </div>

            <div className="bg-[#0D1B2E] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Bloqueados Remotamente</span>
                <Lock className="w-5 h-5 text-[#EF4444]" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-red-400 font-mono">
                {devices.filter(d => d.locked).length}
              </div>
              <div className="mt-1 text-[11px] text-red-400/80">PIN Kiosk Forzado</div>
            </div>
          </div>

          {/* Tabla de Dispositivos con Gestión en Vivo */}
          <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Listado de Gestión de Equipos</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20 font-mono">
                    {filteredDevices.length} filtrados
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Seleccione cualquier equipo para abrir la consola de control remoto</p>
              </div>

              {/* Filtros por Estado */}
              <div className="flex items-center space-x-2 bg-[#050A14] p-1.5 rounded-xl border border-white/10">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === 'all' ? 'bg-[#2DD4BF] text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatusFilter('online')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === 'online' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  En Línea
                </button>
                <button
                  onClick={() => setStatusFilter('warning')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === 'warning' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Alertas
                </button>
                <button
                  onClick={() => setStatusFilter('locked')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === 'locked' ? 'bg-red-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bloqueados
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#050A14] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-6">Dispositivo / IMEI</th>
                    <th className="py-3.5 px-6">Sucursal</th>
                    <th className="py-3.5 px-6">App en Uso</th>
                    <th className="py-3.5 px-6">Batería</th>
                    <th className="py-3.5 px-6">Índice Foco</th>
                    <th className="py-3.5 px-6 text-right">Acción Remota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredDevices.map((dev) => (
                    <tr 
                      key={dev.id} 
                      onClick={() => setSelectedDevice(dev)}
                      className="hover:bg-white/5 transition-all cursor-pointer group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-xl border ${
                            dev.locked 
                              ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                              : dev.status === 'warning'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          }`}>
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-white font-semibold group-hover:text-[#2DD4BF] transition-all flex items-center space-x-2">
                              <span>{dev.name}</span>
                              {dev.locked && (
                                <span className="px-2 py-0.5 text-[9px] bg-red-500/20 text-red-400 rounded-md font-bold">LOCKED</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">IMEI: {dev.imei || dev.serial}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-300">{dev.branch}</td>

                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                          dev.status === 'warning' 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : dev.locked
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}>
                          {dev.app}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2 font-mono">
                          <Battery className="w-4 h-4 text-emerald-400" />
                          <span className="text-slate-200">{dev.battery}%</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono">
                        <span className={`font-bold ${dev.focusIndex > 80 ? 'text-[#2DD4BF]' : dev.focusIndex > 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {dev.focusIndex}/100
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDevice(dev);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#101D42] border border-[#2DD4BF]/30 text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-slate-950 font-bold transition-all text-xs flex items-center space-x-1.5 ml-auto"
                        >
                          <span>Gestionar</span>
                          <ChevronRight className="w-4 h-4" />
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

      {/* Modal / Consola de Gestión Remota de Dispositivo */}
      <DeviceManagementModal 
        device={selectedDevice} 
        onClose={() => setSelectedDevice(null)} 
        onUpdateDevice={handleUpdateDevice} 
      />

    </div>
  );
}
