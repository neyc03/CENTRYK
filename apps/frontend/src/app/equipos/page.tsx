'use client';

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Users, 
  Sliders, 
  Plus, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  ArrowLeft, 
  Search, 
  Lock, 
  Unlock, 
  Volume2, 
  MapPin, 
  Battery, 
  Trash2, 
  AppWindow,
  Building2,
  GitBranch,
  Layers,
  Sparkles,
  RefreshCw,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { CentryxLogo } from '../../components/CentryxLogo';

// Supabase Live Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sylwwjuwxtziljjkowsz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bHd3anV3eHR6aWxqamtvd3N6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgxMjk0NSwiZXhwIjoyMTAwMzg4OTQ1fQ.16CCyu_5JhbsMUEhQh78_Pzm_649LJb-DgasnUlqDwU';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface StaffGroup {
  id: string;
  name: string;
  description: string;
  allowedApps: string[];
  blockedApps: string[];
  deviceCount: number;
}

export interface ManagedDevice {
  id: string;
  deviceName: string;
  imei: string;
  serialNumber: string;
  groupId: string;
  groupName: string;
  isLocked: boolean;
  batteryLevel: number;
  lastPingAt: string;
}

export default function EquiposManagementPage() {
  const [activeTab, setActiveTab] = useState<'devices' | 'groups' | 'policies' | 'onboarding'>('devices');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Modales
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showAssignGroupModal, setShowAssignGroupModal] = useState(false);
  const [selectedDeviceToAssign, setSelectedDeviceToAssign] = useState<ManagedDevice | null>(null);

  // Estados de Formulario de Nuevo Grupo
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupAllowedApps, setNewGroupAllowedApps] = useState('Punto de Venta POS, Waze GPS');
  const [newGroupBlockedApps, setNewGroupBlockedApps] = useState('YouTube, TikTok, Facebook');

  // Datos en vivo cargados de Supabase
  const [groups, setGroups] = useState<StaffGroup[]>([
    {
      id: 'g1',
      name: 'Grupo Cajeros POS',
      description: 'Dispositivos asignados a puntos de cobro en tiendas',
      allowedApps: ['Punto de Venta POS', 'Calculadora'],
      blockedApps: ['YouTube', 'TikTok', 'Instagram'],
      deviceCount: 12
    },
    {
      id: 'g2',
      name: 'Grupo Choferes & Entregas',
      description: 'Equipos móviles de rutas de despacho y logística',
      allowedApps: ['Waze GPS', 'Google Maps', 'Centryx Delivery'],
      blockedApps: ['YouTube', 'Netflix', 'Juegos'],
      deviceCount: 8
    },
    {
      id: 'g3',
      name: 'Grupo Supervisión de Campo',
      description: 'Personal auditado en supervisión de áreas',
      allowedApps: ['Waze', 'Gmail', 'POS Admin'],
      blockedApps: ['Juegos', 'TikTok'],
      deviceCount: 5
    }
  ]);

  const [devices, setDevices] = useState<ManagedDevice[]>([]);

  useEffect(() => {
    fetchDataFromSupabase();
  }, []);

  const fetchDataFromSupabase = async () => {
    try {
      setLoading(true);
      const { data: dbDevices, error } = await supabase.from('devices').select('*');
      if (dbDevices && dbDevices.length > 0) {
        const mapped: ManagedDevice[] = dbDevices.map((d: any) => ({
          id: d.id,
          deviceName: d.device_name || 'Dispositivo Android',
          imei: d.imei || '358992109281201',
          serialNumber: d.serial_number || 'SN-DEFAULT',
          groupId: d.profile_id || 'g1',
          groupName: d.is_locked ? 'Grupo Bloqueado' : 'Grupo Cajeros POS',
          isLocked: Boolean(d.is_locked),
          batteryLevel: d.battery_level || 90,
          lastPingAt: d.last_ping_at || new Date().toISOString()
        }));
        setDevices(mapped);
      }
    } catch (e) {
      console.error('Error leyendo Supabase:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName) return;

    const newG: StaffGroup = {
      id: `g-${Date.now()}`,
      name: newGroupName,
      description: newGroupDesc || 'Grupo de Restricción DPC',
      allowedApps: newGroupAllowedApps.split(',').map(s => s.trim()).filter(Boolean),
      blockedApps: newGroupBlockedApps.split(',').map(s => s.trim()).filter(Boolean),
      deviceCount: 0
    };

    setGroups(prev => [...prev, newG]);
    setShowGroupModal(false);
    setNewGroupName('');
    setNewGroupDesc('');

    setNotification(`Grupo '${newG.name}' y Políticas de Restricción creados exitosamente.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAssignGroupSubmit = (groupId: string) => {
    if (!selectedDeviceToAssign) return;
    const targetGroup = groups.find(g => g.id === groupId);

    setDevices(prev => prev.map(d => d.id === selectedDeviceToAssign.id ? {
      ...d,
      groupId: groupId,
      groupName: targetGroup ? targetGroup.name : d.groupName
    } : d));

    setShowAssignGroupModal(false);
    setSelectedDeviceToAssign(null);
    setNotification(`Dispositivo asignado exitosamente al ${targetGroup?.name}`);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredDevices = devices.filter(d => 
    d.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.imei.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050A14] text-slate-100 p-8 space-y-8 font-sans">
      
      {/* Header General */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-xl bg-[#0D1B2E] border border-white/10 hover:border-[#2DD4BF]/50 text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Panel de Gestión de Equipos, Grupos & Políticas</h1>
            <p className="text-xs text-slate-400 mt-0.5">Asignación de teléfonos a grupos de trabajo, restricción de aplicaciones y flujo de inclusión.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowGroupModal(true)}
            className="flex items-center space-x-2 bg-[#101D42] border border-[#2DD4BF]/30 hover:bg-[#2DD4BF] hover:text-slate-950 text-[#2DD4BF] px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Grupo</span>
          </button>

          <button 
            onClick={() => setActiveTab('onboarding')}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-[#050A14] px-4 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:opacity-90 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Inluir Nuevo Teléfono (QR / ADB)</span>
          </button>
        </div>
      </div>

      {/* Notificación de Acción */}
      {notification && (
        <div className="bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 px-6 py-3 rounded-2xl flex items-center space-x-3 text-[#2DD4BF] text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navegación por Pestañas */}
      <div className="flex space-x-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'devices' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Equipos Auditados ({devices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'groups' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Grupos de Trabajo ({groups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'policies' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Políticas de Restricción de Apps</span>
        </button>

        <button
          onClick={() => setActiveTab('onboarding')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'onboarding' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Guía de Inclusión de Móviles</span>
        </button>
      </div>

      {/* Contenido Pestaña 1: Equipos Registrados */}
      {activeTab === 'devices' && (
        <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Dispositivos y Asignación de Grupo</h3>
              <p className="text-xs text-slate-400 mt-0.5">Asigne cada teléfono a su grupo de trabajo para aplicarle sus aplicaciones permitidas y bloqueos.</p>
            </div>

            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por Nombre o IMEI..."
                className="w-full pl-9 pr-4 py-2 bg-[#050A14] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredDevices.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <Smartphone className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">No hay equipos registrados en este filtro</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Siga la pestaña <strong>Guía de Inclusión de Móviles</strong> para escanear el QR y enrolar su primer teléfono Android.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#050A14] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-6">Dispositivo Móvil</th>
                    <th className="py-3.5 px-6">IMEI / Serial</th>
                    <th className="py-3.5 px-6">Grupo Asignado</th>
                    <th className="py-3.5 px-6">Estado DPC</th>
                    <th className="py-3.5 px-6 text-right">Asignar Grupo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredDevices.map((dev) => (
                    <tr key={dev.id} className="hover:bg-white/5 transition-all">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <span className="text-white font-bold">{dev.deviceName}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-400 font-mono">{dev.imei}</td>

                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          {dev.groupName}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {dev.isLocked ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            BLOQUEADO KIOSK
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            ACTIVO EN LÍNEA
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setSelectedDeviceToAssign(dev);
                            setShowAssignGroupModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#101D42] text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-slate-950 font-bold transition-all text-xs border border-[#2DD4BF]/30 ml-auto"
                        >
                          Cambiar Grupo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Contenido Pestaña 2: Grupos de Trabajo */}
      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groups.map((g) => (
            <div key={g.id} className="bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-300 font-mono">
                  {g.deviceCount} Teléfonos
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{g.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{g.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/10">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">Apps Permitidas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {g.allowedApps.map((app, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] rounded-md font-semibold">
                        ✓ {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider block mb-1">Apps Bloqueadas DPC:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {g.blockedApps.map((app, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] rounded-md font-semibold">
                        ✕ {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contenido Pestaña 3: Políticas de Restricción */}
      {activeTab === 'policies' && (
        <div className="p-8 rounded-3xl bg-[#0D1B2E] border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 text-[#2DD4BF]">
            <Sliders className="w-6 h-6" />
            <h2 className="text-lg font-bold text-white">Políticas Globale de Restricción y Seguridad DPC</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-[#050A14] border border-white/10 space-y-2">
              <h4 className="font-bold text-white">Bloqueo de Desinstalación de Aplicaciones</h4>
              <p className="text-slate-400">Impide que el colaborador pueda eliminar las aplicaciones de trabajo o el agente Centryx DPC.</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">ACTIVADO POR DEFECTO</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#050A14] border border-white/10 space-y-2">
              <h4 className="font-bold text-white">Modo Kiosk Single/Multi App</h4>
              <p className="text-slate-400">Restringe la pantalla de inicio del teléfono únicamente a las aplicaciones fijadas por su grupo.</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">ACTIVADO POR DEFECTO</span>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Pestaña 4: Guía de Inclusión de Teléfonos Móviles */}
      {activeTab === 'onboarding' && (
        <div className="p-8 rounded-3xl bg-[#0D1B2E] border border-white/10 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <QrCode className="w-6 h-6 text-[#2DD4BF]" />
              <span>Flujo de Inclusión de Teléfonos Móviles al Monitoreo</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Siga estos sencillos pasos para vincular cualquier teléfono Android corporativo a su grupo asignado.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#050A14] border border-white/10 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-[#2DD4BF] text-slate-950 font-extrabold flex items-center justify-center text-sm">1</div>
              <h3 className="text-sm font-bold text-white">Toque 6 Veces la Pantalla Inicial</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                En un teléfono Android nuevo o formateado de fábrica, en la primera pantalla de bienvenida "Hola", toque rápidamente 6 veces en cualquier parte blanca.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#050A14] border border-white/10 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-[#2DD4BF] text-slate-950 font-extrabold flex items-center justify-center text-sm">2</div>
              <h3 className="text-sm font-bold text-white">Escanee el Código QR de Enrolamiento</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Se abrirá automáticamente la cámara QR de Android. Escanee el código QR desde la sección <strong>Multi-Tenant & QR</strong>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#050A14] border border-white/10 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-[#2DD4BF] text-slate-950 font-extrabold flex items-center justify-center text-sm">3</div>
              <h3 className="text-sm font-bold text-white">Asigne el Grupo de Trabajo</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El teléfono aparecerá de inmediato en este panel de control. Seleccione <strong>Cambiar Grupo</strong> y aplíquele su política de restricciones.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Grupo */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#2DD4BF]" />
                <span>Crear Nuevo Grupo & Políticas de Apps</span>
              </h3>
              <button onClick={() => setShowGroupModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Grupo</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ej: Grupo Vendedores de Zona Norte"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
                <input
                  type="text"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Ej: Equipos móviles de ventas en campo"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2DD4BF] mb-1">Aplicaciones Permitidas (Separadas por coma)</label>
                <input
                  type="text"
                  value={newGroupAllowedApps}
                  onChange={(e) => setNewGroupAllowedApps(e.target.value)}
                  placeholder="Punto de Venta POS, Waze GPS, Calculadora"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-red-400 mb-1">Aplicaciones Bloqueadas DPC (Separadas por coma)</label>
                <input
                  type="text"
                  value={newGroupBlockedApps}
                  onChange={(e) => setNewGroupBlockedApps(e.target.value)}
                  placeholder="YouTube, TikTok, Facebook, Instagram"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>

              <div className="pt-4 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="w-1/2 py-2.5 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-xl text-xs hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-slate-950 font-bold rounded-xl text-xs hover:opacity-90 transition-all"
                >
                  Guardar Grupo & Aplicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Asignar Grupo a Dispositivo */}
      {showAssignGroupModal && selectedDeviceToAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-[#2DD4BF]" />
                <span>Asignar Grupo a {selectedDeviceToAssign.deviceName}</span>
              </h3>
              <button onClick={() => setShowAssignGroupModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-400">Seleccione el grupo al cual pertenecerá este teléfono corporativo:</p>
              {groups.map(g => (
                <button
                  key={g.id}
                  onClick={() => handleAssignGroupSubmit(g.id)}
                  className="w-full p-4 rounded-2xl bg-[#050A14] border border-white/10 hover:border-[#2DD4BF]/50 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#2DD4BF]">{g.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{g.allowedApps.length} Apps Permitidas</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-slate-600 group-hover:text-[#2DD4BF]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
