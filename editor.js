// editor.js
import { pageSchema as defaultSchema } from './page-schema.js';

document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'userPageSchema';
    const form = document.getElementById('editor-form');
    const iframe = document.getElementById('preview-iframe');
    const saveButton = document.getElementById('save-button');
    const resetButton = document.getElementById('reset-button');

    let currentSchema;

    // Cargar el esquema desde localStorage o usar el predeterminado
    function loadSchema() {
        try {
            const savedSchema = localStorage.getItem(storageKey);
            currentSchema = savedSchema ? JSON.parse(savedSchema) : JSON.parse(JSON.stringify(defaultSchema));
        } catch (e) {
            console.error("Error al cargar el esquema, usando el predeterminado.", e);
            currentSchema = JSON.parse(JSON.stringify(defaultSchema));
        }
    }

    // Generar el formulario dinámicamente
    function renderEditor() {
        form.innerHTML = ''; // Limpiar el formulario existente
        currentSchema.forEach((section, sectionIndex) => {
            const details = document.createElement('details');
            details.open = true;
            const summary = document.createElement('summary');
            summary.textContent = section.type.charAt(0).toUpperCase() + section.type.slice(1);
            details.appendChild(summary);

            for (const key in section.content) {
                const value = section.content[key];
                // Renderizar campos anidados (tarjetas, pilares, etc.)
                if (Array.isArray(value)) {
                    value.forEach((item, itemIndex) => {
                        const itemGroup = document.createElement('div');
                        itemGroup.className = 'p-2 border border-gray-700 rounded mb-2';
                        for (const itemKey in item) {
                            if (typeof item[itemKey] !== 'object') {
                                createField(itemGroup, `${section.id}-${key}-${itemIndex}-${itemKey}`, `${itemKey}`, item[itemKey]);
                            }
                        }
                        details.appendChild(itemGroup);
                    });
                } else { // Renderizar campos simples
                    createField(details, `${section.id}-${key}`, key, value);
                }
            }
            form.appendChild(details);
        });
    }

    // Crear un campo de formulario individual
    function createField(container, id, label, value) {
        const group = document.createElement('div');
        group.className = 'control-group';
        const labelEl = document.createElement('label');
        labelEl.htmlFor = id;
        labelEl.textContent = label;
        group.appendChild(labelEl);

        let input;
        if (label.includes('color')) {
            input = document.createElement('input');
            input.type = 'color';
        } else if (typeof value === 'number') {
            input = document.createElement('input');
            input.type = 'range';
            input.min = 0;
            input.max = (label.includes('Speed')) ? 1 : 10;
            input.step = 0.1;
        } else if (String(value).length > 100) {
            input = document.createElement('textarea');
            input.rows = 4;
        } else {
            input = document.createElement('input');
            input.type = 'text';
        }

        input.id = id;
        input.value = value;
        input.dataset.path = id; // Guardar la ruta para actualizar el esquema
        group.appendChild(input);
        container.appendChild(group);
    }

    // Guardar el estado actual del formulario en el objeto del esquema
    function updateSchemaFromForm() {
        form.querySelectorAll('input, textarea').forEach(input => {
            const path = input.dataset.path.split('-');
            const [sectionId, key, itemIndex, itemKey] = path;

            const section = currentSchema.find(s => s.id === sectionId);
            if (!section) return;

            if (itemIndex !== undefined && itemKey !== undefined) {
                // Actualizar un campo anidado
                if (section.content[key][itemIndex]) {
                    section.content[key][itemIndex][itemKey] = input.value;
                }
            } else {
                // Actualizar un campo simple
                let value = input.value;
                if (input.type === 'range') value = parseFloat(value);
                section.content[key] = value;
            }
        });
    }

    // Evento para guardar
    saveButton.addEventListener('click', () => {
        updateSchemaFromForm();
        try {
            localStorage.setItem(storageKey, JSON.stringify(currentSchema));
            alert('¡Guardado!');
            iframe.contentWindow.location.reload();
        } catch (e) {
            console.error("Error al guardar el esquema.", e);
            alert('Error al guardar.');
        }
    });

    // Evento para restaurar
    resetButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro? Se restaurarán todos los valores a los predeterminados.')) {
            localStorage.removeItem(storageKey);
            loadSchema();
            renderEditor();
        }
    });

    // Carga inicial
    loadSchema();
    renderEditor();
});
