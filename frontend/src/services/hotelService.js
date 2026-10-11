
import { apiRequest } from './apiClient'

export function getHotels() {
  return apiRequest('/hotels')
}

export function getHotel(id) {
  return apiRequest(`/hotels/${id}`)
}

export function getHotelRooms(hotelId) {
  return apiRequest(`/hotels/${hotelId}/rooms`)
}
