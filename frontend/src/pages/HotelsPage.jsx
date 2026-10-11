import { useEffect, useState, useMemo } from 'react'
import { getHotels } from '../services/hotelService'
import { HotelCard } from '../components/HotelCard'
import { LoadingState } from '../components/LoadingState'
import { ErrorMessage } from '../components/ErrorMessage'

export function HotelsPage({ onNavigate }) {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterLocation, setFilterLocation] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchHotels = () => {
    setLoading(true)
    setError('')
    getHotels()
      .then(setHotels)
      .catch((err) => setError(err.message || 'Failed to load hotels.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  const locations = useMemo(() => {
    const set = new Set(hotels.map((h) => h.location).filter(Boolean))
    return ['ALL', ...Array.from(set)]
  }, [hotels])

  const getLocationEmoji = (loc) => {
    switch (loc?.toLowerCase()) {
      case 'goa': return '🏖️'
      case 'mumbai': return '🏙️'
      case 'hyderabad': return '🏛️'
      case 'bengaluru': return '💼'
      case 'jaipur': return '🏰'
      case 'kerala': return '🌴'
      case 'udaipur': return '🏯'
      case 'delhi': return '🕌'
      default: return '📍'
    }
  }

  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      const matchLoc = filterLocation === 'ALL' || h.location === filterLocation
      const q = searchQuery.toLowerCase()
      const matchSearch =
        !searchQuery ||
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        (h.description && h.description.toLowerCase().includes(q))
      return matchLoc && matchSearch
    })
  }, [hotels, filterLocation, searchQuery])

  return (
    <div className="container page-container">
      <div className="hotels-page-header">
        <div>
          <span className="section-eyebrow">✨ DESTINATIONS & STAYS</span>
          <h2>Explore All Luxury Hotels</h2>
          <p>Find the perfect accommodation tailored for your vacation, business, or getaway.</p>
        </div>

        <div className="search-box-compact">
          <input
            type="text"
            placeholder="Search hotel or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Location Filter Pills */}
      <div className="location-filter-strip">
        {locations.map((loc) => {
          const count = loc === 'ALL' ? hotels.length : hotels.filter((h) => h.location === loc).length
          return (
            <button
              key={loc}
              className={`filter-pill-tab ${filterLocation === loc ? 'active' : ''}`}
              onClick={() => setFilterLocation(loc)}
            >
              {loc === 'ALL' ? '🌍 All Cities' : `${getLocationEmoji(loc)} ${loc}`}
              <span className="pill-badge">{count}</span>
            </button>
          )
        })}
      </div>

      {loading && <LoadingState message="Loading hotels & verified properties..." />}
      {error && <ErrorMessage message={error} onRetry={fetchHotels} />}

      {!loading && !error && filteredHotels.length === 0 && (
        <div className="empty-state card">
          <span className="empty-icon">🏨</span>
          <h3>No hotels available for this filter</h3>
          <p>Try resetting your city selection or search term.</p>
          <button
            className="btn btn-secondary mt-4"
            onClick={() => { setFilterLocation('ALL'); setSearchQuery('') }}
          >
            Clear Filters
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
    </div>
  )
}
