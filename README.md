# Weather Web App

Starter de aplicación del clima construido con **Next.js 16**, **React 19**, **Tailwind CSS v4** y **TanStack Query v5**. Consume la API de [Visual Crossing](https://www.visualcrossing.com/) a través de un Route Handler propio que actúa como proxy seguro.

---

## Stack

| Tecnología | Versión |
|---|---|
| Next.js | 16.x |
| React | 19.x |
| Tailwind CSS | 4.x |
| TanStack Query | 5.x |
| TypeScript | 5.x |
| pnpm | — |

---

## Características

- Condiciones meteorológicas **en tiempo real** para cualquier ciudad o región
- **Últimas 24 horas** — historial por hora
- **Próximas 24 horas** — pronóstico por hora
- Proxy seguro en `/api/weather` — la API key nunca se expone al cliente
- Caché de 5 minutos en el servidor (`revalidate: 300`)
- Interfaz dark mode con Tailwind CSS v4

---

## Requisitos previos

- Node.js 20+
- pnpm
- Cuenta gratuita en [Visual Crossing](https://www.visualcrossing.com/) para obtener una API key

---

## Configuración

1. Clona el repositorio e instala las dependencias:

```bash
git clone <repo-url>
cd weather-wep-app
pnpm install
```

2. Crea el archivo de variables de entorno:

```bash
cp .env.example .env.local
```

3. Añade tus variables en `.env.local`:

```env
# Obligatorio — clave de la API de Visual Crossing
VISUAL_CROSSING_API_KEY=tu_api_key_aqui

# Opcional — ciudad que se carga por defecto
NEXT_PUBLIC_DEFAULT_LOCATION=Manizales,CO
```

---

## Comandos

```bash
pnpm dev      # Servidor de desarrollo en http://localhost:3000
pnpm build    # Build de producción
pnpm start    # Servidor de producción
pnpm lint     # Lint con ESLint
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── api/
│   │   └── weather/
│   │       └── route.ts        # Proxy seguro hacia Visual Crossing
│   ├── globals.css
│   ├── layout.tsx              # Root layout con metadatos y fuentes
│   └── page.tsx
├── components/
│   ├── query-provider.tsx      # TanStack Query provider
│   └── weather-dashboard.tsx   # UI principal
└── lib/
    └── weather.ts              # Tipos e interfaces, función fetchWeather
```

---

## API

### `GET /api/weather?location={location}`

Retorna el estado actual del clima junto con el historial y pronóstico de 24 horas.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `location` | `string` | ✅ | Ciudad, región, país o coordenadas |

**Respuesta exitosa (`200`):**

```json
{
  "location": "Manizales, Caldas, Colombia",
  "timezone": "America/Bogota",
  "fetchedAt": "2026-05-01T12:00:00.000Z",
  "current": { ... },
  "previous24Hours": [ ... ],
  "next24Hours": [ ... ]
}
```

---

## Licencia

MIT
