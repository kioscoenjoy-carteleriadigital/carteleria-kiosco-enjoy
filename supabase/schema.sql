-- ================================================================
-- KIOSCO ENJOY — Cartelería Digital — Schema Supabase
-- Ejecutar en: Supabase → SQL Editor → New query
-- ================================================================

-- ---------------------------------------------------------------
-- TABLA: slides (playlist del display)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS slides (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN (
                  'image', 'video', 'youtube',
                  'placa_oferta', 'placa_combo', 'placa_cartelera',
                  'placa_horario', 'placa_producto'
                )),
  media_url     TEXT,
  youtube_id    TEXT,
  placa_config  JSONB DEFAULT '{}',
  duration      INTEGER DEFAULT 10,
  position      INTEGER DEFAULT 0,
  active        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------
-- TABLA: products (para PlacaProducto y PlacaCartelera)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  price       INTEGER NOT NULL,
  image_url   TEXT,
  category    TEXT,
  flag        TEXT,
  active      BOOLEAN DEFAULT true,
  position    INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------
-- TABLA: schedules (horario de atención)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schedules (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label       TEXT NOT NULL,
  days        INTEGER[] NOT NULL,
  open_time   TIME NOT NULL,
  close_time  TIME NOT NULL,
  position    INTEGER DEFAULT 0
);

-- ---------------------------------------------------------------
-- TABLA: settings (configuración global)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Valores iniciales
INSERT INTO settings (key, value) VALUES
  ('transition', 'fade'),
  ('default_duration', '10'),
  ('playlist_mode', 'loop'),
  ('store_name', 'Kiosco Enjoy')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------
ALTER TABLE slides    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings  ENABLE ROW LEVEL SECURITY;

-- Lectura pública (display sin login)
CREATE POLICY "public_read_slides"    ON slides    FOR SELECT TO anon USING (active = true);
CREATE POLICY "public_read_products"  ON products  FOR SELECT TO anon USING (active = true);
CREATE POLICY "public_read_schedules" ON schedules FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_settings"  ON settings  FOR SELECT TO anon USING (true);

-- Escritura solo usuario autenticado (admin)
CREATE POLICY "auth_all_slides"    ON slides    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_products"  ON products  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_schedules" ON schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_settings"  ON settings  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------------------------------------------------------------
-- STORAGE BUCKET: media
-- Crear manualmente en Supabase → Storage → New bucket
-- Nombre: media | Public: ON
-- ---------------------------------------------------------------
-- Luego agregar esta policy desde Storage → Policies:
-- Nombre: "public_read_media"
-- Allowed operation: SELECT
-- Target roles: anon, authenticated
-- Policy: true
--
-- Y para uploads (solo auth):
-- Nombre: "auth_upload_media"
-- Allowed operation: INSERT, UPDATE, DELETE
-- Target roles: authenticated
-- Policy: true

-- ---------------------------------------------------------------
-- DATOS DE EJEMPLO (opcional, para probar)
-- ---------------------------------------------------------------
INSERT INTO schedules (label, days, open_time, close_time, position) VALUES
  ('Lunes a Viernes', ARRAY[1,2,3,4,5], '08:00', '22:00', 0),
  ('Sábados',         ARRAY[6],         '09:00', '21:00', 1),
  ('Domingos',        ARRAY[0],         '10:00', '20:00', 2)
ON CONFLICT DO NOTHING;

INSERT INTO slides (title, type, placa_config, duration, position, active) VALUES
  (
    'Horario de Atención',
    'placa_horario',
    '{"title": "Horario de Atención"}',
    12,
    0,
    true
  ),
  (
    'Oferta Coca-Cola',
    'placa_oferta',
    '{"eyebrow": "OFERTA", "title": "Coca-Cola 2.25L", "subtitle": "Retornable · bien fría 🧊", "price": "2150", "unit": "2.25L"}',
    10,
    1,
    true
  )
ON CONFLICT DO NOTHING;
