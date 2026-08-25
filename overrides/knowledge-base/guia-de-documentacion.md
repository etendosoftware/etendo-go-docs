---
title: Guía de Documentación — Etendo Go
tags:
  - guia-de-estilo
  - documentacion
---

# Guía de Documentación para Etendo Go

## 1. Arquitectura de la Información

### Estructura del sitio

La organización general del sitio sigue una jerarquía de cuatro niveles (actualizado 2026-08-06 para reflejar la estructura real de carpetas del repositorio, que agrupa los módulos bajo categorías temáticas de nivel superior):

- **Página de inicio**: grilla de grupos temáticos (3 columnas) con tarjetas que muestran: icono + nombre del grupo + descripción en una línea + cantidad de artículos + avatares de autores.
- **Grupos temáticos**: carpetas de nivel 1 dentro de `docs/es/`, cada una reúne uno o más módulos funcionales relacionados. Grupos actuales: **Primeros pasos**, **Comercial** (Contactos, Ventas), **Operaciones** (Compras, Inventario), **Finanzas** (Activos, Amortización), y las categorías aún no desarrolladas Configuración y Dashboard. RRHH, CRM, Proyectos, Analítica y TPV todavía no tienen grupo asignado en el repo — al incorporarlos, decidir si son grupo propio o módulo dentro de uno existente antes de crear la carpeta.
- **Módulos**: carpetas de nivel 2, una por área funcional del producto (ej. Ventas y Contactos dentro de Comercial; Compras e Inventario dentro de Operaciones). Cada módulo tiene su propia página de descripción general ("¿Qué es la sección X?").
- **Colecciones**: subcategorías dentro de un módulo que agrupan artículos por tema. Por ejemplo, dentro de Ventas → "Configuración de facturación", "Documentos de ventas", "Preguntas frecuentes". En módulos chicos, la colección puede quedar implícita (los artículos viven directamente bajo el módulo).
- **Artículos**: hojas del sitio. Nunca mezclar tipos de artículo dentro de una misma subcolección.

### Patrón de profundidad

```
Inicio
└── Grupo temático (nivel 1, ej. "Operaciones")
    └── Módulo (nivel 2, ej. "Compras")
        ├── [2-3 artículos de descripción general al inicio]
        ├── Subcolección: "Configuración"
        ├── Subcolección: "Documentos / Operaciones"
        ├── Subcolección: "Cumplimiento / Legal" (si aplica)
        ├── Subcolección: "Importación / Migración" (si aplica)
        └── Subcolección: "Preguntas frecuentes"
```

Ejemplo real: `docs/es/operaciones/compras/que-es-la-seccion-compras/que-es-la-seccion-compras.md` — grupo "Operaciones", módulo "Compras", artículo "¿Qué es la sección Compras?".

### Cantidad de artículos por categoría

- Priorizar profundidad donde la complejidad es alta (Ventas: ~77 artículos; Primeros pasos: ~26).
- Categorías pequeñas (1-5 artículos) son válidas para integraciones específicas o funcionalidades puntuales.

## 2. Tipos de Artículo

Definir exactamente 6 tipos y usarlos de forma consistente. Cada artículo debe ser de un solo tipo: nunca mezclar una guía con una FAQ en la misma página.

| Tipo | Propósito | Ejemplo |
|:-----|:----------|:--------|
| Descripción general | ¿Qué es esta funcionalidad? ¿Por qué existe? | "¿Qué es la sección de Ventas?" |
| Guía de inicio | Configuración secuencial desde cero | "Facturación: guía de inicio" |
| Artículo de tarea | Cómo hacer una cosa específica | "Crear una factura de venta" |
| Referencia / Glosario | Definiciones, explicación de campos | "Glosario de Ventas" |
| Referencia de ventana / Gestión | Cómo consultar y administrar una ventana ya poblada de registros: vista lista, vista detalle/formulario, estados y acciones disponibles | "Gestionar tus facturas de compra" |
| Preguntas frecuentes | Resolución de problemas, casos borde | "App móvil: preguntas frecuentes" |

## 3. Estilo y Tono de Escritura

### Principios fundamentales

