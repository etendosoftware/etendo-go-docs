---
tags:
  - Activos
  - Amortización
  - Finanzas
  - Etendo Go
  - Cómo hacer
---

# Apuntar un Activo

**Apuntar** un activo es el proceso de registrarlo en el módulo [Activos](activos.md) para que el sistema pueda calcular y gestionar su depreciación. Se hace cada vez que la empresa adquiere un bien fijo (vehículo, equipo, maquinaria) o cuando se migran activos existentes desde otro sistema. El detalle de cada campo del formulario está en [Activos](activos.md).

1. Ve a **Finanzas** > **Activos**.
2. Pulsa **+ Nuevo activo**.
3. En la sección **Datos del Activo**, completa:
    - **Identificador** — usa el número de inventario interno.
    - **Nombre** — escribe el nombre descriptivo del bien (por ejemplo, *Servidor Dell R740*).
    - **Grupo activo** — selecciona la categoría contable que corresponde al tipo de bien.
4. En la sección **Información Financiera**, completa:
    - **Valor del activo** — ingresa el importe de adquisición (base imponible, sin IVA).
    - **Valor residual** — estima el valor al final de la vida útil; si no aplica, deja *0*.
    - **Amortizado anterior** — si el activo ya tenía depreciación acumulada antes de registrarlo en Etendo Go, ingresa aquí el importe ya depreciado. Si es un activo nuevo, deja *0*.
    - **Tipo de amortización** — selecciona *Lineal*.
    - **Tipo de cálculo** — elige *Porcentaje* o *Tiempo* según cómo quieras expresar la vida útil:
        - Si eliges *Porcentaje*: completa **% Amortización anual** y luego **Fecha fin** de forma manual.
        - Si eliges *Tiempo*: completa **Amortizar** (periodicidad) y **Vida útil - Meses**; la **Fecha fin** se calcula automáticamente.
5. En la sección **Fechas**, completa:
    - **Fecha compra** — ingresa la fecha de adquisición (es informativa).
    - **Fecha inicio** — ingresa la fecha desde la cual el activo debe empezar a depreciarse.
6. Pulsa **Guardar**.
7. Pulsa **Crear amortización** para generar el plan de amortización.

!!! tip "Si tienes la factura de compra"
    Ve a la pestaña **Adjuntos** y sube el PDF de la factura. Así el activo queda vinculado a su comprobante de forma centralizada.

!!! warning "Paso obligatorio"
    Sin pulsar **Crear amortización**, el activo queda registrado pero sin plan de depreciación. Consulta [Amortización](../amortizacion/amortizacion.md) para ver cómo procesar los períodos.

---

## Artículos Relacionados

- [Activos](activos.md)
- [Amortización](../amortizacion/amortizacion.md)

---
This work is licensed under :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [ CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} by [Futit Services S.L](https://etendo.software){target="_blank"}.
