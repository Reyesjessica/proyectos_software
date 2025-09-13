# 📑 Plan de Calidad - Proyecto DigiPesos

El presente documento establece el **Plan de Calidad** para el proyecto **DigiPesos**, una plataforma de pagos digitales desarrollada sobre la red **Stellar**, con el objetivo de promover la inclusión financiera en Latinoamérica.  

Este plan busca definir los criterios, procedimientos y estándares necesarios para asegurar que el producto final cumpla con los requisitos funcionales, técnicos y de experiencia de usuario.  

El enfoque metodológico está basado en el modelo **MoProSoft** para gestión de calidad en proyectos de software, combinado con principios de **desarrollo ágil**, herramientas de **automatización de pruebas**, **control de versiones**, y **entrega continua (CI/CD)**.  

Este plan está diseñado para ser escalable, adaptable y sostenible, facilitando tanto el desarrollo inicial como futuras iteraciones del sistema.  

DigiPesos se posiciona como una solución **segura, transparente y accesible** que permitirá realizar pagos, transferencias y conversiones de moneda digital de manera eficiente, apoyándose en los beneficios tecnológicos de la **blockchain Stellar**.  

---

## 🎯 Objetivos de Calidad

Los principales objetivos del plan de calidad de DigiPesos son los siguientes:

- **Funcionalidad**: Garantizar que el producto cumpla completamente con los requisitos funcionales establecidos desde la etapa de análisis.  
- **Seguridad y Estabilidad**: Asegurar que la plataforma sea robusta ante fallos, errores de operación y amenazas de seguridad.  
- **Experiencia de Usuario**: Lograr una interfaz intuitiva, rápida y accesible para públicos diversos.  
- **Escalabilidad y Mantenibilidad**: Diseñar el sistema para que sea fácilmente escalable y mantenible a lo largo del tiempo.  
- **Transparencia y Control de Cambios**: Mantener versiones claras y documentadas con trazabilidad en cada fase.  

---

## 📊 Métricas de Calidad

### Código Fuente
- Cobertura de pruebas unitarias ≥ 80% (Jest, Coverage).  
- Máx. incidencias críticas en producción: ≤ 2 en el primer mes.  

### Experiencia del Usuario
- Calificación promedio en UAT o encuestas: mínimo **4.0 / 5**.  
- Tasa de adopción temprana: ≥ 60% de usuarios activos en los primeros 30 días.  

### Desempeño Técnico
- Tiempo de respuesta (APIs/front-end): ≤ 500 ms.  
- Disponibilidad (uptime): ≥ 99% mensual.  

### Documentación
- Manual de usuario y documentación técnica completados al **100%** antes del despliegue.  
- Diagrama actualizado de arquitectura y flujos de datos al final de cada sprint mayor.  

---

## 🛠️ Procedimientos y Actividades de Calidad

### Revisión de Requisitos
- Documentación detallada y revisión por el equipo.  
- Validación externa con un asesor técnico del ecosistema Stellar.  
- Aprobación formal antes de desarrollo.  

### Revisión de Diseño
- Revisión de arquitectura por el líder técnico.  
- Validación de interfaces mediante mockups y feedback de usuarios.  
- Uso de diagramas UML y flujos de datos.  

### Revisión de Código (Code Review)
- Revisión cruzada antes de fusionar en rama principal.  
- Uso de linters y análisis estático.  
- Pair programming y revisiones colectivas cuando sea necesario.  

### Estrategia de Pruebas
- **Unitarias**: Automatizadas en cada commit vía CI/CD.  
- **Integración**: Validan interacción entre módulos.  
- **Funcionales**: Casos críticos validados manual/automático.  
- **UAT**: Con usuarios reales en pre-producción.  

---

## 🔄 Gestión de Configuración y Liberación

### Control de Versiones
- Repositorio en **GitHub** con ramas: `dev`, `staging`, `main`.  
- Pull requests obligatorios para fusiones.  
- Documentación y manual del usuario en repositorio.  

### Versionado
- Esquema **SemVer**: `MAJOR.MINOR.PATCH` (ej. v1.2.0).  
- Cada versión con changelog detallado.  

### Plan de Liberación
- Listado de funcionalidades incluidas.  
- Fecha estimada de despliegue.  
- Procedimiento de rollback en caso de errores.  
- Comunicación oficial vía redes sociales, comunidad Stellar y docs públicas.  

---

## 📚 Documentación

- **Código**: Comentado y siguiendo guía de estilo.  
- **Manual del Usuario**: Español e inglés, con capturas y FAQ.  
- **Documentación Técnica**:  
  - Componentes principales del sistema.  
  - Tecnologías utilizadas (Node.js, React, Stellar SDK).  
  - Diagrama de arquitectura y flujos de datos.  
  - Protocolo de comunicación entre servicios.  
- **Plan de Pruebas**: Objetivos, casos de prueba, resultados esperados y obtenidos.  

---

## ♻️ Mejora Continua

- Retrospectiva al final de cada sprint (incluye calidad técnica y de producto).  
- Revisión periódica de métricas de calidad.  
- Acciones correctivas o preventivas en caso de desviaciones.  
- Canal de comunicación para feedback de usuarios.  

---

## ✅ Cierre del Proyecto y Validación Final

Antes del cierre del proyecto, se deberá cumplir con:  

- Validación final con usuarios reales (pilotos o lanzamientos cerrados).  
- Entrega completa de documentación en el repositorio oficial DigiPesos.  
- Informe de calidad final que detalle:  
  - Cumplimiento de métricas.  
  - Incidencias abiertas/resueltas.  
  - Estado de documentación.  
  - Recomendaciones para futuras versiones.  

Este cierre garantiza la **transparencia y trazabilidad** del trabajo realizado ante la comunidad Stellar y posibles financiadores.  
