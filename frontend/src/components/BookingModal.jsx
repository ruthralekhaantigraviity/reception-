import React from 'react';
import { X, ChevronRight, ChevronLeft, UtensilsCrossed, PawPrint, Coffee, Droplets, Soup, Sandwich, Plus, Minus, CheckCircle2, Wallet, Smartphone, Calendar } from 'lucide-react';

/* ─── Prices ──────────────────────────────────── */
const ROOM_PRICES  = { GENERAL: 1200, VIP: 2500, VVIP: 5000, HOURLY: 599 };
const ADDON_PRICES = { kitchen: 200, pets: 500 };
const SNACK_PRICES = { water: 20, tea: 20, coffee: 25, breakfast: 100 };
const EXTRA_PERSON_FEE = 600;

const SNACK_META = [
  { key: 'water',     label: 'Water',     icon: Droplets,  unit: 'bottle' },
  { key: 'tea',       label: 'Tea',        icon: Soup,      unit: 'cup'    },
  { key: 'coffee',    label: 'Coffee',     icon: Coffee,    unit: 'cup'    },
  { key: 'breakfast', label: 'Breakfast',  icon: Sandwich,  unit: 'plate'  },
];

const DOC_TYPES = [
  { value: 'AADHAAR', label: 'Aadhaar Card' },
  { value: 'PAN',     label: 'PAN Card'     },
  { value: 'VOTER',   label: 'Voter ID'     },
  { value: 'DL',      label: 'Driving License' }
];

