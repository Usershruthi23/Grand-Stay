import { useState, useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { AppRoutes } from './routes/AppRoutes'

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/')

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleNavigate = (path) => {
    window.location.hash = path
  }

  return (
    <AuthProvider>
      <div className="app-layout">
        <Navbar currentPath={currentPath} onNavigate={handleNavigate} />
        <main className="main-content">
          <AppRoutes currentPath={currentPath} onNavigate={handleNavigate} />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
