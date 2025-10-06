#   Informe de Pruebas del Proyecto ComuChain

##  Objetivo
Verificar el correcto funcionamiento del sistema, la seguridad de los contratos y la usabilidad de la interfaz Web3 para usuarios comunitarios.

---

##  Pruebas de Seguridad en Smart Contracts

**Responsable:** @Architect  
**Herramientas usadas:** Remix, Hardhat, Chai

- [x] Validación de entradas (solo admins pueden crear proyectos).
- [x] Prevención de sobrescritura de datos.
- [x] Restricción de subida de evidencia solo por responsables.
- [x] Simulación de ataques de inyección.

**Resultado:** Todos los contratos pasaron las pruebas unitarias sin vulnerabilidades detectadas.

---

##  Pruebas Funcionales en Interfaz

**Responsable:** @Developer  
**Escenarios cubiertos:**

1. Registro de nuevo proyecto ✔️  
2. Subida de imagen (.jpg y .png) ✔️  
3. Visualización en tabla pública ✔️  
4. Error al subir sin conexión a wallet ❌ (manejado con alerta)  
5. Prueba en móvil Android (Chrome) ✔️  

**Resultado:**  
La aplicación es funcional, responsiva y clara para usuarios sin experiencia técnica.

---

## Recomendaciones

- Añadir notificaciones visuales más claras en errores de MetaMask.
- Incluir un mini-tutorial al abrir la app por primera vez.
- Crear versión ligera para zonas de baja conectividad.
