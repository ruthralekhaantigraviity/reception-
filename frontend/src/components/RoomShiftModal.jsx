import React from 'react';
import { X, ArrowRightLeft, Tv, Snowflake, TriangleAlert, Settings2, ChevronRight } from 'lucide-react';

const SHIFT_REASONS = [
  { id: 'AC', label: 'AC not working', icon: Snowflake },
  { id: 'TV', label: 'TV not working', icon: Tv },
  { id: 'DAMAGE', label: 'Room damage', icon: TriangleAlert },
  { id: 'OTHER', label: 'Other issue', icon: Settings2 },
];

const RoomShiftModal = ({ isOpen, onClose, room, availableRooms, onShift }) => {
  const [reason, setReason] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [newRoomId, setNewRoomId] = React.useState('');

  if (!isOpen || !room) return null;

  const currentBooking = room.history?.[room.history.length - 1] || {};
  const canShift = reason && (reason !== 'OTHER' || description) && newRoomId;

  const handleConfirm = () => {
    onShift({
      oldRoomId: room.id,
      newRoomId,
      reason: reason === 'OTHER' ? description : SHIFT_REASONS.find(r => r.id === reason).label,
      guestData: currentBooking
    });
  };

  const reset = () => {
    setReason('');
    setDescription('');
    setNewRoomId('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={reset}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Shift Room</h2>
            <p className="form-label" style={{ marginBottom: 0 }}>Transfer guest from Room {room.number}</p>
          </div>
          <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
            <X size={24} />
          </button>
        </div>

        {/* Guest Info Summary */}
        <div style={{ background: 'var(--status-available)', borderRadius: '20px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRightLeft size={20} color="var(--dot-resolved)" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800' }}>{currentBooking.guestName || 'Guest'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Current Stay · Room {room.number}</div>
          </div>
        </div>

        {/* Reason Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label className="form-label">Reason for Room Shift</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {SHIFT_REASONS.map(r => (
              <button
                key={r.id}
                onClick={() => setReason(r.id)}
                style={{
                  padding: '12px', borderRadius: '16px', border: `2px solid ${reason === r.id ? 'var(--brand-teal)' : 'var(--border-color)'}`,
                  background: reason === r.id ? 'var(--active-bg)' : 'var(--secondary-bg)',
                  color: reason === r.id ? 'var(--brand-teal)' : 'var(--text-muted)',
                  fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                }}
              >
                <r.icon size={16} /> {r.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {reason === 'OTHER' && (
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Other Reason Description</label>
            <input
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please specify issue"
              required
            />
          </div>
        )}

        {/* New Room Selection */}
        <div style={{ marginBottom: '32px' }}>
          <label className="form-label">Select New Room</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {availableRooms.length > 0 ? (
              availableRooms.map(r => (
                <button
                  key={r.id}
                  onClick={() => setNewRoomId(r.id)}
                  style={{
                    padding: '10px 16px', borderRadius: '12px', border: `2px solid ${newRoomId === r.id ? 'var(--text-dark)' : 'var(--border-color)'}`,
                    background: newRoomId === r.id ? 'var(--text-dark)' : 'var(--card-bg)',
                    color: newRoomId === r.id ? 'var(--bg-primary)' : 'var(--text-dark)',
                    fontSize: '13px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {r.number} ({r.type})
                </button>
              ))
            ) : (
              <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700' }}>No available rooms to shift to!</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={reset} style={{ padding: '14px 20px', borderRadius: '18px', border: '1.5px solid var(--border-color)', background: 'var(--secondary-bg)', color: 'var(--text-dark)', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={!canShift}
            style={{
              flex: 1, padding: '14px', borderRadius: '18px', border: 'none',
              background: canShift ? 'var(--text-dark)' : 'var(--border-color)',
              color: canShift ? 'var(--bg-primary)' : 'var(--text-muted)',
              fontWeight: '800', cursor: canShift ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s'
            }}
          >
            Confirm Room Shift <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomShiftModal;
