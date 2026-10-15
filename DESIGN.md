---
name: Legumexapps Biométricos
description: Plataforma interna de Legumex para administrar relojes biométricos y consultar la asistencia que generan.
colors:
  verde-campo: "oklch(59.6% 0.145 163.225)"
  verde-campo-hondo: "oklch(50.8% 0.118 165.612)"
  verde-campo-tenue: "oklch(76.5% 0.177 163.223)"
  azul-senal: "oklch(54.6% 0.245 262.881)"
  azul-senal-foco: "oklch(62.3% 0.214 259.815)"
  azul-senal-tinta: "oklch(48.8% 0.243 264.376)"
  azul-senal-velo: "oklch(97% 0.014 254.604)"
  azul-senal-velo-avatar: "oklch(93.2% 0.032 255.585)"
  azul-noche: "oklch(37.9% 0.146 265.522)"
  pizarra-noche: "oklch(20.8% 0.042 265.755)"
  papel: "#ffffff"
  papel-pizarra: "oklch(98.4% 0.003 247.858)"
  linea-pizarra: "oklch(92.9% 0.013 255.508)"
  linea-pizarra-tenue: "oklch(96.8% 0.007 247.896)"
  linea-gris: "oklch(92.8% 0.006 264.531)"
  tinta: "oklch(21% 0.034 264.665)"
  tinta-titulo: "oklch(20.8% 0.042 265.755)"
  tinta-cuerpo: "oklch(37.2% 0.044 257.287)"
  tinta-etiqueta: "oklch(37.3% 0.034 259.733)"
  tinta-media: "oklch(55.4% 0.046 257.417)"
  tinta-suave: "oklch(70.7% 0.022 261.325)"
  lienzo-oscuro: "oklch(13% 0.028 261.692)"
  superficie-oscura: "oklch(21% 0.034 264.665)"
  superficie-oscura-alta: "oklch(27.8% 0.033 256.848)"
  linea-oscura: "oklch(37.3% 0.034 259.733)"
  tinta-clara: "oklch(96.7% 0.003 264.542)"
  tinta-clara-media: "oklch(70.7% 0.022 261.325)"
  rojo-alerta: "oklch(57.7% 0.245 27.325)"
  rojo-alerta-hondo: "oklch(50.5% 0.213 26.518)"
  rojo-alerta-texto: "oklch(70.4% 0.191 22.216)"
  rojo-alerta-velo: "oklch(97.1% 0.013 17.38)"
  verde-activo: "oklch(52.7% 0.154 150.069)"
  verde-activo-velo: "oklch(98.2% 0.018 155.826)"
  ambar-obra: "oklch(76.9% 0.188 70.08)"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    fontSize: "38px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.55
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "0.05em"
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  2xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.verde-campo}"
    textColor: "{colors.papel}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.verde-campo-hondo}"
  button-primary-disabled:
    backgroundColor: "{colors.verde-campo-tenue}"
  button-danger:
    backgroundColor: "{colors.rojo-alerta}"
    textColor: "{colors.papel}"
    rounded: "{rounded.xl}"
    padding: "10px 20px"
  button-danger-hover:
    backgroundColor: "{colors.rojo-alerta-hondo}"
  button-icon:
    textColor: "{colors.tinta-media}"
    rounded: "{rounded.lg}"
    padding: "8px"
  input-field:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  input-filter:
    backgroundColor: "{colors.papel-pizarra}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.xl}"
    padding: "8px 16px 8px 40px"
  nav-link:
    textColor: "{colors.tinta-media}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  nav-link-active:
    backgroundColor: "{colors.azul-senal-velo}"
    textColor: "{colors.azul-senal-tinta}"
  role-chip:
    textColor: "{colors.tinta-etiqueta}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  role-chip-checked:
    backgroundColor: "{colors.azul-senal-velo}"
  badge-active:
    backgroundColor: "{colors.verde-activo-velo}"
    textColor: "{colors.verde-activo}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-inactive:
    backgroundColor: "{colors.rojo-alerta-velo}"
    textColor: "{colors.rojo-alerta-hondo}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  card-info:
    backgroundColor: "{colors.papel-pizarra}"
    textColor: "{colors.tinta-titulo}"
    rounded: "{rounded.xl}"
    padding: "16px"
  table-wrapper:
    backgroundColor: "{colors.papel}"
    rounded: "{rounded.2xl}"
  table-header:
    backgroundColor: "{colors.papel-pizarra}"
    textColor: "{colors.tinta-media}"
    typography: "{typography.label}"
    padding: "16px 24px"
  table-cell:
    textColor: "{colors.tinta-cuerpo}"
    padding: "16px 24px"
  modal:
    backgroundColor: "{colors.papel}"
    rounded: "{rounded.2xl}"
    padding: "24px"
