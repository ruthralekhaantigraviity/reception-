import React from 'react';
import { Moon, Sun, Bell, X, Settings } from 'lucide-react';

const Header = ({ title, description, onToggleTheme, isDarkMode, onUtilityClick, notificationCount = 0, notifications = [], onNotificationAction, currentUser }) => {
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);

  return (
    <header className="main-header">
      <div className="header-top-bar">
        <div className="header-top-left">
          <button className="header-close-btn" onClick={() => onUtilityClick('Close')} title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="header-top-right">
          <button className="header-theme-toggle" onClick={onToggleTheme} title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="header-notif-wrapper">
            <button className="header-notif-btn" onClick={() => onUtilityClick('Settings')} title="Settings">
              <Settings size={20} />
            </button>
          </div>

          <div className="header-notif-wrapper" style={{ position: 'relative' }}>
            <button 
              className="header-notif-btn" 
              onClick={() => setIsNotifOpen(!isNotifOpen)} 
              title="Notifications"
              style={{ background: isNotifOpen ? 'var(--active-bg)' : 'transparent' }}
            >
              <Bell size={20} />
              {notificationCount > 0 && <span className="header-notif-badge">{notificationCount}</span>}
            </button>

            {isNotifOpen && (
              <div 
                className="notification-dropdown"
                style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '12px',
                  width: '320px', background: 'var(--card-bg)', borderRadius: '24px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)',
                  zIndex: 2000, padding: '20px', animation: 'slideIn 0.2s ease-out'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800' }}>Active Alerts</h3>
                  <span style={{ fontSize: '11px', color: 'var(--brand-teal)', fontWeight: '700' }}>{notificationCount} New</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.length > 0 ? (
                    notifications.map((n, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          onNotificationAction(n.roomId);
                          setIsNotifOpen(false);
                        }}
                        style={{
                          width: '100%', padding: '12px', borderRadius: '16px', border: '1px solid var(--border-color)',
                          background: 'var(--secondary-bg)', cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px'
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--brand-teal)'}
                        onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                      >
                        <div style={{ 
                          width: '36px', height: '36px', borderRadius: '10px', background: 'var(--status-booked)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' 
                        }}>
                          <Bell size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-dark)' }}>{n.message}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                            {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', opacity: 0.6 }}>
                      <p style={{ fontSize: '13px', fontWeight: '700' }}>No active alerts</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="header-profile">
            <div className="header-user-info">
              <span className="header-user-name">{currentUser?.name || 'Receptionist'}</span>
              <span className="header-user-role">{currentUser?.role || 'Reception'}</span>
            </div>
            <div className="header-avatar" style={{ background: 'white', border: '1px solid var(--border-color)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo-s.png" alt="Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="header-hero">
        <h1 className="header-title">{title}</h1>
        {description && <p className="header-description">{description}</p>}
      </div>
    </header>
  );
};

export default Header;

