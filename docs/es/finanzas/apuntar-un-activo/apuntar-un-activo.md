---
tags:
    - Activos
    - Amortización
    - Finanzas
    - Gestión Contable
    - Etendo Go
    - Cómo hacer
---

# Apuntar un Activo

Un **activo** es un bien fijo de la empresa (vehículo, equipo informático, maquinaria) que se amortiza a lo largo de su vida útil. **Apuntar** un activo es el proceso de registrarlo en Etendo Go para que el sistema pueda calcular y gestionar su amortización: se hace cada vez que la empresa adquiere un bien fijo o cuando se migran activos existentes desde otro sistema. Este artículo cubre cómo crear un activo y completar su formulario; para generar y ejecutar el plan de amortización una vez creado, consulta [Crear y Ejecutar un Plan de Amortización](../crear-un-plan-de-amortizacion/crear-un-plan-de-amortizacion.md).

```mermaid
flowchart LR
  A[Activo] -->|Crear amortización| B[Plan generado]
  B -->|Ejecutar período| C[Amortización - Borrador]
  C -->|Confirmar| D[Amortización - Procesado]
  D -->|Contabilizar| E[Asientos contables]
```

## Cómo Apuntar un Activo

1. Ve a **[Finanzas > Activos](https://go.etendo.cloud/assets){target="_blank"}** y pulsa **+ Nuevo activo**.
2. Completa el formulario:
    1. **Datos del Activo** — identificación del bien y su valor de adquisición (usa el número de inventario interno como **Identificador**). Detalle de cada campo más abajo.
    2. **Configuración de Amortización** e **Información Financiera** — activa el interruptor **Amortizar** y define el método de cálculo. Detalle de cada campo más abajo.
    3. **Fechas** — define la **Fecha inicio**; opcionalmente completa **Dimensiones Contables**. Detalle de cada campo más abajo.
3. Pulsa **Guardar**.
4. Pulsa **Crear amortización** para generar el plan de amortización — este paso se explica en detalle en [Crear y Ejecutar un Plan de Amortización](../crear-un-plan-de-amortizacion/crear-un-plan-de-amortizacion.md).

!!! tip "Si tienes la factura de compra"
    Ve a la pestaña **Adjuntos** y sube el documento arrastrándolo y soltándolo (formatos compatibles: PDF, Word, Excel, PowerPoint e imágenes). Así el activo queda vinculado a su comprobante de forma centralizada: cada archivo muestra su nombre, tamaño, fecha de carga y el usuario que lo subió.

!!! warning "Paso obligatorio"
    Sin pulsar **Crear amortización**, el activo queda registrado pero sin plan de amortización. Consulta [Crear y Ejecutar un Plan de Amortización](../crear-un-plan-de-amortizacion/crear-un-plan-de-amortizacion.md) para ver cómo generar y procesar los períodos.

El formulario se abre al crear un activo nuevo o al hacer clic sobre un registro existente en la lista.

### Datos del Activo

<figure markdown="span">
  ![Formulario de Activo](assets/apuntar-un-activo-2.png)
  <figcaption>Formulario de Activo con los campos de identificación del bien y su valor de adquisición.</figcaption>
</figure>

Los campos de identificación aparecen siempre en la parte superior del formulario.

- **Identificador** — Código único del activo dentro de la organización (ej: número de inventario). Lo ingresa el usuario; no se genera automáticamente. Requerido.
- **Nombre** — Nombre descriptivo del activo (ej: *Servidor Dell R740*). Requerido.
- **Grupo activo** — Categoría contable del activo. Valor por defecto: *Otros*. Determina las cuentas contables de los asientos. Requerido.
- **Valor del activo** — Importe de adquisición. Base bruta antes de descontar el valor residual.
- **Descripción** — Información adicional: número de serie, ubicación, proveedor, etc.

### Configuración de Amortización

<figure markdown="span">
  ![Configuración de amortización](assets/apuntar-un-activo-3.png)
  <figcaption>Sección de configuración de amortización con el interruptor Amortizar y sus opciones.</figcaption>
</figure>

Esta sección controla si el activo se amortiza y qué método se usa.

- **Amortizar** — interruptor que habilita o deshabilita la amortización para este activo. Cuando está desactivado, aparece el mensaje *"La amortización está desactivada. Activala para configurar el método, el cálculo y la vida útil."*
- **Cada mes tiene 30 días** — interruptor que aparece al activar **Amortizar** (activo por defecto). Normaliza los meses a 30 días para obtener cuotas uniformes.

### Información Financiera

<figure markdown="span">
  ![Información financiera](assets/apuntar-un-activo-4.png)
  <figcaption>Sección de información financiera con los valores del activo y el método de amortización.</figcaption>
</figure>

- **Moneda** — Valor fijo, no editable: *EUR*.
- **Valor residual** — Valor estimado al final de la vida útil. Debe ser menor o igual al valor del activo.
- **Valor a amortizar** — Se autocompleta restando el valor residual al valor del activo, pero es un campo editable: puedes sobrescribirlo si lo necesitas. Requerido.
- **Amortizado anterior** — Importe ya amortizado antes de registrar el activo en Etendo Go. Útil al migrar activos con amortización acumulada en otro sistema. Por defecto: *0*.
- **Tipo de amortización** — Método de cálculo. Opción disponible: *Lineal*. Requerido.
- **Tipo de cálculo** — Define cómo se expresa la vida útil del activo. Opciones: *Porcentaje* o *Tiempo*. Requerido.

Según el **Tipo de cálculo** seleccionado, aparecen campos adicionales:

- Si eliges *Porcentaje*: **% Amortización anual** — porcentaje anual a amortizar. Ej: *25 %* amortiza el activo en 4 años. Con un activo de 10.000 € y 25 % anual en periodicidad mensual, cada cuota es de 208,33 €/mes.
- Si eliges *Tiempo*: aparecen otros dos campos, ambos llamados **Amortizar** y **Vida útil**, no confundir con el interruptor de la sección anterior:
    - **Amortizar** — periodicidad del plan: *Mensual* (una línea por mes) o *Anual* (una línea por año). Por defecto: *Mensual*.
    - **Vida útil** — duración total del activo. La etiqueta y la unidad cambian según la periodicidad elegida: *Vida útil - Meses* si es *Mensual*, *Vida útil - Años* si es *Anual*. Ej: *48* meses equivale a 4 años. Con un activo de 10.000 € a 48 meses, cada cuota es de 208,33 €/mes.

### Fechas

<figure markdown="span">
  ![Fechas](assets/apuntar-un-activo-5.png)
  <figcaption>Sección de fechas con los campos de compra, inicio, cancelación y fin del activo.</figcaption>
</figure>

- **Fecha compra** — Informativa. Fecha de adquisición del activo; no interviene en el cálculo.
- **Fecha de cancelación** — Informativa. Fecha en que el activo se da de baja del patrimonio. Atención: ingresar esta fecha no detiene automáticamente los cálculos de amortización; **debes gestionar la baja contable por separado**.
- **Fecha inicio** — Inicio de la vida útil contable del activo. Es el punto de partida para generar el plan de amortización; sin esta fecha el plan no puede crearse. **Requerido para generar el plan**.
- **Fecha fin** — Informativa. Se calcula automáticamente cuando el Tipo de cálculo es *Tiempo*; debe completarse manualmente si es *Porcentaje*.

### Dimensiones Contables

<figure markdown="span">
  ![Dimensiones contables](assets/apuntar-un-activo-10.png)
  <figcaption>Sección de dimensiones contables, sin completar.</figcaption>
</figure>

Campos opcionales para asociar el activo a dimensiones de análisis contable. Se propagan automáticamente a cada línea del plan al generarlo o recalcularlo.

- **Proyecto** — úsalo cuando el activo está vinculado a un proyecto concreto y su amortización forma parte del costo de ese proyecto.
- **Centro de coste** — úsalo cuando la amortización debe imputarse a un área o departamento específico (ej: Tecnología, Operaciones).
- **Contacto** — úsalo cuando el activo está asignado a un tercero (proveedor, cliente o entidad relacionada) relevante para la contabilidad.
- **Producto** — vincula el activo a un producto del catálogo cuando corresponda, por ejemplo para relacionarlo con un ítem de inventario concreto.

### Qué Ves Después de Generar el Plan de Amortización

Al pulsar **Crear amortización** (paso 4), el formulario se completa con información que genera el sistema.

**Resumen de amortización** — panel lateral que muestra el estado del activo de forma permanente mientras trabajas en el formulario:

<figure markdown="span">
  ![Resumen de Amortización](assets/apuntar-un-activo-7.png)
  <figcaption>Panel lateral de Resumen de amortización con el estado actual del activo.</figcaption>
</figure>

- **Valor actual** — Valor contable del activo a la fecha (euros).
- **Valor residual del activo** — Valor estimado al final de la vida útil.
- **Amortización planificada** — Monto total programado en el plan vigente.
- **Amortizado %** — Porcentaje ya amortizado. Subtítulo *En progreso* mientras hay períodos pendientes; cambia a *Totalmente amortizado* al llegar al 100 %.

**Plan de amortización y Contabilidad** — dos pestañas adicionales en el activo ya creado:

- **Plan de amortización** — muestra las líneas por período que produce **Crear amortización**. Consulta [Crear y Ejecutar un Plan de Amortización](../crear-un-plan-de-amortizacion/crear-un-plan-de-amortizacion.md) para ver cómo generarlas y procesarlas.

<figure markdown="span">
  ![Pestaña Plan de amortización con las líneas generadas](assets/apuntar-un-activo-8.png)
  <figcaption>Pestaña Plan de amortización con las líneas generadas por período.</figcaption>
</figure>

- **Contabilidad** — muestra las cuentas de **Amortización acumulada** y **Amortización** usadas al generar los asientos de este activo. Usa **Añadir Contabilidad** para asociar un esquema adicional.

<figure markdown="span">
  ![Pestaña Contabilidad con las cuentas de amortización](assets/apuntar-un-activo-9.png)
  <figcaption>Pestaña Contabilidad con las cuentas de amortización acumulada y amortización por esquema contable.</figcaption>
</figure>

## Vista Lista

<figure markdown="span">
  ![Vista lista de Activos filtrada por Grupo activo](assets/apuntar-un-activo-1.png)
  <figcaption>Vista lista de Activos filtrada por Grupo activo "Equipos Informáticos", con columnas de identificador, grupo, fechas, valores y estado de amortización.</figcaption>
</figure>

Desde **[Finanzas > Activos](https://go.etendo.cloud/assets){target="_blank"}** encuentras todos los activos ya registrados, con columnas de identificador, grupo, fechas, valores y **Estado de amortización** (barra de progreso). Usa **Filtros** para acotar la lista (por ejemplo, por **Grupo activo**, como en la captura) o **+ Nuevo activo** para crear uno.

*[EUR]: Euro — moneda oficial de la zona euro

## Artículos Relacionados

- [Crear y Ejecutar un Plan de Amortización](../crear-un-plan-de-amortizacion/crear-un-plan-de-amortizacion.md)
- [Glosario de Contabilidad](../glosario-de-contabilidad/glosario-de-contabilidad.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
