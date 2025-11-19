
// public/components/IdentityCard.js

export function IdentityCard(sectionId, card, index) {
    return `
        <div class="glass-card p-8 rounded-2xl shadow-2xl">
            <h3 id="${sectionId}-cards-${index}-title" class="text-2xl font-bold text-purple-300 mb-4">${card.title}</h3>
            <p id="${sectionId}-cards-${index}-text" class="text-gray-200 leading-relaxed">${card.text}</p>
        </div>
    `;
}
