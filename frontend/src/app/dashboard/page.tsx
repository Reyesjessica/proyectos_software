/**
 * Authenticated Dashboard
 * Main landing page after successful login/registration
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';
import { SessionManager } from '@/lib/session';
import { UserSession } from '@/types/session';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [copied, setCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  // Estado para proyectos comunitarios (mover aquí para evitar hooks condicionales)
  const [projects, setProjects] = useState<Array<{name: string, progress: string, budget: string}>>([]);
  const [newProject, setNewProject] = useState({name: '', progress: '', budget: ''});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const userSession = SessionManager.getSession();
    setSession(userSession);
  }, []);

  // Cargar proyectos desde localStorage cuando cambie la sesión (por usuario)
  useEffect(() => {
    if (!session || !session.user || !session.user.username) return;
    try {
      const key = `projects:${session.user.username}`;
      const raw = localStorage.getItem(key) || localStorage.getItem('projects');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setProjects(parsed);
      }
    } catch (e) {
      console.warn('Error loading projects from localStorage', e);
    }
  }, [session]);

  const handleCopyWallet = () => {
    if (session?.user.walletAddress) {
      navigator.clipboard.writeText(session.user.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    // Limpiar sesión pero mantener los registros (proyectos) en localStorage
    // para que al volver a iniciar sesión aparezcan los proyectos previos.
    SessionManager.clearSession();
    // NOTA: no eliminamos 'projects' ni 'projects:<username>' aquí.
    router.push('/');
  };

  const connectMetaMask = async () => {
    if (typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined") {
      try {
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (err: any) {
        console.error(err.message);
      }
    } else {
      console.log("Please install MetaMask");
      alert("Por favor instala MetaMask");
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const handleAddProject = () => {
    if (!newProject.name || !newProject.progress || !newProject.budget) return;
    // If editingIndex is set, update existing project
    if (editingIndex !== null && editingIndex >= 0 && editingIndex < projects.length) {
      const updated = projects.map((p, i) => i === editingIndex ? newProject : p);
      setProjects(updated);
      try {
        if (session && session.user && session.user.username) {
          localStorage.setItem(`projects:${session.user.username}`, JSON.stringify(updated));
        } else {
          localStorage.setItem('projects', JSON.stringify(updated));
        }
      } catch (e) {
        console.warn('Error saving projects to localStorage', e);
      }
      setEditingIndex(null);
      setNewProject({name: '', progress: '', budget: ''});
      return;
    }

    // Otherwise create new
    const updated = [...projects, newProject];
    setProjects(updated);
    // Persistir por usuario cuando haya sesión, si no guardar globalmente
    try {
      if (session && session.user && session.user.username) {
        localStorage.setItem(`projects:${session.user.username}`, JSON.stringify(updated));
      } else {
        localStorage.setItem('projects', JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Error saving projects to localStorage', e);
    }
    setNewProject({name: '', progress: '', budget: ''});
  };

  const handleEditProject = (index: number) => {
    const p = projects[index];
    if (!p) return;
    setEditingIndex(index);
    setNewProject({ ...p });
    // scroll to form (UI nicety)
    const el = document.querySelector('input[placeholder^="Ej."]') as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleDeleteProject = (index: number) => {
    const p = projects[index];
    if (!p) return;
    if (!confirm(`¿Eliminar proyecto "${p.name}"? Esta acción no se puede deshacer.`)) return;
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    try {
      if (session && session.user && session.user.username) {
        localStorage.setItem(`projects:${session.user.username}`, JSON.stringify(updated));
      } else {
        localStorage.setItem('projects', JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Error saving projects to localStorage', e);
    }
    // if we were editing this index, reset editor
    if (editingIndex === index) {
      setEditingIndex(null);
      setNewProject({name: '', progress: '', budget: ''});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background Spheres */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <nav className="px-6 pt-6 border-b border-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between py-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                <span className="text-white font-bold text-2xl">🏦</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl">EBAS</span>
                <span className="text-xs text-purple-300">Credit Score</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-3">
              <button
                onClick={connectMetaMask}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
              >
                {walletAddress.length > 0 ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : "Connect Wallet"}
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl overflow-hidden border border-purple-500/20 backdrop-blur-sm">
              <div className="p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <div className="inline-block mb-4 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                    <span className="text-purple-300 text-sm font-semibold">👤 Dashboard Personal</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold mb-4">
                    ¡Bienvenido,{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                      {session?.user?.username || 'Usuario'}
                    </span>
                    !
                  </h1>
                  <p className="text-xl text-gray-300 max-w-2xl">
                    Gestiona tus proyectos comunitarios y tu cartera de forma segura
                  </p>
                </div>
                <div className="text-6xl animate-bounce">📊</div>
              </div>
            </div>
          </section>

          {/* Wallet Info Card */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-8 border border-blue-500/20 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-3xl">💳</span>
                Tu Wallet
              </h2>
              <div className="flex items-center justify-between gap-4 bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Dirección Stellar</p>
                  <p className="text-white font-mono text-sm">{session?.user?.walletAddress || 'Cargando...'}</p>
                </div>
                <button
                  onClick={handleCopyWallet}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {copied ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8">Proyectos Comunitarios</h2>

            {/* Add Project Form */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-8 border border-green-500/20 backdrop-blur-sm mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-3xl">🆕</span>
                Registrar Proyecto
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Nombre del Proyecto</label>
                    <input
                      type="text"
                      placeholder="Ej. Renovación plaza central"
                      className="w-full bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-green-500/50 focus:bg-green-500/10 focus:outline-none transition-all focus:ring-2 focus:ring-green-500/20"
                      value={newProject.name}
                      onChange={e => setNewProject({...newProject, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Avance (%)</label>
                    <input
                      type="text"
                      placeholder="50"
                      className="w-full bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-green-500/50 focus:bg-green-500/10 focus:outline-none transition-all focus:ring-2 focus:ring-green-500/20"
                      value={newProject.progress}
                      onChange={e => setNewProject({...newProject, progress: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Presupuesto</label>
                    <input
                      type="text"
                      placeholder="$1,000"
                      className="w-full bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-green-500/50 focus:bg-green-500/10 focus:outline-none transition-all focus:ring-2 focus:ring-green-500/20"
                      value={newProject.budget}
                      onChange={e => setNewProject({...newProject, budget: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddProject}
                    disabled={!newProject.name || !newProject.progress || !newProject.budget}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingIndex !== null ? '✏️ Actualizar Proyecto' : '➕ Registrar Proyecto'}
                  </button>
                  {editingIndex !== null && (
                    <button
                      onClick={() => { 
                        setEditingIndex(null);
                        setNewProject({name: '', progress: '', budget: ''}); 
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold rounded-xl transition-all duration-300"
                    >
                      ✖️ Cancelar Edición
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Projects List */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-3xl">📋</span>
                Mis Proyectos ({projects.length})
              </h3>
              
              {projects.length === 0 ? (
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-12 text-center border border-purple-500/20 backdrop-blur-sm">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-400 text-lg">No hay proyectos registrados aún</p>
                  <p className="text-gray-500 text-sm mt-2">Registra tu primer proyecto arriba para comenzar</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((p, idx) => {
                    const pctMatch = (p.progress || '').toString().match(/(\d{1,3})/);
                    const pct = pctMatch ? Math.min(100, parseInt(pctMatch[1], 10)) : 0;
                    return (
                      <div
                        key={idx}
                        className={`bg-gradient-to-br rounded-xl p-6 border backdrop-blur-sm transition-all transform hover:scale-105 ${
                          editingIndex === idx
                            ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                            : 'from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white">{p.name}</h4>
                            <p className="text-gray-400 text-sm mt-1">Presupuesto: <span className="text-green-400 font-semibold">{p.budget}</span></p>
                          </div>
                          <span className="text-2xl">💰</span>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300 text-sm">Progreso</span>
                            <span className="text-green-400 font-bold">{pct}%</span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-3 border border-gray-600/30 overflow-hidden">
                            <div
                              className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-white/10">
                          <button
                            onClick={() => handleEditProject(idx)}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-lg font-semibold text-sm transition-all"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDeleteProject(idx)}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg font-semibold text-sm transition-all"
                          >
                            🗑️ Borrar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
    };
  }
}

