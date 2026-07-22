---
tags:
    - Amortización
    - Activos
    - Finanzas
    - Gestión Contable
    - Etendo Go
---

# Amortización

La **Amortización** agrupa en un único registro la ejecución de la depreciación de uno o varios activos para un período contable. Al confirmarla y contabilizarla se generan los asientos contables correspondientes en la contabilidad.

```mermaid
flowchart LR
  A[Activos con plan generado] -->|Añadir líneas| B[Amortización - Borrador]
  B -->|Confirmar| C[Amortización - Procesado]
  C -->|Contabilizar| D[Contabilizado / Asientos contables]
  D -->|Reactivar| B
```

Antes de crear una amortización, cada activo que vayas a incluir debe tener su [plan de amortización](../activos/activos.md) generado. Una vez confirmada y contabilizada, la amortización queda en estado **Procesado** y **Contabilizado**, y sus asientos son definitivos — solo revertibles mediante **Reactivar**.

---

## Vista Lista

<figure markdown="span">
  ![Vista lista de Amortización](amortizacion-1.png)
  <figcaption>Vista lista de Amortización con columnas de nombre, fecha contable, fecha de inicio y amortización total.</figcaption>
</figure>

La vista lista muestra todos los registros de amortización con las columnas **Nombre**, **Fecha contable**, **Fecha de inicio**, **Amortización total** y **Contabilizado**.

El nombre de cada registro adopta el formato *MM-YYYY* (ej: *06-2026*), que identifica el período al que corresponde. El filtro **Todos los estados** permite seleccionar entre **Procesado** y **Borrador**. La columna **Contabilizado** es independiente de ese estado y muestra **Contabilizado** o **Sin contabilizar** (ver [Estados y Ciclo de Vida](#estados-y-ciclo-de-vida)).

Usa el botón **Filtros** en la esquina superior izquierda para filtrar por cualquier campo. Usa **+ Nueva amortización** en la esquina superior derecha para crear un registro nuevo.

---

## Formulario de Amortización

<figure markdown="span">
  ![Formulario de Amortización](amortizacion-2.png)
  <figcaption>Formulario de Amortización con los datos generales y las pestañas de líneas y adjuntos.</figcaption>
</figure>


### Datos Generales

- **Nombre** — Se autorrellena con *Amortización* al crear. Se recomienda cambiarlo al formato *MM-YYYY* del período (ej: *06-2026*) para facilitar la identificación. Requerido.
- **Fecha contable** — Fecha con la que se registran los asientos contables. Se autorrellena con la fecha actual. Requerido.
- **Fecha de inicio** — Fecha de inicio del período. Referencial; no interviene en el cálculo.
- **Moneda** — Moneda de los importes. Valor por defecto: *EUR*. Requerido.
- **Descripción** — Notas internas del registro.

### Líneas

<figure markdown="span">
  ![Líneas de Amortización](amortizacion-3.png)
  <figcaption>Pestaña Líneas con los activos incluidos en el período y sus importes de depreciación.</figcaption>
</figure>

La pestaña **Líneas** contiene los activos que se amortizan en este registro. Cada línea representa un período de depreciación de un activo concreto.

- **Activo** — Nombre del activo incluido en este período.
- **% Amortización** — Porcentaje del valor a amortizar aplicado en el período.
- **Importe amortización** — Monto en euros a depreciar en este período.
- **Dimensiones contables** — Resumen de las dimensiones asignadas a la línea (Contacto, Proyecto, Centro de coste).

Al final de la tabla aparece el total **Amortización total: X €** con la suma de todos los importes de las líneas.

#### Añadir Líneas

Usa el botón **+ Añadir línea** para incorporar activos al registro. Solo se pueden añadir activos que tengan líneas de plan pendientes de ejecutar (estado sin confirmar).

#### Dimensiones

Cada línea permite sobrescribir o añadir dimensiones contables pulsando el enlace **+ Añadir dimensiones** en la columna **Dimensiones contables**.

!!! info 
    Si el activo tiene dimensiones definidas en su formulario, se propagan automáticamente a la línea al añadirla.

---

## Pestaña Adjuntos

La pestaña **Adjuntos** permite subir documentación de soporte del registro (actas de cierre, justificantes contables, etc.) mediante arrastrar y soltar.

---

## Estados y Ciclo de Vida

Una amortización combina dos indicadores independientes: el **estado** del registro y si ya fue **contabilizado**.

| Estado | Descripción |
|---|---|
| <span style="background:#F3F4F6;color:#6B7280;padding:2px 10px;border-radius:12px;font-size:.85em;white-space:nowrap">Borrador</span> | Editable. Puedes añadir, modificar o eliminar líneas y cambiar los datos generales. |
| <span style="background:#F0FDF4;color:#22C55E;padding:2px 10px;border-radius:12px;font-size:.85em;white-space:nowrap">Procesado</span> | Confirmado mediante **Confirmar**. Ya no se pueden editar las líneas ni los datos generales. |

| Contabilizado | Descripción |
|---|---|
| <span style="background:#F3F4F6;color:#6B7280;padding:2px 10px;border-radius:12px;font-size:.85em;white-space:nowrap">Sin contabilizar</span> | Los asientos contables todavía no se generaron. Es el valor inicial, incluso en Borrador. |
| <span style="background:#F0FDF4;color:#22C55E;padding:2px 10px;border-radius:12px;font-size:.85em;white-space:nowrap">Contabilizado</span> | Los asientos contables ya se generaron mediante **Contabilizar**. |

1. **Crear** — hay dos formas de originar una amortización:
    - **Desde Activos** (flujo habitual): navega al período correspondiente en el plan de amortización del activo y accede al registro. Las líneas ya están generadas por el sistema.
    - **Manualmente** (para ajustes puntuales): pulsa **+ Nueva amortización** desde esta ventana.
2. **Añadir líneas** — en caso de creación manual, usa **+ Añadir línea** para incluir los activos del período. Verifica que el porcentaje e importe de cada línea son correctos.
3. **Revisar el total** — comprueba la **Amortización total** al pie de la tabla antes de confirmar.
4. **Confirmar** — pulsa **Confirmar**. El registro pasa a estado **Procesado**. Requiere que el período contable de la fecha del registro esté abierto; si no lo está, el sistema muestra el error *"El Periodo no existe o no está abierto"*.
5. **Contabilizar** — una vez Procesado, usa **Contabilizar** (⋮) para generar los asientos contables. El registro pasa a **Contabilizado**.
6. **Corregir** — usa **Reactivar** (⋮) para devolver el registro a Borrador y Sin contabilizar en un solo paso, aplica los cambios y repite Confirmar y Contabilizar.
7. **Verificar en activos** — las líneas del plan de amortización de cada activo incluido pasan a estado **Confirmado** y quedan vinculadas a este registro.

!!! info "Confirmar y Contabilizar son acciones independientes"
    Un registro puede quedar **Procesado** y **Sin contabilizar** a la vez. **Reactivar** revierte ambos estados en un solo paso.

---

## Artículos Relacionados

- [Activos](../activos/activos.md)
- [Apuntar un Activo](../activos/apuntar-un-activo.md)
- [Crear un plan de amortización](../activos/crear-un-plan-de-amortizacion/crear-un-plan-de-amortizacion.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
