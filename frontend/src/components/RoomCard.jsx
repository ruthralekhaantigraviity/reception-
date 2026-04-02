import React from 'react';
import { 
  Snowflake, 
  Wifi, 
  Tv, 
  MapPin, 
  Coffee, 
  Wind,
  BedDouble,
  Star,
  Crown,
  Timer
} from 'lucide-react';

const RoomCard = ({ number, category, type, status = 'available', onNumberClick, onCheckout, onClean, onShift, onExtend }) => {
  const getCategoryIcon = () => {
    switch (type) {
      case 'VVIP': return <Crown size={18} color="#fbbf24" />;
      case 'VIP': return <Star size={18} color="#fbbf24" />;
      default: return <BedDouble size={18} color="#3b82f6" />;
    }
  };

  const statusColors = {
    available:   'var(--status-available)',
    maintenance: 'var(--status-maintenance)',
    cleaned:     'var(--status-cleaned)',
    resolved:    'var(--status-resolved)',
    checkout:    'var(--status-checkout)',
    booked:      'var(--status-booked)',
  };

  const dotColors = {
    available:   'var(--dot-available)',
    maintenance: 'var(--dot-maintenance)',
    cleaned:     'var(--dot-cleaned)',
    resolved:    'var(--dot-resolved)',
    checkout:    'var(--dot-checkout)',
    booked:      'var(--dot-booked)',
  };

  const amenities = [
    { icon: Snowflake, id: 'ac' },
    { icon: Wifi, id: 'wifi' },
    { icon: MapPin, id: 'location' },
    { icon: Coffee, id: 'coffee' },
    { icon: Wind, id: 'fan' }
  ];

  return (
    <div className="room-card" style={{ backgroundColor: statusColors[status] }}>
      <div className="status-indicator" style={{ color: dotColors[status], backgroundColor: 'currentColor' }} />
      <div className="room-type-icon">
        {getCategoryIcon()}
      </div>
      
      <div 
        className="room-number-wrapper" 
        onClick={(e) => {
          if (onNumberClick) {
            e.stopPropagation();
            onNumberClick();
          }
        }}
      >
        <span className="no-label">NO</span>
        <span className="room-number">{number}</span>
        {onNumberClick && <span className="history-label">HISTORY</span>}
      </div>
      
      <div className="room-category">{category}</div>
      
      <div className="amenities-icons" style={{ marginBottom: (status === 'booked' || status === 'checkout') ? '8px' : '0' }}>
        {amenities.map((Ame, index) => (
          <Ame.icon key={index} size={14} />
        ))}
      </div>
      
      <div
        className="availability-pill"
        onClick={(e) => {
          if (status === 'cleaned' && onClean) {
            e.stopPropagation();
            onClean();
          }
        }}
        style={{
          color:      dotColors[status] || 'var(--text-muted)',
          fontWeight: '800',
          cursor: status === 'cleaned' ? 'pointer' : 'default',
          textDecoration: status === 'cleaned' ? 'underline' : 'none',
          textUnderlineOffset: '3px',
          background: 'var(--card-bg)',
          padding: '6px 16px',
          borderRadius: '100px',
          fontSize: '11px',
          letterSpacing: '0.05em'
        }}
      >
        {status === 'available' ? 'AVAILABLE' : (['cleaned', 'checkout'].includes(status) ? 'HOUSECLEANING' : status.toUpperCase())}
      </div>

      {/* Action buttons — only for specific statuses */}
      {status === 'booked' && onCheckout && (
        <button
          onClick={(e) => { e.stopPropagation(); onCheckout(); }}
          style={{
            margin: '8px 12px',
            width: 'calc(100% - 24px)',
            padding: '8px',
            borderRadius: '8px',
            background: 'var(--dot-booked)',
            color: 'white',
            border: 'none',
            fontWeight: '800',
            fontSize: '10px',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            transition: 'all 0.2s',
            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.15)'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          CHECK OUT
        </button>
      )}

      {status === 'booked' && onExtend && (
        <button
          onClick={(e) => { e.stopPropagation(); onExtend(); }}
          style={{
            margin: '0 12px 8px',
            width: 'calc(100% - 24px)',
            padding: '8px',
            borderRadius: '8px',
            background: 'var(--brand-teal)',
            color: 'white',
            border: 'none',
            fontWeight: '800',
            fontSize: '10px',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 10px rgba(44, 166, 164, 0.15)'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Timer size={12} /> EXTEND
        </button>
      )}

      {status === 'booked' && onShift && (
        <button
          onClick={(e) => { e.stopPropagation(); onShift(); }}
          style={{
            margin: '0 12px 12px',
            width: 'calc(100% - 24px)',
            padding: '8px',
            borderRadius: '8px',
            background: 'var(--secondary-bg)',
            color: 'var(--text-dark)',
            border: '1px solid var(--border-color)',
            fontWeight: '800',
            fontSize: '10px',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--border-color)'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--secondary-bg)'}
        >
          ⚡ SHIFT
        </button>
      )}

      {(status === 'checkout' || status === 'cleaned') && onClean && (
        <button
          onClick={(e) => { e.stopPropagation(); onClean(); }}
          style={{
            margin: '8px 12px',
            width: 'calc(100% - 24px)',
            padding: '8px',
            borderRadius: '8px',
            background: 'var(--text-dark)',
            color: 'var(--bg-primary)',
            border: 'none',
            fontWeight: '800',
            fontSize: '10px',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            transition: 'all 0.2s',
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          MARK AS CLEANED
        </button>
      )}
    </div>
  );
};

export default RoomCard;
