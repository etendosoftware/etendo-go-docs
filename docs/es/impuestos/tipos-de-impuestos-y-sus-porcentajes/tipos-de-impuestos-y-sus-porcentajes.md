---
title: Tipos de Impuestos y sus Porcentajes
tags:
    - Impuestos
    - Fiscalidad
    - Referencia
    - Etendo Go
---

# Tipos de Impuestos y sus Porcentajes

Etendo Go incluye un catálogo predefinido de impuestos en **[Configuración > Impuesto](https://go.etendo.cloud/tax){target="_blank"}**, clasificados por **Categoría de Impuesto** en **[Configuración > Categoría de Impuesto](https://go.etendo.cloud/tax-category){target="_blank"}**. Este artículo explica cómo se organiza ese catálogo y qué porcentajes aplica cada tipo.

## Tipo de Impuesto (Régimen)

Cada Categoría de Impuesto pertenece a uno de estos regímenes, según el territorio:

| Tipo de impuesto | Territorio |
| --- | --- |
| **IVA** | Régimen común (España peninsular y Baleares) |
| **IGIC** | Canarias |
| **IPSI** | Ceuta y Melilla |

## Tipo de Tarifa

Dentro de cada régimen, los impuestos se agrupan por tipo de tarifa:

| Tipo de tarifa | Descripción |
| --- | --- |
| **General** / **Normal** | Tarifa estándar del régimen (ej. IVA 21%). |
| **Reducido** | Tarifa reducida (ej. IVA 10%). |
| **Super reducido** | Tarifa superreducida (ej. IVA 4%). |
| **Incrementado 1** / **Incrementado 2** | Tarifas superiores a la general, para operaciones específicas dentro del régimen (por ejemplo, ciertos tipos de IGIC). |
| **Cero** | Tipo 0%, distinto de una operación exenta. |
| **Exento** | Operación no gravada. |
| **No sujeto** | Operación fuera del ámbito del impuesto. |

## Ejemplos del Catálogo

El catálogo de Impuesto de Etendo Go incluye más de 70 registros que cubren tanto operaciones de venta como de compra, con nombres que identifican el tipo de operación y su porcentaje (**Índice**). Algunos ejemplos representativos:

| Nombre | Índice | Tipo venta/compra |
| --- | --- | --- |
| Adquisiciones IVA 21% | +21 % | Compras |
| Entregas IVA 5% | +5 % | Ventas |
| Entregas IVA 2% | +2 % | Ventas |
| Entregas IVA 4% Revendedores | +4 % | Ventas |
| Adquisiciones IGIC 9.5% | +9.5 % | Compras |
| Entregas IGIC 9.5% | +9.5 % | Ventas |
| Entregas IGIC Exentas | 0 % | Ventas |
| Adquisiciones a Canarias, Ceuta y Melilla 4% | +4 % | Compras |
| Prestación servicios en Ceuta/Melilla 4% | +4 % | Compras |
| Adquisiciones intracomunitarias exentas | 0 % | Compras |

!!! info "Índices negativos"
    Algunos nombres incluyen un segundo porcentaje entre paréntesis con signo negativo (ej. *Inversión Sujeto Pasivo UE 21% (-21%)*). Corresponden a mecanismos de **recargo de equivalencia** o **inversión del sujeto pasivo**, donde el impuesto repercutido y el reclamado se compensan entre sí.

## Campos del Registro Impuesto

Cada Impuesto define:

- **Nombre** — identifica la operación y su porcentaje.
- **Índice** — porcentaje que aplica sobre la base imponible. Puede ser positivo, cero o negativo.
- **Tipo venta/compra** — si el impuesto aplica a documentos de venta, de compra, o a ambos.
- **Válido desde** — fecha a partir de la cual el impuesto está vigente.
- **Cálculo del importe de impuestos del documento** — método usado para calcular el importe total de impuestos de un documento (por ejemplo, suma de las bases imponibles de línea).
- **Base Imponible** — importe sobre el que se calcula el impuesto (por ejemplo, importe neto de línea).
- **TBAI - Clave de Régimen Especial de IVA** — el código oficial de régimen especial o trascendencia de la AEAT (por ejemplo, *01 — Operación de régimen general* o *07 — Régimen especial del criterio de caja*) que se incluye en los envíos a TicketBAI.
- **Contabilidad** — cuentas de **Impuesto repercutido** e **Impuesto reclamado** que genera al contabilizar.

## Campos del Registro Categoría de Impuesto

Cada Categoría de Impuesto define:

- **Nombre** y **Descripción**.
- **Valor por defecto** — si se aplica automáticamente cuando no se especifica otra categoría.
- **Tipo de impuesto** — IVA, IGIC o IPSI.
- **Tipo de operación** — tipo de operación a la que aplica (por ejemplo, entrega o adquisición de bienes).
- **Tipo de tarifa** — Cero, Exento, General, Incrementado 1, Incrementado 2, No sujeto, Normal, Reducido o Super reducido.
- **SII declarable** — si las operaciones con esta categoría deben declararse al SII.

!!! info "Campos en inglés en la interfaz"
    Estos tres campos aparecen actualmente en inglés en el formulario de Etendo Go: **Tax type**, **Transaction type** y **Rate type**, respectivamente.

## Artículos Relacionados

- [¿Qué puedes hacer en Impuestos?](../que-puedes-hacer-en-impuestos/que-puedes-hacer-en-impuestos.md)
- [Glosario de Impuestos](../glosario-de-impuestos/glosario-de-impuestos.md)
- [Modelo 303](../modelo-303/modelo-303.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
