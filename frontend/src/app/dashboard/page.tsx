'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SessionManager } from '@/lib/session';
import {
  saveProjectsToStellar,
  loadProjectsFromStellar,
  saveProjectsWithFreighter,
  loadProjectsFromAccount,
  fundProject,
  fundProjectWithFreighter,
  getStellarExplorerUrl
} from '@/lib/stellar-testnet';

interface TransactionReviewProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string, budget: string, progress: string, description?: string, location?: string }) => void;
  data: { name: string, budget: string, progress: string, description?: string, location?: string };
  isSubmitting: boolean;
  signingMethod: 'freighter' | 'local';
  destinationAddress?: string;
}

const TransactionReviewModal = ({ isOpen, onClose, onConfirm, data, isSubmitting, signingMethod, destinationAddress }: TransactionReviewProps) => {
  const [editedData, setEditedData] = useState(data);

  useEffect(() => {
    setEditedData(data);
  }, [data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="p-6 bg-slate-900 text-white shrink-0">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>📝</span> Subir Proyecto
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Verifica los detalles antes de registrar en Blockchain.
          </p>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Operación Stellar</span>
              <div className="flex gap-2">
                {editedData.budget && editedData.budget !== '0' && (
                  <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">PAYMENT</span>
                )}
                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">MANAGE_DATA</span>
              </div>
            </div>

            {/* Destination Address Confirmation */}
            {destinationAddress && (
              <div className="mb-3 p-2 bg-slate-100 rounded border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cuenta Vinculada (Destino)</span>
                <div className="text-xs font-mono text-slate-600 truncate break-all">
                  {destinationAddress}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Nombre de la Obra</label>
                <input
                  value={editedData.name}
                  onChange={e => setEditedData({ ...editedData, name: e.target.value })}
                  className="w-full p-2 text-sm border rounded hover:border-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Descripción</label>
                <textarea
                  value={editedData.description || ''}
                  onChange={e => setEditedData({ ...editedData, description: e.target.value })}
                  className="w-full p-2 text-sm border rounded hover:border-emerald-400 focus:border-emerald-500 outline-none transition-colors h-20 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Comunidad Objetivo</label>
                <input
                  value={editedData.location || ''}
                  onChange={e => setEditedData({ ...editedData, location: e.target.value })}
                  className="w-full p-2 text-sm border rounded hover:border-emerald-400 focus:border-emerald-500 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">Dinero Necesario (XLM)</label>
                  <input
                    value={editedData.budget}
                    onChange={e => setEditedData({ ...editedData, budget: e.target.value })}
                    className="w-full p-2 text-sm border rounded font-mono hover:border-emerald-400 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">Avance Actual (%)</label>
                  <input
                    type="number"
                    value={editedData.progress}
                    onChange={e => setEditedData({ ...editedData, progress: e.target.value })}
                    className="w-full p-2 text-sm border rounded font-mono hover:border-emerald-400 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`flex items-start gap-3 p-3 rounded-lg text-xs ${signingMethod === 'freighter' ? 'bg-purple-50 text-purple-800' : 'bg-amber-50 text-amber-800'}`}>
            <span className="text-lg">{signingMethod === 'freighter' ? '🔗' : '⚠️'}</span>
            <p>
              {signingMethod === 'freighter'
                ? 'Se abrirá la extensión Freighter para firmar la transacción de forma segura.'
                : 'Se usará la llave de la aplicación (demo) para firmar. Conecta tu wallet para mayor seguridad.'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(editedData)}
            disabled={isSubmitting || !editedData.name}
            className={`px-6 py-2 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 ${signingMethod === 'freighter'
              ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
              }`}
          >
            {isSubmitting ? '⏳ Procesando...' : signingMethod === 'freighter' ? '🖋️ Firmar con Freighter' : '✅ Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="url(#paint0_linear)" />
    <path d="M7 12H17M12 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="paint0_linear" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="1" stopColor="#0F766E" />
      </linearGradient>
    </defs>
  </svg>
);

interface FundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { amount: string, expectedProgress: string }) => void;
  projectName: string;
  isSubmitting: boolean;
}

const FundingModal = ({ isOpen, onClose, onConfirm, projectName, isSubmitting }: FundingModalProps) => {
  const [amount, setAmount] = useState('');
  const [expectedProgress, setExpectedProgress] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="p-6 bg-slate-900 text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>💸</span> Fondear Proyecto
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Asigna recursos y establece metas de avance.
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 mb-4">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Proyecto Destino</span>
            <span className="font-bold text-slate-800">{projectName}</span>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Monto a Transferir (XLM)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Avance Esperado (%)</label>
            <input
              type="number"
              value={expectedProgress}
              onChange={e => setExpectedProgress(e.target.value)}
              placeholder="Ej. 50"
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1">Define el % de obra que se espera alcanzar con este fondo.</p>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
          <button onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg">Cancelar</button>
          <button
            onClick={() => onConfirm({ amount, expectedProgress })}
            disabled={!amount || !expectedProgress || isSubmitting}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20"
          >
            {isSubmitting ? '⏳ Enviando...' : 'Confirmar Fondeo'}
          </button>
        </div>
      </div>
    </div>
  );
};

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

export default function Dashboard() {
  const router = useRouter();
  const mounted = useRef(false);
  const [session, setSession] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hardcoded Demo Addresses
  const DEMO_COMMUNITY_LEADER = 'GBX3V42YPENDW7SHBRGEOXDRJAVIINXYUCW6A3EESZANRAYVWV5LD2UC';

  // App States
  const [projects, setProjects] = useState<Array<{ name: string, progress: string, budget: string, description?: string, location?: string }>>([]);
  const [newProject, setNewProject] = useState({ name: '', progress: '', budget: '', description: '', location: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Wallet States
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Transaction Review State
  const [showReview, setShowReview] = useState(false);
  const [pendingProject, setPendingProject] = useState<{ name: string, budget: string, progress: string, description?: string, location?: string } | null>(null);

  // Stellar Status
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [stellarError, setStellarError] = useState<string | null>(null);
  const [stellarSuccess, setStellarSuccess] = useState<string | null>(null);

  // Official Mode State
  const [searchedLeader, setSearchedLeader] = useState('');
  const [fundingModalOpen, setFundingModalOpen] = useState(false);
  const [viewProject, setViewProject] = useState<any>(null); // State for Project Details Modal
  const [selectedProjectForFunding, setSelectedProjectForFunding] = useState<{ name: string, budget: string, progress: string, description?: string, location?: string } | null>(null);

  // Stats
  const totalBudget = projects.reduce((acc, curr) => {
    const val = parseFloat(curr.budget.replace(/[^0-9.-]+/g, ""));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  const activeProjects = projects.length;

  const isOfficial = session?.user?.role !== 'community';

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // 1. Check Auth
  useEffect(() => {
    try {
      const userSession = SessionManager.getSession();
      if (!userSession) {
        router.push('/login');
      } else {
        setSession(userSession);
      }
    } catch (e) {
      console.error("Session error:", e);
      setErrorMsg("Error iniciando sesión. Intente recargar.");
    }
  }, [router]);

  // 2. Load Data Safe
  // 2. Load Data Safe


  useEffect(() => {
    if (!session?.user?.username) return;

    const loadStart = async () => {
      if (isOfficial) {
        setSearchedLeader(DEMO_COMMUNITY_LEADER);
        setIsLoading(true);
        try {
          const result = await loadProjectsFromAccount(DEMO_COMMUNITY_LEADER);
          if (result.success && result.projects) {
            setProjects(result.projects);
            if (result.projects.length === 0) {
              const localResult = await loadProjectsFromStellar('community');
              if (localResult.success) {
                setProjects(localResult.projects || []);
              }
            }
          }
        } catch (e) {
          console.error("Error auto-loading:", e);
        } finally {
          setIsLoading(false);
        }
      } else {
        const result = await loadProjectsFromStellar(session.user.username);
        if (result.success) {
          setProjects(result.projects || []);
        }
      }
    };

    setTimeout(loadStart, 500);
  }, [session, isOfficial]);


  const handleLogout = () => {
    try {
      SessionManager.clearSession();
      router.push('/');
    } catch (e) {
      router.push('/');
    }
  };

  // 3. Connect Freighter Safe
  const connectFreighter = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    setErrorMsg(null);
    try {
      // Dynamic import with error handling
      let freighterApi;
      try {
        freighterApi = await import('@stellar/freighter-api');
      } catch (importErr) {
        throw new Error("No se pudo cargar el módulo de Freighter. Verifica tu conexión.");
      }

      if (!freighterApi) throw new Error("Freighter API no disponible.");

      const { isConnected } = await freighterApi.isConnected();
      if (!isConnected) {
        alert("Freighter Wallet no detectada. Por favor instálala.");
        window.open("https://www.freighter.app/", "_blank");
        return;
      }

      await freighterApi.requestAccess();

      // Check Network
      let networkObj = null;
      try {
        networkObj = await freighterApi.getNetwork();
      } catch (e) {
        console.warn("Could not get network", e);
      }

      // Warn if not on Testnet (but allow to proceed as Freighter might auto-switch or user might switch later)
      // @ts-ignore
      if (networkObj && networkObj !== 'TESTNET' && networkObj.network !== 'TESTNET') {
        alert("⚠️ Aviso: Tu Freighter parece estar en 'PUBLIC' (Mainnet). \n\nPor favor cambia a 'TESTNET' en la configuración de la billetera para usar esta aplicación de prueba sin gastar dinero real.");
      }

      const addrObj = await freighterApi.getAddress();
      if (addrObj?.address && mounted.current) {
        setWalletAddress(addrObj.address);
      }
    } catch (e: any) {
      console.error(e);
      if (mounted.current) setErrorMsg("Error conectando wallet: " + (e.message || "Desconocido"));
    } finally {
      if (mounted.current) setIsConnecting(false);
    }
  };

  // 4. Save Logic Safe
  const handleSave = async (updatedProjects: typeof projects) => {
    setProjects(updatedProjects);
    setErrorMsg(null);
    setStellarError(null);

    if (session?.user?.username) {
      // Local Save first (Backup)
      try {
        localStorage.setItem(`projects:${session.user.username}`, JSON.stringify(updatedProjects));
      } catch (e) {
        console.error("Local save failed", e);
      }

      // Stellar Save
      setIsSaving(true);
      try {
        let result;
        if (walletAddress) {
          // Save with Freighter
          result = await saveProjectsWithFreighter(walletAddress, updatedProjects);
        } else {
          // Save with Local App Keypair
          result = await saveProjectsToStellar(session.user.username, updatedProjects);
        }

        if (mounted.current) {
          if (result.success && result.txHash) {
            setLastTxHash(result.txHash);
            setStellarSuccess(walletAddress ? "✅ Guardado con Freighter" : "✅ Cambios guardados en Blockchain");
            setTimeout(() => mounted.current && setStellarSuccess(null), 5000);
          } else {
            setStellarError(result.error || "No se pudo sincronizar con Stellar.");
          }
        }
      } catch (e: any) {
        if (mounted.current) setStellarError(e.message || "Error de red al guardar.");
      } finally {
        if (mounted.current) setIsSaving(false);
      }
    }
  };

  const handleSaveConfirmed = async (finalData: { name: string, budget: string, progress: string, description?: string, location?: string }) => {
    // 1. Optimistic UI Update
    const updatedProjects = [...projects];
    if (editingIndex !== null) {
      updatedProjects[editingIndex] = finalData;
    } else {
      updatedProjects.push(finalData);
    }
    setProjects(updatedProjects);

    // 2. Close Modal Immediately (Optimistic)
    setShowReview(false);
    setNewProject({ name: '', budget: '', progress: '', description: '', location: '' });
    setEditingIndex(null);
    setStellarSuccess("⏳ Procesando en segundo plano...");

    // 3. Background Sync
    setErrorMsg(null);
    setStellarError(null);

    // Call internal save logic similar to handleSave but with new project list
    if (session?.user?.username) {
      // Local Save first
      try {
        localStorage.setItem(`projects:${session.user.username}`, JSON.stringify(updatedProjects));
      } catch (e) {
        console.error("Local save failed", e);
      }

      // Parse amount from the CURRENT project being processed (finalData)
      let paymentAmount = '0';
      try {
        if (finalData.budget) {
          // Remove non-numeric characters (except dot)
          const sanitized = finalData.budget.replace(/[^0-9.]/g, '');
          const val = parseFloat(sanitized);
          if (!isNaN(val) && val > 0) {
            paymentAmount = val.toString();
          }
        }
      } catch (e) {
        console.warn("Could not parse budget for transaction", e);
      }

      // Memo (Project Name)
      const memoText = finalData.name || "Proyecto Comunichain";

      // Check Role for "Silent Save" logic
      const isCommunityLeader = session.user.role === 'community';

      setIsSaving(true);
      try {
        let result;

        if (isCommunityLeader) {
          // BYPASS FREIGHTER POPUP
          // As per user request, Community Leader (Account 2) just "uploads" without transaction prompt.
          // We use the internal 'saveProjectsToStellar' which signs with the stored keypair (or mock) transparently.
          console.log("🔹 Silent Save for Community Leader (No Freighter Prompt)");
          result = await saveProjectsToStellar(session.user.username, updatedProjects, paymentAmount);
        } else if (walletAddress) {
          // We use the LOCAL session wallet as the destination for the "Allocation"
          // This ensures the transaction appears as "Sent [Amount] XLM" in Freighter History
          const allocationDestination = session.user.walletAddress;
          result = await saveProjectsWithFreighter(walletAddress, updatedProjects, paymentAmount, memoText, allocationDestination);
        } else {
          result = await saveProjectsToStellar(session.user.username, updatedProjects, paymentAmount);
        }

        if (mounted.current) {
          if (result.success && result.txHash) {
            setLastTxHash(result.txHash);
            setStellarSuccess(walletAddress && !isCommunityLeader ? "✅ Guardado con Freighter" : "✅ Proyecto Subido Correctamente");

            // NOW we close the modal and reset form
            setNewProject({ name: '', budget: '', progress: '', description: '', location: '' });
            setEditingIndex(null);
            setShowReview(false);

            setTimeout(() => mounted.current && setStellarSuccess(null), 5000);
          } else {
            setStellarError(result.error || "No se pudo sincronizar con Stellar.");
          }
        }
      } catch (e: any) {
        if (mounted.current) setStellarError(e.message || "Error de red al guardar.");
      } finally {
        if (mounted.current) setIsSaving(false);
      }
    }
  };

  // OFFICIAL ACTIONS
  const handleSearchLeader = async () => {
    if (!searchedLeader.trim()) return;
    setIsLoading(true);
    setProjects([]);
    setErrorMsg(null);
    try {
      // Try treating as Public Key first if G...
      let result;
      if (searchedLeader.startsWith('G') && searchedLeader.length === 56) {
        result = await loadProjectsFromAccount(searchedLeader);
      } else {
        // Assume local lookup username (demo)
        result = await loadProjectsFromStellar(searchedLeader);
      }

      if (result.success && result.projects) {
        setProjects(result.projects);
        if (result.projects.length === 0) setErrorMsg("Usuario encontrado pero no tiene proyectos públicos.");
      } else {
        setErrorMsg("No se encontraron proyectos para este usuario.");
      }
    } catch (e: any) {
      setErrorMsg("Error buscado proyectos: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishProject = async (project: any) => {
    if (!confirm(`¿Estás seguro de que deseas marcar "${project.name}" como TERMINADA (100%)?`)) return;

    // 1. Optimistic Update
    setProjects(prev => prev.map(p =>
      p.name === project.name ? { ...p, progress: '100' } : p
    ));

    // 2. Background Sync
    setIsSaving(true);
    setStellarSuccess("⏳ Finalizando obra en segundo plano...");

    try {
      // We are just updating the progress to 100 which moves it to the other list
      // We assume Official can write to this (locally or via shared key for demo)
      // Since 'saveProjectsToStellar' uses current session user, this works for local/demo logic.
      // Ideally, Official would send a TX to update Leader's data, but for MVP we update the VIEW.
      const updatedList = projects.map(p =>
        p.name === project.name ? { ...p, progress: '100' } : p
      );

      // Save using available method (Official usually doesn't have Leader's keys, so this might be local-only or mock)
      // For DEMO: We will try to persist this change using 'saveProjectsToStellar' with session user (Official)
      // Note: This saves to Official's list. If looking up Leader, we might need different logic.
      // BUT for the DEMO view, updating local state is key.

      await new Promise(r => setTimeout(r, 1000)); // Fake network delay if needed
      setStellarSuccess("✅ Obra marcada como TERMINADA");
      setTimeout(() => setStellarSuccess(null), 3000);

      // Persist to local storage at least
      if (session?.user?.username) {
        localStorage.setItem(`projects:${session.user.username}`, JSON.stringify(updatedList));
      }

    } catch (e: any) {
      console.error(e);
      setStellarError("Error finalizando obra: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenFunding = (project: any) => {
    setSelectedProjectForFunding(project);
    setFundingModalOpen(true);
  };

  const handleConfirmFunding = async (data: { amount: string, expectedProgress: string }) => {
    if (!selectedProjectForFunding) return;

    // STRICT CHECK: Ensure Official is using Account 1 (GCNH...)
    const OFFICIAL_ACCOUNT_1 = 'GCNHHMQFE25JFCKXNMFDFBPS7ZUM6I55PDVY2SJIS3WQSIBXRNHUV6BM';

    // Verify connection first
    if (!walletAddress) {
      alert("⚠️ BILLETERA NO CONECTADA\n\nPara fondear el proyecto, el funcionario debe conectar su billetera Freighter.");
      return;
    }

    // Verify correct account
    if (walletAddress !== OFFICIAL_ACCOUNT_1) {
      alert(`⚠️ CUENTA INCORRECTA EN FREIGHTER\n\nPor favor cambia a la Account 1 (Funcionario):\n${OFFICIAL_ACCOUNT_1}\n\nCuenta actual: ${walletAddress}`);
      return;
    }

    // 1. Capture Data needed for Tx
    const projectToFund = selectedProjectForFunding;
    const fundingAmount = data.amount;
    const progressTarget = data.expectedProgress;

    // OVERRIDE: If funding Community Leader project, ALWAYS use GBX3V... (Account 2)
    // This ensures funds go to the real wallet, not the shadow wallet
    const COMMUNITY_LEADER_RECEIVER = 'GBX3V42YPENDW7SHBRGEOXDRJAVIINXYUCW6A3EESZANRAYVWV5LD2UC';

    // Simple logic: if searchedLeader is set (Official mode), assume we are funding LEADER
    console.log("💰 Funding Logic - Searched Leader:", searchedLeader);

    // We override the 'searchedLeader' logic effectively by strictly setting finalDestAddress below
    // But for the Optimistic State, we proceed as is.

    // 2. Optimistic UI Update
    setProjects(prev => prev.map(p =>
      p.name === projectToFund.name
        ? { ...p, progress: '1', budget: fundingAmount }
        : p
    ));

    // 3. Close Modal Immediately
    setFundingModalOpen(false);
    setSelectedProjectForFunding(null);
    setStellarSuccess("⏳ Iniciando fondeo en segundo plano...");

    // 4. Background Transaction
    setIsSaving(true);
    setErrorMsg(null);

    try {
      // Logic to determine destination address
      // STRICT OVERRIDE FOR DEMO
      let finalDestAddress = COMMUNITY_LEADER_RECEIVER;

      console.log("-----------------------------------------");
      console.log("💰 TRANSACTION DETAILS:");
      console.log(`FROM (Official/Acc1): ${walletAddress}`);
      console.log(`TO   (Leader/Acc2)  : ${finalDestAddress} (FORCED)`);
      console.log(`AMT  (XLM)          : ${fundingAmount}`);
      console.log("-----------------------------------------");

      // Fallback: If searchedLeader is not a valid G-address, use the hardcoded Demo Leader
      if (!finalDestAddress || !finalDestAddress.startsWith('G')) {
        console.warn("Invalid searched leader, falling back to DEMO_COMMUNITY_LEADER");
        finalDestAddress = DEMO_COMMUNITY_LEADER;
      }

      // CONFIRMATION LOG:
      console.log("-----------------------------------------");
      console.log("💰 TRANSACTION DETAILS:");
      console.log(`FROM (Official/Acc1): ${walletAddress}`);
      console.log(`TO   (Leader/Acc2)  : ${finalDestAddress}`);
      console.log(`AMT  (XLM)          : ${fundingAmount}`);
      console.log("-----------------------------------------");

      const memo = `Fund:${projectToFund.name.substring(0, 8)} P:${progressTarget}`;

      let result;
      if (walletAddress) {
        result = await fundProjectWithFreighter(finalDestAddress, fundingAmount, memo);
      } else {
        // Fallback for local testing if needed, though secret might be missing as noted
        result = await fundProject(session.user.username, finalDestAddress, fundingAmount, memo);
      }

      if (mounted.current) {
        if (result.success && result.txHash) {
          setLastTxHash(result.txHash);
          setStellarSuccess("✅ Fondeo registrado en Blockchain correctamente.");
          setTimeout(() => setStellarSuccess(null), 5000);
        } else {
          setStellarError(result.error || "Error en la transacción de fondeo (Blockchain).");
        }
      }

    } catch (e: any) {
      if (mounted.current) setStellarError(e.message || "Error desconocido");
    } finally {
      if (mounted.current) setIsSaving(false);
    }
  };


  const handleInitiateSave = () => {
    if (!newProject.name) return;
    setPendingProject(newProject);
    setShowReview(true);
  };



  const handleDeleteProject = (index: number) => {
    if (!confirm("¿Seguro que deseas eliminar este proyecto?")) return;
    const updated = projects.filter((_, i) => i !== index);
    // Para eliminar no mostramos modal de review, directo
    setProjects(updated);
    // Trigger direct save
    const saveDirect = async () => {
      setIsSaving(true);
      try {
        if (session?.user?.username) localStorage.setItem(`projects:${session.user.username}`, JSON.stringify(updated));
        const result = walletAddress ? await saveProjectsWithFreighter(walletAddress, updated) : await saveProjectsToStellar(session.user.username, updated);
        if (result.success) setStellarSuccess("✅ Elemento eliminado");
      } catch (e) { } finally { setIsSaving(false); }
    };
    saveDirect();
  };

  const showQrCode = async () => {
    const addr = walletAddress || session?.user?.walletAddress;
    if (!addr) {
      alert("No hay dirección de wallet disponible para mostrar.");
      return;
    }
    try {
      // @ts-ignore
      const QRCode = (await import('qrcode')).default;
      QRCode.toDataURL(addr, { width: 400, margin: 2 })
        .then((url: string) => {
          const win = window.open("", "QR", "width=450,height=550");
          if (win) {
            win.document.write(`
              <div style="font-family:sans-serif;text-align:center;padding:20px;background:#f8fafc;height:100%;">
                <h2 style="color:#0f172a;margin-bottom:20px;">Tu Dirección Pública</h2>
                <div style="background:white;padding:15px;border-radius:12px;box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1);display:inline-block;">
                  <img src="${url}" style="display:block;"/>
                </div>
                <p style="margin-top:20px;background:#e2e8f0;padding:10px;border-radius:8px;font-family:monospace;font-size:12px;word-break:break-all;color:#334155;">${addr}</p>
                <div style="margin-top:20px;color:#059669;font-weight:bold;font-size:14px;">Red: Stellar Testnet</div>
              </div>
            `);
          }
        });
    } catch (e) {
      alert("Error generando QR. Verifica tu conexión.");
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">

      {/* HEADER */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <LogoIcon />
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                  Comunichain
                </span>
                <span className="text-[10px] items-center tracking-widest text-slate-500 font-semibold uppercase">
                  {session.user.role === 'community' ? 'Gestión Comunitaria' : 'Gestión Pública'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs text-slate-500 font-medium">
                  {session.user.role === 'community' ? 'Líder Comunitario' : 'Funcionario'}
                </span>
                <span className="text-sm font-bold text-slate-800">{session.user.username}</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-md">
                {session.user.username.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-lg">
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Error Messages */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-xl border border-red-200 flex items-center gap-3 animate-pulse">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        {/* Status Line */}
        {(stellarSuccess || stellarError || isSaving || isLoading) && (
          <div className={`mb-6 p-4 rounded-xl flex items-center justify-between shadow-sm border transition-all ${stellarError ? 'bg-red-50 border-red-200 text-red-700' :
            'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
            <span className="font-medium flex items-center gap-2">
              {(isSaving || isLoading) && <span className="animate-spin h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full"></span>}
              {isSaving ? "Sincronizando con Blockchain..." : isLoading ? "Recuperando datos..." : stellarError || stellarSuccess}
            </span>
            {lastTxHash && (
              <a href={getStellarExplorerUrl(lastTxHash)} target="_blank" className="text-xs font-bold underline hover:text-emerald-600">
                Ver Transacción ↗
              </a>
            )}
          </div>
        )}

        {isOfficial ? (
          // OFFICIAL VIEW
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COL: Project Categories */}
            <div className="lg:col-span-8 space-y-8">

              {/* 1. Obras Disponibles (Sin Fondeo - Progreso 0%) */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-amber-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><span>📂</span> Obras Disponibles</h3>
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                    {projects.filter(p => !p.progress || parseInt(p.progress) === 0).length}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  {projects.filter(p => !p.progress || parseInt(p.progress) === 0).length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">No hay obras pendientes de fondeo.</p>
                  ) : (
                    projects.filter(p => !p.progress || parseInt(p.progress) === 0).map((p, idx) => (
                      <div key={idx} className="border border-amber-100 bg-amber-50/30 rounded-2xl p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-900">{p.name}</h4>
                          <p className="text-xs text-slate-500">Solicitando: {p.budget || 'Sin definir'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setViewProject(p)}
                            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1"
                          >
                            <span>👁</span> Detalle
                          </button>
                          <button
                            onClick={() => handleOpenFunding(p)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                          >
                            <span>💸</span> Fondear
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 2. Obras en Ejecución (Progreso 1-99%) */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-blue-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><span>🚧</span> Obras en Ejecución</h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {projects.filter(p => parseInt(p.progress) > 0 && parseInt(p.progress) < 100).length}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  {projects.filter(p => parseInt(p.progress) > 0 && parseInt(p.progress) < 100).length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">No hay obras en ejecución.</p>
                  ) : (
                    projects.filter(p => parseInt(p.progress) > 0 && parseInt(p.progress) < 100).map((p, idx) => {
                      const pct = parseInt(p.progress) || 0;
                      return (
                        <div key={idx} className="border border-blue-100 bg-blue-50/30 rounded-2xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <h4 className="font-bold text-slate-900">{p.name}</h4>
                              <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Presupuesto: ${p.budget}</span>
                            </div>
                            <span className="text-xl font-bold text-blue-600">{pct}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setViewProject(p)}
                              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1"
                            >
                              <span>👁</span> Ver Detalles
                            </button>
                            <button
                              onClick={() => handleOpenFunding(p)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1"
                            >
                              <span>💸</span> Seguir Fondeando
                            </button>
                            <button
                              onClick={() => handleFinishProject(p)}
                              className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1"
                              title="Marcar como terminada"
                            >
                              <span>✅</span> Terminar
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 3. Obras Terminadas */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-emerald-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><span>✅</span> Obras Terminadas</h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                    {projects.filter(p => parseInt(p.progress) === 100).length}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  {projects.filter(p => parseInt(p.progress) === 100).length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">No hay obras finalizadas.</p>
                  ) : (
                    projects.filter(p => parseInt(p.progress) === 100).map((p, idx) => (
                      <div key={idx} className="border border-emerald-100 bg-emerald-50/30 rounded-2xl p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-900">{p.name}</h4>
                          <p className="text-xs text-emerald-600 font-bold">Total Invertido: {p.budget || '$0'}</p>
                        </div>
                        <button
                          onClick={() => setViewProject(p)}
                          className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1"
                        >
                          <span>👁</span> Ver Detalles
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COL: Connect Wallet & Search */}
            <div className="lg:col-span-4 space-y-6">
              {/* Wallet Card */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                {/* ... (Same wallet card content) */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full"></div>
                <h3 className="font-bold text-lg mb-4 relative z-10 flex items-center gap-2">
                  <span>🏦</span> Tesorería Digital
                </h3>
                <div className="space-y-4 relative z-10">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Cuenta App</span>
                    <div className="font-mono text-xs text-slate-300 truncate bg-black/20 p-2 rounded">{session.user.walletAddress || 'No asignada'}</div>
                  </div>

                  <div className={`p-4 rounded-2xl border transition-colors ${walletAddress ? 'bg-emerald-900/30 border-emerald-500/30' : 'border-dashed border-slate-700 bg-white/5'}`}>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Llave Freighter (Externa)</span>
                    {walletAddress ? (
                      <div className="font-mono text-xs text-emerald-300 truncate bg-emerald-950/50 p-2 rounded border border-emerald-500/20 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        {walletAddress}
                      </div>
                    ) : (
                      <button
                        onClick={connectFreighter}
                        disabled={isConnecting}
                        className="w-full mt-1 py-3 bg-white text-slate-900 text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {isConnecting ? '⏳ Conectando...' : '🔗 Conectar Wallet'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Form */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 sticky top-24">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full text-lg">🔍</span>
                    Buscar Proyectos
                  </h3>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Líder Comunitario (Clave Pública)</label>
                    <input
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 font-mono text-xs"
                      placeholder="G..."
                      value={searchedLeader}
                      onChange={e => setSearchedLeader(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleSearchLeader}
                    disabled={isLoading || !searchedLeader}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-xl shadow-slate-900/20 active:scale-[0.98]"
                  >
                    {isLoading ? 'Buscando...' : '🔍 Buscar'}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">
                    Ingresa la clave pública del líder comunitario para ver sus proyectos y asignar fondos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // COMMUNITY VIEW (Existing Grid)
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* COL 1: Project List */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3 text-2xl">
                  <span className="flex items-center justify-center w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full text-xl shadow-sm">
                    {editingIndex !== null ? '✏️' : '📝'}
                  </span>
                  {editingIndex !== null ? 'Editar Partida' : 'Nueva Asignación'}
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block tracking-wider">Nombre de la Obra</label>
                    <input
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 text-lg font-medium placeholder:text-slate-300"
                      placeholder="Ej. Pavimentación Calle Norte"
                      value={newProject.name}
                      onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block tracking-wider">Descripción del Proyecto</label>
                    <textarea
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 h-32 resize-none placeholder:text-slate-300"
                      placeholder="Describe brevemente el alcance, beneficiarios y objetivos de la obra..."
                      value={newProject.description || ''}
                      onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block tracking-wider">Comunidad Objetivo</label>
                    <input
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-300"
                      placeholder="Ej. Barrio San José, Sector 3"
                      value={newProject.location || ''}
                      onChange={e => setNewProject({ ...newProject, location: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block tracking-wider">Dinero Necesario</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                        <input
                          className="w-full p-4 pl-8 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono text-slate-900 text-lg"
                          placeholder="0.00"
                          value={newProject.budget}
                          onChange={e => setNewProject({ ...newProject, budget: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block tracking-wider">Avance %</label>
                      <div className="relative">
                        <input
                          type="number"
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono text-slate-900 text-lg"
                          placeholder="0"
                          value={newProject.progress}
                          onChange={e => setNewProject({ ...newProject, progress: e.target.value })}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleInitiateSave}
                    disabled={!newProject.name || isSaving}
                    className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-xl shadow-slate-900/20 active:scale-[0.98] flex items-center justify-center gap-3 text-lg mt-4"
                  >
                    {isSaving ? '⏳ Procesando...' : editingIndex !== null ? '💾 Guardar Cambios' : '🛡️ Registrar en Blockchain'}
                  </button>

                  {editingIndex !== null && (
                    <button onClick={() => { setEditingIndex(null); setNewProject({ name: '', budget: '', progress: '', description: '', location: '' }); }} className="w-full py-2 text-slate-400 text-xs font-bold uppercase hover:text-slate-600">Cancelar Edición</button>
                  )}
                </div>
              </div>
            </div>

            {/* COL 2: Sidebar (Wallet + Form) */}
            <div className="lg:col-span-5 space-y-6">

              {/* Wallet Card */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full"></div>
                <h3 className="font-bold text-lg mb-4 relative z-10 flex items-center gap-2">
                  <span>🏦</span> {session.user.role === 'community' ? 'Recibir Fondos (Wallet)' : 'Tesorería Digital'}
                </h3>

                <div className="space-y-4 relative z-10">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Cuenta App</span>
                    <div className="font-mono text-xs text-slate-300 truncate bg-black/20 p-2 rounded">{session.user.walletAddress || 'No asignada'}</div>
                  </div>

                  <div className={`p-4 rounded-2xl border transition-colors ${walletAddress ? 'bg-emerald-900/30 border-emerald-500/30' : 'border-dashed border-slate-700 bg-white/5'}`}>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Llave Freighter (Externa)</span>
                    {walletAddress ? (
                      <div className="font-mono text-xs text-emerald-300 truncate bg-emerald-950/50 p-2 rounded border border-emerald-500/20 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        {walletAddress}
                      </div>
                    ) : (
                      <button
                        onClick={connectFreighter}
                        disabled={isConnecting}
                        className="w-full mt-1 py-3 bg-white text-slate-900 text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {isConnecting ? '⏳ Conectando...' : '🔗 Conectar Wallet'}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={showQrCode}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.98] border border-emerald-400/20"
                  >
                    📥 Ver QR para Fondear
                  </button>
                </div>
              </div>

              {/* Stats Cards (Compact Row) */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">Presupuesto</div>
                  <div className="text-sm font-bold text-slate-900 truncate" title={`$${totalBudget.toLocaleString()}`}>${totalBudget.toLocaleString()}</div>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">Proyectos</div>
                  <div className="text-sm font-bold text-slate-900">{activeProjects}</div>
                </div>
                <div className="bg-emerald-600 p-3 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                  <div className="text-[10px] font-bold text-emerald-100 uppercase tracking-wide truncate">Red</div>
                  <div className="text-sm font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></span>
                    Testnet
                  </div>
                </div>
              </div>

              {/* Project List (Compact) */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">📂 Expedientes</h3>
                  <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                    {projects.length}
                  </span>
                </div>
                <div className="max-h-[500px] overflow-y-auto p-4 custom-scrollbar">
                  {projects.length === 0 ? (
                    <div className="text-center py-8 opacity-50">
                      <p className="text-2xl mb-1">📋</p>
                      <p className="text-xs">Sin expedientes</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.map((p, idx) => {
                        const pct = parseInt(p.progress) || 0;
                        return (
                          <div key={idx} className={`border rounded-xl p-3 hover:shadow-sm transition-all text-sm ${editingIndex === idx ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                            <div className="flex justify-between mb-2 items-start">
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-900 truncate">{p.name}</h4>
                                <p className="text-xs text-slate-500 font-mono truncate">${p.budget}</p>
                              </div>
                              <div className="flex gap-1 shrink-0 ml-2">
                                <button
                                  onClick={() => { setNewProject({ ...p, description: p.description || '', location: p.location || '' }); setEditingIndex(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(idx)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                <span>Avance</span>
                                <span>{pct}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        )}

        {/* REVIEW MODAL */}
        <TransactionReviewModal
          isOpen={showReview}
          onClose={() => setShowReview(false)}
          onConfirm={handleSaveConfirmed}
          data={pendingProject || { name: '', budget: '', progress: '', description: '', location: '' }}
          isSubmitting={isSaving}
          signingMethod={walletAddress ? 'freighter' : 'local'}
          destinationAddress={walletAddress || session?.user?.walletAddress}
        />
        <FundingModal
          isOpen={fundingModalOpen}
          onClose={() => setFundingModalOpen(false)}
          onConfirm={handleConfirmFunding}
          projectName={selectedProjectForFunding?.name || ''}
          isSubmitting={isSaving}
        />
        <ProjectDetailsModal
          isOpen={!!viewProject}
          onClose={() => setViewProject(null)}
          project={viewProject}
        />
      </main>
    </div>
  );
}
