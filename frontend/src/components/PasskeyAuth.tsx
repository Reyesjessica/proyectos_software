"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SessionManager } from "@/lib/session";
import { usePasskey } from "@/hooks/usePasskey";

export function PasskeyAuth() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"qr" | "device">("qr");
  const router = useRouter();
  
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

      if (deliveryMethod === "device") {
        // Persist credential on this device and create session
        setStatus("✅ Passkey creado! Guardando en este dispositivo...");

        try {
          await SessionManager.createSession(
            normalizedUsername,
            result.credentialId!,
            `${normalizedUsername}@ebas.demo`
          );

          setStatus(`✅ Registrado y conectado como ${normalizedUsername}`);
          setTimeout(() => router.push('/dashboard'), 800);
          return;
        } catch (e) {
          console.error('Error creating session after local save', e);
          setStatus('❌ Error guardando la sesión localmente');
          return;
        }
      }

      // Otherwise deliver via QR for mobile storage
      setStatus("✅ Passkey creado! Generando QR para transferencia a móvil...");

      try {
        // Generate a wallet keypair without persisting locally
        // @ts-ignore - dynamic import of SessionManager helper
        const { generateWalletNoPersist } = await import("@/lib/session");
        const wallet = generateWalletNoPersist(normalizedUsername);

        const payload = {
          username: normalizedUsername,
          credentialId: result.credentialId,
          // publicKey is a Uint8Array; serialize as base64 for QR transfer
          publicKey: result.publicKey ? btoa(String.fromCharCode(...Array.from(result.publicKey))) : undefined,
          walletAddress: wallet.publicKey,
          generatedAt: new Date().toISOString(),
        };

        const payloadStr = JSON.stringify(payload);

        // Try to generate QR locally (preferred) using the lightweight 'qrcode' lib.
        // This avoids external API failures and URL length limits.
        try {
          const QRCode = await import('qrcode');
          const dataUrl = await QRCode.toDataURL(payloadStr, { width: 400 });
          setQrPayload(dataUrl);
        } catch (e) {
          // Fallback to public QR generator if the package isn't installed or fails
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(payloadStr)}`;
          setQrPayload(qrUrl);
        }
        setShowQR(true);
        setStatus("🔎 Escanea el QR con tu teléfono para guardar la credencial allí.");
      } catch (e) {
        console.error('Error generating QR payload', e);
        setStatus('❌ Error generando QR');
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
        credential.email || `${credential.username}@ebas.demo`
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
      <div className="glass rounded-2xl p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Passkeys Not Supported
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your browser doesn't support WebAuthn/Passkeys. Please use a modern
            browser like Chrome, Safari, or Edge.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Also ensure you're using HTTPS in production.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-8 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
          Prueba el sistema
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Crea o inicia sesión con tu Passkey
        </p>
      </div>

      {/* Campo de usuario */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
        >
          Usuario
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Escribe tu usuario"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Método de entrega */}
      <div className="pt-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          ¿Cómo quieres recibir la Passkey?
        </label>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="delivery"
              value="qr"
              checked={deliveryMethod === "qr"}
              onChange={() => setDeliveryMethod("qr")}
              className="form-radio text-purple-600"
            />
            <span className="text-sm">Por QR (escanea en tu teléfono)</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="delivery"
              value="device"
              checked={deliveryMethod === "device"}
              onChange={() => setDeliveryMethod("device")}
              className="form-radio text-purple-600"
            />
            <span className="text-sm">Guardar en este equipo</span>
          </label>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleRegister}
          disabled={isLoading || !username.trim()}
          className="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Crear Passkey</span>
            </>
          )}
        </button>

        <button
          onClick={handleAuthenticate}
          disabled={isLoading}
          className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              <span>Autenticar</span>
            </>
          )}
        </button>
      </div>

      {/* QR preview (cuando se genera) */}
      {showQR && qrPayload && (
        <div className="mt-4 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center space-y-3">
          <p className="text-sm mb-2">Escanea este código con la cámara o app de tu teléfono:</p>
          <img src={qrPayload} alt="QR de transferencia de passkey" className="mx-auto w-56 h-56 rounded-md shadow" />

          {/* (JSON raw removed per user request) */}

          <div className="mt-3 flex justify-center gap-3">
            <button
              onClick={() => {
                setShowQR(false);
                setQrPayload(null);
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm"
            >Cerrar</button>
          </div>
        </div>
      )}

      {/* Mensaje de estado */}
      {(status || error) && (
        <div
          className={`p-4 rounded-lg ${
            error
              ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
              : status.includes("✅")
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
              : "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
          }`}
        >
          <p className="text-sm font-medium break-words">{error || status}</p>
        </div>
      )}

      {/* Info del navegador */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          🔒 Tus datos biométricos nunca salen de tu dispositivo
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
