// renderer.js
// Contiene la lógica para renderizar la página dinámicamente desde el page-schema.

function renderHeroSection(section) {
    const c = section.content;
    const id = section.id;
    return `
        <nav class="fixed top-0 left-0 right-0 z-50 p-4">
            <div class="glass-card rounded-full max-w-4xl mx-auto px-6 py-3">
                <div class="flex justify-between items-center">
                    <a href="#" id="${id}-nav_brand" class="text-xl font-bold text-cyan-300">${c.nav_brand}</a>
                    <div class="hidden md:flex space-x-8">
                        <a href="#quienes-somos" id="${id}-nav_quienes_somos" class="text-gray-300 hover:text-white">${c.nav_quienes_somos}</a>
                        <a href="#servicios" id="${id}-nav_servicios" class="text-gray-300 hover:text-white">${c.nav_servicios}</a>
                        <a href="#proyectos" id="${id}-nav_proyectos" class="text-gray-300 hover:text-white">${c.nav_proyectos}</a>
                        <a href="#contacto" id="${id}-nav_contacto" class="text-gray-300 hover:text-white">${c.nav_contacto}</a>
                    </div>
                </div>
            </div>
        </nav>
        <header class="hero-section">
            <h1 id="${id}-hero_title" class="text-6xl md:text-8xl font-black uppercase tracking-tighter">${c.hero_title}</h1>
            <p id="${id}-hero_subtitle" class="text-xl md:text-2xl text-gray-300 mt-4 max-w-2xl">${c.hero_subtitle}</p>
            <p id="${id}-hero_scroll_prompt" class="text-lg text-purple-300 mt-20 animate-pulse">${c.hero_scroll_prompt}</p>
        </header>
    `;
}

export function renderIdentityCard(sectionId, card, index) {
    return `
        <div class="glass-card p-8 rounded-2xl shadow-2xl">
            <h3 id="${sectionId}-cards-${index}-title" class="text-2xl font-bold text-purple-300 mb-4">${card.title}</h3>
            <p id="${sectionId}-cards-${index}-text" class="text-gray-200 leading-relaxed">${card.text}</p>
        </div>
    `;
}

function renderIdentitySection(section) {
    const c = section.content;
    const id = section.id;
    return `
        <section id="${id}" class="py-24 px-8 max-w-7xl mx-auto">
            <div class="text-center mb-16">
                <h2 id="${id}-title" class="text-4xl font-bold">${c.title}</h2>
                <p id="${id}-subtitle" class="text-lg text-gray-300 mt-2">${c.subtitle}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-container" data-path="${id}-cards">
                ${c.cards.map((card, index) => renderIdentityCard(id, card, index)).join('')}
            </div>
        </section>
    `;
}

export function renderPillar(sectionId, pillar, index) {
    return `
        <div class="glass-card p-6 rounded-lg">
            <h3 id="${sectionId}-pillars-${index}-title" class="text-2xl font-bold text-cyan-300 mb-2">${pillar.title}</h3>
            <p id="${sectionId}-pillars-${index}-text" class="text-gray-300">${pillar.text}</p>
        </div>
    `;
}

function renderPillarsSection(section) {
    const c = section.content;
    const id = section.id;
    return `
        <section class="py-24 px-8 max-w-7xl mx-auto">
            <h2 id="${id}-title" class="text-4xl font-bold text-center mb-16">${c.title}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-container" data-path="${id}-pillars">
                ${c.pillars.map((pillar, index) => renderPillar(id, pillar, index)).join('')}
            </div>
        </section>
    `;
}

