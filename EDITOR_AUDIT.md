# Auditoría del Editor de Página - Hallazgos Iniciales

Este documento detalla las falencias, debilidades y posibles problemas identificados durante una auditoría exhaustiva del sistema de edición dinámica.

---

### Categoría 1: Funcionalidad Rota o Incompleta

*Estos son errores que impiden que el editor funcione como se espera.*

1.  **Edición de Listas Simples (ej. Servicios) está Rota:**
    *   **Problema:** El código que genera el formulario no sabe cómo manejar un array de textos simples (ej. `["Item 1", "Item 2"]`). La lógica actual espera un array de objetos.
    *   **Impacto:** Es imposible editar los puntos de cada servicio, ya que no se genera ningún campo para ello.

2.  **El Drag-and-Drop de Elementos Internos es Poco Fiable:**
    *   **Problema:** La función `initSortable` intenta "adivinar" qué contenedores deben ser reordenables basándose en una condición de estilo frágil, en lugar de un identificador explícito.
    *   **Impacto:** La funcionalidad de reordenar elementos dentro de una sección (servicios, pilares, etc.) es inconsistente y probablemente no funcione en la mayoría de los casos.

---

### Categoría 2: Experiencia de Usuario (UX) Deficiente

*Estos son problemas que, aunque no rompen el editor, lo hacen confuso o incómodo de usar.*

3.  **Recarga Total en Cambios Estructurales:**
    *   **Problema:** Cualquier cambio que afecte a la estructura (añadir, eliminar, reordenar) provoca una recarga completa de la vista previa (`iframe`).
    *   **Impacto:** Causa un parpadeo notable y una pérdida de contexto (como la posición del scroll), haciendo que la gestión de la estructura se sienta lenta.

4.  **Pérdida de Estado en el Editor:**
    *   **Problema:** La función `refreshUI` reconstruye todo el formulario desde cero en cada cambio estructural.
    *   **Impacto:** Si el usuario tenía algunas secciones cerradas para concentrarse, se vuelven a abrir todas, interrumpiendo su flujo de trabajo.

5.  **Falta de Autoguardado:**
    *   **Problema:** Los cambios de edición de texto en tiempo real no se guardan en `localStorage` hasta que se realiza una acción estructural o se hace clic manualmente en "Guardar".
    *   **Impacto:** Un cierre accidental de la pestaña puede provocar la pérdida de todo el trabajo de edición de texto no guardado.

---

### Categoría 3: Fragilidad y Deuda Técnica (Riesgos a Futuro)

*Estos son problemas en la arquitectura del código que lo hacen difícil de mantener y propenso a romperse en el futuro.*

6.  **El Editor "Adivina" el Tipo de Campo:**
    *   **Problema:** La función `getInputType` decide el tipo de campo (`input`, `textarea`, `color`) basándose en reglas frágiles como el nombre de la clave o la longitud del texto.
    *   **Impacto:** Limita la flexibilidad y requiere que los nuevos datos sigan convenciones de nombrado estrictas para que se rendericen correctamente.

7.  **Manejo de Eventos Basado en Texto:**
    *   **Problema:** La lógica de los botones se basa en su texto o icono (ej. `target.innerHTML === '✖'`).
    *   **Impacto:** Cambios visuales simples en el futuro podrían romper la funcionalidad. El código y el diseño están demasiado acoplados.

8.  **Duplicación de la "Forma" de los Datos:**
    *   **Problema:** La estructura de una sección o elemento está definida en múltiples lugares (`page-schema.js`, `section-templates.js`, `renderer.js`).
    *   **Impacto:** Añadir un nuevo campo a un elemento requiere modificar varios archivos, lo que aumenta la probabilidad de errores por omisión.

9.  **Reinicialización Excesiva de `SortableJS`:**
    *   **Problema:** Cada vez que se refresca el editor, se crean nuevas instancias de `SortableJS` sin destruir las antiguas.
    *   **Impacto:** Puede llevar a fugas de memoria y a un comportamiento impredecible, especialmente a medida que la página se vuelve más compleja.

---

### Categoría 4: Problemas de Arquitectura y Escalabilidad (Análisis Profundo)

*Estos son problemas que, aunque no causan errores inmediatos, hacen que el sistema sea frágil y difícil de expandir en el futuro.*

10. **Mezcla de Datos y Configuración de Vista:**
    *   **Problema:** El archivo `page-schema.js` contiene tanto el contenido de la página como la configuración de la animación (que es parte de la plantilla/vista).
    *   **Impacto:** Dificulta la reutilización del contenido con diferentes plantillas visuales en el futuro.

