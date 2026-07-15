---
title: Gestionar tus contactos
tags:
  - Contactos
  - Comercial
  - Clientes
  - Proveedores
  - Etendo Go
---

# Gestionar tus contactos

## Vista Lista

![Vista lista de Contactos](assets/contactos-lista.gif)

La lista muestra **Razón Social**, **Tipo** (Empresa / Persona), **Dirección**, **Correo electrónico**, **Teléfono** y **Página web**. Para contactos de tipo Persona, se muestran además **Nombre** y **Apellidos**. El tipo de rol se muestra como badge de color: azul claro para **Cliente**, verde claro para **Proveedor**; si un contacto tiene ambos roles, se muestran los dos badges simultáneamente.

Los tres tabs de filtrado rápido — **Todos**, **Empresas** y **Personas** — filtran por el tipo de contacto. Desde los filtros de la ventana es posible acotar además por rol: **Cliente** y/o **Proveedor**. A diferencia de otras ventanas, la lista no muestra acciones rápidas al pasar el cursor sobre una fila.

Para crear un nuevo contacto usa el botón **+ Nuevo contacto** en la esquina superior derecha.

---

## Vista Formulario

El formulario se abre en dos situaciones: al crear un contacto nuevo con **+ Nuevo contacto**, o al hacer clic sobre un contacto existente en la lista — Contactos no tiene una vista detalle intermedia, el clic lleva directo al formulario de edición.

### Tab General

![Formulario General de Contactos](assets/formulario-general.png)

La barra de acciones superior presenta el toggle **Persona / Empresa** que define el tipo de contacto: al seleccionar **Empresa**, los campos Nombre y Apellidos quedan ocultos; al seleccionar **Persona**, aparecen.

El tab **General** presenta los campos en el siguiente orden:

| # | Campo | Tipo | Requerido | Notas |
|---|-------|------|:---:|-------|
| 1 | Identificador | Texto (solo lectura) | Auto | No editable. Se genera al guardar. Ej: `1000001` |
| 2 | Razón Social | Texto | ✅ | Nombre principal del contacto |
| 3 | Nombre | Texto | ❌ | Solo visible si el tipo es Persona |
| 4 | Apellidos | Texto | ❌ | Solo visible si el tipo es Persona |
| 5 | Clave NIF País Residencia | Dropdown | ✅ | Tipo de identificador fiscal: NIF, CIF, VAT, etc. |
| 6 | CIF/NIF | Texto | ❌ | Número de identificación fiscal |
| 7 | Correo electrónico | Texto (email) | ❌ | |
| 8 | Teléfono | Texto | ❌ | |
| 9 | Página web | Texto (URL) | ❌ | |

Debajo de estos campos, el formulario incluye tres sub-tabs para ampliar la información del contacto:

#### Persona

Registra las personas de contacto vinculadas al cliente o proveedor, con datos de nombre, correo, teléfono y posición.

![Sub-tab Persona](assets/subtab-persona.png)

#### Cuenta Bancaria

Almacena las cuentas bancarias del contacto, incluyendo IBAN y Código Swift.

![Sub-tab Cuenta Bancaria](assets/subtab-cuenta-bancaria.png)

#### Dirección

![Popup Ubicación — Dirección](assets/subtab-direccion.png){ align=right width=300 }

Lista las direcciones del contacto. Al agregar o editar una dirección se abre el popup **Ubicación**, donde se completan calle, código postal, ciudad, país y región, y se indica si aplica como dirección de **envíos**, de **facturación**, o ambas.

---

### Tab Financiero

![Formulario Financiero de Contactos](assets/formulario-financiero.png)

El tab Financiero contiene dos bloques independientes, cada uno activado mediante checkbox. El campo **Crédito límite** (con stepper +/−, valor por defecto 0) aplica a ambos roles.

**Bloque Cliente** (checkbox ☑ Cliente):

| # | Campo | Tipo | Descripción |
|---|-------|------|-------------|
| 1 | Tarifa | Dropdown | Tarifa de venta por defecto. Se hereda en documentos de venta |
| 2 | Cuenta | Dropdown | Cuenta contable de ingresos |
| 3 | Método de pago | Dropdown | Método de cobro habitual |
| 4 | Condiciones de pago | Dropdown | Plazo de cobro por defecto (ej: 30 Días) |
| 5 | Bloqueo de cliente | Checkbox | Si está activo, impide crear nuevos documentos de venta para este contacto |

![Formulario Financiero — Bloque Proveedor](assets/formulario-financiero-2.png)

**Bloque Proveedor** (checkbox ☑ Proveedor): los mismos campos, orientados al ciclo de compras — **Tarifa de compra**, **Cuenta contable de gastos**, **Método de pago** y **Condiciones de pago** al proveedor, y su propio **Bloqueo de proveedor**.

El badge Cliente/Proveedor visible en el listado se determina por cuáles de estos checkboxes están activos.

---

## Panel Lateral

![Panel Lateral — Ingresos y Gastos](assets/panel-lateral.png){ align=right width=300 }

Mientras trabajás en el formulario de un contacto, el panel lateral derecho muestra en tiempo real los ingresos y gastos del mes actual asociados a ese contacto, junto con un gráfico de líneas de los **últimos seis meses** que compara ventas vs. compras.

---

## Artículos Relacionados

- [¿Qué es la sección Contactos?](../que-es-la-seccion-contactos/que-es-la-seccion-contactos.md)
- [Ventas](../../ventas/index.md)
- [Compras](../../../operaciones/compras/index.md)

---
Esta obra está bajo la licencia :material-creative-commons: :fontawesome-brands-creative-commons-by: :fontawesome-brands-creative-commons-sa: [CC BY-SA 2.5 ES](https://creativecommons.org/licenses/by-sa/2.5/es/){target="_blank"} de [Futit Services S.L](https://etendo.software){target="_blank"}.
