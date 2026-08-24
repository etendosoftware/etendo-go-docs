---
title: Añadir pagos a tu factura de venta
description: >-
  Aprende a registrar cobros totales o parciales sobre tus facturas de venta
  en Etendo Go, y a aplicar saldo a favor o crédito disponible del cliente.
tags:
  - Factura de Venta
  - Ventas
  - Comercial
  - Etendo Go
---

# Añadir pagos a tu factura de venta

Una vez que una factura de venta está en estado **Completado**, puedes registrar los cobros que recibas del cliente — totales o parciales — desde el propio documento.

## Pasos

1. Abre la factura desde la vista lista o desde la vista detalle de **[Ventas > Factura](https://go.etendo.cloud/sales-invoice){target="_blank"}**. El botón **Añadir pago** está disponible tanto en el panel lateral de la vista detalle como en la barra del formulario.

2. Haz clic en **Añadir pago**. Se abre el popup **Nuevo cobro**:

    ![Panel de añadir pago de la Factura de venta](assets/anadir-pagos-a-tu-factura-de-venta-1.png)

    El popup muestra de referencia el **Cliente**, el número de **Factura** y el importe **Pendiente**. El campo **Estado** de esta cabecera corresponde al cobro que se está creando (aparece como "Borrador" hasta que lo confirmes), no al estado de la factura — la factura ya debe estar Completada para poder abrir este popup.

3. Completa los campos del cobro:

    - **Importe** — monto recibido. Toma por defecto el total pendiente de la factura.
    - **Fecha** — fecha del cobro; por defecto, la fecha actual.
    - **Método de pago** — forma en que se recibió el dinero.
    - **Cuenta** — cuenta bancaria en la que se recibe el cobro.

    Debajo se muestra el desglose **Total factura**, **Dinero** y **Aplicado**, con la **Diferencia** resultante. Si el importe cargado no coincide exactamente con el pendiente, usa el botón **Igualar** para ajustarlo automáticamente a cero.

4. Haz clic en **Guardar** para registrar el cobro sin cerrar el popup, o en **Confirmar** para registrarlo y cerrar. El sistema actualiza automáticamente el importe **Pendiente de pago** en el panel lateral:

    ![Confirmación del pago registrado con el importe pendiente actualizado](assets/anadir-pagos-a-tu-factura-de-venta-2.png)

!!! info "Pagos parciales"
    Puedes registrar varios pagos parciales hasta cubrir el total de la factura. El indicador de **Pendiente de pago** se reduce con cada pago registrado.

## Aplicar saldo a favor o crédito disponible (opcional)

Si el cliente tiene **saldo a favor** (de cobros de más en otras facturas) o **crédito** disponible (anticipos ya registrados), el popup **Nuevo cobro** muestra además la sección **Saldo a favor y crédito disponible**, con un listado de esos importes y su fecha. Puedes tildar uno o varios para aplicarlos a esta factura, en lugar de — o adicionalmente a — un cobro en efectivo/banco nuevo:

- Al tildar un registro, su importe disponible se aplica automáticamente a la factura y el campo **Importe** se reduce en esa misma medida (por ejemplo, si el saldo a favor cubre toda la factura, el Importe pasa a 0).
- El importe aplicado de cada registro es editable, para consumir el saldo solo parcialmente.
- El desglose inferior agrega entonces una línea **Saldo a favor** (o **Crédito**) entre **Dinero** y **Aplicado**, sumando ambos orígenes.

Cada pago registrado queda visible en la sección **PAGOS** del panel lateral, con el historial completo de cobros de esa factura.

## Artículos Relacionados

- [Crear una factura de venta](../crear-una-factura-de-venta/crear-una-factura-de-venta.md)
- [Gestionar tus facturas de venta](../gestionar-tus-facturas-de-venta/gestionar-tus-facturas-de-venta.md)
- [Enviar tus facturas por email](../enviar-tus-facturas-por-email/enviar-tus-facturas-por-email.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