- **Cercano pero profesional**: no corporativo ni demasiado informal. Tratar al lector como un profesional capaz.
- **Segunda persona, siempre**: dirigirse al usuario como "tú". Usar "puedes", nunca comandos sin contexto.
- **Lenguaje orientado al beneficio**: explicar el para qué antes del cómo. ("Para que tus facturas reflejen la información correcta, completa los siguientes campos...")
- **Lenguaje claro**: evitar tecnicismos. Si un término técnico es necesario, definirlo en línea la primera vez o enlazar al glosario.
- **Voz activa**: "Haz clic en Guardar", no "El botón Guardar debe ser presionado".
- **Tiempo presente**: describir lo que ocurre ahora, no lo que "ocurrirá".

### Ejemplos de tono

- ✅ CORRECTO: "Una vez creada tu cuenta, inicia sesión para comenzar a configurar lo básico."
- ✅ CORRECTO: "De este modo, podrás empezar a trabajar cómodamente sin perder un segundo."
- ❌ INCORRECTO: "El usuario debe proceder a configurar los parámetros del sistema."
- ❌ INCORRECTO: "En esta sección se explicará el proceso de creación de facturas."

### Nivel de lectura

Apuntar a un nivel intermedio. Oraciones cortas. Una idea por oración. Dividir explicaciones largas en viñetas.

## 4. Plantillas de Estructura de Artículos

### Artículo de descripción general

```
H1: [Nombre de la funcionalidad] — qué es ("¿Qué es...?")
[1-2 párrafos de apertura: definición + beneficio principal]
[Opcional: video embebido]

H2: [Capacidad principal 1]
  - Lista de viñetas (etiqueta en negrita + descripción en 1 línea)

H2: [Capacidad principal 2]
  ...

H2: Recursos / Próximos pasos
  - Enlaces a guías de inicio relacionadas

[CTA o frase de cierre]
[Artículos relacionados: máximo 3 enlaces]
```

### Guía de inicio / Configuración

```
H1: [Módulo]: Guía de inicio
[1 oración de contexto: "Una vez creada tu cuenta..."]

H2: 1. [Primer paso — título con verbo de acción]
  [Breve explicación en prosa]
  [Sub-pasos numerados si son necesarios]
  [Captura de pantalla]

H2: 2. [Segundo paso]
  ...

H2: [N]. Recursos y próximos pasos
```

Cada H2 en una guía de configuración va numerado y representa un paso discreto y completable.

### Artículo de tarea

```
H1: Cómo [hacer algo específico]
[1 oración de apertura: qué cubre este artículo y cuándo es necesario]
[Prerrequisitos si los hay — viñeta breve]

H2: [Grupo de pasos 1]
  [Pasos numerados]
  [Captura de pantalla después del paso clave]

H2: [Grupo de pasos 2 si es necesario]
  ...

[Artículos relacionados: máximo 3 enlaces]
```

### Referencia de ventana / Gestión

```
H1: [Nombre de la ventana en plural o "Gestionar tus [documentos]"]
[1 oración de apertura: qué cubre este artículo y enlace al artículo de tarea de creación si existe]

H2: Vista Lista
  [Columnas de la vista lista, filtros disponibles]
  [Captura de pantalla]

H2: Vista Detalle
  [Información e íconos de la vista detalle, acciones rápidas]
  [Captura de pantalla]

H2: Estados del Documento
  [Tabla de estados con descripción]

H2: Acciones Disponibles
  [Tabla de acciones con descripción y estado en que aplican]
  [Sub-secciones para popups o flujos de gestión adicionales]

[Artículos relacionados: máximo 3 enlaces]
```

### Artículo de referencia / glosario

```
H1: [Módulo / Funcionalidad]: Referencia / Glosario

H2: [Término, campo o parámetro]
  [Definición de 1-2 oraciones. Si aplica: tipo de dato, valores posibles, valor por defecto o unidad.]

H2: [Siguiente término, campo o parámetro]
  ...

[Artículos relacionados]
```

### Artículo de preguntas frecuentes

```
H1: [Módulo / Funcionalidad]: Preguntas frecuentes

H2: [Pregunta formulada como la haría el usuario]
  [Respuesta de 1-3 oraciones. Si es procedimental: pasos numerados.]

H2: [Siguiente pregunta]
  ...

[Artículos relacionados]
```

## 5. Convenciones de Formato

### Encabezados

- **H1**: solo el título del artículo — uno por página.
- **H2**: secciones principales o pasos numerados.
- **H3**: usar con moderación, sólo cuando el contenido de un H2 necesita sub-agrupación.
- Nunca saltarse niveles (no pasar de H1 a H3).

