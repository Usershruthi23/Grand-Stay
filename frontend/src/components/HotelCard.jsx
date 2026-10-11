export function HotelCard({ hotel, onSelect }) {
  // Pre-configured tags/ratings based on hotel name/location to give vibrant real-world feel
  const getCityEmoji = (loc) => {
    switch (loc?.toLowerCase()) {
      case 'goa': return '🏖️'
      case 'mumbai': return '🏙️'
      case 'jaipur': return '🏰'
      case 'bengaluru': return '💼'
      case 'hyderabad': return '🏛️'
      case 'kerala': return '🌴'
      case 'udaipur': return '🏯'
      case 'delhi': return '🕌'
      default: return '📍'
    }
  }

  const getRating = (id) => {
    const ratings = [4.9, 4.8, 4.7, 4.9, 4.8, 4.9]
    return ratings[(id || 1) % ratings.length]
  }

  const getReviewsCount = (id) => {
    const counts = [184, 142, 230, 98, 312, 167]
    return counts[(id || 1) % counts.length]
  }

  const getAmenities = (loc) => {
    switch (loc?.toLowerCase()) {
      case 'goa':
        return ['🏖️ Beachfront', '🏊 Infinity Pool', '🍸 Sunset Bar', '📶 Free Wi-Fi']
      case 'mumbai':
        return ['🌊 Sea View', '🍳 Gourmet Buffet', '🧖 Luxury Spa', '🚗 Valet']
      case 'jaipur':
        return ['👑 Royal Courtyard', '🎭 Cultural Shows', '🍳 Heritage Dining', '❄️ AC']
      case 'kerala':
        return ['🌴 Backwaters', '🧘 Ayurvedic Spa', '🚣 Canoe Rides', '🌿 Organic Farm']
      case 'udaipur':
        return ['🛶 Lake Views', '🕯️ Candlelit Dining', '🏯 Palace Heritage', '🎶 Cultural Evenings']
      case 'delhi':
        return ['🏛️ Heritage View', '🍽️ Fine Dining', '🏋️ Fitness Club', '🚕 Airport Transfer']
      case 'hyderabad':
        return ['🏛️ City Views', '🍛 Hyderabadi Cuisine', '🧖 Royal Spa', '📶 Free Wi-Fi']
      case 'bengaluru':
        return ['🌳 Garden Terrace', '💼 Business Centre', '🏊 Rooftop Pool', '☕ All-Day Café']
      default:
        return ['🏊 Pool & Lounge', '🍳 Breakfast Included', '📶 5G Wi-Fi', '🏋️ Fitness Gym']
    }
  }

  const rating = getRating(hotel.id)
  const reviews = getReviewsCount(hotel.id)
  const amenities = getAmenities(hotel.location)

  return (
    <article className="hotel-card">
      <div className="hotel-card-media">
        {hotel.imageUrl ? (
          <img src={hotel.imageUrl} alt={hotel.name} className="hotel-card-img" loading="lazy" />
        ) : (
          <div className="hotel-card-fallback">
            <span>🏨 GrandStay</span>
          </div>
        )}
        <div className="hotel-card-top-badges">
          <span className="hotel-city-badge">
            {getCityEmoji(hotel.location)} {hotel.location}
          </span>
          <span className="hotel-rating-badge">
            ⭐ {rating} <span className="review-count">({reviews})</span>
          </span>
        </div>
      </div>

      <div className="hotel-card-body">
        <div className="hotel-card-header">
          <h3 className="hotel-title">{hotel.name}</h3>
          <p className="hotel-location">📍 {hotel.location}, India</p>
        </div>

        <p className="hotel-desc">
          {hotel.description || 'Experience world-class luxury, prime hospitality and comfort with GrandStay.'}
        </p>

        <div className="hotel-amenities-pills">
          {amenities.map((item, idx) => (
            <span key={idx} className="amenity-pill">
              {item}
            </span>
          ))}
        </div>

        <div className="hotel-card-footer">
          <div className="hotel-pricing-preview">
            <span className="price-from-label">Nightly Stays From</span>
            <span className="price-highlight">
              ₹1,500 <small>/ night</small>
            </span>
          </div>
          <button className="btn btn-primary" onClick={() => onSelect(hotel.id)}>
            Explore Rooms ➔
          </button>
        </div>
      </div>
    </article>
  )
}
