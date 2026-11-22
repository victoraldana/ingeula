# IngeULA — Portal de la Facultad de Ingeniería ULA

Portal institucional de la **Facultad de Ingeniería de la Universidad de Los Andes (ULA)**, Núcleo Universitario Pedro Rincón Gutiérrez (La Hechicera), Mérida, Venezuela.

## Arquitectura del Proyecto

Construido con **Next.js (App Router)**, **TypeScript** y **Tailwind CSS**, estructurado para escalar con contenido independiente por cada escuela de ingeniería:

- `/` — Landing institucional principal (estilo editorial universitario moderno).
- `/escuelas` — Directorio general de las escuelas de ingeniería.
- `/escuelas/sistemas` — Escuela de Ingeniería de Sistemas.
- `/escuelas/electrica` — Escuela de Ingeniería Eléctrica.
- `/escuelas/civil` — Escuela de Ingeniería Civil.
- `/escuelas/mecanica` — Escuela de Ingeniería Mecánica.
- `/escuelas/quimica` — Escuela de Ingeniería Química.

## Desarrollo Local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts

- `npm run dev` — Inicia el servidor de desarrollo.
- `npm run build` — Genera el build de producción.
- `npm run start` — Inicia el servidor de producción.
