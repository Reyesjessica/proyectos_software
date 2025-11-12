"use client";

import React, { useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <nav className="relative z-10 px-6 pt-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🌐</span>
            </div>
            <span className="text-white font-bold text-xl">Comunicahain</span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 px-6 pt-20 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Bienvenido a Comunicahain
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12">
            Plataforma para comunidades donde puedes registrar proyectos, avances y presupuestos en tiempo real, promoviendo la transparencia y colaboración.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              ¿Qué puedes hacer en Comunicahain?
            </h2>
            <ul className="text-left text-gray-200 text-lg space-y-2 mx-auto max-w-xl mb-8">
              <li>✅ Registrar proyectos comunitarios</li>
              <li>✅ Documentar avances y logros</li>
              <li>✅ Gestionar presupuestos en tiempo real</li>
              <li>✅ Fomentar la transparencia y colaboración</li>
              <li>✅ Acceso seguro mediante login con Passkey</li>
            </ul>
            <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
              <a
                href="/register"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-lg"
              >
                Registrar Proyecto
              </a>
              <a
                href="/login"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-lg"
              >
                Ver Proyectos
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}
