
// public/components/Project.js

export function Project(sectionId, project, index) {
    return `
        <div class="glass-card rounded-lg p-8">
            <img src="${project.clientLogo}" alt="Logo ${project.clientName}" class="h-12 mb-4" onerror="this.src='https://placehold.co/150x50/161b22/c9d1d9?text=${encodeURIComponent(project.clientName)}'; this.onerror=null;">
            <h3 id="${sectionId}-projects-${index}-title" class="text-2xl font-bold text-cyan-300 mb-2">${project.title}</h3>
            <p id="${sectionId}-projects-${index}-description" class="text-gray-300">${project.description}</p>
        </div>
    `;
}
