import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FileText, Calendar as CalendarIcon, Layers, Radio, Plus, Eye, Edit2, Trash2, Loader2
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboardOverview() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);

      const res = await fetch('/api/events', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
        signal: controller.signal
      });

      clearTimeout(timeout);
      const data = await res.json();

      if (data.success && data.data) {
        setEvents(data.data);
      } else {
        setEvents([]);
        setError(data.message || 'Unable to load events. Please try again.');
      }
    } catch (err) {
      console.error('Fetch failed:', err);
      setError('Unable to load events. Please try again.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        // Refetch authoritative list from MongoDB
        await fetchEvents();
        alert('Event deleted successfully.');
      } else {
        alert('Failed to delete event: ' + (data.message || 'Please try again.'));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Unable to delete event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const now = new Date();
    let upcoming = 0;
    const categoriesSet = new Set();

    events.forEach(event => {
      if (event.category) categoriesSet.add(event.category);
      if (event.date) {
        try {
          const ed = new Date(event.date);
          if (ed >= now) upcoming++;
        } catch (_) {}
      }
    });

    return {
      Total: events.length || 0,
      Upcoming: upcoming || 0,
      Categories: categoriesSet.size || 0,
      Published: events.length || 0
    };
  };

  const stats = getStats();
  const recentEvents = events.slice(0, 5);

  return (
    <AdminLayout pageTitle="Overview">
      {/* Welcome Subheader */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111111', marginBottom: '4px' }}>Welcome back, Admin 👋</h2>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>Here's an overview of the event management ecosystem.</p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '40px'
      }} className="stats-row">
        
        {/* Total Events */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #ECEAF5',
          borderRadius: '8px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '6px',
            backgroundColor: '#F0EDFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6D3DF5'
          }}>
            <FileText size={20} />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Events</p>
            <h4 style={{ fontSize: '24px', fontWeight: '800', color: '#111111', margin: '2px 0' }}>{stats.Total}</h4>
          </div>
        </div>

        {/* Upcoming Events */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #ECEAF5',
          borderRadius: '8px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '6px',
            backgroundColor: '#E6FFFA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10B981'
          }}>
            <CalendarIcon size={20} />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upcoming</p>
            <h4 style={{ fontSize: '24px', fontWeight: '800', color: '#111111', margin: '2px 0' }}>{stats.Upcoming}</h4>
          </div>
        </div>

        {/* Categories */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #ECEAF5',
          borderRadius: '8px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '6px',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3B82F6'
          }}>
            <Layers size={20} />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categories</p>
            <h4 style={{ fontSize: '24px', fontWeight: '800', color: '#111111', margin: '2px 0' }}>{stats.Categories}</h4>
          </div>
        </div>

        {/* Published Events */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #ECEAF5',
          borderRadius: '8px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '6px',
            backgroundColor: '#FDF2F8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#EC4899'
          }}>
            <Radio size={20} />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Published</p>
            <h4 style={{ fontSize: '24px', fontWeight: '800', color: '#111111', margin: '2px 0' }}>{stats.Published}</h4>
          </div>
        </div>

      </div>

      {/* Recent Events Section */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #ECEAF5',
        borderRadius: '8px',
        padding: '32px',
        transition: 'all 300ms ease'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111111' }}>Recent Events</h3>
          <button 
            onClick={() => router.push('/admin/events/create')}
            style={{
              height: '36px',
              padding: '0 16px',
              backgroundColor: '#6D3DF5',
              border: 'none',
              borderRadius: '6px',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={14} />
            <span>Add Event</span>
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#6D3DF5' }} />
          </div>
        ) : recentEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: '14px' }}>
            No events found. Start by creating a new event!
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="admin-table">
              <thead>
                <tr style={{ borderBottom: '1px solid #ECEAF5' }}>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>Title</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>Time/Date</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>Venue</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event) => (
                  <tr key={event._id} style={{ borderBottom: '1px solid #ECEAF5' }}>
                    <td style={{ padding: '16px', fontSize: '13.5px', fontWeight: '700', color: '#111111' }}>{event.title}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        backgroundColor: '#F0EDFF',
                        color: '#6D3DF5',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}>
                        {event.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#6B7280' }}>
                      {event.date} • {event.time}
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#6B7280' }}>{event.venue}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <Link href={`/events/${event._id}`} style={{ color: '#9CA3AF', cursor: 'pointer' }} className="action-btn-hover">
                          <Eye size={16} />
                        </Link>
                        <Link href={`/admin/events/edit/${event._id}`} style={{ color: '#9CA3AF', cursor: 'pointer' }} className="action-btn-hover">
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(event._id, event.title)}
                          style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}
                          className="action-btn-hover-delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx global>{`
        .action-btn-hover:hover {
          color: #6D3DF5 !important;
        }
        .action-btn-hover-delete:hover {
          color: #EF4444 !important;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .stats-row {
            grid-template-columns: 1fr !important;
          }
          .admin-table th:nth-child(3),
          .admin-table td:nth-child(3),
          .admin-table th:nth-child(4),
          .admin-table td:nth-child(4) {
            display: none !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
