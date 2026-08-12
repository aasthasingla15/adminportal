import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search, Plus, Edit2, Trash2, Eye, AlertTriangle, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import AdminLayout from '../../../components/AdminLayout';
import { getLocalEvents, deleteLocalEvent } from '../../../lib/eventStorage';

export default function AdminEventsListPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Deletion modal states
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const router = useRouter();

  // Fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success && data.data) {
        setEvents(data.data);
        setFilteredEvents(data.data);
        setIsOffline(false);
      } else {
        const localEvents = getLocalEvents();
        setEvents(localEvents);
        setFilteredEvents(localEvents);
        setIsOffline(true);
      }
    } catch (err) {
      console.error('Fetch failed, loading localStorage:', err);
      const localEvents = getLocalEvents();
      setEvents(localEvents);
      setFilteredEvents(localEvents);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter and search live
  useEffect(() => {
    let result = events;

    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      );
    }

    // Filter by Active Tab (All, Upcoming, Completed, Draft)
    const now = new Date();
    if (activeFilterTab === 'Upcoming') {
      result = result.filter(e => new Date(e.date) >= now);
    } else if (activeFilterTab === 'Completed') {
      result = result.filter(e => new Date(e.date) < now);
    } else if (activeFilterTab === 'Draft') {
      result = result.filter(e => e.status === 'Draft');
    }

    // Category select filter
    if (categoryFilter !== 'All') {
      result = result.filter(e => e.category === categoryFilter);
    }

    setFilteredEvents(result);
  }, [searchQuery, activeFilterTab, categoryFilter, events]);

  const showToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Delete event confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingEventId) return;
    setDeleteLoading(true);

    try {
      if (isOffline || String(deletingEventId).startsWith('mock-') || String(deletingEventId).startsWith('local-')) {
        deleteLocalEvent(deletingEventId);
        setEvents((prev) => prev.filter((e) => e._id !== deletingEventId));
        setDeletingEventId(null);
        showToast('success', 'Event deleted (local mode).');
        setDeleteLoading(false);
        return;
      }
      const res = await fetch(`/api/events/${deletingEventId}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        deleteLocalEvent(deletingEventId);
        showToast('success', 'Event successfully deleted.');
        setDeletingEventId(null);
        fetchEvents();
      } else if (data.offlineFallback) {
        deleteLocalEvent(deletingEventId);
        setEvents((prev) => prev.filter((e) => e._id !== deletingEventId));
        setDeletingEventId(null);
        showToast('success', 'Event deleted (local mode — DB offline).');
      } else {
        showToast('error', data.message || 'Failed to delete event.');
      }
    } catch (err) {
      console.error(err);
      deleteLocalEvent(deletingEventId);
      setEvents((prev) => prev.filter((e) => e._id !== deletingEventId));
      setDeletingEventId(null);
      showToast('success', 'Event deleted (local mode — network error).');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (_) {
      return dateStr;
    }
  };

  const categoriesList = ['Workshop', 'Hackathon', 'Bootcamp', 'Competition', 'Talk', 'Seminar', 'Cultural', 'Sports', 'Conference', 'Other'];

  return (
    <AdminLayout pageTitle="Events">
      {/* Header bar matching specs */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }} className="list-header-grid">
        <div>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>Manage all your events in one place.</p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }} className="actions-wrapper">
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input 
              type="text" 
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '20px',
                padding: '0 12px 0 34px',
                fontSize: '13px',
                color: '#111111',
                outline: 'none'
              }}
            />
          </div>

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              height: '38px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '20px',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#6B7280',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Categories</option>
            {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button 
            onClick={() => router.push('/admin/events/create')}
            style={{
              height: '38px',
              backgroundColor: '#6C3BFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '20px',
              padding: '0 16px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 10px rgba(108, 59, 255, 0.15)'
            }}
          >
            <Plus size={15} />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['All', 'Upcoming', 'Completed', 'Draft'].map(tab => {
          const isActive = activeFilterTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveFilterTab(tab)}
              style={{
                height: '34px',
                padding: '0 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: isActive ? '#6C3BFF' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#6B7280',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(80,60,150,0.01)',
                border: isActive ? 'none' : '1px solid #ECEAF3',
                transition: 'all 200ms ease'
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Events Table Container Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E9E7F2',
        borderRadius: '14px',
        boxShadow: '0 4px 20px rgba(80,60,150,0.02)',
        overflow: 'hidden'
      }}>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: '#6C3BFF' }} />
          </div>
        ) : (
          <>
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr>
                    {['Event', 'Date & Time', 'Venue', 'Category', 'Status', 'Actions'].map(th => (
                      <th key={th} style={{
                        padding: '16px 20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        color: '#9CA3AF',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid #E9E7F2'
                      }}>{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map(event => {
                    const isUpcoming = new Date(event.date) >= new Date();
                    return (
                      <tr key={event._id} style={{ borderBottom: '1px solid #E9E7F2', height: '68px' }} className="table-row-hover">
                        {/* Event Column */}
                        <td style={{ padding: '12px 20px' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <img src={event.bannerImage} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', background: '#F8F7FF' }} />
                            <div>
                              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#111111', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <span>{event.title}</span>
                                {event.featured && (
                                  <span style={{
                                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                                    color: '#F59E0B',
                                    fontSize: '9px',
                                    fontWeight: '800',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '2px'
                                  }}>
                                    ★ Featured
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '11px', color: '#9CA3AF', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '200px' }}>{event.description}</div>
                            </div>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: '600', color: '#111111' }}>
                          <div>{formatDate(event.date)}</div>
                          <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '500' }}>{event.time}</div>
                        </td>

                        {/* Venue */}
                        <td style={{ padding: '12px 20px', fontSize: '13px', color: '#6B7280' }}>
                          {event.venue}
                        </td>

                        {/* Category */}
                        <td style={{ padding: '12px 20px' }}>
                          <span style={{
                            backgroundColor: '#F0ECFF',
                            color: '#6C3BFF',
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            textTransform: 'uppercase'
                          }}>{event.category}</span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '12px 20px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: isUpcoming ? '#22C55E' : '#9CA3AF',
                            backgroundColor: isUpcoming ? 'rgba(34, 197, 94, 0.08)' : '#F3F4F6',
                            padding: '3px 10px',
                            borderRadius: '20px'
                          }}>
                            {isUpcoming ? 'Upcoming' : 'Completed'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 20px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => router.push(`/events/${event._id}`)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '4px' }}
                              title="View Event"
                            >
                              <Eye size={15} />
                            </button>
                            <button 
                              onClick={() => router.push(`/admin/events/edit/${event._id}`)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6C3BFF', padding: '4px' }}
                              title="Edit Event"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => setDeletingEventId(event._id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px' }}
                              title="Delete Event"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredEvents.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6B7280', fontSize: '13px' }}>
                        No events found matching current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '16px', borderTop: '1px solid #E9E7F2' }}>
              <button style={{ height: '30px', padding: '0 12px', background: '#F8F7FF', border: '1px solid #E9E7F2', borderRadius: '6px', fontSize: '12px', color: '#6B7280', fontWeight: '600', cursor: 'pointer' }}>&lt; Prev</button>
              <button style={{ height: '30px', width: '30px', background: '#6C3BFF', border: 'none', borderRadius: '6px', fontSize: '12px', color: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }}>1</button>
              <button style={{ height: '30px', width: '30px', background: 'transparent', border: 'none', borderRadius: '6px', fontSize: '12px', color: '#6B7280', fontWeight: '600', cursor: 'pointer' }}>2</button>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>...</span>
              <button style={{ height: '30px', width: '30px', background: 'transparent', border: 'none', borderRadius: '6px', fontSize: '12px', color: '#6B7280', fontWeight: '600', cursor: 'pointer' }}>5</button>
              <button style={{ height: '30px', padding: '0 12px', background: '#F8F7FF', border: '1px solid #E9E7F2', borderRadius: '6px', fontSize: '12px', color: '#6B7280', fontWeight: '600', cursor: 'pointer' }}>Next &gt;</button>
            </div>
          </>
        )}

      </div>

      {/* Delete Confirmation Modal Overlay */}
      {deletingEventId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          backgroundColor: 'rgba(10, 5, 24, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E6F0',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111111', marginBottom: '6px' }}>Delete Event?</h3>
              <p style={{ fontSize: '13.5px', color: '#6B7280', lineHeight: '1.5' }}>Are you sure you want to permanently delete this event? This action is irreversible.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
              <button 
                onClick={() => setDeletingEventId(null)}
                style={{ flex: 1, height: '40px', borderRadius: '30px', border: '1px solid #E9E7F2', backgroundColor: '#F8F7FF', color: '#6B7280', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                style={{ flex: 1, height: '40px', borderRadius: '30px', border: 'none', backgroundColor: '#EF4444', color: '#FFFFFF', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert Popups */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 3000 }}>
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E9E7F2',
              boxShadow: '0 10px 24px rgba(0,0,0,0.06)'
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={16} style={{ color: '#22C55E' }} />
            ) : (
              <AlertTriangle size={16} style={{ color: '#EF4444' }} />
            )}
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#111111' }}>{toast.message}</span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .table-row-hover:hover {
          background-color: #FAFAFC !important;
        }
        @media (max-width: 768px) {
          .list-header-grid {
            flex-direction: column;
            align-items: stretch !important;
          }
          .actions-wrapper {
            flex-direction: column;
            align-items: stretch !important;
          }
          .actions-wrapper > div, .actions-wrapper > select, .actions-wrapper > button {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
