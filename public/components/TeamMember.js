
// components/TeamMember.js
function toStyleString(styles) {
    if (!styles) return '';
    return Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join(';');
}

export function TeamMember(sectionId, member, index) {
    const style = toStyleString(member.styles);
    return `
        <div style="${style}">
            <img id="${sectionId}-members-${index}-photo" src="${member.photo}" class="w-48 h-48 object-cover rounded-full mx-auto hexagon-clip" alt="Foto de ${member.name}">
            <h3 id="${sectionId}-members-${index}-name" class="text-2xl font-bold text-cyan-300 mt-4" contenteditable="true">${member.name}</h3>
            <p id="${sectionId}-members-${index}-role" class="text-purple-300" contenteditable="true">${member.role}</p>
        </div>
    `;
}
