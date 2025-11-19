
// public/components/TeamMember.js

export function TeamMember(sectionId, member, index) {
    return `
        <div>
            <img src="${member.photo}" class="w-48 h-48 object-cover rounded-full mx-auto hexagon-clip" alt="Foto de ${member.name}">
            <h3 id="${sectionId}-members-${index}-name" class="text-2xl font-bold text-cyan-300 mt-4">${member.name}</h3>
            <p id="${sectionId}-members-${index}-role" class="text-purple-300">${member.role}</p>
        </div>
    `;
}
