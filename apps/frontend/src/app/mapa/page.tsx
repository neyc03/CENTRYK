'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Smartphone, 
  Lock, 
  Volume2, 
  RefreshCw, 
  Search, 
  ArrowLeft, 
  ShieldAlert, 
  Battery, 
  Zap,
  Radio,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function LiveMapPage() {
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const mockLocations = [
    { id: '1', name: 'Galaxy Tab A9 (Caja 01)', branch: 'Santo Domingo Central', lat: 18.4861, lng: -69.9312, battery: 94, isOnline: true, isLocked: false, speed: '0 km/h', lastUpdate: 'Hace 5s' },
    { id: '2', name: 'Galaxy A15 (Logística #04)', branch: 'Santiago Norte', lat: 19.4517, lng: -70.6970, battery: 78, isOnline: true, isLocked: false, speed: '45 km/h', lastUpdate: 'Hace 2s' },
    { id: '3', name: 'Nokia G42 (Supervisión)', branch: 'La Vega Central', lat: 19.2200, lng: -70.5290, battery: 45, isOnline: false, isLocked: false, speed: '0 km/h', lastUpdate: 'Hace 4 min' },
    { id: '5', name: 'Galaxy A05 (Entregas #12)', branch: 'Puerto Plata', lat: 19.7934, lng: -70.6884, battery: 12, isOnline: true, isLocked: true, speed: '0 km/h', lastUpdate: 'Hace 10s' },
  ];

  const triggerRemoteLock = (device: any) => {
    setActionSuccessMsg(`Comando BLOQUEO REMOTO enviado con éxito a ${device.name}`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const triggerRemoteSiren = (device: any) => {
    setActionSuccessMsg(`SIRENA DE EMERGENCIA activada por 30s en ${device.name}`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="h-screen bg-[#050A14] text-slate-100 flex flex-col overflow-hidden">
      
      {/* Top Header */}
      <header className="h-16 bg-[#0A1525] border-b border-white/10 px-8 flex items-center justify-between z-20">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-xl bg-[#0D1B2E] border border-white/10 hover:border-[#2DD4BF]/50 text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
              <MapPin className="w-5 h-5 text-[#2DD4BF] mr-2" />
              Mapa & Tracking GPS en Tiempo Real
            </h1>
            <p className="text-xs text-slate-400">Streaming continuo vía WebSockets & Redis PubSub.</p>
          </div>
        </div>

        {actionSuccessMsg && (
          <div className="flex items-center space-x-2 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] px-4 py-2 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <span className="flex items-center text-xs text-[#10B981] font-mono font-medium">
            <Radio className="w-4 h-4 mr-1.5 animate-pulse-dot" /> Live WebSockets
          </span>
        </div>
      </header>

      {/* Main Grid View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Devices Sidebar */}
        <div className="w-80 bg-[#0A1525] border-r border-white/10 flex flex-col p-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Buscar en mapa..." 
              className="bg-[#050A14] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]/50 w-full"
            />
          </div>

          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-1">Dispositivos en Tránsito (4)</p>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {mockLocations.map((loc) => (
              <div 
                key={loc.id} 
                onClick={() => setSelectedDevice(loc)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${selectedDevice?.id === loc.id ? 'bg-[#101D42] border-[#2DD4BF]/50 shadow-[0_0_20px_rgba(45,212,191,0.15)]' : 'bg-[#0D1B2E] border-white/10 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-white truncate max-w-[170px]">{loc.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${loc.isOnline ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-slate-700 text-slate-400'}`}>
                    {loc.isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-1">{loc.branch}</p>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-[#2DD4BF]">{loc.speed}</span>
                  <span className="flex items-center"><Battery className="w-3 h-3 mr-1" />{loc.battery}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Simulation Container */}
        <div className="flex-1 relative bg-[#050A14] overflow-hidden flex items-center justify-center">
          
          {/* Futuristic Map Grid Simulation Background */}
          <div className="absolute inset-0 bg-portal-grid opacity-30 bg-grid" />
          
          {/* Simulated Map Markers */}
          <div className="relative w-full h-full p-12">
            
            {/* Map Canvas Visual Mockup */}
            <div className="w-full h-full rounded-2xl border border-white/10 bg-[#0A1525]/40 backdrop-blur relative overflow-hidden flex items-center justify-center">
              
              {/* Decorative Map Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#2DD4BF_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />

              <div className="text-center space-y-3 z-10">
                <Navigation className="w-12 h-12 text-[#2DD4BF] mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-white tracking-wider">MAPA INTERACTIVO CENTRYX LIVE</h3>
                <p className="text-xs text-slate-400 max-w-sm">Monitoreando coordenadas GPS en tiempo real de 500 dispositivos Android distribuidos entre 3 empresas.</p>
              </div>

              {/* Simulated Device Pins on Map */}
              {mockLocations.map((loc, idx) => (
                <div 
                  key={loc.id}
                  onClick={() => setSelectedDevice(loc)}
                  style={{ top: `${25 + idx * 18}%`, left: `${30 + idx * 15}%` }}
                  className="absolute cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#101D42] border-2 border-[#2DD4BF] shadow-[0_0_20px_rgba(45,212,191,0.5)] flex items-center justify-center group-hover:scale-125 transition-transform">
                      <Smartphone className="w-4 h-4 text-[#2DD4BF]" />
                    </div>
                    {loc.isOnline && <div className="absolute w-10 h-10 rounded-full bg-[#10B981]/30 animate-ping" />}
                  </div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-[#0D1B2E] text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10 whitespace-nowrap shadow-lg">
                    {loc.name}
                  </div>
                </div>
              ))}

            </div>

          </div>

          {/* Selected Device Floating Remote Control Panel */}
          {selectedDevice && (
            <div className="absolute bottom-8 right-8 w-96 centryx-card p-6 space-y-4 shadow-[0_0_60px_rgba(0,0,0,0.8)] z-30 animate-in slide-in-from-bottom duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-bold text-white">{selectedDevice.name}</h4>
                  <p className="text-xs text-[#2DD4BF] font-mono">{selectedDevice.branch}</p>
                </div>
                <button onClick={() => setSelectedDevice(null)} className="text-slate-400 hover:text-white text-xs">Cerrar</button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-[#050A14] p-3 rounded-xl border border-white/10">
                <div>
                  <p className="text-slate-500">Velocidad</p>
                  <p className="font-bold text-white font-mono mt-0.5">{selectedDevice.speed}</p>
                </div>
                <div>
                  <p className="text-slate-500">Batería</p>
                  <p className="font-bold text-[#10B981] font-mono mt-0.5">{selectedDevice.battery}%</p>
                </div>
              </div>

              {/* Remote Actions */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <p className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Acciones de Comando Remoto en Vivo:</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => triggerRemoteLock(selectedDevice)}
                    className="flex items-center justify-center space-x-2 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Bloqueo Total</span>
                  </button>

                  <button 
                    onClick={() => triggerRemoteSiren(selectedDevice)}
                    className="flex items-center justify-center space-x-2 bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/40 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Sonar Sirena</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
