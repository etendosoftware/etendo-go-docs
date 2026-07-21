---
tags:
    - Pedido de Venta
    - Ventas
    - Comercial
    - Gestión Documental
    - Etendo Go
---

# Pedido de venta

## Descripción general

El **pedido de venta** es el documento que formaliza el compromiso de entrega con el cliente. Puede crearse directamente o generarse a partir de un [presupuesto de venta](../presupuesto-de-venta/presupuesto-de-venta.md) aceptado. Una vez confirmado, el pedido queda bloqueado y da lugar opcionalmente a un albarán (documento de entrega) y a una [factura de venta](../factura-de-venta/factura-de-venta.md).

El siguiente diagrama muestra las dos vías para crear un pedido de venta y su ciclo de vida hasta los documentos derivados:

```mermaid
flowchart LR
  A[Presupuesto de venta] -->|Crear pedido| B[Pedido de venta]
  C[Nuevo pedido] --> B
  B -->|Confirmar| D[Completado]
  D -->|Opcional| E[Albarán]
  D -->|Opcional| F[Factura de venta]
  E --> F
```

---

## Vista Lista

<figure markdown="span">
  ![Vista lista de Pedido de venta](lista.png)
  <figcaption>Vista lista del Pedido de venta con columnas de estado, facturación y entrega.</figcaption>
</figure>

La vista lista muestra todos los pedidos con las columnas **Fecha de pedido**, **Nº documento**, **Contacto**, **Estado doc.**, **Imp. total**, **Estado de facturación** y **Estado de entrega**.

**Estado de facturación** y **Estado de entrega** — indican qué porcentaje del pedido ya ha sido facturado o entregado. Ambas columnas muestran barras de progreso con porcentaje: verde cuando está al 100 %, naranja cuando es parcial y gris cuando no ha comenzado.

Para filtrar la lista utiliza los selectores de **estado del documento** y **fecha de pedido** en la barra superior. El ícono de embudo permite aplicar filtros adicionales. Para crear un pedido nuevo usa el botón **+ Nuevo pedido** en la esquina superior derecha.

---

## Vista Detalle

<figure markdown="span">
  ![Vista detalle de Pedido de venta](detalle.png)
  <figcaption>Vista detalle con la previsualización del PDF y el panel lateral de información clave.</figcaption>
</figure>

Al hacer clic sobre un pedido existente en la lista se abre la vista detalle. El centro muestra una previsualización del PDF y el panel derecho muestra la información clave: total, contacto, fecha, estado, y las barras de progreso de **Facturado** y **Entregado**.

Desde este panel puedes:

- **Enviar** — abre el panel de envío por email al cliente.
- **Descargar PDF** — descarga el pedido en formato PDF.
- **Editar** — abre el formulario completo para modificar el documento.

El panel también incluye la sección **Emails** con el historial de correos enviados, y la sección **Documentos relacionados** con los albaranes y facturas generados a partir del pedido.

---

## Vista Formulario

<figure markdown="span">
  ![Vista formulario de Pedido de venta](formulario.png)
  <figcaption>Formulario de creación y edición del Pedido de venta.</figcaption>
</figure>

El formulario se abre al crear un pedido nuevo o al hacer clic en **Editar** desde la vista detalle.

### Cabecera

- **Contacto** — cliente al que se dirige el pedido. Al seleccionarlo, el sistema autocompleta la Dirección, el Método de pago y las Condiciones de pago configurados en ese contacto.
- **Nº documento** — se genera automáticamente al guardar por primera vez.
- **Fecha de pedido** — toma por defecto la fecha actual; editable.
- **Dirección** — cargada desde el contacto; editable para este documento.
- **Tarifa** — determina a qué precios se cotizarán los productos en este pedido (lista de precios asignada al cliente). Normalmente se carga sola al seleccionar el cliente.
- **Método de pago** — heredado del contacto; editable para este documento.
- **Condiciones de pago** — heredado del contacto; editable para este documento. Las opciones disponibles son *Inmediato* y *30 días*.

!!! tip "Campos autocargados desde el contacto"
    Todos los campos cargados automáticamente al seleccionar el contacto (dirección, tarifa, método de pago, condiciones de pago) son editables para este pedido sin afectar la configuración del cliente.

### Pestaña Líneas

<figure markdown="span">
  ![Pestaña Líneas del Pedido de venta](lineas.png)
  <figcaption>Pestaña Líneas con los productos y servicios incluidos en el pedido.</figcaption>
</figure>

Las líneas representan los productos o servicios incluidos en el pedido. Usa el botón **+ Añadir línea** para incorporar una nueva línea.

- **Producto** — al seleccionarlo autocompleta la descripción y el precio de tarifa según la tarifa seleccionada en la cabecera; editable si se necesita ajustar para este pedido.
- **Descripción** — precompletada desde el producto; editable por línea.
- **Cant. pedido** — cantidad del producto. Por defecto 1.
- **Precio tarifa** — precio del producto según la tarifa de la cabecera; editable.
- **% de descuento** — descuento aplicado sobre el precio de tarifa de la línea.
- **Impuesto** — tipo impositivo aplicable a la línea.
- **Importe bruto de línea** — resultado de multiplicar el precio unitario por la cantidad, menos el descuento de línea aplicado.

