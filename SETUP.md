# Guía de Setup — Cartelería Digital Kiosco Enjoy

## 1. Supabase — Ejecutar el schema

1. Ir a **supabase.com** → proyecto `Kiosco Enjoy - Carteleria Digital`
2. Ir a **SQL Editor** → **New query**
3. Copiar y pegar el contenido de `supabase/schema.sql`
4. Hacer click en **Run**

## 2. Supabase — Crear el bucket de storage

1. Ir a **Storage** → **New bucket**
2. Nombre: `media`
3. Public bucket: **ON** (activado)
4. Guardar
5. Ir a **Storage → Policies** → agregar:
   - Policy para SELECT: roles `anon` y `authenticated` → `true`
   - Policy para INSERT/UPDATE/DELETE: solo `authenticated` → `true`

## 3. Supabase — Crear el usuario admin

1. Ir a **Authentication → Users** → **Add user** → **Create new user**
2. Email: el que vas a usar para entrar al admin
3. Contraseña: la que vas a usar (guardala)
4. Auto Confirm User: **ON**

## 4. GitHub — Configurar Secrets para el deploy

1. Ir al repo en GitHub → **Settings → Secrets and variables → Actions**
2. Agregar dos secrets:
   - `VITE_SUPABASE_URL` → `https://cazvhzbnukwejhmixdja.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` → la publishable key de Supabase

## 5. GitHub — Activar GitHub Pages

1. Ir al repo → **Settings → Pages**
2. Source: **GitHub Actions**
3. Guardar

## 6. Primer deploy

```bash
# En la carpeta del proyecto (ya tiene los archivos)
git init
git add .
git commit -m "feat: initial commit — cartelería digital v0.1.0"
git branch -M main
git remote add origin https://github.com/kioscoenjoy-carteleriadigital/carteleria-kiosco-enjoy.git
git push -u origin main
```

GitHub Actions va a construir y deployar automáticamente (~2 min).

## 7. Configurar la PC del kiosco (all-in-one)

### Orientación vertical
Windows → Configuración → Pantalla → Orientación: **Vertical**

### Chrome en modo kiosco
Crear un acceso directo en el escritorio con este comando:
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=https://kioscoenjoy-carteleriadigital.github.io/carteleria-kiosco-enjoy/ --autoplay-policy=no-user-gesture-required --disable-infobars --no-first-run
```

### Inicio automático con Windows
1. Presionar `Win + R` → escribir `shell:startup`
2. Copiar el acceso directo de Chrome en esa carpeta

## 8. URLs del sistema

| Pantalla | URL |
|---|---|
| Display (kiosco) | `https://kioscoenjoy-carteleriadigital.github.io/carteleria-kiosco-enjoy/` |
| Admin | `https://kioscoenjoy-carteleriadigital.github.io/carteleria-kiosco-enjoy/#/admin` |

El admin funciona desde cualquier celular o computadora con internet.
