import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <div className="flex h-full w-full">
      {/* Sidebar component */}
      <Sidebar />

      {/* Rest of the content. Because of max-height: 100vh; on "body" element, on overflow sidebar stays on its place */}
      <main className="relative flex flex-grow overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
export default Layout
