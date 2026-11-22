export interface HeroSlide {
  id: string;
  shortLabel: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

export interface FacultyMetric {
  value: string;
  label: string;
  detail: string;
}

export interface NewsItem {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  href: string;
  featured?: boolean;
}

export interface AcademicStage {
  step: string;
  title: string;
  description: string;
  highlights: string[];
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "facultad-ingenieria",
    shortLabel: "Facultad",
    badge: "Universidad de Los Andes · Facultad de Ingeniería",
    title: "Ingeniería con rigor científico que transforma el futuro desde los Andes.",
    description:
      "Bienvenido a IngeULA, el portal de la Facultad de Ingeniería de la ULA. Explora información general de la facultad y descubre nuestras cinco escuelas: Sistemas, Eléctrica, Civil, Mecánica y Química.",
    image: "/images/hero-campus.jpg",
    imageAlt:
      "Campus de la Facultad de Ingeniería ULA rodeado de los Andes en Mérida",
    primaryCta: {
      label: "Conoce nuestras escuelas",
      href: "/#escuelas",
    },
    secondaryCta: {
      label: "Sobre la Facultad",
      href: "/#modelo-academico",
    },
  },
  {
    id: "cinco-escuelas",
    shortLabel: "Escuelas",
    badge: "Oferta Académica · 5 Escuelas de Pregrado",
    title: "Cinco escuelas con identidad propia, pensum riguroso y proyección global.",
    description:
      "Cada escuela de ingeniería cuenta con su propio espacio dedicado en IngeULA para centralizar áreas de especialización, departamentos, laboratorios y futuros recursos estudiantiles.",
    image: "/images/school-sistemas.jpg",
    imageAlt:
      "Estudiantes de Ingeniería ULA colaborando en laboratorio de computación y sistemas",
    primaryCta: {
      label: "Explorar directorio de escuelas",
      href: "/escuelas",
    },
    secondaryCta: {
      label: "Ver Ingeniería de Sistemas",
      href: "/escuelas/sistemas",
    },
  },
  {
    id: "investigacion-laboratorios",
    shortLabel: "Investigación",
    badge: "Laboratorios y Ciencia Aplicada · FI-ULA",
    title: "Formación experimental, innovación tecnológica y vinculación con la industria.",
    description:
      "Desde sistemas eléctricos de potencia y estructuras sismorresistentes hasta procesos químicos y manufactura avanzada, nuestra formación combina teoría y laboratorio.",
    image: "/images/school-electrica.jpg",
    imageAlt:
      "Laboratorio de Ingeniería Eléctrica y automatización en la Facultad de Ingeniería ULA",
    primaryCta: {
      label: "Investigación y laboratorios",
      href: "/#investigacion",
    },
    secondaryCta: {
      label: "Ver Ingeniería Eléctrica",
      href: "/escuelas/electrica",
    },
  },
  {
    id: "actualidad-hechicera",
    shortLabel: "Actualidad",
    badge: "Núcleo La Hechicera · Mérida, Venezuela",
    title: "Actualidad académica, anuncios y vida universitaria en la Facultad.",
    description:
      "Mantente al día con los anuncios institucionales, actividades académicas, eventos de escuelas y novedades de la comunidad de ingeniería ulandina.",
    image: "/images/school-civil.jpg",
    imageAlt:
      "Estudiantes y proyectos en la Facultad de Ingeniería ULA, Núcleo La Hechicera",
    primaryCta: {
      label: "Ver actualidad y novedades",
      href: "/#noticias",
    },
    secondaryCta: {
      label: "Conoce La Hechicera",
      href: "/#campus",
    },
  },
];

export const FACULTY_METRICS: FacultyMetric[] = [
  {
    value: "5",
    label: "Escuelas de Ingeniería",
    detail: "Sistemas, Eléctrica, Civil, Mecánica y Química",
  },
  {
    value: "1936",
    label: "Tradición Académica",
    detail: "Más de ocho décadas formando talento en los Andes",
  },
  {
    value: "La Hechicera",
    label: "Núcleo Universitario",
    detail: "Campus de ciencia, ingeniería y laboratorios en Mérida",
  },
  {
    value: "100%",
    label: "Rigor Científico",
    detail: "Pregrado, posgrado, investigación y extensión",
  },
];

