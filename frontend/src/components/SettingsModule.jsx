import React from 'react';
import Header from './Header';
import { 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Database, 
  Smartphone, 
  Monitor, 
  Volume2, 
  RefreshCw,
  LogOut
} from 'lucide-react';

const SettingsModule = ({ isDarkMode, onToggleTheme, onReset, onUtilityClick, notificationCount = 0, notifications = [], onNotificationAction }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [autoRefresh, setAutoRefresh] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  const SettingCard = ({ icon: Icon, title, desc, children }) => (
    <div style={{
      background: 'var(--card-bg)',
      padding: '24px',
      borderRadius: '24px',
      border: '1px solid var(--border-color)',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '16px', 
            background: 'var(--secondary-bg)', color: 'var(--brand-teal)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-dark)' }}>{title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{desc}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );

  const Toggle = ({ active, onToggle }) => (
    <button 
      onClick={onToggle}
      style={{
        width: '50px', height: '26px', borderRadius: '100px',
        background: active ? 'var(--brand-teal)' : 'var(--border-color)',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div style={{
        position: 'absolute', top: '3px', left: active ? '27px' : '3px',
        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'all 0.3s'
      }} />
    </button>
  );

  const ActionRow = ({ label, sub, active, onToggle, Icon }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {Icon && <Icon size={18} color="var(--text-muted)" />}
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>{label}</div>
          {sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{sub}</div>}
        </div>
      </div>
      <Toggle active={active} onToggle={onToggle} />
    </div>
  );

  return (
    <div style={{ animation: 'slideIn 0.3s ease-out' }}>
      <Header 
        title="App Settings"
        description="Manage your dashboard preferences and system configuration."
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        onUtilityClick={onUtilityClick}
        notificationCount={notificationCount}
        notifications={notifications}
        onNotificationAction={onNotificationAction}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '32px' }}>
        
        {/* Appearance */}
        <SettingCard 
          icon={Monitor} 
          title="Display & Appearance" 
          desc="Customize how the dashboard looks on your screen."
        >
          <ActionRow 
            label="Dark Mode" 
            sub="Switch to a midnight deep blue theme" 
            active={isDarkMode} 
            onToggle={onToggleTheme} 
            Icon={Moon}
          />
          <ActionRow 
            label="Auto Refresh" 
            sub="Refresh room status every 60 seconds" 
            active={autoRefresh} 
            onToggle={() => setAutoRefresh(!autoRefresh)} 
            Icon={RefreshCw}
          />
        </SettingCard>

        {/* Notifications */}
        <SettingCard 
          icon={Bell} 
          title="Notifications" 
          desc="Control how you receive alerts and updates."
        >
          <ActionRow 
            label="Desktop Alerts" 
            sub="Show browser notifications" 
            active={notifications} 
            onToggle={() => setNotifications(!notifications)} 
            Icon={Monitor}
          />
          <ActionRow 
            label="Sound Effects" 
            sub="Play sound for urgent checkout alerts" 
            active={soundEnabled} 
            onToggle={() => setSoundEnabled(!soundEnabled)} 
            Icon={Volume2}
          />
        </SettingCard>

        {/* Security & System */}
        <SettingCard 
          icon={Shield} 
          title="Privacy & Security" 
          desc="Manage data persistence and security options."
        >
          <div style={{ marginTop: '12px', padding: '16px', background: 'var(--btn-danger-bg)', borderRadius: '16px', border: '1px solid var(--btn-danger-text)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <Database size={20} color="var(--btn-danger-text)" />
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--btn-danger-text)' }}>Danger Zone</div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--btn-danger-text)', opacity: 0.8, marginBottom: '16px', fontWeight: '600' }}>
              Resetting will clear all current bookings, history, and maintenance records. This action cannot be undone.
            </p>
            <button 
              onClick={onReset}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', 
                background: 'var(--btn-danger-text)', color: 'white', border: 'none',
                fontWeight: '800', fontSize: '13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              <RefreshCw size={16} /> Reset Database
            </button>
          </div>
        </SettingCard>

      </div>
    </div>
  );
};

export default SettingsModule;
