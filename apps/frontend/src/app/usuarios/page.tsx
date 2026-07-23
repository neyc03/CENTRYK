'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Eye, 
  Search, 
  Trash2, 
  CheckCircle, 
  X, 
  ArrowLeft,
  KeyRound,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Cliente Supabase Cloud
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sylwwjuwxtziljjkowsz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bHd3anV3eHR6aWxqamtvd3N6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgxMjk0NSwiZXhwIjoyMTAwMzg4OTQ1fQ.16CCyu_5JhbsMUEhQh78_Pzm_649LJb-DgasnUlqDwU';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PlatformUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'super_admin' | 'user_base';
  status: 'Activo' | 'Inactivo';
  createdAt: string;
}

export default function UsuariosPage() {
  const router = useRouter();
  const [usersList, setUsersList] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Formulario Nuevo Usuario
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'super_admin' | 'user_base'>('user_base');

  useEffect(() => {
    const token = localStorage.getItem('centryx_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUsersFromSupabase();
  }, [router]);

  const fetchUsersFromSupabase = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('platform_users').select('*');

      if (data && data.length > 0) {
        const mapped: PlatformUser[] = data.map((u: any) => ({
          id: u.id,
          username: u.username || 'user',
          fullName: u.full_name || u.username || 'Usuario Registrado',
          email: u.email || 'correo@centryx.io',
          role: u.role === 'master' || u.role === 'company_admin' ? 'super_admin' : 'user_base',
          status: 'Activo',
          createdAt: u.created_at ? u.created_at.substring(0, 10) : '2026-07-23'
        }));
        setUsersList(mapped);
      } else {
        setUsersList([]);
      }
    } catch (e) {
      console.error('Error leyendo usuarios de Supabase:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    try {
      // Generar Hash Bcrypt seguro de la contraseña
      const passwordHash = await bcrypt.hash(newPassword.trim(), 10);
      const mappedRole = newRole === 'super_admin' ? 'company_admin' : 'read_only';

      const newUserRecord = {
        username: newUsername.toLowerCase().trim(),
        email: newEmail || `${newUsername}@centryx.io`,
        full_name: newFullName || newUsername,
        password_hash: passwordHash,
        role: mappedRole
      };

      const { data, error } = await supabase.from('platform_users').insert(newUserRecord).select().single();

      if (error) {
        setNotification(`Error creando usuario en Supabase: ${error.message}`);
      } else {
        fetchUsersFromSupabase();
        setShowCreateModal(false);
        setNewUsername('');
        setNewFullName('');
        setNewEmail('');
        setNewPassword('');
        setNotification(`Usuario '${newUsername}' guardado exitosamente en la base de datos de Supabase.`);
      }
    } catch (err: any) {
      setNotification(`Error inesperado: ${err.message}`);
    }

    setTimeout(() => setNotification(null), 5000);
  };

  const filteredUsers = usersList.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050A14] text-slate-100 p-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-xl bg-[#0D1B2E] border border-white/10 hover:border-[#2DD4BF]/50 text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Gestión de Usuarios &amp; Roles de Plataforma</h1>
            <p className="text-xs text-slate-400 mt-0.5">Sincronizado 100% en tiempo real con Servidor de Autenticación Centryx</p>
          </div>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:opacity-90 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Crear Nuevo Usuario</span>
        </button>
      </div>

      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 px-6 py-3 rounded-2xl flex items-center space-x-3 text-emerald-400 text-xs font-semibold">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabla de Usuarios */}
      <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Usuarios Registrados en Supabase</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20 font-mono">
                {filteredUsers.length} Usuarios
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Control de credenciales y permisos de consulta</p>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar usuario o email..."
              className="w-full pl-9 pr-4 py-2 bg-[#050A14] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A14] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3.5 px-6">Usuario</th>
                <th className="py-3.5 px-6">Rol de Acceso</th>
                <th className="py-3.5 px-6">Permisos Configurados</th>
                <th className="py-3.5 px-6">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-all">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 flex items-center justify-center font-bold uppercase">
                        {u.username.substring(0, 2)}
                      </div>
                      <div>
                        <div className="text-white font-bold">{u.fullName} ({u.username})</div>
                        <div className="text-[11px] text-slate-500">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    {u.role === 'super_admin' ? (
                      <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-[#2DD4BF] flex items-center space-x-1 w-fit">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Super Administrador</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center space-x-1 w-fit">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Usuario Base (Solo Lectura)</span>
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-slate-300">
                    {u.role === 'super_admin' ? (
                      <span className="text-emerald-400 font-semibold">✓ Acceso Total &amp; Control Remoto</span>
                    ) : (
                      <span className="text-slate-400">✓ Consulta de Datos (Sin Configuración Sensible)</span>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      ACTIVO
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear Usuario */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-[#2DD4BF]" />
                <span>Crear Nuevo Usuario en Supabase</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de Usuario (Login)</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Ej: auditor_zona_norte"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ej: Carlos Eduardo Méndez"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña de Acceso</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Rol de Acceso</label>
                <select
                  value={newRole}
                  onChange={(e: any) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#2DD4BF]"
                >
                  <option value="user_base">Usuario Base (Solo Lectura - Sin Opciones Sensibles)</option>
                  <option value="super_admin">Super Administrador (Acceso Total &amp; Control Remoto)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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

    </div>
  );
}
