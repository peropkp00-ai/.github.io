// editor.js
import { animationConfig } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Referencia al objeto de configuración por defecto
    const defaultConfig = animationConfig;
    const storageKey = 'userAnimationConfig';

    // Elementos del DOM
    const form = document.getElementById('editor-form');
    const iframe = document.getElementById('preview-iframe');
    const inputs = {
        mouseFollowSpeed: document.getElementById('mouseFollowSpeed'),
        mouseWaveRadius: document.getElementById('mouseWaveRadius'),
        mouseWaveIntensity: document.getElementById('mouseWaveIntensity'),
        colorA: document.getElementById('colorA'),
        colorB: document.getElementById('colorB'),
        colorInteraction: document.getElementById('colorInteraction'),
    };
    const valueDisplays = {
        mouseFollowSpeed: document.getElementById('mouseFollowSpeed-value'),
        mouseWaveRadius: document.getElementById('mouseWaveRadius-value'),
        mouseWaveIntensity: document.getElementById('mouseWaveIntensity-value'),
    };
    const saveButton = document.getElementById('save-button');
    const resetButton = document.getElementById('reset-button');

    // --- Funciones ---

    /**
     * Carga la configuración desde localStorage o usa los valores por defecto.
     */
    function loadSettings() {
        try {
            const savedSettings = localStorage.getItem(storageKey);
            return savedSettings ? { ...defaultConfig, ...JSON.parse(savedSettings) } : { ...defaultConfig };
        } catch (error) {
            console.error("Error al cargar la configuración:", error);
            return { ...defaultConfig };
        }
    }

    /**
     * Rellena el formulario con los valores de una configuración dada.
     */
    function populateForm(config) {
        for (const key in config) {
            if (inputs[key]) {
                inputs[key].value = config[key];
                if (valueDisplays[key]) {
                    valueDisplays[key].textContent = config[key];
                }
            }
        }
    }

    /**
     * Guarda la configuración actual del formulario en localStorage y refresca el iframe.
     */
    function applyAndSaveChanges() {
        const currentConfig = {};
        for (const key in inputs) {
            currentConfig[key] = inputs[key].type === 'range' ? parseFloat(inputs[key].value) : inputs[key].value;
        }

        try {
            // Guardar en localStorage para persistencia
            localStorage.setItem(storageKey, JSON.stringify(currentConfig));

            // Forzar la recarga del iframe para que tome los nuevos valores
            if (iframe) {
                iframe.contentWindow.location.reload();
            }
        } catch (error) {
            console.error("Error al guardar la configuración:", error);
            alert('Hubo un error al guardar la configuración.');
        }
    }

    // --- Inicialización y Event Listeners ---

    const currentSettings = loadSettings();
    populateForm(currentSettings);

    // Actualizar los displays de los sliders y aplicar cambios en tiempo real
    form.addEventListener('input', () => {
        // Actualiza los valores numéricos que se muestran al lado de los sliders
        for (const key in valueDisplays) {
            if (inputs[key] && valueDisplays[key]) {
                valueDisplays[key].textContent = inputs[key].value;
            }
        }
        // Guardar y refrescar en cada cambio para una vista previa en tiempo real
        applyAndSaveChanges();
    });

    // Botón de guardar (aunque los cambios ya se aplican en tiempo real,
    // es bueno tener un botón explícito por si el usuario lo espera)
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        applyAndSaveChanges();
        // Opcional: Mostrar una confirmación sutil en lugar de una alerta
        saveButton.textContent = '¡Guardado!';
        setTimeout(() => { saveButton.textContent = 'Guardar Cambios'; }, 1500);
    });

    // Restaurar valores por defecto
    resetButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres restaurar los valores por defecto?')) {
            localStorage.removeItem(storageKey);
            populateForm(defaultConfig);
            // Aplicar los cambios por defecto inmediatamente
            applyAndSaveChanges();
        }
    });
});
