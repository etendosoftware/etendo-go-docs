---
tags:
    - Cuentas
    - Finanzas
    - Activos
    - Glosario
    - Etendo Go
---

# Glosario de Finanzas

## Activo

Bien fijo de la empresa (vehículo, equipo informático, maquinaria) que se amortiza a lo largo de su vida útil. Cada activo puede tener un plan de amortización asociado. Ver [Apuntar un activo](../como-apuntar-un-activo/como-apuntar-un-activo.md).

## Amortización

Distribución del valor de un activo a lo largo de su vida útil, calculada según el tipo de amortización y el tipo de cálculo definidos en el activo (Porcentaje o Tiempo). También es el nombre del registro que agrupa la ejecución de esa distribución para uno o varios activos en un período contable: al confirmarlo, genera los asientos contables correspondientes. Ver [Crear y ejecutar un plan de amortización](../como-crear-y-ejecutar-un-plan-de-amortizacion/como-crear-y-ejecutar-un-plan-de-amortizacion.md).

## Archivar

Acción que deja de mostrar una cuenta financiera en el listado de **Todas las cuentas** sin borrar su saldo ni su historial: la cuenta pasa al filtro **Inactivas**. Su opuesto es **Desarchivar**. No implica eliminar la cuenta: en Etendo Go no existe una acción para borrar una cuenta financiera de forma permanente. Ver [Conectar, desconectar, desactivar o reactivar una cuenta](../como-conectar-desconectar-desactivar-o-eliminar-una-cuenta-bancaria/como-conectar-desconectar-desactivar-o-eliminar-una-cuenta-bancaria.md).

## Asiento contable

Registro en la contabilidad que refleja el gasto de amortización de un período. Se genera de forma definitiva al confirmar una Amortización.

## Automatch

El motor de sugerencias automáticas de conciliación de Etendo Go. Compara las líneas pendientes de tu extracto bancario contra tus facturas, cobros y pagos por fecha e importe, y te propone las coincidencias para que las confirmes con un clic.

## Borrador

Estado inicial y editable de una Amortización. En Borrador se pueden añadir, modificar o eliminar líneas y cambiar los datos generales.

## Caja

Tipo de cuenta financiera para el efectivo que se maneja fuera del banco (por ejemplo, la caja chica de una oficina o la caja de un punto de venta). A diferencia de un Banco o una Tarjeta, una Caja no se conecta ni importa extractos de una entidad externa: todos sus movimientos se registran a mano. Ver [Gestionar cajas contables y movimientos en efectivo](../como-gestionar-cajas-contables-y-movimientos-en-efectivo/como-gestionar-cajas-contables-y-movimientos-en-efectivo.md).

## Cobro

Registro del dinero que recibes de un cliente. Normalmente se crea desde una factura de venta, pero también puede originarse en una Entrada registrada a mano en una caja. En ambos casos queda disponible en la vista global **Finanzas > Cobro**. Ver [Gestionar pagos y cobros](../como-gestionar-pagos-y-cobros/como-gestionar-pagos-y-cobros.md) y [Gestionar cajas contables y movimientos en efectivo](../como-gestionar-cajas-contables-y-movimientos-en-efectivo/como-gestionar-cajas-contables-y-movimientos-en-efectivo.md).

## Concepto contable

La cuenta contable que se asigna a un movimiento, un cobro, un pago o una regla de matcheo. Determina en qué cuenta del plan contable queda registrada esa operación.

## Conciliado / Sin conciliar

Estado que indica si un movimiento ya quedó vinculado a su documento correspondiente (una factura, un cobro o un pago) durante la conciliación bancaria.

## Condición sobre el concepto

Campo de una regla de matcheo que define cómo se compara su patrón contra la descripción del movimiento: **Contiene**, **Empieza con** o **Regex** (una sintaxis de búsqueda avanzada para patrones de texto complejos; si no estás familiarizado con expresiones regulares, usa **Contiene** o **Empieza con**).

## Confirmar

Acción que pasa una Amortización de Borrador a Procesado. Es independiente de Contabilizar: un registro puede quedar Procesado y Sin contabilizar a la vez.

## Contabilizado / Sin contabilizar

Indicador independiente de otros estados (como Borrador/Procesado en una Amortización, o Conciliado/Sin conciliar en un movimiento) que muestra si ya se generaron los asientos contables de un registro. En una Amortización se activa con la acción **Contabilizar**, disponible una vez que el registro está Procesado; en un movimiento queda determinado automáticamente al confirmarlo.

## Contabilizar

Acción que genera los asientos contables de una Amortización ya Procesada y la pasa a **Contabilizado**.

## Cuenta financiera