11. **IDs No Garantizados como Únicos:**
    *   **Problema:** Los IDs para nuevas secciones y elementos se generan usando `Date.now()`, que no garantiza unicidad en operaciones muy rápidas.
    *   **Impacto:** Riesgo de IDs duplicados, lo que puede causar un comportamiento impredecible en la actualización en vivo.

12. **API de Actualización en Vivo Limitada:**
    *   **Problema:** La API `liveUpdater` solo sabe cómo actualizar texto. No puede manejar otros atributos como el `src` de una imagen.
    *   **Impacto:** Es imposible editar en tiempo real ciertos campos, como las fotos del equipo o los logos de los clientes.

13. **Motor de Renderizado Monolítico:**
    *   **Problema:** El archivo `renderer.js` tiene un `switch` que conoce todos los tipos de sección, violando el Principio de Abierto/Cerrado.
    *   **Impacto:** Para añadir un nuevo tipo de sección, es necesario modificar el código central del renderizador, lo que aumenta el riesgo de introducir errores.

14. **Editor Monolítico:**
    *   **Problema:** Al igual que el renderizador, `editor.js` tiene una lógica centralizada que conoce cómo construir el formulario para cada tipo de sección.
    *   **Impacto:** A medida que se añadan más tipos de sección con lógicas de edición complejas, el archivo se volverá inmanejable.

---

### Categoría 5: Seguridad, Rendimiento y Mantenibilidad

*Estos son problemas que, aunque no son errores visibles, representan riesgos y malas prácticas en la implementación actual.*

15. **Vulnerabilidad de Inyección de HTML (Seguridad):**
    *   **Problema:** El sistema utiliza `innerHTML` para renderizar contenido, lo que podría permitir la ejecución de scripts maliciosos si se introduce HTML en los campos de texto.
    *   **Impacto:** Riesgo de seguridad (XSS - Cross-Site Scripting), aunque bajo en el contexto actual, es una mala práctica fundamental.

16. **Falta de Validación de Datos (Robustez):**
    *   **Problema:** No hay ninguna validación sobre los datos cargados desde `localStorage`. Un esquema malformado podría romper la aplicación.
    *   **Impacto:** La aplicación es frágil ante datos corruptos o inesperados.

17. **Carga Ineficiente de la Vista Previa (Rendimiento):**
    *   **Problema:** Los cambios estructurales provocan una recarga completa del `iframe`, lo que es lento e ineficiente.
    *   **Impacto:** La experiencia de edición se degrada a medida que la página se vuelve más compleja.

18. **Acoplamiento Directo con `localStorage` (Mantenibilidad):**
    *   **Problema:** La lógica para interactuar con `localStorage` está dispersa en varios archivos.
    *   **Impacto:** Dificulta la modificación o sustitución del sistema de almacenamiento en el futuro.

---

### Apéndice A: Análisis Funcional del Comportamiento Actual

*Esta sección detalla los problemas desde la perspectiva de un usuario final.*

#### **Lo que SÍ funciona bien:**

*   **Edición de Texto (Campos Simples):** La edición de títulos y párrafos se refleja instantáneamente en la vista previa.
*   **Edición de Animación:** Los cambios en los controles de la animación se reflejan en tiempo real.
*   **Gestión de Secciones (Añadir/Eliminar/Reordenar):** La estructura principal de la página puede ser modificada.
*   **Guardado y Persistencia:** Los cambios que funcionan se guardan y se cargan correctamente.

#### **Lo que NO funciona o funciona MAL:**

1.  **(ROTO) Edición de Listas (ej. Servicios):**
    *   **Comportamiento:** No aparece ningún campo para editar la lista de puntos dentro de una tarjeta de servicio. Es imposible modificar estas listas.

2.  **(ROTO) Reordenar Elementos Dentro de una Sección (ej. Pilares):**
    *   **Comportamiento:** El icono para mover aparece, pero arrastrarlo no tiene ningún efecto. Es imposible reordenar los elementos dentro de una sección.

3.  **(MALA EXPERIENCIA) Añadir/Eliminar Elementos Dentro de una Sección:**
    *   **Comportamiento:** La acción funciona, pero provoca que toda la vista previa parpadee (se recargue) y que todas las secciones del editor se expandan, perdiendo el foco.

4.  **(NO FUNCIONA) Edición en Tiempo Real de Imágenes/Enlaces:**
    *   **Comportamiento:** Cambiar la URL de una imagen (como la foto de un miembro del equipo) no actualiza la vista previa hasta que se guarda y se recarga la página.

5.  **(PARCIALMENTE ROTO) Botón "Restaurar Todo":**
    *   **Comportamiento:** Si se han añadido nuevas secciones, estas no se eliminan visualmente del editor al restaurar, aunque la vista previa sí vuelve al estado original.
