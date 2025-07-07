import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
  const token = localStorage.getItem('token')
  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch {
    return <Navigate to="/unauthorized" />
  }

  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/unauthorized" />
  }

  return <Outlet />
}


export default AdminRoute
