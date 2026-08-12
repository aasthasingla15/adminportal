import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer style={{
      padding: '40px 24px 30px 24px',
      backgroundColor: isDark ? '#0B0B10' : '#FFFFFF',
      borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E9E7F2',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      transition: 'all 300ms ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} style={{ color: isDark ? '#8B5CF6' : '#6C3BFF' }} />
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111' }}>MSC SOCIETY</h3>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/" style={{ fontSize: '13px', color: isDark ? '#A1A1AA' : '#6B7280', transition: 'color 250ms ease' }}>Home</Link>
          <Link href="/events" style={{ fontSize: '13px', color: isDark ? '#A1A1AA' : '#6B7280', transition: 'color 250ms ease' }}>Events</Link>
          <Link href="/about" style={{ fontSize: '13px', color: isDark ? '#A1A1AA' : '#6B7280', transition: 'color 250ms ease' }}>About</Link>
          <Link href="/contact" style={{ fontSize: '13px', color: isDark ? '#A1A1AA' : '#6B7280', transition: 'color 250ms ease' }}>Contact</Link>
          <Link href="/admin/login" style={{ fontSize: '13px', color: '#8B5CF6', fontWeight: '600', transition: 'color 250ms ease' }}>Admin Portal</Link>
        </div>
      </div>
      <div style={{
        borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E9E7F2',
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '13px',
        color: '#9CA3AF',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <p>© {new Date().getFullYear()} Microsoft Student Chapter (MSC) Events. All rights reserved.</p>
        <p>Premium Editorial + Clean Architecture.</p>
      </div>
    </footer>
  );
}