export const ACADEMIC_STAGES: AcademicStage[] = [
  {
    step: "01",
    title: "Ciclo Básico de Ingeniería",
    description:
      "Los primeros semestres construyen una base rigurosa y compartida en cálculo, álgebra lineal, física, química, programación y expresión gráfica.",
    highlights: [
      "Pensamiento analítico y modelado matemático",
      "Laboratorios fundamentales de física y química",
      "Integración multidisciplinaria desde el primer día",
    ],
  },
  {
    step: "02",
    title: "Formación Profesional por Escuela",
    description:
      "Cada estudiante profundiza en las disciplinas, laboratorios especializados y metodologías de diseño propias de su escuela de ingeniería.",
    highlights: [
      "Asignaturas troncales y electivas técnicas",
      "Prácticas experimentales y simulación avanzada",
      "Acompañamiento docente en departamentos especializados",
    ],
  },
  {
    step: "03",
    title: "Investigación, Pasantías y Proyecto de Grado",
    description:
      "Culminación académica conectada con retos reales de la industria, infraestructura regional, desarrollo tecnológico y grupos de investigación ULA.",
    highlights: [
      "Pasantías profesionales e inserción temprana",
      "Proyectos de grado de impacto científico y social",
      "Continuidad hacia maestrías y doctorados",
    ],
  },
];

export const RESEARCH_PILLARS = [
  {
    tag: "Investigación",
    title: "Laboratorios y Centros de Conocimiento",
    description:
      "Espacios dedicados a la experimentación en potencia eléctrica, estructuras, termofluidos, procesos químicos, computación y control automático.",
    metric: "Docencia + Ciencia Aplicada",
  },
  {
    tag: "Vinculación",
    title: "Conexión con Industria y Territorio",
    description:
      "Asesoría técnica, ensayos especializados y alianzas orientadas a resolver desafíos energéticos, urbanos, productivos y digitales en Venezuela y el mundo.",
    metric: "Impacto Regional y Global",
  },
  {
    tag: "Comunidad",
    title: "Red Global de Egresados IngeULA",
    description:
      "Nuestros ingenieros lideran proyectos en tecnología, energía, infraestructura e investigación en universidades y empresas de los cinco continentes.",
    metric: "Orgullo Ulandino",
  },
];

export const FACULTY_NEWS: NewsItem[] = [
  {
    id: "nuevo-portal-ingeula",
    category: "Institucional",
    date: "Actualidad Facultad",
    title: "Lanzamiento de la nueva arquitectura digital del Portal IngeULA",
    excerpt:
      "Un espacio centralizado diseñado para conectar la información general de la Facultad de Ingeniería con las cinco escuelas académicas del Núcleo La Hechicera.",
    image: "/images/hero-campus.jpg",
    href: "/escuelas",
    featured: true,
  },
  {
    id: "escuelas-espacios-dedicados",
    category: "Escuelas",
    date: "Desarrollo Académico",
    title: "Cada escuela contará con su propio hub de pensum, laboratorios y recursos",
    excerpt:
      "Sistemas, Eléctrica, Civil, Mecánica y Química disponen desde hoy de rutas dedicadas preparadas para escalar con documentación y proyectos.",
    image: "/images/school-sistemas.jpg",
    href: "/escuelas/sistemas",
  },
  {
    id: "excelencia-laboratorios",
    category: "Investigación",
    date: "La Hechicera",
    title: "Ingeniería aplicada desde los Andes: formación experimental y rigor científico",
    excerpt:
      "Explora las áreas de especialización, departamentos y oportunidades que distinguen a los programas de pregrado de la Facultad de Ingeniería ULA.",
    image: "/images/school-quimica.jpg",
    href: "/escuelas/quimica",
  },
];
