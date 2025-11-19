
// public/components/Service.js

export function Service(sectionId, service, index) {
    return `
        <div class="glass-card rounded-lg overflow-hidden h-full shadow-lg">
            <img src="https://placehold.co/600x400/0d1a3f/a87eff?text=${encodeURIComponent(service.title)}" alt="${service.title}" class="w-full h-40 object-cover">
            <div class="p-5">
                <h3 id="${sectionId}-services-${index}-title" class="text-xl font-bold text-purple-300 mb-2">${service.title}</h3>
                <ul id="${sectionId}-services-${index}-items" class="list-disc list-inside text-gray-300 text-sm">
                    ${service.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}
