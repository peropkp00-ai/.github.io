
// public/section-templates.js
import { itemTemplates } from './item-templates.js';

function generateUniqueId(prefix = 'section') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const sectionTemplates = {
    identity: () => ({
        type: 'identity',
        id: generateUniqueId('identity'),
        spacing: { pt: '16', pb: '16', pl: '4', pr: '4' },
        content: {
            title: "Nueva Sección de Identidad",
            subtitle: "Un subtítulo para la nueva sección.",
            gridCols: 3,
            cards: [itemTemplates.cardTemplate()]
        }
    }),
    pillars: () => ({
        type: 'pillars',
        id: generateUniqueId('pillars'),
        spacing: { pt: '16', pb: '16', pl: '4', pr: '4' },
        content: {
            title: "Nuevos Pilares",
            gridCols: 4,
            pillars: [itemTemplates.pillarTemplate()]
        }
    }),
    services: () => ({
        type: 'services',
        id: generateUniqueId('services'),
        spacing: { pt: '16', pb: '16', pl: '4', pr: '4' },
        content: {
            title: "Nuevos Servicios",
            description: "Descripción de los nuevos servicios.",
            gridCols: 3,
            services: [itemTemplates.serviceTemplate()]
        }
    }),
    // Añade más plantillas de sección aquí si es necesario
};
