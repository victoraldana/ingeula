export type SchoolSlug =
  | "sistemas"
  | "electrica"
  | "civil"
  | "mecanica"
  | "quimica";

export interface SchoolDepartment {
  name: string;
  focus: string;
}

export interface SchoolFutureModule {
  title: string;
  description: string;
  status: "En preparación" | "Próximamente";
}

export interface EngineeringSchool {
  slug: SchoolSlug;
  code: string;
  shortName: string;
  name: string;
  degreeTitle: string;
  duration: string;
  tagline: string;
  summary: string;
  mission: string;
  image: string;
  accentColor: string;
  accentLight: string;
  focusAreas: string[];
  departments: SchoolDepartment[];
  careerPaths: string[];
  futureModules: SchoolFutureModule[];
}

export const ENGINEERING_SCHOOLS: EngineeringSchool[] = [
  {
    slug: "sistemas",
    code: "EIS",
    shortName: "Sistemas",
    name: "Escuela de Ingeniería de Sistemas",
    degreeTitle: "Ingeniero de Sistemas",
    duration: "10 semestres",
    tagline:
      "Computación, investigación de operaciones, automatización y modelado de sistemas complejos.",
    summary:
      "Forma ingenieros capaces de analizar, diseñar y optimizar sistemas tecnológicos, organizacionales e informáticos mediante matemáticas aplicadas, software e inteligencia de datos.",
    mission:
      "Impulsar la excelencia científica y tecnológica en el estudio de sistemas complejos, integrando computación, control automático e investigación de operaciones al servicio del país y del mundo.",
    image: "/images/school-sistemas.jpg",
    accentColor: "#0039A6",
    accentLight: "#EBF2FF",
    focusAreas: [
      "Ingeniería de Software y Computación",
      "Investigación de Operaciones",
      "Sistemas de Control y Automatización",
      "Ciencia de Datos e Inteligencia Artificial",
    ],
    departments: [
      {
        name: "Departamento de Computación",
        focus: "Algoritmos, ingeniería de software, arquitectura y sistemas distribuidos.",
      },
      {
        name: "Departamento de Investigación de Operaciones",
        focus: "Optimización matemática, simulación, analítica y toma de decisiones.",
      },
      {
        name: "Departamento de Sistemas de Control",
        focus: "Modelado dinámico, control moderno, robótica y automatización inteligente.",
      },
    ],
    careerPaths: [
      "Arquitectura y desarrollo de software a gran escala",
      "Ciencia de datos, analítica predictiva e IA",
      "Optimización de cadenas de suministro y operaciones",
      "Automatización industrial y sistemas embebidos",
    ],
    futureModules: [
      {
        title: "Pensum y Malla Curricular Interactiva",
        description: "Mapa de prelaciones, electivas por opción y programas sinópticos descargables.",
        status: "En preparación",
      },
      {
        title: "Laboratorios y Grupos de Investigación",
        description: "Directorio de laboratorios de cómputo, control y centros de investigación.",
        status: "Próximamente",
      },
      {
        title: "Proyectos de Grado y Repositorio",
        description: "Catálogo destacado de tesis, proyectos estudiantiles y vinculación tecnológica.",
        status: "Próximamente",
      },
    ],
  },
  {
    slug: "electrica",
    code: "EIE",
    shortName: "Eléctrica",
    name: "Escuela de Ingeniería Eléctrica",
    degreeTitle: "Ingeniero Electricista",
    duration: "10 semestres",
    tagline:
      "Sistemas de potencia, electrónica, telecomunicaciones y energías renovables.",
    summary:
      "Prepara profesionales con sólida base físico-matemática para diseñar, operar y modernizar redes eléctricas, sistemas electrónicos, comunicaciones y soluciones energéticas sostenibles.",
    mission:
      "Formar ingenieros electricistas líderes en generación, transmisión, electrónica y telecomunicaciones, comprometidos con la innovación energética y el rigor técnico.",
    image: "/images/school-electrica.jpg",
    accentColor: "#0055B8",
    accentLight: "#EAF3FF",
    focusAreas: [
      "Sistemas Eléctricos de Potencia",
      "Electrónica y Circuitos Integrados",
      "Telecomunicaciones y Procesamiento de Señales",
      "Energías Renovables y Eficiencia Energética",
    ],
    departments: [
      {
        name: "Departamento de Potencia",
        focus: "Generación, transmisión, distribución y protección de sistemas eléctricos.",
      },
      {
        name: "Departamento de Electrónica y Comunicaciones",
        focus: "Instrumentación electrónica, sistemas digitales y redes de telecomunicación.",
      },
      {
        name: "Departamento de Circuitos y Medidas",
        focus: "Fundamentos electromagnéticos, metrología eléctrica y máquinas eléctricas.",
      },
    ],
    careerPaths: [
      "Planificación y operación de sistemas de potencia",
      "Diseño de hardware, electrónica de potencia y control",
      "Infraestructura de telecomunicaciones y redes",
      "Proyectos de energía solar, eólica e hidroeléctrica",
    ],
    futureModules: [
      {
        title: "Pensum y Especialidades",
        description: "Detalle de asignaturas troncales, prácticas de laboratorio y áreas electivas.",
        status: "En preparación",
      },
      {
        title: "Laboratorios de Alta Tensión y Electrónica",
        description: "Guías de práctica, equipamiento y normativas de seguridad.",
        status: "Próximamente",
      },
      {
        title: "Boletines y Calendario de Escuela",
        description: "Anuncios académicos, asesorías, inscripciones y horarios.",
        status: "Próximamente",
      },
    ],
  },
  {
    slug: "civil",
    code: "EIC",
    shortName: "Civil",
    name: "Escuela de Ingeniería Civil",
    degreeTitle: "Ingeniero Civil",
    duration: "10 semestres",
    tagline:
      "Estructuras sismorresistentes, hidráulica, vialidad, geotecnia e infraestructura sostenible.",
    summary:
      "Con una de las tradiciones más sólidas de la facultad, forma especialistas en la concepción, cálculo, construcción y gestión de infraestructura segura y resiliente en entornos andinos y urbanos.",
    mission:
      "Desarrollar ingenieros civiles con dominio técnico y responsabilidad social para proyectar obras de infraestructura duraderas, seguras ante amenazas sísmicas e integradas al medio ambiente.",
    image: "/images/school-civil.jpg",
    accentColor: "#1D4ED8",
    accentLight: "#EEF2FF",
    focusAreas: [
      "Ingeniería Estructural y Sismorresistente",
      "Hidráulica y Recursos Hídricos",
      "Vías de Comunicación y Transporte",
      "Geotecnia y Mecánica de Suelos",
    ],
    departments: [
      {
        name: "Departamento de Estructuras",
        focus: "Análisis estructural, concreto armado, acero y diseño sismorresistente.",
      },
      {
        name: "Departamento de Hidráulica y Sanitaria",
        focus: "Hidrología, obras hidráulicas, acueductos e ingeniería ambiental.",
      },
      {
        name: "Departamento de Vías y Geotecnia",
        focus: "Diseño vial, pavimentos, fundaciones y estabilidad de taludes.",
      },
    ],
    careerPaths: [
      "Diseño y cálculo de edificaciones y puentes",
      "Gestión de obras hidráulicas y sanitarias",
      "Planificación vial, movilidad y geotecnia",
      "Gerencia y supervisión de proyectos de construcción",
    ],
    futureModules: [
      {
        title: "Plan de Estudios y Normativas",
        description: "Malla curricular, prelaciones y biblioteca de normas estructurales y viales.",
        status: "En preparación",
      },
      {
        title: "Laboratorios de Materiales, Suelos e Hidráulica",
        description: "Servicios técnicos, ensayos y vinculación con investigación aplicada.",
        status: "Próximamente",
      },
      {
        title: "Pasantías y Proyectos Comunitarios",
        description: "Oportunidades de prácticas profesionales e iniciativas de impacto regional.",
        status: "Próximamente",
      },
    ],
  },
  {
    slug: "mecanica",
    code: "EIM",
    shortName: "Mecánica",
    name: "Escuela de Ingeniería Mecánica",
    degreeTitle: "Ingeniero Mecánico",
    duration: "10 semestres",
    tagline:
      "Diseño de máquinas, termofluidos, manufactura avanzada y ciencia de materiales.",
    summary:
      "Capacita ingenieros para diseñar, simular, fabricar y mantener sistemas mecánicos, energéticos e industriales de alta precisión, combinando teoría rigurosa con experimentación.",
    mission:
      "Formar profesionales versátiles en mecánica aplicada, energía y manufactura capaces de liderar procesos industriales y soluciones de ingeniería de clase mundial.",
    image: "/images/school-mecanica.jpg",
    accentColor: "#0F4C81",
    accentLight: "#E8F1F8",
    focusAreas: [
      "Diseño Mecánico y Elementos de Máquinas",
      "Ciencias Térmicas y Mecánica de Fluidos",
      "Procesos de Manufactura y Materiales",
      "Mantenimiento Industrial y Robótica Mecánica",
    ],
    departments: [
      {
        name: "Departamento de Tecnología y Diseño",
        focus: "Diseño asistido por computador (CAD/CAE), cinemática y manufactura.",
      },
      {
        name: "Departamento de Ciencias Térmicas",
        focus: "Termodinámica, transferencia de calor, turbomáquinas y energía.",
      },
      {
        name: "Departamento de Mecánica Aplicada",
        focus: "Mecánica de sólidos, vibraciones, metalurgia y ensayos de materiales.",
      },
    ],
    careerPaths: [
      "Diseño de maquinaria, equipos y componentes mecánicos",
      "Ingeniería energética, climatización y turbomaquinaria",
      "Manufactura avanzada, metalmecánica y control de calidad",
      "Gestión de activos y confiabilidad industrial",
    ],
    futureModules: [
      {
        title: "Pensum y Talleres de Manufactura",
        description: "Estructura curricular, talleres prácticos y programas de asignaturas.",
        status: "En preparación",
      },
      {
        title: "Laboratorios de Termofluidos y Materiales",
        description: "Fichas técnicas de laboratorios y proyectos experimentales.",
        status: "Próximamente",
      },
      {
        title: "Vinculación Industrial y Egresados",
        description: "Red de colaboración con la industria y mentoría profesional.",
        status: "Próximamente",
      },
    ],
  },
  {
    slug: "quimica",
    code: "EIQ",
    shortName: "Química",
    name: "Escuela de Ingeniería Química",
    degreeTitle: "Ingeniero Químico",
    duration: "10 semestres",
    tagline:
      "Procesos industriales, fenómenos de transporte, sostenibilidad y transformación de materiales.",
    summary:
      "Forma ingenieros dedicados a diseñar, escalar y optimizar procesos físicos, químicos y biológicos que transforman materias primas en productos de alto valor con criterios de seguridad y sostenibilidad.",
    mission:
      "Educar ingenieros químicos innovadores en ingeniería de procesos, energía, alimentos, materiales y ambiente, sustentados en una fuerte cultura de investigación científica.",
    image: "/images/school-quimica.jpg",
    accentColor: "#00629B",
    accentLight: "#E6F4FA",
    focusAreas: [
      "Operaciones Unitarias y Fenómenos de Transporte",
      "Ingeniería de Reacciones y Catálisis",
      "Procesos Petroquímicos, Alimentos y Farmacia",
      "Ingeniería Ambiental y Bioprocesos",
    ],
    departments: [
      {
        name: "Departamento de Operaciones Unitarias",
        focus: "Separación, transferencia de masa y calor, y simulación de plantas.",
      },
      {
        name: "Departamento de Química Industrial y Aplicada",
        focus: "Reactores químicos, formulación, polímeros y procesos sostenibles.",
      },
      {
        name: "Departamento de Ingeniería de Procesos",
        focus: "Diseño de plantas, control de procesos, seguridad industrial y ambiente.",
      },
    ],
    careerPaths: [
      "Diseño y optimización de plantas de procesos químicos",
      "Industria de alimentos, biotecnología y farmacéutica",
      "Energía, petroquímica y nuevos materiales",
      "Tratamiento de aguas, sostenibilidad y control ambiental",
    ],
    futureModules: [
      {
        title: "Pensum y Plantas Piloto",
        description: "Ruta académica completa, electivas técnicas y prácticas de planta piloto.",
        status: "En preparación",
      },
      {
        title: "Laboratorios de Investigación Química",
        description: "Información de grupos como FIRP, catálisis, alimentos y ambiente.",
        status: "Próximamente",
      },
      {
        title: "Eventos, Jornadas y Publicaciones",
        description: "Seminarios técnicos, congresos y producción científica de la escuela.",
        status: "Próximamente",
      },
    ],
  },
];

export function getSchoolBySlug(slug: string): EngineeringSchool | undefined {
  return ENGINEERING_SCHOOLS.find((school) => school.slug === slug);
}
