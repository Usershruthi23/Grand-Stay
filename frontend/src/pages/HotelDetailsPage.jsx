import { useEffect, useState } from 'react'
import { getHotel } from '../services/hotelService'
import { getRoomsByHotel } from '../services/roomService'
import { RoomCard } from '../components/RoomCard'
import { BookingForm } from '../components/BookingForm'
import { LoadingState } from '../components/LoadingState'
import { ErrorMessage } from '../components/ErrorMessage'
import { useAuth } from '../hooks/useAuth'

export function HotelDetailsPage({ hotelId, onNavigate }) {
  const { isAuthenticated, isCustomer } = useAuth()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRoom, setSelectedRoom] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [hotelData, roomsData] = await Promise.all([
        getHotel(hotelId),
        getRoomsByHotel(hotelId)
      ])
      setHotel(hotelData)
      setRooms(roomsData)
    } catch (err) {
      setError(err.message || 'Failed to fetch hotel details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hotelId) {
      loadData()
    }
  }, [hotelId])

  const handleRoomSelect = (room) => {
    if (!isAuthenticated) {
      alert('Please sign in or register as a customer to book a room.')
      onNavigate('#/login')
      return
    }
    if (!isCustomer) {
      alert('You are currently signed in as a Hotel Admin. Only Customer accounts can make room reservations.')
      return
    }
    setSelectedRoom(room)
  }

  if (loading) {
    return (
      <div className="container page-container">
        <LoadingState message="Loading hotel details and live room rates..." />
      </div>
    )
  }

  if (error || !hotel) {
    return (
      <div className="container page-container">
        <ErrorMessage message={error || 'Hotel not found'} onRetry={loadData} />
        <button className="btn btn-secondary mt-4" onClick={() => onNavigate('#/hotels')}>
          ← Back to All Hotels
        </button>
      </div>
    )
  }

  return (
    <div className="hotel-details-page container">
      <div className="breadcrumb-nav">
        <button className="btn btn-ghost" onClick={() => onNavigate('#/hotels')}>
          ← Back to All Hotels
        </button>
      </div>

      {/* Hotel Hero Banner */}
      <section className="hotel-detail-hero">
        <div className="hotel-detail-image-box">
          {hotel.imageUrl ? (
            <img src={hotel.imageUrl} alt={hotel.name} className="hotel-detail-img" />
          ) : (
            <div className="hotel-detail-fallback">🏨 GrandStay</div>
          )}
        </div>

        <div className="hotel-detail-info">
          <div className="hotel-rating-row">
            <span className="hotel-detail-tag">✨ Verified Luxury Property</span>
            <span className="hotel-rating-pill">⭐ 4.9 (180+ Reviews)</span>
          </div>

          <h1 className="hotel-detail-name">{hotel.name}</h1>
          <p className="hotel-detail-location">📍 {hotel.location}, India</p>

          <p className="hotel-detail-desc">
            {hotel.description || 'Welcome to GrandStay. Enjoy our best-in-class suites and services.'}
          </p>

          <div className="hotel-highlights-grid">
            <div className="highlight-pill">🏊 Swimming Pool</div>
            <div className="highlight-pill">🍳 Free Gourmet Breakfast</div>
            <div className="highlight-pill">📶 5G High-Speed Wi-Fi</div>
            <div className="highlight-pill">🚗 Free Valet Parking</div>
            <div className="highlight-pill">🧖 Spa & Wellness</div>
            <div className="highlight-pill">🍸 Sky Lounge & Bar</div>
          </div>

          <div className="hotel-detail-meta">
            {hotel.contact && (
              <div className="meta-item">
                <span className="meta-label">Direct Concierge</span>
                <span className="meta-val">📞 {hotel.contact}</span>
              </div>
            )}
            <div className="meta-item">
              <span className="meta-label">Room Inventory</span>
              <span className="meta-val">🛏️ {rooms.length} Suites</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Check-In / Out</span>
              <span className="meta-val">🕒 12:00 PM / 11:00 AM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Booking Form */}
      {selectedRoom && (
        <section className="booking-modal-overlay" onClick={() => setSelectedRoom(null)}>
          <div className="booking-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <BookingForm
              room={selectedRoom}
              hotel={hotel}
              onCancel={() => setSelectedRoom(null)}
              onBookingSuccess={() => {
                // Refresh room availability if status changes
                loadData()
              }}
            />
          </div>
        </section>
      )}

      {/* Room Selection Grid */}
      <section className="hotel-rooms-section">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">🛏️ AVAILABLE ACCOMMODATIONS</span>
            <h2>Select Your Preferred Room</h2>
            <p>Pick from our available single rooms, double rooms, deluxe suites, or executive penthouses.</p>
          </div>
          <span className="badge badge-info">{rooms.filter(r => r.status === 'AVAILABLE').length} Available Now</span>
        </div>

        {rooms.length === 0 ? (
          <div className="empty-state card">
            <p>No rooms are currently listed for this hotel property.</p>
          </div>
        ) : (
          <div className="room-grid">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onBook={handleRoomSelect}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
