# Kiosco Enjoy — Cartelería Digital

Sistema de cartelería digital propio para Kiosco Enjoy. Reemplaza Yodeck con funcionalidad completa, 100% gratuito.

**Display:** `https://kioscoenjoy-carteleriadigital.github.io/carteleria-kiosco-enjoy/`  
**Admin:** `https://kioscoenjoy-carteleriadigital.github.io/carteleria-kiosco-enjoy/#/admin`

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite |
| Router | React Router v6 (HashRouter) |
| Hosting | GitHub Pages |
| Backend | Supabase (Auth + PostgreSQL + Storage + Realtime) |
| Icons | Lucide React |
| Drag & Drop | @dnd-kit |

## Tipos de slides

| Tipo | Descripción |
|---|---|
| `image` | Imagen estática (JPG, PNG, WebP) |
| `video` | Video propio (MP4) |
| `youtube` | Video de YouTube en vertical |
| `placa_oferta` | Placa roja: producto + precio |
| `placa_combo` | Placa oscura: combo + precio tachado |
| `placa_cartelera` | Lista de precios de la semana |
| `placa_horario` | Horario de atención (automático con reloj) |
| `placa_producto` | Producto desde la base de datos con foto |

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Levantar servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

Requiere archivo `.env.local` con las variables de Supabase (ver `.env.example`).

## Deploy

Automático via GitHub Actions al hacer push a `main`.  
Ver `.github/workflows/deploy.yml`.

Configurar en GitHub → Settings → Secrets → Actions:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Estructura del proyecto

```
src/
├── design-system/     # Tokens CSS, fuentes Exo2, logos
├── lib/               # supabase.js (cliente + helpers), formatPrice.js
├── display/           # Pantalla del kiosco (fullscreen)
│   └── slides/        # Componentes por tipo de slide
└── admin/             # Panel de administración
    ├── components/    # SlideCard, SlideEditor, MediaUploader
    └── pages/         # PlaylistPage, ProductsPage, SettingsPage
```

## Branching

```
main      → producción (auto-deploy)
develop   → integración
feature/* → nuevas funcionalidades
```

## Versiones

| Versión | Descripción |
|---|---|
| v0.1.0 | Display + YouTube + Imágenes + Deploy |
| v0.2.0 | Todas las placas dinámicas |
| v0.3.0 | Panel Admin MVP |
| v1.0.0 | Sistema completo en producción |
