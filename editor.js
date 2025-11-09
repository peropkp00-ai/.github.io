// editor.js
import { pageSchema as defaultSchema } from './page-schema.js';

document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'userPageSchema';
    const form = document.getElementById('editor-form');
    const iframe = document.getElementById('preview-iframe');
    const saveButton = document.getElementById('save-button');
    const resetButton = document.getElementById('reset-button');

    let currentSchema;
    let liveUpdater; // Referencia a la API del iframe

    // Cargar esquema
    function loadSchema() {
        try {
            const savedSchema = localStorage.getItem(storageKey);
            currentSchema = savedSchema ? JSON.parse(savedSchema) : JSON.parse(JSON.stringify(defaultSchema));
        } catch (e) {
            currentSchema = JSON.parse(JSON.stringify(defaultSchema));
        }
    }

    // Generar el editor
    function renderEditor() {
        form.innerHTML = '';
        currentSchema.forEach(section => {
            const details = document.createElement('details');
            details.open = true;
            const summary = document.createElement('summary');
            summary.textContent = section.type.charAt(0).toUpperCase() + section.type.slice(1);
            details.appendChild(summary);

            for (const key in section.content) {
                const value = section.content[key];
                const path = `${section.id}-${key}`;

                if (Array.isArray(value)) { // Campos anidados
                    value.forEach((item, itemIndex) => {
                        const itemGroup = document.createElement('div');
                        itemGroup.className = 'p-2 border border-gray-700 rounded mb-2';
                        for (const itemKey in item) {
                            if (typeof item[itemKey] !== 'object') {
                                createField(itemGroup, `${path}-${itemIndex}-${itemKey}`, itemKey, item[itemKey]);
                            }
                        }
                        details.appendChild(itemGroup);
                    });
                } else { // Campos simples
                    createField(details, path, key, value);
                }
            }
            form.appendChild(details);
        });
    }

    // Crear campo
    function createField(container, path, label, value) {
        const group = document.createElement('div');
        group.className = 'control-group';
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        group.appendChild(labelEl);

        let input;
        const inputType = getInputType(label, value);
        input = document.createElement(inputType === 'textarea' ? 'textarea' : 'input');

        if(inputType !== 'textarea') input.type = inputType;
        if(inputType === 'range') {
            input.min = 0; input.max = (label.includes('Speed')) ? 1 : 10; input.step = 0.1;
        }

        input.value = value;
        input.dataset.path = path;
        group.appendChild(input);
        container.appendChild(group);
    }

    function getInputType(label, value) {
        if (label.includes('color')) return 'color';
        if (typeof value === 'number') return 'range';
        if (String(value).includes('\n') || String(value).length > 100) return 'textarea';
        return 'text';
    }

    // Manejar la entrada en tiempo real
    form.addEventListener('input', (event) => {
        const input = event.target;
        const path = input.dataset.path.split('-');
        const [sectionId, key, itemIndex, itemKey] = path;

        let value = input.type === 'range' ? parseFloat(input.value) : input.value;

        // Actualizar el esquema en memoria
        const section = currentSchema.find(s => s.id === sectionId);
        if(!section) return;

        let targetId;
        if (itemIndex !== undefined && itemKey !== undefined) {
            section.content[key][itemIndex][itemKey] = value;
            targetId = `${section.id}-${key}-${itemIndex}-${itemKey}`;
        } else {
            section.content[key] = value;
            targetId = `${section.id}-${key}`;
        }

        // Actualizar la vista previa en vivo
        if (!liveUpdater) return;
        const isAnimKey = ['mouseFollowSpeed', 'mouseWaveRadius', 'mouseWaveIntensity', 'colorA', 'colorB', 'colorInteraction'].includes(key);

        if (isAnimKey) {
            const animProp = key === 'colorA' ? 'u_color_a' : key === 'colorB' ? 'u_color_b' : key === 'colorInteraction' ? 'u_color_interaction' : key === 'mouseWaveRadius' ? 'u_mouse_wave_radius' : key === 'mouseWaveIntensity' ? 'u_mouse_wave_intensity' : key;
            liveUpdater.updateAnimation(animProp, value);
        } else {
            liveUpdater.updateText(targetId, value);
        }
    });

    // Guardar en localStorage
    saveButton.addEventListener('click', () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(currentSchema));
            saveButton.textContent = '¡Guardado!';
            setTimeout(() => saveButton.textContent = 'Guardar Cambios', 1500);
        } catch (e) {
            console.error("Error al guardar.", e);
        }
    });

    // Restaurar
    resetButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro?')) {
            localStorage.removeItem(storageKey);
            loadSchema();
            renderEditor();
            iframe.contentWindow.location.reload();
        }
    });

    // Iniciar
    iframe.addEventListener('load', () => {
        liveUpdater = iframe.contentWindow.liveUpdater;
    });

    loadSchema();
    renderEditor();
});
