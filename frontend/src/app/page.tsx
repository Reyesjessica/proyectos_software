"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen font-sans selection:bg-emerald-200" style={{ backgroundImage: "url('/landing-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="min-h-screen bg-white/90 backdrop-blur-sm">

        {/* Navigation */}
        <nav className="relative z-20 border-b border-slate-100 bg-white/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-bold text-xl">🏛️</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-slate-900">Comunichain</span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Gestión Pública</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-500 hover:text-emerald-600 font-medium transition-colors">Características</a>
              <a href="#security" className="text-slate-500 hover:text-emerald-600 font-medium transition-colors">Blockchain</a>
            </div>

            {/* Officer Access Button Removed */}
          </div>
        </nav>

        {/* Hero Section with 3 Roles */}
        <div className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/3 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-50 rounded-full blur-3xl -z-10 opacity-50 -translate-x-1/3 translate-y-1/4"></div>

          <div className="mx-auto max-w-7xl px-6 text-center">
            <div className="inline-block mb-6 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="text-emerald-700 text-sm font-bold tracking-wide">🚀 Gobernanza Descentralizada en Stellar</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 leading-tight">
              Transparencia Total <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                Para Tu Comunidad
              </span>
            </h1>

            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed">
              Plataforma blockchain para la gestión inmutable de recursos públicos.
              <br />
              <span className="font-semibold text-slate-700">Selecciona tu perfil para continuar:</span>
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* 1. Gobierno */}
              <div className="group bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                    🏛️
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Funcionario</h3>
                  <p className="text-slate-500 mb-8 min-h-[3rem]">
                    Gestiona presupuestos, aprueba obras y registra avances oficiales.
                  </p>
                  <Link href="/login?role=official" className="block w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                    Ingreso Gobierno
                  </Link>
                </div>
              </div>

              {/* 2. Presidente Comunidad */}
              <div className="group bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                    🤝
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Líder Comunitario</h3>
                  <p className="text-slate-500 mb-8 min-h-[3rem]">
                    Solicita financiamiento para obras y supervisa el uso de recursos.
                  </p>
                  <Link href="/login?role=community" className="block w-full py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all">
                    Ingreso Comunidad
                  </Link>
                </div>
              </div>

              {/* 3. Ciudadanos */}
              <div className="group bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                    👁️
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Ciudadanía</h3>
                  <p className="text-slate-500 mb-8 min-h-[3rem]">
                    Consulta el estado de proyectos y audita el gasto público.
                  </p>
                  <Link href="/public-dashboard" className="block w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                    Ver Portal Público
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 bg-white text-center border-t border-slate-100">
          <p className="text-slate-400 text-sm">© 2025 Comunichain. Construido sobre Stellar Network.</p>
        </footer>
      </div>
    </div>
  );
}
