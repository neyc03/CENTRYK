'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Building2, 
  GitBranch, 
  ArrowLeft, 
  CheckCircle2, 
  Printer, 
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const [selectedCompany, setSelectedCompany] = useState('Empresa Corporativa SRL');
  const [selectedBranch, setSelectedBranch] = useState('Todas las sucursales');
  const [dateRange, setDateRange] = useState('Semana Actual (Jul 17 - Jul 23, 2026)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      setIsGenerating(false);
      setDownloadSuccess(true);
    }, 1500);
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
              <FileText className="w-6 h-6 text-[#2DD4BF] mr-2.5" />
              Generador de Reportes PDF Semanales
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Exportación ejecutiva en PDF de productividad, top de apps usadas y desglose por equipo.</p>
          </div>
        </div>

        <button 
          onClick={handleGeneratePdf}
          disabled={isGenerating}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-[#050A14] px-5 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_25px_rgba(45,212,191,0.3)] hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Generando PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Exportar Reporte PDF</span>
            </>
          )}
        </button>
      </div>

      {downloadSuccess && (
        <div className="flex items-center justify-between bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] p-4 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>¡Reporte PDF Generado Exitosamente! El archivo <code className="font-mono bg-[#050A14] px-2 py-1 rounded">reporte_semanal_centryx_2026.pdf</code> está listo para descarga.</span>
          </div>
          <button 
            onClick={() => alert('Descargando archivo PDF generado...')} 
            className="bg-[#10B981] text-[#050A14] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#10B981]/80 transition-all"
          >
            Descargar Ahora
          </button>
        </div>
      )}

      {/* Filter Options */}
      <div className="centryx-card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Empresa Cliente</label>
          <div className="flex items-center space-x-2 bg-[#050A14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
            <Building2 className="w-4 h-4 text-[#2DD4BF]" />
            <select 
              value={selectedCompany} 
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none w-full cursor-pointer"
            >
              <option className="bg-[#0D1B2E]">Invernandez Group SRL (220 Dispositivos)</option>
              <option className="bg-[#0D1B2E]">Logística & Transporte Central (180 Dispositivos)</option>
              <option className="bg-[#0D1B2E]">Retail Dominis SRL (100 Dispositivos)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Sucursal / Zona</label>
          <div className="flex items-center space-x-2 bg-[#050A14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
            <GitBranch className="w-4 h-4 text-[#3B82F6]" />
            <select 
              value={selectedBranch} 
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none w-full cursor-pointer"
            >
              <option className="bg-[#0D1B2E]">Todas las sucursales</option>
              <option className="bg-[#0D1B2E]">Santo Domingo Central</option>
              <option className="bg-[#0D1B2E]">Santiago Norte</option>
              <option className="bg-[#0D1B2E]">Puerto Plata Hub</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Periodo Semanal</label>
          <div className="flex items-center space-x-2 bg-[#050A14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
            <Calendar className="w-4 h-4 text-[#FACC15]" />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none w-full cursor-pointer"
            >
              <option className="bg-[#0D1B2E]">Semana Actual (Jul 17 - Jul 23, 2026)</option>
              <option className="bg-[#0D1B2E]">Semana Anterior (Jul 10 - Jul 16, 2026)</option>
              <option className="bg-[#0D1B2E]">Mes Completo (Julio 2026)</option>
            </select>
          </div>
        </div>
      </div>

      {/* PDF Document Preview Card */}
      <div className="centryx-card p-8 space-y-6 max-w-4xl mx-auto border-[#2DD4BF]/30 shadow-[0_0_60px_rgba(45,212,191,0.08)]">
        
        {/* Document Header Preview */}
        <div className="border-b border-white/10 pb-6 flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2DD4BF] to-[#3B82F6] flex items-center justify-center font-bold text-[#050A14] text-xs">
                CX
              </div>
              <h2 className="text-xl font-bold text-white tracking-wider">CENTRYX MDM — REPORTE EJECUTIVO</h2>
            </div>
            <p className="text-xs text-[#2DD4BF] font-mono mt-1">SISTEMA AUTOMÁTICO DE AUDITORÍA Y PRODUCTIVIDAD</p>
          </div>

          <div className="text-right text-xs text-slate-400 font-mono">
            <p>Empresa: <strong className="text-white">{selectedCompany}</strong></p>
            <p className="mt-0.5">Fecha: {new Date().toLocaleDateString('es-DO')}</p>
          </div>
        </div>

        {/* Summary Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="bg-[#050A14] p-4 rounded-xl border border-white/10">
            <p className="text-slate-500">Índice de Foco Semanal</p>
            <p className="text-2xl font-bold text-[#2DD4BF] mt-1">91.4%</p>
          </div>
          <div className="bg-[#050A14] p-4 rounded-xl border border-white/10">
            <p className="text-slate-500">Horas Totales Trabajadas</p>
            <p className="text-2xl font-bold text-white mt-1">2,890 hrs</p>
          </div>
          <div className="bg-[#050A14] p-4 rounded-xl border border-white/10">
            <p className="text-slate-500">Alertas Atendidas</p>
            <p className="text-2xl font-bold text-[#10B981] mt-1">100%</p>
          </div>
        </div>

        {/* Top Apps Distribution Table Preview */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">Distribución de Horas por Aplicación</h4>
          
          <div className="space-y-2 text-xs">
            <div className="bg-[#050A14] p-3 rounded-xl border border-white/10 flex justify-between items-center">
              <span className="font-semibold text-white">1. Punto de Venta POS (com.pos.invernandez)</span>
              <span className="font-mono text-[#10B981] font-bold">1,420 hrs (49.1%)</span>
            </div>

            <div className="bg-[#050A14] p-3 rounded-xl border border-white/10 flex justify-between items-center">
              <span className="font-semibold text-white">2. Waze Navigation GPS (com.waze)</span>
              <span className="font-mono text-[#10B981] font-bold">850 hrs (29.4%)</span>
            </div>

            <div className="bg-[#050A14] p-3 rounded-xl border border-white/10 flex justify-between items-center">
              <span className="font-semibold text-white">3. Centryx Delivery Track (com.centryx.delivery)</span>
              <span className="font-mono text-[#10B981] font-bold">610 hrs (21.1%)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
