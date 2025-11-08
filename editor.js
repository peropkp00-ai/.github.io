// editor.js
import { animationConfig } from './config.js';
import { contentConfig } from './content-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const defaultAnimConfig = animationConfig;
    const defaultContentConfig = contentConfig;
    const animStorageKey = 'userAnimationConfig';
    const contentStorageKey = 'userContentConfig';

    const form = document.getElementById('editor-form');
    const iframe = document.getElementById('preview-iframe');
    const inputs = {
        mouseFollowSpeed: document.getElementById('mouseFollowSpeed'),
        mouseWaveRadius: document.getElementById('mouseWaveRadius'),
        mouseWaveIntensity: document.getElementById('mouseWaveIntensity'),
        colorA: document.getElementById('colorA'),
        colorB: document.getElementById('colorB'),
        colorInteraction: document.getElementById('colorInteraction'),
        quienesSomos: document.getElementById('quienesSomos'),
        nuestraMision: document.getElementById('nuestraMision'),
        nuestraVision: document.getElementById('nuestraVision'),
    };
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

    function applyAndSaveChanges(isInitialLoad = false) {
        const currentAnimConfig = {};
        const currentContentConfig = {};

        for (const key in inputs) {
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

            // Si el iframe está listo, actualiza su contenido.
            if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
                // Si es un cambio en tiempo real (no la carga inicial), recargamos para aplicar cambios de animación.
                if (!isInitialLoad && Object.keys(currentAnimConfig).some(k => inputs[k].type !== 'textarea')) {
                     iframe.contentWindow.location.reload();
                }

                // Inyectar contenido de texto directamente para una actualización instantánea.
                const iframeDoc = iframe.contentWindow.document;
                const contentMap = {
                    quienesSomos: 'content-quienesSomos',
                    nuestraMision: 'content-nuestraMision',
                    nuestraVision: 'content-nuestraVision',
                };
                for(const key in contentMap) {
                    const el = iframeDoc.getElementById(contentMap[key]);
                    if(el) el.textContent = currentContentConfig[key];
                }
            }
        } catch (error) {
            console.error("Error al guardar o aplicar la configuración:", error);
        }
    }

    // --- Inicialización y Event Listeners ---

    const currentAnimSettings = loadSettings(animStorageKey, defaultAnimConfig);
    const currentContentSettings = loadSettings(contentStorageKey, defaultContentConfig);
    populateForm(currentAnimSettings, currentContentSettings);

    // Esperar a que el iframe cargue para la primera actualización
    iframe.addEventListener('load', () => {
        applyAndSaveChanges(true); // Carga inicial, no recargar
    });

    form.addEventListener('input', () => {
        for (const key in valueDisplays) {
            if (inputs[key] && valueDisplays[key]) {
                valueDisplays[key].textContent = inputs[key].value;
            }
        }
        applyAndSaveChanges();
    });

    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        applyAndSaveChanges();
        saveButton.textContent = '¡Guardado!';
        setTimeout(() => { saveButton.textContent = 'Guardar Cambios'; }, 1500);
    });

    resetButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro? Se restaurarán tanto la animación como los textos a sus valores por defecto.')) {
            localStorage.removeItem(animStorageKey);
            localStorage.removeItem(contentStorageKey);
            populateForm(defaultAnimConfig, defaultContentConfig);
            applyAndSaveChanges();
        }
    });
});
