---
tags:
    - Activos
    - Amortización
    - Finanzas
    - Etendo Go
    - Cómo hacer
---

# Crear un Plan de Amortización

**Crear un plan de amortización** es el proceso de generar, a partir de un activo ya registrado, las líneas que distribuyen su depreciación en períodos contables. Es el paso obligatorio para poder ejecutar la depreciación desde [Amortización](../../amortizacion/amortizacion.md).

!!! info "Prerrequisitos"
    Antes de generar el plan, el activo debe tener:

    - El interruptor **Depreciar** activado.
    - El **Tipo de amortización** y el **Tipo de cálculo** completos.
    - La **Fecha inicio** definida — sin esta fecha el plan no puede crearse.

    Consulta [Activos](../activos.md) para el detalle de estos campos, o [Apuntar un Activo](../apuntar-un-activo.md) si todavía no registraste el activo.

1. Ve a **Finanzas** > **Activos** y abre el activo para el que quieres generar el plan.
2. Verifica que el interruptor **Depreciar** esté activado y que **Fecha inicio** esté completa.
3. Confirma el **Tipo de cálculo**:
    - Si es *Porcentaje*, revisa el **% Amortización anual**.
    - Si es *Tiempo*, revisa **Amortizar** (Mensual o Anual) y **Vida útil**.
4. Pulsa **Guardar** si hiciste cambios.
5. Pulsa **Crear amortización**.
6. El sistema genera las líneas del plan en la pestaña **Plan de amortización**, una por período, con su porcentaje e importe.

!!! tip "Revisar el plan generado"
    Cada línea del plan muestra el **Período**, el **Porcentaje**, el **Importe** y el **Estado**: **Pendiente** si todavía no se ejecutó, o **Confirmado** una vez que se confirmó desde una Amortización.

Una vez generado el plan, cada período se ejecuta desde un registro de [Amortización](../../amortizacion/amortizacion.md); puedes navegar a él directamente haciendo clic en el período correspondiente dentro del plan.

## Artículos Relacionados

- [Activos](../activos.md)
- [Amortización](../../amortizacion/amortizacion.md)
- [Apuntar un Activo](../apuntar-un-activo.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
