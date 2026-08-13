import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Search, Info, RefreshCw, AlertTriangle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EventCard from '../../components/EventCard';
import { useTheme } from '../../context/ThemeContext';
import dbConnect from '../../lib/mongodb';
import Event from '../../models/Event';

export async function getServerSideProps() {
  try {
    await dbConnect();
    const todayString = new Date().toISOString().split('T')[0];
    const raw = await Event.find({ status: 'Upcoming', date: { $gte: todayString } }, {
      title: 1,
      description: 1,
      date: 1,
      time: 1,
      venue: 1,
      category: 1,
      registrationLink: 1,
      status: 1,
      featured: 1
    }).sort({ date: 1 }).lean();
    return { props: { initialEvents: JSON.parse(JSON.stringify(raw)) } };
  } catch (err) {
    console.error('Events getServerSideProps error:', err.message);
    return { props: { initialEvents: [] } };
  }
}

export default function EventsPage({ initialEvents }) {
  const [events, setEvents] = useState(initialEvents || []);
  const [filteredEvents, setFilteredEvents] = useState(initialEvents || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch events from MongoDB via API — single source of truth
  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/events', { cache: 'no-store' });
      const data = await res.json();

      if (data.success && data.data) {
        const todayString = new Date().toISOString().split('T')[0];
        const upcomingOnly = data.data.filter(e => e.status === 'Upcoming' && e.date >= todayString);
        setEvents(upcomingOnly);
        setFilteredEvents(upcomingOnly);
      } else {
        // API responded but with an error — show it, do NOT use localStorage
        setError(data.message || 'Unable to load events. Please try again.');
        setEvents([]);
        setFilteredEvents([]);
      }
    } catch (err) {
      console.error('fetchEvents error:', err);
      setError('Unable to load events. Please try again.');
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };


  // Filter logic with custom mappings
  useEffect(() => {
    let result = events;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
      );
    }

    // Filter by category with mappings
    if (categoryFilter !== 'All') {
      result = result.filter(e => {
        const cat = e.category;
        switch (categoryFilter) {
          case 'Workshops': return cat === 'Workshop';
          case 'Hackathons': return cat === 'Hackathon';
          case 'Bootcamp': return cat === 'Bootcamp';
          case 'Tech Talks': return cat === 'Talk' || cat === 'Seminar' || cat === 'Conference';
          case 'Competitions': return cat === 'Competition' || cat === 'Sports';
          case 'Community': return cat === 'Other' || cat === 'Cultural';
          default: return true;
        }
      });
    }

    setFilteredEvents(result);
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, events]);

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setCurrentPage(1);
  };

  const filterCategories = ['All', 'Workshops', 'Hackathons', 'Bootcamp', 'Tech Talks', 'Competitions', 'Community'];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  return (
    <div style={{
      backgroundColor: isDark ? '#08080C' : '#F8F7FF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background-color 300ms ease, color 300ms ease',
      position: 'relative'
    }}>
      <Head>
        <title>Upcoming Events | MSC Events</title>
        <meta name="description" content="Browse upcoming events organized by the Microsoft Student Chapter at IGDTUW." />
      </Head>

      <Navbar />

      <main style={{ flex: 1, marginTop: '72px', padding: '80px 8%', zIndex: 10 }}>
        {/* Page Header */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>EXPERIENCES</span>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '800',
            color: isDark ? '#FFFFFF' : '#111111',
            letterSpacing: '-0.02em',
            marginTop: '10px',
            marginBottom: '8px'
          }}>
            UPCOMING EVENTS
          </h1>
          <p style={{
            fontSize: '15px',
            color: isDark ? '#A1A1AA' : '#6B7280',
            fontWeight: '400'
          }}>
            Explore workshops, hackathons, talks and bootcamps organized by the MSC society.
          </p>
        </div>

        {/* Filter Bar & Search Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '48px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }} className="filters-search-row">

            {/* Category Filter Buttons */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }} className="horizontal-filter-list">
              {filterCategories.map((cat) => {
                const isActive = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      height: '36px',
                      padding: '0 16px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '700',
                      border: isActive ? 'none' : (isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5'),
                      backgroundColor: isActive
                        ? '#6D3DF5'
                        : (isDark ? '#111116' : '#FFFFFF'),
                      color: isActive ? '#FFFFFF' : (isDark ? '#A1A1AA' : '#6B7280'),
                      cursor: 'pointer',
                      transition: 'all 200ms ease'
                    }}
                    className="filter-btn-style"
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input Box */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '280px'
            }} className="search-box-wrapper">
              <Search size={14} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF'
              }} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '38px',
                  backgroundColor: isDark ? '#111116' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5',
                  borderRadius: '6px',
                  padding: '0 12px 0 34px',
                  fontSize: '13px',
                  color: isDark ? '#FFFFFF' : '#111111',
                  outline: 'none',
                  transition: 'all 250ms ease'
                }}
                className="search-input-focus"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="event-grid-container">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                height: '410px',
                backgroundColor: isDark ? '#111116' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5',
                borderRadius: '10px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }} className="animate-pulse">
                <div style={{ height: '180px', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F3F4F6' }} />
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ height: '16px', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#E5E7EB', borderRadius: '4px', width: '80%' }} />
                    <div style={{ height: '16px', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#E5E7EB', borderRadius: '4px', width: '50%' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ height: '12px', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F3F4F6', borderRadius: '4px', width: '70%' }} />
                    <div style={{ height: '12px', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F3F4F6', borderRadius: '4px', width: '40%' }} />
                  </div>
                  <div style={{ height: '36px', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#E5E7EB', borderRadius: '6px', width: '100%' }} />
                </div>
              </div>
            ))}
          </div>

        ) : error ? (
          /* Error State — no mock events, no fake data */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 24px',
            backgroundColor: isDark ? '#111116' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5',
            borderRadius: '10px',
            textAlign: 'center',
            gap: '16px'
          }}>
            <AlertTriangle size={36} style={{ color: '#EF4444' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111' }}>Unable to load events</h3>
            <p style={{ fontSize: '13px', color: isDark ? '#A1A1AA' : '#6B7280', maxWidth: '300px' }}>
              {error}
            </p>
            <button
              onClick={fetchEvents}
              style={{
                height: '38px',
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
              <RefreshCw size={13} />
              <span>Try Again</span>
            </button>
          </div>

        ) : filteredEvents.length === 0 ? (
          /* Empty state — MongoDB has no upcoming events */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 24px',
            backgroundColor: isDark ? '#111116' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5',
            borderRadius: '10px',
            textAlign: 'center',
            gap: '16px',
            transition: 'all 300ms ease'
          }}>
            <Info size={36} style={{ color: '#9CA3AF' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111' }}>
              {searchQuery || categoryFilter !== 'All' ? 'No events found' : 'No upcoming events at the moment'}
            </h3>
            <p style={{ fontSize: '13px', color: isDark ? '#A1A1AA' : '#6B7280', maxWidth: '300px' }}>
              {searchQuery || categoryFilter !== 'All'
                ? "We couldn't find any events matching your search query or filter."
                : 'Check back soon for upcoming events organized by the MSC society.'}
            </p>
            {(searchQuery || categoryFilter !== 'All') && (
              <button
                onClick={clearFilters}
                style={{
                  height: '38px',
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
                <RefreshCw size={13} />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

        ) : (
          <>
            <div className="event-grid-container">
              {currentItems.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '48px' }}>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '700',
                      border: pageNum === currentPage ? 'none' : (isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5'),
                      backgroundColor: pageNum === currentPage ? '#6D3DF5' : (isDark ? '#111116' : '#FFFFFF'),
                      color: pageNum === currentPage ? '#FFFFFF' : (isDark ? '#A1A1AA' : '#6B7280'),
                      cursor: 'pointer',
                      transition: 'all 200ms ease'
                    }}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Responsive grids styling */}
      <style jsx global>{`
        .search-input-focus:focus {
          border-color: #6D3DF5 !important;
          box-shadow: 0 0 10px rgba(109, 61, 245, 0.12) !important;
        }
        .filter-btn-style:hover {
          border-color: #6D3DF5 !important;
          color: ${isDark ? '#FFFFFF' : '#6D3DF5'} !important;
        }
        .event-grid-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .event-grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .event-grid-container {
            grid-template-columns: 1fr !important;
          }
          .search-box-wrapper {
            max-width: 100% !important;
          }
          .filters-search-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .horizontal-filter-list {
            width: 100% !important;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
