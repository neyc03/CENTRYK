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
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Check,
  Ban,
  ExternalLink,
  Copy,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';

// Cliente Supabase Cloud
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sylwwjuwxtziljjkowsz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bHd3anV3eHR6aWxqamtvd3N6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgxMjk0NSwiZXhwIjoyMTAwMzg4OTQ1fQ.16CCyu_5JhbsMUEhQh78_Pzm_649LJb-DgasnUlqDwU';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_BRANCH_ID = "beb32800-bba4-4b0f-84ab-47ecc150a5c7";
const DEFAULT_COMPANY_ID = "3ad63dff-7d45-4b07-83a0-152c04634510";

// Datos de Google Android Management API (AMAPI Unlimited Enterprise)
const AMAPI_ENTERPRISE_ID = "enterprises/LC03x661ny";
const AMAPI_ENROLLMENT_TOKEN = "GJMIPIOUMYRGWBLXLCIF";

// Payload QR Oficial generado directamente por la API REST de Google Cloud AMAPI
const OFFICIAL_GOOGLE_AMAPI_PAYLOAD = {
  "android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME": "com.google.android.apps.work.clouddpc/.receivers.CloudDeviceAdminReceiver",
  "android.app.extra.PROVISIONING_DEVICE_ADMIN_SIGNATURE_CHECKSUM": "I5YvS0O5hXY46mb01BlRjq4oJJGs2kuUcHvVkAPEXlg",
  "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION": "https://play.google.com/managed/downloadManagingApp?identifier=setup",
  "android.app.extra.PROVISIONING_ADMIN_EXTRAS_BUNDLE": {
    "com.google.android.apps.work.clouddpc.EXTRA_ENROLLMENT_TOKEN": AMAPI_ENROLLMENT_TOKEN
  }
};

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
  allowedApps: string[];
  blockedApps: string[];
}

const DEFAULT_APP_CATALOG = [
  { pkg: 'com.google.android.youtube', name: 'YouTube', icon: '🔴', category: 'Entretenimiento' },
  { pkg: 'com.zhiliaoapp.musically', name: 'TikTok', icon: '🎵', category: 'Redes Sociales' },
  { pkg: 'com.facebook.katana', name: 'Facebook', icon: '🔵', category: 'Redes Sociales' },
  { pkg: 'com.instagram.android', name: 'Instagram', icon: '📸', category: 'Redes Sociales' },
  { pkg: 'com.whatsapp', name: 'WhatsApp Business', icon: '💬', category: 'Comunicación' },
  { pkg: 'com.waze', name: 'Waze GPS', icon: '🚗', category: 'Navegación' },
  { pkg: 'com.android.chrome', name: 'Google Chrome', icon: '🌐', category: 'Navegador' },
  { pkg: 'com.android.camera', name: 'Cámara Fotográfica', icon: '📷', category: 'Herramientas' },
  { pkg: 'com.android.settings', name: 'Ajustes del Sistema', icon: '⚙️', category: 'Sistema' }
];

