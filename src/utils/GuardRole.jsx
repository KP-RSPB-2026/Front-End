import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RoleGuard({ allowedRole }) {
  const { user } = useAuth()

  if (!user || user.role !== allowedRole) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
