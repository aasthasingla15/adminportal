import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Shield, Lock, Mail, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Redirect if session is active
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.authenticated) {
          router.push('/admin');
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    }
    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please fill in all credentials.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.status === 200 && data.success) {
        router.push('/admin');
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      console.error('Login request error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#08080C' : '#F8F7FF',
      fontFamily: 'Inter, sans-serif',
      padding: '24px',
      transition: 'background-color 300ms ease',
      position: 'relative'
    }}>
      <Head>
        <title>Welcome Back | Admin Login</title>
        <meta name="description" content="Sign in to manage Microsoft Student Chapter Events." />
      </Head>

      {/* Cinematic Fullscreen Background Video for Dark Mode */}
      {isDark && (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="homepage-video-bg"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          <div className="homepage-video-overlay" />
        </>
      )}

      {/* Centered Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: isDark ? '#111116' : '#FFFFFF',
        borderRadius: '10px',
        padding: '40px 32px',
        boxShadow: 'none',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10,
        transition: 'all 300ms ease'
      }}>
        {/* Top Purple Icon */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '6px',
          backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : '#F0EDFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? '#A78BFA' : '#6D3DF5',
          marginBottom: '20px'
        }}>
          <Shield size={24} />
        </div>

        {/* Header Title */}
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', marginBottom: '6px' }}>Welcome Back</h2>
        <p style={{ fontSize: '13.5px', color: isDark ? '#A1A1AA' : '#6B7280', marginBottom: '28px', textAlign: 'center' }}>Sign in to manage MSC Events</p>

        {/* Input Forms */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Email input field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#FFFFFF' : '#111111' }}>Email / Username</label>
            <div style={{
              height: '46px',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: isDark ? '#08080C' : '#FFFFFF',
              transition: 'border-color 200ms ease'
            }} className="login-input-wrapper">
              <Mail size={15} style={{ color: '#9CA3AF' }} />
              <input 
                type="text" 
                placeholder="Enter email or username" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '13.5px',
                  color: isDark ? '#FFFFFF' : '#111111',
                  width: '100%',
                  background: 'none'
                }}
              />
            </div>
          </div>

          {/* Password input field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#FFFFFF' : '#111111' }}>Password</label>
            <div style={{
              height: '46px',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              position: 'relative',
              backgroundColor: isDark ? '#08080C' : '#FFFFFF',
              transition: 'border-color 200ms ease'
            }} className="login-input-wrapper">
              <Lock size={15} style={{ color: '#9CA3AF' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '13.5px',
                  color: isDark ? '#FFFFFF' : '#111111',
                  width: '100%',
                  background: 'none',
                  paddingRight: '30px'
                }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Action Login button */}
          <button 
            type="submit"
            disabled={loading}
            style={{
              height: '46px',
              background: 'linear-gradient(135deg, #6D3DF5 0%, #8B5CF6 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(109, 61, 245, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '10px',
              transition: 'opacity 250ms ease'
            }}
            className="login-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Sign In →</span>
            )}
          </button>

          {/* Credential hint for evaluators */}
          <div style={{
            marginTop: '16px',
            padding: '12px 14px',
            backgroundColor: isDark ? 'rgba(109, 61, 245, 0.08)' : 'rgba(109, 61, 245, 0.04)',
            border: isDark ? '1px solid rgba(109, 61, 245, 0.2)' : '1px solid rgba(109, 61, 245, 0.12)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '11.5px', color: isDark ? '#A78BFA' : '#6D3DF5', fontWeight: '600', margin: 0 }}>
              🔑 Demo credentials
            </p>
            <p style={{ fontSize: '11.5px', color: isDark ? '#A1A1AA' : '#6B7280', margin: '4px 0 0', fontFamily: 'monospace' }}>
              admin &nbsp;/&nbsp; adminpassword123
            </p>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .login-input-wrapper:focus-within {
          border-color: ${isDark ? '#8B5CF6' : '#6D3DF5'} !important;
          box-shadow: ${isDark ? '0 0 10px rgba(139, 92, 246, 0.15)' : 'none'} !important;
        }
        .login-submit-btn:hover {
          opacity: 0.92;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

