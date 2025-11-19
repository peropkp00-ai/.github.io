
// public/item-templates.js

function generateUniqueId(prefix = 'item') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const itemTemplates = {
    cardTemplate: () => ({
        id: generateUniqueId('card'),
        title: "Nuevo Card",
        text: "Descripción del nuevo card."
    }),
    pillarTemplate: () => ({
        id: generateUniqueId('pillar'),
        title: "Nuevo Pilar",
        text: "Descripción del nuevo pilar."
    }),
    serviceTemplate: () => ({
        id: generateUniqueId('service'),
        title: "Nuevo Servicio",
        items: ["Item 1", "Item 2"]
    }),
    projectTemplate: () => ({
        id: generateUniqueId('project'),
        clientLogo: "https://placehold.co/150x50/161b22/c9d1d9?text=Logo",
        clientName: "Nuevo Cliente",
        title: "Nuevo Proyecto",
        description: "Descripción del nuevo proyecto."
    }),
    memberTemplate: () => ({
        id: generateUniqueId('member'),
        photo: "https://placehold.co/200x200/0d1a3f/a87eff?text=?",
        name: "Nuevo Miembro",
        role: "Cargo"
    })
};
