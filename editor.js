// editor.js
import { animationConfig } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const defaultAnimConfig = animationConfig;
    // contentConfig ya no se usa, será reemplazado por el pageSchema en la Fase 2
    const defaultContentConfig = {};
    const animStorageKey = 'userAnimationConfig';
    const contentStorageKey = 'userContentConfig';

    const form = document.getElementById('editor-form');
    const iframe = document.getElementById('preview-iframe');

    // Lista completa de IDs de los inputs
    const inputIds = Object.keys(contentConfig).concat(Object.keys(animationConfig));
    const inputs = {};
    inputIds.forEach(id => {
        inputs[id] = document.getElementById(id);
    });

    const valueDisplays = {
        mouseFollowSpeed: document.getElementById('mouseFollowSpeed-value'),
        mouseWaveRadius: document.getElementById('mouseWaveRadius-value'),
        mouseWaveIntensity: document.getElementById('mouseWaveIntensity-value'),
    };
    const saveButton = document.getElementById('save-button');
    const resetButton = document.getElementById('reset-button');

    function loadSettings(key, defaultConfig) {
        try {
            const savedSettings = localStorage.getItem(key);
            return savedSettings ? { ...defaultConfig, ...JSON.parse(savedSettings) } : { ...defaultConfig };
        } catch (error) {
            console.error(`Error al cargar la configuración para ${key}:`, error);
            return { ...defaultConfig };
        }
    }

    function populateForm(animConfig, contentConfig) {
        const allConfigs = { ...animConfig, ...contentConfig };
        for (const key in allConfigs) {
            if (inputs[key]) {
                inputs[key].value = allConfigs[key];
                if (valueDisplays[key]) {
                    valueDisplays[key].textContent = allConfigs[key];
                }
            }
        }
    }

function applyAndSaveChanges() {
        const currentAnimConfig = {};
        const currentContentConfig = {};

        for (const key in inputs) {
            if (!inputs[key]) continue;
            const value = inputs[key].type === 'range' ? parseFloat(inputs[key].value) : inputs[key].value;
            if (key in defaultAnimConfig) {
                currentAnimConfig[key] = value;
            } else if (key in defaultContentConfig) {
                currentContentConfig[key] = value;
            }
        }

        try {
            localStorage.setItem(animStorageKey, JSON.stringify(currentAnimConfig));
            localStorage.setItem(contentStorageKey, JSON.stringify(currentContentConfig));

        // La actualización de texto en tiempo real se mantiene
            if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
                const iframeDoc = iframe.contentWindow.document;
                for (const key in currentContentConfig) {
                    const element = iframeDoc.getElementById(key);
                    if (element) {
                         if (key.includes('_list')) {
                            element.innerHTML = '';
                            const items = currentContentConfig[key].split('\n');
                            items.forEach(itemText => {
                                if (itemText.trim() !== '') {
                                    const li = iframeDoc.createElement('li');
                                    li.textContent = itemText;
                                    element.appendChild(li);
                                }
                            });
                        } else {
                            element.textContent = currentContentConfig[key];
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error al guardar o aplicar la configuración:", error);
        }
    }

    const currentAnimSettings = loadSettings(animStorageKey, defaultAnimConfig);
    const currentContentSettings = loadSettings(contentStorageKey, defaultContentConfig);
    populateForm(currentAnimSettings, currentContentSettings);

    iframe.addEventListener('load', () => {
        // Al cargar el iframe, se aplican los cambios de texto sin recargar
        applyAndSaveChanges();
    });

    form.addEventListener('input', (event) => {
        const changedInput = event.target;
        // Actualiza las pantallas de valores para los controles deslizantes en tiempo real
        if (valueDisplays[changedInput.id]) {
            valueDisplays[changedInput.id].textContent = changedInput.value;
        }
        // Guarda todos los cambios en cada entrada, actualizando el texto en vivo
        applyAndSaveChanges();
    });

    // Añade un detector de cambios para recargar en los controles de animación
    form.addEventListener('change', (event) => {
        const changedInput = event.target;
        // Recarga el iframe solo si se ha modificado un control de animación
        if (changedInput.id in defaultAnimConfig) {
            // Primero guarda el valor más reciente
            applyAndSaveChanges();
            // Luego recarga para mostrar el cambio de animación
            iframe.contentWindow.location.reload();
        }
    });

    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        applyAndSaveChanges(); // Asegura que los últimos cambios se guarden
        iframe.contentWindow.location.reload(); // Recarga para asegurar que todos los cambios (incluida la animación) se apliquen
        saveButton.textContent = '¡Guardado!';
        setTimeout(() => { saveButton.textContent = 'Guardar Cambios'; }, 1500);
    });

    resetButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro? Se restaurarán todos los valores a los predeterminados.')) {
            localStorage.removeItem(animStorageKey);
            localStorage.removeItem(contentStorageKey);
            populateForm(defaultAnimConfig, defaultContentConfig);
            applyAndSaveChanges();
        }
    });
});
