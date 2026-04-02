import React from 'react';
import { X, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

const CleaningModal = ({ isOpen, onClose, room, onConfirmCleaning }) => {
  if (!isOpen || !room) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: '24px', right: '24px' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ 
          width: '80px', height: '80px', borderRadius: '32px', background: 'var(--status-available)', 
          color: 'var(--dot-resolved)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <Sparkles size={40} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Room {room.number}</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: '600', marginBottom: '32px' }}>Housekeeping Verification</p>

        <div style={{ 
          background: 'var(--secondary-bg)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-color)',
          marginBottom: '32px'
        }}>
          <p style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '20px' }}>
            HAS THE ROOM BEEN CLEANED?
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => onConfirmCleaning(room.id)}
              style={{
                flex: 1, padding: '16px', borderRadius: '16px', background: 'var(--dot-resolved)',
                color: 'white', border: 'none', fontWeight: '800', fontSize: '14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              <CheckCircle2 size={18} /> YES, IT'S READY
            </button>
            <button 
              onClick={onClose}
              style={{
                flex: 1, padding: '16px', borderRadius: '16px', background: 'var(--card-bg)',
                color: 'var(--text-muted)', border: '1.5px solid var(--border-color)', fontWeight: '800', 
                fontSize: '14px', cursor: 'pointer'
              }}
            >
              NOT YET
            </button>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
          Once confirmed, this room will be marked as <b>Available</b> for new bookings instantly.
        </p>
      </div>
    </div>
  );
};

export default CleaningModal;
