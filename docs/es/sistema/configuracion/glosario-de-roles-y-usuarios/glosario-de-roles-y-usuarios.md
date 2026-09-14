---
title: Glosario de Roles y usuarios
description: >-
  Consulta las definiciones de usuario, rol y nivel de acceso, y qué roles
  predefinidos existen en Etendo y a qué ventanas da acceso cada uno.
tags:
  - Roles y usuarios
  - Usuarios
  - Glosario
  - Sistema
  - Configuración
  - Etendo
---

# Glosario de Roles y usuarios

## Usuario

Persona con acceso a tu cuenta de Etendo, identificada por su nombre y su correo electrónico. Ver [Cómo invitar a un usuario](../como-invitar-a-un-usuario/como-invitar-a-un-usuario.md).

## Propietario

Etiqueta que identifica al usuario que creó la cuenta. No es un rol asignable. Por ahora, Etendo no ofrece una función para transferir la propiedad de la cuenta a otro usuario.

## Rol

Conjunto fijo de permisos que determina qué ventanas puede ver un usuario y con qué nivel de acceso. Etendo ofrece cinco roles predefinidos — no es posible crear roles personalizados.

**Administrador** es excluyente: un usuario con este rol no puede tener ningún otro a la vez. Los cuatro roles restantes — **Ventas**, **Compras**, **Finanzas** e **Inventario** — sí se pueden combinar entre sí en un mismo usuario (por ejemplo, un usuario con Ventas y Finanzas a la vez).

Solo el rol **Administrador** tiene acceso a Configuración, incluida la ventana Usuarios — ningún otro rol la ve, ni siquiera en modo solo lectura.

!!! info "No lo confundas con el rol de Cliente o Proveedor"
    En la sección [Contactos](../../../comercial/contactos/que-es-la-seccion-contactos/que-es-la-seccion-contactos.md), "rol" también se usa para indicar si un contacto es Cliente o Proveedor de tu empresa. Es un concepto distinto: no tiene relación con los roles de usuario que se explican aquí.

En el menú de tu perfil de usuario (abajo a la izquierda), Etendo muestra el nombre técnico completo de tu rol — combina el nombre de tu organización con el rol, por ejemplo **AMEcompany Admin** — que es el mismo rol que en Usuarios y en este glosario aparece simplificado como **Administrador**.

## Nivel de acceso

Cada rol tiene, para cada ventana del sistema, uno de estos tres niveles:

- **Acceso completo** — puede ver y editar.
- **Solo lectura** — puede ver, no editar.
- **Sin acceso** — la ventana no aparece para ese rol.

## Invitación pendiente

Estado de un usuario recién creado, mientras no acepta el correo de invitación que Etendo le envía automáticamente al guardarlo. Por defecto, un usuario recién invitado no tiene ningún rol asignado (columna Roles vacía en la lista), pero un Administrador puede asignarle uno en cualquier momento —incluso antes de que acepte la invitación— y ese rol ya queda reflejado en la lista. Pasa a **Aceptada** cuando el usuario acepta.

## Roles predefinidos y su acceso

Administrador tiene acceso completo a todas las ventanas, así que no se repite en cada fila. La tabla muestra el acceso de los otros cuatro roles. Puedes consultar esta misma información en vivo desde la ficha de cualquier usuario, en el campo **Roles asignados**.

| Ventana | Ventas | Compras | Finanzas | Inventario |
|:--------|:---:|:---:|:---:|:---:|
| **General** | | | | |
| Inicio (Dashboard) | ✓ | ✓ | ✓ | ✓ |
| Favoritos | ✓ | ✓ | ✓ | ✓ |
| Copilot (Asistente IA) | ✓ | ✓ | ✓ | ✓ |
| **Configuración General** | | | | |
| Rangos de conversión | — | — | ✓ | — |
| Organización | — | — | — | — |
| Usuarios | — | — | — | — |
| **Gestión de Datos Maestros** | | | | |
| Terceros | ✓ | ✓ | ✓ | Solo lectura |
| Producto | ✓ | ✓ | ✓ | ✓ |
| Categoría de Contacto | Solo lectura | Solo lectura | ✓ | — |
| Condiciones de pago | Solo lectura | Solo lectura | ✓ | — |
| Categoría del producto | Solo lectura | Solo lectura | ✓ | ✓ |
| Tarifa | ✓ | ✓ | ✓ | — |
| **Gestión de Compras** | | | | |
| Pedido de Compra | — | ✓ | Solo lectura | Solo lectura |
| Albarán de Compra | — | ✓ | — | ✓ |
| Factura de Compra | — | ✓ | ✓ | — |
| Relación albarán-factura | — | ✓ | ✓ | — |
| Albarán de Devolución (compra) | — | ✓ | — | ✓ |
| **Gestión de Almacén** | | | | |
| Inventario físico | ✓ | — | ✓ | ✓ |
| Movimiento entre almacenes | — | — | — | ✓ |
| Almacén y huecos | — | — | ✓ | ✓ |
| **Gestión de Producción** | | | | |
| Consumo interno | — | — | — | ✓ |
| **Gestión de Ventas** | | | | |
| Presupuesto de Venta | ✓ | — | Solo lectura | — |
| Pedido de Venta | ✓ | — | Solo lectura | Solo lectura |
| Albarán de Venta | ✓ | — | — | ✓ |
| Albarán de devolución (venta) | ✓ | — | — | ✓ |
| Factura de Venta | ✓ | — | ✓ | — |
| **Gestión Financiera** | | | | |
| Pago | — | ✓ | ✓ | — |
| Cobro | ✓ | — | ✓ | — |
| Cuenta financiera | — | — | ✓ | — |
| Configuración SII | — | — | ✓ | — |
| Monitor SII | — | — | ✓ | — |
| Asientos manuales simplificados | — | — | ✓ | — |
| Abrir/Cerrar periodos | — | — | — | — |
| Árbol de cuentas | — | — | ✓ | — |
| Esquema contable | — | — | ✓ | — |
| Calendario | — | — | ✓ | — |
| Secuencias de documentos | — | — | — | — |
| Categoría de Impuesto | — | — | ✓ | — |
| Impuesto | — | — | ✓ | — |
| Centro de costos | — | — | — | — |
| Activos | — | — | ✓ | — |
| Categoría de activo | — | — | ✓ | — |
| Amortización | — | — | ✓ | — |
| **Reglas de matcheo** | | | | |
| Reglas de matcheo | — | — | — | — |

Esta tabla refleja el acceso general a cada ventana. Dentro de una misma ventana, alguna pestaña puntual con datos sensibles —por ejemplo, la contabilidad de un contacto en Terceros— puede tener una restricción adicional más estricta que la del resto de la ventana.

## Artículos relacionados

- [¿Qué es la sección Roles y usuarios?](../que-es-roles-y-usuarios/que-es-roles-y-usuarios.md)
- [Cómo invitar a un usuario](../como-invitar-a-un-usuario/como-invitar-a-un-usuario.md)
- [Gestionar tus usuarios](../gestionar-tus-usuarios/gestionar-tus-usuarios.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
