import { apiRequest } from './apiClient'

export function getRoomsByHotel(hotelId) {
  return apiRequest(`/hotels/${hotelId}/rooms`)
}

export function getRoomById(roomId) {
  return apiRequest(`/rooms/${roomId}`)
}
