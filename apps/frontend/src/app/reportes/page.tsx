'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowLeft, Download, Printer, RefreshCw, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sylwwjuwxtziljjkowsz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bHd3anV3eHR6aWxqamtvd3N6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgxMjk0NSwiZXhwIjoyMTAwMzg4OTQ1fQ.16CCyu_5JhbsMUEhQh78_Pzm_649LJb-DgasnUlqDwU';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ReportesPage() {
  const router = useRouter();
  const [deviceCount, setDeviceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('centryx_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchMetricsFromSupabase();
  }, [router]);

  const fetchMetricsFromSupabase = async () => {
    try {
      setLoading(true);
      const { count } = await supabase.from('devices').select('*', { count: 'exact', head: true });
      setDeviceCount(count || 0);
    } catch (e) {
      console.error(e);
      setDeviceCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050A14] text-slate-100 p-8 space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-xl bg-[#0D1B2E] border border-white/10 hover:border-[#2DD4BF]/50 text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Reporte Ejecutivo PDF de Productividad</h1>
            <p className="text-xs text-slate-400 mt-0.5">Métricas reales calculadas en la base de datos Supabase</p>
          </div>
        </div>

        <button 
          onClick={() => window.print()}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:opacity-90 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Exportar PDF</span>
        </button>
      </div>

      <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl p-12 text-center space-y-4 shadow-xl">
        <FileText className="w-12 h-12 text-[#8B5CF6] mx-auto" />
        <h3 className="text-lg font-bold text-white">Informe Ejecutivo de Monitoreo</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Dispositivos activos registrados en Supabase: <span className="text-[#2DD4BF] font-mono font-bold">{deviceCount} Dispositivos</span>
        </p>
      </div>
    </div>
  );
}
