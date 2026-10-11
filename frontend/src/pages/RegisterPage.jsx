import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export function RegisterPage({ onNavigate }) {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await register(name, email, password)
      onNavigate('#/hotels')
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container page-container auth-wrapper">
      <div className="card auth-card">
        <div className="auth-header">
          <span className="auth-icon">✨</span>
          <h2>Create Your Account</h2>
          <p>Join GrandStay to discover and book rooms across premier hotels</p>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="regName">Full Name</label>
            <input
              id="regName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="regEmail">Email Address</label>
            <input
              id="regEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sarah@example.com"
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="regPass">Password (min 6 chars)</label>
            <input
              id="regPass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="regConfirmPass">Confirm Password</label>
            <input
              id="regConfirmPass"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Registering Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <a href="#/login" onClick={(e) => { e.preventDefault(); onNavigate('#/login') }}>
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