---

# Design System: Legumexapps Biométricos

## Overview

**Creative North Star: "La Bitácora de RRHH"**

Biométricos es un registro: ordenado, trazable y fácil de releer. Cada pantalla se comporta como una página de bitácora bien llevada, con un título claro, una fila de herramientas (filtros y una acción principal) y luego el dato, casi siempre en tabla. La interfaz es sobria y precisa, pero amable: esquinas generosas y transiciones cortas le quitan la rigidez de un formulario administrativo sin restarle seriedad.

La densidad es de oficina: texto de trabajo a 14px, cabeceras de tabla en versalitas pequeñas, superficies neutras (blanco y pizarra muy clara) donde el color aparece solo cuando significa algo. El verde de Legumex marca la acción que hace avanzar el trabajo; el azul indica dónde está el usuario y qué tiene el foco. La marca profunda (degradado pizarra a azul noche) se reserva para el umbral: login y pantalla de carga. Dentro de la app, el trabajo ocurre sobre papel.

El sistema vive en claro y oscuro con igual cuidado. En oscuro las sombras desaparecen y la profundidad pasa a bordes y anillos de 1px.

**Key Characteristics:**
- Superficies neutras, color solo con función (acción, ubicación, estado).
- Tabla como forma principal de mostrar datos; cabeceras en mayúsculas pequeñas con tracking amplio.
- Esquinas suaves y firmes: 8px en campos, 12px en botones y tarjetas, 16px en contenedores grandes.
- Casi plano: sombra ambiental mínima en reposo, sombras amplias solo en capas flotantes.
- Tema claro y oscuro paritarios, conmutables desde la barra lateral y el login.
- Tipografía del sistema, sin fuente de marca.

## Colors

Paleta neutra de pizarra y gris con dos acentos de función estrictamente separados (Verde Campo para actuar, Azul Señal para ubicar) y una marca nocturna reservada al umbral.

### Primary
- **Verde Campo** (`verde-campo`): botón primario en toda la app ("Crear Usuario", "Editar", "Iniciar Sesión"). Es el único color que dice "haz esto". Se oscurece a **Verde Campo Hondo** al pasar el cursor y se aclara a **Verde Campo Tenue** cuando está deshabilitado.

### Secondary
- **Azul Señal** (`azul-senal`, `azul-senal-foco`, `azul-senal-tinta`): ubicación y foco. Enlace activo de la barra lateral (fondo **Velo Azul**, texto Azul Señal Tinta), anillo de foco de campos (Azul Señal Foco al 20%), casillas de rol marcadas, inicial del avatar del usuario.

### Tertiary
- **Azul Noche** y **Pizarra Noche** (`azul-noche`, `pizarra-noche`): solo el degradado de marca (pizarra 900 → azul 900 → pizarra 800, en diagonal) del login, del fondo público y de la pantalla de carga. Nunca dentro del área de trabajo.

### Neutral
- **Papel** (`papel`): fondo del área de trabajo, tablas, modales y campos en claro.
- **Papel Pizarra** (`papel-pizarra`): cabecera de tabla, fila en hover, tarjetas de información, fondo del filtro de búsqueda.
- **Línea Pizarra** / **Línea Gris** (`linea-pizarra`, `linea-gris`): bordes de tabla, campos, barra lateral y cabecera. **Línea Pizarra Tenue** separa filas.
- **Tinta** (`tinta`, `tinta-titulo`): texto principal y títulos de página.
- **Tinta Cuerpo** (`tinta-cuerpo`): texto de celdas.
- **Tinta Etiqueta** (`tinta-etiqueta`): etiquetas de campos de formulario.
- **Tinta Media** (`tinta-media`): subtítulos, cabeceras de tabla, enlaces inactivos, iconos de botón.
- **Tinta Suave** (`tinta-suave`): placeholders e iconos dentro de campos.
- **Lienzo Oscuro**, **Superficie Oscura**, **Superficie Oscura Alta**, **Línea Oscura** (`lienzo-oscuro`, `superficie-oscura`, `superficie-oscura-alta`, `linea-oscura`): los mismos papeles en tema oscuro (fondo de app gray-950, barra lateral/tablas/modales gray-900, cabeceras/campos/tarjetas gray-800, bordes gray-700). **Tinta Clara** y **Tinta Clara Media** para texto.