### Formato de texto

| Elemento | Convención |
|:---------|:-----------|
| Botón o etiqueta de UI | Negrita (ej. **Guardar**, **Nueva factura**) |
| Ruta de navegación | Links con separador `>`: Configuración > Cuenta > Preferencias |
| Nombre de campo | Negrita |
| Concepto importante | Negrita en la primera mención |
| Artículos enlazados | Hipervínculo en línea, no al pie de página |
| Valores del sistema | Usar backticks |
| Advertencias / notas importantes | Admonitions de MkDocs (`!!! warning`, `!!! tip`, `!!! info`) con un título breve entre comillas — actualizado 2026-08-24 para reflejar la convención ya en uso en todos los artículos publicados; no usar blockquotes (`>`) para este caso |

### Listas

- Listas sin orden: para funcionalidades, opciones o conceptos sin orden requerido.
- Listas ordenadas: para pasos que deben seguirse en secuencia.
- Listas anidadas: aceptable un nivel de profundidad; evitar más niveles.
- Cada elemento de lista: una idea, conciso, estructura paralela.

### Párrafos

- Máximo 3-4 oraciones por párrafo.
- Un concepto por párrafo.
- Dejar una línea en blanco entre párrafos y entre un párrafo y una lista.

### Imágenes y capturas de pantalla

- Colocar la captura inmediatamente después del encabezado de la sección, antes del texto explicativo: el lector ve primero el contexto visual y después la descripción (actualizado 2026-08-06, según la convención vigente en los artículos ya publicados).
- La `<figcaption>` de la captura debe describir qué muestra la imagen; al ir la captura antes del texto, esa leyenda cumple el rol de contexto y el párrafo que sigue no necesita repetir una referencia textual a la imagen.
- Usar capturas anotadas (flechas, resaltados) para interfaces complejas.
- No insertar videos en medio de guías de tareas — interrumpen la lectura.

## 6. Navegación y Enlazado

- **Artículos en navegación**: todo artículo debe aparecer en la navegación — sin páginas huérfanas.
- **Artículos relacionados**: máximo 3 enlaces al final de cada artículo. Siempre presentes, nunca omitidos.
- **Enlaces contextuales en línea**: enlazar de forma natural dentro del texto. No usar "haz clic aquí" — usar texto ancla descriptivo.
- **Enlaces entre colecciones**: aceptables y recomendados cuando la funcionalidad se superpone.
- **Enlaces externos**: abrir en pestaña nueva.

## 7. Estándares para Páginas de Categoría y Colección

Cada página de colección debe tener:

- Un título y una descripción en una línea.
- 1-3 artículos de descripción general anclados al inicio (fuera de las subcolecciones).
- Subcolecciones agrupadas por tema (no alfabéticamente).
- Vista previa de artículos con: título + descripción en una línea.

Orden recomendado de subcolecciones:

1. Configuración
2. Operaciones principales
3. Cumplimiento legal
4. Importación/Migración
5. Preguntas frecuentes

## 8. Estándares de Metadatos de Artículos

Cada artículo debe tener los siguientes metadatos completos:

- **Título**: descriptivo, orientado a la acción o en forma de pregunta. Máximo ~60 caracteres.
- **Tags**: mínimo 3, relacionados directamente al contenido de la página.
- **Autor** y **Fecha de última actualización**: visibles en el artículo, pero se resuelven automáticamente vía el plugin `git-committers` (a partir del historial de git del archivo). **No** agregar `author:` ni `date:` a mano en el front matter — eso genera datos falsos/desactualizados y ningún artículo del repo lo hace hoy.

## 9. Guías de Extensión de Contenido

| Tipo de artículo | Extensión objetivo |
|:------------------|:--------------------|
| Descripción general | 400-700 palabras |
| Guía de inicio | 600-1.200 palabras |
| Artículo de tarea | 300-600 palabras |
| Referencia / Glosario | Variable (definición por término) |
| Preguntas frecuentes | 200-500 palabras (suma de Q&A) |

Más corto es mejor. Si un artículo supera estos rangos, evaluar dividirlo en dos artículos enlazados — pero no es una regla absoluta: cuando el contenido cubre variantes estrechamente relacionadas de un mismo flujo (por ejemplo, distintas formas de completar el mismo popup o pantalla), mantenerlo en un solo artículo puede ser preferible a fragmentar la navegación, aunque supere el rango objetivo (actualizado 2026-08-24, caso de referencia: `anadir-pagos-a-tu-factura-de-venta.md`).

