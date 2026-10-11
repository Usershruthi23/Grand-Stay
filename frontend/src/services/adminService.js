import { apiRequest } from './apiClient'

export function getAdminHotel() {
  return apiRequest('/admin/hotel')
}

export function getAdminDashboard() {
  return apiRequest('/admin/dashboard')
}

export function getAdminRooms() {
  return apiRequest('/admin/rooms')
}

export function addRoom(roomData) {
  return apiRequest('/admin/rooms', {
    method: 'POST',
    body: JSON.stringify(roomData)
  })
}

export function updateRoom(roomId, roomData) {
  return apiRequest(`/admin/rooms/${roomId}`, {
    method: 'PUT',
    body: JSON.stringify(roomData)
  })
}

export function deleteRoom(roomId) {
  return apiRequest(`/admin/rooms/${roomId}`, {
    method: 'DELETE'
  })
}

export function getAdminBookings() {
  return apiRequest('/admin/bookings')
}

export function getAdminBookingHistory() {
  return apiRequest('/admin/bookings/history')
}

export function checkInGuest(bookingId) {
  return apiRequest(`/admin/bookings/${bookingId}/check-in`, {
    method: 'PUT'
  })
}

export function checkOutGuest(bookingId) {
  return apiRequest(`/admin/bookings/${bookingId}/check-out`, {
    method: 'PUT'
  })
}
