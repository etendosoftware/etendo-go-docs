---
tags:
    - Tesorería
    - Cuentas bancarias
    - Etendo Go
---

# Conectar, desconectar, desactivar o eliminar una cuenta bancaria

Una vez que tienes una cuenta creada en Tesorería, puedes cambiar su estado de conexión con el banco o dejar de usarla sin borrar su historial.

- Prerrequisitos: tener al menos una cuenta creada (ver [Añadir y configurar un banco, tarjeta o caja](../como-anadir-y-configurar-un-banco-tarjeta-o-caja/como-anadir-y-configurar-un-banco-tarjeta-o-caja.md)).

## Conectar una cuenta bancaria

Aplica a cuentas de tipo Banco o Tarjeta creadas como **Sin conexión**.

1. Ve a **Finanzas > Cuentas**.
2. En la fila de la cuenta, haz clic en **Conectar banco** (o abre **Acciones de la fila > Conectar banco**).
3. Busca y selecciona tu banco en el listado.
4. Completa la autenticación en la ventana que abre el banco. Se cierra sola al finalizar y la cuenta pasa a mostrar el estado **Sincronizado**.

## Desconectar una cuenta bancaria

Aplica solo a cuentas ya conectadas (estado **Sincronizado**). Detiene la sincronización automática; la cuenta y su historial de movimientos no se eliminan.

1. En el listado de **Cuentas**, abre **Acciones de la fila** sobre la cuenta conectada.
2. Selecciona **Desconectar banco**.
3. Confirma en el diálogo **¿Desconectar esta conexión bancaria?**.

> _Pendiente de confirmación manual: no se completó esta acción en esta pasada (se canceló el diálogo de confirmación para no alterar la única cuenta conectada de prueba disponible). Confirmar si tras desconectar la cuenta vuelve a mostrarse como "Sin conexión" y si conserva el histórico de movimientos ya sincronizados._

## Desactivar una cuenta bancaria

En Etendo Go, "desactivar" corresponde a la acción **Archivar cuenta**.

1. En el listado de **Cuentas**, abre **Acciones de la fila** (o **Editar cuenta**) sobre la cuenta.
2. Selecciona **Archivar cuenta**.
3. Confirma en el diálogo **¿Seguro que quieres archivar esta cuenta?**. La cuenta deja de aparecer en el listado de **Todas las cuentas** y pasa al filtro **Inactivas**.

> _Pendiente de confirmación manual: no se encontró en el producto una acción de "Reactivar cuenta" — al repetir **Archivar cuenta** sobre una cuenta ya archivada, el sistema la vuelve a archivar (acción idempotente) en lugar de reactivarla. Confirmar con el equipo de producto si existe alguna forma de reactivar una cuenta archivada._

## Eliminar una cuenta bancaria

_Pendiente de confirmación manual: no se encontró en el producto una acción de "Eliminar cuenta" (hard delete) en el listado de Cuentas, en Editar cuenta ni en Acciones de la fila — la única acción disponible para dejar de usar una cuenta es **Archivar cuenta**. Confirmar con el equipo de producto si eliminar una cuenta es posible por otra vía (por ejemplo, backoffice) o si esta acción no existe en Etendo Go._

---

## Artículos Relacionados

- [Añadir y configurar un banco, tarjeta o caja](../como-anadir-y-configurar-un-banco-tarjeta-o-caja/como-anadir-y-configurar-un-banco-tarjeta-o-caja.md)
- [Importar o descargar el extracto bancario](../como-importar-o-descargar-el-extracto-bancario/como-importar-o-descargar-el-extracto-bancario.md)
- [¿Qué es la conciliación bancaria en Etendo Go?](../que-es-la-conciliacion-bancaria-en-etendo-go/que-es-la-conciliacion-bancaria-en-etendo-go.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