## 10. Qué Evitar

- Sin lenguaje de marketing: en artículos de tarea — reservarlo solo para artículos de descripción general.
- Sin asumir conocimiento previo del usuario — siempre indicar los prerrequisitos.
- Sin bloques de texto densos: cualquier bloque de más de 4 oraciones se convierte en lista o se divide.
- Sin saltarse la introducción: incluso los artículos de tarea necesitan una oración orientadora antes de los pasos.
- Sin contenido redundante: si dos artículos cubren pasos superpuestos, enlazar en vez de duplicar.
- Sin callejones sin salida: todo artículo termina con artículos relacionados o un enlace al paso siguiente.

## 11. Estándares de Capturas de Pantalla

### Dimensiones y formato

- Resolución mínima: 1280px de ancho.
- Formato: PNG.
- Relación de aspecto: mantener la proporción original — nunca estirar ni recortar de forma arbitraria.
- Área de captura: mostrar solo la sección relevante de la interfaz, no la pantalla completa, salvo que el contexto lo requiera.

### Herramientas de anotación

Usar una herramienta consistente en todo el equipo. Las anotaciones permitidas son:

- **Recuadros**: para delimitar una sección de la interfaz. El recuadro debe ser color amarillo Etendo (`#FFD000`). Respetarlo en todas las imágenes del sitio.
- **Numeración**: para correlacionar pasos del texto con elementos en la imagen.

### Datos sensibles

- Nunca capturar emails reales, nombres de clientes, datos fiscales ni información financiera real.
- Usar datos de ejemplo visiblemente ficticios: `empresa@ejemplo.com`, "Empresa Demo S.L.", montos como `1.000,00 EUR`.
- Si la captura ya existe con datos reales, enmascarar con un bloque de color sólido — no usar blur ni pixelado.

### Texto alternativo (alt text)

- Obligatorio en todas las imágenes.
- Describir qué muestra la captura, no solo "imagen 1".
- Ejemplo correcto: "Formulario de configuración de datos de facturación con los campos de dirección completados".
- La barra de URL del navegador no debe aparecer en las capturas, salvo que la URL sea parte de la instrucción.

## 12. Nomenclatura de URLs (Slugs)

### Patrón general

| Tipo | Patrón | Ejemplo |
|:-----|:-------|:--------|
| Tarea | `como-[verbo]-[objeto]` | `como-crear-una-factura-de-venta` |
| Descripción general | `que-es-[modulo]` | `que-es-el-modulo-de-ventas` |
| Guía de inicio | `[modulo]-guia-de-inicio` | `ventas-guia-de-inicio` |
| Guía avanzada | `[modulo]-guia-avanzada` | `ventas-guia-avanzada` |
| FAQ | `[modulo]-preguntas-frecuentes` | `ventas-preguntas-frecuentes` |
| Glosario | `glosario-de-[modulo]` | `glosario-de-ventas` |

### Reglas

- Solo minúsculas, sin tildes, sin caracteres especiales.
- Separar palabras con guiones (`-`), nunca con guion bajo (`_`) ni espacios.
- Máximo 60 caracteres por slug.
- No incluir el nombre del módulo padre si ya está en la ruta de la colección.
- No usar fechas ni números de versión en el slug (envejecen mal).

## 13. Series Multi-Parte

### Cuándo usar una serie vs. un artículo largo

- **Serie**: cuando hay 3 o más etapas claramente diferenciadas, cada una completable de forma independiente en una sesión de trabajo.
- **Artículo largo**: cuando los pasos son cortos y el usuario los completa de corrido sin interrupciones.

### Estructura de cada parte

```
H1: Paso [N]: [Título de la parte]
[1 oración indicando en qué punto de la serie está el usuario]
[Prerrequisito: enlace a la parte anterior si aplica]

[Contenido del paso]

H2: ¿Qué sigue?
[Enlace explícito a la parte siguiente con una oración de contexto]
[Enlace a la parte anterior para quienes necesiten volver]
```

### Convenciones de navegación entre partes

