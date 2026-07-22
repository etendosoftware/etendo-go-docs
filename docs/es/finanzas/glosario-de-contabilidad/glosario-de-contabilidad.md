---
tags:
    - Contabilidad
    - Finanzas
    - Glosario
    - Etendo Go
---

# Glosario de Contabilidad

## Activo

Bien fijo de la empresa (vehículo, equipo informático, maquinaria) que se deprecia a lo largo de su vida útil. Cada activo puede tener un plan de amortización asociado. Ver [Activos](../activos/activos.md).

## Amortización

Registro que agrupa la ejecución de la depreciación de uno o varios activos para un período contable. Al confirmarla, genera los asientos contables correspondientes. Ver [Amortización](../amortizacion/amortizacion.md).

## Depreciación

Distribución del valor de un activo a lo largo de su vida útil, calculada según el tipo de amortización y el tipo de cálculo definidos en el activo (Porcentaje o Tiempo).

## Plan de amortización

Conjunto de líneas generadas al pulsar **Crear amortización** desde un activo, una por período, con su porcentaje e importe. Vive en la pestaña **Plan de amortización** del formulario de Activo.

## Asiento contable

Registro en la contabilidad que refleja el gasto de depreciación de un período. Se genera de forma definitiva al confirmar una Amortización.

## Grupo activo

Categoría contable de un activo. Determina las cuentas contables usadas en sus asientos.

## Valor residual

Valor estimado de un activo al final de su vida útil. Debe ser menor o igual al valor del activo.

## Valor a amortizar

Resultado de restar el valor residual al valor del activo. Es la base sobre la que se calcula la depreciación. Se calcula automáticamente.

## Dimensiones contables

Campos opcionales para asociar un activo o una línea de amortización a un eje de análisis. En la cabecera del Activo: **Proyecto**, **Centro de coste**, **Contacto**, **1ª Dimensión**, **2ª Dimensión**, **Región de ventas**, **Actividad** y **Campaña**. En las líneas de Amortización, según el diseño funcional: **Contacto**, **Proyecto** y **Centro de coste** (Producto no aplica).

## Borrador

Estado inicial y editable de una Amortización. En Borrador se pueden añadir, modificar o eliminar líneas y cambiar los datos generales.

## Procesado

Estado de una Amortización ya confirmada. Ya no se pueden editar sus líneas ni sus datos generales.

## Confirmar

Acción que pasa una Amortización de Borrador a Procesado. Es independiente de Contabilizar: un registro puede quedar Procesado y Sin contabilizar a la vez.

## Contabilizado / Sin contabilizar

Indicador independiente del estado (Borrador/Procesado) que muestra si ya se generaron los asientos contables de la Amortización. Se activa con la acción **Contabilizar**, disponible una vez que el registro está Procesado.

## Contabilizar

Acción que genera los asientos contables de una Amortización ya Procesada y la pasa a **Contabilizado**.

## Reactivar

Acción que devuelve una Amortización a Borrador y Sin contabilizar en un solo paso, deshaciendo tanto Confirmar como Contabilizar.

## Artículos Relacionados

- [Activos](../activos/activos.md)
- [Amortización](../amortizacion/amortizacion.md)
- [Crear un plan de amortización](../activos/crear-un-plan-de-amortizacion/crear-un-plan-de-amortizacion.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
