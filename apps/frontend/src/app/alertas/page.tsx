'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  Search, 
  MapPin, 
  Clock, 
  Smartphone,
  EyeOff,
  BellOff
} from 'lucide-react';
import Link from 'next/link';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([
    {
      id: 'alt-1',
      device: 'Nokia G42 (Supervisión)',
      serial: 'SN-77301-C',
      company: 'Empresa Corporativa SRL',
      branch: 'La Vega Central',
      severity: 'high',
      type: 'unauthorized_app',
      title: 'Uso de Aplicación No Permitida (YouTube)',
      desc: 'El dispositivo ha registrado 45 minutos de reproducción de video en YouTube en horario de supervisión.',
      time: 'Hace 15 minutos',
      resolved: false,
    },
    {
      id: 'alt-2',
      device: 'Galaxy A05 (Entregas #12)',
      serial: 'SN-55210-E',
      company: 'Logística & Transporte Central',
      branch: 'Puerto Plata Hub',
      severity: 'critical',
      type: 'geofence_violation',
      title: 'Desvío de Geocerca de Ruta',
      desc: 'El vehículo salió del radio permitido de la sucursal de Puerto Plata sin orden de despacho asignada.',
      time: 'Hace 45 minutos',
      resolved: false,
    },
    {
      id: 'alt-3',
      device: 'Galaxy Tab A9 (Caja 03)',
      serial: 'SN-99823-F',
      company: 'Empresa Corporativa SRL',
      branch: 'Santo Domingo Central',
      severity: 'medium',
      type: 'off_hours_activity',
      title: 'Actividad de Pantalla Fuera de Horario',
      desc: 'Encendido de pantalla y desbloqueo registrado a las 11:45 PM.',
      time: 'Hace 6 horas',
      resolved: true,
    },
  ]);

  const resolveAlert = (id: string) => {
    setAlerts(alerts.map((a) => a.id === id ? { ...a, resolved: true } : a));
  };

  return (
    <div className="min-h-screen bg-[#050A14] text-slate-100 p-8 space-y-8">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-xl bg-[#0D1B2E] border border-white/10 hover:border-[#2DD4BF]/50 text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
              <ShieldAlert className="w-6 h-6 text-[#F97316] mr-2.5" />
              Centro de Alertas & Anomalías de Seguridad
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Detección automática de apps no permitidas, salidas de geocerca y actividades sospechosas.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-bold font-mono">
            {alerts.filter(a => !a.resolved).length} Alertas Activas
          </span>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4 max-w-5xl mx-auto">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`centryx-card p-6 border transition-all ${alert.resolved ? 'opacity-50 border-white/5' : alert.severity === 'critical' ? 'border-[#EF4444]/40 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : alert.severity === 'high' ? 'border-[#F97316]/40' : 'border-white/10'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl border ${alert.severity === 'critical' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30' : alert.severity === 'high' ? 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30' : 'bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/30'}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-bold text-white">{alert.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${alert.severity === 'critical' ? 'bg-[#EF4444]/20 text-[#EF4444]' : alert.severity === 'high' ? 'bg-[#F97316]/20 text-[#F97316]' : 'bg-[#FACC15]/20 text-[#FACC15]'}`}>
                      Severidad {alert.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{alert.desc}</p>

                  <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-2 font-mono">
                    <span className="flex items-center text-[#2DD4BF]"><Smartphone className="w-3.5 h-3.5 mr-1" />{alert.device}</span>
                    <span>•</span>
                    <span>{alert.company} ({alert.branch})</span>
                    <span>•</span>
                    <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{alert.time}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {!alert.resolved ? (
                  <>
                    <button 
                      onClick={() => resolveAlert(alert.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/20 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Marcar Resuelta</span>
                    </button>

                    <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/20 text-xs font-semibold transition-all cursor-pointer">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Bloquear Equipo</span>
                    </button>
                  </>
                ) : (
                  <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-semibold flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#10B981]" /> Resuelta
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
