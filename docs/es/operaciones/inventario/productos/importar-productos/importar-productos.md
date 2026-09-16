---
title: Importar productos
tags:
    - Producto
    - Inventario
    - Importar
    - Etendo
---

# Importar productos

Si necesitas dar de alta varios productos a la vez, en vez de crearlos uno por uno desde el formulario, puedes importarlos masivamente desde un archivo CSV, TXT o Excel.

## Abre la ventana de importación

1. Ve a **[Inventario > Producto](https://go.etendo.cloud/product){target="_blank"}**.
2. En la vista lista, haz clic en el ícono **Importar** de la barra de herramientas superior.

    <figure markdown="span">
      ![Vista lista de Producto, con el ícono Importar en la barra de herramientas](assets/importar-productos-1.jpg)
      <figcaption>Ícono Importar en la barra de herramientas de la ventana Producto.</figcaption>
    </figure>

## Descarga la plantilla

En la ventana **Importar**, descarga la plantilla en el formato que prefieras (**CSV** o **Excel**) antes de preparar tu archivo.

<figure markdown="span">
  ![Ventana Importar, con la zona para soltar el archivo y los enlaces de plantilla](assets/importar-productos-2.jpg)
  <figcaption>Ventana Importar: zona de carga de archivo y enlaces de descarga de plantilla.</figcaption>
</figure>

La plantilla trae las siguientes columnas:

- **Código** *(obligatorio)* — Identificador interno (SKU) del producto. Equivale al campo **Identificador** del formulario de alta manual.
- **Nombre** *(obligatorio)* — Nombre comercial del producto.
- **Descripción** *(opcional)*.
- **Tipo** *(opcional)* — Determina si el producto gestiona stock (Artículo) o no (Servicio, Recurso, Gasto).
- **Unidad** *(opcional)* — Unidad de medida (ej. Unidad, Kg, Litro).
- **Precio de venta** y **Precio de compra** *(opcionales)*.
- **Categoría** *(opcional)* — Categoría de producto ya existente en el sistema.

!!! warning "Pendiente de validar con QA"
    Falta confirmar con QA qué valores exactos acepta la columna **Tipo** (por ejemplo si debe escribirse "Artículo" o el identificador interno "Item") y qué pasa si la **Categoría** indicada no existe todavía en el sistema.

!!! info "Hallazgo de pruebas: la importación tarda en procesarse y no muestra avance"
    Etendo procesa cada fila de forma individual contra el servidor (y crea cada categoría nueva por separado antes de los productos que la usan), por lo que un lote de 10 filas puede tardar varios segundos en terminar de importarse después de hacer clic en **Confirmar importación**. Durante ese tiempo no hay ningún indicador de progreso. En nuestras pruebas, revisar el resultado antes de tiempo (o navegar a otra pantalla) dio la impresión de una importación incompleta; esperando a que el proceso termine, lotes de hasta 10 filas —incluso con categorías nuevas— se importaron siempre al 100%. QA debería confirmar el comportamiento con lotes más grandes y evaluar si conviene pedir que Etendo agregue un indicador de progreso.

## Completa y carga tu archivo

1. Completa la plantilla con tus productos, respetando al menos las columnas obligatorias (**Código** y **Nombre**).
2. Vuelve a la ventana **Importar** y arrastra tu archivo a la zona indicada, o haz clic para seleccionarlo desde tu computadora.

## Revisa el mapeo de columnas

Al cargar el archivo, Etendo intenta emparejar automáticamente cada columna de tu archivo con el campo correspondiente del producto (por ejemplo, **Código** → **Search Key**, **Nombre** → **Name**). Si alguna columna no se asignó correctamente, haz clic en **Editar correspondencia** para corregirla manualmente antes de continuar.

## Revisa las filas correctas y con errores

Debajo del mapeo, Etendo separa las filas de tu archivo en dos pestañas:

- **Correctas** — filas listas para importarse.
- **Errores** — filas con datos faltantes o inválidos, con el motivo indicado en rojo (por ejemplo, "Falta un campo obligatorio").

<figure markdown="span">
  ![Ventana Importar con una fila correcta lista para importar](assets/importar-productos-3.jpg)
  <figcaption>Pestaña Correctas: fila validada, lista para importar.</figcaption>
</figure>

<figure markdown="span">
  ![Ventana Importar con una fila en la pestaña Errores, con el campo obligatorio faltante resaltado](assets/importar-productos-4.jpg)
  <figcaption>Pestaña Errores: fila con un campo obligatorio faltante, editable en la misma tabla.</figcaption>
</figure>

Puedes corregir un error directamente en la celda resaltada de la tabla, o hacer clic en **Descargar errores** para exportar solo las filas con problemas, corregirlas en tu archivo original y volver a importarlas después.

!!! info "Importar solo lo que está correcto"
    No hace falta que corrijas los errores para avanzar: el botón **Importar** solo carga las filas de la pestaña **Correctas**. Las filas con errores quedan afuera hasta que las corrijas y las vuelvas a importar.

## Importa los productos

Haz clic en **Importar [cantidad]**, y confirma en el diálogo que se abre a continuación. Los productos importados quedan disponibles en la vista lista de Producto, igual que si los hubieras creado manualmente.

<figure markdown="span">
  ![Vista lista de Producto con los productos ya importados](assets/importar-productos-5.jpg)
  <figcaption>Vista lista de Producto después de una importación exitosa.</figcaption>
</figure>

!!! tip "Espera a que termine antes de revisar el resultado"
    Para lotes de varias filas, espera unos segundos después de confirmar antes de salir de la ventana o revisar la vista lista (ver nota sobre el tiempo de procesamiento más arriba).

---

## Artículos Relacionados

- [¿Qué es la sección de Productos?](../index.md)
- [Crear un producto](../crear-un-producto/crear-un-producto.md)
- [Crear y configurar una categoría de producto](../crear-una-categoria-de-producto/crear-una-categoria-de-producto.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
