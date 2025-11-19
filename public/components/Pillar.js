
// public/components/Pillar.js

export function Pillar(sectionId, pillar, index) {
    return `
        <div class="glass-card p-6 rounded-lg">
            <h3 id="${sectionId}-pillars-${index}-title" class="text-2xl font-bold text-cyan-300 mb-2">${pillar.title}</h3>
            <p id="${sectionId}-pillars-${index}-text" class="text-gray-300">${pillar.text}</p>
        </div>
    `;
}
