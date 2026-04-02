import React from 'react';
import Header from './Header';
import RoomCard from './RoomCard';

const AvailableRooms = ({ 
  title = "Available Rooms", 
  rooms = [], 
  onRoomClick,
  onCheckout,
  onClean,
  onHistory,
  onShift,
  onExtend,
  isDarkMode, 
  onToggleTheme, 
  onUtilityClick,
  notificationCount = 0,
  notifications = [],
  onNotificationAction
}) => {
  const [filter, setFilter] = React.useState('ALL');

  const filteredRooms = rooms.filter(r => {
    if (filter === 'AC') return r.ac;
    if (filter === 'NON-AC') return !r.ac;
    return true;
  });

  return (
    <div className="available-rooms-view">
      <Header 
        title={title} 
        description="Manage guest lifecycle, room statuses, and daily operations."
        isDarkMode={isDarkMode} 
        onToggleTheme={onToggleTheme} 
        onUtilityClick={onUtilityClick} 
        notificationCount={notificationCount}
        notifications={notifications}
        onNotificationAction={onNotificationAction}
      />
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {['ALL', 'AC', 'NON-AC'].map(f => (
          <button 
            key={f}
            onClick={(e) => { e.stopPropagation(); setFilter(f); }}
            style={{
              padding: '6px 20px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              background: filter === f ? 'var(--active-bg)' : 'var(--bg-primary)',
              color: filter === f ? 'var(--text-dark)' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="room-grid">
        {filteredRooms.map((room) => (
          <div key={room.id} onClick={() => (room.status === 'available' || room.status === 'maintenance') && onRoomClick && onRoomClick(room)}>
            <RoomCard 
              {...room} 
              onCheckout={room.status === 'booked' && onCheckout ? () => onCheckout(room) : undefined} 
              onClean={(room.status === 'checkout' || room.status === 'cleaned') && onClean ? () => onClean(room) : undefined}
              onNumberClick={onHistory ? () => onHistory(room) : undefined}
              onShift={room.status === 'booked' && onShift ? () => onShift(room) : undefined}
              onExtend={room.status === 'booked' && onExtend ? () => onExtend(room) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableRooms;
