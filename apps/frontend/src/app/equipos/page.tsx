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
  Edit3,
  AppWindow,
  Building2,
  GitBranch,
  Layers,
  Sparkles,
  RefreshCw,
  QrCode,
  Download,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'devices' | 'groups' | 'policies' | 'qr'>('devices');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Modales CRUD
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<StaffGroup | null>(null);
  const [showAssignGroupModal, setShowAssignGroupModal] = useState(false);
  const [selectedDeviceToAssign, setSelectedDeviceToAssign] = useState<ManagedDevice | null>(null);

  // Estados de Formulario de Grupo
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupAllowedApps, setNewGroupAllowedApps] = useState('Punto de Venta POS, Waze GPS');
  const [newGroupBlockedApps, setNewGroupBlockedApps] = useState('YouTube, TikTok, Facebook');

  // Grupos y Dispositivos sincronizados con Supabase
  const [groups, setGroups] = useState<StaffGroup[]>([]);
  const [devices, setDevices] = useState<ManagedDevice[]>([]);

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

      // 1. Obtener Grupos reales de Supabase
      const { data: dbGroups } = await supabase.from('staff_groups').select('*');
      if (dbGroups && dbGroups.length > 0) {
        const mappedG: StaffGroup[] = dbGroups.map((g: any) => ({
          id: g.id,
          name: g.name,
          description: g.description || 'Grupo de Trabajo DPC',
          allowedApps: g.allowed_apps ? g.allowed_apps.split(',') : ['Punto de Venta POS', 'Waze'],
          blockedApps: g.blocked_apps ? g.blocked_apps.split(',') : ['YouTube', 'TikTok'],
          deviceCount: 0
        }));
        setGroups(mappedG);
      } else {
        setGroups([]);
      }

      // 2. Obtener Dispositivos reales de Supabase
      const { data: dbDevices } = await supabase.from('devices').select('*');
      if (dbDevices && dbDevices.length > 0) {
        const mappedD: ManagedDevice[] = dbDevices.map((d: any) => ({
          id: d.id,
          deviceName: d.device_name || 'Dispositivo Android',
          imei: d.imei || 'SIN IMEI',
          serialNumber: d.serial_number || 'SN-DEFAULT',
          groupId: d.profile_id || 'g1',
          groupName: d.is_locked ? 'Grupo Bloqueado' : 'Grupo General',
          isLocked: Boolean(d.is_locked),
          batteryLevel: d.battery_level || 100,
          lastPingAt: d.last_ping_at || new Date().toISOString()
        }));
        setDevices(mappedD);
      } else {
        setDevices([]);
      }

    } catch (e) {
      console.error('Error cargando Supabase:', e);
    } finally {
      setLoading(false);
    }
  };

  // Crear o Editar Grupo en Supabase (CRUD Completo)
  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName) return;

    try {
      if (editingGroup) {
        // Actualizar en Supabase
        const { error } = await supabase
          .from('staff_groups')
          .update({
            name: newGroupName,
            description: newGroupDesc
          })
          .eq('id', editingGroup.id);

        if (error) throw error;
        setNotification(`Grupo '${newGroupName}' actualizado exitosamente en Supabase.`);
      } else {
        // Inserción en Supabase
        const { error } = await supabase
          .from('staff_groups')
          .insert({
            name: newGroupName,
            description: newGroupDesc
          });

        if (error) throw error;
        setNotification(`Grupo '${newGroupName}' creado exitosamente en Supabase.`);
      }

      fetchDataFromSupabase();
      setShowGroupModal(false);
      setEditingGroup(null);
      setNewGroupName('');
      setNewGroupDesc('');
    } catch (err: any) {
      setNotification(`Error: ${err.message}`);
    }

    setTimeout(() => setNotification(null), 4000);
  };

  // Eliminar Grupo de Supabase
  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    if (!confirm(`¿Está seguro de eliminar el grupo '${groupName}' de la base de datos?`)) return;

    try {
      const { error } = await supabase.from('staff_groups').delete().eq('id', groupId);
      if (error) throw error;

      setGroups(prev => prev.filter(g => g.id !== groupId));
      setNotification(`Grupo '${groupName}' eliminado exitosamente de Supabase.`);
    } catch (err: any) {
      setNotification(`Error eliminando grupo: ${err.message}`);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  // Eliminar Dispositivo de Supabase
  const handleDeleteDevice = async (deviceId: string, deviceName: string) => {
    if (!confirm(`¿Está seguro de eliminar el teléfono '${deviceName}' de la base de datos?`)) return;

    try {
      const { error } = await supabase.from('devices').delete().eq('id', deviceId);
      if (error) throw error;

      setDevices(prev => prev.filter(d => d.id !== deviceId));
      setNotification(`Teléfono '${deviceName}' eliminado de Supabase.`);
    } catch (err: any) {
      setNotification(`Error eliminando teléfono: ${err.message}`);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAssignGroupSubmit = async (groupId: string) => {
    if (!selectedDeviceToAssign) return;
    const targetGroup = groups.find(g => g.id === groupId);

    try {
      await supabase
        .from('devices')
        .update({ profile_id: groupId })
        .eq('id', selectedDeviceToAssign.id);

      setDevices(prev => prev.map(d => d.id === selectedDeviceToAssign.id ? {
        ...d,
        groupId: groupId,
        groupName: targetGroup ? targetGroup.name : d.groupName
      } : d));

      setNotification(`Dispositivo asignado exitosamente al ${targetGroup?.name}`);
    } catch (e: any) {
      setNotification(`Error: ${e.message}`);
    }

    setShowAssignGroupModal(false);
    setSelectedDeviceToAssign(null);
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
            <h1 className="text-2xl font-bold text-white tracking-tight">Panel de Gestión de Equipos, Grupos &amp; QR DPC</h1>
            <p className="text-xs text-slate-400 mt-0.5">Control Total CRUD (Crear, Editar, Eliminar) sincronizado en tiempo real con Supabase</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              setEditingGroup(null);
              setNewGroupName('');
              setNewGroupDesc('');
              setShowGroupModal(true);
            }}
            className="flex items-center space-x-2 bg-[#101D42] border border-[#2DD4BF]/30 hover:bg-[#2DD4BF] hover:text-slate-950 text-[#2DD4BF] px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Grupo</span>
          </button>

          <button 
            onClick={() => setActiveTab('qr')}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-[#050A14] px-4 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:opacity-90 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Generar Código QR DPC</span>
          </button>
        </div>
      </div>

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
          <span>Políticas de Restricción</span>
        </button>

        <button
          onClick={() => setActiveTab('qr')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'qr' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Generador de Código QR DPC</span>
        </button>
      </div>

      {/* Contenido Pestaña 1: Equipos Registrados */}
      {activeTab === 'devices' && (
        <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Dispositivos Reales en Supabase</h3>
              <p className="text-xs text-slate-400 mt-0.5">Asigne grupo o elimine cualquier equipo de la base de datos</p>
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
                <h4 className="text-sm font-bold text-white">No hay teléfonos registrados en la base de datos Supabase</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Utilice la pestaña <strong>Generador de Código QR DPC</strong> para enrolar su primer teléfono Android.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#050A14] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-6">Dispositivo Móvil</th>
                    <th className="py-3.5 px-6">IMEI / Serial</th>
                    <th className="py-3.5 px-6">Grupo Asignado</th>
                    <th className="py-3.5 px-6 text-right">Acciones (Editar / Eliminar)</th>
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

                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedDeviceToAssign(dev);
                            setShowAssignGroupModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#101D42] text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-slate-950 font-bold transition-all text-xs border border-[#2DD4BF]/30"
                        >
                          Cambiar Grupo
                        </button>

                        <button
                          onClick={() => handleDeleteDevice(dev.id, dev.deviceName)}
                          className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/30"
                          title="Eliminar Dispositivo"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Contenido Pestaña 2: Grupos de Trabajo (Con Editar y Eliminar) */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          {groups.length === 0 ? (
            <div className="p-12 bg-[#0D1B2E] border border-white/10 rounded-3xl text-center space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No hay grupos creados en Supabase</h3>
              <p className="text-xs text-slate-400">Haga clic en <strong>Crear Nuevo Grupo</strong> arriba para agregar su primer departamento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {groups.map((g) => (
                <div key={g.id} className="bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl relative group">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
                      <Users className="w-6 h-6" />
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingGroup(g);
                          setNewGroupName(g.name);
                          setNewGroupDesc(g.description);
                          setShowGroupModal(true);
                        }}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-[#2DD4BF] hover:bg-white/10 transition-all"
                        title="Editar Grupo"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteGroup(g.id, g.name)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        title="Eliminar Grupo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contenido Pestaña 3: Políticas de Restricción */}
      {activeTab === 'policies' && (
        <div className="p-8 rounded-3xl bg-[#0D1B2E] border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 text-[#2DD4BF]">
            <Sliders className="w-6 h-6" />
            <h2 className="text-lg font-bold text-white">Políticas Globales de Restricción DPC</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-[#050A14] border border-white/10 space-y-2">
              <h4 className="font-bold text-white">Bloqueo de Desinstalación del Agente DPC</h4>
              <p className="text-slate-400">Evita desinstalaciones en teléfonos corporativos.</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">ACTIVADO</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#050A14] border border-white/10 space-y-2">
              <h4 className="font-bold text-white">Fijado Kiosk Kiosk Single/Multi App</h4>
              <p className="text-slate-400">Restringe la pantalla a las aplicaciones permitidas por su grupo.</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">ACTIVADO</span>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Pestaña 4: Generador de Código QR DPC Interactivo */}
      {activeTab === 'qr' && (
        <div className="p-8 rounded-3xl bg-[#0D1B2E] border border-white/10 space-y-8 text-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center justify-center space-x-2">
              <QrCode className="w-6 h-6 text-[#2DD4BF]" />
              <span>Generador de Código QR DPC Android Enterprise</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
              Escanee este código QR al encender cualquier teléfono Android nuevo (tras tocar 6 veces la pantalla de bienvenida) para enrolarlo automáticamente en su base de datos.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl w-64 h-64 mx-auto flex flex-col items-center justify-center border-4 border-[#2DD4BF] shadow-[0_0_30px_rgba(45,212,191,0.3)]">
            <QrCode className="w-36 h-36 text-slate-950" />
            <span className="text-slate-950 font-mono text-[10px] font-bold mt-2">CENTRYX MDM DPC PAYLOAD</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#050A14] border border-white/10 max-w-lg mx-auto text-left font-mono text-[11px] text-slate-400 space-y-1">
            <div className="text-emerald-400 font-bold mb-1">Payload JSON de Aprovisionamiento Android:</div>
            <div>"android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME": "io.centryx.mdm/.CentryxDeviceAdminReceiver"</div>
            <div>"android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION": "https://centryk-frontend.vercel.app/apk/centryx-agent.apk"</div>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar Grupo */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#2DD4BF]" />
                <span>{editingGroup ? 'Editar Grupo' : 'Crear Nuevo Grupo'} en Supabase</span>
              </h3>
              <button onClick={() => setShowGroupModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Grupo</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ej: Grupo Vendedores Zona Norte"
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
                  placeholder="Ej: Dispositivos de ventas en campo"
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
                  Guardar en Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Asignar Grupo */}
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
              <p className="text-xs text-slate-400">Seleccione el grupo en Supabase para este teléfono:</p>
              {groups.map(g => (
                <button
                  key={g.id}
                  onClick={() => handleAssignGroupSubmit(g.id)}
                  className="w-full p-4 rounded-2xl bg-[#050A14] border border-white/10 hover:border-[#2DD4BF]/50 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#2DD4BF]">{g.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{g.description}</p>
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
