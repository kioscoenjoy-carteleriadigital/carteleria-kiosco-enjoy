import { useState } from 'react'
import { supabase } from '../lib/supabase'
import logoR from '../design-system/assets/logo-red.svg'
import './admin.css'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) setError('Email o contraseña incorrectos.')
  }

  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <img src={logoR} alt="Kiosco Enjoy" className="adm-login-logo" />
        <h1 className="adm-login-title">Cartelería Digital</h1>
        {error && <div className="adm-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="adm-field">
            <label className="adm-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="adm-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@kioscoenjoy.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="adm-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
