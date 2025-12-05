'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PasskeyData {
  credentialId: string;
  publicKey: string;
  accountAddress?: string;
  deviceInfo?: string;
  username?: string;
}

interface DashboardProps {
  passkeyData: PasskeyData;
  onLogout: () => void;
  onAuthenticate?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ passkeyData, onLogout, onAuthenticate }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const shortenString = (str: string, length: number = 20) => {
    if (str.length <= length) return str;
    return `${str.slice(0, length / 2)}...${str.slice(-length / 2)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <nav className="relative z-10 px-6 pt-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex items-center justify-between pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-white font-bold text-2xl">🔐</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl">ComuChain</h1>
              <p className="text-gray-400 text-sm">Credit Scoring Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg px-4 py-2 backdrop-blur-sm border border-green-500/30">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm font-semibold">Conectado</span>
            </div>
            
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg backdrop-blur-sm border border-red-500/30 transition-all duration-200 flex items-center space-x-2 hover:shadow-lg hover:shadow-red-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-6 pt-8 pb-16">
        <div className="mx-auto max-w-7xl">
          {/* Welcome Section with Hero Image */}
          <div className="mb-12 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">
                ¡Bienvenido,{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {passkeyData.username || 'Usuario'}!
                </span>
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                Tu cuenta está protegida con <span className="text-green-400 font-semibold">autenticación biométrica segura</span>. 
                Accede a préstamos instantáneos sin complicaciones.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
                  <span className="text-purple-400">✓</span>
                  <span className="text-gray-300 text-sm">Sin contraseñas</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
                  <span className="text-purple-400">✓</span>
                  <span className="text-gray-300 text-sm">Biometría segura</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
                  <span className="text-purple-400">✓</span>
                  <span className="text-gray-300 text-sm">Pagos blockchain</span>
                </div>
              </div>
            </div>
            
            {/* Hero Illustration */}
            <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent"></div>
              <div className="relative text-center">
                <div className="text-8xl mb-4">🏦</div>
                <p className="text-white font-semibold text-lg mb-2">Sistema de Préstamos Seguro</p>
                <p className="text-gray-300 text-sm">Powered by Stellar Blockchain</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all hover:shadow-lg hover:shadow-green-500/20">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Autenticado</h3>
                  <p className="text-green-400 text-sm">Sesión activa</p>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/20">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Seguridad</h3>
                  <p className="text-blue-400 text-sm">Biométrica</p>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Red</h3>
                  <p className="text-purple-400 text-sm">Stellar</p>
                </div>
              </div>
            </div>
          </div>
                  <h3 className="text-white font-semibold">Seguridad</h3>
                  <p className="text-blue-400 text-sm">Biométrica</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Red</h3>
                  <p className="text-purple-400 text-sm">Stellar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Passkey Information */}
            <div className="lg:col-span-2 bg-gradient-to-br from-white/10 to-purple-500/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-purple-500/40 transition-all">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9l-4 4H2l1.5-1.5A6 6 0 017.257 9.243L9 7h3l4-4h3l-1.5 1.5z" />
                  </svg>
                </div>
                <span>Información de la Cuenta</span>
              </h2>

              <div className="space-y-5">
                {/* Credential ID */}
                <div className="bg-black/20 rounded-xl p-4 border border-white/10 hover:border-purple-500/20 transition-colors">
                  <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">ID de Credencial</label>
                  <div className="flex items-center space-x-2 group">
                    <code className="flex-1 text-green-400 text-sm break-all font-mono bg-black/30 rounded-lg p-3">
                      {shortenString(passkeyData.credentialId, 30)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(passkeyData.credentialId, 'credential')}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg border border-green-500/30 transition-all hover:shadow-lg hover:shadow-green-500/20"
                      title="Copiar credencial"
                    >
                      {copied === 'credential' ? (
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Public Key */}
                <div className="bg-black/20 rounded-xl p-4 border border-white/10 hover:border-blue-500/20 transition-colors">
                  <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Clave Pública (secp256r1)</label>
                  <div className="flex items-center space-x-2 group">
                    <code className="flex-1 text-blue-400 text-sm break-all font-mono bg-black/30 rounded-lg p-3">
                      {shortenString(passkeyData.publicKey, 30)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(passkeyData.publicKey, 'publicKey')}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/20"
                      title="Copiar clave pública"
                    >
                      {copied === 'publicKey' ? (
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Account Address */}
                {passkeyData.accountAddress && (
                  <div className="bg-black/20 rounded-xl p-4 border border-white/10 hover:border-yellow-500/20 transition-colors">
                    <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Dirección Stellar</label>
                    <div className="flex items-center space-x-2 group">
                      <code className="flex-1 text-yellow-400 text-sm break-all font-mono bg-black/30 rounded-lg p-3">
                        {shortenString(passkeyData.accountAddress, 30)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(passkeyData.accountAddress!, 'address')}
                        className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg border border-yellow-500/30 transition-all hover:shadow-lg hover:shadow-yellow-500/20"
                        title="Copiar dirección"
                      >
                        {copied === 'address' ? (
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Panel */}
            <div className="bg-gradient-to-br from-white/10 to-pink-500/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-pink-500/40 transition-all">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-500/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>Inicio Rápido</span>
              </h2>

              <div className="space-y-4"
                {/* Authenticate Button */}
                {onAuthenticate && (
                  <button
                    onClick={onAuthenticate}
                    className="w-full group relative px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 border border-white/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Probar Autenticación</span>
                  </button>
                )}

                {/* Info Cards */}
                <div className="space-y-3 mt-6">
                  <div className="group bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border border-blue-500/30 rounded-xl p-4 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/40 transition-colors">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-blue-300 font-semibold text-sm">Seguridad Máxima</h4>
                        <p className="text-gray-300 text-xs mt-1">
                          Tu passkey nunca abandona tu dispositivo. Biometría local garantizada.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30 rounded-xl p-4 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/20">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/40 transition-colors">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-green-300 font-semibold text-sm">Sesión Activa</h4>
                        <p className="text-gray-300 text-xs mt-1">
                          Tu sesión permanece segura. Valida con biometría en transacciones.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-gradient-to-r from-purple-500/15 to-pink-500/15 border border-purple-500/30 rounded-xl p-4 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-500/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/40 transition-colors">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-purple-300 font-semibold text-sm">Préstamos Instantáneos</h4>
                        <p className="text-gray-300 text-xs mt-1">
                          Obtén crédito sin papeleos en minutos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EBAS Button */}
                <a 
                  href="/ebas-dashboard"
                  className="block w-full mt-6 group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl p-6 text-center transform transition-all hover:scale-105 shadow-lg hover:shadow-pink-500/40 border border-white/20"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                  <div className="relative">
                    <div className="text-4xl mb-2">💰</div>
                    <h4 className="text-white font-bold text-lg mb-1">Sistema de Préstamos</h4>
                    <p className="text-purple-100 text-sm">
                      Accede a tu dashboard de crédito
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-6">✨ Características</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all">
                <div className="text-3xl mb-2">🔐</div>
                <h4 className="text-white font-bold text-sm mb-1">WebAuthn</h4>
                <p className="text-gray-300 text-xs">Estándar de seguridad industrial</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                <div className="text-3xl mb-2">📱</div>
                <h4 className="text-white font-bold text-sm mb-1">Biometría</h4>
                <p className="text-gray-300 text-xs">Face ID, Touch ID, Windows Hello</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="text-white font-bold text-sm mb-1">Instantáneo</h4>
                <p className="text-gray-300 text-xs">Préstamos en segundos</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
                <div className="text-3xl mb-2">🌐</div>
                <h4 className="text-white font-bold text-sm mb-1">Blockchain</h4>
                <p className="text-gray-300 text-xs">Transacciones seguras en Stellar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default Dashboard;