import { 
  ListPlus, 
  AlertCircle, 
  Info, 
  History, 
  LogOut,
  CalendarCheck,
  Settings
} from 'lucide-react';

const Sidebar = ({ activeTab, onNavigate, onLogout, currentUser }) => {
  const navItems = [
    { id: 'available-rooms', label: 'Room Dashboard', icon: ListPlus },
    { id: 'room-booking', label: 'New Booking', icon: CalendarCheck },
    { id: 'technical-issues', label: 'Technical Issues', icon: AlertCircle },
    { id: 'room-info', label: 'Room Information', icon: Info },
    { id: 'room-history', label: 'Room History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo-icon-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/logo-s.png" alt="S Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
        </div>
        <h1 className="logo-text">HOTEL SHUBHA SAI</h1>
      </div>

      <nav className="nav-container">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button 
                onClick={() => onNavigate(item.id)}
                className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              >
                <item.icon className="icon" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="logout-section">
          {/* User info */}
          {currentUser && (
            <div style={{
              padding: '12px 16px', marginBottom: '8px',
              background: 'rgba(255,255,255,0.07)', borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'rgba(255,255,255,0.9)' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
                {currentUser.role}
              </div>
            </div>
          )}
          <button className="nav-link logout-btn" onClick={onLogout}>
            <LogOut className="icon" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
