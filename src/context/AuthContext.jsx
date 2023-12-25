import { jwtDecode } from 'jwt-decode'
import { createContext, useContext, useEffect, useState } from 'react'
import { verifyJwt } from '../api/axiosApi'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // Globally exported variables
  const [auth, setAuth] = useState(null)
  const [isVerifying, setIsVerifying] = useState(true)

  // On component mount verify the jwt token, if not valid then redirect to login page
  useEffect(() => {
    const verifyLogin = async () => {
      const jwtToken = JSON.parse(localStorage.getItem('token')) || null
      if (!jwtToken) {
        setAuth(null)
        setIsVerifying(false)
      } else {
        try {
          await verifyJwt(jwtToken)
          const decoded = jwtDecode(jwtToken)
          const name = decoded?.name || 'No Name'
          const roles = decoded?.authorities || []
          setAuth({ jwtToken, roles, isAuth: true, name })
        } catch (err) {
          localStorage.removeItem('token')
          setAuth(null)
        } finally {
          setIsVerifying(false)
        }
      }
    }
    verifyLogin()
  }, [])

  // Function to login user and save data to local storage
  const login = (data) => {
    const jwtToken = data?.jwt
    const decoded = jwtToken ? jwtDecode(jwtToken) : undefined
    const name = decoded?.name || 'No Name'
    const roles = decoded?.authorities || []
    setAuth({ jwtToken, roles, authenticated: true, name })
    localStorage.setItem('token', JSON.stringify(jwtToken))
  }

  // Function to logout user and save data to local storage
  const logout = () => {
    setAuth({})
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, isVerifying }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
