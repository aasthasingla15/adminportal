import { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // May 2026

  const daysInMonth = 31;
  const startDayIndex = 5; // Friday
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Mock events for the calendar
  const events = {
    18: { title: 'Web Dev Workshop', time: '10:00 AM', category: 'Workshop' },
    21: { title: 'AI/ML Bootcamp', time: '11:00 AM', category: 'Bootcamp' },
    25: { title: 'Hackathon 2026', time: '09:00 AM', category: 'Hackathon' }
  };

  return (
    <AdminLayout pageTitle="Calendar">
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E9E7F2',
        borderRadius: '14px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(80,60,150,0.02)'
      }}>
        {/* Calendar Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarDays size={20} style={{ color: '#6C3BFF' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111111' }}>May 2026</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ border: '1px solid #E9E7F2', background: '#FFFFFF', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={16} />
            </button>
            <button style={{ border: '1px solid #E9E7F2', background: '#FFFFFF', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          border: '1px solid #E9E7F2',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          {weekDays.map(d => (
            <div key={d} style={{
              backgroundColor: '#F8F7FF',
              padding: '12px 10px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: '700',
              color: '#6B7280',
              borderBottom: '1px solid #E9E7F2'
            }}>{d}</div>
          ))}

          {/* Padding start days */}
          {Array.from({ length: startDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} style={{
              padding: '16px',
              borderRight: '1px solid #E9E7F2',
              borderBottom: '1px solid #E9E7F2',
              backgroundColor: '#FAFAFC',
              minHeight: '100px'
            }} />
          ))}

          {/* Actual days */}
          {days.map(d => {
            const dayEvent = events[d];
            const isToday = d === 16;
            return (
              <div key={d} style={{
                padding: '12px',
                borderRight: '1px solid #E9E7F2',
                borderBottom: '1px solid #E9E7F2',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: isToday ? 'rgba(108, 59, 255, 0.02)' : '#FFFFFF'
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: isToday ? '#6C3BFF' : '#111111',
                  backgroundColor: isToday ? '#F0ECFF' : 'transparent',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>{d}</span>
                
                {dayEvent && (
                  <div style={{
                    backgroundColor: '#F0ECFF',
                    borderLeft: '3px solid #6C3BFF',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: '#6C3BFF',
                    fontWeight: '700',
                    lineHeight: '1.2',
                    marginTop: '8px'
                  }}>
                    <div>{dayEvent.title}</div>
                    <div style={{ fontWeight: '500', color: '#6B7280', marginTop: '2px' }}>{dayEvent.time}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
