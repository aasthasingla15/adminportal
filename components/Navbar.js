import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sparkles, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header style={{
        height: '72px',
        backgroundColor: isScrolled 
          ? (isDark ? 'rgba(8, 8, 12, 0.85)' : 'rgba(255, 255, 255, 0.85)') 
          : 'transparent',
        borderBottom: isScrolled 
          ? (isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)') 
          : '1px solid transparent',
        backdropFilter: isScrolled ? 'blur(18px)' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 8%',
        transition: 'all 300ms ease'
      }}>
        {/* Left Section: Logo */}
        <Link 
          href="/" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          <Sparkles size={18} style={{ color: isDark ? '#8B5CF6' : '#6D3DF5', transition: 'color 300ms ease' }} />
          <span style={{
            fontSize: '16px',
            fontWeight: '800',
            color: isDark ? '#FFFFFF' : '#111111',
            letterSpacing: '0.05em',
            transition: 'color 300ms ease'
          }}>
            ✦ MSC EVENTS
          </span>
        </Link>

        {/* Center Section: Menu Links */}
        <nav style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center'
        }} className="desktop-only-nav">
          {navLinks.map((link) => {
            const isActive = router.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                href={link.path}
                style={{
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive 
                    ? (isDark ? '#8B5CF6' : '#6D3DF5') 
                    : (isDark ? 'rgba(255, 255, 255, 0.7)' : '#6B7280'),
                  position: 'relative',
                  padding: '6px 0',
                  cursor: 'pointer',
                  transition: 'color 250ms ease'
                }}
              >
                {link.name}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '18px',
                    height: '2px',
                    backgroundColor: isDark ? '#8B5CF6' : '#6D3DF5',
                    borderRadius: '2px',
                    transition: 'background-color 300ms ease'
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle & Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Sun/Moon Switcher */}
          <button
            onClick={toggleTheme}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F0EDFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
              color: isDark ? '#FBBF24' : '#6D3DF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 300ms ease',
              boxShadow: isDark ? '0 0 10px rgba(251, 191, 36, 0.12)' : 'none'
            }}
            className="theme-toggle-btn"
            title="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="hamburger-only-nav"
            style={{
              background: 'none',
              border: 'none',
              color: isDark ? '#FFFFFF' : '#111111',
              cursor: 'pointer',
              padding: '4px',
              display: 'none'
            }}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{
            width: '280px',
            height: '100%',
            backgroundColor: isDark ? '#08080C' : '#FFFFFF',
            borderLeft: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
            backdropFilter: 'blur(20px)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
            transition: 'background-color 300ms ease'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', fontSize: '15px', color: isDark ? '#FFFFFF' : '#111111' }}>MENU</span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#FFFFFF' : '#111111' }}>
                <X size={22} />
              </button>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.path}
                  style={{
                    fontSize: '15px',
                    fontWeight: router.pathname === link.path ? '600' : '500',
                    color: router.pathname === link.path 
                      ? (isDark ? '#8B5CF6' : '#6D3DF5') 
                      : (isDark ? '#A1A1AA' : '#6B7280')
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #ECEAF5', 
              paddingTop: '16px',
              marginTop: '12px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: isDark ? '#A1A1AA' : '#6B7280' }}>Dark Theme</span>
              <button
                onClick={toggleTheme}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F0EDFF',
                  border: 'none',
                  color: isDark ? '#FBBF24' : '#6D3DF5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>

            <button 
              onClick={() => { setMobileMenuOpen(false); router.push('/admin/login'); }}
              style={{
                width: '100%',
                height: '40px',
                backgroundColor: isDark ? '#8B5CF6' : '#6D3DF5',
                border: 'none',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                marginTop: 'auto'
              }}
            >
              Admin Login
            </button>
          </div>
        </div>
      )}

      {/* Nav Responsive Style Injection */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-only-nav {
            display: none !important;
          }
          .hamburger-only-nav {
            display: block !important;
          }
        }
        .navbar-admin-btn:hover {
          background-color: ${isDark ? '#8B5CF6' : '#6D3DF5'} !important;
          color: #FFFFFF !important;
        }
        .theme-toggle-btn:hover {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}


