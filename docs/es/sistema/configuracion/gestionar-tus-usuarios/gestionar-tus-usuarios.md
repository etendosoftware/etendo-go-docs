---
title: Gestionar tus usuarios
description: >-
  Recorre la vista lista y la ficha de la ventana Usuarios en Etendo: sus
  columnas, los estados posibles y todas las acciones disponibles sobre cada usuario.
tags:
  - Roles y usuarios
  - Usuarios
  - Sistema
  - Configuración
  - Etendo
---

# Gestionar tus usuarios

La ventana **Usuarios** (Sistema > Configuración > Usuarios) reúne a todas las personas con acceso a tu cuenta. Para invitar o eliminar un usuario, consulta [Cómo invitar a un usuario](../como-invitar-a-un-usuario/como-invitar-a-un-usuario.md).

!!! info "Necesitas el rol Administrador"
    Es el único rol con acceso a esta ventana — ningún otro rol la ve, ni siquiera en modo solo lectura.

## Vista Lista

<figure markdown="span">
  ![Lista de usuarios con las columnas Nombre, Correo electrónico, Activo, Invitación y Roles](assets/gestionar-tus-usuarios-1.png)
  <figcaption>Vista lista de la ventana Usuarios.</figcaption>
</figure>

- **Nombre** y **Correo electrónico** — identifican al usuario.
- **Activo** — interruptor que habilita o deshabilita el acceso del usuario sin eliminarlo.
- **Invitación** — muestra **Pendiente** mientras el usuario no aceptó su invitación por correo, o **Aceptada** una vez que la aceptó.
- **Roles** — rol asignado al usuario. Queda vacío ("—") mientras la invitación está pendiente.
- Filtro **Todos los roles**, para acotar la lista a un rol específico.
- Botón **+ Nuevo usuario**, para invitar a alguien nuevo.

## Vista Detalle

<figure markdown="span">
  ![Ficha de un usuario con los campos Nombre, Correo electrónico y Roles asignados, y la pestaña Roles del usuario con la vista previa de permisos](assets/gestionar-tus-usuarios-2.png)
  <figcaption>Ficha de detalle de un usuario, con sus roles y la vista previa de permisos.</figcaption>
</figure>

Al abrir un usuario desde la lista, accedes a su ficha con:

- Los campos **Nombre** y **Correo electrónico**.
- El campo **Roles asignados**, que resume el acceso vigente del usuario.
- Dos pestañas: **Roles del usuario** (detalle de permisos del rol asignado) y **Adjuntos**.
- En la barra superior, según el estado del usuario: el interruptor **Activo**, la etiqueta **Invitación pendiente** (si corresponde) y los botones de acción disponibles.

!!! info "Propietario"
    El usuario que creó la cuenta aparece etiquetado como **Propietario** junto a su nombre — no es un rol asignable. Ver definición completa en el [Glosario de Roles y usuarios](../glosario-de-roles-y-usuarios/glosario-de-roles-y-usuarios.md#propietario).

## Estados del Usuario

El estado de un usuario combina dos aspectos independientes: si tiene el acceso activo, y si ya aceptó la invitación. Por ejemplo, un usuario puede estar Inactivo y a la vez con su invitación Aceptada.

**Acceso**

| Estado | Descripción |
|---|---|
| <span style="background:#F0FDF4;color:#22C55E;padding:2px 10px;border-radius:12px;font-size:.85em;white-space:nowrap">Activo</span> | El interruptor **Activo** está encendido; el usuario puede iniciar sesión. |
| <span style="background:#F3F4F6;color:#6B7280;padding:2px 10px;border-radius:12px;font-size:.85em;white-space:nowrap">Inactivo</span> | El interruptor **Activo** está apagado; se le retira el acceso sin eliminar el registro. |

**Invitación**

| Estado | Descripción |
|---|---|
| <span style="background:#FFF7ED;color:#F59E0B;padding:2px 10px;border-radius:12px;font-size:.85em;white-space:nowrap">Pendiente</span> | El usuario fue creado pero todavía no aceptó el correo de invitación. Por defecto no tiene ningún rol asignado, pero puedes asignarle uno en cualquier momento, incluso antes de que acepte. |
| <span style="background:#F0FDF4;color:#22C55E;padding:2px 10px;border-radius:12px;font-size:.85em;white-space:nowrap">Aceptada</span> | El usuario aceptó la invitación y ya puede acceder a la cuenta con el rol que tenga asignado. |

## Acciones Disponibles

| Acción | Dónde | Descripción |
|:-------|:------|:------------|
| Nuevo usuario | Vista lista | Invita a una persona nueva. Ver [Cómo invitar a un usuario](../como-invitar-a-un-usuario/como-invitar-a-un-usuario.md#invitar-a-un-usuario). |
| Editar | Fila de la lista / ficha | Abre la ficha del usuario. |
| Eliminar | Fila de la lista / ficha | Quita al usuario de la cuenta y cancela una invitación pendiente. Ver [Cómo invitar a un usuario](../como-invitar-a-un-usuario/como-invitar-a-un-usuario.md#eliminar-un-usuario-de-tu-cuenta). |
| Reenviar invitación | Ficha, si está pendiente | Vuelve a enviar el correo de invitación. Ver [Cómo invitar a un usuario](../como-invitar-a-un-usuario/como-invitar-a-un-usuario.md#reenviar-una-invitacion-pendiente). |
| Activar / Desactivar | Ficha (interruptor Activo) | Habilita o deshabilita el acceso sin eliminar el usuario. El cambio se aplica al instante, sin pedir confirmación (a diferencia de Eliminar). |
| Cambiar rol / Hacer administrador | Ficha, campo Roles asignados | Asigna Ventas, Compras, Finanzas y/o Inventario, o vuelve a dar acceso completo. Ver [Cómo invitar a un usuario](../como-invitar-a-un-usuario/como-invitar-a-un-usuario.md#cambiar-el-rol-de-un-usuario). |

## Artículos relacionados

- [¿Qué es la sección Roles y usuarios?](../que-es-roles-y-usuarios/que-es-roles-y-usuarios.md)
- [Cómo invitar a un usuario](../como-invitar-a-un-usuario/como-invitar-a-un-usuario.md)
- [Glosario de Roles y usuarios](../glosario-de-roles-y-usuarios/glosario-de-roles-y-usuarios.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
