// renderer.js
// Contiene la lógica para renderizar la página dinámicamente desde el page-schema.

function renderHeroSection(section) {
    const c = section.content;
    return `
        <nav class="fixed top-0 left-0 right-0 z-50 p-4">
            <div class="glass-card rounded-full max-w-4xl mx-auto px-6 py-3">
                <div class="flex justify-between items-center">
                    <a href="#" id="nav_brand" class="text-xl font-bold text-cyan-300">${c.nav_brand}</a>
                    <div class="hidden md:flex space-x-8">
                        <a href="#quienes-somos" id="nav_quienes_somos" class="text-gray-300 hover:text-white">${c.nav_quienes_somos}</a>
                        <a href="#servicios" id="nav_servicios" class="text-gray-300 hover:text-white">${c.nav_servicios}</a>
                        <a href="#proyectos" id="nav_proyectos" class="text-gray-300 hover:text-white">${c.nav_proyectos}</a>
                        <a href="#contacto" id="nav_contacto" class="text-gray-300 hover:text-white">${c.nav_contacto}</a>
                    </div>
                </div>
            </div>
        </nav>
        <header class="hero-section">
            <h1 id="hero_title" class="text-6xl md:text-8xl font-black uppercase tracking-tighter">${c.hero_title}</h1>
            <p id="hero_subtitle" class="text-xl md:text-2xl text-gray-300 mt-4 max-w-2xl">${c.hero_subtitle}</p>
            <p id="hero_scroll_prompt" class="text-lg text-purple-300 mt-20 animate-pulse">${c.hero_scroll_prompt}</p>
        </header>
    `;
}

function renderIdentitySection(section) {
    const c = section.content;
    return `
        <section id="${section.id}" class="py-24 px-8 max-w-7xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold">${c.title}</h2>
                <p class="text-lg text-gray-300 mt-2">${c.subtitle}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                ${c.cards.map(card => `
                    <div class="glass-card p-8 rounded-2xl shadow-2xl">
                        <h3 class="text-2xl font-bold text-purple-300 mb-4">${card.title}</h3>
                        <p class="text-gray-200 leading-relaxed">${card.text}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function renderPillarsSection(section) {
    const c = section.content;
    return `
        <section class="py-24 px-8 max-w-7xl mx-auto">
            <h2 class="text-4xl font-bold text-center mb-16">${c.title}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                ${c.pillars.map(pillar => `
                    <div class="glass-card p-6 rounded-lg">
                        <h3 class="text-2xl font-bold text-cyan-300 mb-2">${pillar.title}</h3>
                        <p class="text-gray-300">${pillar.text}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function renderServicesSection(section) {
    const c = section.content;
    return `
        <section id="${section.id}" class="py-24">
            <div class="max-w-7xl mx-auto px-8">
                <h2 class="text-4xl font-bold mb-6">${c.title}</h2>
                <p class="text-lg text-gray-300 max-w-3xl mb-12">${c.description}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                ${c.services.map(service => `
                    <div class="glass-card rounded-lg overflow-hidden h-full shadow-lg">
                        <img src="https://placehold.co/600x400/0d1a3f/a87eff?text=${encodeURIComponent(service.title)}" alt="${service.title}" class="w-full h-40 object-cover">
                        <div class="p-5">
                            <h3 class="text-xl font-bold text-purple-300 mb-2">${service.title}</h3>
                            <ul class="list-disc list-inside text-gray-300 text-sm">
                                ${service.items.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function renderProjectsSection(section) {
    const c = section.content;
    return `
        <section id="${section.id}" class="py-24 px-8 max-w-7xl mx-auto">
            <h2 class="text-4xl font-bold text-center mb-16">${c.title}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                ${c.projects.map(project => `
                    <div class="glass-card rounded-lg p-8">
                        <img src="${project.clientLogo}" alt="Logo ${project.clientName}" class="h-12 mb-4" onerror="this.src='https://placehold.co/150x50/161b22/c9d1d9?text=${encodeURIComponent(project.clientName)}'; this.onerror=null;">
                        <h3 class="text-2xl font-bold text-cyan-300 mb-2">${project.title}</h3>
                        <p class="text-gray-300">${project.description}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function renderTeamSection(section) {
    const c = section.content;
    return `
        <section class="py-24 px-8 max-w-5xl mx-auto text-center">
            <h2 class="text-4xl font-bold text-center mb-16">${c.title}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                ${c.members.map(member => `
                    <div>
                        <img src="${member.photo}" class="w-48 h-48 object-cover rounded-full mx-auto hexagon-clip" alt="Foto de ${member.name}">
                        <h3 class="text-2xl font-bold text-cyan-300 mt-4">${member.name}</h3>
                        <p class="text-purple-300">${member.role}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function renderFooterSection(section) {
    const c = section.content;
    return `
        <footer id="${section.id}" class="py-20 mt-24 px-8 glass-card border-t border-purple-300/10">
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                    <h3 id="footer_brand" class="text-2xl font-bold text-cyan-300">${c.brandName}</h3>
                    <p class="text-gray-400">RUT: ${c.rut}</p>
                     <p class="text-gray-400 mt-4">Representante Legal: ${c.legalRep}</p>
                     <p class="text-gray-400">RUT: ${c.legalRepRut}</p>
                </div>
                <div>
                    <h4 class="text-lg font-bold text-purple-300 mb-2">${c.contactTitle}</h4>
                    <p class="text-gray-300">${c.email}</p>
                    <p class="text-gray-300">${c.phone}</p>
                </div>
                <div>
                    <h4 class="text-lg font-bold text-purple-300 mb-2">${c.locationTitle}</h4>
                    <p class="text-gray-300">${c.address}</p>
                </div>
            </div>
        </footer>
    `;
}


export function renderPage(schema, container) {
    let fullHtml = '';
    schema.forEach(section => {
        switch (section.type) {
            case 'hero':
                fullHtml += renderHeroSection(section);
                break;
            case 'identity':
                fullHtml += renderIdentitySection(section);
                break;
            case 'pillars':
                fullHtml += renderPillarsSection(section);
                break;
            case 'services':
                fullHtml += renderServicesSection(section);
                break;
            case 'projects':
                fullHtml += renderProjectsSection(section);
                break;
            case 'team':
                fullHtml += renderTeamSection(section);
                break;
            case 'footer':
                fullHtml += renderFooterSection(section);
                break;
            default:
                console.warn(`Tipo de sección desconocido: ${section.type}`);
        }
    });
    container.innerHTML = fullHtml;
}