### Estado
- **Verde Activo** sobre **Velo Verde Activo**: insignia "Activo".
- **Rojo Alerta** (`rojo-alerta`, `rojo-alerta-hondo`, `rojo-alerta-velo`): insignia "Inactivo", botón "Desactivar", borde de campo con error, hover del botón de cerrar sesión. **Rojo Alerta Texto** para mensajes de error bajo los campos.
- **Ámbar Obra** (`ambar-obra`): exclusivo del aviso "En desarrollo".

### Named Rules
**The Two Voices Rule.** Verde actúa, azul ubica. El verde nunca marca navegación ni selección; el azul nunca es un botón primario.

**The Threshold Rule.** El degradado nocturno vive solo en el umbral (login, carga, fondo público). Dentro de la app, las superficies son papel o su equivalente oscuro.

**The Earned Color Rule.** Un color fuera de los neutros debe significar acción, ubicación o estado. Si no comunica nada, es gris.

## Typography

**Display Font:** pila tipográfica del sistema (`ui-sans-serif, system-ui, sans-serif`)
**Body Font:** la misma pila del sistema

**Character:** Una sola familia del sistema, sin fuente de marca: nativa en cada equipo de oficina, cero carga, legible en tablas largas. La jerarquía se construye con peso y tamaño, no con contraste de familias.

### Hierarchy
- **Display** (700, 38px → 48px desde xl, 1.15, tracking -0.025em): solo el titular del panel de marca del login. También el "404" (60px).
- **Headline** (700, 30px, tracking -0.025em): título de cada página (`Title`), acompañado de un subtítulo en Body y Tinta Media 8px debajo. "Bienvenido" del login usa 24px → 30px.
- **Title** (600, 18px): títulos de modal, valores de tarjetas de información, nombre de la marca en la barra lateral (16px).
- **Body** (400–600, 14px): texto de trabajo en toda la app: celdas, campos, enlaces de navegación (500), botones (600), subtítulos. Etiquetas de campo en 14px/500 Tinta Etiqueta.
- **Label** (600, 12px, tracking 0.05em, MAYÚSCULAS): cabeceras de tabla. Insignias de estado usan 12px/600 sin mayúsculas; textos auxiliares y errores 12px/400.

### Named Rules
**The Weight Ladder Rule.** La jerarquía sube por peso antes que por tamaño: 400 lectura, 500 navegación y etiquetas, 600 acción y títulos de componente, 700 títulos de página.

## Layout

Rejilla de aplicación de dos columnas en escritorio (`lg`, 1024px): barra lateral fija de 288px (máx. 85vw en móvil) y área de trabajo con scroll propio; la página entera nunca hace scroll. Bajo `lg` la barra lateral se vuelve cajón deslizante con velo negro al 50%, y aparece una cabecera de 64px con botón de menú, logo y nombre. Se cierra con Escape, clic en el velo o al navegar.

El área de trabajo tiene padding de 16px (24px desde `sm`, 640px). Las páginas apilan bloques con 20px de separación: título, barra de herramientas, contenido, paginación. La barra de herramientas se apila en móvil y se vuelve fila desde `sm` con filtros a la izquierda y acción primaria a la derecha. Las tarjetas de información usan rejilla de 1 → 2 (`sm`) → 3 (`lg`) columnas con 16px de separación.

Ritmo de base 4px. Valores recurrentes: 8px entre etiqueta y campo, 20px entre campos de formulario, 12px entre filtros, 16–24px de padding de celdas (12px en móvil). Las tablas hacen scroll horizontal dentro de su contenedor en pantallas angostas.

El login divide la pantalla 1.35fr / 1fr desde `lg`: panel de marca a la izquierda, formulario de hasta 384px sobre papel a la derecha. En móvil, la tarjeta del formulario (máx. 448px) flota sobre el degradado nocturno.

## Elevation & Depth

Sistema casi plano con sombra ambiental. En reposo, las superficies descansan sobre bordes de 1px y, a lo sumo, una sombra mínima (tablas, botones, campos). Las sombras amplias se reservan para lo que flota sobre la página: modales, la tarjeta de login en móvil, el formulario contenedor. En tema oscuro todas las sombras se anulan y un anillo blanco al 10% o un borde gray-700 asume su papel.

