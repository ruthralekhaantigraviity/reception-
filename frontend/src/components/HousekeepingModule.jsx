import React from 'react';
import Header from './Header';
import RoomCard from './RoomCard';
import HistoryModal from './HistoryModal';
import { History, ChevronRight } from 'lucide-react';

const HousekeepingModule = ({ rooms, onClean, onHistory, isDarkMode, onToggleTheme, onUtilityClick, notificationCount = 0, notifications = [], onNotificationAction }) => {
  const pendingCleaning = rooms.filter(r => r.status === 'checkout' || r.status === 'cleaned');
  const allHistoryRooms = rooms.filter(r => r.history && r.history.length > 0);

  return (
    <div className="housekeeping-view">
      <Header 
        title="Room History"
        description="View past booking records and manage room cleaning cycles."
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        onUtilityClick={onUtilityClick}
        notificationCount={notificationCount}
        notifications={notifications}
        onNotificationAction={onNotificationAction}
      />
      
      {/* 🧹 Pending Cleaning Section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(to right, var(--dot-checkout), var(--dot-cleaned))' }} />
          Cleaning Queue ({pendingCleaning.length})
        </h2>
        {pendingCleaning.length > 0 ? (
          <div className="room-grid">
            {pendingCleaning.map(room => (
              <div key={room.id} style={{ animation: 'slideIn 0.3s ease-out' }}>
                <RoomCard 
                  {...room} 
                  onNumberClick={() => onHistory(room)}
                  onClean={() => onClean(room)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', background: 'var(--status-available)', borderRadius: '24px', border: '1px solid var(--sidebar-bg)' }}>
            <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>✨ All rooms are currently clean!</p>
          </div>
        )}
      </section>

      {/* 📜 History Section */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} />
          All Room History
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {allHistoryRooms.map(room => (
            <div key={room.id} 
              onClick={() => onHistory(room)}
              style={{
                background: 'var(--card-bg)', padding: '20px', borderRadius: '24px',
                border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--brand-teal)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--text-dark)' }}>
                  {room.number}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>{room.type}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{room.history.length} bookings</div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HousekeepingModule;
