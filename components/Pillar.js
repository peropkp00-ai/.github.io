
// components/Pillar.js
function toStyleString(styles) {
    if (!styles) return '';
    return Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join(';');
}

export function Pillar(sectionId, pillar, index) {
    const style = toStyleString(pillar.styles);
    return `
        <div class="glass-card p-6 rounded-lg" style="${style}">
            <h3 id="${sectionId}-pillars-${index}-title" class="text-2xl font-bold text-cyan-300 mb-2" contenteditable="true">${pillar.title}</h3>
            <div id="${sectionId}-pillars-${index}-text" class="text-gray-300" contenteditable="true">${pillar.text}</div>
        </div>
    `;
}
