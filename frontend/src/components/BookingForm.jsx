import { useState, useMemo } from 'react'
import { createBooking } from '../services/bookingService'
import { useAuth } from '../hooks/useAuth'

export function BookingForm({ room, hotel, onBookingSuccess, onCancel }) {
  const { user, isCustomer } = useAuth()
  const todayStr = new Date().toISOString().split('T')[0]
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState(todayStr)
  const [checkOut, setCheckOut] = useState(tomorrowStr)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successBooking, setSuccessBooking] = useState(null)

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = (end - start) / (1000 * 60 * 60 * 24)
    return diff > 0 ? Math.round(diff) : 0
  }, [checkIn, checkOut])

  const basePrice = useMemo(() => {
    if (nights <= 0 || !room?.price) return 0
    return nights * Number(room.price)
  }, [nights, room])

  const taxesAndFees = useMemo(() => {
    return Math.round(basePrice * 0.12) // 12% GST/Luxury hospitality tax
  }, [basePrice])

  const totalPrice = useMemo(() => {
    return basePrice + taxesAndFees
  }, [basePrice, taxesAndFees])

  const handleQuickDuration = (extraDays) => {
    const start = new Date(checkIn || todayStr)
    const end = new Date(start.getTime() + extraDays * 86400000)
    setCheckOut(end.toISOString().split('T')[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!user) {
      setError('Please log in with a customer account to make a reservation.')
      return
    }

    if (!isCustomer) {
      setError('Hotel administrators cannot make customer bookings. Please log in as a customer.')
      return
    }

    if (nights <= 0) {
      setError('Check-out date must be after check-in date.')
      return
    }

    setLoading(true)
    try {
      const res = await createBooking({
        roomId: room.id,
        checkIn,
        checkOut
      })
      setSuccessBooking(res)
      if (onBookingSuccess) onBookingSuccess(res)
    } catch (err) {
      setError(err.message || 'Failed to complete reservation.')
    } finally {
      setLoading(false)
    }
  }

  if (successBooking) {
    return (
      <div className="card booking-success-card">
        <div className="success-icon-wrapper">
          <span className="success-icon">🎉</span>
        </div>
        <h3>Booking Confirmed!</h3>
        <p className="success-sub">
          Your room has been locked and confirmed with GrandStay.
        </p>

        <div className="booking-summary-box">
          <div className="summary-row">
            <span>🔖 Reference ID:</span>
            <strong>#{successBooking.id}</strong>
          </div>
          <div className="summary-row">
            <span>🏨 Hotel:</span>
            <strong>{successBooking.hotelName || hotel?.name}</strong>
          </div>
          <div className="summary-row">
            <span>🛏️ Room:</span>
            <strong>Room #{successBooking.roomNumber} ({successBooking.roomType})</strong>
          </div>
          <div className="summary-row">
            <span>📅 Check-In Date:</span>
            <strong>{successBooking.checkIn}</strong>
          </div>
          <div className="summary-row">
            <span>📅 Check-Out Date:</span>
            <strong>{successBooking.checkOut}</strong>
          </div>
          <div className="summary-row">
            <span>🟢 Status:</span>
            <span className="badge badge-success">BOOKED & CONFIRMED</span>
          </div>
        </div>

        <p className="notice-text">
          💡 You can view, track, or cancel this reservation anytime from your <strong>My Bookings</strong> tab.
        </p>

        <div className="form-actions-center">
          <button
            className="btn btn-primary"
            onClick={() => { window.location.hash = '#/my-bookings' }}
          >
            📋 View in My Bookings
          </button>
          {onCancel && (
            <button className="btn btn-outline" onClick={onCancel}>
              Close
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="card booking-form-card">
      <div className="booking-form-header">
        <div className="flex items-center gap-2">
          <span className="booking-form-tag">✨ Instant Reservation</span>
        </div>
        <h3>Confirm Your Stay</h3>
        <p className="subtitle">
          {hotel?.name ? `🏨 ${hotel.name} • ` : ''}Room #{room.roomNumber} ({room.roomType})
        </p>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          <span>⚠️ {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="checkIn">📅 Check-In Date</label>
          <input
            id="checkIn"
            type="date"
            min={todayStr}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="checkOut">📅 Check-Out Date</label>
          <input
            id="checkOut"
            type="date"
            min={checkIn || todayStr}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            className="input-field"
          />
        </div>

        {/* Quick Duration Buttons */}
        <div className="quick-duration-strip">
          <span className="quick-label">⚡ Quick Select:</span>
          <button type="button" className="btn-chip" onClick={() => handleQuickDuration(1)}>1 Night</button>
          <button type="button" className="btn-chip" onClick={() => handleQuickDuration(2)}>2 Nights</button>
          <button type="button" className="btn-chip" onClick={() => handleQuickDuration(3)}>3 Nights</button>
          <button type="button" className="btn-chip" onClick={() => handleQuickDuration(5)}>5 Nights</button>
        </div>

        {/* Price Breakdown */}
        <div className="price-breakdown">
          <div className="price-row">
            <span>Rate per Night</span>
            <span>₹{Number(room.price).toLocaleString()}</span>
          </div>
          <div className="price-row">
            <span>Stay Duration</span>
            <span>{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
          </div>
          <div className="price-row">
            <span>Base Room Charge</span>
            <span>₹{basePrice.toLocaleString()}</span>
          </div>
          <div className="price-row text-muted text-sm">
            <span>Estimated Taxes & GST (12%)</span>
            <span>₹{taxesAndFees.toLocaleString()}</span>
          </div>
          <hr className="divider" />
          <div className="price-row total-row">
            <strong>Estimated Total Amount</strong>
            <strong>₹{totalPrice.toLocaleString()}</strong>
          </div>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || nights <= 0}
          >
            {loading ? 'Confirming with Hotel...' : `✨ Book Now (₹${totalPrice.toLocaleString()})`}
          </button>
        </div>
      </form>
    </div>
  )
}
