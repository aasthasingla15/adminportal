import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer style={{
      padding: '40px 24px',
      backgroundColor: isDark ? '#0B0B10' : '#FFFFFF',
      borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E9E7F2',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ maxWidth: '1100px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: isDark ? '#8B5CF6' : '#6C3BFF' }} />
            <div style={{ fontWeight: 800, fontSize: '16px', color: isDark ? '#FFFFFF' : '#111111' }}>✦ MSC EVENTS</div>
          </div>
          <div style={{ marginTop: '6px', color: isDark ? '#A1A1AA' : '#6B7280', fontSize: '13px' }}>
            Microsoft Student Chapter — IGDTUW
            <div style={{ marginTop: '6px' }}>Discover • Connect • Grow</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: isDark ? '#A1A1AA' : '#6B7280' }}>Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: isDark ? '#A1A1AA' : '#6B7280' }}>LinkedIn</a>
            <a href="https://github.com/aasthasingla15" target="_blank" rel="noopener noreferrer" style={{ color: isDark ? '#A1A1AA' : '#6B7280' }}>GitHub</a>
          </div>
          <div style={{ color: isDark ? '#9CA3AF' : '#9CA3AF', fontSize: '13px' }}>© {new Date().getFullYear()} Microsoft Student Chapter</div>
        </div>
      </div>
    </footer>
  );
}
