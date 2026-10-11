import { useAuth } from '../hooks/useAuth'

export function Navbar({ currentPath, onNavigate }) {
  const { user, isAuthenticated, isCustomer, isAdmin, logout } = useAuth()

  const handleNav = (path) => (e) => {
    e.preventDefault()
    onNavigate(path)
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    await logout()
    onNavigate('#/')
  }

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <a href="#/" onClick={handleNav('#/')} className="brand-logo">
          <span className="brand-icon">🏨</span>
          <span className="brand-title">GrandStay</span>
        </a>

        <nav className="nav-links">
          <a
            href="#/"
            onClick={handleNav('#/')}
            className={`nav-link ${currentPath === '#/' || currentPath === '' ? 'active' : ''}`}
          >
            🏠 Home
          </a>
          <a
            href="#/hotels"
            onClick={handleNav('#/hotels')}
            className={`nav-link ${currentPath.startsWith('#/hotel') && !currentPath.startsWith('#/hotels/') ? 'active' : ''}`}
          >
            🏨 Hotels
          </a>

          {isAuthenticated && isCustomer && (
            <a
              href="#/my-bookings"
              onClick={handleNav('#/my-bookings')}
              className={`nav-link ${currentPath === '#/my-bookings' ? 'active' : ''}`}
            >
              🧳 My Bookings
            </a>
          )}

          {isAuthenticated && isAdmin && (
            <a
              href="#/admin"
              onClick={handleNav('#/admin')}
              className={`nav-link admin-nav-link ${currentPath.startsWith('#/admin') ? 'active' : ''}`}
            >
              🛡️ Admin Dashboard
            </a>
          )}
        </nav>

        <div className="nav-auth-actions">
          {isAuthenticated ? (
            <div className="user-profile-badge">
              <div className="user-info">
                <span className="user-name">👤 {user.name}</span>
                <span className={`user-role ${isAdmin ? 'role-admin' : 'role-customer'}`}>
                  {isAdmin ? '🛡️ Hotel Admin' : '⭐ Customer'}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                🚪 Log Out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <a href="#/login" onClick={handleNav('#/login')} className="btn btn-ghost btn-sm">
                🔑 Sign In
              </a>
              <a href="#/register" onClick={handleNav('#/register')} className="btn btn-primary btn-sm">
                ✨ Register
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
