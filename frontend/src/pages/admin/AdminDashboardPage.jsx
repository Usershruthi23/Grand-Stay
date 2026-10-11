import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import {
  getAdminHotel,
  getAdminDashboard,
  getAdminRooms,
  addRoom,
  updateRoom,
  deleteRoom,
  getAdminBookings,
  getAdminBookingHistory,
  checkInGuest,
  checkOutGuest
} from '../../services/adminService'
import { LoadingState } from '../../components/LoadingState'
import { ErrorMessage } from '../../components/ErrorMessage'

export function AdminDashboardPage({ onNavigate }) {
  const { user, isAuthenticated, isAdmin } = useAuth()

  // State
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'rooms' | 'bookings' | 'history'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notification, setNotification] = useState('')

  // Data
  const [hotel, setHotel] = useState(null)
  const [stats, setStats] = useState(null)
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [historyBookings, setHistoryBookings] = useState([])

  // Room modal
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    roomType: 'SINGLE',
    price: '',
    capacity: 2
  })
  const [submittingRoom, setSubmittingRoom] = useState(false)
  const [roomModalError, setRoomModalError] = useState('')

  // Action loading IDs for check-in / check-out
  const [processingId, setProcessingId] = useState(null)

  const loadAllData = async () => {
    setLoading(true)
    setError('')
    try {
      const [hotelData, statsData, roomsData, bookingsData] = await Promise.all([
        getAdminHotel(),
        getAdminDashboard(),
        getAdminRooms(),
        getAdminBookings()
      ])
      setHotel(hotelData)
      setStats(statsData)
      setRooms(roomsData)
      setBookings(bookingsData)
    } catch (err) {
      setError(err.message || 'Failed to load administration data.')
    } finally {
      setLoading(false)
    }
  }

  const loadHistory = async () => {
    try {
      const hist = await getAdminBookingHistory()
      setHistoryBookings(hist)
    } catch (err) {
      console.error('Failed to load history:', err)
    }
  }

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadAllData()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, isAdmin])

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory()
    }
  }, [activeTab])

  // Handle Room Modal Open
  const handleOpenAddRoom = () => {
    setEditingRoom(null)
    setRoomFormData({
      roomNumber: '',
      roomType: 'SINGLE',
      price: '',
      capacity: 2
    })
    setRoomModalError('')
    setShowRoomModal(true)
  }

  const handleOpenEditRoom = (room) => {
    setEditingRoom(room)
    setRoomFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price,
      capacity: room.capacity
    })
    setRoomModalError('')
    setShowRoomModal(true)
  }

  const handleSaveRoom = async (e) => {
    e.preventDefault()
    setRoomModalError('')

    if (!roomFormData.roomNumber.trim()) {
      setRoomModalError('Room number is required.')
      return
    }
    if (!roomFormData.price || Number(roomFormData.price) <= 0) {
      setRoomModalError('Price must be greater than zero.')
      return
    }
    if (!roomFormData.capacity || Number(roomFormData.capacity) < 1) {
      setRoomModalError('Capacity must be at least 1 person.')
      return
    }

    setSubmittingRoom(true)
    try {
      const payload = {
        roomNumber: roomFormData.roomNumber.trim(),
        roomType: roomFormData.roomType,
        price: Number(roomFormData.price),
        capacity: Number(roomFormData.capacity)
      }

      if (editingRoom) {
        await updateRoom(editingRoom.id, payload)
        setNotification(`Room #${payload.roomNumber} updated successfully.`)
      } else {
        await addRoom(payload)
        setNotification(`Room #${payload.roomNumber} created successfully.`)
      }

      setShowRoomModal(false)
      loadAllData()
    } catch (err) {
      setRoomModalError(err.message || 'Failed to save room.')
    } finally {
      setSubmittingRoom(false)
    }
  }

  const handleDeleteRoom = async (roomId, roomNumber) => {
    if (!window.confirm(`Are you sure you want to delete Room #${roomNumber}?`)) {
      return
    }
    try {
      await deleteRoom(roomId)
      setNotification(`Room #${roomNumber} deleted successfully.`)
      loadAllData()
    } catch (err) {
      alert(`Cannot delete room: ${err.message}`)
    }
  }

  // Handle Guest Check-In
  const handleCheckIn = async (bookingId) => {
    setProcessingId(bookingId)
    setNotification('')
    try {
      await checkInGuest(bookingId)
      setNotification(`Guest for booking #${bookingId} checked in successfully. Room marked OCCUPIED.`)
      loadAllData()
    } catch (err) {
      alert(`Check-in failed: ${err.message}`)
    } finally {
      setProcessingId(null)
    }
  }

  // Handle Guest Check-Out
  const handleCheckOut = async (bookingId) => {
    setProcessingId(bookingId)
    setNotification('')
    try {
      await checkOutGuest(bookingId)
      setNotification(`Guest for booking #${bookingId} checked out successfully. Room released to AVAILABLE.`)
      loadAllData()
    } catch (err) {
      alert(`Check-out failed: ${err.message}`)
    } finally {
      setProcessingId(null)
    }
  }

  // Access Guards
  if (!isAuthenticated) {
    return (
      <div className="container page-container text-center">
        <div className="card max-w-md mx-auto p-8">
          <h2>Admin Login Required</h2>
          <p className="mb-6">
            You must be logged in as a Hotel Administrator to view the management control panel.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('#/login')}>
            Sign In as Admin
          </button>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container page-container text-center">
        <div className="card max-w-md mx-auto p-8">
          <h2>Access Denied</h2>
          <p className="mb-6">
            Your current account (<code>{user.email}</code>) has the <strong>CUSTOMER</strong> role.
            Only accounts with the <strong>HOTEL_ADMIN</strong> role can access hotel management.
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn btn-secondary" onClick={() => onNavigate('#/hotels')}>
              Go to Hotels
            </button>
            <button className="btn btn-outline" onClick={() => onNavigate('#/login')}>
              Switch to Admin Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container page-container admin-dashboard-page">
      {/* Top Header Banner */}
      <div className="admin-header-banner card">
        <div className="admin-brand-summary">
          <span className="admin-shield">🛡️ HOTEL ADMIN PORTAL</span>
          <h1>{hotel?.name || 'Hotel Management'}</h1>
          <p className="admin-location">📍 {hotel?.location} • Contact: {hotel?.contact}</p>
        </div>

        <div className="admin-meta-actions">
          <span className="admin-user-pill">
            Logged in: <strong>{user?.name}</strong> ({user?.email})
          </span>
          <button className="btn btn-outline btn-sm" onClick={loadAllData} disabled={loading}>
            🔄 Refresh Live Data
          </button>
        </div>
      </div>

      {notification && (
        <div className="success-banner" role="alert">
          ✅ {notification}
          <button className="banner-close" onClick={() => setNotification('')}>×</button>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={loadAllData} />}

      {/* Navigation Tabs */}
      <nav className="admin-tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 KPI Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          🛏️ Manage Rooms ({rooms.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📋 Active Stays & Check-In ({bookings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 Reservation History
        </button>
      </nav>

      {loading && <LoadingState message="Syncing hotel administration metrics..." />}

      {/* TAB 1: OVERVIEW */}
      {!loading && activeTab === 'overview' && stats && (
        <div className="admin-overview-section">
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-title">Total Inventory</span>
              <span className="kpi-number">{stats.totalRooms}</span>
              <span className="kpi-desc">Total registered rooms</span>
            </div>
            <div className="kpi-card kpi-success">
              <span className="kpi-title">Available Rooms</span>
              <span className="kpi-number">{stats.availableRooms}</span>
              <span className="kpi-desc">Ready for booking</span>
            </div>
            <div className="kpi-card kpi-warning">
              <span className="kpi-title">Occupied Rooms</span>
              <span className="kpi-number">{stats.occupiedRooms}</span>
              <span className="kpi-desc">Currently checked-in</span>
            </div>
            <div className="kpi-card kpi-info">
              <span className="kpi-title">Today's Check-Ins</span>
              <span className="kpi-number">{stats.todayCheckIns}</span>
              <span className="kpi-desc">Expected arrivals today</span>
            </div>
            <div className="kpi-card kpi-info">
              <span className="kpi-title">Today's Check-Outs</span>
              <span className="kpi-number">{stats.todayCheckOuts}</span>
              <span className="kpi-desc">Expected departures today</span>
            </div>
            <div className="kpi-card kpi-purple">
              <span className="kpi-title">In-House Guests</span>
              <span className="kpi-number">{stats.currentGuests}</span>
              <span className="kpi-desc">Current active stays</span>
            </div>
          </div>

          <div className="quick-actions-box card mt-6">
            <h3>Quick Actions</h3>
            <div className="flex gap-4 flex-wrap mt-3">
              <button className="btn btn-primary" onClick={handleOpenAddRoom}>
                ➕ Register New Room
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('bookings')}>
                📋 Process Guest Check-Ins ({bookings.filter(b => b.status === 'BOOKED').length} Pending)
              </button>
              <button className="btn btn-outline" onClick={() => setActiveTab('rooms')}>
                🛏️ View Room Statuses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROOM MANAGEMENT */}
      {!loading && activeTab === 'rooms' && (
        <div className="admin-rooms-section">
          <div className="section-actions-header">
            <div>
              <h3>Room Inventory Management</h3>
              <p>Add, update pricing/capacity, or remove rooms for {hotel?.name}.</p>
            </div>
            <button className="btn btn-primary" onClick={handleOpenAddRoom}>
              ➕ Add New Room
            </button>
          </div>

          {rooms.length === 0 ? (
            <div className="empty-state card">
              <p>No rooms found for your hotel. Click "Add New Room" to add one.</p>
            </div>
          ) : (
            <div className="admin-table-container card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Room #</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Rate / Night</th>
                    <th>Current Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td className="font-bold">Room #{room.roomNumber}</td>
                      <td>
                        <span className="room-type-tag">{room.roomType}</span>
                      </td>
                      <td>{room.capacity} Guests</td>
                      <td className="font-semibold">₹{Number(room.price).toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            room.status === 'AVAILABLE'
                              ? 'badge-success'
                              : room.status === 'OCCUPIED'
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleOpenEditRoom(room)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteRoom(room.id, room.roomNumber)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ACTIVE BOOKINGS & CHECK-IN/OUT WORKFLOW */}
      {!loading && activeTab === 'bookings' && (
        <div className="admin-bookings-section">
          <div className="section-actions-header">
            <div>
              <h3>Active Guest Reservations & Check-In</h3>
              <p>Execute live Check-In (transitions to OCCUPIED) and Check-Out (releases to AVAILABLE).</p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="empty-state card">
              <p>No active reservations currently awaiting check-in or stay.</p>
            </div>
          ) : (
            <div className="admin-table-container card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Guest Name</th>
                    <th>Guest Email</th>
                    <th>Room</th>
                    <th>Stay Dates</th>
                    <th>Status</th>
                    <th>Stay Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="font-bold">#{b.id}</td>
                      <td>{b.userName}</td>
                      <td className="text-muted">{b.userEmail}</td>
                      <td>
                        <strong>Room #{b.roomNumber}</strong> ({b.roomType})
                      </td>
                      <td>
                        <div className="stay-dates">
                          <span>In: {b.checkIn}</span>
                          <span>Out: {b.checkOut}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            b.status === 'BOOKED'
                              ? 'badge-info'
                              : b.status === 'CHECKED_IN'
                              ? 'badge-warning'
                              : 'badge-success'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td>
                        {b.status === 'BOOKED' && (
                          <button
                            className="btn btn-sm btn-success"
                            disabled={processingId === b.id}
                            onClick={() => handleCheckIn(b.id)}
                          >
                            {processingId === b.id ? 'Processing...' : '🛎️ Check In Guest'}
                          </button>
                        )}

                        {b.status === 'CHECKED_IN' && (
                          <button
                            className="btn btn-sm btn-secondary"
                            disabled={processingId === b.id}
                            onClick={() => handleCheckOut(b.id)}
                          >
                            {processingId === b.id ? 'Processing...' : '🚪 Check Out Guest'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: RESERVATION HISTORY */}
      {!loading && activeTab === 'history' && (
        <div className="admin-history-section">
          <div className="section-actions-header">
            <div>
              <h3>Full Reservation History</h3>
              <p>Complete historical log of all past, checked out, and cancelled bookings.</p>
            </div>
          </div>

          {historyBookings.length === 0 ? (
            <div className="empty-state card">
              <p>No history records found.</p>
            </div>
          ) : (
            <div className="admin-table-container card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Dates</th>
                    <th>Status</th>
                    <th>Actual Check-In</th>
                    <th>Actual Check-Out</th>
                  </tr>
                </thead>
                <tbody>
                  {historyBookings.map((h) => (
                    <tr key={h.id}>
                      <td>#{h.id}</td>
                      <td>
                        <div>{h.userName}</div>
                        <small className="text-muted">{h.userEmail}</small>
                      </td>
                      <td>Room #{h.roomNumber}</td>
                      <td>{h.checkIn} → {h.checkOut}</td>
                      <td>
                        <span className={`badge ${
                          h.status === 'CHECKED_OUT'
                            ? 'badge-success'
                            : h.status === 'CANCELLED'
                            ? 'badge-danger'
                            : h.status === 'CHECKED_IN'
                            ? 'badge-warning'
                            : 'badge-info'
                        }`}>
                          {h.status}
                        </span>
                      </td>
                      <td>{h.actualCheckIn ? new Date(h.actualCheckIn).toLocaleString() : '—'}</td>
                      <td>{h.actualCheckOut ? new Date(h.actualCheckOut).toLocaleString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ROOM MODAL (ADD / EDIT) */}
      {showRoomModal && (
        <div className="modal-overlay" onClick={() => setShowRoomModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRoom ? `Edit Room #${editingRoom.roomNumber}` : 'Add New Room'}</h3>
              <button className="modal-close" onClick={() => setShowRoomModal(false)}>×</button>
            </div>

            {roomModalError && (
              <div className="error-banner mb-4" role="alert">
                <span>⚠️ {roomModalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveRoom} className="form-grid">
              <div className="form-group">
                <label htmlFor="modalRoomNum">Room Number / Identifier</label>
                <input
                  id="modalRoomNum"
                  type="text"
                  placeholder="e.g. 104, 302B"
                  value={roomFormData.roomNumber}
                  onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="modalRoomType">Room Category</label>
                <select
                  id="modalRoomType"
                  value={roomFormData.roomType}
                  onChange={(e) => setRoomFormData({ ...roomFormData, roomType: e.target.value })}
                  className="select-field"
                >
                  <option value="SINGLE">SINGLE</option>
                  <option value="DOUBLE">DOUBLE</option>
                  <option value="DELUXE">DELUXE</option>
                  <option value="SUITE">SUITE</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="modalRoomPrice">Rate per Night (₹)</label>
                <input
                  id="modalRoomPrice"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="e.g. 2500.00"
                  value={roomFormData.price}
                  onChange={(e) => setRoomFormData({ ...roomFormData, price: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="modalRoomCap">Guest Capacity</label>
                <input
                  id="modalRoomCap"
                  type="number"
                  min="1"
                  max="10"
                  value={roomFormData.capacity}
                  onChange={(e) => setRoomFormData({ ...roomFormData, capacity: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRoomModal(false)}
                  disabled={submittingRoom}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submittingRoom}>
                  {submittingRoom ? 'Saving...' : editingRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
