import Link from 'next/link';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function EventCard({ event }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const categoryColors = {
    Workshop:    { bg: 'rgba(109,61,245,0.10)',  text: '#6D3DF5',  border: 'rgba(109,61,245,0.25)'  },
    Hackathon:   { bg: 'rgba(236,72,153,0.10)',  text: '#EC4899',  border: 'rgba(236,72,153,0.25)'  },
    Bootcamp:    { bg: 'rgba(59,130,246,0.10)',   text: '#3B82F6',  border: 'rgba(59,130,246,0.25)'  },
    Competition: { bg: 'rgba(245,158,11,0.10)',   text: '#F59E0B',  border: 'rgba(245,158,11,0.25)'  },
    Talk:        { bg: 'rgba(16,185,129,0.10)',   text: '#10B981',  border: 'rgba(16,185,129,0.25)'  },
    Seminar:     { bg: 'rgba(16,185,129,0.10)',   text: '#10B981',  border: 'rgba(16,185,129,0.25)'  },
    Cultural:    { bg: 'rgba(251,113,133,0.10)',  text: '#FB7185',  border: 'rgba(251,113,133,0.25)'  },
    Sports:      { bg: 'rgba(249,115,22,0.10)',   text: '#F97316',  border: 'rgba(249,115,22,0.25)'  },
    Conference:  { bg: 'rgba(139,92,246,0.10)',   text: '#8B5CF6',  border: 'rgba(139,92,246,0.25)'  },
    Other:       { bg: 'rgba(107,114,128,0.10)',  text: '#6B7280',  border: 'rgba(107,114,128,0.25)'  },
  };

  const colors = categoryColors[event.category] || categoryColors.Other;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + 'T00:00:00');
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (_) { return dateStr; }
  };

  const cardBg     = isDark ? '#16161E' : '#FFFFFF';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #ECEAF5';
  const titleClr   = isDark ? '#F4F4F5' : '#111111';
  const mutedClr   = isDark ? '#A1A1AA' : '#6B7280';
  const dividerClr = isDark ? 'rgba(255,255,255,0.07)' : '#F0EDFF';

  return (
    <>
      <div
        className="event-card-root"
        style={{
          backgroundColor: cardBg,
          border: cardBorder,
          borderRadius: '14px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'transform 320ms cubic-bezier(0.16,1,0.3,1), box-shadow 320ms ease, border-color 320ms ease',
        }}
      >
        {/* ── Banner Image ── */}
        <Link href={`/events/${event._id}`} style={{ display: 'block', textDecoration: 'none' }}>
          <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
            <img
              src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'}
              alt={event.title}
              loading="lazy"
              className="event-card-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 400ms ease' }}
            />
            {/* gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.40) 0%, transparent 55%)',
              pointerEvents: 'none'
            }} />
            {/* category pill badge */}
            <span style={{
              position: 'absolute', top: '12px', left: '12px',
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              fontSize: '10px', fontWeight: '800',
              padding: '4px 10px', borderRadius: '20px',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              backdropFilter: 'blur(6px)'
            }}>
              {event.category}
            </span>
          </div>
        </Link>

        {/* ── Content Body ── */}
        <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>

          {/* Title & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Link href={`/events/${event._id}`} style={{ textDecoration: 'none' }}>
              <h3
                className="event-card-title"
                style={{
                  fontSize: '16.5px', fontWeight: '800', color: titleClr,
                  lineHeight: '1.35', margin: 0,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  transition: 'color 250ms ease'
                }}
              >
                {event.title}
              </h3>
            </Link>
            <p style={{
              fontSize: '12.5px', color: mutedClr, lineHeight: '1.65', margin: 0,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
            }}>
              {event.description}
            </p>
          </div>

          {/* Meta: Date & Venue */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: mutedClr }}>
              <Calendar size={12} style={{ color: colors.text, flexShrink: 0 }} />
              <span>{formatDate(event.date)}{event.time ? ` · ${event.time}` : ''}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: mutedClr }}>
              <MapPin size={12} style={{ color: colors.text, flexShrink: 0 }} />
              <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {event.venue}
              </span>
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* ── Action Buttons ── */}
          <div style={{ borderTop: `1px solid ${dividerClr}`, paddingTop: '14px', display: 'flex', gap: '10px' }}>
            {/* REGISTER NOW — Core requirement from problem statement */}
            <a
              href={event.registrationLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="register-now-btn"
              style={{
                flex: 1,
                height: '40px',
                background: `linear-gradient(135deg, ${colors.text} 0%, ${colors.text}BB 100%)`,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                transition: 'opacity 200ms ease, transform 200ms ease',
                cursor: 'pointer'
              }}
            >
              <ExternalLink size={12} />
              Register Now
            </a>

            {/* Details link */}
            <Link
              href={`/events/${event._id}`}
              className="details-btn"
              style={{
                height: '40px',
                padding: '0 14px',
                border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid #ECEAF5',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                color: isDark ? '#A1A1AA' : '#6B7280',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                transition: 'all 200ms ease',
                whiteSpace: 'nowrap'
              }}
            >
              Details
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .event-card-root:hover {
          transform: translateY(-5px);
          box-shadow: ${isDark
            ? '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.25)'
            : '0 16px 40px rgba(109,61,245,0.12), 0 0 0 1px rgba(109,61,245,0.12)'};
          border-color: ${isDark ? 'rgba(139,92,246,0.4)' : '#C4B5FD'} !important;
        }
        .event-card-root:hover .event-card-img {
          transform: scale(1.06);
        }
        .event-card-root:hover .event-card-title {
          color: ${isDark ? '#A78BFA' : '#6D3DF5'} !important;
        }
        .register-now-btn:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }
        .details-btn:hover {
          border-color: ${isDark ? 'rgba(139,92,246,0.4)' : '#C4B5FD'} !important;
          color: ${isDark ? '#A78BFA' : '#6D3DF5'} !important;
        }
      `}</style>
    </>
  );
}


