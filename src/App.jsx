import { Routes, Route, Navigate } from 'react-router-dom'
import Display from './display/Display'
import Admin from './admin/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Display />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