### Shadow Vocabulary
- **Reposo** (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): botón primario, campos, tabla, enlace activo de navegación.
- **Respuesta** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`): hover del botón primario.
- **Contenedor** (`box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`): formulario contenedor (`.form`).
- **Flotante** (`box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25)`): modales y tarjeta de login móvil, sobre velo negro al 50% con desenfoque.
- **Anillo oscuro** (`box-shadow: 0 0 0 1px rgb(255 255 255 / 0.1)`): sustituto de sombra en tema oscuro.

### Named Rules
**The Float-Only Shadow Rule.** Una sombra grande significa "esto está encima de la página". Nada que viva en el flujo lleva más que la sombra de reposo.

**The Dark Ring Rule.** En oscuro no hay sombras: la separación se dibuja con un anillo o borde de 1px.

## Shapes

Lenguaje de esquinas suaves y firmes, escalado por tamaño del objeto: campos, botones de icono y casillas de rol con curva discreta (8px); botones, enlaces de navegación, tarjetas de información y el filtro de búsqueda con curva generosa (12px); contenedores grandes (tablas, modales, tarjeta de login, avisos) con curva amplia (16px). Insignias de estado, avatar e indicadores son píldoras o círculos completos. Bordes siempre de 1px; la línea discontinua solo en el aviso "En desarrollo". Iconografía lineal de lucide a 16–22px.

### Named Rules
**The Size-Scaled Corner Rule.** Cuanto más grande el objeto, más amplia la curva: 8px → 12px → 16px. Nunca esquinas rectas en superficies interactivas.

## Components

### Buttons
Suaves y firmes: presencia clara sin estridencia, respuesta táctil sutil.
- **Shape:** curva generosa (12px); el botón de login usa 8px y padding vertical de 12px.
- **Primary:** Verde Campo con texto blanco 14px/600, padding 10px × 20px, sombra de reposo; icono a la izquierda con 8px de separación.
- **Hover / Focus:** Verde Campo Hondo y sombra de respuesta en 200ms; al presionar escala a 0.98; foco con anillo verde de 2px y separación de 2px (separación gray-900 en oscuro). Deshabilitado: Verde Campo Tenue, sin sombra, cursor bloqueado; en carga el texto se reemplaza por un spinner.
- **Danger:** misma forma en Rojo Alerta → Rojo Alerta Hondo, para acciones destructivas o de bloqueo ("Desactivar"), siempre tras confirmación.
- **Icon button:** 8px de padding, curva 8px, icono Tinta Media 18px; hover con fondo gray-100 (gray-700/800 en oscuro) y texto oscuro; cerrar sesión vira a rojo en hover.

### Chips
- **Style:** casillas de rol: borde 1px Línea Gris, curva 8px, padding 8px × 12px, texto 14px Tinta Etiqueta, casilla nativa con acento Azul Señal.
- **State:** marcada → borde Azul Señal Foco y fondo Velo Azul (azul al 15% en oscuro).

### Status Badges
Píldora completa, padding 4px × 10px, 12px/600. Activo: Verde Activo sobre su velo. Inactivo: Rojo Alerta Hondo sobre su velo. En oscuro: fondo del tono al 15% y texto 400.

### Cards / Containers
- **Corner Style:** 12px para tarjetas de información; 16px para tabla, modal y avisos.
- **Background:** Papel Pizarra con borde Línea Pizarra (gray-800 / gray-700 en oscuro).
- **Shadow Strategy:** ninguna en tarjetas; ver Elevation & Depth para contenedores.
- **Internal Padding:** 16px en tarjetas de información; 20px en tarjeta de fecha; 16px → 24px en modales y formularios.
- **Anatomía de tarjeta de información:** icono 16px + etiqueta 14px/500 Tinta Media arriba; valor 18px/600 debajo.

### Inputs / Fields
- **Style:** fondo Papel, borde 1px Línea Gris, curva 8px, padding 8px × 12px, sombra de reposo, placeholder Tinta Suave. Etiqueta arriba (14px/500) con 8px de separación; icono opcional a la izquierda (padding izquierdo 40px).
- **Focus:** borde Azul Señal Foco y anillo de 2px del mismo azul al 20%, transición 150ms. Hover: borde gray-300.
- **Error:** borde red-300, anillo rojo al 20% al enfocar, mensaje 12px en Rojo Alerta Texto debajo.
- **Filtro de búsqueda:** variante de tabla con fondo Papel Pizarra, curva 12px, icono de lupa a la izquierda, 240px en escritorio; al enfocar pasa a Papel con anillo blue-200.
- **Contraseña:** botón de ojo a la derecha para mostrar/ocultar.

### Tables
La forma principal de la bitácora.
- Contenedor Papel, curva 16px, borde Línea Pizarra, sombra de reposo, scroll horizontal interno.
- Cabecera Papel Pizarra, Label en Tinta Media, MAYÚSCULAS, sin salto de línea.
- Filas separadas por Línea Pizarra Tenue; hover con fondo Papel Pizarra. Celdas en Body, Tinta Cuerpo.
- Acciones de fila como iconos lucide (editar, ver) separados 20px.
- Carga: esqueleto con la misma forma de tabla y barras pulsantes; vacío: mensaje centrado 14px en Tinta Media.
- Paginación (MUI `TablePagination`) bajo la tabla, en español ("Registros", "1–10 de 40").

### Navigation
- **Barra lateral:** fondo Papel (gray-900 en oscuro), borde derecho 1px. Cabecera de 80px con logo Legumex 40px, "Biométricos" 16px/600 y subtítulo 12px. Enlaces apilados con 12px de separación.
- **Enlace:** icono + texto 14px/500 Tinta Media, padding 12px × 16px, curva 12px; hover con fondo gray-50 y texto oscuro, el icono crece a 1.1×.
- **Activo:** Velo Azul + Azul Señal Tinta + sombra de reposo (azul al 15% y blue-300 en oscuro).
- **Pie:** avatar circular 40px (inicial en azul sobre azul claro), nombre y roles truncados, conmutador de tema y botón de cerrar sesión.
- **Móvil:** cajón deslizante en 300ms ease-in-out con velo.

### Modal
Panel Papel de curva 16px y sombra flotante (anillo en oscuro) sobre velo negro al 50% con desenfoque. Cabecera con título Title y botón de cerrar; cuerpo con scroll propio (máx. 70–75vh). Entra con fundido, escala 0.95 → 1 y subida de 8px en 200ms ease-out; sale en 150ms ease-in. Ancho por defecto 672px.

### Panel de marca del login (signature)
Degradado nocturno con una huella dactilar lucide gigante (640px, trazo 0.5, 6% de opacidad) asomando por la esquina inferior derecha y un halo esmeralda difuso arriba a la izquierda. Logo Legumex en un cuadro blanco de curva 16px con sombra profunda y aro blanco translúcido; titular Display; tres capacidades con iconos en recuadros translúcidos. La tarjeta del formulario entra con `fade-up` (300ms, subida de 8px), desactivado con `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** usar Verde Campo solo para la acción primaria de cada vista, alineada a la derecha de la barra de herramientas.
- **Do** usar Azul Señal para estado activo de navegación, foco y selección.
- **Do** abrir cada página con `Title` (Headline 30px/700 + subtítulo 14px Tinta Media) y separar bloques con 20px.
- **Do** mostrar listados en la tabla compartida (`Table`/`Thead`/`Th`/`Tr`/`Td`) con esqueleto de carga y mensaje de vacío.
- **Do** escalar la curva con el tamaño: 8px campos, 12px botones y tarjetas, 16px contenedores.
- **Do** diseñar cada componente en claro y oscuro; en oscuro, sustituir sombras por anillos o bordes de 1px.
- **Do** mantener el logo Legumex en la cabecera de la barra lateral, la cabecera móvil, el login y la pantalla de carga.
- **Do** confirmar acciones destructivas o de bloqueo antes de ejecutarlas y pintarlas en Rojo Alerta.
- **Do** escribir toda la interfaz en español claro y directo.

### Don't:
- **Don't** usar verde para navegación o selección, ni azul para botones primarios.
- **Don't** llevar el degradado nocturno (pizarra/azul noche) al área de trabajo autenticada.
- **Don't** poner sombras grandes en elementos del flujo; solo modales y tarjetas flotantes las llevan.
- **Don't** introducir un tercer acento; el ámbar existe solo para "En desarrollo".
- **Don't** usar esquinas rectas en superficies interactivas.
- **Don't** mezclar gris y pizarra dentro del mismo componente; las tablas y tarjetas usan pizarra, el marco de la app y los campos usan gris.
