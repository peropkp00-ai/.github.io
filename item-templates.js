// item-templates.js
// Contiene las plantillas de datos para crear nuevos elementos dentro de las secciones.

export const itemTemplates = {
    cards: () => ({
        id: `card-${Date.now()}`,
        title: "Nuevo Título de Tarjeta",
        text: "Nuevo texto para la tarjeta."
    }),
    pillars: () => ({
        id: `pillar-${Date.now()}`,
        title: "Nuevo Pilar",
        text: "Descripción del nuevo pilar."
    }),
    services: () => ({
        id: `service-${Date.now()}`,
        title: "Nuevo Servicio",
        items: ["Nuevo item 1", "Nuevo item 2"]
    }),
    projects: () => ({
        id: `project-${Date.now()}`,
        clientLogo: "",
        clientName: "Nuevo Cliente",
        title: "Nuevo Proyecto",
        description: "Descripción del nuevo proyecto."
    }),
    members: () => ({
        id: `member-${Date.now()}`,
        photo: "",
        name: "Nombre y Apellido",
        role: "Cargo"
    }),
};
