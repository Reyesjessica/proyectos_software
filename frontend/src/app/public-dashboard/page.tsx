'use client';

import { useState, useEffect } from 'react';
import { loadProjectsFromStellar, loadProjectsFromAccount } from '@/lib/stellar-testnet';
import Link from 'next/link';

// In a real production app, this would be a dynamic registry smart contract or database.
// For this demo, we use a list of known regional coordinators' usernames/keys to aggregate for the public view.
const OAXACA_REGISTRY_KEYS = ['community', 'oaxaca_gov', 'sierra_norte'];

interface ProjectWithMeta {
    name: string;
    progress: string;
    budget: string;
    description?: string;
    location?: string;
    // Local-only simulated fields
    votes?: number;
}

export default function PublicDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [projects, setProjects] = useState<ProjectWithMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [votes, setVotes] = useState<Record<string, number>>({});
    const [viewProject, setViewProject] = useState<any>(null);

    // Load "All" projects on mount (simulated Registry)
    useEffect(() => {
        const fetchRegistry = async () => {
            setLoading(true);
            try {
                let allProjects: ProjectWithMeta[] = [];

                // Try to load from known registry keys to populate the "All Oaxaca Projects" view
                // We use Promise.allSettled to ignore failures from missing mock accounts
                const results = await Promise.allSettled(
                    OAXACA_REGISTRY_KEYS.map(key => loadProjectsFromStellar(key))
                );

                results.forEach(res => {
                    if (res.status === 'fulfilled' && res.value.success && res.value.projects) {
                        allProjects = [...allProjects, ...res.value.projects];
                    }
                });

                // Remove duplicates by name
                const unique = Array.from(new Map(allProjects.map(item => [item.name, item])).values());
                setProjects(unique);

                // Initialize random mock votes for demo vibrancy
                const initialVotes: Record<string, number> = {};
                unique.forEach(p => {
                    initialVotes[p.name] = Math.floor(Math.random() * 50) + 10;
                });
                setVotes(initialVotes);

            } catch (e) {
                console.error("Error loading registry", e);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistry();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setProjects([]);

        // If empty, reload registry
        if (!searchTerm.trim()) {
            // Reload registry logic (simplified reuse check)
            window.location.reload();
            return;
        }

        const isStellarAddress = /^G[A-Z0-9]{55}$/.test(searchTerm);

        try {
            let result;
            if (isStellarAddress) {
                result = await loadProjectsFromAccount(searchTerm);
            } else {
                result = await loadProjectsFromStellar(searchTerm);
            }

            if (result.success && result.projects && result.projects.length > 0) {
                setProjects(result.projects);
            } else {
                setError("No se encontraron proyectos para esta búsqueda.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = (projectName: string) => {
        setVotes(prev => ({
            ...prev,
            [projectName]: (prev[projectName] || 0) + 1
        }));
        // In a real app, this would sign a transaction or call an API
    };

    // Grouping by location (Oaxaca)
    const groupedProjects = projects.reduce((acc, project) => {
        const loc = project.location || 'Localidad General (Oaxaca)';
        if (!acc[loc]) acc[loc] = [];
        acc[loc].push(project);
        return acc;
    }, {} as Record<string, ProjectWithMeta[]>);

    // Sort locations alphabetically
    const sortedLocations = Object.keys(groupedProjects).sort();

    const totalBudget = projects.reduce((acc, curr) => {
        const val = parseFloat(curr.budget.replace(/[^0-9.-]+/g, ""));
        return acc + (isNaN(val) ? 0 : val);
    }, 0);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                                <span className="text-white font-bold text-lg">🏛️</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-slate-900">Comunichain</span>
                                <span className="text-[10px] items-center tracking-widest text-slate-500 font-semibold uppercase">
                                    Portal de Transparencia
                                </span>
                            </div>
                        </Link>
                        <div className="hidden"></div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Hero / Intro */}
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200">
                        🚧 Obras Públicas - Estado de Oaxaca
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Auditoría y Participación Ciudadana
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
                        Explora los proyectos de infraestructura organizados por localidad.
                        Tu voz cuenta: vota por las obras que consideres prioritarias para tu comunidad.
                    </p>

                    {/* Search Bar Removed as per user request */}
                    <div className="max-w-lg mx-auto text-center translate-y-4 opacity-80">
                        <p className="text-slate-400 text-sm">Mostrando todos los proyectos de la región</p>
                    </div>

                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <div className="text-3xl font-bold text-slate-900 mb-1">{projects.length}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Obras Visibles</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center col-span-2">
                        <div className="text-3xl font-bold text-emerald-600 mb-1">${totalBudget.toLocaleString()}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Presupuesto Auditado</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <div className="text-3xl font-bold text-slate-900 mb-1">{sortedLocations.length}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Localidades</div>
                    </div>
                </div>

                {
                    error && (
                        <div className="max-w-2xl mx-auto mb-12 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center">
                            {error}
                        </div>
                    )
                }

                {
                    loading && projects.length === 0 && (
                        <div className="text-center py-20 opacity-50">
                            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p>Cargando registro público de Oaxaca...</p>
                        </div>
                    )
                }

                {
                    !loading && projects.length === 0 && !error && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
                            <p className="text-6xl mb-4">📭</p>
                            <p className="text-slate-500 text-lg">No hay proyectos registrados disponibles en este momento.</p>
                        </div>
                    )
                }

                {/* Projects List Grouped by Location */}
                <div className="space-y-16">
                    {sortedLocations.map(location => (
                        <div key={location} className="animate-fade-in-up">
                            <div className="flex items-center gap-4 mb-6 sticky top-20 bg-slate-50/95 backdrop-blur py-4 z-40 border-b border-slate-200">
                                <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                                <h2 className="text-2xl font-bold text-slate-900">{location}</h2>
                                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{groupedProjects[location].length} Obras</span>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {groupedProjects[location].map((p, idx) => {
                                    const pct = parseInt(p.progress) || 0;
                                    const voteCount = votes[p.name] || 0;

                                    return (
                                        <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                                            {/* Status Badge */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                                                    🏗️
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${pct === 100
                                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}>
                                                    {pct === 100 ? '✅ Completado' : '🚧 En Ejecución'}
                                                </span>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-bold text-xl text-slate-900 mb-2 leading-tight">{p.name}</h3>
                                                {p.budget && (
                                                    <span className="text-xs font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                                                        Presupuesto: {p.budget}
                                                    </span>
                                                )}
                                                <div className="flex justify-end mt-3">
                                                    <button
                                                        onClick={() => setViewProject(p)}
                                                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1"
                                                    >
                                                        <span>👁</span> Ver Detalles
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-slate-100">
                                                <div className="flex justify-between items-end mb-4">
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Presupuesto</span>
                                                        <span className="font-mono font-bold text-slate-900">${p.budget}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Avance Real</span>
                                                        <span className={`font-bold ${pct === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{pct}%</span>
                                                    </div>
                                                </div>

                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${pct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-amber-500'}`}
                                                        style={{ width: `${pct}%` }}
                                                    ></div>
                                                </div>

                                                <button
                                                    onClick={() => handleVote(p.name)}
                                                    className="w-full py-3 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2 group-hover:bg-emerald-600"
                                                >
                                                    <span>👍</span>
                                                    <span>Votar Prioridad</span>
                                                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-1">{voteCount}</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </main >

            <ProjectDetailsModal
                isOpen={!!viewProject}
                onClose={() => setViewProject(null)}
                project={viewProject}
            />
        </div >
    );
}

const ProjectDetailsModal = ({ isOpen, onClose, project }: any) => {
    if (!isOpen || !project) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
                <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2"><span>📂</span> Detalles del Proyecto</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nombre de la Obra</label>
                        <p className="font-bold text-slate-800 text-lg leading-tight">{project.name}</p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Comunidad / Ubicación</label>
                        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <span>📍</span>
                            <span>{project.location || 'No especificada'}</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Descripción Completa</label>
                        <div className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap text-sm leading-relaxed">
                            {project.description || 'El líder comunitario no ha proporcionado una descripción detallada para este proyecto.'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                            <label className="text-[10px] font-bold text-emerald-600 uppercase block">Presupuesto Solicitado</label>
                            <p className="font-mono text-emerald-700 font-bold text-lg">{project.budget || '$0'}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <label className="text-[10px] font-bold text-blue-600 uppercase block">Avance Actual</label>
                            <p className="font-mono text-blue-700 font-bold text-lg">{project.progress || '0'}%</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
