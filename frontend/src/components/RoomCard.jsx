export function RoomCard({ room, onBook }) {
  const isAvailable = room.status === 'AVAILABLE'

  const getRoomImage = (type) => {
    switch (type) {
      case 'SINGLE':
        return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'
      case 'DOUBLE':
        return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
      case 'DELUXE':
        return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
      case 'SUITE':
        return 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
      default:
        return 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
    }
  }

  const getBadgeConfig = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return { cls: 'badge-success', label: '🟢 Available' }
      case 'OCCUPIED':
        return { cls: 'badge-warning', label: '🟡 Occupied' }
      case 'MAINTENANCE':
        return { cls: 'badge-danger', label: '🔴 Under Maintenance' }
      default:
        return { cls: 'badge-secondary', label: status }
    }
  }

  const badge = getBadgeConfig(room.status)
  const roomImage = getRoomImage(room.roomType)

  return (
    <article className="room-card">
      <div className="room-card-media">
        <img src={roomImage} alt={`${room.roomType} room`} className="room-img" loading="lazy" />
        <span className={`room-status-badge ${badge.cls}`}>{badge.label}</span>
        <span className="room-type-overlay">🛏️ {room.roomType} CLASS</span>
      </div>

      <div className="room-card-content">
        <div className="room-header">
          <div>
            <h4 className="room-number">Room #{room.roomNumber}</h4>
            <p className="room-bed-type">
              {room.roomType === 'SINGLE' && 'Single Cozy Bed • 220 sq ft'}
              {room.roomType === 'DOUBLE' && 'King Size Double Bed • 350 sq ft'}
              {room.roomType === 'DELUXE' && 'King Bed + Balcony View • 480 sq ft'}
              {room.roomType === 'SUITE' && 'Executive Master Suite + Living Lounge • 650 sq ft'}
            </p>
          </div>
        </div>

        <div className="room-specs">
          <div className="spec-item">
            <span className="spec-label">Capacity</span>
            <span className="spec-val">👥 Up to {room.capacity} Guests</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Nightly Rate</span>
            <span className="spec-price">₹{Number(room.price).toLocaleString()} <small>/ night</small></span>
          </div>
        </div>

        <div className="room-features-list">
          <span>📶 High-Speed 5G Wi-Fi</span>
          <span>🚿 Rain Shower & Premium Toiletries</span>
          <span>☕ In-Room Tea & Coffee Maker</span>
          <span>🛡️ Free Cancellation up to 24 hrs</span>
        </div>

        <button
          className="btn btn-primary btn-block"
          disabled={!isAvailable}
          onClick={() => onBook(room)}
        >
          {isAvailable ? '✨ Reserve Room #' + room.roomNumber : '🔒 Currently Unavailable'}
        </button>
      </div>
    </article>
  )
}
