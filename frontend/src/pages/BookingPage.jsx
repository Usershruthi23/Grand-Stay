import { useEffect, useState } from 'react'
import { getRoomById } from '../services/roomService'
import { getHotel } from '../services/hotelService'
import { BookingForm } from '../components/BookingForm'
import { LoadingState } from '../components/LoadingState'
import { ErrorMessage } from '../components/ErrorMessage'

export function BookingPage({ roomId, onNavigate }) {
  const [room, setRoom] = useState(null)
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!roomId) return
    setLoading(true)
    getRoomById(roomId)
      .then((roomData) => {
        setRoom(roomData)
        return getHotel(roomData.hotelId).then(setHotel)
      })
      .catch((err) => setError(err.message || 'Unable to load room details.'))
      .finally(() => setLoading(false))
  }, [roomId])

  if (loading) {
    return (
      <div className="container page-container">
        <LoadingState message="Loading room details..." />
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="container page-container">
        <ErrorMessage message={error || 'Room not found'} />
        <button className="btn btn-secondary mt-4" onClick={() => onNavigate('#/hotels')}>
          ← Browse Hotels
        </button>
      </div>
    )
  }

  return (
    <div className="container page-container max-w-lg">
      <button className="btn btn-ghost mb-4" onClick={() => onNavigate(hotel ? `#/hotel/${hotel.id}` : '#/hotels')}>
        ← Back
      </button>

      <BookingForm
        room={room}
        hotel={hotel}
        onCancel={() => onNavigate(hotel ? `#/hotel/${hotel.id}` : '#/hotels')}
        onBookingSuccess={() => {}}
      />
    </div>
  )
}
