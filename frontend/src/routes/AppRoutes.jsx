import { useState, useEffect } from 'react'
import { HomePage } from '../pages/HomePage'
import { HotelsPage } from '../pages/HotelsPage'
import { HotelDetailsPage } from '../pages/HotelDetailsPage'
import { BookingPage } from '../pages/BookingPage'
import { MyBookingsPage } from '../pages/MyBookingsPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'

export function AppRoutes({ currentPath, onNavigate }) {
  // Support URLs like #/hotel/1 or #/book/2
  const hash = currentPath || window.location.hash || '#/'

  // Match: #/hotel/:id
  const hotelMatch = hash.match(/^#\/hotel\/(\d+)$/)
  if (hotelMatch) {
    const hotelId = hotelMatch[1]
    return <HotelDetailsPage hotelId={hotelId} onNavigate={onNavigate} />
  }

  // Match: #/book/:roomId
  const bookMatch = hash.match(/^#\/book\/(\d+)$/)
  if (bookMatch) {
    const roomId = bookMatch[1]
    return <BookingPage roomId={roomId} onNavigate={onNavigate} />
  }

  // Exact routes
  switch (hash) {
    case '#/hotels':
      return <HotelsPage onNavigate={onNavigate} />
    case '#/my-bookings':
      return <MyBookingsPage onNavigate={onNavigate} />
    case '#/login':
      return <LoginPage onNavigate={onNavigate} />
    case '#/register':
      return <RegisterPage onNavigate={onNavigate} />
    case '#/admin':
    case '#/admin/dashboard':
      return <AdminDashboardPage onNavigate={onNavigate} />
    case '#/':
    case '':
    default:
      return <HomePage onNavigate={onNavigate} />
  }
}