Para guardar una línea pulsa ++enter++ o haz clic fuera de la fila. Para cancelar sin guardar, pulsa ++esc++.

#### Totales

<figure markdown="span">
  ![Panel de totales del Pedido de venta](totales.png)
  <figcaption>Panel de totales con desglose de subtotal, descuentos, impuesto e importe final.</figcaption>
</figure>

El sistema permite dos tipos de descuento: uno por línea (aplicado en la Pestaña Líneas) y uno global sobre el total del pedido.

El panel de totales en la parte inferior derecha muestra:

- **Subtotal sin descuento** — suma del importe bruto de todas las líneas antes de descuentos.
- **Descuento por producto** — suma de los descuentos aplicados por línea.
- **Descuento total** — descuento adicional aplicado al documento completo. Se activa con el enlace **+ Añadir descuento total**.
- **Subtotal** — base imponible tras descuentos.
- **Impuesto** — importe de impuesto calculado según el tipo seleccionado en cada línea.
- **Total** — importe final a pagar.

#### Documentos Relacionados

La sección **Documentos** muestra los documentos vinculados al pedido: el presupuesto de origen (si el pedido fue generado desde uno) y los albaranes o facturas creados al confirmar. Cada documento es un enlace navegable.

#### Notas

El campo **Notas** permite añadir observaciones internas. Este contenido no se incluye en el PDF enviado al cliente.

---

## Estados del Documento

La barra superior del formulario muestra el estado actual del pedido junto a los indicadores de entrega y facturación.

| Estado | Descripción |
|---|---|
| <span style="background:#F3F4F6;color:#6B7280;padding:2px 10px;border-radius:12px;font-size:.85em;white-space:nowrap">Borrador</span> | En preparación. El documento es completamente editable. |
| <span style="background:#F0FDF4;color:#22C55E;padding:2px 10px;border-radius:12px;font-size:.85em;white-space:nowrap">Completado</span> | Confirmado. Ya no es editable. Se pueden generar albarán y factura. |

!!! warning "El pedido no se puede editar tras confirmar"
    Una vez confirmado, el pedido queda bloqueado. Verifica las líneas, cantidades y precios antes de confirmar.

---

## Acciones Disponibles

La barra superior del formulario muestra las siguientes acciones:

| Acción | Descripción | Estado |
| :--- | :--- | :--- |
| **Cancelar** | Descarta los cambios no guardados y vuelve a la lista. | Solo en Borrador |
| **Guardar** | Guarda el documento sin cambiar su estado. | Solo en Borrador |
| **Confirmar** | Confirma el pedido y lo pasa a estado Completado. Ver sección Confirmar Pedido. | Solo en Borrador |
| **Copia** | Clona el pedido actual creando un nuevo borrador con el mismo contacto, líneas y condiciones. | Borrador y Completado |
| **Email** | Abre el panel de envío por correo electrónico. | Borrador y Completado |
| **Papelera** | Elimina el documento con confirmación previa. | Solo en Borrador |

### Enviar por Email

<figure markdown="span">
  ![Popup de envío por email del Pedido de venta](enviar.png)
  <figcaption>Panel de envío por email del Pedido de venta.</figcaption>
</figure>

El icono de sobre abre el panel **Enviar Pedido de Venta**, con los campos **Para**, **Asunto** (autocompletado con el número de documento y nombre del contacto) y **Mensaje**. Desde este panel también puedes descargar el PDF con el botón **Descargar PDF**.

### Confirmar Pedido

<figure markdown="span">
  ![Popup de confirmación del Pedido de venta](confirmacion.png)
  <figcaption>Popup de confirmación del Pedido de venta con opciones para generar documentos derivados.</figcaption>
</figure>

Al hacer clic en **Confirmar**, el sistema muestra el popup **Confirmar pedido** con el resumen del documento (contacto, importe total, número de líneas y subtotal).

!!! warning "Acción irreversible"
    Una vez confirmado, el pedido no se puede editar.

La sección **Generar documentos (opcional)** permite seleccionar qué documentos crear en ese momento:

- **Crear albarán** — genera un albarán en estado Borrador, independiente de la factura. Úsalo cuando haya entrega física de mercadería.
- **Crear factura** — genera una factura en estado Borrador con las cantidades del pedido.

Puedes marcar uno, ambos o ninguno. Si no marcas ninguno, el pedido queda Completado sin documentos asociados y puedes generar el albarán o la factura más adelante desde la sección **Documentos Relacionados** del propio pedido.

!!! info "Datos heredados en los documentos generados"
    El albarán y la factura creados desde el pedido heredan el contacto, la dirección, las condiciones de pago y todas las líneas.

---

## Artículos Relacionados

- [Presupuesto de venta](../presupuesto-de-venta/presupuesto-de-venta.md)
- [Factura de venta](../factura-de-venta/factura-de-venta.md)
- [Cómo crear un contacto](../../contactos/como-crear-un-contacto/como-crear-un-contacto.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
