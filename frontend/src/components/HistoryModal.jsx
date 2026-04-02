import React from 'react';
import { X, ChevronLeft, User, Phone, Users, History, Calendar, CreditCard, ArrowRightLeft, TriangleAlert, Info, Car, ShieldCheck } from 'lucide-react';

const HistoryModal = ({ isOpen, onClose, room, initialRecordId }) => {
  const [selectedRecord, setSelectedRecord] = React.useState(null);

  React.useEffect(() => {
    if (isOpen && initialRecordId && room?.history) {
      const record = room.history.find(h => h.id === initialRecordId);
      if (record) {
        setSelectedRecord(record);
      }
    }
  }, [isOpen, initialRecordId, room]);

  if (!isOpen || !room) return null;

  const history = room.history || [];

  const handleClose = () => {
    setSelectedRecord(null);
    onClose();
  };

  const DetailRow = ({ icon: Icon, label, value, subValue, color }) => (
    <div style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ 
        width: '40px', height: '40px', borderRadius: '12px', background: 'var(--active-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        color: color || 'var(--dot-resolved)'
      }}>
        <Icon size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
          {label}
        </div>
        <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)' }}>
          {value || 'Not provided'}
        </div>
        {subValue && <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{subValue}</div>}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '95vh', borderRadius: '32px' }}>
        
        {/* Header */}
        <div style={{ padding: '32px 32px 24px', position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 10, borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              {selectedRecord ? (
                <button 
                  onClick={() => setSelectedRecord(null)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', 
                    padding: 0, marginBottom: '12px', color: 'var(--dot-resolved)', fontWeight: '800', 
                    fontSize: '13px', cursor: 'pointer' 
                  }}
                >
                  <ChevronLeft size={16} /> Back to History
                </button>
              ) : null}
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-dark)' }}>
                {selectedRecord ? 'Customer Details' : `Room ${room.number} History`}
              </h2>
            </div>
            <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '0 32px 32px', overflowY: 'auto', flex: 1 }}>
          {selectedRecord ? (
            <div style={{ marginTop: '24px', animation: 'slideIn 0.3s ease-out' }}>
              
              {/* Shift Details If Applicable */}
              {selectedRecord.shiftedFrom && (
                <div style={{ background: '#fffbeb', borderRadius: '18px', padding: '16px', marginBottom: '20px', border: '1.5px solid #fde68a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRightLeft size={14} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#92400e' }}>Room Shift Record</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#92400e', fontWeight: '600', lineHeight: '1.5' }}>
                    Guest shifted from <strong>Room {selectedRecord.shiftedFrom}</strong> due to:<br/>
                    <span style={{ fontSize: '14px', fontWeight: '800' }}>"{selectedRecord.shiftReason}"</span><br/>
                    <span style={{ fontSize: '11px', opacity: 0.8 }}>Shifted on {selectedRecord.shiftTime}</span>
                  </div>
                </div>
              )}

              {/* Info Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                <DetailRow icon={User} label="Primary Guest" value={selectedRecord.guestName} />
                <DetailRow icon={Phone} label="Contact Information" value={selectedRecord.mobile} subValue={selectedRecord.alternateNumber ? `Alt: ${selectedRecord.alternateNumber}` : null} />
                <DetailRow icon={Users} label="Total Guests" value={`${selectedRecord.guests || 1} Person(s)`} 
                  subValue={selectedRecord.guestDetails?.map(g => g.name)?.join(', ') || 'Only primary guest'} />
                <DetailRow icon={Calendar} label="Stay Duration" value={`${selectedRecord.numDays || 1} Night(s)`} 
                  subValue={`Check-in: ${selectedRecord.checkIn || (selectedRecord.checkInTime ? new Date(selectedRecord.checkInTime).toLocaleDateString('en-GB') : 'N/A')} · Check-out: ${selectedRecord.checkOut || 'Active'}`} />
                
                {selectedRecord.vehicleType && selectedRecord.vehicleType !== 'NONE' && (
                  <DetailRow icon={Car} label="Vehicle Info" value={selectedRecord.vehicleType.replace('_', ' ')} subValue={`Plate: ${selectedRecord.vehicleNumber}`} />
                )}

                {selectedRecord.referredBy && (
                  <DetailRow icon={Info} label="Referral" value={selectedRecord.referredBy} />
                )}

                {(selectedRecord.kitchenIncluded || selectedRecord.petsAllowed || selectedRecord.hasKid) && (
                  <DetailRow icon={ShieldCheck} label="Other Details" 
                    value={[
                      selectedRecord.kitchenIncluded ? 'Kitchen Access' : null,
                      selectedRecord.petsAllowed ? 'Pets Allowed' : null,
                      selectedRecord.hasKid ? `Kid (${selectedRecord.kidAge}yr)` : null
                    ].filter(Boolean).join(', ') || 'None'} 
                  />
                )}
              </div>

              {/* Payment Summary */}
              <div style={{ background: 'var(--status-available)', borderRadius: '24px', padding: '24px', border: '1.5px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <CreditCard size={18} color="var(--dot-resolved)" />
                  <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Financial Summary</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
                  <span>Base Amount</span><span>₹{(selectedRecord.roomBaseTotal || selectedRecord.amount || 0).toLocaleString()}</span>
                </div>
                {selectedRecord.snackTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
                    <span>Snacks & Services</span><span>₹{selectedRecord.snackTotal.toLocaleString()}</span>
                  </div>
                )}
                {selectedRecord.extensionCharges > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
                    <span>Extension Charges</span><span>₹{(parseFloat(selectedRecord.extensionCharges) || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedRecord.damageCharges > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', fontWeight: '800', color: 'var(--btn-danger-text)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TriangleAlert size={14} /> Damage Charges
                    </div>
                    <span>+₹{(parseFloat(selectedRecord.damageCharges) || 0).toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '14px', borderTop: '2px solid var(--border-color)', fontSize: '15px', fontWeight: '800' }}>
                  <span style={{ color: 'var(--text-dark)' }}>Total Amount</span>
                  <span style={{ color: 'var(--dot-resolved)' }}>
                    ₹{(parseFloat(selectedRecord.totalAmount || selectedRecord.amount) || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* List View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
              {history.length > 0 ? (
                history.slice().reverse().map((rec, index) => (
                  <div 
                    key={rec.id} 
                    onClick={() => setSelectedRecord(rec)}
                    style={{
                      padding: '20px', borderRadius: '24px', background: 'var(--card-bg)', border: '1px solid var(--border-color)',
                      cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                      animation: `slideUp 0.3s ease-out ${index * 0.05}s both`
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'var(--dot-resolved)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-dark)' }}>{rec.guestName}</span>
                      <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--dot-resolved)' }}>₹{(rec.totalAmount || 0).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={12} />
                        {rec.checkIn || (rec.checkInTime ? new Date(rec.checkInTime).toLocaleDateString('en-GB') : 'N/A')} — {rec.checkOut || 'Active'}
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {rec.shiftedFrom && <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#fffbeb', color: '#92400e', fontSize: '9px', fontWeight: '800' }}>SHIFTED</span>}
                        {rec.damage && <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#fee2e2', color: '#ef4444', fontSize: '9px', fontWeight: '800' }}>DAMAGED</span>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '60px 40px', textAlign: 'center', opacity: 0.6 }}>
                  <History size={48} style={{ marginBottom: '16px' }} />
                  <p style={{ fontWeight: '700' }}>No history found for this room.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '24px 32px 32px', background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', zIndex: 10 }}>
          <button 
            onClick={selectedRecord ? () => setSelectedRecord(null) : handleClose}
            style={{
              width: '100%', padding: '16px', borderRadius: '20px', background: 'var(--text-dark)',
              color: 'var(--bg-primary)', border: 'none', fontSize: '16px', fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {selectedRecord ? 'Return to History List' : 'Close History'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
