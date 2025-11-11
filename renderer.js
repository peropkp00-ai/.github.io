// renderer.js
// Recreado desde la memoria debido a un borrado accidental por parte de una herramienta.

import { IdentityCard } from './components/IdentityCard.js';
import { Pillar } from './components/Pillar.js';
import { Service } from './components/Service.js';
import { Project } from './components/Project.js';
import { TeamMember } from './components/TeamMember.js';

function getSpacingClasses(spacing) {
    if (!spacing) return '';
    return Object.entries(spacing)
        .map(([key, value]) => `${key}-${value}`)
        .join(' ');
}

function renderHeroSection(section) {
    const c = section.content;
    const id = section.id;
    return `
        <nav class="fixed top-0 left-0 right-0 z-50 p-4">
            <div class="glass-card rounded-full max-w-4xl mx-auto px-6 py-3">
                <div class="flex justify-between items-center">
                    <a href="#" id="${id}-nav_brand" class="text-xl font-bold text-cyan-300" contenteditable="true">${c.nav_brand}</a>
                    <div class="hidden md:flex space-x-8">
                        <a href="#quienes-somos" id="${id}-nav_quienes_somos" class="text-gray-300 hover:text-white" contenteditable="true">${c.nav_quienes_somos}</a>
                        <a href="#servicios" id="${id}-nav_servicios" class="text-gray-300 hover:text-white" contenteditable="true">${c.nav_servicios}</a>
                        <a href="#proyectos" id="${id}-nav_proyectos" class="text-gray-300 hover:text-white" contenteditable="true">${c.nav_proyectos}</a>
                        <a href="#contacto" id="${id}-nav_contacto" class="text-gray-300 hover:text-white" contenteditable="true">${c.nav_contacto}</a>
                    </div>
                </div>
            </div>
        </nav>
        <header class="hero-section">
            <h1 id="${id}-hero_title" class="text-6xl md:text-8xl font-black uppercase tracking-tighter" contenteditable="true">${c.hero_title}</h1>
            <p id="${id}-hero_subtitle" class="text-xl md:text-2xl text-gray-300 mt-4 max-w-2xl" contenteditable="true">${c.hero_subtitle}</p>
            <p id="${id}-hero_scroll_prompt" class="text-lg text-purple-300 mt-20 animate-pulse" contenteditable="true">${c.hero_scroll_prompt}</p>
        </header>
    `;
}

function renderIdentitySection(section) {
    const c = section.content;
    const id = section.id;
    const spacingClasses = getSpacingClasses(section.spacing);
    return `
        <section id="${id}" class="${spacingClasses} max-w-7xl mx-auto">
            <div class="text-center mb-16">
                <h2 id="${id}-title" class="text-4xl font-bold" contenteditable="true">${c.title}</h2>
                <div id="${id}-subtitle" class="text-lg text-gray-300 mt-2" contenteditable="true">${c.subtitle}</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-${c.gridCols} gap-8 items-container" data-path="${id}-cards">
                ${c.cards.map((card, index) => IdentityCard(id, card, index)).join('')}
            </div>
        </section>
    `;
}

function renderPillarsSection(section) {
    const c = section.content;
    const id = section.id;
    const spacingClasses = getSpacingClasses(section.spacing);
    return `
        <section id="${id}" class="${spacingClasses} max-w-7xl mx-auto">
            <h2 id="${id}-title" class="text-4xl font-bold text-center mb-16" contenteditable="true">${c.title}</h2>
            <div class="grid grid-cols-1 md:grid-cols-${c.gridCols} gap-8 items-container" data-path="${id}-pillars">
                ${c.pillars.map((pillar, index) => Pillar(id, pillar, index)).join('')}
            </div>
        </section>
    `;
}

function renderServicesSection(section) {
    const c = section.content;
    const id = section.id;
    return `
        <section id="${id}" class="py-${section.spacing.pt || 0}">
            <div class="max-w-7xl mx-auto px-${section.spacing.pl || 0}">
                <h2 id="${id}-title" class="text-4xl font-bold mb-6" contenteditable="true">${c.title}</h2>
                <div id="${id}-description" class="text-lg text-gray-300 max-w-3xl mb-12" contenteditable="true">${c.description}</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-${c.gridCols} gap-8 max-w-7xl mx-auto px-${section.spacing.pl || 0} pb-${section.spacing.pb || 0} items-container" data-path="${id}-services">
                ${c.services.map((service, index) => Service(id, service, index)).join('')}
            </div>
        </section>
    `;
}

function renderProjectsSection(section) {
    const c = section.content;
    const id = section.id;
    const spacingClasses = getSpacingClasses(section.spacing);
    return `
        <section id="${id}" class="${spacingClasses} max-w-7xl mx-auto">
            <h2 id="${id}-title" class="text-4xl font-bold text-center mb-16" contenteditable="true">${c.title}</h2>
            <div class="grid grid-cols-1 md:grid-cols-${c.gridCols} gap-8 items-container" data-path="${id}-projects">
                ${c.projects.map((project, index) => Project(id, project, index)).join('')}
            </div>
        </section>
    `;
}

function renderTeamSection(section) {
    const c = section.content;
    const id = section.id;
    const spacingClasses = getSpacingClasses(section.spacing);
    return `
        <section id="${id}" class="${spacingClasses} max-w-5xl mx-auto text-center">
            <h2 id="${id}-title" class="text-4xl font-bold text-center mb-16" contenteditable="true">${c.title}</h2>
            <div class="grid grid-cols-1 md:grid-cols-${c.gridCols} gap-8 items-container" data-path="${id}-members">
                ${c.members.map((member, index) => TeamMember(id, member, index)).join('')}
            </div>
        </section>
    `;
}

function renderFooterSection(section) {
    const c = section.content;
    const id = section.id;
    const spacingClasses = getSpacingClasses(section.spacing);
    return `
        <footer id="${id}" class="${spacingClasses} glass-card border-t border-purple-300/10">
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                    <h3 id="${id}-brandName" class="text-2xl font-bold text-cyan-300" contenteditable="true">${c.brandName}</h3>
                    <p id="${id}-rut" class="text-gray-400" contenteditable="true">RUT: ${c.rut}</p>
                     <p id="${id}-legalRep" class="text-gray-400 mt-4" contenteditable="true">Representante Legal: ${c.legalRep}</p>
                     <p id="${id}-legalRepRut" class="text-gray-400" contenteditable="true">RUT: ${c.legalRepRut}</p>
                </div>
                <div>
                    <h4 id="${id}-contactTitle" class="text-lg font-bold text-purple-300 mb-2" contenteditable="true">${c.contactTitle}</h4>
                    <p id="${id}-email" class="text-gray-300" contenteditable="true">${c.email}</p>
                    <p id="${id}-phone" class="text-gray-300" contenteditable="true">${c.phone}</p>
                </div>
                <div>
                    <h4 id="${id}-locationTitle" class="text-lg font-bold text-purple-300 mb-2" contenteditable="true">${c.locationTitle}</h4>
                    <p id="${id}-address" class="text-gray-300" contenteditable="true">${c.address}</p>
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

    container.innerHTML = `
        ${heroHtml}
        <main class="scroll-content">
            ${mainContentHtml}
        </main>
    `;
}
