import { apiRequest } from './apiClient'

// ─── Fallback sample data shown when backend is unreachable ──────────────────
const SAMPLE_HOTELS = [
  {
    id: 1,
    name: 'Hotel Paradise',
    location: 'Hyderabad',
    description: 'Luxury stay with panoramic city views and premium amenities in the heart of Hyderabad.',
    contact: '+91 9876543210',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    name: 'Taj Sunset Beach Resort',
    location: 'Goa',
    description: 'Exquisite beachfront villas surrounded by coconut palms, private beach access and a world-class sunset bar.',
    contact: '+91 9766554433',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    name: 'The Imperial Bay',
    location: 'Mumbai',
    description: 'Prestigious skyline resort along Marine Drive with infinity pool and panoramic Arabian Sea vistas.',
    contact: '+91 9822334455',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 4,
    name: 'Royal Rajputana Palace',
    location: 'Jaipur',
    description: 'Traditional golden-marble palace with handcrafted courtyards, regal suites and evening cultural shows.',
    contact: '+91 9544332211',
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 5,
    name: 'The Silicon Oasis Suites',
    location: 'Bengaluru',
    description: 'Contemporary tech-hub retreat featuring ergonomic business suites, botanical gardens and an award-winning spa.',
    contact: '+91 9655443322',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 6,
    name: 'Backwater Bliss Resort',
    location: 'Kerala',
    description: 'Floating cottage resort on the serene Alleppey backwaters — ayurvedic spa, canoe breakfast and sunset cruises.',
    contact: '+91 9400112233',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 7,
    name: 'Lake Palace Udaipur',
    location: 'Udaipur',
    description: 'Iconic white-marble palace floating on Lake Pichola — boat check-in, baroque rooms and candlelit lakeside dinners.',
    contact: '+91 9414223300',
    imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 8,
    name: 'The Capital Grand',
    location: 'Delhi',
    description: 'Five-star landmark hotel near Connaught Place with a rooftop terrace overlooking India Gate and Michelin-grade restaurants.',
    contact: '+91 9811009900',
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 9,
    name: 'Coconut Grove Beach Resort',
    location: 'Goa',
    description: 'Eco-chic resort nestled between lush palm groves and the Arabian Sea — infinity pool, yoga decks and fresh seafood.',
    contact: '+91 9755443322',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 10,
    name: 'Sea Breeze Residency',
    location: 'Mumbai',
    description: 'Boutique hotel steps from Juhu Beach with sea-view balconies, Bollywood brunch and a rooftop sunset bar.',
    contact: '+91 9811223344',
    imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 11,
    name: 'Hotel Royal Stay',
    location: 'Hyderabad',
    description: 'Grand heritage hotel featuring executive suites, regal courtyards and authentic Hyderabadi cuisine.',
    contact: '+91 9123456789',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 12,
    name: 'Pink City Heritage Inn',
    location: 'Jaipur',
    description: 'Boutique haveli hotel in the walled city offering frescoed suites, rooftop dinners and desert safari packages.',
    contact: '+91 9533221100',
    imageUrl: 'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80'
  }
]

// ─── API calls with fallback ──────────────────────────────────────────────────

export function getHotels() {
  return apiRequest('/hotels').catch(() => SAMPLE_HOTELS)
}

export function getHotel(id) {
  return apiRequest(`/hotels/${id}`).catch(() => {
    const found = SAMPLE_HOTELS.find((h) => String(h.id) === String(id))
    if (found) return found
    throw new Error('Hotel not found')
  })
}

export function getHotelRooms(hotelId) {
  return apiRequest(`/hotels/${hotelId}/rooms`).catch(() => {
    // Return sample rooms when backend is unavailable
    return [
      { id: 1, roomNumber: '101', roomType: 'SINGLE', price: 1500, capacity: 1, status: 'AVAILABLE' },
      { id: 2, roomNumber: '102', roomType: 'DOUBLE', price: 2500, capacity: 2, status: 'AVAILABLE' },
      { id: 3, roomNumber: '103', roomType: 'DELUXE', price: 4000, capacity: 3, status: 'AVAILABLE' },
      { id: 4, roomNumber: '104', roomType: 'SUITE',  price: 7500, capacity: 4, status: 'AVAILABLE' },
    ]
  })
}
