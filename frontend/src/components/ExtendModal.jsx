import React from 'react';
import { X, Calendar, Plus, Minus, ArrowRight, Wallet, Clock } from 'lucide-react';

const ExtendModal = ({ isOpen, onClose, room, onConfirm }) => {
  const [extraDays, setExtraDays] = React.useState(1);

  if (!isOpen || !room) return null;

  const lastBooking = room.history?.[room.history.length - 1];
  if (!lastBooking) return null;

  // Current Checkout Date logic
  const currentCheckoutDate = lastBooking.checkOut || lastBooking.checkIn; 
  // For new bookings where checkout isn't set yet, we calculate it from numDays
  const baseDate = new Date(lastBooking.checkInTime || Date.now());
  const currentCheckout = new Date(baseDate);
  currentCheckout.setDate(baseDate.getDate() + (lastBooking.numDays || 1));

  // New Checkout Date logic
  const newCheckout = new Date(currentCheckout);
  newCheckout.setDate(currentCheckout.getDate() + extraDays);

  const roomBasePrice = room.ac ? 1600 : 1200;
  const extensionCost = roomBasePrice * extraDays;

  const handleConfirm = () => {
    onConfirm({
      roomId: room.id,
      extraDays: parseInt(extraDays),
      extensionCharges: extensionCost,
      newCheckoutDate: newCheckout.toLocaleDateString('en-IN')
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '440px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900' }}>Extend Stay</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700', marginTop: '4px' }}>
              Room {room.number} · {lastBooking.guestName}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ background: 'var(--secondary-bg)', borderRadius: '24px', padding: '20px', border: '1.5px solid var(--border-color)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Calendar size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Checkout</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-dark)' }}>{currentCheckout.toLocaleDateString('en-IN')}</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '10px 0' }}>
            <button onClick={() => setExtraDays(Math.max(1, extraDays - 1))} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1.5px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={18} /></button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--dot-resolved)' }}>+{extraDays}</div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>EXTRA DAYS</div>
            </div>
            <button onClick={() => setExtraDays(extraDays + 1)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1.5px solid var(--dot-resolved)', background: 'var(--dot-resolved)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={18} /></button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '18px', background: 'var(--status-available)', border: '1.5px dashed var(--dot-resolved)' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--dot-resolved)', textTransform: 'uppercase' }}>New Checkout Date</div>
              <div style={{ fontSize: '16px', fontWeight: '900' }}>{newCheckout.toLocaleDateString('en-IN')}</div>
            </div>
            <ArrowRight size={20} color="var(--dot-resolved)" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '18px', background: 'var(--active-bg)', border: '1.5px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wallet size={18} color="var(--text-muted)" />
              <span style={{ fontSize: '14px', fontWeight: '700' }}>Extension Charge</span>
            </div>
            <span style={{ fontSize: '18px', fontWeight: '900' }}>₹{extensionCost.toLocaleString()}</span>
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          style={{
            width: '100%', padding: '18px', borderRadius: '20px', background: 'var(--text-dark)',
            color: 'var(--bg-primary)', border: 'none', fontSize: '16px', fontWeight: '800',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}
        >
          <Clock size={20} /> Confirm Extension
        </button>
      </div>
    </div>
  );
};

export default ExtendModal;
