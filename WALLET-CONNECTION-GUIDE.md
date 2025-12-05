# 🏦 Guía Completa: Conectar Wallet Stellar a tu Proyecto

## 📱 ¿Qué has recibido?

He creado 3 componentes nuevos para conectar wallets de diferentes formas:

### Archivos Creados:
1. **`src/components/WalletConnector.tsx`** - Componente UI con 3 opciones
2. **`src/app/api/check-account/route.ts`** - API para validar direcciones
3. **`src/app/wallet/page.tsx`** - Página dedicada a conexión
4. **`src/hooks/useWallet.ts`** - Hook para usar wallet en otros componentes

---

## 🚀 Inicio Rápido

### 1️⃣ Ver la página de conexión

```bash
# Inicia el servidor
npm run dev

# Abre: http://localhost:3001/wallet
```

### 2️⃣ Usar el componente en tu código

```tsx
import { WalletConnector } from "@/components/WalletConnector";

export default function MyPage() {
  return <WalletConnector />;
}
```

### 3️⃣ Usar el hook en componentes

```tsx
"use client";
import { useWallet } from "@/hooks/useWallet";

export function MyComponent() {
  const wallet = useWallet();

  return (
    <div>
      {wallet.connected ? (
        <p>✅ Conectado: {wallet.publicKey}</p>
      ) : (
        <button onClick={wallet.connectAuto}>
          Crear Wallet
        </button>
      )}
    </div>
  );
}
```

---

## 📋 Las 3 Opciones de Conexión

### OPCIÓN 1: 🆕 Crear Nueva Wallet (Recomendado para MVP)

**Qué hace:**
- Genera automáticamente un par de claves Stellar
- Guarda todo localmente en el navegador
- Seguro para desarrollo/testing

**Ventajas:**
- ✅ Rápido y simple
- ✅ No requiere extensiones
- ✅ Funciona en cualquier navegador
- ✅ Clave privada controlada localmente

**Desventajas:**
- ⚠️ Solo en ese navegador/dispositivo
- ⚠️ Clave privada en localStorage (no producción)
- ⚠️ Se pierde si borras localStorage

**Código para usarlo:**

```tsx
const wallet = useWallet();
await wallet.connectAuto();
// wallet.publicKey - tu dirección
// wallet.secretKey - tu clave privada
```

---

### OPCIÓN 2: 🔗 Conectar con Freighter (Producción)

**Qué hace:**
- Se conecta a la extensión Freighter del navegador
- El usuario controla totalmente sus fondos
- La app nunca ve la clave privada

**Ventajas:**
- ✅ Más seguro (clave privada nunca sale del navegador)
- ✅ Multi-wallet soportado
- ✅ Estándar de la industria
- ✅ Usuario mantiene control total

**Desventajas:**
- ⚠️ Requiere instalar Freighter (freighter.app)
- ⚠️ Solo en navegadores que tengan la extensión

**Pasos para usar Freighter:**

1. **Instala la extensión:**
   - Chrome: https://chromewebstore.google.com/detail/freighter/bcacfldlkkdogcfffnkmnlbdmcckakqe
   - Firefox: https://addons.mozilla.org/firefox/addon/freighter/

2. **Crea una wallet en Freighter** (o importa una existente)

3. **Conecta desde tu app:**

```tsx
const wallet = useWallet();
await wallet.connectFreighter();
// wallet.publicKey - tu dirección
// Freighter maneja las firmas automáticamente
```

4. **Para firmar transacciones:**

```tsx
const signedXdr = await wallet.signTransaction(xdr);
// Freighter te pide confirmación en un popup
```

---

### OPCIÓN 3: ✏️ Importar Wallet Existente (Manual)

**Qué hace:**
- Ingresa la dirección pública de una wallet existente
- Válida la dirección en Stellar testnet/mainnet
- Bueno para importar wallets de otros servicios

**Ventajas:**
- ✅ Importa wallets existentes
- ✅ Sin clave privada almacenada
- ✅ Solo para transacciones solo-lectura

**Desventajas:**
- ⚠️ Sin firma de transacciones (solo lectura)
- ⚠️ No puedes enviar dinero (necesitas clave)

**Código:**

```tsx
const wallet = useWallet();
await wallet.connectManual("GDJYLRW4DZK7LVGCNAKBO42FGWVDRP2G7BEAXWWUC5E63ZENZ3RAPAKL");
// wallet.publicKey - la dirección
// No tiene secretKey
```

---

## 💰 ¿Cómo Obtener Dinero de Prueba (XLM)?

### Testnet (Gratis para desarrollo)

```bash
# 1. Abre Friendbot en el navegador:
https://friendbot.stellar.org/?addr=TUDIRECCION

# O usa curl:
curl "https://friendbot.stellar.org/?addr=TUDIRECCION"

# O desde tu código:
fetch("https://friendbot.stellar.org/?addr=" + wallet.publicKey)
```

### Mainnet (Dinero real)

- Compra XLM en exchange (Kraken, Binance, etc.)
- O recibe transferencias de otros usuarios

---

## 🔐 Seguridad

### ✅ Seguro:
- Usar Freighter (extensión oficial)
- Nunca compartir clave privada
- Usar HTTPS en producción
- Validar direcciones antes de enviar dinero

