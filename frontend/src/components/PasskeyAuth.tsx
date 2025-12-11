"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SessionManager } from "@/lib/session";
import { usePasskey } from "@/hooks/usePasskey";

export function PasskeyAuth() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  // Use REAL Passkey hook (WebAuthn)
  const { isSupported, isLoading, error, createPasskey, authenticate, clearError } = usePasskey();

  const handleRegister = async () => {
    const normalizedUsername = username.trim().toLowerCase();
    if (!normalizedUsername) {
      setStatus("❌ Por favor ingresa un nombre de usuario");
      return;
    }

    clearError();
    setStatus("🔐 Creando Passkey con WebAuthn...");

    try {
      // Create REAL Passkey using WebAuthn
      const result = await createPasskey(username);

      if (!result.success) {
        setStatus(`❌ Error: ${result.error}`);
        return;
      }

      // Persist credential on this device and create session
      setStatus("✅ Passkey creado! Guardando en este dispositivo...");

      try {
        await SessionManager.createSession(
          normalizedUsername,
          result.credentialId!,
          `${normalizedUsername}@ebas.demo`,
          role || undefined
        );

        setStatus(`✅ Registrado y conectado como ${normalizedUsername}`);
        setTimeout(() => router.push('/dashboard'), 800);
        return;
      } catch (e) {
        console.error('Error creating session after local save', e);
        setStatus('❌ Error guardando la sesión localmente');
        return;
      }

    } catch (err) {
      console.error('Registration error:', err);
      setStatus(`❌ Error al registrar: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const handleAuthenticate = async () => {
    clearError();
    setStatus("🔐 Autenticando con Passkey...");

    try {
      // Authenticate using REAL WebAuthn
      const result = await authenticate();

      if (!result.success) {
        setStatus(`❌ Error: ${result.error}`);
        return;
      }

      setStatus("✅ Autenticado! Verificando sesión...");

      // Get stored credentials from localStorage to find username
      const normalizedUsername = username.trim().toLowerCase();
      const storedCreds = localStorage.getItem('passkey-credentials');
      if (!storedCreds) {
        setStatus("❌ No se encontraron credenciales guardadas");
        return;
      }

      const credentials = JSON.parse(storedCreds);
      // Buscar por username normalizado
      let credential = credentials.find((c: any) => c.username === normalizedUsername);
      // Si no existe, buscar por credentialId (por si el usuario cambió el nombre)
      if (!credential && result.credentialId) {
        credential = credentials.find((c: any) => c.credentialId === result.credentialId);
        // Si se encuentra, actualizar el nombre de usuario
        if (credential) {
          credential.username = normalizedUsername;
          localStorage.setItem('passkey-credentials', JSON.stringify(credentials));
        }
      }
      if (!credential) {
        setStatus("❌ Credencial no reconocida. Por favor registra tu Passkey primero.");
        return;
      }


      // Recuperar wallet asociada al usuario
      let walletAddress = credential.walletAddress;
      if (!walletAddress) {
        // Si no existe, crear una nueva (solo la primera vez)
        walletAddress = await SessionManager.getWalletAddress();
      }

      // Crear sesión con la wallet recuperada (SessionManager genera/recupera wallet internamente)
      await SessionManager.createSession(
        credential.username,
        result.credentialId!,
        credential.email || `${credential.username}@ebas.demo`,
        role || credential.role
      );

      setStatus(`✅ ¡Bienvenido de vuelta, ${credential.username}!`);

      // Redirect to dashboard after 1 segundo
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

    } catch (err) {
      console.error('Authentication error:', err);
      setStatus(`❌ Error al autenticar: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-8 border border-red-500/20 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-6xl mb-4 inline-block">⚠️</div>
          <h2 className="text-2xl font-bold mb-4 text-white">
            Passkeys No Soportados
          </h2>
          <p className="text-gray-300 mb-3">
            Tu navegador no soporta WebAuthn/Passkeys. Por favor usa un navegador moderno
            como Chrome, Safari, o Edge.
          </p>
          <p className="text-sm text-gray-400">
            En producción, asegúrate de usar HTTPS.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent rounded-2xl p-8 space-y-6 border border-purple-500/20 backdrop-blur-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
          <span className="text-purple-300 text-sm font-semibold">🔐 Autenticación Segura</span>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-white">
          Acceso con Passkey
        </h2>
        <p className="text-gray-400">
          Usa tu biometría para autenticarte de forma segura
        </p>
      </div>

      {/* Campo de usuario */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-semibold mb-3 text-gray-300"
        >
          Nombre de Usuario
        </label>
        <div className="relative">
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tu nombre de usuario"
            className="w-full px-4 py-3 rounded-lg border border-purple-500/20 bg-purple-500/5 text-white placeholder-gray-500 focus:border-purple-500/50 focus:bg-purple-500/10 focus:outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
            disabled={isLoading}
          />
          <span className="absolute right-3 top-3 text-xl">👤</span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <button
          onClick={handleRegister}
          disabled={isLoading || !username.trim()}
          className="group px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 disabled:scale-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Creando...</span>
            </>
          ) : (
            <>
              <span className="text-lg">🆕</span>
              <span>Crear Passkey</span>
            </>
          )}
        </button>

        <button
          onClick={handleAuthenticate}
          disabled={isLoading}
          className="group px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transform hover:scale-105 disabled:scale-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Autenticando...</span>
            </>
          ) : (
            <>
              <span className="text-lg">🔓</span>
              <span>Autenticar</span>
            </>
          )}
        </button>
      </div>

      {/* Mensaje de estado */}
      {(status || error) && (
        <div
          className={`p-4 rounded-xl border backdrop-blur-sm transition-all ${error
              ? "bg-red-500/10 text-red-200 border-red-500/30"
              : status.includes("✅")
                ? "bg-green-500/10 text-green-200 border-green-500/30"
                : "bg-blue-500/10 text-blue-200 border-blue-500/30"
            }`}
        >
          <p className="text-sm font-medium break-words flex items-center gap-2">
            <span>{error?.charAt(0) === '❌' ? '❌' : status?.charAt(0) || 'ℹ'}</span>
            <span>{error || status}</span>
          </p>
        </div>
      )}

      {/* Características */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-purple-500/10">
        <div className="text-center">
          <div className="text-2xl mb-1">🔒</div>
          <p className="text-xs text-gray-400">Encriptado</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">⚡</div>
          <p className="text-xs text-gray-400">Instantáneo</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">📱</div>
          <p className="text-xs text-gray-400">Local</p>
        </div>
      </div>

      {/* Info de seguridad */}
      <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/20">
        <p className="text-xs text-blue-300 text-center">
          ✓ Tus datos biométricos nunca salen de tu dispositivo
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
