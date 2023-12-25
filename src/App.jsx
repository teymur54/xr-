import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoutes from './components/ProtectedRoutes'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MissingPage from './pages/MissingPage'
import Letters from './pages/Letters'
import PostLetter from './pages/PostLetter'

const App = () => {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} duration={'4000'} />
      <Routes>
        <Route element={<Layout />}>
          <Route element={<ProtectedRoutes allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/letters" element={<Letters />} />
            <Route path="/letters/post" element={<PostLetter />} />
          </Route>
          <Route path="*" element={<MissingPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  )
}
export default App
