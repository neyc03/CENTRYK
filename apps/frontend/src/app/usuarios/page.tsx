'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Eye, 
  Lock, 
  Sliders, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  Search,
  KeyRound,
  User
} from 'lucide-react';
import Link from 'next/link';

export interface PlatformUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'super_admin' | 'user_base';
  status: 'Activo' | 'Inactivo';
  createdAt: string;
}

export default function UsersManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State para Nuevo Usuario
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'super_admin' | 'user_base'>('user_base');

  // Usuarios Iniciales de la Plataforma
  const [usersList, setUsersList] = useState<PlatformUser[]>([
    {
      id: '1',
      username: 'master',
      fullName: 'Administrador Máster Invernandez',
      email: 'master@centryx.io',
      role: 'super_admin',
      status: 'Activo',
      createdAt: '2026-01-10'
    },
    {
      id: '2',
      username: 'auditor_lectura',
      fullName: 'Auditor de Consulta Operativa',
      email: 'auditoria@invernandez.com',
      role: 'user_base',
      status: 'Activo',
      createdAt: '2026-03-15'
    },
    {
      id: '3',
      username: 'visor_sucursales',
      fullName: 'Supervisor de Visualización',
      email: 'visor@centryx.io',
      role: 'user_base',
      status: 'Activo',
      createdAt: '2026-05-20'
    }
  ]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUsername || !newFullName || !newPassword) {
      alert('Por favor complete el nombre de usuario, nombre completo y contraseña');
      return;
    }

    const newUser: PlatformUser = {
      id: String(Date.now()),
      username: newUsername.trim().toLowerCase(),
      fullName: newFullName.trim(),
      email: newEmail.trim() || `${newUsername.trim().toLowerCase()}@centryx.io`,
      role: newRole,
      status: 'Activo',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsersList(prev => [...prev, newUser]);
    setShowCreateModal(false);

    // Limpiar formulario
    setNewUsername('');
    setNewFullName('');
    setNewEmail('');
    setNewPassword('');
    setNewRole('user_base');

    setNotification(`Usuario '${newUser.username}' creado con éxito como ${newUser.role === 'super_admin' ? 'Super Administrador' : 'Usuario Base (Solo Lectura)'}`);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredUsers = usersList.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050A14] text-slate-100 p-8 space-y-8 font-sans">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-xl bg-[#0D1B2E] border border-white/10 hover:border-[#2DD4BF]/50 text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Gestión de Usuarios de la Plataforma</h1>
            <p className="text-xs text-slate-400 mt-0.5">Asignación de roles: Super Administrador (Acceso Total) vs Usuario Base (Solo Lectura).</p>
          </div>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] text-[#050A14] px-4 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:opacity-90 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Crear Nuevo Usuario</span>
        </button>
      </div>

      {/* Notificación de Éxito */}
      {notification && (
        <div className="bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 px-6 py-3 rounded-2xl flex items-center space-x-3 text-[#2DD4BF] text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Cuadros Explicativos de Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#0D1B2E] border border-emerald-500/20 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Super Administrador</h3>
              <p className="text-xs text-emerald-400 font-semibold">Acceso Total al Sistema</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Puede realizar cambios de configuración sensible, ejecutar comandos de bloqueo DPC, restablecer dispositivos de fábrica (wipe), crear/eliminar usuarios y modificar perfiles de aplicaciones.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D1B2E] border border-blue-500/20 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Usuario Base (Solo Lectura)</h3>
              <p className="text-xs text-blue-400 font-semibold">Sin Acceso a Opciones Sensibles</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Solo puede visualizar el mapa GPS en tiempo real, consultar el Índice de Foco y revisar reportes. NO tiene permisos para modificar configuraciones ni enviar acciones de control remoto sobre los equipos.
          </p>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-[#0D1B2E] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Usuarios Registrados ({filteredUsers.length})</h3>
            <p className="text-xs text-slate-400 mt-0.5">Cuentas autorizadas para iniciar sesión en la plataforma Centryx</p>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por usuario o nombre..."
              className="w-full pl-9 pr-4 py-2 bg-[#050A14] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A14] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3.5 px-6">Nombre de Usuario (Login)</th>
                <th className="py-3.5 px-6">Nombre Completo</th>
                <th className="py-3.5 px-6">Correo Electrónico</th>
                <th className="py-3.5 px-6">Rol Asignado</th>
                <th className="py-3.5 px-6 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-all">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 flex items-center justify-center font-bold font-mono">
                        {u.username.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-white font-bold font-mono">{u.username}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-slate-200">{u.fullName}</td>

                  <td className="py-4 px-6 text-slate-400 font-mono">{u.email}</td>

                  <td className="py-4 px-6">
                    {u.role === 'super_admin' ? (
                      <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center space-x-1.5 w-fit">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Super Administrador</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center space-x-1.5 w-fit">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Usuario Base (Solo Lectura)</span>
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Crear Usuario */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0D1B2E] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-[#2DD4BF]" />
                <span>Crear Nuevo Usuario de la Plataforma</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre de Usuario (Login Plano sin correo obligatorio)
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Ej: auditor_01 o pedro_visor"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ej: Pedro Martínez Auditor"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Ej: pedro@invernandez.com"
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contraseña Inicial
                </label>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Categoría de Permisos / Rol
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'super_admin' | 'user_base')}
                  className="w-full px-4 py-2.5 bg-[#050A14] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#2DD4BF]"
                >
                  <option value="user_base">Usuario Base (Solo Lectura - Sin acceso a opciones sensibles)</option>
                  <option value="super_admin">Super Administrador (Acceso Total - Control Remoto y Configuración)</option>
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
                  Guardar y Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
