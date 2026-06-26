import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, key)

// ---- helpers ----

export async function getSlides() {
  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .eq('active', true)
    .order('position')
  if (error) throw error
  return data ?? []
}

export async function getAllSlides() {
  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .order('position')
  if (error) throw error
  return data ?? []
}

export async function upsertSlide(slide) {
  const { data, error } = await supabase
    .from('slides')
    .upsert({ ...slide, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSlide(id) {
  const { error } = await supabase.from('slides').delete().eq('id', id)
  if (error) throw error
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('position')
  if (error) throw error
  return data ?? []
}

export async function upsertProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .upsert(product)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function getSchedules() {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .order('position')
  if (error) throw error
  return data ?? []
}

export async function upsertSchedule(schedule) {
  const { data, error } = await supabase
    .from('schedules')
    .upsert(schedule)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSchedule(id) {
  const { error } = await supabase.from('schedules').delete().eq('id', id)
  if (error) throw error
}

export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*')
  if (error) throw error
  return Object.fromEntries((data ?? []).map(r => [r.key, r.value]))
}

export async function setSetting(key, value) {
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() })
  if (error) throw error
}

export async function uploadMedia(file, folder = 'images') {
  const ext = file.name.split('.').pop()
  const name = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('media').upload(name, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('media').getPublicUrl(name)
  return data.publicUrl
}
