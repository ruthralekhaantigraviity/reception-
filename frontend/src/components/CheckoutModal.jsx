import React from 'react';
import { X, TriangleAlert, KeyRound, CheckCircle2, XCircle, LogOut, Wallet, Smartphone, Receipt } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, room, onConfirmCheckout }) => {
  const [roomDamaged, setRoomDamaged] = React.useState(null); // null | true | false
  const [keySubmitted, setKeySubmitted] = React.useState(null);
  const [damageCharges, setDamageCharges] = React.useState('');
  const [extensionCharges, setExtensionCharges] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState(null); // 'CASH' | 'UPI'
  const [checkoutTotal, setCheckoutTotal] = React.useState('');

  // Pre-fill total on open if available
  React.useEffect(() => {
    if (isOpen && room) {
      const lastHistoryItem = room.history?.[room.history.length - 1];
      if (lastHistoryItem) {
        // Use totalAmount or amount, otherwise fallback to 0
        const base = parseFloat(lastHistoryItem.totalAmount || lastHistoryItem.amount) || 0;
        setCheckoutTotal(base.toString());
      } else {
        // Fallback for rooms without explicit history (demo safety)
        setCheckoutTotal('0');
      }
    }
  }, [isOpen, room]);

  if (!isOpen || !room) return null;

  const bothAnswered = roomDamaged !== null && keySubmitted !== null;
  const isReady = bothAnswered && paymentMethod !== null && checkoutTotal;

  const handleConfirm = () => {
    onConfirmCheckout({ 
      roomId: room.id, 
      roomDamaged, 
      keySubmitted, 
      damageCharges: parseFloat(damageCharges) || 0, 
      extensionCharges: parseFloat(extensionCharges) || 0,
      finalTotal: parseFloat(checkoutTotal) || 0,
      paymentMethod
    });
  };

  const reset = () => {
    setRoomDamaged(null);
    setKeySubmitted(null);
    setPaymentMethod(null);
    setCheckoutTotal('');
    onClose();
  };

  const handleDownloadBill = () => {
    const lastBooking = room.history?.[room.history.length - 1];
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Official Invoice - Room ${room.number}</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 800px; margin: 20px auto; color: #111; padding: 20px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; }
  .proprietor { font-size: 12px; font-weight: 800; color: #1e3a8a; }
  .logo-center { text-align: center; flex:1; }
  .logo-s { width: auto; height: 60px; margin: 0 auto; display: block; }
  .hotel-name { font-size: 26px; font-weight: 900; color: #065f46; margin: 5px 0 2px; }
  .tagline { font-size: 10px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; letter-spacing: 1px; }
  .reception { text-align: right; font-size: 12px; font-weight: 800; color: #065f46; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
  .info-box { background: #f8fafc; padding: 12px 16px; border-radius: 12px; border: 1px solid #f1f5f9; }
  .label { font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
  .value { font-size: 13px; font-weight: 700; color: #1e293b; }
  table { width: 100%; border-collapse: collapse; margin-top: 15px; }
  th { text-align: left; background: #f8fafc; padding: 10px; font-size: 11px; text-transform: uppercase; color: #64748b; }
  td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-weight: 600; }
  .amount { text-align: right; }
  .total-section { margin-top: 30px; border-top: 2.5px solid #1e3a8a; padding-top: 20px; }
  .total-row { display: flex; justify-content: space-between; align-items: center; }
  .final-amount { font-size: 26px; font-weight: 900; color: #065f46; }
  .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; }
  .footer-box { font-size: 10px; color: #64748b; line-height: 1.5; }
  .footer-label { font-weight: 900; color: #065f46; text-transform: uppercase; margin-bottom: 4px; }
  @media print { body { margin: 0; padding: 10mm; } }
</style></head><body>
<div class="header">
  <div class="proprietor">R. Umesh Reddy<br/><span style="font-weight:500;opacity:0.7">Proprietor</span></div>
  <div class="logo-center">
    <img src="${window.location.origin}/logo-s.png" class="logo-s" alt="Logo" />
    <div class="hotel-name">Hotel Glitz</div>
    <div class="tagline">Assuring you the best hospitality services</div>
  </div>
  <div class="reception">Reception Desk<br/>+91 99013 03998</div>
</div>
<div class="info-grid">
  <div class="info-box"><div class="label">Primary Guest</div><div class="value">${lastBooking?.guestName || 'Valued Guest'}</div></div>
  <div class="info-box"><div class="label">Room Details</div><div class="value">Room ${room.number} (${room.type})</div></div>
  <div class="info-box"><div class="label">Check-In</div><div class="value">${lastBooking?.checkIn || 'N/A'}</div></div>
  <div class="info-box"><div class="label">Check-Out</div><div class="value">${new Date().toLocaleDateString('en-IN')}</div></div>
</div>
<table>
  <thead><tr><th>Description</th><th class="amount">Price</th></tr></thead>
  <tbody>
    <tr><td>Base Room Stay Charges</td><td class="amount">₹${(lastBooking?.totalAmount || lastBooking?.amount || 0).toLocaleString('en-IN')}</td></tr>
    ${parseFloat(extensionCharges) > 0 ? `<tr><td>Stay Extension Charges</td><td class="amount">₹${extensionCharges}</td></tr>` : ''}
    ${parseFloat(damageCharges) > 0 ? `<tr style="color:#ef4444"><td>Room Damage Recovery</td><td class="amount">₹${damageCharges}</td></tr>` : ''}
  </tbody>
</table>
<div class="total-section">
  <div class="total-row">
    <div>
      <div class="label" style="color:#065f46">Payment Status</div>
      <div class="value" style="font-size:16px">FULL SETTLEMENT: ${paymentMethod}</div>
    </div>
    <div style="text-align:right">
      <div class="label">Total Amount Paid</div>
      <div class="final-amount">₹${parseFloat(checkoutTotal).toLocaleString('en-IN')}</div>
    </div>
  </div>
</div>
<div class="footer">
  <div class="footer-box">
    <div class="footer-label">Corporate Office</div>
    Plot No. 145/B4, 3rd Cross, Behind Priyadarshini Petrol Bunk,<br/>
    Bommasandra Industrial Area, Hosur Main Road, Anekal Taluk, Bangalore - 560 099.
  </div>
  <div class="footer-box" style="text-align:right">
    <div class="footer-label">Contact Details</div>
    Phone: 080-27835533 / 27833001<br/>
    Email: hotelshubhasai@gmail.com | Driver: +91 98456 32369
  </div>
</div>
<p style="font-size:10px;color:#94a3b8;text-align:center;margin-top:40px">Generated on ${dateStr} · Management, Hotel Glitz</p>
</body></html>`;
    
    const win = window.open('', '_blank');
    if (!win) {
      alert('Popup blocked! Please allow popups in your browser to view the bill.');
      return;
    }
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  /* ── Yes/No toggle row ── */
  const YesNo = ({ label, icon: ChoiceIcon, value, onChange, yesWarning }) => (
    <div style={{
      background: 'var(--status-available)', borderRadius: '20px',
      padding: '18px 20px', marginBottom: '14px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '12px',
          background: value === true && yesWarning ? 'var(--btn-danger-bg)'
                    : value === true             ? 'var(--btn-success-bg)'
                    : value === false            ? 'var(--btn-success-bg)'
                    : 'var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'background 0.2s'
        }}>
          <ChoiceIcon size={18} color={
            value === true && yesWarning ? 'var(--btn-danger-text)'
          : value !== null              ? 'var(--btn-success-text)'
          : 'var(--text-muted)'
          } />
        </div>
        <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)' }}>{label}</span>
        {value !== null && (
          value === true && yesWarning
            ? <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '700', color: 'var(--btn-danger-text)', background: 'var(--btn-danger-bg)', padding: '3px 10px', borderRadius: '100px' }}>⚠ Action needed</span>
            : <CheckCircle2 size={18} color="var(--btn-success-text)" style={{ marginLeft: 'auto' }} />
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map(({ label: btn, val }) => {
          const isSelected = value === val;
          const isDanger = val === true && yesWarning;
          return (
            <button
              key={btn}
              onClick={() => onChange(val)}
              style={{
                padding: '12px',
                borderRadius: '14px',
                border: `2px solid ${isSelected ? (isDanger ? 'var(--btn-danger-text)' : 'var(--btn-success-text)') : 'var(--border-color)'}`,
                background: isSelected ? (isDanger ? 'var(--btn-danger-bg)' : 'var(--btn-success-bg)') : 'var(--secondary-bg)',
                color: isSelected ? (isDanger ? 'var(--btn-danger-text)' : 'var(--btn-success-text)') : 'var(--text-muted)',
                fontWeight: '800', fontSize: '14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                transition: 'all 0.18s'
              }}
            >
              {isSelected
                ? (isDanger && val
                    ? <TriangleAlert size={15} />
                    : val
                      ? <CheckCircle2 size={15} />
                      : <CheckCircle2 size={15} />)
                : null}
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={reset}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Checkout Checklist</h2>
            <p className="form-label" style={{ marginBottom: 0 }}>Room {room.number} · Please verify before checkout</p>
          </div>
          <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.6 }}>
            <X size={22} />
          </button>
        </div>

        {/* Checklist */}
        <YesNo
          label="Is the room damaged?"
          icon={TriangleAlert}
          value={roomDamaged}
          onChange={setRoomDamaged}
          yesWarning={true}
        />
        <YesNo
          label="Key submitted by guest?"
          icon={KeyRound}
          value={keySubmitted}
          onChange={setKeySubmitted}
          yesWarning={false}
        />

        {/* Warning if damaged */}
        {roomDamaged === true && (
          <div style={{
            background: '#fff1f2', border: '1.5px solid #fca5a5',
            borderRadius: '14px', padding: '12px 16px', marginBottom: '14px',
            fontSize: '13px', fontWeight: '600', color: '#b91c1c',
            display: 'flex', gap: '8px', alignItems: 'flex-start'
          }}>
            <TriangleAlert size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            Room marked as damaged. It will be sent to maintenance after checkout.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label className="form-label">Extension Charges (₹)</label>
            <input 
              type="number"
              className="form-input"
              style={{ border: '2px solid var(--btn-success-text)', background: 'var(--card-bg)', color: 'var(--text-dark)', marginBottom: 0 }}
              placeholder="Stay extension"
              value={extensionCharges}
              onChange={(e) => setExtensionCharges(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Damage Recovery (₹)</label>
            <input 
              type="number"
              className="form-input"
              style={{ border: '2px solid var(--btn-danger-text)', background: 'var(--card-bg)', color: 'var(--btn-danger-text)', marginBottom: 0 }}
              placeholder="Recovery fees"
              value={damageCharges}
              onChange={(e) => setDamageCharges(e.target.value)}
              disabled={roomDamaged !== true}
            />
          </div>
        </div>

        {/* 💳 Billing Selection */}
        <div style={{ borderTop: '1px solid #f4f4f5', paddingTop: '20px', marginBottom: '24px' }}>
          <label className="form-label" style={{ color: 'var(--dot-resolved)' }}>Add Bill (Final Settlement Amount)</label>
          <input 
            type="number"
            className="form-input"
            style={{ border: '2.5px solid var(--dot-resolved)', background: 'var(--card-bg)', color: 'var(--text-dark)', fontSize: '18px', fontWeight: '800' }}
            placeholder="Enter final amount to bill guest"
            value={checkoutTotal}
            onChange={(e) => setCheckoutTotal(e.target.value)}
          />

          <p className="form-label" style={{ marginTop: '16px' }}>Select Payment Method</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { id: 'CASH', label: 'Cash Payment', Icon: Wallet },
              { id: 'UPI', label: 'UPI / QR Scan', Icon: Smartphone }
            ].map(({ id, label, Icon }) => (
              <button 
                key={id}
                onClick={() => setPaymentMethod(id)}
                style={{
                  padding: '16px', borderRadius: '18px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  border: `2px solid ${paymentMethod === id ? 'var(--brand-teal)' : 'transparent'}`,
                  background: paymentMethod === id ? 'var(--active-bg)' : 'var(--secondary-bg)',
                  boxShadow: paymentMethod === id ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '10px', background: paymentMethod === id ? 'var(--brand-teal)' : 'var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', transition: 'background 0.2s'
                }}>
                  <Icon size={16} color={paymentMethod === id ? 'white' : 'var(--text-muted)'} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: paymentMethod === id ? 'var(--brand-teal)' : 'var(--text-muted)' }}>{label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={handleDownloadBill}
            disabled={!paymentMethod}
            style={{ 
              width: '100%', padding: '14px', borderRadius: '18px', background: 'var(--status-available)', 
              border: '1.5px solid var(--dot-resolved)', color: 'var(--dot-resolved)', fontSize: '14px', fontWeight: '700', 
              cursor: paymentMethod ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              opacity: paymentMethod ? 1 : 0.6
            }}
          >
            <Receipt size={18} /> Generate &amp; Download Final Bill
          </button>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={reset} style={{
              padding: '14px 20px', borderRadius: '18px', border: '1.5px solid var(--sidebar-bg)',
              background: 'var(--bg-primary)', cursor: 'pointer', fontWeight: '700',
              fontSize: '14px', color: 'var(--text-dark)'
            }}>
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isReady}
              style={{
                flex: 1, padding: '14px', borderRadius: '18px', border: 'none',
                background: isReady ? 'var(--text-dark)' : 'var(--border-color)',
                color: isReady ? 'var(--bg-primary)' : 'var(--text-muted)',
                fontWeight: '800', fontSize: '15px',
                cursor: isReady ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <CheckCircle2 size={18} />
              {isReady ? 'Confirm Checkout' : (paymentMethod ? 'Complete Bill Details' : 'Select Payment Method')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
