---
title: Crear una factura de venta
tags:
  - Factura de Venta
  - Ventas
  - Comercial
  - Gestión Documental
  - Etendo Go
---

# Crear una factura de venta

La **factura de venta** es el documento fiscal que formaliza el cobro al cliente. Puedes crearla directamente, o generarla desde un [presupuesto de venta](../crear-y-gestionar-presupuestos/crear-y-gestionar-presupuestos.md) aceptado o un [pedido de venta](../crear-y-gestionar-pedidos/crear-y-gestionar-pedidos.md) confirmado, heredando todos sus datos. Este artículo repasa cómo crearla directamente desde cero; para las otras dos vías, consulta el artículo del documento de origen correspondiente.

```mermaid
flowchart LR
  A[Presupuesto de venta] -->|Facturar directamente| B[Factura de venta]
  C[Pedido de venta] -->|Crear factura| B
  D[Nueva factura] --> B
  B -->|Confirmar| E[Completado]
```

## Pasos

1. Accede a la ventana **[Ventas > Factura](https://go.etendo.cloud/sales-invoice){target="_blank"}** y haz clic en **+ Nueva factura**.

2. Completa la **Cabecera** del formulario:

    ![Vista formulario de Factura de venta](formulario.png)

    - **Contacto** — cliente al que se dirige la factura. Al seleccionarlo, el sistema autocompleta la Dirección, el Método de pago, las Condiciones de pago y la Tarifa configurados en ese contacto.
    - **Tipo de documento** — por defecto **Factura**. Las otras dos opciones, **Nota de crédito** y **Factura de devolución**, se usan para ajustes y devoluciones; consulta [Crear y gestionar devoluciones](../crear-y-gestionar-devoluciones/crear-y-gestionar-devoluciones.md).
    - **Fecha de la factura** — toma por defecto la fecha actual; editable.
    - **Dirección**, **Método de pago**, **Condiciones de pago**, **Moneda** y **Tarifa** — heredados del contacto o de la organización; editables solo para este documento.

    !!! tip "Campos autocargados desde el contacto"
        Al seleccionar el contacto, el sistema carga automáticamente la dirección, el método de pago, las condiciones de pago y la tarifa. Todos son editables dentro de la factura sin afectar la configuración del cliente.

3. Completa la pestaña **Líneas** con los productos o servicios facturados:

    ![Pestaña Líneas de la Factura de venta](lineas.png)

    - Usa **+ Añadir líneas** para incorporar productos manualmente. Si el tipo de documento es **Factura**, además tienes disponibles **Importar desde envío** y **Añadir desde pedido**, para traer las líneas de un albarán o un pedido existente. Estas dos opciones de importación no están disponibles para **Nota de crédito**, cuyas líneas siempre se cargan manualmente.
    - **Producto** — al seleccionarlo autocompleta la descripción y el precio de tarifa; editable.
    - **Cant. facturada**, **Precio tarifa**, **% de descuento** e **Impuesto** — se ajustan por línea.
    - Pulsa ++enter++ para guardar la línea, o ++esc++ para cancelar sin guardar.

4. Revisa el panel de **Totales**:

    ![Panel de totales de la Factura de venta](totales.png)

    Verifica el **Subtotal**, el **Impuesto** y el **Total** antes de confirmar. Si necesitas dejar una observación interna, usa el campo **Notas** — no se incluye en el PDF enviado al cliente.

5. Haz clic en **Confirmar**. La acción es directa, sin popup, y pasa la factura al estado **Completado**.

    !!! warning "La factura no se puede editar tras confirmar"
        Una vez confirmada, la factura queda bloqueada. Verifica los importes, el contacto y las condiciones de pago antes de confirmar. Si necesitas corregirla igualmente, puedes usar **Reactivar** desde el menú de tres puntos para devolverla a Borrador — ver [Gestionar tus facturas de venta](../gestionar-tus-facturas-de-venta/gestionar-tus-facturas-de-venta.md#acciones-disponibles).

Una vez completada, la factura queda pendiente de cobro. Para registrar el pago, consulta [Añadir pagos a tu factura de venta](../anadir-pagos-a-tu-factura-de-venta/anadir-pagos-a-tu-factura-de-venta.md); para enviarla al cliente, consulta [Enviar tus facturas por email](../enviar-tus-facturas-por-email/enviar-tus-facturas-por-email.md).

## Artículos Relacionados

- [Gestionar tus facturas de venta](../gestionar-tus-facturas-de-venta/gestionar-tus-facturas-de-venta.md)
- [Añadir pagos a tu factura de venta](../anadir-pagos-a-tu-factura-de-venta/anadir-pagos-a-tu-factura-de-venta.md)
- [Crear y gestionar pedidos](../crear-y-gestionar-pedidos/crear-y-gestionar-pedidos.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
