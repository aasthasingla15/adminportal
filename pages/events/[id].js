import Head from 'next/head';
import Link from 'next/link';
import { Calendar, MapPin, Tag, ArrowUpRight, ArrowLeft, Clock } from 'lucide-react';
import dbConnect from '../../lib/mongodb';
import Event from '../../models/Event';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';

export async function getServerSideProps(context) {
  const { id } = context.params;

  const mockEvents = [
    {
      _id: 'mock-1',
      title: 'Azure Cloud Dev Summit',
      description: 'Deep dive into cloud native architectures, serverless computing, and hands-on deployment with Microsoft Azure.',
      date: '2026-09-18',
      time: '10:00 AM',
      venue: 'Auditorium 1, IGDTUW',
      category: 'Workshop',
      bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      registrationLink: 'https://mscigdtuw.vercel.app/',
      status: 'Upcoming',
      featured: true
    },
    {
      _id: 'mock-2',
      title: 'Imagine Cup Hackathon',
      description: 'The premier student technology competition. Build prototypes, solve global challenges, and win mentorship from Microsoft experts.',
      date: '2026-09-22',
      time: '09:00 AM',
      venue: 'Tech Hall, IGDTUW',
      category: 'Hackathon',
      bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
      registrationLink: 'https://mscigdtuw.vercel.app/',
      status: 'Upcoming',
      featured: false
    },
    {
      _id: 'mock-3',
      title: 'AI/ML Innovation Bootcamp',
      description: 'Comprehensive bootcamp on modern machine learning techniques, neural networks, and model deployment.',
      date: '2026-09-28',
      time: '11:00 AM',
      venue: 'Lab 3, IGDTUW',
      category: 'Bootcamp',
      bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      registrationLink: 'https://mscigdtuw.vercel.app/',
      status: 'Upcoming',
      featured: false
    },
    {
      _id: 'mock-4',
      title: 'Algorithmic Coding Showdown',
      description: 'Showcase your competitive programming skills in this intense multi-round algorithm sprint.',
      date: '2026-10-05',
      time: '02:00 PM',
      venue: 'CS Department, IGDTUW',
      category: 'Competition',
      bannerImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
      registrationLink: 'https://mscigdtuw.vercel.app/',
      status: 'Upcoming',
      featured: false
    }
  ];

  if (String(id).startsWith('mock-')) {
    const foundMock = mockEvents.find(e => e._id === id);
    if (foundMock) {
      return { props: { event: foundMock } };
    }
  }

  try {
    await dbConnect();
    const event = await Event.findById(id);
    if (!event) {
      const foundMock = mockEvents.find(e => e._id === id) || mockEvents[0];
      return { props: { event: foundMock } };
    }
    return {
      props: {
        event: JSON.parse(JSON.stringify(event))
      }
    };
  } catch (err) {
    console.error('Fetch event props error, loading mock fallback:', err);
    const foundMock = mockEvents.find(e => e._id === id) || mockEvents[0];
    return {
      props: {
        event: foundMock
      }
    };
  }
}

export default function EventDetailPage({ event }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
        <title>{event.title} | MSC Events</title>
        <meta name="description" content={event.description.slice(0, 150)} />
      </Head>

      <Navbar />

      <main style={{ flex: 1, marginTop: '72px', zIndex: 10 }}>
        
        {/* Large Banner Top */}
        <div style={{
          width: '100%',
          height: '350px',
          position: 'relative',
          backgroundColor: '#08080C',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #ECEAF5'
        }} className="detail-banner-box">
          <img 
            src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'} 
            alt={event.title} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isDark ? 0.5 : 0.75
            }}
          />
          {/* Back Button floating */}
          <Link href="/events" style={{
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
            boxShadow: 'none',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}>
            <ArrowLeft size={14} />
            <span>Back to Events</span>
          </Link>
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
              {event.category}
            </span>
            
            <h1 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: isDark ? '#FFFFFF' : '#111111',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              transition: 'color 300ms ease'
            }}>
              {event.title}
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
                {event.description}
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
              boxShadow: 'none',
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
                    <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#FFFFFF' : '#111111' }}>{formatDate(event.date)}</span>
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
                    <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#FFFFFF' : '#111111' }}>{event.time}</span>
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
                    <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#FFFFFF' : '#111111' }}>{event.venue}</span>
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
                    <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#FFFFFF' : '#111111' }}>{event.category}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <a 
                href={event.registrationLink} 
                target="_blank" 
                rel="noopener noreferrer" 
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
          }
          .detail-banner-box {
            height: 250px !important;
          }
        }
      `}</style>
    </div>
  );
}


