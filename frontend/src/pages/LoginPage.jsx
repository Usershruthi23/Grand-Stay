import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export function LoginPage({ onNavigate }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password)
      if (user.role === 'HOTEL_ADMIN') {
        onNavigate('#/admin')
      } else {
        onNavigate('#/hotels')
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickFill = (testEmail, testPass) => {
    setEmail(testEmail)
    setPassword(testPass)
  }

  return (
    <div className="container page-container auth-wrapper">
      <div className="card auth-card">
        <div className="auth-header">
          <span className="auth-icon">🔐</span>
          <h2>Sign In to GrandStay</h2>
          <p>Access your hotel reservations or hotel administrator control panel</p>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="loginEmail">📧 Email Address</label>
            <input
              id="loginEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@gmail.com"
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword">🔑 Password</label>
            <input
              id="loginPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Verifying Credentials...' : 'Sign In ➔'}
          </button>
        </form>

        <div className="quick-test-section">
          <p className="quick-test-title">⚡ 1-Click Test Credentials:</p>
          <div className="quick-test-grid">
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => handleQuickFill('customer@gmail.com', 'password123')}
            >
              👤 Customer Account
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => handleQuickFill('admina@gmail.com', 'password123')}
            >
              🏨 Admin Alpha (Paradise, Hyd)
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => handleQuickFill('adminb@gmail.com', 'password123')}
            >
              🏨 Admin Beta (Royal Stay, Hyd)
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => handleQuickFill('adminc@gmail.com', 'password123')}
            >
              🏨 Admin Gamma (Imperial Bay, Mum)
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <a href="#/register" onClick={(e) => { e.preventDefault(); onNavigate('#/register') }}>
              Register as New Customer ➔
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
