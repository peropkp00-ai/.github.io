// page-schema.js
// Define la estructura y el contenido de toda la página.

export const pageSchema = [
    {
        type: 'hero',
        id: 'hero',
        content: {
            // --- Animación ---
            mouseFollowSpeed: 0.1,
            mouseWaveRadius: 2.5,
            mouseWaveIntensity: 3.0,
            colorA: '#a87eff',
            colorB: '#00ffff',
            colorInteraction: '#ffffff',

            // --- Contenido ---
            nav_brand: "NAVALEK",
            hero_title: "NAVALEK SPA",
            hero_subtitle: "Proyectos de Ingeniería y Asesorías Eléctricas",
            hero_scroll_prompt: "Haz scroll para activar el flujo",
            nav_quienes_somos: "Quiénes Somos",
            nav_servicios: "Servicios",
            nav_proyectos: "Proyectos",
            nav_contacto: "Contacto",
        }
    },
    {
        type: 'identity',
        id: 'quienes-somos',
        content: {
            title: "Nuestra Identidad",
            subtitle: "Los principios que guían nuestro trabajo.",
            cards: [
                { id: "identidad_card1", title: "Quiénes Somos", text: "Somos un equipo de profesionales con una gran pasión por el servicio a nuestros clientes y a nuestra empresa. Contamos con una amplia experiencia en proyectos de ingeniería y asesorías eléctricas, estamos comprometidos con entregar un servicio de calidad y personalizado." },
                { id: "identidad_card2", title: "Nuestra Misión", text: "Ofrecer soluciones integrales de ingeniería eléctrica y asesorías, que permitan a nuestros clientes mejorar la seguridad en sus instalaciones y con eficiencia energética, optimizando sus costos y contribuir al desarrollo sostenible." },
                { id: "identidad_card3", title: "Nuestra Visión", text: "Ser el socio estratégico asegurando un correcto funcionamiento de las instalaciones eléctricas en el tiempo, generando que las empresas y organizaciones alcancen objetivos de sostenibilidad y eficiencia energética a través de soluciones innovadoras en proyecto de ingeniería y asesorías eléctricas, que contribuyan a un futuro más sostenible para todos." }
            ]
        }
    },
    {
        type: 'pillars',
        id: 'pilares',
        content: {
            title: "Nuestros Pilares",
            pillars: [
                { id: "pilares_card1", title: "Excelencia Técnica", text: "La empresa tiene un equipo de profesionales altamente calificados y experimentados en las áreas de electricidad e ingeniería de proyectos. Nuestros profesionales están comprometidos con las ultimas tendencias tecnológicas y normativas." },
                { id: "pilares_card2", title: "Calidad y Seguridad", text: "Nuestra empresa garantiza la calidad y seguridad de sus trabajos y servicios, cumpliendo con todas las normas y regulaciones aplicables en Chile. Esto incluye el uso de materiales y equipos de ultima tecnología, aplicando procedimientos de trabajos seguros y capacitando a nuestro personal de trabajo." },
                { id: "pilares_card3", title: "Innovación y Desarrollo", text: "La empresa debe estar en constante innovación, desarrollando nuevas tecnologías y soluciones para sus clientes. Esto le permitirá mantenerse a la vanguardia del mercado y ofrecer servicios más competitivos." },
                { id: "pilares_card4", title: "Responsabilidad Social", text: "Somos responsable socialmente, contribuyendo al desarrollo sostenible en la comunidad... entregando herramientas a estudiantes en practicas y a nuevos profesionales... respetando el medio ambiente y reciclando todos nuestros desechos." }
            ]
        }
    },
    {
        type: 'services',
        id: 'servicios',
        content: {
            title: "Servicios",
            description: "Un portafolio completo para cubrir todas sus necesidades en ingeniería eléctrica, desde la inspección hasta la mantención.",
            services: [
                { id: "servicios_card1", title: "Inspecciones Técnicas", items: ["Inspección visual de instalaciones eléctricas", "Termografías", "Mediciones", "Elaboración de informes con evidencia fotográfica"] },
                { id: "servicios_card2", title: "Desarrollo de Proyectos", items: ["Creación de planimetría eléctrica", "Especificaciones técnicas", "Memorias de cálculos", "Trabajo personalizado"] },
                { id: "servicios_card3", title: "Asesorías de Proyectos", items: ["Auditoría", "Planificación de proyecto", "Diseño de planimetría", "Inspecciones técnicas (Normativas)", "Estudio de corto circuito"] },
                { id: "servicios_card4", title: "Sistema de Puesta a Tierra", items: ["Estudio de resistividad de suelo", "Mediciones de sistema", "Proyección de sistema", "Fabricación de puesta a tierra"] },
                { id: "servicios_card5", title: "Ejecución de Proyectos", items: ["Fabricación de tableros eléctrico", "Instalación de luminarias", "Empalmes eléctricos", "Canalización subterráneo", "Declaraciones ante la SEC"] },
                { id: "servicios_card6", title: "Charlas y Capacitación", items: ["Charlas técnicas", "Capacitación en planimetría", "Capacitación en sistema eléctrico", "Capacitación en tablero eléctrico y empalmes"] },
                { id: "servicios_card7", title: "Sistema CCTV", items: ["Instalación", "Mantención", "Reparación de cámara de seguridad"] },
                { id: "servicios_card8", title: "Mantenciones", items: ["Mantenciones de tablero eléctrico", "Mantenciones de central de telefonía", "Mantenciones de motores eléctrico", "Mantenciones generales eléctricas"] },
                { id: "servicios_card9", title: "Seguridad Electrónica", items: ["Sistema de control de acceso", "Detección de intruso", "Sistema de detección de incendio", "Actualización de sistemas de alarmas"] }
            ]
        }
    },
    {
        type: 'projects',
        id: 'proyectos',
        content: {
            title: "Proyectos Ejecutados",
            projects: [
                { id: "proyectos_card1", clientLogo: "https://storage.googleapis.com/org-gco-files-1/10700305_1720542387_corp-santiago.png", clientName: "Corporación Santiago", title: "Alumbrado Público", description: "Asesoría y elaboración de planimetría eléctrica, levantamiento, estudio y proyección de iluminarias publicas. Simulación con DIALUX. Cliente: Corporación para el Desarrollo de Santiago." },
                { id: "proyectos_card2", clientLogo: "https://storage.googleapis.com/org-gco-files-1/10700305_1720542387_interconnect.png", clientName: "Interconnect", title: "Aumento de Potencia", description: "Levantamiento y dibujo de planimetría (obra civil y eléctrica), estudio de resistividad de suelo y asesoría para aumento de potencia de empalme MT. Cliente: Empresa INTERCONNECT, Estación Valparaíso." },
                { id: "proyectos_card3", clientLogo: "https://storage.googleapis.com/org-gco-files-1/10700305_1720542387_ciquimet.png", clientName: "Ciquimet", title: "Resistividad de Suelo", description: "Estudio para proyección de nueva malla a tierra, construcción y mejoramiento de suelo. Inspección técnica de instalación existente y diseño de planimetría. Cliente: CIQUIMET, Calama." },
                { id: "proyectos_card4", clientLogo: "https://storage.googleapis.com/org-gco-files-1/10700305_1720542387_besalco.png", clientName: "Besalco", title: "Inspección y Normalización", description: "Inspección técnica de tableros eléctricos. Revisión e inspección de puesta a tierra. Cliente: BESALCO MINERÍA, Minera Centinela, Sierra Gorda." },
                { id: "proyectos_card5", clientLogo: "https://storage.googleapis.com/org-gco-files-1/10700305_1720542387_tcc.png", clientName: "TCC", title: "Cursos de Capacitación", description: "Elaboración de cursos de AutoCAD, Ms Office, Impresión 3D, Preparación Licencia SEC Clase B, y Elaboración de Proyecto antes la SEC. Clientes: TECHNOLOGY COLLEGE CHILE y MEKOTEK." }
            ]
        }
    },
    {
        type: 'team',
        id: 'equipo',
        content: {
            title: "Conoce a Nuestro Equipo",
            members: [
                { id: "equipo_miembro1", photo: "https://placehold.co/200x200/0d1a3f/a87eff?text=P.A.", name: "Patricia Aros", role: "Gerenta General" },
                { id: "equipo_miembro2", photo: "https://placehold.co/200x200/0d1a3f/a87eff?text=P.N.", name: "Pablo Navarro", role: "Encargado de Proyecto" },
                { id: "equipo_miembro3", photo: "https://placehold.co/200x200/0d1a3f/a87eff?text=D.C.", name: "Dario Carvajal", role: "Ingeniero Proyectista" }
            ]
        }
    },
    {
        type: 'footer',
        id: 'contacto',
        content: {
            brandName: "NAVALEK SPA",
            rut: "77.555.114-3",
            legalRep: "Patricia Aros O.",
            legalRepRut: "16.820.694-1",
            contactTitle: "Contacto",
            email: "Contactonavalek@gmail.com",
            phone: "+56956202155",
            locationTitle: "Ubicación",
            address: "Av. Libertad #269, of 904, Viña del Mar"
        }
    }
];
