import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sylwwjuwxtziljjkowsz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bHd3anV3eHR6aWxqamtvd3N6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgxMjk0NSwiZXhwIjoyMTAwMzg4OTQ1fQ.16CCyu_5JhbsMUEhQh78_Pzm_649LJb-DgasnUlqDwU';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const enterpriseToken = searchParams.get('enterpriseToken');
  const signupUrlName = searchParams.get('signupUrlName');

  if (!enterpriseToken) {
    return new NextResponse(`
      <html>
        <body style="background:#050A14;color:#fff;font-family:sans-serif;padding:40px;text-align:center;">
          <h2 style="color:#ef4444;">⚠️ No se recibió enterpriseToken en la redirección de Google</h2>
          <p>Por favor intente el flujo de registro nuevamente.</p>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  // Renderizar la confirmacion del enterpriseToken para la creacion de Enterprise
  return new NextResponse(`
    <html>
      <body style="background:#050A14;color:#fff;font-family:sans-serif;padding:40px;text-align:center;">
        <div style="max-width:600px;margin:0 auto;background:#0D1B2E;padding:30px;border-radius:24px;border:1px solid rgba(255,255,255,0.1);">
          <h2 style="color:#2DD4BF;">🎉 ¡REGISTRO OFICIAL DE GOOGLE AMAPI COMPLETADO!</h2>
          <p style="color:#94a3b8;font-size:14px;">El enterpriseToken sin límites ha sido generado con éxito por Google Play Enterprise.</p>
          <div style="background:#050A14;padding:15px;border-radius:12px;font-family:monospace;font-size:12px;color:#38bdf8;word-break:break-all;margin:20px 0;">
            ENTERPRISE TOKEN: ${enterpriseToken}
          </div>
          <p style="color:#10b981;font-weight:bold;">Regrese a la consola de Antigravity o presione el botón para procesar la vinculación definitiva.</p>
          <a href="/equipos?amapiToken=${enterpriseToken}" style="display:inline-block;padding:12px 24px;background:linear-gradient(to right, #2DD4BF, #3B82F6);color:#050A14;font-weight:bold;text-decoration:none;border-radius:12px;margin-top:10px;">
            Ir al Panel de Equipos Centryx MDM
          </a>
        </div>
      </body>
    </html>
  `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
