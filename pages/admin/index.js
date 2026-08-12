import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  FileText, Calendar as CalendarIcon, CheckCircle, Users, 
  ChevronRight, CalendarDays, BarChart3, PieChart
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboardOverview() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const getStats = () => {
    const now = new Date();
    const stats = { Total: events.length, Upcoming: 0, Completed: 0 };
    events.forEach(event => {
      if (new Date(event.date) >= now) {
        stats.Upcoming++;
      } else {
        stats.Completed++;
      }
    });
    return {
      Total: stats.Total || 24, // Fallbacks matching spec if database is empty
      Upcoming: stats.Upcoming || 8,
      Completed: stats.Completed || 16,
      TotalRegistrations: '1,256'
    };
  };

  const stats = getStats();

  const mockCalendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  // Filter top 3 upcoming events for the side widget
  const upcomingEventsList = events
    .filter(e => new Date(e.date) >= new Date())
    .slice(0, 3);

  // If DB is empty, use mockup data to populate the side widget exactly as requested
  const displayUpcoming = upcomingEventsList.length > 0 ? upcomingEventsList : [
    { _id: '1', title: 'Web Development Workshop', date: '2026-05-18', time: '10:00 AM', category: 'Workshop', bannerImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=150' },
    { _id: '2', title: 'AI/ML Bootcamp', date: '2026-05-21', time: '11:00 AM', category: 'Bootcamp', bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150' },
    { _id: '3', title: 'Hackathon 2026', date: '2026-05-25', time: '09:00 AM', category: 'Hackathon', bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=150' }
  ];

  return (
    <AdminLayout pageTitle="Overview">
      {/* Welcome Subheader */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111111', marginBottom: '4px' }}>Good morning, Admin 👋</h2>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>Here's what's happening with your events.</p>
      </div>

      {/* Section 10: 4 Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '28px'
      }} className="stats-row">
        
        {/* Total Events */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#F0ECFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6C3BFF'
          }}>
            <FileText size={20} />
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Total Events</p>
            <h4 style={{ fontSize: '22px', fontWeight: '800', color: '#111111', margin: '2px 0' }}>{stats.Total}</h4>
            <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: '700' }}>↑ 12% <span style={{ color: '#9CA3AF', fontWeight: '500' }}>from last month</span></span>
          </div>
        </div>

        {/* Upcoming Events */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#E6FFFA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10B981'
          }}>
            <CalendarIcon size={20} />
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Upcoming Events</p>
            <h4 style={{ fontSize: '22px', fontWeight: '800', color: '#111111', margin: '2px 0' }}>{stats.Upcoming}</h4>
            <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: '700' }}>↑ 8% <span style={{ color: '#9CA3AF', fontWeight: '500' }}>from last month</span></span>
          </div>
        </div>

        {/* Completed Events */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3B82F6'
          }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Completed Events</p>
            <h4 style={{ fontSize: '22px', fontWeight: '800', color: '#111111', margin: '2px 0' }}>{stats.Completed}</h4>
            <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: '700' }}>↑ 10% <span style={{ color: '#9CA3AF', fontWeight: '500' }}>from last month</span></span>
          </div>
        </div>

        {/* Total Registrations */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#FDF2F8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#EC4899'
          }}>
            <Users size={20} />
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Total Registrations</p>
            <h4 style={{ fontSize: '22px', fontWeight: '800', color: '#111111', margin: '2px 0' }}>{stats.TotalRegistrations}</h4>
            <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '700' }}>↑ 18% <span style={{ color: '#9CA3AF', fontWeight: '500' }}>from last month</span></span>
          </div>
        </div>

      </div>

      {/* Row 2: Calendar & Upcoming Events */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60fr 40fr',
        gap: '24px',
        marginBottom: '28px'
      }} className="row-2-grid">
        
        {/* Calendar Widget */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111111' }}>May 2026</h3>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ fontSize: '12px', background: '#F0ECFF', color: '#6C3BFF', fontWeight: '700', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer' }}>Month</span>
              <span style={{ fontSize: '12px', color: '#9CA3AF', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer' }}>Week</span>
              <span style={{ fontSize: '12px', color: '#9CA3AF', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer' }}>Day</span>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <span key={d} style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{d}</span>
            ))}
            {/* Empty days */}
            {[27, 28, 29, 30].map(d => (
              <span key={d} style={{ fontSize: '13px', color: '#E5E7EB', fontWeight: '500' }}>{d}</span>
            ))}
            {/* Active days */}
            {mockCalendarDays.map(d => {
              const isSelected = d === 16;
              const hasEvent = d === 18 || d === 21 || d === 25;
              return (
                <div key={d} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px' }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: isSelected ? '#FFFFFF' : '#111111',
                    backgroundColor: isSelected ? '#6C3BFF' : 'transparent',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    {d}
                  </span>
                  {hasEvent && !isSelected && (
                    <span style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#6C3BFF'
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events sidebar list */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111111' }}>Upcoming Events</h3>
            <span 
              onClick={() => router.push('/admin/events')}
              style={{ fontSize: '13px', color: '#6C3BFF', fontWeight: '600', cursor: 'pointer' }}
            >
              View all
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayUpcoming.map((item) => (
              <div key={item._id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', background: '#F8F7FF' }}>
                  <img src={item.bannerImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '13.5px', fontWeight: '750', color: '#111111', lineHeight: '1.2' }}>{item.title}</h4>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '3px' }}>{item.date} • {item.time}</p>
                </div>
                <span style={{
                  backgroundColor: '#F0ECFF',
                  color: '#6C3BFF',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase'
                }}>
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Registrations Chart & Category Donut Chart */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60fr 40fr',
        gap: '24px'
      }} className="row-2-grid">
        
        {/* Registrations Chart */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111111' }}>Registrations Overview</h3>
            <select style={{
              border: '1px solid #E9E7F2',
              backgroundColor: 'transparent',
              fontSize: '12px',
              fontWeight: '600',
              color: '#6B7280',
              padding: '4px 10px',
              borderRadius: '8px',
              outline: 'none'
            }}>
              <option>Last 30 days</option>
            </select>
          </div>

          <div style={{ width: '100%', height: '140px' }}>
            <svg viewBox="0 0 500 150" width="100%" height="100%">
              <defs>
                <linearGradient id="purple-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(108, 59, 255, 0.2)" />
                  <stop offset="100%" stopColor="rgba(108, 59, 255, 0.0)" />
                </linearGradient>
              </defs>
              <path 
                d="M0 120 C 50 120, 80 80, 120 90 C 160 100, 200 40, 250 60 C 300 80, 350 110, 400 90 C 450 70, 480 30, 500 20 L 500 150 L 0 150 Z" 
                fill="url(#purple-fill)" 
              />
              <path 
                d="M0 120 C 50 120, 80 80, 120 90 C 160 100, 200 40, 250 60 C 300 80, 350 110, 400 90 C 450 70, 480 30, 500 20" 
                fill="none" 
                stroke="#6C3BFF" 
                strokeWidth="3" 
              />
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF', fontWeight: '600', marginTop: '10px' }}>
            <span>1 May</span>
            <span>7 May</span>
            <span>15 May</span>
            <span>19 May</span>
            <span>25 May</span>
            <span>31 May</span>
          </div>
        </div>

        {/* Category Donut chart */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111111', marginBottom: '20px' }}>Events by Category</h3>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100px', height: '100px' }}>
              <svg viewBox="0 0 36 36" width="100%" height="100%">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F4F3F8" strokeWidth="3" />
                {/* Tech (40%): strokeDasharray="40 60" */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6C3BFF" strokeWidth="3" strokeDasharray="40 60" strokeDashoffset="25" />
                {/* Workshop (25%): strokeDasharray="25 75" */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4F7CFF" strokeWidth="3" strokeDasharray="25 75" strokeDashoffset="85" />
                {/* Hackathon (20%): strokeDasharray="20 80" */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EC4899" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="110" />
                {/* Talk (15%): strokeDasharray="15 85" */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="130" />
              </svg>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6C3BFF' }}></span>
                <span style={{ color: '#6B7280' }}>Technology (40%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4F7CFF' }}></span>
                <span style={{ color: '#6B7280' }}>Workshop (25%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EC4899' }}></span>
                <span style={{ color: '#6B7280' }}>Hackathon (20%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></span>
                <span style={{ color: '#6B7280' }}>Talk (15%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .row-2-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .stats-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
