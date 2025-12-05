'use client';

import React from 'react';

interface LandingPageProps {
  onStartSession: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartSession }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background Spheres */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-20 px-6 pt-6 border-b border-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between py-4">
          <div className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
              <span className="text-white font-bold text-2xl">🏦</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl">EBAS</span>
              <span className="text-xs text-purple-300">Sistema de Crédito</span>
            </div>
          </div>
          
          <button
            onClick={onStartSession}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
          >
            Empezar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 pt-20 pb-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="text-purple-300 text-sm font-semibold">🚀 Plataforma de Crédito Blockchain</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
              Acceso a Crédito
            </span>
            <br />
            <span className="text-white">Seguro y Verificado</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
            Obtén tu puntuación de crédito verificada con biometría y accede a fondos 
            instantáneamente. Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Stellar Blockchain</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onStartSession}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 text-lg flex items-center justify-center gap-2"
            >
              Crear Cuenta
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            
            <button
              onClick={onStartSession}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg text-lg backdrop-blur-sm"
            >
              Aprende Más
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center text-center">
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-3">✓</div>
              <p className="text-gray-300 font-medium">Sin Contraseñas</p>
              <p className="text-xs text-gray-500">Biometría segura</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-3">⚡</div>
              <p className="text-gray-300 font-medium">Instantáneo</p>
              <p className="text-xs text-gray-500">Decisión en segundos</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-3">🌍</div>
              <p className="text-gray-300 font-medium">Blockchain</p>
              <p className="text-xs text-gray-500">Transacciones verificadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 px-6 py-20 bg-gradient-to-b from-purple-500/5 to-transparent border-y border-white/5">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
            ¿Cómo Funciona?
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">3 pasos para acceder a crédito verificado</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group relative">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all min-h-fit">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Registro Seguro</h3>
                <p className="text-gray-400">
                  Crea tu cuenta usando biometría con WebAuthn. Tus datos nunca salen de tu dispositivo.
                </p>
              </div>
              <div className="absolute -right-4 top-12 hidden md:block text-purple-500/40">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-8 border border-blue-500/20 hover:border-blue-500/50 transition-all min-h-fit">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Puntuación Rápida</h3>
                <p className="text-gray-400">
                  Nuestro algoritmo calcula tu score de crédito al instante basado en datos verificados.
                </p>
              </div>
              <div className="absolute -right-4 top-12 hidden md:block text-blue-500/40">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-8 border border-green-500/20 hover:border-green-500/50 transition-all min-h-fit">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Fondos Instantáneos</h3>
                <p className="text-gray-400">
                  Recibe USDC en tu wallet. Desde 6% APR. Sin intermediarios ni retrasos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">
            Características Principales
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">Una plataforma pensada para tu seguridad</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🔑", title: "WebAuthn", desc: "Autenticación biométrica" },
              { icon: "📊", title: "Scoring", desc: "Puntuación instantánea" },
              { icon: "🔐", title: "Blockchain", desc: "Encriptación en red" },
              { icon: "⚡", title: "Rápido", desc: "Respuesta en segundos" },
              { icon: "🌐", title: "Global", desc: "Accesible desde cualquier lugar" },
              { icon: "💰", title: "USDC", desc: "Stablecoin en Stellar" },
              { icon: "📱", title: "Mobile", desc: "Completamente responsive" },
              { icon: "✓", title: "Verificado", desc: "Datos auditados" },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Tecnología Blockchain</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: "⭐", name: "Stellar", desc: "Red de pagos" },
                { icon: "🚀", name: "Soroban", desc: "Smart Contracts" },
                { icon: "🔐", name: "WebAuthn", desc: "Biometría" },
                { icon: "💳", name: "USDC", desc: "Moneda estable" },
              ].map((tech, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{tech.icon}</div>
                  <h3 className="font-bold text-white">{tech.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 px-6 py-20 text-center">
        <div className="inline-block mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
          <span className="text-purple-300 text-sm font-semibold">¿Listo para comenzar?</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-6">Accede a Crédito Verificado Hoy</h2>
        <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
          Crea tu cuenta en segundos y obtén acceso a fondos instantáneamente
        </p>
        <button
          onClick={onStartSession}
          className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 text-lg"
        >
          Empezar Ahora
        </button>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8">
        <div className="mx-auto max-w-7xl text-center text-gray-500 text-sm">
          <p>© 2024 EBAS Credit Score. Impulsado por Stellar y WebAuthn.</p>
          <p className="mt-2 text-xs text-gray-600">Transacciones seguras y verificadas en blockchain</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;