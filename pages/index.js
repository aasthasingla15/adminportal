import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Sparkles, Calendar, Users, MapPin, ArrowRight, ArrowDown, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { useTheme } from '../context/ThemeContext';
import dbConnect from '../lib/mongodb';
import Event from '../models/Event';

const normalizeEventStatus = (value) => {
  const status = (value || '').toString().trim();
  if (!status) return 'Upcoming';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const isPublicVisibleEvent = (event) => {
  const status = normalizeEventStatus(event?.status);
  if (status === 'Draft') return false;

  if (!event?.date) return true;

  const eventDate = new Date(event.date);
  if (Number.isNaN(eventDate.getTime())) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
};

export async function getStaticProps() {
  try {
    await dbConnect();
    const rawEvents = await Event.find({}).sort({ date: 1 }).lean();
    const events = JSON.parse(JSON.stringify(rawEvents)).filter(isPublicVisibleEvent);

    let featuredEvent = events.find(e => e.featured === true) || null;
    if (!featuredEvent && events.length > 0) {
      featuredEvent = events[0];
    }

    return {
      props: {
        upcomingEvents: events,
        featuredEvent,
        fromDb: true
      },
      revalidate: 60
    };
  } catch (err) {
    console.error('Fetch home props error:', err);
    return {
      props: {
        upcomingEvents: [],
        featuredEvent: null,
        fromDb: false,
        error: 'Unable to load events. Please try again.'
      },
      revalidate: 30
    };
  }
}

const buildResponsiveImageUrl = (url, width = 1200) => {
  if (!url || url.startsWith('data:')) return url;
  if (!url.startsWith('http')) return url;

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}auto=format&fit=crop&w=${width}&q=80`;
};

export default function Home({ upcomingEvents, featuredEvent, fromDb }) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeEvents, setActiveEvents] = useState(upcomingEvents);
  const [activeFeatured, setActiveFeatured] = useState(featuredEvent);
  const featuredImage = buildResponsiveImageUrl(activeFeatured?.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80', 1400);

  const [revealedSections, setRevealedSections] = useState({
    philosophy: false,
    happening: false,
    featured: false,
    gallery: false
  });

  // No localStorage or mock fallback — rely only on MongoDB via server-side props

  useEffect(() => {
    const handleReveal = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.88;
      
      const philosophyEl = document.getElementById('section-philosophy');
      const happeningEl = document.getElementById('section-happening');
      const featuredEl = document.getElementById('section-featured');
      const galleryEl = document.getElementById('section-gallery');

      setRevealedSections(prev => ({
        philosophy: philosophyEl ? scrollPos > philosophyEl.offsetTop : prev.philosophy,
        happening: happeningEl ? scrollPos > happeningEl.offsetTop : prev.happening,
        featured: featuredEl ? scrollPos > featuredEl.offsetTop : prev.featured,
        gallery: galleryEl ? scrollPos > galleryEl.offsetTop : prev.gallery
      }));
    };

    window.addEventListener('scroll', handleReveal);
    setTimeout(handleReveal, 100); // Trigger once on mount after render
    return () => window.removeEventListener('scroll', handleReveal);
  }, []);

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

  return (
    <div style={{ 
      backgroundColor: isDark ? '#08080C' : '#F8F7FF', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'background-color 300ms ease, color 300ms ease',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <Head>
        <title>MSC Events | Discover, Connect & Grow</title>
        <meta name="description" content="Explore exciting workshops, hackathons, talks and experiences organized by the Microsoft Student Chapter at IGDTUW." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      {/* Cinematic Fullscreen Background Video */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1,
        overflow: 'hidden',
        backgroundColor: '#08080C'
      }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.95
          }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* Dark Editorial Gradient Overlay (Lightened) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(8,8,12,0.35) 0%, rgba(8,8,12,0.15) 50%, rgba(8,8,12,0.0) 100%), linear-gradient(180deg, rgba(8,8,12,0.0) 0%, rgba(8,8,12,0.35) 100%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Hero Section Container (100vh Viewport) */}
      <section style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8%',
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'transparent'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px',
          maxWidth: '650px',
          marginTop: '60px'
        }} className="reveal-animate">
          {/* Eyebrow badge */}
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            color: '#8B5CF6',
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>
            DISCOVER • CONNECT • GROW
          </span>

          {/* Heading */}
          <h1 style={{
            fontSize: '72px',
            fontWeight: '800',
            lineHeight: '1.05',
            letterSpacing: '-0.03em',
            color: '#FFFFFF'
          }} className="hero-title">
            EVENTS THAT<br />
            <span style={{ color: '#8B5CF6' }}>INSPIRE.</span>
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '15px',
            lineHeight: '1.7',
            color: '#E4E4E7',
            maxWidth: '520px',
            fontWeight: '400'
          }}>
            Explore workshops, hackathons, talks, bootcamps and experiences organized by the Microsoft Student Chapter at IGDTUW.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }} className="hero-buttons-wrapper">
            <button 
              onClick={() => router.push('/events')}
              style={{
                height: '48px',
                padding: '0 24px',
                background: 'linear-gradient(135deg, #6D3DF5 0%, #8B5CF6 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(109, 61, 245, 0.35)',
                transition: 'opacity 200ms ease'
              }}
              className="btn-primary-hover"
            >
              <span>Explore Events</span>
              <ArrowRight size={15} />
            </button>
            
            <button 
              onClick={() => router.push('/about')}
              style={{
                height: '48px',
                padding: '0 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
              className="btn-secondary-hover"
            >
              Discover MSC
            </button>
          </div>
        </div>

        {/* Scroll To Explore */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '8%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255, 255, 255, 0.65)',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.1em'
        }} className="animate-bounce-slow">
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown size={14} />
        </div>
      </section>

      {/* Main content body starting below viewport */}
      <main style={{ flex: 1, zIndex: 10, position: 'relative', backgroundColor: isDark ? '#08080C' : '#F8F7FF' }}>
        
        {/* 2. EVENT TICKER */}
        <div 
          className="ticker-wrapper"
          style={{
            backgroundColor: isDark ? '#111116' : '#FFFFFF',
            borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #ECEAF5',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #ECEAF5',
            padding: '16px 0',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div className="ticker-marquee">
            {[1, 2].map((group) => (
              <div key={group} style={{ display: 'flex', gap: '32px', paddingRight: '32px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ✦ UPCOMING EVENTS
                </span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#A1A1AA' : '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>• HACKATHONS</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#A1A1AA' : '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>• WORKSHOPS</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#A1A1AA' : '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>• TECH TALKS</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#A1A1AA' : '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>• BOOTCAMPS</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#A1A1AA' : '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>• COMPETITIONS</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#A1A1AA' : '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>• COMMUNITY</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. UPCOMING EVENTS */}
        <section 
          id="section-happening"
          style={{
            padding: '100px 8%',
            backgroundColor: isDark ? '#08080C' : '#F8F7FF',
            opacity: revealedSections.happening ? 1 : 0,
            transform: revealedSections.happening ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 800ms ease, transform 800ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '48px',
            maxWidth: '1440px',
            margin: '0 auto 48px auto',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>UPCOMING SESSIONS</span>
              <h2 style={{ fontSize: '38px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', marginTop: '12px', letterSpacing: '-0.02em' }}>WHAT'S HAPPENING</h2>
            </div>
            <button 
              onClick={() => router.push('/events')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '14px',
                fontWeight: '700',
                color: isDark ? '#8B5CF6' : '#6D3DF5',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              className="view-all-events-btn"
            >
              <span>View All Events</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            {activeEvents.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#9CA3AF' }}>
                No upcoming events listed at the moment. Check back soon!
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '24px'
              }} className="upcoming-events-grid">
                {activeEvents.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. MSC STATS */}
        <section 
          id="section-stats"
          style={{
            padding: '80px 8%',
            backgroundColor: isDark ? '#111116' : '#FFFFFF',
            borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid #ECEAF5',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid #ECEAF5',
            transition: 'all 300ms ease'
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }} className="stats-grid">
            {[
              { label: 'Events Hosted', value: '45+' },
              { label: 'Student Registrations', value: '1,240+' },
              { label: 'Technical Mentors', value: '15+' },
              { label: 'Core Chapters', value: '6+' }
            ].map((stat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '40px', fontWeight: '800', color: '#8B5CF6' }}>{stat.value}</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#A1A1AA' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FEATURED EVENT */}
        {activeFeatured && (
          <section 
            id="section-featured"
            style={{
              padding: '100px 8%',
              maxWidth: '1440px',
              margin: '0 auto',
              opacity: revealedSections.featured ? 1 : 0,
              transform: revealedSections.featured ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 800ms ease, transform 800ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ marginBottom: '40px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>HIGHLIGHTED EXPERIENCE</span>
              <h2 style={{ fontSize: '38px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', marginTop: '12px', letterSpacing: '-0.02em' }}>FEATURED EVENT</h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '55fr 45fr',
              backgroundColor: isDark ? '#111116' : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5',
              borderRadius: '12px',
              overflow: 'hidden'
            }} className="featured-event-layout">
              {/* Left Column: Banner */}
              <div style={{ position: 'relative', height: '420px', width: '100%' }}>
                <img 
                  src={featuredImage}
                  srcSet={`${buildResponsiveImageUrl(activeFeatured.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80', 600)} 600w, ${buildResponsiveImageUrl(activeFeatured.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80', 1000)} 1000w, ${buildResponsiveImageUrl(activeFeatured.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80', 1600)} 1600w`}
                  sizes="(max-width: 768px) 100vw, 55vw"
                  alt={activeFeatured.title}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
              </div>

              {/* Right Column: Information */}
              <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <span style={{
                    alignSelf: 'flex-start',
                    backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(109, 61, 245, 0.08)',
                    color: isDark ? '#A78BFA' : '#6D3DF5',
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    {activeFeatured.category}
                  </span>

                  <h3 style={{ fontSize: '28px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', lineHeight: '1.2' }}>{activeFeatured.title}</h3>
                  
                  <p style={{ fontSize: '14px', color: isDark ? '#A1A1AA' : '#6B7280', lineHeight: '1.7' }}>
                    {activeFeatured.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: isDark ? '#A1A1AA' : '#6B7280' }}>
                      <Calendar size={14} style={{ color: '#8B5CF6' }} />
                      <span>{formatDate(activeFeatured.date)} • {activeFeatured.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: isDark ? '#A1A1AA' : '#6B7280' }}>
                      <MapPin size={14} style={{ color: '#8B5CF6' }} />
                      <span>{activeFeatured.venue}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
                  <a 
                    href={activeFeatured.registrationLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      height: '46px',
                      padding: '0 24px',
                      background: 'linear-gradient(135deg, #6D3DF5 0%, #8B5CF6 100%)',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      textDecoration: 'none'
                    }}
                    className="btn-primary-hover"
                  >
                    <span>Register Now</span>
                    <ExternalLink size={14} />
                  </a>
                  <button 
                    onClick={() => router.push(`/events/${activeFeatured._id}`)}
                    style={{
                      height: '46px',
                      padding: '0 20px',
                      backgroundColor: 'transparent',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #ECEAF5',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      fontWeight: '600',
                      color: isDark ? '#FFFFFF' : '#111111',
                      cursor: 'pointer'
                    }}
                  >
                    Event Details
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 6. DECIDE • LEARN • APPLY */}
        <section 
          id="section-philosophy"
          style={{
            padding: '100px 8%',
            maxWidth: '1440px',
            margin: '0 auto',
            opacity: revealedSections.philosophy ? 1 : 0,
            transform: revealedSections.philosophy ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 800ms ease, transform 800ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '40fr 60fr', gap: '48px', marginBottom: '60px' }} className="philosophy-header">
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>OUR PHILOSOPHY</span>
              <h2 style={{ fontSize: '38px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', marginTop: '12px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>GROW BEYOND LIMITS</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontSize: '15px', color: isDark ? '#A1A1AA' : '#6B7280', lineHeight: '1.7', fontWeight: '400' }}>
                Microsoft Student Chapter at IGDTUW helps students build key skills through technical guidance, mentorship from seniors, peer programming, and specialized community events.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }} className="philosophy-grid">
            {[
              { num: '01', title: 'DECIDE', desc: 'Find the right direction and opportunities in technology.' },
              { num: '02', title: 'LEARN', desc: 'Acquire insights through workshops, bootcamps and exclusive events.' },
              { num: '03', title: 'APPLY', desc: 'Turn conceptual knowledge into practical software products and projects.' }
            ].map((pillar) => (
              <div 
                key={pillar.title} 
                style={{
                  backgroundColor: isDark ? '#111116' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #ECEAF5',
                  borderRadius: '10px',
                  padding: '40px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  transition: 'all 300ms ease'
                }}
                className="philosophy-card"
              >
                <span style={{ fontSize: '32px', fontWeight: '800', color: '#8B5CF6', opacity: 0.8 }}>{pillar.num}</span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', letterSpacing: '-0.01em' }}>{pillar.title}</h3>
                <p style={{ fontSize: '13.5px', color: isDark ? '#A1A1AA' : '#6B7280', lineHeight: '1.6' }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. EVENT CATEGORIES */}
        <section 
          id="section-categories"
          style={{
            padding: '100px 8%',
            backgroundColor: isDark ? '#111116' : '#FFFFFF',
            borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid #ECEAF5',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid #ECEAF5',
            transition: 'all 300ms ease'
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>DEPARTMENTS</span>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', marginTop: '12px' }}>EVENT CATEGORIES</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="categories-card-grid">
              {[
                { name: 'Workshops', desc: 'Practical development labs on cloud, containers, and core frameworks.' },
                { name: 'Hackathons', desc: 'Rapid building sprints to iterate prototypes with student teams.' },
                { name: 'Bootcamps', desc: 'Cohort-based cohorts diving deep into backend/frontend architectures.' },
                { name: 'Tech Talks', desc: 'Expert seminars and panel discussions with industry professionals.' },
                { name: 'Competitions', desc: 'Algorithmic challenges, competitive hacking and system designs.' },
                { name: 'Community', desc: 'Peer-to-peer discussions, open-source panels and student core meetups.' }
              ].map((cat, idx) => (
                <div 
                  key={idx} 
                  onClick={() => router.push('/events')}
                  style={{
                    backgroundColor: isDark ? '#08080C' : '#F8F7FF',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #ECEAF5',
                    borderRadius: '8px',
                    padding: '28px',
                    cursor: 'pointer',
                    transition: 'all 250ms ease'
                  }}
                  className="category-box-hover"
                >
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', marginBottom: '8px' }}>{cat.name}</h4>
                  <p style={{ fontSize: '12.5px', color: isDark ? '#A1A1AA' : '#6B7280', lineHeight: '1.5' }}>{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. MSC EVENT MOMENTS / PHOTO GALLERY */}
        <section 
          id="section-gallery"
          style={{
            padding: '100px 8%',
            backgroundColor: isDark ? '#08080C' : '#F8F7FF',
            opacity: revealedSections.gallery ? 1 : 0,
            transform: revealedSections.gallery ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 800ms ease, transform 800ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ marginBottom: '48px', maxWidth: '1440px', margin: '0 auto 48px auto' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>GALLERY</span>
            <h2 style={{ fontSize: '38px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', marginTop: '12px', letterSpacing: '-0.02em' }}>MOMENTS AT MSC</h2>
          </div>

          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            <div className="gallery-masonry">
              {[
                { 
                  src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
                  title: 'Dev Workshop',
                  tag: 'Workshop 2026',
                  class: 'gallery-item-1'
                },
                { 
                  src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
                  title: 'Imagine Cup Hackathon',
                  tag: 'Hackathon 2025',
                  class: 'gallery-item-2'
                },
                { 
                  src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
                  title: 'MSC Tech Summit',
                  tag: 'Seminar 2026',
                  class: 'gallery-item-3'
                },
                { 
                  src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
                  title: 'Student Core Meetup',
                  tag: 'Community 2026',
                  class: 'gallery-item-4'
                }
              ].map((moment, i) => (
                <div 
                  key={i} 
                  className={`gallery-card ${moment.class}`}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <img 
                    src={moment.src} 
                    alt={moment.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                    className="gallery-image"
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(8, 8, 12, 0.45)',
                      opacity: 0,
                      transition: 'opacity 300ms ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '24px'
                    }}
                    className="gallery-hover-info"
                  >
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', letterSpacing: '0.05em' }}>{moment.tag}</span>
                    <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', marginTop: '4px' }}>{moment.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. CALL TO ACTION */}
        <section 
          id="section-cta"
          style={{
            padding: '100px 8%',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(109, 61, 245, 0.08) 0%, rgba(139, 92, 246, 0.03) 100%)',
            border: isDark ? '1px solid rgba(139, 92, 246, 0.15)' : '1px solid #ECEAF5',
            borderRadius: '8px',
            padding: '60px 40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', letterSpacing: '-0.02em' }}>ACCELERATE YOUR LEARNING</h2>
            <p style={{ fontSize: '14.5px', color: isDark ? '#A1A1AA' : '#6B7280', maxWidth: '600px', lineHeight: '1.7' }}>
              Connect with fellow developers, build practical projects, and gain guidance from industry professionals. Join Microsoft Student Chapter today.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <button 
                onClick={() => router.push('/events')}
                style={{
                  height: '44px',
                  padding: '0 24px',
                  backgroundColor: '#6D3DF5',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(109, 61, 245, 0.2)'
                }}
              >
                <span>Explore Events</span>
                <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => router.push('/contact')}
                style={{
                  height: '44px',
                  padding: '0 24px',
                  backgroundColor: 'transparent',
                  border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #ECEAF5',
                  borderRadius: '6px',
                  color: isDark ? '#FFFFFF' : '#111111',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      <style jsx global>{`
        .btn-primary-hover:hover {
          opacity: 0.92;
        }
        .btn-secondary-hover:hover {
          background-color: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
        .philosophy-card:hover {
          transform: translateY(-4px);
          border-color: ${isDark ? '#8B5CF6' : '#6D3DF5'} !important;
        }
        .category-box-hover:hover {
          transform: translateY(-3px);
          border-color: ${isDark ? '#8B5CF6' : '#6D3DF5'} !important;
        }
        .view-all-events-btn:hover span {
          text-decoration: underline;
        }
        .view-all-events-btn:hover {
          opacity: 0.85;
        }
        .gallery-masonry {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: repeat(2, 220px);
          gap: 20px;
        }
        .gallery-item-1 {
          grid-column: span 8;
          grid-row: span 1;
        }
        .gallery-item-2 {
          grid-column: span 4;
          grid-row: span 1;
        }
        .gallery-item-3 {
          grid-column: span 4;
          grid-row: span 1;
        }
        .gallery-item-4 {
          grid-column: span 8;
          grid-row: span 1;
        }
        .gallery-card:hover .gallery-image {
          transform: scale(1.05);
        }
        .gallery-card:hover .gallery-hover-info {
          opacity: 1 !important;
        }
        @media (max-width: 1024px) {
          .hero-title {
            font-size: 56px !important;
          }
          .upcoming-events-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .featured-event-layout {
            grid-template-columns: 1fr !important;
          }
          .philosophy-grid {
            grid-template-columns: 1fr !important;
          }
          .categories-card-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 42px !important;
          }
          .upcoming-events-grid {
            grid-template-columns: 1fr !important;
          }
          .featured-event-layout {
            border-radius: 16px !important;
            grid-template-columns: 1fr !important;
          }
          .featured-event-layout > div:first-child {
            height: 260px !important;
            min-height: 260px !important;
          }
          .featured-event-layout > div:last-child {
            padding: 32px 24px !important;
          }
          .featured-event-layout img {
            object-position: center center !important;
            transform: scale(1.02);
          }
          .philosophy-header {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .gallery-masonry {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .gallery-card {
            height: 220px !important;
          }
          .gallery-image {
            object-position: center !important;
          }
          .categories-card-grid {
            grid-template-columns: 1fr !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .hero-title {
            font-size: 32px !important;
          }
          .featured-event-layout > div:first-child {
            height: 200px !important;
            min-height: 200px !important;
          }
          .featured-event-layout > div:last-child {
            padding: 24px 16px !important;
          }
          .featured-event-layout h3 {
            font-size: 20px !important;
          }
          .featured-event-layout p {
            font-size: 13px !important;
          }
          .featured-event-layout {
            padding: 0 0 !important;
          }
          #section-featured {
            padding: 60px 4% !important;
          }
        }
      `}</style>
    </div>
  );
}


