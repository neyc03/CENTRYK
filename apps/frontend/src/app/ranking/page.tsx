'use client';

import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  TrendingUp, 
  Building2, 
  GitBranch, 
  Users, 
  ArrowLeft, 
  Search, 
  Flame, 
  CheckCircle2, 
  Smartphone,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function RankingPage() {
  const [selectedCompany, setSelectedCompany] = useState('Invernandez Group');

  const mockRanking = [
    { rank: 1, name: 'Galaxy Tab A9 (Caja 02)', user: 'Ana María Gómez (Cajera)', company: 'Invernandez SRL', branch: 'Santo Domingo Central', score: 99, productiveHrs: '7h 12m', unproductiveHrs: '0m', badge: 'gold' },
    { rank: 2, name: 'Galaxy Tab A9 (Caja 01)', user: 'Carlos Ramos (Cajero)', company: 'Invernandez SRL', branch: 'Santo Domingo Central', score: 98, productiveHrs: '7h 05m', unproductiveHrs: '2m', badge: 'gold' },
    { rank: 3, name: 'Galaxy A15 (Logística #04)', user: 'José Luis Reyes (Chofer)', company: 'Logística Central', branch: 'Santiago Norte', score: 94, productiveHrs: '6h 40m', unproductiveHrs: '5m', badge: 'silver' },
    { rank: 4, name: 'Galaxy Tab A9 (Caja 04)', user: 'Laura Martínez (Cajera)', company: 'Invernandez SRL', branch: 'Santiago Norte', score: 92, productiveHrs: '6h 30m', unproductiveHrs: '10m', badge: 'silver' },
    { rank: 5, name: 'Galaxy A05 (Entregas #08)', user: 'Pedro Vargas (Despacho)', company: 'Logística Central', branch: 'Puerto Plata', score: 89, productiveHrs: '6h 10m', unproductiveHrs: '18m', badge: 'bronze' },
    { rank: 6, name: 'Nokia G42 (Supervisión)', user: 'Roberto Díaz (Supervisor)', company: 'Invernandez SRL', branch: 'La Vega Central', score: 62, productiveHrs: '3h 30m', unproductiveHrs: '1h 30m', badge: 'needs_improvement' },
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
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
              <Trophy className="w-6 h-6 text-[#FACC15] mr-2.5" />
              Listado de Honor — Índice de Foco Diario
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Ranking de productividad comparando uso real vs perfiles esperados por equipo.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-[#0D1B2E] border border-white/10 rounded-xl px-4 py-2 text-xs">
          <Building2 className="w-4 h-4 text-[#2DD4BF]" />
          <select className="bg-transparent text-white font-medium focus:outline-none cursor-pointer">
            <option className="bg-[#0D1B2E]">Todas las Empresas (3)</option>
            <option className="bg-[#0D1B2E]">Invernandez Group SRL</option>
            <option className="bg-[#0D1B2E]">Logística Central</option>
          </select>
        </div>
      </div>

      {/* Top Podiums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top 2: Silver */}
        <div className="centryx-card p-6 relative overflow-hidden border-[#3B82F6]/30">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/40 flex items-center justify-center font-bold text-[#3B82F6]">
              #2
            </div>
            <Award className="w-8 h-8 text-slate-300" />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold text-white">{mockRanking[1].name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{mockRanking[1].user}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-mono">Índice de Foco</p>
              <p className="text-2xl font-bold text-[#3B82F6]">{mockRanking[1].score}%</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">{mockRanking[1].productiveHrs}</span>
          </div>
        </div>

        {/* Top 1: Gold Winner */}
        <div className="centryx-card p-6 relative overflow-hidden border-[#FACC15]/50 shadow-[0_0_50px_rgba(250,204,21,0.15)] bg-gradient-to-b from-[#101D42] to-[#0D1B2E]">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-full bg-[#FACC15]/20 border-2 border-[#FACC15] flex items-center justify-center font-extrabold text-xl text-[#FACC15]">
              #1
            </div>
            <div className="p-2 bg-[#FACC15]/10 rounded-xl border border-[#FACC15]/30">
              <Trophy className="w-8 h-8 text-[#FACC15] animate-bounce" />
            </div>
          </div>
          <div className="mt-4">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/40">
              Líder de Productividad del Día
            </span>
            <h3 className="text-xl font-bold text-white mt-2">{mockRanking[0].name}</h3>
            <p className="text-xs text-slate-300 font-medium">{mockRanking[0].user}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono">Índice de Foco</p>
              <p className="text-3xl font-extrabold text-[#FACC15]">{mockRanking[0].score}%</p>
            </div>
            <span className="text-xs text-slate-300 font-mono font-bold">{mockRanking[0].productiveHrs} productivas</span>
          </div>
        </div>

        {/* Top 3: Bronze */}
        <div className="centryx-card p-6 relative overflow-hidden border-[#F97316]/30">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-[#F97316]/10 border border-[#F97316]/40 flex items-center justify-center font-bold text-[#F97316]">
              #3
            </div>
            <Award className="w-8 h-8 text-[#F97316]" />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold text-white">{mockRanking[2].name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{mockRanking[2].user}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-mono">Índice de Foco</p>
              <p className="text-2xl font-bold text-[#F97316]">{mockRanking[2].score}%</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">{mockRanking[2].productiveHrs}</span>
          </div>
        </div>

      </div>

      {/* Full Leaderboard Table */}
      <div className="centryx-card overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">Ranking Completo por Equipo</h3>
            <p className="text-xs text-slate-400 mt-0.5">Calculado acumulando horas en apps autorizadas de perfil vs apps improductivas.</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Filtrar por empleado o equipo..." 
              className="bg-[#050A14] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]/50 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A1525] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3.5 px-6">Posición</th>
                <th className="py-3.5 px-6">Dispositivo / Asignado</th>
                <th className="py-3.5 px-6">Empresa & Sucursal</th>
                <th className="py-3.5 px-6">Tiempo Útil</th>
                <th className="py-3.5 px-6">Tiempo Ocio</th>
                <th className="py-3.5 px-6 text-right">Índice de Foco</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockRanking.map((item) => (
                <tr key={item.rank} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-white">
                    #{item.rank}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.user}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    <div>{item.company}</div>
                    <div className="text-[11px] text-slate-500">{item.branch}</div>
                  </td>
                  <td className="py-4 px-6 font-mono text-[#10B981] font-semibold">
                    {item.productiveHrs}
                  </td>
                  <td className="py-4 px-6 font-mono text-[#EF4444]">
                    {item.unproductiveHrs}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-lg text-[#2DD4BF]">
                    {item.score}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
