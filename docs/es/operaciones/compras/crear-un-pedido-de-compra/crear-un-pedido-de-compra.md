---
title: Crear un pedido de compra
tags:
  - Pedido de Compra
  - Compras
  - Operaciones
  - Inventario
  - Etendo Go
---

# Crear un pedido de compra

Sigue esta guía cuando necesites solicitar productos o servicios a un proveedor: el pedido de compra formaliza la solicitud y, una vez confirmado, te permite generar el albarán de recepción y la factura correspondientes.

**Antes de empezar**, necesitas tener:

- El [contacto](../../../comercial/contactos/que-es-la-seccion-contactos/que-es-la-seccion-contactos.md) del proveedor cargado, con el rol **Proveedor** activo.
- Al menos una dirección configurada para ese contacto.

```mermaid
flowchart LR
  A[Crear pedido] -->|Confirmar| B[Completado]
  B -->|Gestionar| C[Albarán de compra]
  B -->|Gestionar| D[Factura de compra]
```

---

## Crear el pedido

<figure markdown="span">
  ![Vista formulario de Pedido de compra](assets/formulario.png)
  <figcaption>Formulario de creación y edición del Pedido de compra.</figcaption>
</figure>

1. Accede a **[Compras > Pedido de Compra](https://go.etendo.cloud/purchase-order){target="_blank"}** y haz clic en **+ Nuevo pedido**.
2. Completa la cabecera:
    - **Contacto** *(obligatorio)* — proveedor al que se dirige el pedido. Al seleccionarlo, autocompleta **Dirección**, **Método de pago**, **Condiciones de pago**, **Moneda** y **Tarifa**.
    - **Nº documento** — se asigna automáticamente al guardar; no editable.
    - **Fecha de pedido** *(obligatorio)* — por defecto la fecha actual; editable.
    - **Dirección** *(obligatorio)* — heredada del contacto; editable para este documento.
    - **Fecha de entrega esperada** *(obligatorio)* — fecha prevista de recepción; por defecto hoy, editable. Exclusiva de este documento.
    - **Almacén** *(obligatorio)* — donde se recibirá la mercancía; por defecto tu almacén, editable.
    - **Condiciones de pago** *(obligatorio)*, **Moneda** *(obligatorio)*, **Tarifa** *(obligatorio)* — heredados del contacto; editables para este documento.
    - **Método de pago** — heredado del contacto; editable para este documento.
3. Si necesitas adjuntar algún archivo de referencia (por ejemplo, la cotización del proveedor), usa la pestaña **Adjuntos** — admite PDF, Word, Excel, PowerPoint e imágenes.

## Añadir las líneas

<figure markdown="span">
  ![Pestaña Líneas de Pedido de compra](assets/lineas.png)
  <figcaption>Pestaña Líneas con los productos y servicios incluidos en el Pedido de compra.</figcaption>
</figure>

En la pestaña **Líneas**, usa **+ Añadir línea** para incorporar cada producto o servicio:

- **Producto** — autocompleta descripción, precio de tarifa e impuesto; editable para este pedido.
- **Descripción** — precompletada desde el producto; editable por línea.
- **Cant. pedido** — cantidad solicitada al proveedor. Por defecto 1.
- **Precio** — precio del producto según la tarifa de compra; editable.
- **% de descuento** — descuento aplicado sobre el precio de la línea.
- **Impuesto** — tipo impositivo aplicable, heredado del producto.
- **Importe bruto de línea** — **Precio** × **Cant. pedido**, menos el descuento, más el impuesto de la línea.

Para guardar una línea pulsa ++enter++ o haz clic fuera de la fila; para cancelar sin guardar, pulsa ++esc++.

### Totales y notas

<figure markdown="span">
  ![Panel de totales de Pedido de compra](assets/totales.png)
  <figcaption>Panel de totales con desglose de subtotal, descuento, impuesto e importe final.</figcaption>
</figure>

El panel de totales muestra **Subtotal sin descuento**, **Descuento por producto**, **Subtotal**, **Impuesto** y **Total**, con la opción de añadir un descuento global vía **+ Añadir descuento total**. El campo **Notas** admite observaciones internas, no incluidas en el PDF enviado al proveedor.

## Guardar o confirmar el pedido

Usa **Guardar** para dejar el pedido en Borrador, o **Confirmar** para pasarlo a estado Completado.

!!! warning "El pedido no se puede editar tras confirmar"
    Una vez confirmado, el pedido queda bloqueado. Verifica las líneas, cantidades y precios antes de confirmar.

Al pulsar **Confirmar** se abre un cuadro con la sección **Generar documentos (opcional)**, donde puedes marcar **Crear albarán de proveedor** y/o **Crear factura** para generarlos en el momento. Si no marcas ninguna, el pedido queda Completado sin documentos asociados y puedes generarlos más adelante desde el propio pedido — ver [Gestionar tus pedidos de compra](../gestionar-tus-pedidos-de-compra/gestionar-tus-pedidos-de-compra.md) para el detalle de esa gestión.

## Artículos Relacionados

- [Gestionar tus pedidos de compra](../gestionar-tus-pedidos-de-compra/gestionar-tus-pedidos-de-compra.md)
- [Crear una factura de compra](../crear-una-factura-de-compra/crear-una-factura-de-compra.md)
- [Contactos](../../../comercial/contactos/que-es-la-seccion-contactos/que-es-la-seccion-contactos.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
