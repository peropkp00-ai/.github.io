// editor.js
import { pageSchema as defaultSchema } from './page-schema.mjs';
import { itemTemplates } from './item-templates.js';
import { sectionTemplates } from './section-templates.js';
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

    function saveAndRefresh(fullReload = false) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(currentSchema));
            if(fullReload) {
                renderEditor();
                initSortable();
            }
            iframe.contentWindow.location.reload();
        } catch (e) {
            console.error("Error al guardar y refrescar.", e);
        }
    }

    function initSortable() {
        new Sortable(form, {
            animation: 150,
            handle: '.drag-handle',
            draggable: '.section-details',
            onEnd: (event) => {
                const movedItem = currentSchema.splice(event.oldIndex, 1)[0];
                currentSchema.splice(event.newIndex, 0, movedItem);
                saveAndRefresh(true);
            }
        });
        form.querySelectorAll('.items-container').forEach(container => {
            new Sortable(container, {
                animation: 150,
                handle: '.drag-handle',
                draggable: '.item-details',
                onEnd: (event) => {
                    const path = container.dataset.path.split('-');
                    const [sectionId, key] = path;
                    const section = currentSchema.find(s => s.id === sectionId);
                    if(section) {
                        const movedItem = section.content[key].splice(event.oldIndex, 1)[0];
                        section.content[key].splice(event.newIndex, 0, movedItem);
                        saveAndRefresh(true);
                    }
                }
            });
        });
    }

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

    addSectionBtn.addEventListener('click', () => {
        addSectionMenu.classList.toggle('hidden');
    });

    addSectionMenu.addEventListener('click', (event) => {
        const type = event.target.dataset.type;
        if (type && sectionTemplates[type]) {
            currentSchema.push(sectionTemplates[type]());
            saveAndRefresh(true);
            addSectionMenu.classList.add('hidden');
        }
    });

    form.addEventListener('click', (event) => {
        const target = event.target.closest('[data-action]');
        if (!target) return;
        const action = target.dataset.action;
        if (action === 'delete-section') {
            const sectionIndex = target.dataset.sectionIndex;
            if (confirm('¿Estás seguro?')) {
                currentSchema.splice(sectionIndex, 1);
                saveAndRefresh(true);
            }
        }
        if (action === 'delete-item') {
            const path = target.dataset.path.split('-');
            const [sectionId, key, itemIndex] = path;
            const section = currentSchema.find(s => s.id === sectionId);
            if (section && confirm('¿Estás seguro?')) {
                const itemId = section.content[key][itemIndex].id;
                section.content[key].splice(itemIndex, 1);
                renderEditor();
                initSortable();
                liveUpdater.removeElement(itemId);
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
                const componentName = template.charAt(0).toUpperCase() + template.slice(1, -1);
                const componentFunction = renderer[componentName];
                if (componentFunction) {
                    const newItemHtml = componentFunction(section.id, newItem, newItemIndex);
                    liveUpdater.addElement(`[data-path="${sectionId}-${key}"]`, newItemHtml);
                }
                renderEditor();
                initSortable();
            }
        }
    });

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
            details.className = 'section-details bg-gray-800 p-4 rounded-lg mb-4';
            details.open = true;

            const summary = document.createElement('summary');
            summary.className = 'flex justify-between items-center cursor-pointer text-cyan-300 font-bold';
            summary.innerHTML = `
                <span>
                    <span class="drag-handle cursor-move mr-2">::</span>
                    ${section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                </span>
                <button data-action="delete-section" data-section-index="${sectionIndex}" class="text-red-500 hover:text-red-400">Eliminar</button>
            `;
            details.appendChild(summary);

            const contentDiv = document.createElement('div');
            contentDiv.className = 'mt-4';
            details.appendChild(contentDiv);

            for (const key in section.content) {
                const value = section.content[key];
                if (Array.isArray(value)) {
                    const itemsContainer = document.createElement('div');
                    itemsContainer.className = 'items-container';
                    itemsContainer.dataset.path = `${section.id}-${key}`;
                    value.forEach((item, itemIndex) => {
                        const itemDetails = document.createElement('details');
                        itemDetails.className = 'item-details bg-gray-700 p-3 rounded-md mb-2';
                        itemDetails.open = false;

                        const itemSummary = document.createElement('summary');
                        itemSummary.className = 'flex justify-between items-center cursor-pointer';
                        itemSummary.innerHTML = `
                            <span>
                                <span class="drag-handle cursor-move mr-2">::</span>
                                Item #${itemIndex + 1} (${item.title || item.name || ''})
                            </span>
                            <button data-action="delete-item" data-path="${section.id}-${key}-${itemIndex}" class="text-red-500 hover:text-red-400 text-sm">Eliminar</button>
                        `;
                        itemDetails.appendChild(itemSummary);

                        const itemContent = document.createElement('div');
                        itemContent.className = 'mt-2';
                        for (const itemKey in item) {
                            if (typeof item[itemKey] !== 'object' && itemKey !== 'id') {
                                createField(itemContent, `${section.id}-${key}-${itemIndex}-${itemKey}`, itemKey, item[itemKey]);
                            }
                        }
                        itemDetails.appendChild(itemContent);
                        itemsContainer.appendChild(itemDetails);
                    });
                    contentDiv.appendChild(itemsContainer);

                    const addButton = document.createElement('button');
                    addButton.type = 'button';
                    addButton.textContent = `Añadir ${key.slice(0, -1)}`;
                    addButton.className = 'mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded';
                    addButton.dataset.action = 'add-item';
                    addButton.dataset.path = `${section.id}-${key}`;
                    addButton.dataset.template = `${key.slice(0, -1)}Template`;
                    contentDiv.appendChild(addButton);

                } else {
                    createField(contentDiv, `${section.id}-${key}`, key, value);
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

    // --- Lógica de Pestañas ---
    const contentPanel = document.getElementById('content-panel');
    const stylesPanel = document.getElementById('styles-panel');
    const tabContent = document.getElementById('tab-content');
    const tabStyles = document.getElementById('tab-styles');

    tabContent.addEventListener('click', () => {
        contentPanel.classList.remove('hidden');
        stylesPanel.classList.add('hidden');
        tabContent.classList.add('bg-gray-700', 'font-bold', 'border-cyan-400');
        tabStyles.classList.remove('bg-gray-700', 'font-bold', 'border-cyan-400');
    });

    tabStyles.addEventListener('click', () => {
        stylesPanel.classList.remove('hidden');
        contentPanel.classList.add('hidden');
        tabStyles.classList.add('bg-gray-700', 'font-bold', 'border-cyan-400');
        tabContent.classList.remove('bg-gray-700', 'font-bold', 'border-cyan-400');
    });

    loadSchema();
    renderEditor();
    initSortable();
    populateAddSectionMenu();
});
