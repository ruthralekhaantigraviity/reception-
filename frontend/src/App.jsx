import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { Search, Bell } from 'lucide-react';
import './index.css';
import AvailableRooms from './components/AvailableRooms';
import BookingModal from './components/BookingModal';
import MaintenanceModule from './components/MaintenanceModule';
import HousekeepingModule from './components/HousekeepingModule';
import RoomInfoModal from './components/RoomInfoModal';
import CheckoutModal from './components/CheckoutModal';
import CleaningModal from './components/CleaningModal';
import HistoryModal from './components/HistoryModal';
import RoomShiftModal from './components/RoomShiftModal';
import ExtendModal from './components/ExtendModal';
import SettingsModule from './components/SettingsModule';
import LoginPage from './components/LoginPage';

const DEFAULT_ROOMS = [
  { id: '1', number: '219', category: 'GENERAL', type: 'GENERAL', status: 'available', capacity: 3, ac: true },
  { id: '2', number: '218', category: 'GENERAL', type: 'GENERAL', status: 'available', capacity: 3, ac: true },
  { id: '3', number: '214', category: 'GENERAL', type: 'GENERAL', status: 'available', capacity: 3, ac: false },
  { id: '4', number: '213', category: 'GENERAL', type: 'GENERAL', status: 'maintenance', capacity: 2, ac: true },
  { id: '5', number: '211', category: 'GENERAL', type: 'GENERAL', status: 'available', capacity: 3, ac: false },
  { id: '6', number: '207', category: 'GENERAL', type: 'GENERAL', status: 'available', capacity: 2, ac: true },
  { id: '7', number: '205', category: 'GENERAL', type: 'GENERAL', status: 'cleaned', capacity: 3, ac: true, history: [] },
  { id: '8', number: '316', category: 'VIP', type: 'VIP', status: 'available', capacity: 2, ac: true },
  { id: '9', number: '321', category: 'VVIP', type: 'VVIP', status: 'available', capacity: 4, ac: true },
  { id: '10', number: '320', category: 'VIP', type: 'VIP', status: 'available', capacity: 2, ac: true },
  { id: '11', number: '319', category: 'VIP', type: 'VIP', status: 'available', capacity: 2, ac: true },
  { id: '12', number: '318', category: 'VIP', type: 'VIP', status: 'checkout', capacity: 2, ac: true, history: [] },
];

