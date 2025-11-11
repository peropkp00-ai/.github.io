
// components/IdentityCard.js
function toStyleString(styles) {
    if (!styles) return '';
    return Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join(';');
}

export function IdentityCard(sectionId, card, index) {
    const style = toStyleString(card.styles);
    return `
        <div class="glass-card p-8 rounded-2xl shadow-2xl" style="${style}">
            <h3 id="${sectionId}-cards-${index}-title" class="text-2xl font-bold text-purple-300 mb-4" contenteditable="true">${card.title}</h3>
            <div id="${sectionId}-cards-${index}-text" class="text-gray-200 leading-relaxed" contenteditable="true">${card.text}</div>
        </div>
    `;
}
