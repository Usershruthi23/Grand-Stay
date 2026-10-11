import { useEffect, useState, useMemo } from 'react'
import { getMyBookings, cancelBooking } from '../services/bookingService'
import { useAuth } from '../hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import { ErrorMessage } from '../components/ErrorMessage'

export function MyBookingsPage({ onNavigate }) {
  const { user, isAuthenticated, isCustomer } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [notification, setNotification] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const fetchBookings = () => {
    setLoading(true)
    setError('')
    getMyBookings()
      .then(setBookings)
      .catch((err) => setError(err.message || 'Failed to fetch your bookings.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (isAuthenticated && isCustomer) {
      fetchBookings()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, isCustomer])

  const handleCancel = async (bookingId) => {
    if (!window.confirm(`Are you sure you want to cancel booking #${bookingId}? This action cannot be undone.`)) {
      return
    }

    setActionLoadingId(bookingId)
    setNotification('')
    try {
      await cancelBooking(bookingId)
      setNotification(`Reservation #${bookingId} was successfully cancelled.`)
      fetchBookings()
    } catch (err) {
      alert(`Could not cancel reservation: ${err.message}`)
    } finally {
      setActionLoadingId(null)
    }
  }

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'ALL') return bookings
    return bookings.filter((b) => b.status === statusFilter)
  }, [bookings, statusFilter])

  if (!isAuthenticated) {
    return (
      <div className="container page-container text-center">
        <div className="card max-w-md mx-auto p-8">
          <span className="auth-icon">🔐</span>
          <h2>Sign In to View Reservations</h2>
          <p className="mb-6">Please log in to your customer account to manage your stays.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('#/login')}>
            Sign In Now
          </button>
        </div>
      </div>
    )
  }

  if (!isCustomer) {
    return (
      <div className="container page-container text-center">
        <div className="card max-w-md mx-auto p-8">
          <span className="auth-icon">🛡️</span>
          <h2>Hotel Administrator Account</h2>
          <p className="mb-6">
            You are logged in as a Hotel Admin. To manage your hotel's guest arrivals and room inventory, visit the Admin Dashboard.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('#/admin')}>
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'BOOKED':
        return { cls: 'badge-info', label: '🔵 Booked (Upcoming)' }
      case 'CHECKED_IN':
        return { cls: 'badge-warning', label: '🟡 Currently Checked-In' }
      case 'CHECKED_OUT':
        return { cls: 'badge-success', label: '🟢 Stay Completed' }
      case 'CANCELLED':
        return { cls: 'badge-danger', label: '🔴 Cancelled' }
      default:
        return { cls: 'badge-secondary', label: status }
    }
  }

  return (
    <div className="container page-container">
      <div className="page-header">
        <div>
          <span className="section-eyebrow">📋 RESERVATION MANAGEMENT</span>
          <h2>My Bookings & Stays</h2>
          <p>Logged in as: <strong>{user?.name}</strong> (<code>{user?.email}</code>)</p>
        </div>

        <button className="btn btn-outline" onClick={fetchBookings} disabled={loading}>
          🔄 Refresh Stays
        </button>
      </div>

      {notification && (
        <div className="success-banner" role="alert">
          ✅ {notification}
          <button className="banner-close" onClick={() => setNotification('')}>×</button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="location-filter-strip">
        <button
          className={`filter-pill-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setStatusFilter('ALL')}
        >
          All Stays ({bookings.length})
        </button>
        <button
          className={`filter-pill-tab ${statusFilter === 'BOOKED' ? 'active' : ''}`}
          onClick={() => setStatusFilter('BOOKED')}
        >
          🔵 Upcoming ({bookings.filter(b => b.status === 'BOOKED').length})
        </button>
        <button
          className={`filter-pill-tab ${statusFilter === 'CHECKED_IN' ? 'active' : ''}`}
          onClick={() => setStatusFilter('CHECKED_IN')}
        >
          🟡 Active ({bookings.filter(b => b.status === 'CHECKED_IN').length})
        </button>
        <button
          className={`filter-pill-tab ${statusFilter === 'CHECKED_OUT' ? 'active' : ''}`}
          onClick={() => setStatusFilter('CHECKED_OUT')}
        >
          🟢 Completed ({bookings.filter(b => b.status === 'CHECKED_OUT').length})
        </button>
      </div>

      {loading && <LoadingState message="Fetching your reservations..." />}
      {error && <ErrorMessage message={error} onRetry={fetchBookings} />}

      {!loading && !error && filteredBookings.length === 0 && (
        <div className="empty-state card">
          <span className="empty-icon">🧳</span>
          <h3>No Bookings Found</h3>
          <p>
            {statusFilter === 'ALL'
              ? "You haven't reserved any hotel stays yet. Explore our luxury destinations!"
              : `No stays currently matching the filter '${statusFilter}'.`}
          </p>
          <button className="btn btn-primary mt-4" onClick={() => onNavigate('#/hotels')}>
            Explore Hotels & Book ➔
          </button>
        </div>
      )}

      <div className="bookings-list">
        {filteredBookings.map((b) => {
          const badge = getStatusBadge(b.status)
          return (
            <article key={b.id} className="booking-card">
              <div className="booking-card-main">
                <div className="booking-card-title-row">
                  <div>
                    <span className="booking-ref">🔖 Booking Ref #{b.id}</span>
                    <h3 className="booking-hotel">🏨 {b.hotelName}</h3>
                  </div>
                  <span className={`badge ${badge.cls}`}>{badge.label}</span>
                </div>

                <div className="booking-details-grid">
                  <div className="detail-cell">
                    <span className="cell-label">Room Identifier</span>
                    <span className="cell-val">🛏️ Room #{b.roomNumber} ({b.roomType})</span>
                  </div>
                  <div className="detail-cell">
                    <span className="cell-label">Check-In Date</span>
                    <span className="cell-val">📅 {b.checkIn}</span>
                  </div>
                  <div className="detail-cell">
                    <span className="cell-label">Check-Out Date</span>
                    <span className="cell-val">📅 {b.checkOut}</span>
                  </div>
                  <div className="detail-cell">
                    <span className="cell-label">Nightly Rate</span>
                    <span className="cell-val">₹{Number(b.price).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="booking-card-actions">
                {b.status === 'BOOKED' ? (
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={actionLoadingId === b.id}
                    onClick={() => handleCancel(b.id)}
                  >
                    {actionLoadingId === b.id ? 'Cancelling...' : '❌ Cancel Reservation'}
                  </button>
                ) : (
                  <span className="status-note">
                    {b.status === 'CANCELLED' && 'Reservation cancelled'}
                    {b.status === 'CHECKED_IN' && 'Checked-in on premises'}
                    {b.status === 'CHECKED_OUT' && 'Completed stay'}
                  </span>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
