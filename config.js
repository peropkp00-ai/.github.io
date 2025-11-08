// config.js

// Este objeto contiene todos los parámetros por defecto para la animación 3D.
// El editor.html modificará estos valores y los guardará en localStorage.
// El index.html leerá de localStorage o usará estos valores si no hay nada guardado.

export const animationConfig = {
    // Sensibilidad del seguimiento del mouse (0.01 = lento, 1.0 = instantáneo)
    mouseFollowSpeed: 0.1,

    // Radio de la ola generada por el mouse (unidades de la escena 3D)
    mouseWaveRadius: 2.5,

    // Intensidad de la ola generada por el mouse (altura)
    mouseWaveIntensity: 3.0,

    // Color A de la grilla (formato hexadecimal)
    colorA: '#a87eff', // Púrpura

    // Color B de la grilla (formato hexadecimal)
    colorB: '#00ffff', // Cian

    // Color de la interacción del mouse
    colorInteraction: '#ffffff', // Blanco
};
