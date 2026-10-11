import { useEffect, useState, useMemo } from 'react'
import { getHotels } from '../services/hotelService'
import { HotelCard } from '../components/HotelCard'
import { LoadingState } from '../components/LoadingState'
import { ErrorMessage } from '../components/ErrorMessage'

const POPULAR_DESTINATIONS = [
  {
    city: 'Goa',
    emoji: '🏖️',
    tagline: 'Sun, Sand & Beachfront Resorts',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80'
  },
  {
    city: 'Mumbai',
    emoji: '🏙️',
    tagline: 'Iconic Skylines & Marine Drive Luxury',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80'
  },
  {
    city: 'Hyderabad',
    emoji: '🏛️',
    tagline: 'Heritage Palaces & Royal Hospitality',
    image: 'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=600&q=80'
  },
  {
    city: 'Bengaluru',
    emoji: '💼',
    tagline: 'Garden City & Modern Tech Sanctuaries',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80'
  },
  {
    city: 'Jaipur',
    emoji: '🏰',
    tagline: 'Regal Courtyards & Rajputana Elegance',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80'
  }
]

export function HomePage({ onNavigate }) {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Search & Filter State
  const [selectedCity, setSelectedCity] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [guestCount, setGuestCount] = useState('2')

  const fetchHotels = () => {
    setLoading(true)
    setError('')
    getHotels()
      .then(setHotels)
      .catch((err) => setError(err.message || 'Unable to connect to backend.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  // Dynamic available cities from hotels list
  const availableCities = useMemo(() => {
    const list = new Set(hotels.map((h) => h.location).filter(Boolean))
    return ['ALL', ...Array.from(list)]
  }, [hotels])

  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      const matchCity = selectedCity === 'ALL' || h.location?.toLowerCase() === selectedCity.toLowerCase()
      const q = searchQuery.toLowerCase()
      const matchQuery =
        !searchQuery ||
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        (h.description && h.description.toLowerCase().includes(q))
      return matchCity && matchQuery
    })
  }, [hotels, selectedCity, searchQuery])

  const handleCityCardClick = (city) => {
    setSelectedCity(city)
    const element = document.getElementById('hotels-list-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-eyebrow">✨ DISCOVER LUXURY WITHOUT COMPROMISE</span>
          <h1 className="hero-title">Experience Stays That Feel Like Home</h1>
          <p className="hero-description">
            Browse handpicked luxury hotels, check live room availability across top cities,
            and enjoy seamless reservations with zero double-booking.
          </p>

          {/* Booking / Search Card */}
          <div className="hero-search-box">
            <div className="search-field-group">
              <label>📍 Destination</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="search-select"
              >
                <option value="ALL">All Cities & Regions</option>
                {availableCities.filter(c => c !== 'ALL').map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="search-field-group">
              <label>🔍 Hotel Keyword</label>
              <input
                type="text"
                placeholder="e.g. Paradise, Bay, Palace"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field"
              />
            </div>

            <div className="search-field-group">
              <label>👥 Guests</label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="search-select"
              >
                <option value="1">1 Adult</option>
                <option value="2">2 Adults</option>
                <option value="3">3 Adults (Deluxe)</option>
                <option value="4">4+ Adults (Suite)</option>
              </select>
            </div>

            <button
              className="btn btn-primary hero-submit-btn"
              onClick={() => {
                const el = document.getElementById('hotels-list-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Explore Hotels ➔
            </button>
          </div>

          {/* Quick Demo Pill */}
          <div className="demo-accounts-pill">
            <span className="pill-title">🔑 Quick Demo Accounts:</span>
            <span>
              Customer: <code>customer@gmail.com</code> | Admin: <code>admina@gmail.com</code> (Pass: <code>password123</code>)
            </span>
          </div>
        </div>
      </section>

      {/* LOCATION-WISE DESTINATION SHOWCASE */}
      <section className="destinations-showcase container">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">🗺️ POPULAR GETAWAYS</span>
            <h2>Explore Hotels by Location</h2>
            <p>Select your favorite destination to view curated luxury accommodations</p>
          </div>
        </div>

        <div className="destination-cards-grid">
          {POPULAR_DESTINATIONS.map((dest) => {
            const count = hotels.filter((h) => h.location?.toLowerCase() === dest.city.toLowerCase()).length
            return (
              <div
                key={dest.city}
                className={`destination-card ${selectedCity === dest.city ? 'active-dest' : ''}`}
                onClick={() => handleCityCardClick(dest.city)}
              >
                <img src={dest.image} alt={dest.city} className="dest-bg-img" loading="lazy" />
                <div className="dest-overlay">
                  <div className="dest-badge">
                    <span>{dest.emoji} {dest.city}</span>
                    <span className="dest-count-tag">{count > 0 ? `${count} Hotels` : 'Available'}</span>
                  </div>
                  <p className="dest-tagline">{dest.tagline}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* VALUE PROPOSITION STRIP */}
      <section className="features-strip">
        <div className="feature-item">
          <span className="feature-icon">🛡️</span>
          <div>
            <h4>Zero Overbooking Engine</h4>
            <p>Database-level date validation prevents overlapping reservations.</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">⚡</span>
          <div>
            <h4>Instant Room Confirmation</h4>
            <p>Real-time room availability and immediate status tracking.</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🛎️</span>
          <div>
            <h4>On-Site Admin Management</h4>
            <p>Check-in & check-out workflows with automated room status updates.</p>
          </div>
        </div>
      </section>

      {/* ALL HOTELS LISTING */}
      <section id="hotels-list-section" className="hotels-section container">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">🏨 LUXURY PORTFOLIO</span>
            <h2>Available Hotels & Resorts</h2>
            <p>Showing premium stays matching your selection</p>
          </div>

          {/* City Filter Pills */}
          <div className="city-filter-pills">
            <button
              className={`pill-btn ${selectedCity === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedCity('ALL')}
            >
              🌍 All Cities ({hotels.length})
            </button>
            {availableCities.filter(c => c !== 'ALL').map((city) => {
              const count = hotels.filter((h) => h.location === city).length
              return (
                <button
                  key={city}
                  className={`pill-btn ${selectedCity === city ? 'active' : ''}`}
                  onClick={() => setSelectedCity(city)}
                >
                  📍 {city} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {loading && <LoadingState message="Fetching premier hotels & resorts..." />}
        {error && <ErrorMessage message={error} onRetry={fetchHotels} />}

        {!loading && !error && filteredHotels.length === 0 && (
          <div className="empty-state card">
            <span className="empty-icon">🏨</span>
            <h3>No hotels found for {selectedCity === 'ALL' ? 'your search' : selectedCity}</h3>
            <p>Try clearing your filter or selecting another city to see available options.</p>
            <button className="btn btn-secondary mt-4" onClick={() => { setSelectedCity('ALL'); setSearchQuery('') }}>
              Reset Filters
            </button>
          </div>
        )}

        <div className="hotel-grid">
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onSelect={(id) => onNavigate(`#/hotel/${id}`)}
            />
          ))}
        </div>
      </section>

      {/* STATS HIGHLIGHT BANNER */}
      <section className="stats-banner-container container">
        <div className="stats-banner card">
          <div className="stat-box">
            <span className="stat-val">6+</span>
            <span className="stat-lbl">Top Indian Cities</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">100%</span>
            <span className="stat-lbl">Real-Time Inventory</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">4.9★</span>
            <span className="stat-lbl">Average Guest Rating</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">24/7</span>
            <span className="stat-lbl">Front Desk Assistance</span>
          </div>
        </div>
      </section>
    </div>
  )
}
