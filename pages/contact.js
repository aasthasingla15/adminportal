import { useState } from 'react';
import Head from 'next/head';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function ContactPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call for contact message
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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
        <title>Contact Us | MSC Events</title>
        <meta name="description" content="Get in touch with the Microsoft Student Chapter at IGDTUW." />
      </Head>

      <Navbar />

      <main style={{ flex: 1, marginTop: '72px', display: 'flex', alignItems: 'center', padding: '100px 8%', zIndex: 10 }}>
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '45fr 55fr',
          gap: '64px',
          alignItems: 'center'
        }} className="contact-grid">
          
          {/* Left Column: Info details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>GET IN TOUCH</span>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              color: isDark ? '#FFFFFF' : '#111111',
              letterSpacing: '-0.03em',
              lineHeight: '1.1'
            }}>
              Contact Us.
            </h1>
            <p style={{
              fontSize: '15px',
              color: isDark ? '#A1A1AA' : '#6B7280',
              lineHeight: '1.7',
              maxWidth: '450px'
            }}>
              Have questions about our upcoming hackathons, workshops, or partner chapter integrations? Drop us a message, and our team will get back to you!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '6px', 
                  backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : '#F0EDFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: isDark ? '#A78BFA' : '#6D3DF5',
                  flexShrink: 0
                }}>
                  <Mail size={16} />
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: isDark ? '#A1A1AA' : '#6B7280', textTransform: 'uppercase', marginBottom: '2px' }}>Email</p>
                  <span style={{ fontSize: '13.5px', color: isDark ? '#FFFFFF' : '#111111', fontWeight: '600' }}>msc@igdtuw.ac.in</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '6px', 
                  backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : '#F0EDFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: isDark ? '#A78BFA' : '#6D3DF5',
                  flexShrink: 0
                }}>
                  <Phone size={16} />
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: isDark ? '#A1A1AA' : '#6B7280', textTransform: 'uppercase', marginBottom: '2px' }}>Phone</p>
                  <span style={{ fontSize: '13.5px', color: isDark ? '#FFFFFF' : '#111111', fontWeight: '600' }}>8360022379</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div style={{
            backgroundColor: isDark ? '#111116' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5',
            borderRadius: '10px',
            padding: '40px',
            transition: 'all 300ms ease'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {status === 'success' && (
                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.05)',
                  border: '1px solid rgba(34, 197, 94, 0.15)',
                  color: '#22C55E',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={16} />
                  <span>Message sent successfully! We will get back to you shortly.</span>
                </div>
              )}

              {status === 'error' && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  color: '#EF4444',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#FFFFFF' : '#111111' }}>Full Name <span style={{ color: '#8B5CF6' }}>*</span></label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    height: '44px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '0 14px',
                    fontSize: '13.5px',
                    color: isDark ? '#FFFFFF' : '#111111',
                    outline: 'none',
                    backgroundColor: isDark ? '#08080C' : '#FFFFFF',
                    transition: 'all 200ms ease'
                  }}
                  className="contact-form-input"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#FFFFFF' : '#111111' }}>Email Address <span style={{ color: '#8B5CF6' }}>*</span></label>
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    height: '44px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '0 14px',
                    fontSize: '13.5px',
                    color: isDark ? '#FFFFFF' : '#111111',
                    outline: 'none',
                    backgroundColor: isDark ? '#08080C' : '#FFFFFF',
                    transition: 'all 200ms ease'
                  }}
                  className="contact-form-input"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#FFFFFF' : '#111111' }}>Message <span style={{ color: '#8B5CF6' }}>*</span></label>
                <textarea 
                  placeholder="Type your message details here..." 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    minHeight: '120px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    fontSize: '13.5px',
                    color: isDark ? '#FFFFFF' : '#111111',
                    outline: 'none',
                    resize: 'none',
                    backgroundColor: isDark ? '#08080C' : '#FFFFFF',
                    transition: 'all 200ms ease'
                  }}
                  className="contact-form-input"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{
                  height: '44px',
                  backgroundColor: isDark ? '#8B5CF6' : '#6D3DF5',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isDark ? '0 4px 14px rgba(124, 58, 237, 0.3)' : '0 4px 15px rgba(109, 61, 245, 0.2)',
                  marginTop: '10px',
                  transition: 'opacity 200ms ease'
                }}
                className="btn-send-hover"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />

      <style jsx global>{`
        .contact-form-input:focus {
          border-color: ${isDark ? '#8B5CF6' : '#6D3DF5'} !important;
          box-shadow: ${isDark ? '0 0 10px rgba(139, 92, 246, 0.15)' : 'none'} !important;
        }
        .btn-send-hover:hover {
          opacity: 0.92;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}