/* ─── Component ───────────────────────────────── */
const BookingModal = ({ isOpen, onClose, room, onBook, showToast }) => {
  const [page, setPage]             = React.useState(1);   // 1 = form, 2 = snacks, 3 = bill
  const [withGST, setWithGST]       = React.useState(false);
  const [bookingType, setBookingType] = React.useState('NEW');
  const [bookingData, setBookingData] = React.useState({}); // Initialize to empty object to prevent spread crash

  /* ── 🔄 Reset Logic ── */
  React.useEffect(() => {
    if (!isOpen) {
      setPage(1);
      setFormData({
        name: '', dob: '', mobile: '', alternateNumber: '',
        guests: 1, guestDetails: [{ name: '', docType: 'AADHAAR', idNumber: '', dob: '', address: '' }],
        numDays: 1, checkIn: new Date().toISOString().split('T')[0],
        hasKid: false, kidAge: '', referredBy: '',
        kitchenIncluded: false, petsAllowed: false,
        vehicleType: 'NONE', vehicleNumber: '',
      });
      setSnacks({ water: 0, tea: 0, coffee: 0, breakfast: 0 });
      setBookingData({});
      setWithGST(false);
    }
  }, [isOpen]);

  /* ── Page 1 state ── */
  const [formData, setFormData] = React.useState({
    name: '',
    dob: '',
    mobile: '',
    alternateNumber: '',
    guests: 1,
    guestDetails: [{ name: '', docType: 'AADHAAR', idNumber: '', dob: '', address: '' }],
    numDays: 1,
    checkIn: new Date().toISOString().split('T')[0],
    hasKid: false,
    kidAge: '',
    referredBy: '',
    kitchenIncluded: false,
    petsAllowed: false,
    vehicleType: 'NONE',
    vehicleNumber: '',
  });

  /* ── Page 2 state ── */
  const [snacks, setSnacks] = React.useState({ water: 0, tea: 0, coffee: 0, breakfast: 0 });

  /* ── Derived ── */
  const checkOutDate = React.useMemo(() => {
    if (!formData.checkIn || !formData.numDays) return '';
    const d = new Date(formData.checkIn);
    d.setDate(d.getDate() + parseInt(formData.numDays));
    return d.toISOString().split('T')[0];
  }, [formData.checkIn, formData.numDays]);

  const basePrice = room.ac ? 1600 : 1200;
  
  const extraPersonCharge = React.useMemo(() => {
    let extra = 0;
    if (formData.guests >= 2) extra += 600; // 2nd person
    if (formData.guests >= 3) extra += 500; // 3rd person
    if (formData.guests >= 4) extra += 400; // 4th person
    return extra;
  }, [formData.guests]);
  
  const roomBaseTotal = React.useMemo(() => {
    if (bookingType === 'HOURLY') return ROOM_PRICES.HOURLY;
    return (basePrice + extraPersonCharge) * parseInt(formData.numDays || 0);
  }, [bookingType, basePrice, extraPersonCharge, formData.numDays]);

  const addonsAmount =
    (formData.kitchenIncluded ? ADDON_PRICES.kitchen : 0) +
    (formData.petsAllowed     ? ADDON_PRICES.pets    : 0);

  const page1Total = roomBaseTotal + addonsAmount;

  const snackTotal = Object.entries(snacks).reduce(
    (acc, [k, v]) => acc + SNACK_PRICES[k] * v, 0
  );

  const grandTotal = page1Total + snackTotal;

  if (!isOpen) return null;

  /* ── Handlers ── */
  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'guests') {
      const count = Math.max(1, parseInt(value) || 1);
      setFormData(p => {
        const newDetails = Array.from({ length: count }, (_, i) => p.guestDetails[i] || { name: '', docType: 'AADHAAR', idNumber: '', dob: '', address: '' });
        // Sync name if it's the first guest
        if (p.name && !newDetails[0].name) newDetails[0].name = p.name;
        return { ...p, guests: count, guestDetails: newDetails };
      });
    } else if (name === 'name') {
      // Sync Primary Guest Name to Guest 1 Details automatically
      setFormData(p => {
        const updatedDetails = [...p.guestDetails];
        if (updatedDetails.length > 0) updatedDetails[0].name = value;
        return { ...p, name: value, guestDetails: updatedDetails };
      });
    } else {
      setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleGuestDetailChange = (idx, field, val) => {
    setFormData(p => {
      const updated = [...p.guestDetails];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...p, guestDetails: updated };
    });
  };

  const changeSnack = (key, delta) =>
    setSnacks(p => ({ ...p, [key]: Math.max(0, p[key] + delta) }));

  const handlePage1Submit = (e) => {
    e.preventDefault();
    if (formData.hasKid && parseInt(formData.kidAge) > 6) {
      showToast('Kid age must be below 6 years.', 'error'); return;
    }
    setBookingData({ 
      ...formData, 
      checkOut: checkOutDate, 
      type: bookingType, 
      roomId: room.id, 
      basePrice, 
      extraPersonCharge,
      roomBaseTotal,
      addonsAmount 
    });
    setPage(2);
  };

  const handleFinalConfirm = () => {
    setBookingData(prev => ({ ...prev, snacks, snackTotal, grandTotal }));
    setPage(3);
  };

  const handleConfirmAndBook = (finalTotal, paymentMethod) => {
    onBook({ ...bookingData, snacks, snackTotal, totalAmount: finalTotal, paymentMethod });
  };

  const handleDownloadBill = (finalTotal, gstAmount, paymentMethod) => {
    const bd = bookingData;
    const dateStr = new Date().toLocaleDateString('en-IN');
    const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Official Receipt - Room ${room.number}</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 800px; margin: 20px auto; color: #111; padding: 20px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; }
  .proprietor { font-size: 12px; font-weight: 800; color: #1e3a8a; }
  .logo-center { text-align: center; flex:1; }
  .logo-s { width: auto; height: 60px; margin: 0 auto; display: block; }
  .hotel-name { font-size: 26px; font-weight: 900; color: #065f46; margin: 5px 0 2px; }
  .tagline { font-size: 10px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; letter-spacing: 1px; }
  .reception { text-align: right; font-size: 12px; font-weight: 800; color: #065f46; }
  .divider { border: none; border-top: 1px solid #eee; margin: 15px 0; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; background: #f8fafc; padding: 10px; font-size: 11px; text-transform: uppercase; color: #64748b; }
  td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-weight: 600; }
  .amount { text-align: right; }
  .total-row td { font-weight: 900; font-size: 18px; color: #065f46; border-top: 2px solid #111; padding-top: 15px; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 100px; font-size: 10px; font-weight: 800; background: #dbeafe; color: #1e40af; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; }
  .footer-box { font-size: 10px; color: #64748b; line-height: 1.5; }
  .footer-label { font-weight: 900; color: #065f46; text-transform: uppercase; margin-bottom: 4px; }
  @media print { body { margin: 0; padding: 10mm; } .no-print { display: none; } }
</style></head><body>
<div class="header">
  <div class="proprietor">R. Umesh Reddy<br/><span style="font-weight:500;opacity:0.7">Proprietor</span></div>
  <div class="logo-center">
    <img src="${window.location.origin}/logo-s.png" class="logo-s" alt="Logo" />
    <div class="hotel-name">Hotel Shubha Sai</div>
    <div class="tagline">Assuring you the best hospitality services</div>
  </div>
  <div class="reception">Reception Desk<br/>+91 99013 03998</div>
</div>
<table>
  <tr><th>Primary Guest</th><td>${bd?.name || ''}</td><th>Room</th><td>#${room.number} (${room.type})</td></tr>
  <tr><th>Mobile</th><td>${bd?.mobile || ''}</td><th>Total Guests</th><td>${bd?.guests}</td></tr>
  <tr><th>Check-In</th><td>${bd?.checkIn || ''}</td><th>Check-Out</th><td>${bd?.checkOut || ''}</td></tr>
  <tr><th>Transp.</th><td>${bd?.vehicleType || 'NONE'} ${bd?.vehicleNumber ? `(${bd.vehicleNumber})` : ''}</td><th>Payment Method</th><td><span class="badge">${paymentMethod}</span></td></tr>
</table>
<div class="divider"></div>
<table>
  <thead><tr><th>Description</th><th class="amount">Amount</th></tr></thead>
  <tbody>
    <tr><td>Room Charge (${bd?.numDays || 1} nights)</td><td class="amount">₹${bd?.basePrice * bd?.numDays}</td></tr>
    ${bd?.extraPersonCharge > 0 ? `<tr><td>Extra Guest Fee (${bd?.guests - 1} persons)</td><td class="amount">₹${bd?.extraPersonCharge * bd?.numDays}</td></tr>` : ''}
    ${bd?.kitchenIncluded ? '<tr><td>Kitchen Access</td><td class="amount">₹200</td></tr>' : ''}
    ${bd?.petsAllowed ? '<tr><td>Pets Allowed</td><td class="amount">₹500</td></tr>' : ''}
    ${Object.entries(bd?.snacks || {}).filter(([,v])=>v>0).map(([k,v])=>`<tr><td>${k.charAt(0).toUpperCase()+k.slice(1)} x${v}</td><td class="amount">₹${v * SNACK_PRICES[k]}</td></tr>`).join('')}
    ${gstAmount > 0 ? `<tr><td>GST (12%)</td><td class="amount">₹${gstAmount}</td></tr>` : ''}
    <tr class="total-row"><td>Grand Total</td><td class="amount">₹${finalTotal.toLocaleString('en-IN')}</td></tr>
  </tbody>
</table>
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
<p style="font-size:10px;color:#94a3b8;text-align:center;margin-top:30px">Thank you for staying with us! 🙏</p>
</body></html>`;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  };

  const CheckRow = ({ id, name, label, sub, Icon, amount, checked }) => (
    <label htmlFor={id} style={{
      display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
      padding: '14px 16px', borderRadius: '16px',
      background: checked ? 'var(--status-available)' : 'var(--secondary-bg)',
      border: `1.5px solid ${checked ? 'var(--dot-resolved)' : 'var(--border-color)'}`,
      transition: 'all 0.2s'
    }}>
      <input type="checkbox" id={id} name={name} checked={checked} onChange={handleInput} style={{ display: 'none' }} />
      <div style={{
        width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
        background: checked ? 'var(--dot-resolved)' : 'var(--border-color)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s'
      }}>
        <Icon size={18} color={checked ? 'white' : 'var(--text-muted)'} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: '700' }}>{label}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{sub}</div>
      </div>
      <div style={{ fontSize: '13px', fontWeight: '800', color: checked ? 'var(--dot-resolved)' : 'var(--text-muted)' }}>
        +₹{amount}
      </div>
      {checked && <CheckCircle2 size={18} color="var(--dot-resolved)" />}
    </label>
  );

  /* ═══════════════════════════════════════════
      PAGE 3 — Bill Page
  ═══════════════════════════════════════════ */
  if (page === 3) return (
    <BillPage
      room={room}
      bookingData={bookingData}
      grandTotal={grandTotal}
      snackTotal={snackTotal}
      withGST={withGST}
      setWithGST={setWithGST}
      SNACK_PRICES={SNACK_PRICES}
      onBack={() => setPage(2)}
      onConfirm={(total, pm) => handleConfirmAndBook(total, pm)}
      onDownload={(total, gst, pm) => handleDownloadBill(total, gst, pm)}
      EXTRA_PERSON_FEE={EXTRA_PERSON_FEE}
    />
  );

  /* ═══════════════════════════════════════════
      PAGE 1 — Booking Form
  ═══════════════════════════════════════════ */
  if (page === 1) return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Room {room.number} Booking</h2>
            <p className="form-label" style={{ marginBottom: 0 }}>{bookingType} Type · Step 1 of 3</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
          {['NEW', 'REFERRAL', 'HOURLY'].map(t => (
            <button key={t} onClick={() => setBookingType(t)} style={{
              padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--border-color)',
              background: bookingType === t ? 'var(--active-bg)' : 'transparent',
              color: bookingType === t ? 'var(--text-dark)' : 'var(--text-muted)',
              fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap'
            }}>{t}</button>
          ))}
        </div>

        <form onSubmit={handlePage1Submit}>
          <label className="form-label">Number of Guests</label>
          <input className="form-input" type="number" name="guests" value={formData.guests} onChange={handleInput} min="1" max={room.capacity} required />

          {bookingType === 'REFERRAL' && (
            <>
              <label className="form-label">Referred By</label>
              <input className="form-input" name="referredBy" value={formData.referredBy} onChange={handleInput} placeholder="Name of referrer" required />
            </>
          )}

          <label className="form-label">Primary Guest Name</label>
          <input className="form-input" name="name" value={formData.name} onChange={handleInput} placeholder="Enter full name" required />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Mobile Number</label>
              <input className="form-input" name="mobile" value={formData.mobile} onChange={handleInput} placeholder="+91 XXXX" required />
            </div>
            <div>
              <label className="form-label">Alternate Number</label>
              <input className="form-input" name="alternateNumber" value={formData.alternateNumber} onChange={handleInput} placeholder="+91 XXXX (optional)" />
            </div>
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-muted)' }}>Guest Identification</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {formData.guestDetails.map((guest, idx) => (
                <div key={idx} style={{ padding: '16px', background: 'var(--secondary-bg)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--text-dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800' }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '800' }}>Guest {idx === 0 ? ' (Primary)' : idx + 1} Details</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input 
                      className="form-input" 
                      style={{ marginBottom: 0 }}
                      placeholder="Guest Full Name" 
                      value={guest.name} 
                      onChange={(e) => handleGuestDetailChange(idx, 'name', e.target.value)} 
                      required 
                    />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>DATE OF BIRTH</label>
                        <input 
                          className="form-input" 
                          type="date"
                          style={{ marginBottom: 0 }}
                          value={guest.dob} 
                          onChange={(e) => handleGuestDetailChange(idx, 'dob', e.target.value)} 
                          required 
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>ID PROOF TYPE</label>
                        <select 
                          className="form-input" 
                          style={{ marginBottom: 0 }}
                          value={guest.docType} 
                          onChange={(e) => handleGuestDetailChange(idx, 'docType', e.target.value)}
                        >
                          {DOC_TYPES.map(doc => <option key={doc.value} value={doc.value}>{doc.label}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input 
                        className="form-input" 
                        style={{ marginBottom: 0 }}
                        placeholder={`${DOC_TYPES.find(d => d.value === guest.docType)?.label} Number`}
                        value={guest.idNumber} 
                        onChange={(e) => handleGuestDetailChange(idx, 'idNumber', e.target.value)} 
                        required 
                      />
                      <input 
                        className="form-input" 
                        style={{ marginBottom: 0 }}
                        placeholder="Residential Address"
                        value={guest.address} 
                        onChange={(e) => handleGuestDetailChange(idx, 'address', e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <label className="form-label">Vehicle Transportation</label>
            <select className="form-input" name="vehicleType" value={formData.vehicleType} onChange={handleInput}>
              <option value="NONE">None</option>
              <option value="TWO_WHEELER">Two Wheeler</option>
              <option value="FOUR_WHEELER">Four Wheeler</option>
            </select>
          </div>

          {formData.vehicleType !== 'NONE' && (
            <div style={{ marginTop: '16px' }}>
              <label className="form-label">Vehicle Number</label>
              <input 
                className="form-input" 
                name="vehicleNumber" 
                value={formData.vehicleNumber} 
                onChange={handleInput} 
                placeholder="Enter vehicle plate number (e.g. KA 01 AB 1234)" 
                required 
              />
            </div>
          )}

          <div style={{ marginBottom: '16px', background: 'var(--status-available)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--dot-resolved)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} color="var(--dot-resolved)" />
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--dot-resolved)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Standard Booking Rule: 7 PM to 7 AM (12 Hour Cycle)
            </div>
          </div>

          {bookingType !== 'HOURLY' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div>
                <label className="form-label">Number of Days</label>
                <input className="form-input" type="number" name="numDays" value={formData.numDays} onChange={handleInput} min="1" required />
              </div>
              <div>
                <label className="form-label">Check-In Date (at 7 PM)</label>
                <input className="form-input" type="date" name="checkIn" value={formData.checkIn} onChange={handleInput} required />
              </div>
              <div>
                <label className="form-label" style={{ color: 'var(--dot-resolved)' }}>Check-Out Date (at 7 AM)</label>
                <input 
                  className="form-input" 
                  type="date" 
                  value={checkOutDate} 
                  readOnly 
                  style={{ background: 'var(--status-available)', border: '1.5px solid var(--dot-resolved)', cursor: 'not-allowed' }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
            <input type="checkbox" name="hasKid" checked={formData.hasKid} onChange={handleInput} id="kid" />
            <label htmlFor="kid" style={{ fontSize: '14px', fontWeight: '600' }}>Kid with you?</label>
            {formData.hasKid && (
              <input className="form-input" style={{ width: '100px', marginBottom: 0, marginLeft: 'auto' }}
                type="number" name="kidAge" value={formData.kidAge} onChange={handleInput} placeholder="Age (<6)" required />
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--sidebar-bg)', paddingTop: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Add-ons
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <CheckRow id="kitchen" name="kitchenIncluded" label="Kitchen Access"
                sub={`₹${ADDON_PRICES.kitchen} extra · Cooking & utensils included`}
                Icon={UtensilsCrossed} amount={ADDON_PRICES.kitchen} checked={formData.kitchenIncluded} />
              <CheckRow id="pets" name="petsAllowed" label="Pets Allowed"
                sub={`₹${ADDON_PRICES.pets} extra · Pet-friendly room`}
                Icon={PawPrint} amount={ADDON_PRICES.pets} checked={formData.petsAllowed} />
            </div>
          </div>

          <div style={{
            position: 'sticky', bottom: '-40px', left: '-40px', right: '-40px',
            margin: '24px -40px -40px', padding: '24px 40px',
            background: 'var(--card-bg)',
            borderTop: '1px solid var(--border-color)', zIndex: 10,
            display: 'flex', flexDirection: 'column', gap: '16px',
            boxShadow: '0 -10px 15px -3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: '700', fontSize: '14px', display: 'block', color: 'var(--text-dark)' }}>Total Amount</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Base ₹{basePrice * (formData.numDays || 1)} 
                  {extraPersonCharge > 0 && ` + Extra Guest ₹${extraPersonCharge * (formData.numDays || 1)}`}
                </span>
              </div>
              <span style={{ fontWeight: '900', fontSize: '22px', color: 'var(--brand-teal)' }}>₹{page1Total}</span>
            </div>
            
            <button type="submit" style={{
              width: '100%', padding: '16px', borderRadius: '20px', background: 'var(--text-dark)',
              color: 'var(--bg-primary)', border: 'none', fontSize: '16px', fontWeight: '700',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              Next — Add Snacks <ChevronRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Snacks & Beverages</h2>
            <p className="form-label" style={{ marginBottom: 0 }}>Step 2 of 3 · Added during stay &amp; billed at checkout</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ background: 'var(--status-available)', borderRadius: '14px', padding: '12px 16px', marginBottom: '24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
          💡 These amounts are tracked and <strong>automatically added</strong> to the final checkout bill.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {SNACK_META.map(({ key, label, icon: Icon, unit }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--status-available)', borderRadius: '18px', padding: '14px 18px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '14px', flexShrink: 0, background: snacks[key] > 0 ? 'var(--dot-resolved)' : '#e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                <Icon size={20} color={snacks[key] > 0 ? 'white' : '#71717a'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>{label}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>₹{SNACK_PRICES[key]} / {unit}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button type="button" onClick={() => changeSnack(key, -1)} style={{ width: '32px', height: '32px', borderRadius: '10px', border: '1.5px solid var(--sidebar-bg)', background: 'var(--bg-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
                <span style={{ width: '24px', textAlign: 'center', fontWeight: '800', fontSize: '15px' }}>{snacks[key]}</span>
                <button type="button" onClick={() => changeSnack(key, 1)} style={{ width: '32px', height: '32px', borderRadius: '10px', border: '1.5px solid var(--dot-resolved)', background: 'var(--dot-resolved)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
              </div>
              <div style={{ width: '52px', textAlign: 'right', fontSize: '13px', fontWeight: '800', color: snacks[key] > 0 ? 'var(--dot-resolved)' : 'var(--text-muted)' }}>
                {snacks[key] > 0 ? `₹${snacks[key] * SNACK_PRICES[key]}` : '—'}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--sidebar-bg)', paddingTop: '16px', marginBottom: '16px' }}>
          {[
            { label: 'Room + Add-ons',   val: page1Total  },
            { label: 'Snacks (now)',      val: snackTotal  },
          ].map(({ label, val }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
              <span>{label}</span><span>₹{val}</span>
            </div>
          ))}
          <div className="total-card" style={{ marginTop: '12px' }}>
            <span style={{ fontWeight: '700', fontSize: '14px' }}>Grand Total</span>
            <span style={{ fontWeight: '900', fontSize: '20px', color: 'var(--dot-resolved)' }}>₹{grandTotal}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setPage(1)} style={{ padding: '14px 20px', borderRadius: '18px', border: '1.5px solid var(--sidebar-bg)', background: 'var(--bg-primary)', cursor: 'pointer', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dark)' }}>
            <ChevronLeft size={18} /> Back
          </button>
          <button onClick={handleFinalConfirm} style={{ flex: 1, padding: '14px', borderRadius: '18px', background: 'var(--text-dark)', color: 'var(--bg-primary)', border: 'none', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
            Confirm Booking · ₹{grandTotal}
          </button>
        </div>
      </div>
    </div>
  );
};

function BillPage({ room, bookingData = {}, grandTotal = 0, snackTotal = 0, withGST, setWithGST,
                    SNACK_PRICES = {}, onBack, onConfirm, onDownload, EXTRA_PERSON_FEE = 0 }) {
  const [paymentMethod, setPaymentMethod] = React.useState('CASH');

  if (!room) return null;

  const safeGrandTotal = parseFloat(grandTotal) || 0;
  const gstAmount  = withGST ? Math.round(safeGrandTotal * 0.12) : 0;
  const finalTotal = safeGrandTotal + gstAmount;

  const Row = ({ label, amount, muted, bold }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0',
      fontSize: bold ? '15px' : '13px', fontWeight: bold ? '800' : '600',
      color: muted ? 'var(--text-muted)' : 'var(--text-dark)',
      borderTop: bold ? '1.5px solid var(--sidebar-bg)' : 'none', marginTop: bold ? '8px' : 0 }}>
      <span>{label}</span><span>₹{(parseFloat(amount) || 0).toLocaleString('en-IN')}</span>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Generate Bill</h2>
            <p className="form-label" style={{ marginBottom: 0 }}>Step 3 of 3 · Room {room.number} — {bookingData?.name}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {[false, true].map(val => (
            <button key={String(val)} onClick={() => setWithGST(val)} style={{
              padding: '16px', borderRadius: '18px', cursor: 'pointer', fontWeight: '800', fontSize: '14px',
              border: `2px solid ${withGST === val ? 'var(--dot-resolved)' : 'var(--sidebar-bg)'}`,
              background: withGST === val ? 'var(--status-available)' : 'var(--bg-primary)',
              color: withGST === val ? 'var(--dot-resolved)' : 'var(--text-muted)',
              transition: 'all 0.2s', textAlign: 'center'
            }}>
              {val ? '📋 With GST' : '🧾 Without GST'}
              <div style={{ fontSize: '11px', fontWeight: '600', marginTop: '4px', opacity: 0.8 }}>
                {val ? '+12% on total' : 'No tax applied'}
              </div>
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--status-available)', borderRadius: '20px', padding: '18px 20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Bill Summary
          </p>
          <Row label={`Room Charge (${bookingData?.numDays || 0} nights)`} amount={(bookingData?.basePrice || 0) * (bookingData?.numDays || 0)} muted />
          {bookingData?.extraPersonCharge > 0 && (
            <Row label={`Extra Guest Fee (${(bookingData?.guests || 1) - 1} persons)`} amount={(bookingData?.extraPersonCharge || 0) * (bookingData?.numDays || 0)} muted />
          )}
          {bookingData?.kitchenIncluded && <Row label="Kitchen Access" amount={200} muted />}
          {bookingData?.petsAllowed     && <Row label="Pets Allowed"   amount={500} muted />}
          {Object.entries(bookingData?.snacks || {}).filter(([,v]) => v > 0).map(([k, v]) => (
            <Row key={k} label={`${k.charAt(0).toUpperCase() + k.slice(1)} ×${v}`} amount={v * (SNACK_PRICES[k] || 0)} muted />
          ))}
          <Row label="Sub-total" amount={safeGrandTotal} muted />
          {withGST && <Row label="GST (12%)" amount={gstAmount} muted />}
          <Row label="Grand Total" amount={finalTotal} bold />
        </div>

        <div style={{ padding: '20px', background: 'var(--status-available)', borderRadius: '24px', marginBottom: '24px', border: '1.5px solid var(--sidebar-bg)' }}>
          <p style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '16px' }}>Select Payment Method</p>
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
                  width: '36px', height: '36px', borderRadius: '12px', background: paymentMethod === id ? 'var(--brand-teal)' : 'var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', transition: 'background 0.2s'
                }}>
                  <Icon size={18} color={paymentMethod === id ? 'white' : 'var(--text-muted)'} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: paymentMethod === id ? 'var(--brand-teal)' : 'var(--text-muted)' }}>{label}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => onDownload(finalTotal, gstAmount, paymentMethod)} style={{ width: '100%', padding: '14px', borderRadius: '18px', background: 'var(--status-available)', border: '1.5px solid var(--dot-resolved)', color: 'var(--dot-resolved)', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            🖨️ Generate &amp; Download Bill
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onBack} style={{ padding: '14px 20px', borderRadius: '18px', border: '1.5px solid var(--sidebar-bg)', background: 'var(--bg-primary)', cursor: 'pointer', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dark)' }}>
              <ChevronLeft size={18} /> Back
            </button>
            <button onClick={() => onConfirm(finalTotal, paymentMethod)} style={{ flex: 1, padding: '14px', borderRadius: '18px', background: 'var(--text-dark)', color: 'var(--bg-primary)', border: 'none', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
              ✅ Confirm Booking · ₹{finalTotal}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
