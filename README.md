# DFOlents

Visor de personajes de **Dungeon Fighter Online** construido con la [Neople Open API](https://www.dfoneople.com/developers/contents/apiDocs). Busca personajes, consulta equipo, buff, avatar, fusions y skills; revisa rankings por fama; compara builds y guarda personajes en la watchlist.

Proyecto hecho por hobby por Eduir "Ruingin" Brazon. **Sin relación laboral con [Neople](https://www.neople.co.kr).**

## Stack

- React + TypeScript + Vite
- React Router
- Oxlint
- pnpm

## Requisitos

- Node.js 20+
- pnpm
- Una API key de la [Neople Open API](https://www.dfoneople.com/developers/contents/apiDocs) (gratuita)

## Configuración

1. Instala dependencias:

   ```bash
   pnpm install
   ```

2. Crea el archivo `.env` a partir de la plantilla y pon tu API key:

   ```bash
   cp .env.example .env
   # edita .env y rellena DFO_API_KEY
   ```

3. Arranca el dev server:

   ```bash
   pnpm dev
   ```

En desarrollo, el proxy de Vite (`/df` → `https://api.dfoneople.com`) inyecta el `apikey` automáticamente, así que no la expongas en el cliente.

## Scripts

| Comando      | Descripción                              |
| ------------ | ---------------------------------------- |
| `pnpm dev`   | Dev server con HMR                       |
| `pnpm build` | Typecheck + build de producción          |
| `pnpm lint`  | Lint con Oxlint                          |
| `pnpm preview` | Previsualiza el build de producción    |

## Deploy (Vercel)

1. Conecta el repo a Vercel (framework: Vite; build: `pnpm build`; output: `dist`).
2. En **Project Settings → Environment Variables** añade `DFO_API_KEY` con tu clave.
3. La ruta `/df/*` se reescribe al serverless `api/df/[...slug].js`, que en producción lee `process.env.DFO_API_KEY` y llama a la API de Neople.

`vercel.json` ya incluye los rewrites, `robots.txt` y el `Cache-Control` para los assets.

## SEO

- `robots.txt` y `sitemap.xml` en `public/`.
- Para regenerar el sitemap tras añadir rutas: `node scripts/build-sitemap.mjs`.
- Actualiza `DFOLENTS_URL` en `scripts/build-sitemap.mjs` y las meta `og:image` de `index.html` con tu dominio real.
