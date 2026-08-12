import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      padding: '40px 24px 30px 24px',
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid #E9E7F2',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} style={{ color: '#6C3BFF' }} />
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111111' }}>MSC SOCIETY</h3>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/" style={{ fontSize: '13px', color: '#6B7280', transition: 'color 250ms ease' }}>Home</Link>
          <Link href="/events" style={{ fontSize: '13px', color: '#6B7280', transition: 'color 250ms ease' }}>Events</Link>
          <Link href="/about" style={{ fontSize: '13px', color: '#6B7280', transition: 'color 250ms ease' }}>About</Link>
          <Link href="/contact" style={{ fontSize: '13px', color: '#6B7280', transition: 'color 250ms ease' }}>Contact</Link>
        </div>
      </div>
      <div style={{
        borderTop: '1px solid #E9E7F2',
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
