# 💸 Guía de Prueba - Sistema de Transacciones

## ✅ Completado

Tu sistema ahora tiene un flujo completo de transacciones blockchain:

### Páginas Nuevas
- **`/transaction`** - Página de envío de transacciones (nueva)
- **Dashboard** - Botón "💸 Transacciones" agregado en la header

### Componentes Creados
- **`SendPayment.tsx`** - Componente para enviar XLM
  - Validación de direcciones Stellar
  - Soporte para Auto Wallet y Freighter
  - Manejo inteligente de errores
  - Enlace a Stellar.Expert para ver transacciones

### APIs Creadas
- **`POST /api/send-payment`** - Crear y firmar transacciones
  - Recibe: sourceAddress, sourceSecret (opcional), destinationAddress, amount
  - Retorna: transactionHash (auto) o xdr (Freighter)
  
- **`POST /api/submit-transaction`** - Enviar transacciones ya firmadas
  - Recibe: xdr (transacción firmada)
  - Retorna: transactionHash, ledger

### Hooks Mejorados
- **`useWallet.ts`** - Soporte para ambos tipos de wallet

---

## 🧪 Cómo Probar

### Paso 1: Iniciar el Servidor
```bash
cd c:\Users\HP\desktop\proyectos_software\frontend
npm run dev
```
El servidor estará en `http://localhost:3000`

### Paso 2: Opción A - Usar Auto Wallet (FÁCIL)

1. Ve a `http://localhost:3000`
2. Regístrate o inicia sesión
3. Haz clic en el botón "🏦 Wallet"
4. Haz clic en "🆕 Crear Nueva Wallet"
5. Copia la dirección que aparece
6. Abre `https://friendbot.stellar.org/?addr=TUDIRECCION`
   - Reemplaza `TUDIRECCION` con tu dirección copiada
7. Espera a que Friendbot confirme (recibir 10,000 XLM gratis)
8. Regresa a `http://localhost:3000/transaction`
9. Llena el formulario:
   - **Dirección de Destino**: Cualquier dirección Stellar válida (ej: otra que crees)
   - **Cantidad**: 100 (XLM)
10. Haz clic en "💸 Enviar XLM"
11. Espera y verás el hash de la transacción

**Resultado esperado**: Recibirás un hash y un enlace a Stellar.Expert

---

### Paso 3: Opción B - Usar Freighter (SEGURO)

1. Instala Freighter: https://freighter.app
2. Crea una wallet en Freighter
3. Ve a `http://localhost:3000`
4. Regístrate o inicia sesión
5. Haz clic en "🏦 Wallet"
6. Haz clic en "🔗 Conectar Freighter"
7. Aprueba la conexión en la extensión
8. Abre `https://friendbot.stellar.org/?addr=TUDIRECCION` (con tu dirección de Freighter)
9. Ve a `http://localhost:3000/transaction`
10. Llena el formulario:
    - **Dirección de Destino**: Otra dirección Stellar
    - **Cantidad**: 50 (XLM)
11. Haz clic en "💸 Enviar XLM"
12. Aproba en la extensión Freighter
13. Verás confirmación y hash

---

## 🔍 Validaciones Implementadas

El sistema valida automáticamente:

✅ Dirección destino válida (formato Stellar G...56 caracteres)
✅ Monto positivo
✅ Monto no exceda 1,000,000 XLM
✅ No enviar a la misma dirección
✅ Wallet conectada
✅ Todos los campos completados

---

## 📊 Ver Transacciones

Una vez que completes una transacción, verás:
- **Hash**: Identificador único de la transacción
- **Monto**: XLM enviados
- **Enlace**: `https://stellar.expert/explorer/testnet/tx/HASH`

En Stellar.Expert puedes ver:
- Detalles de la transacción
- De quién a quién
- Timestamp
- Ledger
- Estado

---

## 🔐 Seguridad

### Auto Wallet
- ⚠️ Clave privada almacenada en localStorage
- ✅ Solo en testnet (sin dinero real)
- ✅ Perfecta para desarrollo y pruebas

### Freighter Wallet
- ✅ Clave privada NUNCA sale de la extensión
- ✅ Transacciones se firman en el navegador
- ✅ Recomendado para producción
- ✅ Funciona en mainnet también

---

## 🆘 Troubleshooting

### "Extensión Freighter no disponible"
- ✅ Solución: Instala Freighter desde https://freighter.app
- ✅ Recarga la página después de instalar

### "Dirección Stellar inválida"
- ✅ Debe comenzar con "G"
- ✅ Debe tener exactamente 56 caracteres
- ✅ Solo caracteres A-Z y 2-7 (base32)

### "No puedes enviar a la misma dirección"
- ✅ Dirección destino debe ser diferente a la tuya

### "Monto inválido"
- ✅ Debe ser un número positivo
- ✅ No puede exceder 1,000,000 XLM
- ✅ Mínimo 0.0001 XLM

### "Friendbot no trabaja"
- ✅ Friendbot da 10,000 XLM cada 24 horas por dirección
- ✅ Si ya fondaste hoy, crea una nueva wallet

---

## 📝 Archivos Creados/Modificados

### Nuevos Archivos
- `frontend/src/app/transaction/page.tsx` - Página de transacciones
- `frontend/src/app/api/send-payment/route.ts` - API crear transacción
- `frontend/src/app/api/submit-transaction/route.ts` - API enviar transacción

### Modificados
- `frontend/src/app/dashboard/page.tsx` - Botón "💸 Transacciones" agregado
- `frontend/src/components/SendPayment.tsx` - Mejorado con validaciones

### Mejoras Realizadas
- ✅ Validación de direcciones Stellar
- ✅ Validación de montos
- ✅ Manejo de errores mejorado
- ✅ Soporte dual Auto + Freighter
- ✅ Interfaz intuitiva
- ✅ Enlaces a Stellar.Expert
- ✅ Info sobre Friendbot

---

## 🚀 Próximos Pasos (Opcionales)

### Para Producción
1. Cambiar a Stellar Mainnet
2. Remover localStorage para claves privadas
3. Solo permitir Freighter
4. Agregar historial de transacciones
5. Mostrar balance en tiempo real
6. Soporte para múltiples activos

### Características Futuras
- Balance display
- Transaction history
- USDC transfers
- Multisig support
- Escrow transfers
- Path payments

---

## 📚 Recursos

- **Stellar SDK**: https://github.com/stellar/js-stellar-sdk
- **Friendbot**: https://friendbot.stellar.org
- **Block Explorer**: https://stellar.expert/explorer/testnet
- **Testnet Horizon**: https://horizon-testnet.stellar.org
- **Freighter**: https://freighter.app

---

**¿Algún problema?** Revisa la consola del navegador (F12) para ver mensajes de error detallados.
