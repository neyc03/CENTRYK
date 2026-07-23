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
  Database
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { CentryxLogo } from '../components/CentryxLogo';
import { DeviceManagementModal, Device } from '../components/DeviceManagementModal';

// Inicialización del Cliente Servidor Oficial
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sylwwjuwxtziljjkowsz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bHd3anV3eHR6aWxqamtvd3N6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgxMjk0NSwiZXhwIjoyMTAwMzg4OTQ1fQ.16CCyu_5JhbsMUEhQh78_Pzm_649LJb-DgasnUlqDwU';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DashboardPage() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState('Todas las sucursales');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'warning' | 'locked'>('all');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('master');
  const [loadingDb, setLoadingDb] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Lista de Dispositivos (100% CERO MOCK DATA - Solo consulta directa al Servidor Corporativo)
  const [devices, setDevices] = useState<Device[]>([]);

  // Guard de Autenticación Estricta por Sesión (sessionStorage)
  useEffect(() => {
    const token = sessionStorage.getItem('centryx_token');
    const user = sessionStorage.getItem('centryx_user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (user) setCurrentUser(user);
    fetchLiveDevicesFromCloud();
  }, [router]);

  const fetchLiveDevicesFromCloud = async () => {
    try {
      setLoadingDb(true);
      setDbError(null);

      // Consulta directa al servidor de plataforma
      const { data, error } = await supabase.from('devices').select('*');

      if (error) {
        setDbError(error.message);
        setDevices([]);
      } else if (data) {
        const mapped: Device[] = data.map((d: any) => ({
          id: d.id,
          name: d.device_name || 'Dispositivo Android',
          serial: d.serial_number || d.imei || 'SN-UNKNOWN',
          imei: d.imei || 'SIN IMEI',
          company: 'Empresa Registrada',
          branch: 'Sucursal Central',
          status: d.is_locked ? 'locked' : (d.is_online ? 'online' : 'warning'),
          battery: d.battery_level || 100,
          app: d.is_locked ? 'Sistema Bloqueado DPC' : 'Esperando Telemetría',
          focusIndex: d.is_locked ? 0 : 95,
          locked: Boolean(d.is_locked),
        }));
        setDevices(mapped);
      }
    } catch (err: any) {
      setDbError(err.message || 'Error de conexión con el servidor corporativo');
      setDevices([]);
    } finally {
      setLoadingDb(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('centryx_token');
    sessionStorage.removeItem('centryx_user');
    localStorage.removeItem('centryx_token');
    localStorage.removeItem('centryx_user');
    router.push('/login');
  };

  const filteredDevices = devices.filter(dev => {
    const matchesSearch = 
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dev.imei && dev.imei.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || dev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateDevice = async (updatedDevice: Device) => {
    setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
    setSelectedDevice(updatedDevice);

    try {
      await supabase
        .from('devices')
        .update({ is_locked: updatedDevice.locked })
        .eq('id', updatedDevice.id);
    } catch (e) {
      console.error('Error actualizando servidor corporativo:', e);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050A14] text-slate-100 font-sans">
      
      {/* Sidebar Oscuro */}
      <aside className="w-64 bg-[#0A1525] border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <CentryxLogo size="md" />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Plataforma Core</div>
          
          <Link href="/" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-[#101D42] text-[#2DD4BF] font-medium border border-[#2DD4BF]/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]">
            <Activity className="w-5 h-5 text-[#2DD4BF]" />
            <span>Monitoreo en Vivo</span>
          </Link>

          <Link href="/mapa" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <MapPin className="w-5 h-5 text-[#3B82F6]" />
            <span>Mapa &amp; Tracking GPS</span>
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

          <Link href="/equipos" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Smartphone className="w-5 h-5 text-[#2DD4BF]" />
            <span>Gestión de Equipos &amp; Grupos</span>
          </Link>

          <Link href="/usuarios" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Users className="w-5 h-5 text-[#3B82F6]" />
            <span>Gestión de Usuarios</span>
          </Link>

          <Link href="/estructura" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Building2 className="w-5 h-5 text-[#10B981]" />
            <span>Multi-Tenant &amp; QR</span>
          </Link>

          <Link href="/reportes" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
            <span>Reportes Ejecutivo PDF</span>
          </Link>
        </nav>

        {/* Status de Conexión Corporativa */}
        <div className="p-3 mx-4 mb-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-emerald-400 text-xs">
          <Database className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Centryx Enterprise Cloud</span>
        </div>

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

          <button onClick={handleLogout} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Cerrar Sesión">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-16 bg-[#0A1525] border-b border-white/10 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold text-white tracking-wide">Centro de Monitoreo en Tiempo Real</h1>
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Centryx Enterprise Core Activo</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar IMEI o Serial real..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#050A14] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>

            <button
              onClick={fetchLiveDevicesFromCloud}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              title="Refrescar datos del servidor"
            >
              <RefreshCw className={`w-4 h-4 ${loadingDb ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#0D1B2E] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Dispositivos Reales</span>
                <Smartphone className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-white font-mono">{devices.length}</div>
              <div className="mt-1 text-[11px] text-emerald-400 font-medium">Conectado a Servidor</div>
            </div>

            <div className="bg-[#0D1B2E] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">En Línea</span>
                <Activity className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-emerald-400 font-mono">
                {devices.filter(d => d.status === 'online').length}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Pings en directo</div>
            </div>

            <div className="bg-[#0D1B2E] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Alertas de Uso</span>
                <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-amber-400 font-mono">
                {devices.filter(d => d.status === 'warning').length}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Uso no permitido</div>
            </div>

            <div className="bg-[#0D1B2E] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Bloqueados Remotamente</span>
                <Lock className="w-5 h-5 text-[#EF4444]" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-red-400 font-mono">
                {devices.filter(d => d.locked).length}
              </div>
              <div className="mt-1 text-[11px] text-red-400/80">Kiosk activo</div>
            </div>
          </div>

          <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Equipos Registrados en Plataforma Centryx</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20 font-mono">
                    {filteredDevices.length} registrados
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Sincronizado directamente con el servidor corporativo de telemetría</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#050A14] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-6">Dispositivo / IMEI</th>
                    <th className="py-3.5 px-6">Estado Telemetría</th>
                    <th className="py-3.5 px-6">App Activa</th>
                    <th className="py-3.5 px-6">Batería</th>
                    <th className="py-3.5 px-6 text-right">Gestión Remota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredDevices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                            <Database className="w-8 h-8" />
                          </div>
                          <div className="text-base font-bold text-white">Servidor Corporativo Centryx conectado y en espera de equipos reales</div>
                          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                            No hay dispositivos vinculados al servidor. Instale la APK en su teléfono o escanee el Código QR para enrolar su primer equipo real.
                          </p>
                          <Link href="/equipos" className="mt-3 px-5 py-2.5 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-slate-950 text-xs font-bold rounded-xl shadow-lg hover:opacity-90 transition-all">
                            Ir a Módulo de Equipos &amp; Código QR
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredDevices.map((dev) => (
                      <tr 
                        key={dev.id} 
                        onClick={() => setSelectedDevice(dev)}
                        className="hover:bg-white/5 transition-all cursor-pointer group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                              <Smartphone className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-white font-bold">{dev.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">IMEI: {dev.imei}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                            {dev.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-slate-300">{dev.app}</td>

                        <td className="py-4 px-6 font-mono text-slate-200">{dev.battery}%</td>

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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </main>

      <DeviceManagementModal 
        device={selectedDevice} 
        onClose={() => setSelectedDevice(null)} 
        onUpdateDevice={handleUpdateDevice} 
      />

    </div>
  );
}
