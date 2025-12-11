'use client';

import { Suspense } from 'react';
import { PasskeyAuth } from '@/components/PasskeyAuth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function LoginContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const getTitle = () => {
    switch (role) {
      case 'official': return 'Acceso Oficial';
      case 'community': return 'Acceso Comunitario';
      default: return 'Iniciar Sesión';
    }
  };

  const getSubtitle = () => {
    switch (role) {
      case 'official': return 'Bienvenido, Funcionario.';
      case 'community': return 'Bienvenido, Presidente.';
      default: return 'Accede con tu Passkey biométrico';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20 shadow-xl">
            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{getTitle()}</h1>
          <p className="text-slate-300">{getSubtitle()}</p>
        </div>

        {/* Componente de autenticación */}
        <PasskeyAuth />

        {/* Enlaces de pie de página */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm mb-3">
            ¿No tienes cuenta?
          </p>
          <Link
            href={`/register${role ? `?role=${role}` : ''}`}
            className="inline-block px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all border border-white/10"
          >
            Crear cuenta nueva
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900"></div>}>
      <LoginContent />
    </Suspense>
  );
}
