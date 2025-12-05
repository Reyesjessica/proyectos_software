"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background Spheres */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-6 pt-6 border-b border-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
              <span className="text-white font-bold text-2xl">🏦</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl">EBAS</span>
              <span className="text-xs text-purple-300">Credit Score</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Características</a>
            <a href="#security" className="text-gray-300 hover:text-white transition-colors">Seguridad</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">Acerca de</a>
          </div>

          <Link 
            href="/register"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
          >
            Empezar
          </Link>
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
            <span className="text-white">Seguro y Rápido</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
            Obtén puntuación de crédito verificada por biometría con tecnología Stellar. 
            Sin contraseñas, sin complicaciones, solo <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">seguridad blockchain</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/register"
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 text-lg"
            >
              Crear Cuenta con Passkey
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            
            <Link
              href="/login"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg text-lg backdrop-blur-sm"
            >
              Ya tengo cuenta
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🔐</div>
              <p className="text-gray-300 text-sm">Sin Contraseñas</p>
              <p className="text-xs text-gray-500">Biometría segura</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-gray-300 text-sm">Instantáneo</p>
              <p className="text-xs text-gray-500">Resultado en segundos</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🌍</div>
              <p className="text-gray-300 text-sm">Blockchain</p>
              <p className="text-xs text-gray-500">Transacciones transparentes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 px-6 py-20 bg-gradient-to-b from-purple-500/5 to-transparent border-y border-white/5">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
            Características Principales
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg max-w-2xl mx-auto">
            Una plataforma diseñada para ofrecer seguridad, velocidad y transparencia
          </p>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: "🔑", title: "WebAuthn", desc: "Autenticación biométrica" },
              { icon: "📊", title: "Scoring", desc: "Puntuación instantánea" },
              { icon: "🔐", title: "Secure", desc: "Encriptación blockchain" },
              { icon: "⚡", title: "Rápido", desc: "Respuesta en segundos" },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div id="security" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-8 border border-blue-500/20">
            <h2 className="text-3xl font-bold text-white mb-6">🛡️ Seguridad Garantizada</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="text-2xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Credenciales Locales</h3>
                  <p className="text-sm text-gray-400">Tus datos nunca salen de tu dispositivo</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Blockchain Verificado</h3>
                  <p className="text-sm text-gray-400">Transacciones en red Stellar</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Sin Terceros</h3>
                  <p className="text-sm text-gray-400">Control total sobre tu información</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Auditable</h3>
                  <p className="text-sm text-gray-400">Historial transparente e inmutable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="relative z-10 px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">¿Listo para comenzar?</h2>
        <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
          Crea tu cuenta en segundos y obtén acceso a crédito seguro y verificado
        </p>
        <Link
          href="/register"
          className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 text-lg"
        >
          Empezar Ahora
        </Link>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8">
        <div className="mx-auto max-w-7xl text-center text-gray-500 text-sm">
          <p>© 2024 EBAS Credit Score. Impulsado por Stellar y WebAuthn.</p>
        </div>
      </footer>
    </div>
  );
}
