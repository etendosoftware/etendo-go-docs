---
title: Monitor Fiscal
tags:
    - Impuestos
    - Fiscalidad
    - Monitor Fiscal
    - Etendo
---

# Monitor Fiscal

El **Monitor Fiscal**, en **[Finanzas > Monitor Fiscal](https://app.etendo.software/fiscal-monitor){target="_blank"}**, es el panel donde revisas el estado del envío de tus facturas al sistema fiscal activo de tu organización (SII, TicketBAI o VERI\*FACTU) y sus incidencias.

## Antes de Activar un Sistema Fiscal

Si tu organización todavía no tiene un sistema fiscal configurado, el Monitor Fiscal muestra un estado vacío con acceso directo a la configuración:

<figure markdown="span">
  ![Estado vacío del Monitor Fiscal sin sistema fiscal configurado](assets/monitor-fiscal-1.jpg)
  <figcaption>Sin un sistema fiscal activo, el Monitor Fiscal no puede mostrar el estado de tus facturas.</figcaption>
</figure>

Pulsa **Configurar sistema fiscal** para ir a Configuración Fiscal y activar SII, TicketBAI o VERI\*FACTU. Ver [Cómo Activar un Modelo Tributario](../como-activar-un-modelo-tributario/como-activar-un-modelo-tributario.md).

## Con un Sistema Fiscal Activo

Una vez que tu organización tiene un sistema fiscal configurado, el Monitor Fiscal organiza el envío de tus facturas en una pestaña por cada sistema activo. Por ejemplo, una organización con **SII** y **TicketBAI** activos ve ambas pestañas, cada una con su propio contador de facturas:

<figure markdown="span">
  ![Monitor Fiscal con las pestañas SII y TicketBAI](assets/monitor-fiscal-2.jpg)
  <figcaption>Pestaña SII: Facturas emitidas y recibidas del período, con su Estado y el CSV de la AEAT una vez enviadas.</figcaption>
</figure>

!!! info "Pestaña VERI\*FACTU pendiente de documentar"
    Este artículo cubre las pestañas **SII** y **TicketBAI**. Se actualizará con la pestaña **VERI\*FACTU** una vez validada contra una organización con ese sistema activo.

### Pestaña SII

Se divide en **Facturas emitidas** y **Facturas recibidas**, y un filtro de período (**Período actual** o **Período anterior**). Cada fila muestra la Fecha, el Nº de Factura (enlaza a la factura original), el Cliente o Proveedor, el Tipo, el Total, el **Estado** del envío, una columna **Motivo error** y el **CSV AEAT** (el código de verificación que devuelve Hacienda una vez aceptado el envío). Puedes seleccionar facturas con la casilla de la izquierda y exportar el listado con el botón **Exportar**.

El **Estado** puede ser:

- **Pendiente** — la factura todavía no fue enviada, o el envío no obtuvo respuesta.
- **Aceptado** — Hacienda validó el envío; la fila muestra su CSV AEAT.
- **Error** — el envío se intentó y falló; la columna **Motivo error** detalla la causa (por ejemplo, un problema de conexión con el servicio o un adjunto que no se generó correctamente).

### Pestaña TicketBAI

Se divide en **Enviadas** y **Rechazadas**. Cada fila muestra la Fecha, el Nº de Factura, una Descripción, si tiene **Firma** digital aplicada, y el **Estado** de la respuesta de la Hacienda Foral (por ejemplo *Aceptado*, en verde):

<figure markdown="span">
  ![Pestaña TicketBAI del Monitor Fiscal con facturas aceptadas](assets/monitor-fiscal-3.jpg)
  <figcaption>Pestaña TicketBAI: cada envío muestra su Firma y el Estado devuelto por la Hacienda Foral.</figcaption>
</figure>

### Estado de envío en el detalle de la factura

El estado de envío también aparece directamente en el detalle de cada factura. La vista rápida (el panel que se abre al pulsar una factura desde el listado) resume su **Estado SII** junto al resto de su información general; si tu organización tiene varios sistemas activos (como SII y TicketBAI), muestra un indicador de estado por cada uno.

Para el detalle completo, la factura tiene su propia pestaña **[SIF](../glosario-de-impuestos/glosario-de-impuestos.md#sif)**, con un panel por cada sistema fiscal activo (por ejemplo **SII**) que incluye su estado (Pendiente, Aceptado o Error) y los campos operativos del envío: **Fecha operación**, **Tipo factura** (por ejemplo *F1 — Factura*), **Descripción SII**, **Causa exención** y **Autorización**.

<figure markdown="span">
  ![Detalle de una factura con Estado SII y Estado TicketBAI](assets/monitor-fiscal-4.jpg)
  <figcaption>El detalle de la factura resume su Estado SII y su Estado TicketBAI de forma independiente.</figcaption>
</figure>

Desde ahí también puedes forzar el envío: el botón **Enviar a SIF** del detalle de la factura reenvía sus registros a todos los sistemas fiscales activos a la vez (por ejemplo, a SII y a TicketBAI si ambos están activos; solo a SII si es el único activo). Es la forma de reintentar una factura en estado Pendiente o Error, por ejemplo tras corregir el problema indicado en Motivo error.

!!! warning "Sin certificado digital, el envío falla"
    Si tu organización todavía no cargó un certificado digital válido en **Configuración Fiscal** (ver [SII](../sii/sii.md)), **Enviar a SIF** muestra el error *"No se ha encontrado ningún certificado válido. Añada el certificado a la organización legal configurada mediante el proceso 'Añadir Certificado Digital'."* y no llega a enviar nada.

!!! tip "Cada sistema fiscal tiene su propia configuración"
    Los campos operativos de cada sistema (autorizaciones especiales AEAT y certificado digital para SII; territorio y envío automático para TicketBAI) se gestionan desde Configuración Fiscal. Ver [SII](../sii/sii.md) y [TicketBAI](../ticketbai/ticketbai.md).

## Artículos Relacionados

- [Cómo Activar un Modelo Tributario](../como-activar-un-modelo-tributario/como-activar-un-modelo-tributario.md)
- [SII](../sii/sii.md)
- [TicketBAI](../ticketbai/ticketbai.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
