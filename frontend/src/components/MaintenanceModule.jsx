import React from 'react';
import Header from './Header';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const MaintenanceModule = ({ rooms, onResolve, isDarkMode, onToggleTheme, onUtilityClick, notificationCount = 0, notifications = [], onNotificationAction }) => {
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance' || r.status === 'resolved');

  return (
    <div className="maintenance-view">
      <Header 
        title="Maintenance Room"
        description="Track and resolve technical issues across all hotel wings."
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        onUtilityClick={onUtilityClick}
        notificationCount={notificationCount}
        notifications={notifications}
        onNotificationAction={onNotificationAction}
      />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {maintenanceRooms.length > 0 ? (
          maintenanceRooms.map(room => (
            <div key={room.id} style={{
              background: 'var(--card-bg)', padding: '24px', borderRadius: '24px',
              border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '16px',
                  background: room.status === 'resolved' ? 'var(--status-available)' : 'var(--secondary-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '800', fontSize: '18px', color: 'var(--text-dark)'
                }}>
                  {room.number}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-dark)' }}>Technical Issue Raised</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Query: TV not working / AC Leakage</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  padding: '6px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '700',
                  background: room.status === 'resolved' ? 'var(--dot-available)' : 'var(--text-muted)',
                  color: 'white'
                }}>
                  {room.status === 'resolved' ? 'RESOLVED' : 'PENDING'}
                </div>
                {room.status === 'maintenance' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Query Resolved?
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => onResolve(room.id)}
                        style={{
                          padding: '8px 16px', borderRadius: '12px', background: 'var(--btn-success-bg)',
                          color: 'var(--btn-success-text)', border: '1.5px solid var(--dot-available)', fontWeight: '800', 
                          fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--dot-available)'; e.currentTarget.style.color = 'white'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'var(--btn-success-bg)'; e.currentTarget.style.color = 'var(--btn-success-text)'; }}
                      >
                        YES
                      </button>
                      <button 
                        style={{
                          padding: '8px 16px', borderRadius: '12px', background: 'var(--btn-danger-bg)',
                          color: 'var(--btn-danger-text)', border: '1.5px solid var(--dot-booked)', fontWeight: '800', 
                          fontSize: '12px', cursor: 'pointer'
                        }}
                      >
                        NO
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '60px', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '32px', border: '1px solid var(--border-color)' }}>
            <CheckCircle size={48} color="var(--dot-available)" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-dark)' }}>All Clear!</h2>
            <p style={{ color: 'var(--text-muted)' }}>No active maintenance issues at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceModule;
