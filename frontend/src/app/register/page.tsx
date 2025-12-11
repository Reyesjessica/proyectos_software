'use client';

import { Suspense } from 'react';
import { PasskeyAuth } from '@/components/PasskeyAuth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function RegisterContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const getTitle = () => {
    switch (role) {
      case 'official': return 'Registro Oficial';
      case 'community': return 'Registro Comunitario';
      default: return 'Únete a Comunichain';
    }
  };

  const getSubtitle = () => {
    switch (role) {
      case 'official': return 'Crea tu cuenta de funcionario público';
      case 'community': return 'Registra tu presidencia comunitaria';
      default: return 'Registra tu cuenta para gestionar proyectos';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20 shadow-xl">
            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">{getTitle()}</h1>
          <p className="text-emerald-100/80">{getSubtitle()}</p>
        </div>

        {/* Info Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10 shadow-lg">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Beneficios de unirte
          </h3>
          <ul className="space-y-2 text-base text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Registro inmutable en Stellar
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Transparencia total de fondos
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Auditoría ciudadana en tiempo real
            </li>
          </ul>
        </div>

        {/* Auth Component */}
        <PasskeyAuth />

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm mb-3">
            ¿Ya tienes cuenta?
          </p>
          <Link
            href={`/login${role ? `?role=${role}` : ''}`}
            className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-900/20"
          >
            Iniciar sesión
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-slate-500 hover:text-white text-sm font-medium transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900"></div>}>
      <RegisterContent />
    </Suspense>
  );
}
