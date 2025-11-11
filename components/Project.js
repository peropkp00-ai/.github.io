
// components/Project.js
function toStyleString(styles) {
    if (!styles) return '';
    return Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join(';');
}

export function Project(sectionId, project, index) {
    const style = toStyleString(project.styles);
    return `
        <div class="glass-card rounded-lg p-8" style="${style}">
            <img id="${sectionId}-projects-${index}-clientLogo" src="${project.clientLogo}" alt="Logo ${project.clientName}" class="h-12 mb-4" onerror="this.src='https://placehold.co/150x50/161b22/c9d1d9?text=${encodeURIComponent(project.clientName)}'; this.onerror=null;">
            <h3 id="${sectionId}-projects-${index}-title" class="text-2xl font-bold text-cyan-300 mb-2" contenteditable="true">${project.title}</h3>
            <div id="${sectionId}-projects-${index}-description" class="text-gray-300" contenteditable="true">${project.description}</div>
        </div>
    `;
}
