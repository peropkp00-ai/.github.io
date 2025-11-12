// editor.js
import { pageSchema as defaultSchema } from './page-schema.js';
import { sectionTemplates } from './section-templates.js';
import { itemTemplates } from './item-templates.js';
import * as renderer from './renderer.js';

document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'userPageSchema';
    const form = document.getElementById('content-panel');
    const iframe = document.getElementById('preview-iframe');
    const saveButton = document.getElementById('save-button');
    const resetButton = document.getElementById('reset-button');
    const addSectionBtn = document.getElementById('add-section-btn');
    const addSectionMenu = document.getElementById('add-section-menu');

    let currentSchema;
    let liveUpdater;

    function loadSchema() {
        try {
            const savedSchema = localStorage.getItem(storageKey);
            currentSchema = savedSchema ? JSON.parse(savedSchema) : JSON.parse(JSON.stringify(defaultSchema));
        } catch (e) {
            currentSchema = JSON.parse(JSON.stringify(defaultSchema));
        }
    }

    function renderEditor() {
        form.innerHTML = '';
        currentSchema.forEach((section, sectionIndex) => {
            const details = document.createElement('details');
            details.dataset.sectionIndex = sectionIndex;

            const summary = document.createElement('summary');
            summary.textContent = section.type.charAt(0).toUpperCase() + section.type.slice(1);

            const controls = document.createElement('div');
            controls.className = 'section-controls';

            const moveHandle = document.createElement('button');
            moveHandle.innerHTML = '&#9776;';
            moveHandle.className = 'drag-handle';
            controls.appendChild(moveHandle);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '&#10005;';
            deleteBtn.dataset.action = 'delete-section';
            deleteBtn.dataset.sectionIndex = sectionIndex;
            controls.appendChild(deleteBtn);

            summary.appendChild(controls);
            details.appendChild(summary);

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'p-4';

            // --- Renderizar campos de contenido ---
            for (const key in section.content) {
                const value = section.content[key];
                const path = `${section.id}-${key}`;

                if (Array.isArray(value)) {
                    const itemsContainer = document.createElement('div');
                    itemsContainer.className = 'items-container';
                    itemsContainer.dataset.path = path;

                    if (value.length > 0 && typeof value[0] === 'string') {
                        createField(contentWrapper, path, key, value.join('\n'));
                    } else {
                        value.forEach((item, itemIndex) => {
                            const itemDetails = document.createElement('details');
                            itemDetails.className = 'item-details bg-gray-800 rounded mb-2';
                            const itemSummary = document.createElement('summary');
                            itemSummary.className = 'flex justify-between items-center p-2 cursor-pointer';
                            const summaryLabel = Object.values(item)[0] || 'Elemento';
                            const summaryText = document.createElement('span');
                            summaryText.textContent = `${key.slice(0, -1)}: ${summaryLabel}`;
                            itemSummary.appendChild(summaryText);
                            const itemControls = document.createElement('div');
                            itemControls.className = 'item-controls';
                            const itemMoveHandle = document.createElement('button');
                            itemMoveHandle.innerHTML = '&#9776;';
                            itemMoveHandle.className = 'drag-handle';
                            const itemDeleteBtn = document.createElement('button');
                            itemDeleteBtn.innerHTML = '&#10005;';
                            itemDeleteBtn.dataset.action = 'delete-item';
                            itemDeleteBtn.dataset.path = `${path}-${itemIndex}`;
                            itemControls.appendChild(itemMoveHandle);
                            itemControls.appendChild(itemDeleteBtn);
                            itemSummary.appendChild(itemControls);
                            itemDetails.appendChild(itemSummary);
                            const itemContentWrapper = document.createElement('div');
                            itemContentWrapper.className = 'p-3 border-t border-gray-700';
                            for (const itemKey in item) {
                                if (typeof item[itemKey] !== 'object') {
                                    createField(itemContentWrapper, `${path}-${itemIndex}-${itemKey}`, itemKey, item[itemKey]);
                                }
                            }
                            itemDetails.appendChild(itemContentWrapper);
                            itemsContainer.appendChild(itemDetails);
                        });
                        contentWrapper.appendChild(itemsContainer);
                        const addItemBtn = document.createElement('button');
                        addItemBtn.textContent = `Añadir ${key}`;
                        addItemBtn.className = 'mt-2 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded';
                        addItemBtn.dataset.action = 'add-item';
                        addItemBtn.dataset.path = path;
                        addItemBtn.dataset.template = key;
                        contentWrapper.appendChild(addItemBtn);
                    }
                } else {
                    createField(contentWrapper, path, key, value);
                }
            }

            // --- Renderizar campos de espaciado ---
            if (section.spacing) {
                const spacingFieldset = document.createElement('fieldset');
                spacingFieldset.className = 'border border-gray-600 p-3 mt-4 rounded';
                const legend = document.createElement('legend');
                legend.className = 'px-2 text-sm text-gray-400';
                legend.textContent = 'Espaciado (Padding)';
                spacingFieldset.appendChild(legend);

                for (const key in section.spacing) {
                    const path = `${section.id}-spacing-${key}`;
                    createField(spacingFieldset, path, key, section.spacing[key]);
                }
                contentWrapper.appendChild(spacingFieldset);
            }

            details.appendChild(contentWrapper);
            form.appendChild(details);
        });
    }

    function createField(container, path, label, value) {
        const group = document.createElement('div');
        group.className = 'control-group';
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.htmlFor = path;
        group.appendChild(labelEl);

        const inputType = getInputType(label, value);

        if (inputType === 'textarea') {
            const textarea = document.createElement('textarea');
            textarea.id = path;
            textarea.value = value;
            textarea.dataset.path = path;
            group.appendChild(textarea);
            setTimeout(() => {
                tinymce.init({
                    selector: `#${path}`,
                    plugins: 'link lists code',
                    toolbar: 'undo redo | bold italic | bullist numlist | link | code',
                    menubar: false,
                    setup: function (editor) {
                        editor.on('input change', function () {
                            const content = editor.getContent();
                            textarea.value = content;
                            textarea.dispatchEvent(new Event('input', { bubbles: true }));
                        });
                    }
                });
            }, 100);
        } else {
            const input = document.createElement('input');
            input.type = inputType;
            if (inputType === 'range') {
                if (label === 'gridCols') {
                    input.min = 1; input.max = 4; input.step = 1;
                } else {
                    input.min = 0; input.max = (label.includes('Speed')) ? 1 : 10; input.step = 0.1;
                }
            }
            if (inputType === 'number') {
                input.min = 0; input.max = 128; input.step = 1;
            }
            input.id = path;
            input.value = value;
            input.dataset.path = path;
            group.appendChild(input);
        }
        container.appendChild(group);
    }

    function getInputType(label, value) {
        if (label.includes('color')) return 'color';
        if (label === 'gridCols') return 'range';
        if (['pt', 'pb', 'pl', 'pr'].includes(label)) return 'number';
        if (typeof value === 'number') return 'range';
        if (String(value).includes('\n') || String(value).length > 100) return 'textarea';
        return 'text';
    }

    document.getElementById('editor-container').addEventListener('input', (event) => {
        const input = event.target;
        const path = input.dataset.path.split('-');
        let value = (input.type === 'range' || input.type === 'number') ? parseFloat(input.value) : input.value;

        // --- Manejo de Espaciado ---
        if (path[1] === 'spacing') {
            const [sectionId, , spacingKey] = path;
            const section = currentSchema.find(s => s.id === sectionId);
            if (section && section.spacing) {
                section.spacing[spacingKey] = String(value);
                // Ahora llama a la actualización en vivo en lugar de recargar
                if (liveUpdater) {
                    liveUpdater.updateSpacing(section.id, section.spacing);
                }
            }
            return;
        }

        // --- Manejo de Estilos ---
        if (path.includes('style')) {
            const elementId = path[0];
            const styleProp = path[2];
            currentSchema.forEach(section => {
                for (const key in section.content) {
                    if (Array.isArray(section.content[key])) {
                        section.content[key].forEach(item => {
                            const itemId = `${section.id}-${key}-${item.id}`;
                            if (elementId.startsWith(itemId)) {
                                if (!item.styles) item.styles = {};
                                item.styles[styleProp] = value;
                            }
                        });
                    }
                }
            });
            if (liveUpdater) {
                liveUpdater.updateStyle(elementId, styleProp, value);
            }
            return;
        }

        // --- Manejo de Contenido ---
        const [sectionId, key, itemIndex, itemKey] = path;
        const section = currentSchema.find(s => s.id === sectionId);
        if(!section) return;

        let targetId;
        let isAttributeUpdate = false;
        let attribute;

        if (itemIndex !== undefined && itemKey !== undefined) {
            section.content[key][itemIndex][itemKey] = value;
            targetId = `${sectionId}-${key}-${itemIndex}-${itemKey}`;
            if (itemKey.toLowerCase().includes('photo') || itemKey.toLowerCase().includes('logo')) {
                isAttributeUpdate = true;
                attribute = 'src';
            }
        } else {
            if (Array.isArray(section.content[key])) {
                section.content[key] = value.split('\n');
            } else {
                section.content[key] = value;
            }
            targetId = `${sectionId}-${key}`;
        }

        if (!liveUpdater) return;

        if (key === 'gridCols') {
            saveAndRefresh();
            return;
        }

        const isAnimKey = ['mouseFollowSpeed', 'mouseWaveRadius', 'mouseWaveIntensity', 'colorA', 'colorB', 'colorInteraction'].includes(key) || ['mouseFollowSpeed', 'mouseWaveRadius', 'mouseWaveIntensity', 'colorA', 'colorB', 'colorInteraction'].includes(itemKey);

        if (isAnimKey) {
            const animProp = itemKey || key;
            const animValue = value;
            const uniformName = `u_${animProp}`.replace('colorA', 'color_a').replace('colorB', 'color_b').replace('colorInteraction', 'color_interaction');
            liveUpdater.updateAnimation(uniformName, animValue);
        } else if (isAttributeUpdate) {
            liveUpdater.updateAttribute(targetId, attribute, value);
        } else {
            liveUpdater.updateText(targetId, value);
        }
    });

    saveButton.addEventListener('click', () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(currentSchema));
            saveButton.textContent = '¡Guardado!';
            setTimeout(() => saveButton.textContent = 'Guardar Cambios', 1500);
        } catch (e) {
            console.error("Error al guardar.", e);
        }
    });

    resetButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro?')) {
            localStorage.removeItem(storageKey);
            loadSchema();
            saveAndRefresh(true);
        }
    });

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

    function initSortable() {
        new Sortable(form, {
            animation: 150,
            handle: '.drag-handle',
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

    iframe.addEventListener('load', () => {
        liveUpdater = iframe.contentWindow.liveUpdater;
    });

    const contentPanel = document.getElementById('content-panel');
    const stylesPanel = document.getElementById('styles-panel');
    const tabContent = document.getElementById('tab-content');
    const tabStyles = document.getElementById('tab-styles');

    tabContent.addEventListener('click', () => {
        contentPanel.classList.remove('hidden');
        stylesPanel.classList.add('hidden');
        tabContent.classList.add('bg-gray-700', 'font-bold');
        tabStyles.classList.remove('bg-gray-700', 'font-bold');
    });

    tabStyles.addEventListener('click', () => {
        stylesPanel.classList.remove('hidden');
        contentPanel.classList.add('hidden');
        tabStyles.classList.add('bg-gray-700', 'font-bold');
        tabContent.classList.remove('bg-gray-700', 'font-bold');
    });

    window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin && !event.origin.includes('localhost')) return;
        const { type, payload } = event.data;
        if (type === 'inline-edit') {
            const { id, newText } = payload;
            const input = document.getElementById(id);
            if (input) {
                input.value = newText;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } else if (type === 'element-selected') {
            tabStyles.click();
            renderStyleEditor(payload.id);
        } else if (type === 'visual-spacing-update') {
            const { sectionId, direction, newValue } = payload;
            const inputId = `${sectionId}-spacing-${direction}`;
            const input = document.getElementById(inputId);
            if (input) {
                input.value = newValue;
                // Disparar el evento 'input' para que la lógica de actualización del schema se ejecute
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    });

    function renderStyleEditor(elementId) {
        stylesPanel.innerHTML = '';
        const title = document.createElement('h2');
        title.className = 'font-bold text-lg mb-4';
        title.textContent = `Editando Estilos para: ${elementId}`;
        stylesPanel.appendChild(title);
        const editableStyles = {
            'backgroundColor': 'color',
            'color': 'color',
            'padding': 'text',
            'borderRadius': 'text'
        };
        for (const prop in editableStyles) {
             createField(stylesPanel, `${elementId}-style-${prop}`, prop, '');
        }
    }

    loadSchema();
    renderEditor();
    populateAddSectionMenu();
    initSortable();
});
