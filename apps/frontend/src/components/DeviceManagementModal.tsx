'use client';

import React, { useState } from 'react';
import { 
  Smartphone, 
  Lock, 
  Unlock, 
  Volume2, 
  MapPin, 
  Battery, 
  Activity, 
  ShieldAlert, 
  Sliders, 
  Trash2, 
  X, 
  CheckCircle2, 
  RefreshCw,
  AppWindow
} from 'lucide-react';

export interface Device {
  id: string;
  name: string;
  serial: string;
  imei?: string;
  company: string;
  branch: string;
  status: 'online' | 'warning' | 'locked' | 'offline';
  battery: number;
  app: string;
  focusIndex: number;
  locked: boolean;
  model?: string;
  androidVersion?: string;
  lastPing?: string;
}

interface DeviceManagementModalProps {
  device: Device | null;
  onClose: () => void;
  onUpdateDevice: (updated: Device) => void;
}

export function DeviceManagementModal({ device, onClose, onUpdateDevice }: DeviceManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'control' | 'telemetry' | 'apps'>('control');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  if (!device) return null;

  const triggerRemoteCommand = (commandName: string, actionLogic: () => void) => {
    setActionLoading(commandName);
    setTimeout(() => {
      actionLogic();
      setActionLoading(null);
      setNotification(`Comando DPC enviado exitosamente: ${commandName}`);
      setTimeout(() => setNotification(null), 3500);
    }, 900);
  };

  const handleToggleLock = () => {
    triggerRemoteCommand(device.locked ? 'Desbloqueo Remoto' : 'Bloqueo Inmediato DPC', () => {
      onUpdateDevice({
        ...device,
        locked: !device.locked,
        status: !device.locked ? 'locked' : 'online',
        app: !device.locked ? 'Sistema Bloqueado' : 'Punto de Venta POS'
      });
    });
  };

  const handleTriggerSiren = () => {
    triggerRemoteCommand('Alarma Sonora de Seguridad (Sirena 100dB)', () => {});
  };

  const handleRefreshGps = () => {
    triggerRemoteCommand('Actualizar Coordenadas GPS en Vivo', () => {});
  };

  const handleRemoteWipe = () => {
    if (confirm(`⚠️ ¿ESTÁ SEGURO DE REALIZAR EL BORRADO REMOTO (WIPE)? Esto eliminará todos los datos corporativos del equipo ${device.name}.`)) {
      triggerRemoteCommand('Borrado de Fábrica Remoto (Factory Reset)', () => {
        onUpdateDevice({
          ...device,
          status: 'offline',
          locked: true,
          app: 'Dispositivo Formateado'
        });
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0D1B2E] border border-white/10 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header con Nombre del Dispositivo y Estado */}
        <div className="p-6 bg-[#0A1525] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl border ${
              device.locked 
                ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                : device.status === 'warning'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>{device.name}</span>
                {device.locked && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                    BLOQUEADO
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Serial: {device.serial} • IMEI: {device.imei || '358992109281201'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notificación Flotante de Comando DPC */}
        {notification && (
          <div className="bg-[#2DD4BF]/10 border-b border-[#2DD4BF]/30 px-6 py-2.5 flex items-center space-x-3 text-[#2DD4BF] text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#050A14] px-6">
          <button
            onClick={() => setActiveTab('control')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'control'
                ? 'border-[#2DD4BF] text-[#2DD4BF]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Comandos de Control Remoto</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'telemetry'
                ? 'border-[#2DD4BF] text-[#2DD4BF]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Telemetría en Vivo & Batería</span>
          </button>

          <button
            onClick={() => setActiveTab('apps')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'apps'
                ? 'border-[#2DD4BF] text-[#2DD4BF]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <AppWindow className="w-4 h-4" />
            <span>Aplicaciones & Políticas</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {activeTab === 'control' && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Acciones Inmediatas sobre el Agente Android (Device Owner)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Botón Bloqueo / Desbloqueo Remoto */}
                <button
                  onClick={handleToggleLock}
                  disabled={actionLoading !== null}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start space-x-4 ${
                    device.locked
                      ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${device.locked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {device.locked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {device.locked ? 'Desbloquear Dispositivo' : 'Bloqueo Inmediato DPC'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {device.locked ? 'Restablecer acceso al usuario' : 'Bloquea pantalla con PIN Kiosk'}
                    </p>
                  </div>
                </button>

                {/* Botón Disparar Sirena */}
                <button
                  onClick={handleTriggerSiren}
                  disabled={actionLoading !== null}
                  className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-left transition-all flex items-start space-x-4"
                >
                  <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Activar Sirena Remota</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Emite alarma de 100dB aun en modo silencio
                    </p>
                  </div>
                </button>

                {/* Botón Refresh GPS */}
                <button
                  onClick={handleRefreshGps}
                  disabled={actionLoading !== null}
                  className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-left transition-all flex items-start space-x-4"
                >
                  <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Forzar Ubiación GPS</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Solicita ping GPS de alta precisión (&lt;5m)
                    </p>
                  </div>
                </button>

                {/* Botón Factory Wipe */}
                <button
                  onClick={handleRemoteWipe}
                  disabled={actionLoading !== null}
                  className="p-4 rounded-2xl bg-slate-900 border border-red-500/20 hover:border-red-500/50 text-left transition-all flex items-start space-x-4"
                >
                  <div className="p-3 rounded-xl bg-red-950 text-red-500">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-400">Borrado Remoto (Wipe)</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Formateo de fábrica y borrado de almacenamiento
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#050A14] border border-white/10">
                <div className="text-xs text-slate-400 font-semibold mb-1">Índice de Foco Actual</div>
                <div className="text-3xl font-extrabold text-[#2DD4BF] font-mono">{device.focusIndex}/100</div>
                <div className="w-full bg-white/10 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#2DD4BF] h-full" style={{ width: `${device.focusIndex}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#050A14] border border-white/10">
                <div className="text-xs text-slate-400 font-semibold mb-1">Nivel de Batería</div>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono flex items-center space-x-2">
                  <Battery className="w-7 h-7 text-emerald-400" />
                  <span>{device.battery}%</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">Cargando vía USB-C • 24°C</div>
              </div>

              <div className="col-span-2 p-4 rounded-2xl bg-[#050A14] border border-white/10">
                <div className="text-xs text-slate-400 font-semibold mb-2">Aplicación en Primer Plano</div>
                <div className="text-sm font-bold text-white flex items-center space-x-2">
                  <AppWindow className="w-4 h-4 text-[#2DD4BF]" />
                  <span>{device.app}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apps' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400">Perfil de Aplicaciones Permitidas</h4>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#050A14] border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs text-white font-medium">Punto de Venta POS Corporativo</span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md font-semibold">PERMITIDO</span>
                </div>
                <div className="p-3 rounded-xl bg-[#050A14] border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs text-white font-medium">Waze / Google Maps GPS</span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md font-semibold">PERMITIDO</span>
                </div>
                <div className="p-3 rounded-xl bg-[#050A14] border border-red-500/20 flex items-center justify-between">
                  <span className="text-xs text-white font-medium">YouTube / TikTok / Redes Sociales</span>
                  <span className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded-md font-semibold">BLOQUEADO DPC</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0A1525] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Organización: <strong className="text-white">{device.company}</strong></span>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
          >
            Cerrar Ventana
          </button>
        </div>

      </div>
    </div>
  );
}
