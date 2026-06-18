# Presupuesto de venta

El **Presupuesto de venta** es el primer documento formal del ciclo comercial. Representa una oferta enviada al cliente con el detalle de productos, precios, descuentos y condiciones de pago. Una vez aceptado, puede convertirse directamente en un Pedido de venta o en una Factura de venta, sin necesidad de reintroducir datos.

---

## Vista lista

La vista lista muestra todos los presupuestos con las columnas **Fecha de presupuesto**, **Nº documento**, **Contacto**, **Estado doc.**, **Válido hasta** e **Imp. total**.

Para filtrar la lista se dispone de dos selectores en la barra superior: el primero filtra por **estado del documento** y el segundo por **fecha de presupuesto**, con las opciones Hoy, Ayer, Últimos 7 días, Últimos 30 días, Últimos 12 meses, Todo el tiempo y Personalizado. El ícono de embudo permite aplicar filtros adicionales. Las columnas son ordenables haciendo clic en su encabezado.

Para crear un presupuesto nuevo utiliza el botón **+ Nuevo presupuesto** en la esquina superior derecha.

---

## Vista formulario

El formulario se abre al crear un presupuesto nuevo o al hacer clic sobre uno existente en la lista.

### Cabecera

| Campo | Obligatorio | Comportamiento |
|---|---|---|
| Contacto | ✅ | Al seleccionarlo autocompleta Dirección, Método de pago y Condiciones de pago con la configuración del contacto |
| Nº documento | Auto | Se genera al guardar por primera vez |
| Fecha de presupuesto | ✅ | Por defecto muestra la fecha actual |
| Dirección | ✅ | Cargada desde el contacto; editable para este documento |
| Tarifa | ✅ | Por defecto Lista de venta (sin impuestos); heredada del contacto |
| Válido hasta | ❌ | Fecha límite de validez de la oferta |
| Método de pago | ❌ | Heredado del contacto; editable |
| Condiciones de pago | ✅ | Heredado del contacto; editable |

!!! tip "Autocompletado al elegir el contacto"
    Al seleccionar el contacto, el sistema carga automáticamente la dirección principal y las condiciones de pago configuradas en ese contacto. Si el contacto no tiene una dirección registrada, el campo quedará vacío y deberá completarse manualmente.

### Pestaña Líneas

Las líneas representan los productos o servicios incluidos en la oferta. Para añadir una línea usa el botón **+ Añadir líneas** (vacío) o **+ Añadir línea** (con líneas existentes). Al hacer clic en el campo **Producto** se abre un selector con búsqueda que muestra el nombre, código SKU y precio de cada producto. Podés navegar con las teclas ↑ ↓ y confirmar con **Enter**.

| Campo | Obligatorio | Comportamiento |
|---|---|---|
| Producto | ✅ | Al seleccionarlo autocompleta Descripción y Precio tarifa |
| Descripción | ❌ | Precompletada desde el producto; editable por línea |
| Cant. pedido | ✅ | Por defecto 1 |
| Precio tarifa | ✅ | Tomado del precio de lista del producto; editable |
| % de descuento | ❌ | Se aplica sobre el precio de tarifa de la línea |
| Impuesto | ✅ | Seleccionable desde una lista de tipos impositivos |
| Importe bruto de línea | Calculado | = Cant. × Precio × (1 − desc%) |

Para guardar una línea presioná **Enter** o hacé clic fuera de la fila. Para cancelar sin guardar, presioná **Esc**.

### Totales

El panel de totales en la parte inferior derecha muestra:

- **Subtotal sin descuento** — suma del importe bruto de todas las líneas antes de descuentos.
- **Descuento por producto** — suma de los descuentos por línea.
- **Descuento total** — descuento adicional aplicado al documento completo. Se activa con el enlace **+ Añadir descuento total**.
- **Subtotal** — base imponible tras descuentos.
- **Impuesto** — importe de IVA calculado según el tipo seleccionado en cada línea.
- **Total** — importe final a pagar.

### Documentos relacionados

La sección **Documentos** en la parte inferior del formulario muestra los documentos generados a partir de este presupuesto (pedidos o facturas). Cada documento listado es un enlace navegable que abre el documento correspondiente.

### Notas

El campo **Notas** permite añadir observaciones internas. Este contenido no se incluye en el PDF enviado al cliente.

---

## Estados del documento

El estado actual se muestra como una etiqueta junto al botón **Cancelar** en la barra superior.

| Estado | Descripción |
|---|---|
| Borrador | En preparación. El documento es completamente editable |
| Bajo evaluación | Enviado al cliente, pendiente de respuesta. Edición parcialmente restringida |
| Rechazado | El cliente rechazó la propuesta |
| Cerrado - Pedido creado | Aceptado y convertido en Pedido de venta |
| Cerrado - Factura creada | Aceptado y convertido en Factura de venta directa |

---

## Acciones disponibles

### Barra de acciones

La barra superior del formulario muestra las siguientes acciones:

- **Cancelar** — descarta los cambios no guardados y vuelve a la lista.
- **Guardar** — guarda el documento sin cambiar su estado.
- **Confirmar** — avanza el estado del presupuesto (ver flujo a continuación).
- **Icono de copia** — clona el presupuesto actual creando un nuevo borrador con los mismos datos.
- **Icono de email** — abre el panel de envío por correo electrónico.
- **Icono de papelera** (rojo) — elimina el documento con confirmación previa. Solo disponible en estado Borrador.

### Enviar por email

El icono de sobre abre el panel **Enviar Presupuesto de Venta**, con los campos **Para**, **Asunto** (autocompletado con el número de documento y nombre del contacto) y **Mensaje**. Desde este panel también se puede descargar el PDF con el botón **Descargar PDF**. Para enviar, usa el botón **Enviar**.

---

## Flujo de confirmación

El botón **Confirmar** funciona de forma distinta según el estado actual del presupuesto.

**Desde Borrador** — abre el popup **¿Enviar a Bajo Evaluación?**, con el resumen del documento (contacto, importe total, número de líneas y subtotal). Al confirmar con **Enviar a evaluación**, el presupuesto pasa al estado **Bajo evaluación** y queda listo para ser aceptado o rechazado.

**Desde Bajo evaluación** — abre el popup de cierre con dos opciones:

- **Crear Pedido** — genera un Pedido de venta en estado Borrador con los datos del presupuesto.
- **Crear Factura directa** — genera una Factura de venta en estado Borrador sin pasar por el pedido.

!!! info "Datos heredados en el documento derivado"
    Tanto el Pedido como la Factura creados desde el presupuesto heredan el contacto, la dirección, la tarifa, las condiciones de pago y todas las líneas. No es necesario volver a introducir ningún dato.

Una vez cerrado el presupuesto, el documento derivado aparece en la sección **Documentos relacionados** del formulario.
