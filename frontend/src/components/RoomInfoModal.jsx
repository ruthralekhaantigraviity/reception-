import React from 'react';
import {
  X, BedDouble, Users, Snowflake, Wifi, Tv, Coffee, Wind,
  MapPin, Star, Crown, ShowerHead, CheckCircle2, XCircle,
  IndianRupee, Tag, Clock, Layers
} from 'lucide-react';

const facilityList = [
  { key: 'ac',        icon: Snowflake,   label: 'Air Conditioning' },
  { key: 'wifi',      icon: Wifi,        label: 'Free Wi-Fi' },
  { key: 'tv',        icon: Tv,          label: 'Smart TV' },
  { key: 'coffee',    icon: Coffee,       label: 'Tea / Coffee Maker' },
  { key: 'fan',       icon: Wind,        label: 'Ceiling Fan' },
  { key: 'shower',    icon: ShowerHead,  label: 'Hot Shower' },
  { key: 'breakfast', icon: Coffee,       label: 'Breakfast Included' },
  { key: 'location',  icon: MapPin,      label: 'City View / Balcony' },
];

const typeConfig = {
  GENERAL: { icon: BedDouble,  color: '#3b82f6', label: 'Standard Room', basePriceLabel: '₹1,200 / night' },
  VIP:     { icon: Star,       color: '#f59e0b', label: 'VIP Suite',      basePriceLabel: '₹2,500 / night' },
  VVIP:    { icon: Crown,      color: '#8b5cf6', label: 'VVIP Premier',   basePriceLabel: '₹5,000 / night' },
};

const statusColors = {
  available:   { bg: 'var(--status-available)',   text: 'var(--text-dark)', dot: 'var(--dot-available)',   label: 'Available' },
  maintenance: { bg: 'var(--status-maintenance)', text: 'var(--text-dark)', dot: 'var(--dot-maintenance)', label: 'Maintenance' },
  cleaned:     { bg: 'var(--status-cleaned)',     text: 'var(--text-dark)', dot: 'var(--dot-cleaned)',     label: 'Cleaned' },
  resolved:    { bg: 'var(--status-resolved)',    text: 'var(--text-dark)', dot: 'var(--dot-resolved)',    label: 'Resolved' },
  checkout:    { bg: 'var(--status-checkout)',    text: 'var(--text-dark)', dot: 'var(--dot-checkout)',    label: 'Checkout' },
  booked:      { bg: 'var(--status-booked)',      text: 'var(--text-dark)', dot: 'var(--dot-booked)',      label: 'Booked' },
};

const RoomInfoModal = ({ isOpen, onClose, room }) => {
  if (!isOpen || !room) return null;

  const cfg    = typeConfig[room.type] || typeConfig.GENERAL;
  const TypeIcon = cfg.icon;
  const sc     = statusColors[room.status] || statusColors.available;

  // Default facilities based on room type
  const defaultFacilities = {
    ac:        room.ac !== false,
    wifi:      true,
    tv:        room.type !== 'GENERAL',
    coffee:    room.type !== 'GENERAL',
    fan:       true,
    shower:    true,
    breakfast: room.type === 'VVIP',
    location:  room.type === 'VVIP',
    ...(room.facilities || {})
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '560px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '18px',
              background: cfg.color + '22',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <TypeIcon size={26} color={cfg.color} />
            </div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', lineHeight: 1.2 }}>Room {room.number}</h2>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '2px' }}>{cfg.label}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.6 }}>
            <X size={22} />
          </button>
        </div>

        {/* Status + Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: sc.bg, borderRadius: '16px', padding: '14px', textAlign: 'center' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sc.dot, margin: '0 auto 6px' }} />
            <div style={{ fontSize: '11px', fontWeight: '700', color: sc.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sc.label}</div>
            <div style={{ fontSize: '10px', color: sc.text, opacity: 0.7, marginTop: '2px' }}>Status</div>
          </div>
          <div style={{ background: 'var(--status-available)', borderRadius: '16px', padding: '14px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
              <Users size={16} color="var(--dot-resolved)" />
              <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-dark)' }}>{room.capacity}</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Capacity</div>
          </div>
          <div style={{ background: 'var(--status-available)', borderRadius: '16px', padding: '14px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', marginBottom: '4px' }}>
              <IndianRupee size={14} color="var(--dot-resolved)" />
              <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-dark)' }}>{cfg.basePriceLabel.replace('₹','')}</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Base Price</div>
          </div>
        </div>

        {/* Room Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
          {[
            { icon: Layers, label: 'Room Type',    value: room.category },
            { icon: Tag,    label: 'Room Number',  value: `# ${room.number}` },
            { icon: Clock,  label: 'Booking Type', value: room.type === 'GENERAL' ? 'Nightly / Hourly' : 'Nightly Only' },
            { icon: Users,  label: 'Max Guests',   value: `${room.capacity} persons` },
          ].map(({ icon: InfoIcon, label, value }) => (
            <div key={label} style={{
              display: 'flex', gap: '10px', alignItems: 'center',
              background: 'var(--status-available)', borderRadius: '14px', padding: '12px 16px'
            }}>
              <InfoIcon size={16} color="var(--dot-resolved)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-dark)', marginTop: '2px' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Facilities */}
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Facilities &amp; Amenities
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {facilityList.map(({ key, icon: FacilityIcon, label }) => {
              const has = defaultFacilities[key];
              return (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '13px 16px', borderRadius: '14px',
                  background: has ? 'var(--status-available)' : 'var(--status-maintenance)',
                  opacity: has ? 1 : 0.55,
                  transition: 'opacity 0.2s'
                }}>
                  <FacilityIcon size={16} color={has ? 'var(--dot-resolved)' : 'var(--dot-maintenance)'} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-dark)', flex: 1 }}>{label}</span>
                  {has
                    ? <CheckCircle2 size={16} color="var(--dot-resolved)" />
                    : <XCircle     size={16} color="var(--dot-maintenance)" />
                  }
                </div>
              );
            })}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px', borderRadius: '18px',
            background: 'var(--text-dark)', color: 'var(--bg-primary)',
            border: 'none', fontSize: '15px', fontWeight: '700',
            marginTop: '24px', cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RoomInfoModal;
