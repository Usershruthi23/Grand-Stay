import { apiRequest } from './apiClient'

export function createBooking({ roomId, checkIn, checkOut }) {
  return apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify({ roomId, checkIn, checkOut })
  })
}

export function getMyBookings() {
  return apiRequest('/bookings/my')
}

export function getBookingById(id) {
  return apiRequest(`/bookings/${id}`)
}

export function cancelBooking(id) {
  return apiRequest(`/bookings/${id}/cancel`, {
    method: 'PUT'
  })
}
