import { forwardRef } from "react"
import { Link, useLocation } from "react-router-dom"
import PropTypes from "prop-types"

const Sidebar = forwardRef((props, ref) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <aside ref={ref} className="fixed top-0 left-0 h-screen bg-[#0f172a] w-20 z-40 flex flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-10">
        <Link to="/" className="flex items-center justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            CWT
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full">
        <ul className="flex flex-col items-center space-y-4">
          {/* Dashboard */}
          <li className="w-full">
            <Link
              to="/admin"
              className={`flex justify-center py-3 relative ${
                isActive("/admin")
                  ? "text-indigo-500 after:absolute after:left-0 after:top-1/4 after:h-1/2 after:w-1 after:bg-indigo-500 after:rounded-r-md"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </Link>
          </li>

          {/* Blogs */}
          <li className="w-full">
            <Link
              to="/admin/products"
              className={`flex justify-center py-3 relative ${
                isActive("/admin/products")
                  ? "text-indigo-500 after:absolute after:left-0 after:top-1/4 after:h-1/2 after:w-1 after:bg-indigo-500 after:rounded-r-md"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </Link>
          </li>

          {/* Categories */}
          <li className="w-full">
            <Link
              to="/admin/categories"
              className={`flex justify-center py-3 relative ${
                isActive("/admin/categories")
                  ? "text-indigo-500 after:absolute after:left-0 after:top-1/4 after:h-1/2 after:w-1 after:bg-indigo-500 after:rounded-r-md"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </Link>
          </li>

          {/* Users */}
          <li className="w-full">
            <Link
              to="/admin/customers"
              className={`flex justify-center py-3 relative ${
                isActive("/admin/customers")
                  ? "text-indigo-500 after:absolute after:left-0 after:top-1/4 after:h-1/2 after:w-1 after:bg-indigo-500 after:rounded-r-md"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </Link>
          </li>

          {/* Reports */}
          <li className="w-full">
            <Link
              to="/admin/report-items"
              className={`flex justify-center py-3 relative ${
                isActive("/admin/report-items")
                  ? "text-indigo-500 after:absolute after:left-0 after:top-1/4 after:h-1/2 after:w-1 after:bg-indigo-500 after:rounded-r-md"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </Link>
          </li>

          {/* Settings */}
          <li className="w-full">
            <Link
              to="/admin/settings"
              className={`flex justify-center py-3 relative ${
                isActive("/admin/settings")
                  ? "text-indigo-500 after:absolute after:left-0 after:top-1/4 after:h-1/2 after:w-1 after:bg-indigo-500 after:rounded-r-md"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
})

Sidebar.propTypes = {
  openSidebarToggle: PropTypes.bool.isRequired,
  OpenSidebar: PropTypes.func.isRequired,
}

Sidebar.displayName = "Sidebar"

export default Sidebar
