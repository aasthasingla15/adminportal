import { useState } from 'react';
import { useRouter } from 'next/router';
import { FileText, Calendar, MapPin, Tag, Link as LinkIcon, ImageIcon, Loader2, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../../components/AdminLayout';
import LiveEventCardPreview from '../../../components/EventCard';

export default function AdminCreateEventPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('Workshop');
  const [bannerImage, setBannerImage] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [status, setStatus] = useState('Upcoming');
  const [featured, setFeatured] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  const router = useRouter();

  const showToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerImage(reader.result);
      showToast('success', 'Banner image uploaded successfully.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerImage(reader.result);
      showToast('success', 'Banner image dropped successfully.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) return setError('Event Title is required.');
    if (!description.trim()) return setError('Event Description is required.');
    if (!date.trim()) return setError('Event Date is required.');
    if (!time.trim()) return setError('Event Time is required.');
    if (!venue.trim()) return setError('Event Venue is required.');
    if (!bannerImage) return setError('Please upload an event banner.');
    if (!registrationLink.trim()) return setError('Registration Link is required.');

    // URL Check
    try {
      new URL(registrationLink);
    } catch (_) {
      if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(registrationLink)) {
        return setError('Please enter a valid URL.');
      }
    }

    setSaving(true);
    const payload = { title, description, date, time, venue, category, bannerImage, registrationLink, status, featured };

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Event created successfully!');
        setTimeout(() => {
          router.push('/admin/events');
        }, 1000);
      } else {
        setError(data.message || 'Failed to create event.');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const categoriesList = ['Workshop', 'Hackathon', 'Bootcamp', 'Competition', 'Talk', 'Seminar', 'Cultural', 'Sports', 'Conference', 'Other'];

  // Preview event object
  const previewEventObj = {
    _id: 'preview',
    title: title || 'Web Development Workshop',
    description: description || 'Hands-on workshop to build modern web applications.',
    date: date || '2026-05-18',
    time: time || '10:00 AM',
    venue: venue || 'IGDTUW, Delhi',
    category: category,
    bannerImage: bannerImage,
    registrationLink: registrationLink || '#'
  };

  return (
    <AdminLayout pageTitle="Create Event">
      {/* Back button */}
      <button 
        onClick={() => router.push('/admin/events')}
        style={{
          border: 'none',
          background: 'none',
          fontSize: '13px',
          fontWeight: '600',
          color: '#6C3BFF',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={14} />
        <span>Back to Events</span>
      </button>

      {/* Grid Layout Section 16 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60fr 40fr',
        gap: '40px',
        alignItems: 'start'
      }} className="create-grid">
        
        {/* Left Column: Input Form Card */}
        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111111' }}>New Event Details</h3>
          
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Event Title <span style={{ color: '#EF4444' }}>*</span></label>
            <input 
              type="text" 
              placeholder="e.g. Web Development Workshop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                height: '44px',
                border: '1.5px solid #E5E7EB',
                borderRadius: '8px',
                padding: '0 14px',
                fontSize: '13.5px',
                color: '#111111',
                outline: 'none',
                transition: 'border-color 200ms ease'
              }}
              className="create-form-input"
            />
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Description <span style={{ color: '#EF4444' }}>*</span></label>
            <textarea 
              placeholder="Describe your event details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{
                minHeight: '100px',
                border: '1.5px solid #E5E7EB',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '13.5px',
                color: '#111111',
                outline: 'none',
                resize: 'none',
                transition: 'border-color 200ms ease'
              }}
              className="create-form-input"
            />
          </div>

          {/* Date & Time Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Date <span style={{ color: '#EF4444' }}>*</span></label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{
                  height: '44px',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  color: '#111111',
                  outline: 'none',
                  transition: 'border-color 200ms ease'
                }}
                className="create-form-input"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Time <span style={{ color: '#EF4444' }}>*</span></label>
              <input 
                type="text"
                placeholder="e.g. 10:00 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                style={{
                  height: '44px',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  color: '#111111',
                  outline: 'none',
                  transition: 'border-color 200ms ease'
                }}
                className="create-form-input"
              />
            </div>
          </div>

          {/* Venue & Status Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Venue <span style={{ color: '#EF4444' }}>*</span></label>
              <input 
                type="text"
                placeholder="e.g. IGDTUW, Delhi"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
                style={{
                  height: '44px',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  color: '#111111',
                  outline: 'none',
                  transition: 'border-color 200ms ease'
                }}
                className="create-form-input"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Publish Status <span style={{ color: '#EF4444' }}>*</span></label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                style={{
                  height: '44px',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  color: '#111111',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'border-color 200ms ease'
                }}
                className="create-form-input"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Category & Link */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Category <span style={{ color: '#EF4444' }}>*</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                style={{
                  height: '44px',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  color: '#111111',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'border-color 200ms ease'
                }}
                className="create-form-input"
              >
                {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Registration Link <span style={{ color: '#EF4444' }}>*</span></label>
              <input 
                type="text"
                placeholder="https://example.com/register"
                value={registrationLink}
                onChange={(e) => setRegistrationLink(e.target.value)}
                required
                style={{
                  height: '44px',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  color: '#111111',
                  outline: 'none',
                  transition: 'border-color 200ms ease'
                }}
                className="create-form-input"
              />
            </div>
          </div>

          {/* Featured Event Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#F8F7FF',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #ECEAF5',
            marginTop: '4px',
            marginBottom: '4px'
          }}>
            <input 
              type="checkbox"
              id="featured-checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                accentColor: '#6D3DF5',
                cursor: 'pointer'
              }}
            />
            <label htmlFor="featured-checkbox" style={{ fontSize: '13px', fontWeight: '700', color: '#111111', cursor: 'pointer' }}>
              Mark this event as Featured on the Homepage
            </label>
          </div>

          {/* Image upload dropzone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Banner Image <span style={{ color: '#EF4444' }}>*</span></label>
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('event-banner-uploader').click()}
              style={{
                height: '140px',
                border: '1.5px dashed #D8D3E8',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                backgroundColor: '#FBFBFF',
                transition: 'border-color 200ms ease, background-color 200ms ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="dropzone-area"
            >
              <input 
                id="event-banner-uploader"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              {bannerImage ? (
                <>
                  <img src={bannerImage} alt="Banner Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '12px', fontWeight: '700' }}>Click to Replace Banner</div>
                </>
              ) : (
                <>
                  <ImageIcon size={30} style={{ color: '#9CA3AF' }} />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Click to upload or drag and drop</span>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>PNG, JPG up to 5MB</span>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button 
              type="button"
              onClick={() => router.push('/admin/events')}
              style={{
                height: '40px',
                padding: '0 20px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E9E7F2',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: '600',
                color: '#6B7280',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
              className="btn-cancel-style"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={saving}
              style={{
                height: '40px',
                padding: '0 24px',
                background: 'linear-gradient(135deg, #6C3BFF 0%, #7C4DFF 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: '600',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 10px rgba(108, 59, 255, 0.15)',
                transition: 'opacity 250ms ease'
              }}
              className="btn-submit-style"
            >
              {saving ? (
                <>
                  <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Event</span>
              )}
            </button>
          </div>

        </form>

        {/* Right Column: Live card Preview */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#111111', marginBottom: '16px' }}>Preview</h3>
          <div style={{ maxWidth: '360px' }} className="preview-card-wrap">
            <LiveEventCardPreview event={previewEventObj} />
          </div>
        </div>

      </div>

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
        .create-form-input:focus {
          border-color: #6C3BFF !important;
        }
        .dropzone-area:hover {
          border-color: #6C3BFF !important;
          background-color: #F8F7FF !important;
        }
        .btn-cancel-style:hover {
          background-color: #F9FAFB !important;
          color: #EF4444 !important;
          border-color: rgba(239, 68, 68, 0.2) !important;
        }
        .btn-submit-style:hover {
          opacity: 0.95;
        }
        @media (max-width: 1024px) {
          .create-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .preview-card-wrap {
            max-width: 100% !important;
          }
        }
        @media (max-width: 640px) {
          .form-row-2 {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