### ❌ NO Hagas:
- ~~Guardar secretKey en localStorage (MVP ok, producción NO)~~
- ~~Usar secretKey en requests HTTP~~
- ~~Compartir tu .env con secretKeys~~
- ~~Subir secretKeys a GitHub~~

### 🔧 Mejoras para Producción:

```tsx
// En lugar de guardar en localStorage:
// 1. Usa Web Crypto API para cifrar
// 2. Guarda en IndexedDB
// 3. Mejor aún: Usa Freighter para todo

// Ejemplo: Cifrar secretKey
async function encryptSecretKey(secretKey: string) {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  // ... cifrar ...
}
```

---

## 📊 Flujo Completo: Crear y Usar Wallet

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario abre /wallet                                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Elige opción:                                            │
│    - Crear nueva (🆕) → Genera keypair automático           │
│    - Freighter (🔗)   → Conecta a extensión                │
│    - Manual (✏️)      → Ingresa dirección                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Se valida y guarda                                       │
│    - localStorage (Auto)                                    │
│    - Freighter (no guardamos)                               │
│    - Blockchain (Manual)                                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Usuario puede usar la wallet para:                       │
│    - Ver balance                                            │
│    - Hacer transacciones                                    │
│    - Firmar mensajes                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Integración con Tu Dashboard

### Opción A: Mostrar Wallet en Dashboard

```tsx
// En src/app/dashboard/page.tsx

"use client";
import { useWallet } from "@/hooks/useWallet";

export default function Dashboard() {
  const wallet = useWallet();

  return (
    <div>
      <h1>Dashboard</h1>
      {wallet.connected && (
        <div>
          <p>📍 Wallet: {wallet.publicKey}</p>
          <p>🔑 Método: {wallet.method}</p>
        </div>
      )}
    </div>
  );
}
```

### Opción B: Proteger rutas requiriendo wallet

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import Link from "next/link";

export default function ProtectedPage() {
  const wallet = useWallet();
  const router = useRouter();

  if (!wallet.connected) {
    return (
      <div className="text-center py-12">
        <p>❌ Necesitas conectar una wallet primero</p>
        <Link href="/wallet" className="text-blue-400 underline">
          Conectar Wallet →
        </Link>
      </div>
    );
  }

  return <div>✅ Contenido protegido</div>;
}
```

---

## 📝 Ejemplo: Hacer una Transacción

```tsx
import { useWallet } from "@/hooks/useWallet";
import {
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
} from "@stellar/stellar-sdk";

export function SendPayment() {
  const wallet = useWallet();

  const handleSend = async () => {
    if (!wallet.publicKey) return;

    // 1. Construir transacción
    const transaction = new TransactionBuilder(
      new Account(wallet.publicKey, 123), // 123 = sequence number
      {
        fee: "100",
        networkPassphrase: Networks.TESTNET_NETWORK_PASSPHRASE,
      }
    )
      .addOperation(
        Operation.payment({
          destination: "GDWZCMK5VIHZGRT7LANXVUR3NJFSGHMBNAKFVXYT4UHZWGR25MXLBBQ",
          asset: Asset.native(),
          amount: "100", // 100 XLM
        })
      )
      .setTimeout(300)
      .build();

    // 2. Firmar transacción
    let signedXdr;
    if (wallet.method === "auto") {
      // Usar clave privada local
      signedXdr = wallet.signTransactionLocal(transaction.toXDR());
    } else if (wallet.method === "freighter") {
      // Freighter firma
      signedXdr = await wallet.signTransaction(transaction.toXDR());
    }

    // 3. Enviar a red
    const response = await fetch("/api/send-transaction", {
      method: "POST",
      body: JSON.stringify({ xdr: signedXdr }),
    });

    const result = await response.json();
    console.log("✅ Transacción:", result.hash);
  };

  return (
    <button onClick={handleSend} disabled={!wallet.connected}>
      💸 Enviar 100 XLM
    </button>
  );
}
```

---

## 🐛 Troubleshooting

### "Freighter no está instalado"
→ Descárgalo de https://freighter.app

### "Invalid Stellar address format"
→ Asegúrate que empiece con 'G' y tenga 56 caracteres

### "Account does not exist"
→ Crea la cuenta primero con Friendbot (fondea con XLM de prueba)

### "Transaction failed: insufficient balance"
→ Fondea más XLM primero

### "Clave privada no se guarda"
→ Verifica que localStorage está habilitado (no en navegación privada)

---

## 📚 Referencias

- Stellar SDK: https://docs.stellar.org/tools/js-stellar-sdk
- Freighter: https://freighter.app
- Testnet: https://stellar.expert/explorer/testnet
- Friendbot: https://friendbot.stellar.org
- Horizon API: https://developers.stellar.org/api/introduction/

---

## ✨ Próximos Pasos

1. **Integra el componente** en tus páginas
2. **Prueba las 3 opciones** de conexión
3. **Haz tu primer pago** usando la wallet conectada
4. **Conecta con Smart Contracts** (Soroban)
5. **Almacena datos** de wallet en base de datos

¿Preguntas? Revisa los archivos creados - están bien comentados. 🎉
