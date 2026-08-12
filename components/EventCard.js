import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function EventCard({ event }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Helpers
  const getBadgeColor = (category) => {
    switch (category) {
      case 'Workshop': return isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(109, 61, 245, 0.08)';
      case 'Hackathon': return 'rgba(236, 72, 153, 0.12)';
      case 'Bootcamp': return isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(79, 124, 255, 0.08)';
      case 'Competition': return 'rgba(167, 139, 250, 0.15)';
      case 'Talk': return 'rgba(245, 158, 11, 0.12)';
      default: return 'rgba(107, 114, 128, 0.12)';
    }
  };

  const getBadgeTextColor = (category) => {
    switch (category) {
      case 'Workshop': return isDark ? '#A78BFA' : '#6D3DF5';
      case 'Hackathon': return '#EC4899';
      case 'Bootcamp': return isDark ? '#60A5FA' : '#3B82F6';
      case 'Competition': return '#A78BFA';
      case 'Talk': return '#F59E0B';
      default: return '#6B7280';
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

  return (
    <>
      <Link href={`/events/${event._id}`}>
        <div 
          className="event-card-container"
          style={{
            height: '410px',
            backgroundColor: isDark ? '#111116' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5',
            borderRadius: '10px',
            boxShadow: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            cursor: 'pointer',
            transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms ease, background-color 300ms ease'
          }}
        >
          {/* Card Top: Image & Badge */}
          <div style={{
            height: '180px',
            width: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img 
              src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'} 
              alt={event.title}
              className="event-card-image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
            {/* Subtle Overlay on top of image */}
            <div className="event-card-img-overlay" style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(109, 61, 245, 0)',
              transition: 'background-color 300ms ease',
              pointerEvents: 'none'
            }} />
            
            <span style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: getBadgeColor(event.category),
              border: `1px solid ${getBadgeTextColor(event.category)}20`,
              color: getBadgeTextColor(event.category),
              fontSize: '10px',
              fontWeight: '800',
              padding: '4px 10px',
              borderRadius: '4px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              {event.category}
            </span>
          </div>

          {/* Card Bottom: Content Body */}
          <div style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{
                fontSize: '17px',
                fontWeight: '800',
                color: isDark ? '#FFFFFF' : '#111111',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                transition: 'color 300ms ease'
              }}>
                {event.title}
              </h3>
              <p style={{
                fontSize: '12.5px',
                color: isDark ? '#A1A1AA' : '#6B7280',
                lineHeight: '1.6',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                transition: 'color 300ms ease'
              }}>
                {event.description}
              </p>
            </div>

            {/* Meta details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '8px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: isDark ? '#A1A1AA' : '#6B7280' }}>
                <Calendar size={13} style={{ color: isDark ? '#8B5CF6' : '#6D3DF5' }} />
                <span>{formatDate(event.date)} • {event.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: isDark ? '#A1A1AA' : '#6B7280' }}>
                <MapPin size={13} style={{ color: isDark ? '#8B5CF6' : '#6D3DF5' }} />
                <span>{event.venue}</span>
              </div>
            </div>

            {/* CTA Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F0EDFF',
              fontSize: '13px',
              fontWeight: '700',
              color: isDark ? '#8B5CF6' : '#6D3DF5',
              transition: 'color 250ms ease'
            }} className="event-card-cta-row">
              <span>View Details</span>
              <ArrowRight size={14} className="event-card-arrow" style={{ transition: 'transform 250ms ease' }} />
            </div>
          </div>
        </div>
      </Link>

      <style jsx global>{`
        .event-card-container:hover {
          transform: translateY(-4px);
          border-color: ${isDark ? '#8B5CF6' : '#6D3DF5'} !important;
        }
        .event-card-container:hover .event-card-image {
          transform: scale(1.04);
        }
        .event-card-container:hover .event-card-img-overlay {
          background-color: rgba(109, 61, 245, 0.08) !important;
        }
        .event-card-container:hover .event-card-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </>
  );
}


