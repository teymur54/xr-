import toast from 'react-hot-toast'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogoutIcon } from '../assets/HeroIcons'
import { useAuth } from '../context/AuthContext'
import { FaHome } from 'react-icons/fa'

const Sidebar = () => {
  const { logout, auth } = useAuth()

  const navigate = useNavigate()

  return (
    <aside className="flex w-40 flex-col bg-darkblue-1000">
      <div onClick={() => navigate('/')} className="flex cursor-pointer flex-col items-center gap-2 py-4">
        <img className="w-12" src="/mia-logo.png" alt="logo" />
        <p className="font-bold text-white">Xüsusi Rabitə Şöbəsi</p>
      </div>

      <nav className="flex w-full flex-col">
        <NavLink end to="/" className={({ isActive }) => (isActive ? 'active-nav-element' : 'nav-element')}>
          <FaHome />
          Əsas səhifə
        </NavLink>
        <NavLink
          end
          to="/letters"
          className={({ isActive }) => (isActive ? 'active-nav-element' : 'nav-element')}
        >
          Məktublar
        </NavLink>
      </nav>

      <div className="mb-2 ml-2 mt-auto text-white">{auth?.name}</div>

      <button
        onClick={() => {
          logout()
          navigate('/login', { replace: true })
          toast.success('İstifadəçi çıxış etdi')
        }}
        className="btn-red h-10 w-full rounded-none"
      >
        <LogoutIcon />
      </button>
    </aside>
  )
}
export default Sidebar