export function renderService(sectionId, service, index) {
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

function renderServicesSection(section) {
    const c = section.content;
    const id = section.id;
    return `
        <section id="${id}" class="py-24">
            <div class="max-w-7xl mx-auto px-8">
                <h2 id="${id}-title" class="text-4xl font-bold mb-6">${c.title}</h2>
                <p id="${id}-description" class="text-lg text-gray-300 max-w-3xl mb-12">${c.description}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-container" data-path="${id}-services">
                ${c.services.map((service, index) => renderService(id, service, index)).join('')}
            </div>
        </section>
    `;
}

export function renderProject(sectionId, project, index) {
    return `
        <div class="glass-card rounded-lg p-8">
            <img id="${sectionId}-projects-${index}-clientLogo" src="${project.clientLogo}" alt="Logo ${project.clientName}" class="h-12 mb-4" onerror="this.src='https://placehold.co/150x50/161b22/c9d1d9?text=${encodeURIComponent(project.clientName)}'; this.onerror=null;">
            <h3 id="${sectionId}-projects-${index}-title" class="text-2xl font-bold text-cyan-300 mb-2">${project.title}</h3>
            <p id="${sectionId}-projects-${index}-description" class="text-gray-300">${project.description}</p>
        </div>
    `;
}

function renderProjectsSection(section) {
    const c = section.content;
    const id = section.id;
    return `
        <section id="${id}" class="py-24 px-8 max-w-7xl mx-auto">
            <h2 id="${id}-title" class="text-4xl font-bold text-center mb-16">${c.title}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-container" data-path="${id}-projects">
                ${c.projects.map((project, index) => renderProject(id, project, index)).join('')}
            </div>
        </section>
    `;
}

export function renderTeamMember(sectionId, member, index) {
    return `
        <div>
            <img id="${sectionId}-members-${index}-photo" src="${member.photo}" class="w-48 h-48 object-cover rounded-full mx-auto hexagon-clip" alt="Foto de ${member.name}">
            <h3 id="${sectionId}-members-${index}-name" class="text-2xl font-bold text-cyan-300 mt-4">${member.name}</h3>
            <p id="${sectionId}-members-${index}-role" class="text-purple-300">${member.role}</p>
        </div>
    `;
}

function renderTeamSection(section) {
    const c = section.content;
    const id = section.id;
    return `
        <section class="py-24 px-8 max-w-5xl mx-auto text-center">
            <h2 id="${id}-title" class="text-4xl font-bold text-center mb-16">${c.title}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-container" data-path="${id}-members">
                ${c.members.map((member, index) => renderTeamMember(id, member, index)).join('')}
            </div>
        </section>
    `;
}

function renderFooterSection(section) {
    const c = section.content;
    const id = section.id;
    return `
        <footer id="${id}" class="py-20 mt-24 px-8 glass-card border-t border-purple-300/10">
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                    <h3 id="${id}-brandName" class="text-2xl font-bold text-cyan-300">${c.brandName}</h3>
                    <p id="${id}-rut" class="text-gray-400">RUT: ${c.rut}</p>
                     <p id="${id}-legalRep" class="text-gray-400 mt-4">Representante Legal: ${c.legalRep}</p>
                     <p id="${id}-legalRepRut" class="text-gray-400">RUT: ${c.legalRepRut}</p>
                </div>
                <div>
                    <h4 id="${id}-contactTitle" class="text-lg font-bold text-purple-300 mb-2">${c.contactTitle}</h4>
                    <p id="${id}-email" class="text-gray-300">${c.email}</p>
                    <p id="${id}-phone" class="text-gray-300">${c.phone}</p>
                </div>
                <div>
                    <h4 id="${id}-locationTitle" class="text-lg font-bold text-purple-300 mb-2">${c.locationTitle}</h4>
                    <p id="${id}-address" class="text-gray-300">${c.address}</p>
                </div>
            </div>
        </footer>
    `;
}


export function renderPage(schema, container) {
    let mainContentHtml = '';
    let heroHtml = '';

    schema.forEach(section => {
        switch (section.type) {
            case 'hero':
                // El Hero se renderiza fuera del <main>
                heroHtml = renderHeroSection(section);
                break;
            case 'identity':
                mainContentHtml += renderIdentitySection(section);
                break;
            case 'pillars':
                mainContentHtml += renderPillarsSection(section);
                break;
            case 'services':
                mainContentHtml += renderServicesSection(section);
                break;
            case 'projects':
                mainContentHtml += renderProjectsSection(section);
                break;
            case 'team':
                mainContentHtml += renderTeamSection(section);
                break;
            case 'footer':
                mainContentHtml += renderFooterSection(section);
                break;
            default:
                console.warn(`Tipo de sección desconocido: ${section.type}`);
        }
    });

    // Se envuelve el contenido principal en <main class="scroll-content">
    container.innerHTML = `
        ${heroHtml}
        <main class="scroll-content">
            ${mainContentHtml}
        </main>
    `;
}
