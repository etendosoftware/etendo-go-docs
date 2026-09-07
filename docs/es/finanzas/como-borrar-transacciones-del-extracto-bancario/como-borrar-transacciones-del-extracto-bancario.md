---
tags:
    - Cuentas
    - Finanzas
    - Extracto bancario
    - Etendo Go
---

# Borrar transacciones del extracto bancario

Si una importación generó movimientos duplicados o incorrectos, o cargaste algo a mano por error, puedes borrarlos directamente desde la pestaña **Movimientos** de la cuenta. Esta acción elimina el movimiento dentro de Etendo Go; no modifica el archivo de extracto original de tu banco.

> Si el movimiento que borras ya estaba **Conciliado**, la conciliación se revierte junto con él: el documento que tenía vinculado (una factura, un cobro o un pago) vuelve a quedar pendiente de conciliar. Revisa el estado de la columna **Conciliación** antes de borrar para evitar sorpresas.

## Borrar una transacción individual

1. Abre la cuenta desde **[Finanzas > Cuentas](https://go.etendo.cloud/financial-account){target="_blank"}** y ve a la pestaña **Movimientos**.
2. Marca la casilla de la fila que quieres borrar. Al seleccionar al menos un movimiento aparece la barra **X Seleccionados** con el botón **Eliminar seleccionados (X)**.

![Movimiento seleccionado en la pestaña Movimientos, con la barra 1 Seleccionados y el botón Eliminar seleccionados (1)](assets/como-borrar-transacciones-del-extracto-bancario-1.png)

3. Haz clic en **Eliminar seleccionados (1)**.
4. Confirma en el diálogo **Eliminar registros**: *"¿Estás seguro de que deseas eliminar 1 registro(s)? Esta acción no se puede deshacer."*

![Diálogo de confirmación Eliminar registros, con el aviso de que la acción no se puede deshacer](assets/como-borrar-transacciones-del-extracto-bancario-2.png)

## Borrar varias transacciones a la vez

1. En la pestaña **Movimientos**, marca la casilla de cada fila que quieras borrar, o usa la casilla del encabezado de la tabla para seleccionar todas las visibles.
2. Haz clic en **Eliminar seleccionados (X)** y confirma en el mismo diálogo.

Esto es útil sobre todo después de una importación duplicada: en vez de revisar movimiento por movimiento, filtra por fecha o por el extracto recién importado, selecciona todo el lote y elimínalo de una sola vez.

## Qué hacer si necesitas volver a importar el extracto

Borrar los movimientos no elimina el registro del extracto importado en la pestaña **Extractos importados**; si necesitas reintentar la importación completa, borra también ese extracto antes de subir el archivo de nuevo, para no terminar con movimientos mezclados de dos intentos distintos. Consulta [Importar o descargar el extracto bancario](../como-importar-o-descargar-el-extracto-bancario/como-importar-o-descargar-el-extracto-bancario.md) para el detalle del proceso de importación.

---

## Artículos Relacionados

- [Importar o descargar el extracto bancario](../como-importar-o-descargar-el-extracto-bancario/como-importar-o-descargar-el-extracto-bancario.md)
- [¿Qué es la conciliación bancaria en Etendo Go?](../que-es-la-conciliacion-bancaria-en-etendo-go/que-es-la-conciliacion-bancaria-en-etendo-go.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
