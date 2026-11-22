import crypto from "crypto";
import fs from "fs";
import path from "path";
import type {
  ContentScope,
  PortalDatabase,
  PortalPost,
  PortalResource,
  PortalUser,
  PortalVideo,
  SafePortalUser,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "portal-db.json");

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, keyHex] = storedHash.split(":");
  if (!salt || !keyHex) return false;
  const derivedBuffer = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(keyHex, "hex");
  if (derivedBuffer.length !== keyBuffer.length) return false;
  return crypto.timingSafeEqual(derivedBuffer, keyBuffer);
}

export function toSafeUser(user: PortalUser): SafePortalUser {
  const { passwordHash: _ignored, ...safe } = user;
  void _ignored;
  return safe;
}

function createSeedDatabase(): PortalDatabase {
  const now = new Date().toISOString();

  const superAdminId = "usr_super_admin";
  const electricaAdminId = "usr_electrica_admin";

  return {
    users: [
      {
        id: superAdminId,
        name: "Administrador General FI-ULA",
        email: "admin@ingeula.org",
        passwordHash: hashPassword("IngeULA2026!"),
        role: "super_admin",
        assignedScopes: [
          "facultad",
          "sistemas",
          "electrica",
          "civil",
          "mecanica",
          "quimica",
        ],
        active: true,
        createdAt: now,
      },
      {
        id: electricaAdminId,
        name: "Coordinación Escuela de Eléctrica",
        email: "electrica@ingeula.org",
        passwordHash: hashPassword("Electrica2026!"),
        role: "school_admin",
        assignedScopes: ["electrica"],
        active: true,
        createdAt: now,
      },
    ],
    posts: [
      {
        id: "post_electrica_welcome",
        scope: "electrica",
        title:
          "Apertura del espacio digital de la Escuela de Ingeniería Eléctrica",
        category: "Aviso",
        summary:
          "Ya está disponible la sección oficial de Ingeniería Eléctrica en IngeULA para publicar cronogramas, guías de laboratorio, flujogramas de prelaciones y material audiovisual.",
        content:
          "La Escuela de Ingeniería Eléctrica de la Facultad de Ingeniería ULA habilita este canal para centralizar información académica relevante para estudiantes de Ciclo Básico y Ciclo Profesional.\n\nA través de esta sección podrás consultar avisos de inscripción, horarios de prácticas de potencia y electrónica, flujogramas actualizados y seminarios técnicos grabados.",
        coverImage: "/images/school-electrica.jpg",
        pinned: true,
        authorId: electricaAdminId,
        authorName: "Coordinación Escuela de Eléctrica",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "post_facultad_portal",
        scope: "facultad",
        title: "Habilitado el Panel de Administración por Escuelas en IngeULA",
        category: "Noticia",
        summary:
          "Cada escuela de la Facultad de Ingeniería cuenta ahora con gestión independiente de publicaciones, documentos PDF, flujogramas y videos institucionales.",
        content:
          "Como parte de la modernización digital de la Facultad de Ingeniería en el Núcleo La Hechicera, cada escuela podrá designar coordinadores para publicar avisos oficiales, recursos descargables y material de apoyo audiovisual directamente en su sección.",
        coverImage: "/images/hero-campus.jpg",
        pinned: true,
        authorId: superAdminId,
        authorName: "Administrador General FI-ULA",
        createdAt: now,
        updatedAt: now,
      },
    ],
    resources: [
      {
        id: "res_electrica_flujograma_demo",
        scope: "electrica",
        title: "Guía de Referencia — Estructura de la Escuela de Eléctrica",
        resourceType: "Flujograma",
        description:
          "Recurso de ejemplo publicado desde el panel administrador. Puedes subir aquí el flujograma oficial de prelaciones (PDF o imagen) y actualizarlo cuando lo necesites.",
        fileUrl: "/images/school-electrica.jpg",
        fileName: "referencia-escuela-electrica.jpg",
        fileMime: "image/jpeg",
        isExternal: false,
        authorId: electricaAdminId,
        authorName: "Coordinación Escuela de Eléctrica",
        createdAt: now,
      },
    ],
    videos: [
      {
        id: "vid_electrica_intro",
        scope: "electrica",
        title: "Introducción a Sistemas de Potencia y Automatización",
        category: "Clase Magistral",
        description:
          "Video de ejemplo incrustado desde YouTube. Desde el panel administrador puedes agregar charlas, recorridos de laboratorios o clases abiertas pegando cualquier enlace de YouTube.",
        youtubeUrl: "https://www.youtube.com/watch?v=mc979OhitAg",
        youtubeId: "mc979OhitAg",
        authorId: electricaAdminId,
        authorName: "Coordinación Escuela de Eléctrica",
        createdAt: now,
      },
    ],
  };
}

function ensureDatabaseFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const seed = createSeedDatabase();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), "utf-8");
  }
}

export function readDatabase(): PortalDatabase {
  ensureDatabaseFile();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as PortalDatabase;
}

export function writeDatabase(db: PortalDatabase): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function getScopeContent(scope: ContentScope): {
  posts: PortalPost[];
  resources: PortalResource[];
  videos: PortalVideo[];
} {
  const db = readDatabase();
  const posts = db.posts
    .filter((p) => p.scope === scope)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const resources = db.resources
    .filter((r) => r.scope === scope)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const videos = db.videos
    .filter((v) => v.scope === scope)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return { posts, resources, videos };
}
