// section-templates.js
// Contiene las plantillas de datos para crear nuevas secciones.

// Función para generar un ID único simple
const uid = () => `${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

export const sectionTemplates = {
    identity: () => ({
        type: 'identity',
        id: `identity-${uid()}`,
        content: {
            title: "Nueva Sección de Identidad",
            subtitle: "Un subtítulo para la nueva sección.",
            cards: [
                { id: "card1", title: "Nuevo Título", text: "Nuevo texto." }
            ]
        }
    }),
    pillars: () => ({
        type: 'pillars',
        id: `pillars-${uid()}`,
        content: {
            title: "Nuevos Pilares",
            pillars: [
                { id: "pillar1", title: "Nuevo Pilar", text: "Descripción del nuevo pilar." }
            ]
        }
    }),
    services: () => ({
        type: 'services',
        id: `services-${uid()}`,
        content: {
            title: "Nuevos Servicios",
            description: "Descripción de la nueva sección de servicios.",
            services: [
                { id: "service1", title: "Nuevo Servicio", items: ["Item 1", "Item 2"] }
            ]
        }
    }),
    projects: () => ({
        type: 'projects',
        id: `projects-${uid()}`,
        content: {
            title: "Nuevos Proyectos",
            projects: [
                { id: "project1", clientLogo: "", clientName: "Nuevo Cliente", title: "Nuevo Proyecto", description: "Descripción del nuevo proyecto." }
            ]
        }
    }),
    team: () => ({
        type: 'team',
        id: `team-${uid()}`,
        content: {
            title: "Nuevo Equipo",
            members: [
                { id: "member1", photo: "", name: "Nombre", role: "Cargo" }
            ]
        }
    }),
};