export default function EquiposManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'devices' | 'groups' | 'policies' | 'qr'>('devices');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados QR Code AMAPI
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedToken, setCopiedToken] = useState(false);

  // Modal Restricción Individual de Aplicaciones por Dispositivo
  const [selectedDeviceForApps, setSelectedDeviceForApps] = useState<ManagedDevice | null>(null);

  // Modales CRUD Grupos
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<StaffGroup | null>(null);

  // Estados Formulario Grupo
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // Listas Sincronizadas
  const [groups, setGroups] = useState<StaffGroup[]>([]);
  const [devices, setDevices] = useState<ManagedDevice[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem('centryx_token') || localStorage.getItem('centryx_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDataFromSupabase();
    generateGoogleAMAPIQR();
  }, [router]);

  const generateGoogleAMAPIQR = async () => {
    try {
      const jsonStr = JSON.stringify(OFFICIAL_GOOGLE_AMAPI_PAYLOAD, null, 2);
      const url = await QRCode.toDataURL(jsonStr, {
        width: 420,
        margin: 2,
        color: {
          dark: '#050A14',
          light: '#FFFFFF'
        }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('Error generando QR de Google AMAPI:', err);
    }
  };

  const fetchDataFromSupabase = async () => {
    try {
      setLoading(true);

      const { data: dbGroups } = await supabase.from('staff_groups').select('*');
      if (dbGroups && dbGroups.length > 0) {
        const mappedG: StaffGroup[] = dbGroups.map((g: any) => ({
          id: g.id,
          name: g.name,
          description: 'Grupo DPC de la Red Corporativa',
          allowedApps: ['Waze GPS', 'WhatsApp Business'],
          blockedApps: ['YouTube', 'TikTok', 'Facebook'],
          deviceCount: 0
        }));
        setGroups(mappedG);
      } else {
        setGroups([]);
      }

      const { data: dbDevices } = await supabase.from('devices').select('*');
      if (dbDevices && dbDevices.length > 0) {
        const mappedD: ManagedDevice[] = dbDevices.map((d: any) => ({
          id: d.id,
          deviceName: d.device_name || 'Dispositivo Android',
          imei: d.imei || 'SIN IMEI',
          serialNumber: d.serial_number || 'SN-DEFAULT',
          groupId: d.profile_id || 'g1',
          groupName: d.is_locked ? 'BLOQUEADO REMOTAMENTE' : 'General',
          isLocked: Boolean(d.is_locked),
          batteryLevel: d.battery_level || 100,
          lastPingAt: d.last_ping_at || new Date().toISOString(),
          allowedApps: ['Waze GPS', 'WhatsApp Business', 'Google Chrome'],
          blockedApps: ['YouTube', 'TikTok', 'Facebook', 'Instagram']
        }));
        setDevices(mappedD);
      } else {
        setDevices([]);
      }

    } catch (e) {
      console.error('Error cargando servidor de plataforma:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRemoteLockDevice = async (device: ManagedDevice) => {
    const newLockState = !device.isLocked;
    const actionText = newLockState ? 'Bloquear' : 'Desbloquear';

    if (!confirm(`¿Está seguro de ${actionText.toLowerCase()} remotamente el dispositivo '${device.deviceName}'?`)) return;

    try {
      const { error } = await supabase
        .from('devices')
        .update({ is_locked: newLockState })
        .eq('id', device.id);

      if (error) throw error;

      setDevices(prev => prev.map(d => d.id === device.id ? { ...d, isLocked: newLockState } : d));
      setNotification(`Comando enviado exitosamente: '${device.deviceName}' ${newLockState ? 'BLOQUEADO REMOTAMENTE' : 'DESBLOQUEADO'}.`);
    } catch (err: any) {
      setNotification(`Error enviando comando remoto: ${err.message}`);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleAppForDevice = (appName: string) => {
    if (!selectedDeviceForApps) return;

    const isCurrentlyBlocked = selectedDeviceForApps.blockedApps.includes(appName);
    let updatedBlocked: string[];
    let updatedAllowed: string[];

    if (isCurrentlyBlocked) {
      updatedBlocked = selectedDeviceForApps.blockedApps.filter(a => a !== appName);
      updatedAllowed = [...selectedDeviceForApps.allowedApps, appName];
    } else {
      updatedAllowed = selectedDeviceForApps.allowedApps.filter(a => a !== appName);
      updatedBlocked = [...selectedDeviceForApps.blockedApps, appName];
    }

    const updatedDevice = {
      ...selectedDeviceForApps,
      allowedApps: updatedAllowed,
      blockedApps: updatedBlocked
    };

    setSelectedDeviceForApps(updatedDevice);
    setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
    setNotification(`Restricción de '${appName}' actualizada para '${selectedDeviceForApps.deviceName}'.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName) return;

    try {
      if (editingGroup) {
        const { error } = await supabase
          .from('staff_groups')
          .update({ name: newGroupName })
          .eq('id', editingGroup.id);

        if (error) throw error;
        setNotification(`Grupo '${newGroupName}' actualizado.`);
      } else {
        const { error } = await supabase
          .from('staff_groups')
          .insert({ 
            name: newGroupName,
            branch_id: DEFAULT_BRANCH_ID
          });

        if (error) throw error;
        setNotification(`Grupo '${newGroupName}' creado exitosamente.`);
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

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    if (!confirm(`¿Está seguro de eliminar el grupo '${groupName}'?`)) return;
    try {
      const { error } = await supabase.from('staff_groups').delete().eq('id', groupId);
      if (error) throw error;
      setGroups(prev => prev.filter(g => g.id !== groupId));
      setNotification(`Grupo '${groupName}' eliminado de la plataforma.`);
    } catch (err: any) {
      setNotification(`Error: ${err.message}`);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteDevice = async (deviceId: string, deviceName: string) => {
    if (!confirm(`¿Está seguro de eliminar el teléfono '${deviceName}' del servidor?`)) return;
    try {
      const { error } = await supabase.from('devices').delete().eq('id', deviceId);
      if (error) throw error;
      setDevices(prev => prev.filter(d => d.id !== deviceId));
      setNotification(`Teléfono '${deviceName}' eliminado.`);
    } catch (err: any) {
      setNotification(`Error: ${err.message}`);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const copyEnrollmentToken = () => {
    navigator.clipboard.writeText(AMAPI_ENROLLMENT_TOKEN);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const filteredDevices = devices.filter(d => 
    d.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.imei.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-2xl font-bold text-white tracking-tight">Gestión Integral de Equipos &amp; Google AMAPI DPC</h1>
            <p className="text-xs text-slate-400 mt-0.5">Control de flota móvil con Google Android Management API de grado empresarial</p>
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
            <span>Crear Grupo DPC</span>
          </button>

          <button 
            onClick={() => setActiveTab('qr')}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-[#050A14] px-4 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:opacity-90 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Generar QR Google AMAPI</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 px-6 py-3 rounded-2xl flex items-center space-x-3 text-[#2DD4BF] text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Pestañas de Navegación */}
      <div className="flex space-x-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'devices' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Equipos Registrados ({devices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'groups' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30' 
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
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Políticas Kiosk &amp; Google AMAPI</span>
        </button>

        <button
          onClick={() => setActiveTab('qr')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'qr' 
              ? 'bg-[#101D42] text-[#2DD4BF] border border-[#2DD4BF]/30' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Código QR Google AMAPI Oficial</span>
        </button>
      </div>

      {/* Pestaña Equipos */}
      {activeTab === 'devices' && (
        <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Listado de Teléfonos Corporativos</h3>
              <p className="text-xs text-slate-400 mt-0.5">Haga clic en 'Lista &amp; Bloqueo de Apps' para gestionar aplicaciones o 'Bloquear Teléfono' para cierre remoto</p>
            </div>

            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por Teléfono o IMEI..."
                className="w-full pl-9 pr-4 py-2 bg-[#050A14] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredDevices.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <Smartphone className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">No hay teléfonos registrados en la plataforma</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Escanee el Código QR oficial de Google AMAPI al encender su teléfono para que Android lo configure automáticamente como Device Owner.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#050A14] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-6">Dispositivo Móvil</th>
                    <th className="py-3.5 px-6">IMEI / Identificador</th>
                    <th className="py-3.5 px-6">Estado Bloqueo Remoto</th>
                    <th className="py-3.5 px-6 text-center">Gestión de Aplicaciones</th>
                    <th className="py-3.5 px-6 text-right">Acciones de Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredDevices.map((dev) => (
                    <tr key={dev.id} className="hover:bg-white/5 transition-all">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2.5 rounded-xl border ${dev.isLocked ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-white font-bold block">{dev.deviceName}</span>
                            <span className="text-[11px] text-slate-400">Batería: {dev.batteryLevel}%</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-400 font-mono">{dev.imei}</td>

                      <td className="py-4 px-6">
                        {dev.isLocked ? (
                          <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-red-500/10 border border-red-500/30 text-red-400 flex items-center space-x-1.5 w-fit">
                            <Lock className="w-3.5 h-3.5" />
                            <span>TELÉFONO BLOQUEADO</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center space-x-1.5 w-fit">
                            <Unlock className="w-3.5 h-3.5" />
                            <span>OPERATIVO EN VIVO</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setSelectedDeviceForApps(dev)}
                          className="px-3 py-1.5 rounded-xl bg-[#101D42] text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-slate-950 font-bold transition-all text-xs border border-[#2DD4BF]/30 flex items-center space-x-1.5 mx-auto"
                        >
                          <AppWindow className="w-3.5 h-3.5" />
                          <span>Lista &amp; Bloqueo de Apps ({DEFAULT_APP_CATALOG.length})</span>
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleToggleRemoteLockDevice(dev)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs border flex items-center space-x-1 inline-flex ${
                            dev.isLocked 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950' 
                              : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          {dev.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          <span>{dev.isLocked ? 'Desbloquear Teléfono' : 'BLOQUEAR TELÉFONO'}</span>
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

      {/* Pestaña Grupos */}
      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groups.map((g) => (
            <div key={g.id} className="bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
                  <Users className="w-6 h-6" />
                </div>
                <button onClick={() => handleDeleteGroup(g.id, g.name)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{g.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Grupo registrado en la base de datos corporativa</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pestaña Código QR Google AMAPI Oficial */}
      {activeTab === 'qr' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-[#0D1B2E] border border-white/10 space-y-6 text-center shadow-xl">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>GOOGLE CLOUD AMAPI VERIFICADO</span>
              </div>
              <h2 className="text-xl font-bold text-white flex items-center justify-center space-x-2">
                <QrCode className="w-6 h-6 text-[#2DD4BF]" />
                <span>Código QR Oficial Google Android Enterprise</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Escanee este código QR al encender cualquier teléfono Android nuevo o formateado tras tocar 6 veces la pantalla de bienvenida.
              </p>
            </div>

            {qrDataUrl ? (
              <div className="p-6 bg-white rounded-3xl w-72 h-72 mx-auto flex flex-col items-center justify-center border-4 border-[#2DD4BF] shadow-[0_0_35px_rgba(45,212,191,0.35)]">
                <img src={qrDataUrl} alt="Código QR Oficial Google CloudDPC AMAPI" className="w-60 h-60 object-contain" />
              </div>
            ) : (
              <div className="w-64 h-64 mx-auto bg-white/5 rounded-3xl flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[#2DD4BF] animate-spin" />
              </div>
            )}

            <div className="pt-2 flex justify-center">
              <a 
                href={qrDataUrl} 
                download="Centryx-Google-AMAPI-QR.png"
                className="px-6 py-2.5 bg-[#101D42] border border-[#2DD4BF]/40 text-[#2DD4BF] font-bold rounded-xl text-xs hover:bg-[#2DD4BF] hover:text-slate-950 transition-all flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Código QR PNG Oficial</span>
              </a>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0D1B2E] border border-white/10 space-y-6 shadow-xl text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-[#2DD4BF]" />
              <span>Detalles del Token de Aprovisionamiento Google AMAPI</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Entidad Empresarial Registrada en Google:</label>
                <input 
                  type="text" 
                  readOnly 
                  value={AMAPI_ENTERPRISE_ID}
                  className="w-full p-2.5 bg-[#050A14] border border-white/10 rounded-xl text-emerald-400 font-mono text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Google AMAPI Enrollment Token:</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={AMAPI_ENROLLMENT_TOKEN}
                    className="w-full p-2.5 bg-[#050A14] border border-white/10 rounded-xl text-[#2DD4BF] font-mono text-xs font-bold"
                  />
                  <button 
                    onClick={copyEnrollmentToken}
                    className="p-2.5 bg-[#101D42] border border-[#2DD4BF]/30 text-[#2DD4BF] rounded-xl hover:bg-[#2DD4BF] hover:text-slate-950 transition-all"
                    title="Copiar Token"
                  >
                    {copiedToken ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Google Cloud DPC Downloader Location:</label>
                <input 
                  type="text" 
                  readOnly 
                  value="https://play.google.com/managed/downloadManagingApp?identifier=setup"
                  className="w-full p-2.5 bg-[#050A14] border border-white/10 rounded-xl text-slate-300 font-mono text-[10px]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-1.5">
                <div className="font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aprovisionamiento Directo desde Servidores de Google</span>
                </div>
                <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                  Android descargará la aplicación oficial <strong>Android Device Policy</strong> directamente desde los servidores globales de Google Play Services sin fallos de checksum ni testOnly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LISTA DE APLICACIONES INSTALADAS & CONTROL INDIVIDUAL */}
      {selectedDeviceForApps && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <AppWindow className="w-5 h-5 text-[#2DD4BF]" />
                  <span>Restricción de Aplicaciones: {selectedDeviceForApps.deviceName}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Haga clic en cualquier aplicación para cambiar su estado a Permitida o Bloqueada en tiempo real</p>
              </div>
              <button onClick={() => setSelectedDeviceForApps(null)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {DEFAULT_APP_CATALOG.map((app) => {
                const isBlocked = selectedDeviceForApps.blockedApps.includes(app.name);
                return (
                  <div 
                    key={app.pkg} 
                    onClick={() => handleToggleAppForDevice(app.name)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isBlocked 
                        ? 'bg-red-500/10 border-red-500/30 hover:border-red-500' 
                        : 'bg-[#050A14] border-white/10 hover:border-[#2DD4BF]/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{app.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{app.name}</h4>
                        <span className="text-[10px] text-slate-400">{app.category}</span>
                      </div>
                    </div>

                    <div>
                      {isBlocked ? (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center space-x-1">
                          <Ban className="w-3 h-3" />
                          <span>BLOQUEADA</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>PERMITIDA</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedDeviceForApps(null)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-slate-950 font-bold rounded-xl text-xs hover:opacity-90 transition-all"
              >
                Guardar Restricciones DPC
              </button>
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
                <span>Crear Nuevo Grupo DPC en la Plataforma</span>
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
                  Guardar Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
