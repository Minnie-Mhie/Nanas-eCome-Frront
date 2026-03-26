import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'universal-cookie'

const AuthGuard = ({ redirectPath = "/login", children }) => {
  const cookies = new Cookies()
  const isAuth = cookies.get("token")

  if (!isAuth) {
    return <Navigate to={redirectPath} replace={true} />
  }

  return children ? children : <Outlet />
}

export default AuthGuard