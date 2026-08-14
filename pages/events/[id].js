import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Tag, ArrowUpRight, ArrowLeft, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import dbConnect from '../../lib/mongodb';
import Event from '../../models/Event';

// Skeleton Loader Component
function EventSkeleton({ isDark }) {
  return (
    <div style={{
      backgroundColor: isDark ? '#08080C' : '#F8F7FF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      animation: 'pulse 2s infinite'
    }}>
      <Navbar />
      <div style={{ marginTop: '72px', flex: 1 }}>
        <div style={{
          width: '100%',
          height: '350px',
          backgroundColor: isDark ? '#1a1a24' : '#e5e5f0',
          animation: 'pulse 2s infinite'
        }} />
        <div style={{ padding: '50px 8%', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '60fr 40fr', gap: '48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ width: '150px', height: '20px', backgroundColor: isDark ? '#1a1a24' : '#e5e5f0', borderRadius: '4px', animation: 'pulse 2s infinite' }} />
            <div style={{ width: '60%', height: '40px', backgroundColor: isDark ? '#1a1a24' : '#e5e5f0', borderRadius: '4px', animation: 'pulse 2s infinite' }} />
            <div style={{ width: '100%', height: '120px', backgroundColor: isDark ? '#1a1a24' : '#e5e5f0', borderRadius: '4px', animation: 'pulse 2s infinite' }} />
          </div>
          <div style={{ width: '100%', height: '250px', backgroundColor: isDark ? '#1a1a24' : '#e5e5f0', borderRadius: '8px', animation: 'pulse 2s infinite' }} />
        </div>
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function EventDetailPage({ event: initialEvent, error: initialError }) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [event, setEvent] = useState(initialEvent || null);
  const [loading, setLoading] = useState(!initialEvent);
  const [error, setError] = useState(initialError || '');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (_) {
      return dateStr;
    }
  };

  useEffect(() => {
    const { id } = router.query;
    if (!id || event) return;

    let cancelled = false;
    setLoading(true);
    setError('');

    // Fast fetch with aggressive timeout
    fetch(`/api/events/${id}`, { 
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && json.data) {
          setEvent(json.data);
        } else {
          setError(json.message || 'Unable to load event.');
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Event fetch error:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [router.query, event]);

  // Show skeleton while loading
  if (!event && loading && !error) {
    return <EventSkeleton isDark={isDark} />;
  }

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
        <title>{event ? `${event.title} | MSC Events` : 'Loading...'} </title>
        <meta name="description" content={event && event.description ? event.description.slice(0, 150) : ''} />
      </Head>

      <Navbar />

      <main style={{ flex: 1, marginTop: '72px', zIndex: 10 }}>

        {/* Large Banner Top */}
        <div style={{
          width: '100%',
          height: '350px',
          position: 'relative',
          backgroundColor: '#08080C',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #ECEAF5',
          overflow: 'hidden'
        }} className="detail-banner-box">
          {event && event.bannerImage ? (
            <picture>
              <img
                src={event.bannerImage}
                alt={event.title}
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: isDark ? 0.5 : 0.75,
                  backfaceVisibility: 'hidden',
                  willChange: 'transform',
                  contentVisibility: 'auto'
                }}
              />
            </picture>
          ) : (
            <div style={{ width: '100%', height: '100%', background: isDark ? '#0B0B0F' : '#F3F4F6' }} />
          )}

          {/* Back Button floating */}
          <button onClick={() => router.back()} style={{
            position: 'absolute',
            top: '24px',
            left: '8%',
            backgroundColor: isDark ? '#111116' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '700',
            color: isDark ? '#8B5CF6' : '#6D3DF5',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}>
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        </div>

        {/* Content Layout Grid */}
        <div style={{
          padding: '50px 8% 80px 8%',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '60fr 40fr',
          gap: '48px'
        }} className="detail-layout-grid">

          {/* Left Column: Title + Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Category badge */}
            <span style={{
              alignSelf: 'flex-start',
              backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(109, 61, 245, 0.08)',
              color: isDark ? '#A78BFA' : '#6D3DF5',
              border: `1px solid ${isDark ? '#A78BFA' : '#6D3DF5'}20`,
              fontSize: '11px',
              fontWeight: '800',
              padding: '4px 10px',
              borderRadius: '4px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              {event ? event.category : ''}
            </span>

            <h1 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: isDark ? '#FFFFFF' : '#111111',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              transition: 'color 300ms ease'
            }}>
              {event ? event.title : (loading ? 'Loading...' : 'Event')}
            </h1>

            <div style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #ECEAF5', paddingBottom: '10px' }} />

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', marginBottom: '12px' }}>About this Event</h3>
              <p style={{
                fontSize: '15px',
                color: isDark ? '#A1A1AA' : '#6B7280',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                transition: 'color 300ms ease'
              }}>
                {event ? event.description : (loading ? 'Loading event details...' : 'Unable to load event.')}
              </p>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div>
            <div style={{
              backgroundColor: isDark ? '#111116' : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5',
              borderRadius: '8px',
              padding: '28px',
              position: 'sticky',
              top: '110px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              transition: 'all 300ms ease'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111' }}>Event Details</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : '#F0EDFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDark ? '#A78BFA' : '#6D3DF5'
                  }}>
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: isDark ? '#A1A1AA' : '#9CA3AF', fontWeight: '750', textTransform: 'uppercase' }}>Date</p>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#FFFFFF' : '#111111' }}>{event ? formatDate(event.date) : ''}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : '#F0EDFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDark ? '#A78BFA' : '#6D3DF5'
                  }}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: isDark ? '#A1A1AA' : '#9CA3AF', fontWeight: '750', textTransform: 'uppercase' }}>Time</p>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#FFFFFF' : '#111111' }}>{event ? event.time : ''}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : '#F0EDFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDark ? '#A78BFA' : '#6D3DF5'
                  }}>
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: isDark ? '#A1A1AA' : '#9CA3AF', fontWeight: '750', textTransform: 'uppercase' }}>Venue</p>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#FFFFFF' : '#111111' }}>{event ? event.venue : ''}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : '#F0EDFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDark ? '#A78BFA' : '#6D3DF5'
                  }}>
                    <Tag size={16} />
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: isDark ? '#A1A1AA' : '#9CA3AF', fontWeight: '750', textTransform: 'uppercase' }}>Category</p>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#FFFFFF' : '#111111' }}>{event ? event.category : ''}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <a
                href={event ? event.registrationLink : '#'}
                target={event ? '_blank' : undefined}
                rel={event ? 'noopener noreferrer' : undefined}
                style={{
                  height: '46px',
                  background: 'linear-gradient(135deg, #6D3DF5 0%, #8B5CF6 100%)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '700',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(109, 61, 245, 0.25)',
                  marginTop: '10px',
                  cursor: 'pointer',
                  transition: 'opacity 250ms ease'
                }}
                className="btn-register-hover"
              >
                <span>Register Now</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />

      <style jsx global>{`
        .btn-register-hover:hover {
          opacity: 0.92;
        }
        @media (max-width: 1024px) {
          .detail-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            padding: 40px 5% 60px 5% !important;
          }
          .detail-banner-box {
            height: 280px !important;
          }
        }
        @media (max-width: 768px) {
          .detail-layout-grid {
            gap: 24px !important;
            padding: 32px 4% 48px 4% !important;
          }
          .detail-banner-box {
            height: 220px !important;
          }
        }
        @media (max-width: 480px) {
          .detail-layout-grid {
            gap: 20px !important;
            padding: 24px 3% 40px 3% !important;
          }
          .detail-banner-box {
            height: 180px !important;
          }
          h1 {
            font-size: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}

// Pre-render event pages at build time (ISR)
export async function getStaticPaths() {
  try {
    await dbConnect();
    const events = await Event.find({ status: 'Upcoming' }).select('_id').lean().limit(10);
    
    const paths = events.map((event) => ({
      params: { id: event._id.toString() }
    }));

    return {
      paths,
      fallback: 'blocking' // Generate new pages on demand
    };
  } catch (err) {
    console.error('getStaticPaths error:', err);
    return { paths: [], fallback: 'blocking' };
  }
}

// Fetch and cache event data with ISR (Incremental Static Regeneration)
export async function getStaticProps({ params }) {
  try {
    await dbConnect();
    const event = await Event.findById(params.id).lean();
    
    if (!event) {
      return {
        notFound: true,
        revalidate: 300
      };
    }

    return {
      props: {
        event: JSON.parse(JSON.stringify(event)),
        error: null
      },
      revalidate: 1800 // Revalidate every 30 minutes
    };
  } catch (err) {
    console.error(`getStaticProps error for ${params.id}:`, err.message);
    return {
      props: {
        event: null,
        error: 'Unable to load event.'
      },
      revalidate: 300
    };
  }
}
