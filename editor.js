// editor.js
import { pageSchema as defaultSchema } from './page-schema.js';
import { sectionTemplates } from './section-templates.js';
import { itemTemplates } from './item-templates.js';
import * as renderer from './renderer.js';

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
        currentSchema.forEach((section, sectionIndex) => {
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
            deleteBtn.dataset.action = 'delete-section';
            deleteBtn.dataset.sectionIndex = sectionIndex;
            controls.appendChild(deleteBtn);

            details.appendChild(controls);
            details.appendChild(summary);

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'p-4';

            for (const key in section.content) {
                const value = section.content[key];
                const path = `${section.id}-${key}`;

                if (Array.isArray(value)) { // Campos anidados (listas de elementos)
                    const itemsContainer = document.createElement('div');
                    itemsContainer.className = 'items-container';
                    itemsContainer.dataset.path = path;

                    // Si es un array de strings, renderizar un único textarea y salir.
                    if (value.length > 0 && typeof value[0] === 'string') {
                        const listAsString = value.join('\n');
                        createField(contentWrapper, path, key, listAsString);
                    } else { // Si es un array de objetos, renderizar los campos para cada objeto.
                        value.forEach((item, itemIndex) => {
                            const itemGroup = document.createElement('div');
                            itemGroup.className = 'p-2 border border-gray-700 rounded mb-2 relative';

                            const itemControls = document.createElement('div');
                            itemControls.className = 'section-controls';
                            const itemMoveHandle = document.createElement('button');
                            itemMoveHandle.innerHTML = '&#9776;';
                            itemMoveHandle.className = 'drag-handle';
                            const itemDeleteBtn = document.createElement('button');
                            itemDeleteBtn.innerHTML = '&#10005;';
                            itemDeleteBtn.dataset.action = 'delete-item';
                            itemDeleteBtn.dataset.path = `${path}-${itemIndex}`;
                            itemControls.appendChild(itemMoveHandle);
                            itemControls.appendChild(itemDeleteBtn);
                            itemGroup.appendChild(itemControls);

                            for (const itemKey in item) {
                                if (typeof item[itemKey] !== 'object') {
                                    createField(itemGroup, `${path}-${itemIndex}-${itemKey}`, itemKey, item[itemKey]);
                                }
                            }
                            itemsContainer.appendChild(itemGroup);
                        });
                        contentWrapper.appendChild(itemsContainer);

                        // Botón para añadir un nuevo item a la lista de objetos
                        const addItemBtn = document.createElement('button');
                        addItemBtn.textContent = `Añadir ${key}`;
                        addItemBtn.className = 'mt-2 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded';
                        addItemBtn.dataset.action = 'add-item';
                        addItemBtn.dataset.path = path;
                        addItemBtn.dataset.template = key;
                        contentWrapper.appendChild(addItemBtn);
                    }

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
        let isAttributeUpdate = false;
        let attribute;

        if (itemIndex !== undefined && itemKey !== undefined) { // Campo anidado en objeto
            section.content[key][itemIndex][itemKey] = value;
            targetId = `${sectionId}-${key}-${itemIndex}-${itemKey}`;
            if (itemKey.toLowerCase().includes('photo') || itemKey.toLowerCase().includes('logo')) {
                isAttributeUpdate = true;
                attribute = 'src';
            }
        } else { // Campo simple o textarea de lista
            if (Array.isArray(section.content[key])) {
                section.content[key] = value.split('\n');
            } else {
                section.content[key] = value;
            }
            targetId = `${sectionId}-${key}`;
        }

        // Actualizar la vista previa en vivo
        if (!liveUpdater) return;
        const isAnimKey = ['mouseFollowSpeed', 'mouseWaveRadius', 'mouseWaveIntensity', 'colorA', 'colorB', 'colorInteraction'].includes(key) || ['mouseFollowSpeed', 'mouseWaveRadius', 'mouseWaveIntensity', 'colorA', 'colorB', 'colorInteraction'].includes(itemKey);

        if (isAnimKey) {
            const animProp = itemKey || key;
            const animValue = value;
            const uniformName = `u_${animProp}`.replace('colorA', 'color_a').replace('colorB', 'color_b').replace('colorInteraction', 'color_interaction');
            liveUpdater.updateAnimation(uniformName, animValue);
        } else if (isAttributeUpdate) {
            liveUpdater.updateAttribute(targetId.replace('-' + itemKey, ''), attribute, value);
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

    // Guardar el estado actual y luego refrescar la UI
    function saveAndRefresh() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(currentSchema));
            refreshUI();
        } catch (e) {
            console.error("Error al guardar antes de refrescar.", e);
        }
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
            saveAndRefresh();
            addSectionMenu.classList.add('hidden');
        }
    });

    // Delegación de eventos para acciones en el formulario
    form.addEventListener('click', (event) => {
        const target = event.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;

        if (action === 'delete-section') {
            const sectionIndex = target.dataset.sectionIndex;
            if (confirm('¿Estás seguro de que quieres eliminar esta sección?')) {
                currentSchema.splice(sectionIndex, 1);
                saveAndRefresh(); // Los cambios de sección aún requieren recarga
            }
        }

        if (action === 'delete-item') {
            const path = target.dataset.path.split('-');
            const [sectionId, key, itemIndex] = path;
            const section = currentSchema.find(s => s.id === sectionId);
            if (section && confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
                section.content[key].splice(itemIndex, 1);
                renderEditor(); // Re-renderizar el editor para actualizar los índices
                liveUpdater.removeElement(`${sectionId}-${key}-${itemIndex}-title`);
            }
        }

        if (action === 'add-item') {
            const path = target.dataset.path.split('-');
            const [sectionId, key] = path;
            const template = target.dataset.template;
            const section = currentSchema.find(s => s.id === sectionId);
            if (section && itemTemplates[template]) {
                const newItem = itemTemplates[template]();
                section.content[key].push(newItem);
                const newItemIndex = section.content[key].length - 1;

                const renderFunctionName = `render${template.charAt(0).toUpperCase() + template.slice(1, -1)}`;
                if(renderer[renderFunctionName]) {
                    const newItemHtml = renderer[renderFunctionName](sectionId, newItem, newItemIndex);
                    liveUpdater.addElement(`[data-path=${sectionId}-${key}]`, newItemHtml);
                }
                renderEditor(); // Re-renderizar el editor para que sepa del nuevo item
            }
        }
    });


    // --- Lógica de Drag-and-Drop ---

    function initSortable() {
        // Para secciones
        new Sortable(form, {
            animation: 150,
            handle: '.drag-handle',
            onEnd: (event) => {
                const movedItem = currentSchema.splice(event.oldIndex, 1)[0];
                currentSchema.splice(event.newIndex, 0, movedItem);
                saveAndRefresh();
            }
        });

        // Para items dentro de secciones
        form.querySelectorAll('.items-container').forEach(container => {
            new Sortable(container, {
                animation: 150,
                handle: '.drag-handle',
                onEnd: (event) => {
                    const path = container.dataset.path.split('-');
                    const [sectionId, key] = path;
                    const section = currentSchema.find(s => s.id === sectionId);
                    if(section) {
                        const movedItem = section.content[key].splice(event.oldIndex, 1)[0];
                        section.content[key].splice(event.newIndex, 0, movedItem);
                        saveAndRefresh();
                    }
                }
            });
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
