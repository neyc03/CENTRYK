'use client';

import React, { useState, useEffect } from 'react';
import { Award, ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sylwwjuwxtziljjkowsz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bHd3anV3eHR6aWxqamtvd3N6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgxMjk0NSwiZXhwIjoyMTAwMzg4OTQ1fQ.16CCyu_5JhbsMUEhQh78_Pzm_649LJb-DgasnUlqDwU';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RankingPage() {
  const router = useRouter();
  const [rankingList, setRankingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('centryx_token') || localStorage.getItem('centryx_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchRankingFromCloud();
  }, [router]);

  const fetchRankingFromCloud = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('daily_focus_scores').select('*').limit(20);
      if (data && data.length > 0) {
        setRankingList(data);
      } else {
        setRankingList([]);
      }
    } catch (e) {
      console.error(e);
      setRankingList([]);
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
            <h1 className="text-2xl font-bold text-white tracking-tight">Listado de Honor &amp; Índice de Foco</h1>
            <p className="text-xs text-slate-400 mt-0.5">Clasificación en tiempo real basada en la telemetría de uso corporativo Centryx</p>
          </div>
        </div>

        <button 
          onClick={fetchRankingFromCloud}
          className="flex items-center space-x-2 bg-[#101D42] border border-[#2DD4BF]/30 text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refrescar Ranking</span>
        </button>
      </div>

      <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl p-12 text-center space-y-4 shadow-xl">
        {rankingList.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-12">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500">
              <Trophy className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-white">No hay registros de puntuación de foco en la plataforma</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              El servidor corporativo se encuentra en espera. Al acumular uso de aplicaciones en sus teléfonos enrolados, el algoritmo generará el ranking automático.
            </p>
          </div>
        ) : (
          <div className="text-sm font-bold text-white">
            {rankingList.length} Registros de Foco en la Plataforma
          </div>
        )}
      </div>
    </div>
  );
}
