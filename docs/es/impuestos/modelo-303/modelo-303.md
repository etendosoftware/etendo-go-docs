---
title: Modelo 303
tags:
    - Impuestos
    - Fiscalidad
    - IVA
    - Modelo 303
    - Etendo Go
    - Cómo hacer
---

# Modelo 303

El **Modelo 303** es la autoliquidación trimestral (o mensual) del IVA. El IVA es un impuesto que tu empresa repercute a sus clientes en cada venta y, a la vez, soporta en sus propias compras: el Modelo 303 es el mecanismo por el que, cada período, declaras a la Agencia Tributaria la diferencia entre ambos importes. Si el IVA repercutido supera al soportado, ingresas la diferencia; si es al revés, la compensas en períodos siguientes o pides su devolución. En Etendo Go se gestiona desde **[Finanzas > Modelos Fiscales](https://go.etendo.cloud/fiscal-models){target="_blank"}**, donde el sistema calcula automáticamente sus casillas a partir de los impuestos aplicados en tus facturas de venta y de compra del período.

!!! info "Marco normativo del Modelo 303"
    Esta autoliquidación está regulada por la Orden EHA/3786/2008, de 29 de diciembre, con dos modificaciones relevantes recientes:

    - **Autoliquidación rectificativa** — la Orden HAC/819/2024, de 30 de julio, introdujo este sistema para corregir declaraciones ya presentadas (casillas 108 y 111), aplicable desde las declaraciones de septiembre 2024 (mensuales) o del tercer trimestre 2024 (trimestrales).
    - **Pago a cuenta de carburantes** — la Orden HAC/27/2026, de 22 de enero, añadió la deducción del pago a cuenta de entregas de gasolinas, gasóleos y biocarburantes del régimen de depósito distinto del aduanero, aplicable desde las declaraciones de febrero 2026 (mensuales) o del segundo trimestre 2026 (trimestrales).
    - **Periodicidad trimestral** — plazo del 1 al 20 del mes siguiente al trimestre, salvo el cuarto trimestre, que se presenta del 1 al 30 de enero del año siguiente.
    - **Periodicidad mensual** — obligatoria para Grandes Empresas (facturación superior a 6.010.121,04 € el año anterior), grupos de IVA y organizaciones inscritas en el REDEME; el plazo llega hasta el día 30 del mes siguiente (o el último día de febrero para el período de enero).

El proceso completo, de punta a punta, sigue esta secuencia:

1. Activas el Modelo 303 en el Catálogo de modelos (una única vez).
2. Creas una declaración para el año y el período que corresponda.
3. Pulsas **Calcular** para que tome las facturas confirmadas del período.
4. Revisas las pestañas (Casillas, Facturas, Incidencias) y completas los datos pendientes de Identificación, como el **Tipo de declaración**.
5. Pulsas **Generar fichero 303** si vas a presentarlo manualmente en la Sede electrónica de la AEAT.
6. Pulsas **Marcar presentado**: con acuse de recibo, sin acuse, o mediante presentación telemática directa a la AEAT.
7. Si no subiste el justificante al presentar, lo subes después desde la pestaña **Justificante**.

## Antes de Empezar: Activar el Modelo

Para poder crear declaraciones, primero tienes que activar el Modelo 303 en el **Catálogo de modelos**:

1. Ve a **[Finanzas > Modelos Fiscales](https://go.etendo.cloud/fiscal-models){target="_blank"}**.
2. Pulsa **Catálogo de modelos**.
3. Activa el interruptor de **Modelo 303 - Autoliquidación IVA**.

Con el modelo activo, el botón **+ Nueva declaración** queda disponible.

## Cómo Crear una Declaración

1. Pulsa **+ Nueva declaración**.
2. Elige el **Modelo 303** en el selector.
3. Selecciona el **Año** y la **Frecuencia**: **Trimestral** (períodos T1 a T4) o **Mensual** (cuadrícula de los 12 meses).
4. Elige el **Período** correspondiente. El diálogo muestra una vista previa, por ejemplo *"Se creará como Modelo 303 · T2 2026"* para una declaración trimestral, o *"Se creará como Modelo 303 · 01 2026"* para una mensual.
5. Pulsa **Crear declaración**.

La declaración se crea en estado **Borrador** y aparece en el listado de **Declaraciones**, junto al resto de tus modelos activos, con columnas de Modelo, Período, Tipo, Estado, Resultado (*Sin resultado* hasta que pulses Calcular), Incidencias y Última actualización.

<figure markdown="span">
  ![Listado de Declaraciones con dos Modelos 303 y un Modelo 349 en Borrador](assets/modelo-303-1.jpg)
  <figcaption>Listado de Declaraciones: por vencer, pendientes de presentar e incidencias, con el detalle de cada modelo creado.</figcaption>
</figure>

## El Detalle de una Declaración

Dentro de una declaración en **Borrador**, la cabecera resume el período y ofrece tres acciones: **Calcular**, **Generar fichero 303** y **Marcar presentado**.

- **Calcular** — recalcula las casillas a partir de las facturas confirmadas del período **cuyo envío a SII y TicketBAI ya fue aceptado**. Una factura en estado Completado pero con el envío fiscal todavía en *Pendiente* no se incluye hasta que ese envío sea aceptado (ver [SII](../sii/sii.md) y [TicketBAI](../ticketbai/ticketbai.md)).
- **Generar fichero 303** — antes de descargar el fichero para la AEAT, pide confirmar el nombre del fichero (por ejemplo, "303_T3_2026.txt").
- **Marcar presentado** — abre un diálogo para elegir cómo se presentó la declaración:
    - **Con acuse de recibo**: subes en el momento el justificante del portal de la AEAT.
    - **Sin acuse de recibo**: confirmas la presentación sin adjuntar nada todavía; la declaración pasa a **Presentado · Sin acuse**, y puedes subir el justificante más adelante desde la pestaña **Justificante**.
    - **Presentación telemática AEAT**: envía la declaración directamente a la Agencia Tributaria, en producción o en modo de prueba. Pide el NIF y nombre del presentador (el titular del certificado), un NRC opcional y la casilla **Modo de prueba (no requiere certificado)** para probar el envío sin presentar una declaración real. Fuera del modo de prueba, necesitas tener cargado el certificado digital en **[Configuración > Configuración Fiscal](https://go.etendo.cloud/fiscal-config){target="_blank"}** (ver [SII](../sii/sii.md)).

<figure markdown="span">
  ![Declaración en estado Presentado · Sin acuse, sin los botones Calcular ni Marcar presentado](assets/modelo-303-6.jpg)
  <figcaption>Una vez marcada como presentada, la declaración queda en estado <strong>Presentado · Sin acuse</strong>: los botones Calcular y Marcar presentado desaparecen, y solo quedan disponibles Cancelar y Generar fichero 303.</figcaption>
</figure>

!!! info "Estado Presentado · Sin acuse"
    Tras pulsar **Marcar presentado**, la declaración pasa a **Presentado · Sin acuse** hasta que subas el comprobante en la pestaña **Justificante**. En este estado ya no puedes recalcular las casillas ni volver a marcarla como presentada; solo puedes volver a generar el fichero.

!!! warning "Cancelar no reabre una declaración ya presentada"
    A diferencia de otros modelos fiscales de Etendo Go, en el Modelo 303 el botón **Cancelar** siempre te devuelve al listado de Declaraciones sin modificar el estado de la declaración, esté en Borrador o ya Presentada. Si una declaración de Modelo 303 ya fue marcada como presentada, no hay forma de reabrirla a Borrador desde la interfaz para recalcularla con facturas nuevas; para corregirla hay que evaluar con tu asesor fiscal el mecanismo de autoliquidación rectificativa.

Los cuatro indicadores de la cabecera son:

- **Incidencias** — número de facturas o datos con algún problema detectado.
- **IVA devengado** — total del IVA repercutido en tus ventas del período.
- **IVA deducible** — total del IVA soportado en tus compras del período.
- **Resultado** — diferencia entre ambos: a ingresar o a devolver.

### Pestaña Casillas

Organizada en cuatro bloques —**Identificación**, **Liquidación**, **Información adicional** y **Resultado**— reproduce la estructura oficial del Modelo 303:

<figure markdown="span">
  ![Pestaña Identificación con el campo Tipo de declaración](assets/modelo-303-2.jpg)
  <figcaption>Identificación: NIF, razón social, las casillas de verificación de perfil (deducción del pago a cuenta de carburantes, REDEME, concurso de acreedores) y el campo obligatorio Tipo de declaración.</figcaption>
</figure>

En **Identificación**, además del NIF y la razón social, marcas las casillas de verificación que corresponden a tu situación: si tienes derecho a deducir el pago a cuenta de entregas de gasolinas, gasóleos y biocarburantes (novedad de 2026), si estás inscrito en el Registro de devolución mensual (REDEME) o si fuiste declarado en concurso de acreedores en el período. También completas el campo obligatorio **Tipo de declaración**, con las opciones oficiales de la AEAT: *Compensación*, *Devolución*, *Ingreso*, *Ingreso mediante domiciliación bancaria*, *Resultado cero*, *Devolución Cuenta Corriente Tributaria* y *Devolución por transferencia al extranjero*.

<figure markdown="span">
  ![Sección de Liquidación con las casillas de IVA Devengado](assets/modelo-303-3.jpg)
  <figcaption>Liquidación: cada régimen (general, recargo de equivalencia, etc.) muestra su Base imponible, Tipo % y Cuota, con la numeración oficial de casillas (150-152, 165-167, 01-03...).</figcaption>
</figure>

En **Liquidación**, la sección **IVA Devengado** tiene una fila por cada tramo de tipo impositivo (general, reducido, superreducido, recargo de equivalencia), con su Base imponible, Tipo % y Cuota, usando la numeración oficial de casillas de la AEAT. La sección **IVA Deducible** funciona igual para las cuotas soportadas en operaciones interiores, importaciones y adquisiciones intracomunitarias, y su resultado (casilla 46) es la casilla 27 menos la 45.

<figure markdown="span">
  ![Bloque Información adicional con casillas 59, 60, 120, 122, 123 y 124](assets/modelo-303-4.jpg)
  <figcaption>Información adicional: entregas intracomunitarias y exportaciones, operaciones no sujetas por reglas de localización, inversión del sujeto pasivo y ventanilla única (OSS/IOSS), además de las casillas informativas del criterio de caja.</figcaption>
</figure>

El bloque **Información adicional** recoge operaciones que no forman parte del cálculo directo del resultado, pero que Hacienda pide declarar igualmente: entregas intracomunitarias de bienes y servicios (casilla 59), exportaciones y operaciones asimiladas (60), operaciones no sujetas por reglas de localización (120), operaciones con inversión del sujeto pasivo que tú emites (122), operaciones acogidas a los regímenes especiales de ventanilla única OSS/IOSS (123 y 124), y las casillas informativas de quienes están acogidos al criterio de caja (62, 63, 74 y 75).

<figure markdown="span">
  ![Bloque Resultado con la casilla final 71](assets/modelo-303-5.jpg)
  <figcaption>Resultado: suma de todos los regímenes, ajustes de periodos anteriores y la casilla 71 con el resultado final de la declaración.</figcaption>
</figure>

El bloque **Resultado** traduce todo lo anterior en una única cifra. La casilla 64 suma los resultados de régimen general, simplificado y regularizaciones; la casilla 65/66 indica el porcentaje (100% por defecto) atribuible a la Administración del Estado, relevante solo si también tributas a las Diputaciones Forales. A partir de ahí se restan o suman ajustes como el IVA a la importación liquidado por la Aduana pendiente de ingreso (77) o el saldo a compensar de períodos anteriores que apliques en este período (78, tomado del acumulado de la casilla 110), llegando a la casilla 69 con el **Resultado de la autoliquidación**. Si la declaración es una rectificativa, las casillas 70, 109 y 112 ajustan ese resultado hasta llegar a la **casilla 71**, la cifra final de la declaración: positivo es lo que ingresas, negativo lo compensas en el siguiente período o lo pides devuelto si es la última declaración del año. Al final del bloque también están los checkboxes **Sin actividad** (si no tuviste operaciones en el período) y **Autoliquidación rectificativa** (para corregir una declaración ya presentada).

### Pestaña Facturas

Muestra todas las facturas del período que Etendo Go usó (o usará, tras pulsar Calcular) para completar las casillas, con columnas de Fecha, Nº, Tipo (Venta o Compra), Tercero, Régimen, Base, Cuota, Total y las Casillas donde impacta cada factura. Es la forma de auditar de dónde sale cada importe de la declaración.

!!! tip "Una factura confirmada no siempre entra en el cálculo"
    Que una factura esté Completada y Contabilizada no basta: **Calcular** solo toma las facturas cuyo envío a SII y TicketBAI ya está en estado **Aceptado**. Puedes revisar y forzar ese envío abriendo la factura, en **Ventas > Factura de Venta** (o Compras), con el botón **Enviar a SIF**; si el envío falla o queda en Pendiente, la factura no aparecerá en esta declaración hasta que se acepte.

<figure markdown="span">
  ![Pestaña Facturas con una factura de venta y sus casillas asociadas](assets/modelo-303-7.jpg)
  <figcaption>Cada fila indica en qué casillas del modelo impacta la factura; en este ejemplo, una venta afecta las casillas 07 y 09.</figcaption>
</figure>

### Otras Pestañas

- **Incidencias** — detalle de las facturas o datos que generaron alguna advertencia durante el cálculo, en una tabla de Severidad, Origen y Mensaje.
- **Justificante** — aquí aparece el comprobante que subiste al elegir "Con acuse de recibo" al presentar la declaración, o donde puedes subirlo más adelante si la marcaste como "Sin acuse de recibo".

<figure markdown="span">
  ![Pestaña Incidencias con una advertencia sobre la Información adicional](assets/modelo-303-8.jpg)
  <figcaption>Cada incidencia indica su Severidad (por ejemplo, Advertencia), el Origen (el número de la factura o registro implicado) y un Mensaje explicando qué revisar antes de generar el fichero.</figcaption>
</figure>

!!! tip "Justificante es un área de carga manual"
    Etendo Go no genera el comprobante de presentación de forma automática: lo subes tú, ya sea en el momento de marcar la declaración como presentada (opción "Con acuse de recibo") o después, arrastrando el archivo aquí o seleccionándolo desde tu equipo (formatos compatibles: PDF, Word, Excel, PowerPoint e imágenes).

## Artículos Relacionados

- [Glosario de Impuestos](../glosario-de-impuestos/glosario-de-impuestos.md)
- [Modelo 349](../modelo-349/modelo-349.md)
- [Tipos de Impuestos y sus Porcentajes](../tipos-de-impuestos-y-sus-porcentajes/tipos-de-impuestos-y-sus-porcentajes.md)
- [SII](../sii/sii.md)
- [TicketBAI](../ticketbai/ticketbai.md)
- [Monitor Fiscal](../monitor-fiscal/monitor-fiscal.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
