import { 
  ListPlus, 
  AlertCircle, 
  Info, 
  History, 
  LogOut,
  CalendarCheck,
  Settings
} from 'lucide-react';

const Sidebar = ({ activeTab, onNavigate }) => {
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
          <img src="/logo-s.png" alt="S Logo" style={{ width: '22px', height: '22px', filter: 'brightness(0) invert(1)' }} />
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
          <button className="nav-link logout-btn">
            <LogOut className="icon" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
