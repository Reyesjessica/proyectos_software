/**
 * Authenticated Dashboard
 * Main landing page after successful login/registration
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      {/* ...existing code... */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ...existing code... */}
        {/* Sección de proyectos comunitarios */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Proyectos Comunitarios</h2>

          {/* Formulario estilizado */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Nombre del proyecto</label>
                <input
                  type="text"
                  placeholder="Ej. Renovación plaza central"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Avance</label>
                <input
                  type="text"
                  placeholder="50%"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  value={newProject.progress}
                  onChange={e => setNewProject({...newProject, progress: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Presupuesto</label>
                <input
                  type="text"
                  placeholder="$1,000"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  value={newProject.budget}
                  onChange={e => setNewProject({...newProject, budget: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddProject}
                  disabled={!newProject.name || !newProject.progress || !newProject.budget}
                  className={`px-5 py-3 rounded-full text-white font-medium shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed ${!newProject.name || !newProject.progress || !newProject.budget ? 'bg-gray-400' : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:opacity-95'}`}
                >
                  {editingIndex !== null ? 'Actualizar Proyecto' : 'Registrar Proyecto'}
                </button>
                <button
                  onClick={() => { setNewProject({name: '', progress: '', budget: ''}); }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  Limpiar
                </button>
              </div>

              <p className="text-sm text-gray-500">Tus proyectos se guardan en tu navegador y se recuperarán cuando vuelvas a iniciar sesión.</p>
            </div>
          </div>

          {/* Lista de proyectos */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Proyectos registrados</h3>
            {projects.length === 0 ? (
              <div className="p-6 border border-dashed border-gray-200 rounded-lg text-center text-gray-500">No hay proyectos registrados aún.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presupuesto</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {projects.map((p, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">{p.progress}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.budget}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleEditProject(idx)}
                              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProject(idx)}
                              className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                            >
                              Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