function App() {
  const [activeTab, setActiveTab] = useState('available-rooms');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success', onClick: null });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 🔐 Auth state — persisted in localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hm_session') || 'null'); } catch { return null; }
  });

  // 💾 Room persistence
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('hm_rooms');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Persistence Load Error:", e);
      }
    }
    return DEFAULT_ROOMS;
  });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [infoRoom, setInfoRoom] = useState(null);
  const [checkoutRoom, setCheckoutRoom] = useState(null);
  const [cleaningRoom, setCleaningRoom] = useState(null);
  const [historyRoom, setHistoryRoom] = useState(null);
  const [historyInitialRecordId, setHistoryInitialRecordId] = useState(null);
  const [roomToShift, setRoomToShift] = useState(null);
  const [roomToExtend, setRoomToExtend] = useState(null);
  const [notifications, setNotifications] = useState([
    { roomId: '1', type: 'urgent', message: 'Room 219 checkout due now!', time: Date.now() - 3600000 },
    { roomId: '8', type: 'urgent', message: 'VIP Room 316 check-out in 15 mins', time: Date.now() - 1800000 }
  ]);

  // 💾 Room persistence effect
  useEffect(() => {
    localStorage.setItem('hm_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // 🔔 Initial Demo Notification
  useEffect(() => {
    if (!currentUser) return;
    setTimeout(() => {
      showToast('🚨 URGENT: Room 219 checkout due now!', 'urgent');
    }, 1500);
  }, [currentUser]);

  // ✅ NOW safe to conditionally render — all hooks are declared above
  const handleNotificationAction = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setHistoryRoom(room);
      // Auto-select the last booking record to show "Customer Details"
      if (room.history && room.history.length > 0) {
        setHistoryInitialRecordId(room.history[room.history.length - 1].id);
      }
    }
  };

  const showToast = (message, type = 'success', onClick = null) => {
    setToast({ show: true, message, type, onClick });
    setTimeout(() => setToast(p => ({ ...p, show: false })), type === 'error' || type === 'urgent' ? 10000 : 3000);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    showToast(`Switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode`, 'info');
  };

  const handleReset = () => {
    if (window.confirm("Reset Dashboard to default? All bookings will be lost.")) {
      setRooms(DEFAULT_ROOMS);
      localStorage.removeItem('hm_rooms');
      window.location.reload();
    }
  };

  const updateRoomStatus = (roomId, newStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
  };

  /* 🔔 Real-time Checkout Monitoring System */
  useEffect(() => {
    if (!currentUser) return;
    const checkCheckouts = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const todayStr = now.toLocaleDateString('en-IN');

      const dueRooms = rooms.filter(r => {
        if (r.status !== 'booked') return false;
        const lastBooking = r.history?.[r.history.length - 1];
        if (!lastBooking) return false;
        return lastBooking.checkOut === todayStr && 
               ((currentHours === 6 && currentMinutes >= 45) || (currentHours === 7 && currentMinutes === 0));
      });

      if (dueRooms.length > 0) {
        setNotifications(prev => {
          let updated = [...prev];
          let changed = false;
          dueRooms.forEach(room => {
            if (!updated.some(n => n.roomId === room.id)) {
              updated.push({ roomId: room.id, time: now.getTime() });
              changed = true;
              showToast(`🚨 URGENT: Room ${room.number} checkout soon!`, 'urgent', () => {
                setHistoryRoom(room);
                if (room.history?.length) setHistoryInitialRecordId(room.history[room.history.length-1].id);
              });
            }
          });
          return changed ? updated : prev;
        });
      }
    };
    const interval = setInterval(checkCheckouts, 60000);
    checkCheckouts();
    return () => clearInterval(interval);
  }, [rooms, currentUser]);

  const handleRoomClick = (room) => {
    if (room.status === 'available') {
      setSelectedRoom(room);
      setIsBookingModalOpen(true);
    } else if (room.status === 'maintenance') {
      setActiveTab('technical-issues');
      showToast(`Navigated to technical issues for Room ${room.number}`, 'info');
    }
  };

  const handleConfirmCheckout = ({ roomId, roomDamaged, damageCharges = 0, extensionCharges = 0, finalTotal, paymentMethod }) => {
    const roomToUpdate = rooms.find(r => r.id === roomId);
    if (!roomToUpdate) return;
    const newStatus = roomDamaged ? 'maintenance' : 'cleaned';
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        const history = Array.isArray(r.history) ? [...r.history] : [];
        if (history.length > 0) {
          const lastIdx = history.length - 1;
          history[lastIdx] = {
            ...history[lastIdx],
            status: 'COMPLETED',
            checkOut: new Date().toLocaleDateString('en-IN'),
            damage: roomDamaged,
            damageCharges,
            extensionCharges,
            finalTotal,
            paymentMethod,
            checkOutTime: Date.now()
          };
        }
        return { ...r, status: newStatus, history };
      }
      return r;
    }));
    showToast(`Checkout complete for Room ${roomToUpdate.number}`, 'success');
    setCheckoutRoom(null);
  };

  const handleBooking = (bookingData) => {
    if (!bookingData) return;
    setRooms(prev => prev.map(r => {
      if (r.id === bookingData.roomId) {
        const newHistoryItem = {
          ...bookingData,
          id: 'h' + Date.now(),
          guestName: bookingData.name || 'Unknown Guest',
          checkInTime: Date.now(),
          totalAmount: bookingData.totalAmount || bookingData.amount || 0,
          status: 'BOOKED'
        };
        return { ...r, status: 'booked', history: [...(r.history || []), newHistoryItem] };
      }
      return r;
    }));
    setIsBookingModalOpen(false);
    showToast(`Room booked successfully`, 'success');
  };

  const handleRoomShift = ({ oldRoomId, newRoomId, shiftCharges = 0 }) => {
    setRooms(prev => {
      const oldRoom = prev.find(r => r.id === oldRoomId);
      if (!oldRoom) return prev;
      const booking = oldRoom.history?.[oldRoom.history.length - 1];
      if (!booking) return prev;

      return prev.map(r => {
        if (r.id === oldRoomId) {
          const history = [...(r.history || [])];
          history[history.length - 1] = { ...history[history.length - 1], status: 'SHIFTED' };
          return { ...r, status: 'cleaned', history };
        }
        if (r.id === newRoomId) {
          const newBooking = { 
            ...booking, 
            id: 'h' + Date.now(), 
            checkInTime: Date.now(), 
            roomId: newRoomId, 
            shiftCharges,
            totalAmount: (parseFloat(booking.totalAmount) || 0) + (parseFloat(shiftCharges) || 0)
          };
          return { ...r, status: 'booked', history: [...(r.history || []), newBooking] };
        }
        return r;
      });
    });
    setRoomToShift(null);
    showToast('Room shift completed successfully', 'success');
  };

  const handleConfirmExtension = ({ roomId, extraDays, extensionCharges = 0, newCheckoutDate }) => {
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        const history = [...(r.history || [])];
        if (history.length > 0) {
          const lastIdx = history.length - 1;
          history[lastIdx] = {
            ...history[lastIdx],
            numDays: (history[lastIdx].numDays || 0) + extraDays,
            checkOut: newCheckoutDate,
            extensionCharges: (parseFloat(history[lastIdx].extensionCharges) || 0) + (parseFloat(extensionCharges) || 0),
            totalAmount: (parseFloat(history[lastIdx].totalAmount) || 0) + (parseFloat(extensionCharges) || 0)
          };
        }
        return { ...r, history };
      }
      return r;
    }));
    setRoomToExtend(null);
    showToast('Stay extended successfully', 'success');
  };

  const handleLogin = (user) => setCurrentUser(user);
  const handleLogout = () => {
    localStorage.removeItem('hm_session');
    setCurrentUser(null);
  };

  if (!currentUser) return <LoginPage onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'available-rooms':
      case 'room-booking':
      case 'room-info':
        return (
          <AvailableRooms 
            title={activeTab.replace('-', ' ').toUpperCase()}
            rooms={activeTab === 'room-booking' ? rooms.filter(r => r.status === 'available') : rooms}
            onRoomClick={activeTab === 'room-info' ? setInfoRoom : handleRoomClick}
            onCheckout={setCheckoutRoom}
            onClean={setCleaningRoom}
            onHistory={setHistoryRoom}
            onShift={setRoomToShift}
            onExtend={setRoomToExtend}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleDarkMode}
            onUtilityClick={(name) => {
              if (name === 'Notifications') setNotifications([]);
              if (name === 'Reset') handleReset();
              showToast(`${name} clicked`, 'info');
            }}
            notificationCount={notifications.length}
            notifications={notifications}
            onNotificationAction={handleNotificationAction}
          />
        );
      case 'technical-issues':
        return (
          <MaintenanceModule 
            rooms={rooms} 
            onResolve={(id) => updateRoomStatus(id, 'available')} 
            isDarkMode={isDarkMode}
            onToggleTheme={toggleDarkMode}
            onUtilityClick={(name) => showToast(`${name} clicked`, 'info')}
            notificationCount={notifications.length}
            notifications={notifications}
            onNotificationAction={handleNotificationAction}
          />
        );
      case 'room-history':
        return (
          <HousekeepingModule 
            rooms={rooms} 
            onClean={setCleaningRoom} 
            onHistory={setHistoryRoom} 
            isDarkMode={isDarkMode}
            onToggleTheme={toggleDarkMode}
            onUtilityClick={(name) => showToast(`${name} clicked`, 'info')}
            notificationCount={notifications.length}
            notifications={notifications}
            onNotificationAction={handleNotificationAction}
          />
        );
      case 'settings':
        return (
          <SettingsModule 
            isDarkMode={isDarkMode}
            onToggleTheme={toggleDarkMode}
            onReset={handleReset}
            onUtilityClick={(name) => showToast(`${name} clicked`, 'info')}
            notificationCount={notifications.length}
            notifications={notifications}
            onNotificationAction={handleNotificationAction}
          />
        );
      default:
        return <div style={{ padding: '40px', color: 'var(--text-muted)', fontWeight: '700' }}>Section construction</div>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar activeTab={activeTab} onNavigate={setActiveTab} onLogout={handleLogout} currentUser={currentUser} />
      <main className="main-content" style={{ flex: 1 }}>
        {renderContent()}
      </main>

      {isBookingModalOpen && selectedRoom && (
        <BookingModal 
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          room={selectedRoom}
          onBook={handleBooking}
          showToast={showToast}
        />
      )}

      {toast.show && (
        <div 
          onClick={toast.onClick}
          className={`toast-container ${toast.type === 'urgent' ? 'toast-urgent' : ''}`}
          style={{
            position: 'fixed', bottom: '32px', right: '32px', padding: '16px 24px',
            borderRadius: '16px', background: toast.type === 'urgent' ? '#fee2e2' : '#dcfce7', 
            color: toast.type === 'urgent' ? '#991b1b' : '#166534',
            zIndex: 10000, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: '700',
            cursor: toast.onClick ? 'pointer' : 'default'
          }}>
          {toast.message}
        </div>
      )}

      {checkoutRoom && (
        <CheckoutModal 
          isOpen={!!checkoutRoom} 
          onClose={() => setCheckoutRoom(null)} 
          room={checkoutRoom} 
          onConfirmCheckout={handleConfirmCheckout} 
        />
      )}

      {cleaningRoom && (
        <CleaningModal 
          isOpen={!!cleaningRoom} 
          onClose={() => setCleaningRoom(null)} 
          room={cleaningRoom} 
          onConfirmCleaning={(id) => { updateRoomStatus(id, 'available'); setCleaningRoom(null); }} 
        />
      )}

      {historyRoom && (
        <HistoryModal 
          isOpen={!!historyRoom} 
          onClose={() => setHistoryRoom(null)} 
          room={historyRoom} 
          initialRecordId={historyInitialRecordId} 
        />
      )}

      {roomToShift && (
        <RoomShiftModal 
          isOpen={!!roomToShift} 
          onClose={() => setRoomToShift(null)} 
          room={roomToShift} 
          availableRooms={rooms.filter(r => r.status === 'available')} 
          onShift={handleRoomShift} 
        />
      )}

      {roomToExtend && (
        <ExtendModal 
          isOpen={!!roomToExtend} 
          onClose={() => setRoomToExtend(null)} 
          room={roomToExtend} 
          onConfirm={handleConfirmExtension} 
        />
      )}
    </div>
  );
}

export default App;
