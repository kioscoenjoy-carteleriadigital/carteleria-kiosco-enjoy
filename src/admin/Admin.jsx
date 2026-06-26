import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { List, Package, Settings, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Login from './Login'
import PlaylistPage from './pages/PlaylistPage'
import ProductsPage from './pages/ProductsPage'
import SettingsPage from './pages/SettingsPage'
import logoW from '../design-system/assets/logo-white.svg'
import './admin.css'

const NAV = [
  { to: '/admin/playlist', icon: List,     label: 'Playlist' },
  { to: '/admin/products', icon: Package,  label: 'Productos' },
  { to: '/admin/settings', icon: Settings, label: 'Config' },
]

export default function Admin() {
  const [session, setSession] = useState(undefined) // undefined = cargando
  const [toast, setToast]     = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  async function logout() {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  if (session === undefined) return (
    <div style={{ minHeight: '100vh', background: 'var(--black-c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20 }}>
        Cargando…
      </div>
    </div>
  )

  if (!session) return <Login />

  return (
    <div className="adm-root">
      {/* Header */}
      <header className="adm-header">
        <img src={logoW} alt="Kiosco Enjoy" />
        <span className="adm-header-title">Cartelería Digital</span>
        <span className="adm-header-user">{session.user?.email}</span>
        <button className="adm-header-logout" onClick={logout} title="Cerrar sesión">
          <LogOut size={14} style={{ verticalAlign: 'middle' }} />
        </button>
      </header>

      {/* Nav (bottom mobile, below header desktop) */}
      <nav className="adm-nav">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `adm-nav-btn${isActive ? ' active' : ''}`}>
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Content */}
      <main className="adm-main">
        <Routes>
          <Route index element={<Navigate to="playlist" replace />} />
          <Route path="playlist" element={<PlaylistPage toast={showToast} />} />
          <Route path="products" element={<ProductsPage toast={showToast} />} />
          <Route path="settings" element={<SettingsPage toast={showToast} />} />
        </Routes>
      </main>

      {toast && <div className="adm-toast">{toast}</div>}
    </div>
  )
}