Cuenta de banco, tarjeta o caja que registras en Etendo Go para llevar el control de tu dinero. Mantiene su propio saldo y su propio historial de movimientos, y puede conectarse por Open Banking o gestionarse sin conexión. Ver [Añadir y configurar un banco, tarjeta o caja](../como-anadir-y-configurar-un-banco-tarjeta-o-caja/como-anadir-y-configurar-un-banco-tarjeta-o-caja.md).

## Cuenta transitoria

Cuenta contable opcional que puedes asociar a una cuenta financiera desde **Editar cuenta > Contabilidad**. Sirve para registrar de forma temporal operaciones cuyo concepto contable definitivo todavía no está claro, sin afectar directamente a la cuenta contable principal.

## Dimensiones contables

Campos opcionales para asociar un registro a un eje de análisis: **Proyecto**, **Centro de coste**, **Contacto** o **Producto**. Se usan en activos, líneas de amortización, movimientos, pagos y cobros. No afectan el saldo ni la conciliación, solo permiten filtrar y analizar tus registros por ese eje. Qué dimensiones están disponibles depende de cada formulario.

## Extracto bancario

Archivo con el detalle de los movimientos de una cuenta bancaria en un período. Se importa a Etendo Go (en formato Cuaderno 43, CSV o Excel) para generar sus movimientos automáticamente, o se descarga para tu propio registro. Ver [Importar o descargar el extracto bancario](../como-importar-o-descargar-el-extracto-bancario/como-importar-o-descargar-el-extracto-bancario.md).

## Grupo activo

Categoría contable de un activo. Determina las cuentas contables usadas en sus asientos.

## Movimiento

Cada entrada o salida de dinero dentro de una cuenta financiera (transferencias, pagos, cobros, retiradas de efectivo). Tiene dos estados independientes: uno de conciliación (Sin conciliar / Conciliado) y uno de contabilización (Sin contabilizar / Contabilizado).

## Pago

Registro del dinero que entregas a un proveedor. Normalmente se crea desde una factura de compra, pero también puede originarse en una Salida registrada a mano en una caja. En ambos casos queda disponible en la vista global **Finanzas > Pago**. Ver [Gestionar pagos y cobros](../como-gestionar-pagos-y-cobros/como-gestionar-pagos-y-cobros.md) y [Gestionar cajas contables y movimientos en efectivo](../como-gestionar-cajas-contables-y-movimientos-en-efectivo/como-gestionar-cajas-contables-y-movimientos-en-efectivo.md).

## Plan de amortización

Conjunto de líneas generadas al pulsar **Crear amortización** desde un activo, una por período, con su porcentaje e importe. Vive en la pestaña **Plan de amortización** del formulario de Activo.

## Procesado

Estado de una Amortización ya confirmada. Ya no se pueden editar sus líneas ni sus datos generales.

## Reactivar

Acción que revierte el estado de un registro ya confirmado. Su efecto exacto depende del tipo de registro: en una **Amortización**, devuelve el registro a Borrador y Sin contabilizar en un solo paso, deshaciendo tanto Confirmar como Contabilizar; en un **Cobro** o **Pago**, revierte su confirmación (ver [Gestionar pagos y cobros](../como-gestionar-pagos-y-cobros/como-gestionar-pagos-y-cobros.md)). No debe confundirse con **Desarchivar**, la acción que reactiva una cuenta financiera archivada (ver [Conectar, desconectar, desactivar o reactivar una cuenta](../como-conectar-desconectar-desactivar-o-eliminar-una-cuenta-bancaria/como-conectar-desconectar-desactivar-o-eliminar-una-cuenta-bancaria.md)).

## Regla de matcheo

Regla configurable que concilia automáticamente líneas de extracto recurrentes sin factura asociada —por ejemplo, una comisión bancaria mensual— sin que tengas que buscarlas a mano cada vez. Ver [Configurar reglas para automatizar la conciliación](../como-configurar-reglas-para-automatizar-la-conciliacion-bancaria/como-configurar-reglas-para-automatizar-la-conciliacion-bancaria.md).

## Tolerancia de conciliación

Margen configurable por cuenta, desde **Editar cuenta > General**, que le indica a Automatch y a las reglas de matcheo cuánta diferencia de fecha (en días) o de importe (en %) pueden aceptar para sugerir una coincidencia.

## Valor a amortizar

Resultado de restar el valor residual al valor del activo. Es la base sobre la que se calcula la amortización. Se autocompleta, pero es editable.

## Valor residual

Valor estimado de un activo al final de su vida útil. Debe ser menor o igual al valor del activo.

## Artículos Relacionados

- [¿Qué es la sección Finanzas?](../que-es-finanzas/que-es-finanzas.md)
- [Apuntar un activo](../como-apuntar-un-activo/como-apuntar-un-activo.md)
- [Crear y ejecutar un plan de amortización](../como-crear-y-ejecutar-un-plan-de-amortizacion/como-crear-y-ejecutar-un-plan-de-amortizacion.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
