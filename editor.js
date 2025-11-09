// editor.js
import { pageSchema as defaultSchema } from './page-schema.js';
import { sectionTemplates } from './section-templates.js';

document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'userPageSchema';
    const form = document.getElementById('editor-form');
    const iframe = document.getElementById('preview-iframe');
    const saveButton = document.getElementById('save-button');
    const resetButton = document.getElementById('reset-button');
    const addSectionBtn = document.getElementById('add-section-btn');
    const addSectionMenu = document.getElementById('add-section-menu');

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
            details.dataset.sectionIndex = sectionIndex;

            const summary = document.createElement('summary');
            summary.textContent = section.type.charAt(0).toUpperCase() + section.type.slice(1);

            const controls = document.createElement('div');
            controls.className = 'section-controls';

            const moveHandle = document.createElement('button');
            moveHandle.innerHTML = '&#9776;'; // Icono de hamburguesa para mover
            moveHandle.className = 'drag-handle';
            controls.appendChild(moveHandle);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '&#10005;'; // Icono de X para eliminar
            deleteBtn.dataset.sectionIndex = sectionIndex;
            controls.appendChild(deleteBtn);

            details.appendChild(controls);
            details.appendChild(summary);

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'p-4';

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
                    createField(contentWrapper, path, key, value);
                }
            }
            details.appendChild(contentWrapper);
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

    // --- Lógica de Gestión de Secciones ---

    // Poblar el menú de "Añadir Sección"
    function populateAddSectionMenu() {
        addSectionMenu.innerHTML = '';
        Object.keys(sectionTemplates).forEach(type => {
            const button = document.createElement('button');
            button.className = 'block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700';
            button.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            button.dataset.type = type;
            addSectionMenu.appendChild(button);
        });
    }

    // Refrescar toda la UI (editor y vista previa)
    function refreshUI() {
        renderEditor();
        iframe.contentWindow.location.reload();
    }

    // Evento para mostrar/ocultar el menú de añadir
    addSectionBtn.addEventListener('click', () => {
        addSectionMenu.classList.toggle('hidden');
    });

    // Evento para añadir una nueva sección desde el menú
    addSectionMenu.addEventListener('click', (event) => {
        const type = event.target.dataset.type;
        if (type && sectionTemplates[type]) {
            currentSchema.push(sectionTemplates[type]());
            refreshUI();
            addSectionMenu.classList.add('hidden');
        }
    });

    // Evento para eliminar una sección
    form.addEventListener('click', (event) => {
        if (event.target.innerHTML === '✖') { // Botón de eliminar
            const sectionIndex = event.target.dataset.sectionIndex;
            if (confirm('¿Estás seguro de que quieres eliminar esta sección?')) {
                currentSchema.splice(sectionIndex, 1);
                refreshUI();
            }
        }
    });


    // --- Lógica de Drag-and-Drop ---

    function initSortable() {
        new Sortable(form, {
            animation: 150,
            handle: '.drag-handle', // Usar el "handle" para arrastrar
            onEnd: (event) => {
                // Mover el elemento en el array del esquema
                const movedItem = currentSchema.splice(event.oldIndex, 1)[0];
                currentSchema.splice(event.newIndex, 0, movedItem);

                // Refrescar la UI para asegurar la consistencia y actualizar la vista previa
                refreshUI();
            }
        });
    }


    // --- Inicialización ---

    iframe.addEventListener('load', () => {
        liveUpdater = iframe.contentWindow.liveUpdater;
    });

    loadSchema();
    renderEditor();
    populateAddSectionMenu();
    initSortable();
});