- El título de cada artículo debe incluir el número de paso: "Paso 1:", "Paso 2:", "Paso 3:".
- Al final de cada parte, incluir siempre un bloque "¿Qué sigue?" con el enlace a la siguiente parte.
- La última parte incluye un bloque "Has completado la serie" con enlaces a recursos avanzados.
- La colección que agrupa la serie debe mostrar los artículos en orden estricto.

### Slugs para series

```
[perfil]-paso-1-[descripcion]
[perfil]-paso-2-[descripcion]
[perfil]-paso-3-[descripcion]
```

Ejemplo:

```
agencias-paso-1-configura-tu-cuenta
agencias-paso-2-adapta-la-plataforma
agencias-paso-3-implementa-en-tu-equipo
```

## 14. Guías por Perfil de Usuario / Sector

### Cuándo crear una guía por perfil

- El flujo de trabajo del perfil difiere significativamente del flujo genérico.
- El perfil usa solo un subconjunto de módulos.
- Las decisiones de configuración varían según el sector.

### Tipos de perfil a considerar

- **Por tipo de negocio**: servicios, productos básicos, comercio mayorista, agencias.
- **Por rol de usuario**: administrador, contador, operador, vendedor.
- **Por nivel de experiencia**: usuario nuevo, usuario intermedio, usuario avanzado.

### Estructura de una guía por perfil

```
H1: [Plataforma] para [perfil]: tu punto de partida
[Párrafo de apertura: para quién es esta guía y qué problema resuelve]

H2: ¿Qué módulos vas a usar principalmente?
[Lista de módulos relevantes para este perfil con descripción de 1 línea]

H2: 1. Configura tu cuenta para [perfil]
[Enlace a la guía de configuración general + particularidades del perfil]

H2: 2. [Flujo de trabajo central para este perfil]
...

H2: Recursos adicionales para [perfil]
[Links a guías avanzadas, tutoriales en video, casos de uso del sector]
```

Señalar con una nota destacada cuando una funcionalidad es exclusiva de cierto plan o requiere configuración adicional.

## 15. Guías de Inicio vs. Guías Avanzadas

### Qué va en cada nivel

| Guía de inicio | Guía avanzada |
|:----------------|:---------------|
| Configuración mínima para empezar a operar | Configuraciones opcionales y personalizaciones |
| Casos de uso más frecuentes | Casos de uso específicos o poco comunes |
| Funciones incluidas en todos los planes | Funciones de planes superiores |
| Sin prerrequisitos de conocimiento | Asume que la guía de inicio fue completada |
| Máximo 7-8 secciones | Sin límite de secciones, puede ser más larga |

### Enlace entre niveles

- La guía de inicio cierra con: "¿Ya dominas los conceptos básicos? Continúa con la Guía avanzada →".
- La guía avanzada abre con: "Esta guía asume que ya completaste la configuración básica. Si aún no lo hiciste, empieza por la Guía de inicio →".
- Nunca llamarlas "básica" y "avanzada" en el título visible — usar "Guía de inicio" y "Guía avanzada" para que el nivel quede claro sin implicar inferioridad.

## 16. SEO y Búsqueda Interna

### Meta title

- Formato: `[Título del artículo] | [Nombre del Help Center]`
- Ejemplo: `Cómo crear una factura de venta | Etendo Docs`
- Longitud máxima: 60 caracteres para el título del artículo (antes del separador).
- El meta title puede diferir ligeramente del H1 si el H1 es muy largo, pero deben ser consistentes.

### Meta description

- 1 oración que resume lo que aprende o puede hacer el usuario tras leer el artículo.
- Longitud: 140-155 caracteres.
- Incluir el nombre de la funcionalidad principal y un verbo de acción.
- Ejemplo: "Aprende a crear, personalizar y enviar facturas de venta desde el módulo de Facturación."
- Agregar siempre el campo `description:` en el frontmatter con este texto (actualizado 2026-08-24: el soporte en mkdocs ya está habilitado y es la convención en uso en todos los artículos publicados).

### Optimización del contenido para búsqueda

- Incluir el término principal de búsqueda en el primer párrafo del artículo.
- El H1 debe coincidir con cómo el usuario buscaría ese tema.
- Usar los mismos términos que usa la interfaz del producto — si el botón dice "Nueva factura", el artículo dice "Nueva factura".
- No usar sinónimos distintos para el mismo elemento de UI en el mismo artículo.
- Los títulos de artículos son el principal insumo para la búsqueda interna — comenzar con el sustantivo principal, no con el verbo.
