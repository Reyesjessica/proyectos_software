

El presente documento establece el Plan de Calidad para el proyecto DigiPesos, una plataforma de pagos digitales desarrollada sobre la red Stellar, con el objetivo de promover la inclusión financiera en Latinoamérica. Este plan busca definir los criterios, procedimientos y estándares necesarios para asegurar que el producto final cumpla con los requisitos funcionales, técnicos y de experiencia de usuario.
El enfoque metodológico está basado en el modelo MoProSoft para gestión de calidad en proyectos de software, combinado con principios de desarrollo ágil, herramientas de automatización de pruebas, control de versiones, y entrega continua (CI/CD). Este plan está diseñado para ser escalable, adaptable y sostenible, facilitando tanto el desarrollo inicial como futuras iteraciones del sistema.
DigiPesos se posiciona como una solución segura, transparente y accesible que permitirá realizar pagos, transferencias y conversiones de moneda digital de manera eficiente, apoyándose en los beneficios tecnológicos de la blockchain Stellar.

OBJETIVOS DE CALIDAD
Los principales objetivos del plan de calidad de DigiPesos son los siguientes:
•	Funcionalidad: Garantizar que el producto cumpla completamente con los requisitos funcionales establecidos desde la etapa de análisis, incluyendo todos los flujos de usuario esenciales.
•	Seguridad y Estabilidad: Asegurar que la plataforma sea robusta ante fallos, errores de operación y amenazas de seguridad, especialmente considerando el manejo de activos digitales.
•	Experiencia de Usuario: Lograr una interfaz intuitiva, rápida y accesible, que favorezca la adopción del sistema por parte de públicos diversos.
•	Escalabilidad y Mantenibilidad: Diseñar el sistema para que sea fácilmente escalable (nuevas funcionalidades, aumento de usuarios) y mantenible a lo largo del tiempo, reduciendo costos técnicos futuros.
•	Transparencia y Control de Cambios: Mantener versiones claras y documentadas, permitiendo trazabilidad en cada fase de desarrollo y despliegue.




 MÉTRICAS DE CALIDAD
Las siguientes métricas han sido definidas para evaluar el nivel de calidad alcanzado durante y después del desarrollo:
1. Código fuente:
•	Cobertura de pruebas unitarias igual o superior al 80%, medido con herramientas como Jest o Coverage.
•	Cantidad máxima de incidencias críticas en producción: 2 o menos en el primer mes.
2. Experiencia del usuario:
•	Calificación promedio en pruebas de usabilidad (UAT o encuestas): mínimo 4.0 sobre 5.
•	Tasa de adopción temprana: al menos 60% de los usuarios registrados deben estar activos en los primeros 30 días.
3. Desempeño técnico:
•	Tiempo promedio de respuesta en la plataforma (APIs y front-end): ≤ 500 milisegundos en condiciones normales.
•	Disponibilidad del sistema (uptime): ≥ 99% mensual.

4. Documentación:
•	Manual de usuario y documentación técnica completados al 100% antes del despliegue oficial.
•	Diagrama actualizado de arquitectura y flujos de datos al final de cada sprint mayor.

PROCEDIMIENTOS Y ACTIVIDADES DE CALIDAD
Revisión de Requisitos
•	Los requisitos serán documentados en detalle y revisados por el equipo de desarrollo y producto.
•	Se realizará una validación externa (idealmente con un asesor técnico del ecosistema Stellar).
•	Los requisitos no entrarán en desarrollo hasta tener una aprobación formal y priorización clara.

Revisión de Diseño

•	La arquitectura del sistema será revisada por el líder técnico antes del inicio de implementación.
•	Las interfaces de usuario serán validadas mediante mockups interactivos y feedback temprano de usuarios.
•	Se utilizarán diagramas UML y flujos de datos para asegurar el entendimiento técnico del sistema.

Revisión de Código (Code Review)
•	Todo el código pasará por un proceso de revisión cruzada antes de ser fusionado en la rama principal.
•	Se aplicarán reglas de estilo mediante linters, y análisis estático para detectar vulnerabilidades.
•	Se fomentará el uso de pair programming y revisión colectiva cuando sea necesario.

Estrategia de Pruebas
•	Pruebas unitarias: Automatizadas para cada componente, ejecutadas en cada commit mediante CI/CD.
•	Pruebas de integración: Validan interacción entre módulos (por ejemplo, front-end y API).
•	Pruebas funcionales: Casos de uso críticos validados manual o automáticamente.
•	Pruebas de Aceptación de Usuario (UAT): Realizadas con usuarios reales en entorno pre-producción.

GESTIÓN DE CONFIGURACIÓN Y LIBERACIÓN
Control de Versiones
•	Todo el proyecto será gestionado mediante GitHub, con ramas específicas para desarrollo (dev), pruebas (staging) y producción (main).
•	Se usarán pull requests para revisión de cambios antes de fusionar.
•	La documentación técnica y el manual del usuario también se mantendrán en repositorio.


Versionado
•	Se adoptará el esquema de versionado semántico (SemVer): MAJOR.MINOR.PATCH (ej. v1.2.0).
•	Cada versión estará acompañada de un changelog detallado, indicando nuevas funciones, correcciones y mejoras.

Plan de Liberación
•	Para cada versión del producto se definirá:
•	Listado de funcionalidades incluidas.
•	Fecha estimada de despliegue y canal de distribución.
•	Procedimiento para rollback en caso de errores en producción.
•	Comunicación oficial vía redes sociales, comunidad Stellar y documentación pública.

 DOCUMENTACIÓN
Código: Todo el código debe estar comentado correctamente y seguir una guía de estilo acordada.
Manual del Usuario: Se entregará un manual accesible en español e inglés, con capturas de pantalla, paso a paso y preguntas frecuentes (FAQ).
Documentación Técnica / Arquitectura
Documento técnico que incluye:
•	Componentes principales del sistema.
•	Tecnologías utilizadas (ej. Node.js, React, Stellar SDK).
•	Diagrama de arquitectura y flujo de datos.
•	Protocolo de comunicación entre servicios.

Plan de Pruebas
Documento que incluye:
•	Objetivos de pruebas.
•	Casos de prueba.
•	Resultados esperados.
•	Resultados obtenidos y observaciones.

MEJORA CONTINUA

•	Al final de cada sprint se realizará una retrospectiva del equipo, incluyendo un apartado sobre calidad técnica y de producto.
•	Se revisarán las métricas de calidad establecidas en este plan para evaluar el progreso.
•	Se generarán acciones correctivas o preventivas si se detectan desviaciones.
•	Se abrirá un canal de comunicación para que los usuarios den feedback sobre errores, mejoras o ideas futuras.

 CIERRE DEL PROYECTO Y VALIDACIÓN FINAL
Antes de considerar finalizado el proyecto se deberán cumplir las siguientes actividades:
•	Validación final con usuarios reales, mediante pruebas piloto o lanzamientos cerrados.
•	Entrega de toda la documentación en el repositorio oficial de DigiPesos (código, manuales, pruebas, arquitectura).
•	Elaboración de un informe de calidad final, detallando:
•	Nivel de cumplimiento de métricas.
•	Incidencias abiertas o resueltas.
•	Estado de documentación.
•	Recomendaciones para próximas versiones.

Este cierre garantiza la transparencia y la trazabilidad del trabajo realizado ante la comunidad Stellar y posibles financiadores.
