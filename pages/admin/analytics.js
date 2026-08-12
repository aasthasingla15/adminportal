import { LineChart, BarChart, ArrowUpRight, TrendingUp } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function AnalyticsPage() {
  return (
    <AdminLayout pageTitle="Analytics">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }} className="analytics-grid">
        
        {/* Left Card: Weekly Activity */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111111', marginBottom: '20px' }}>Weekly Member Growth</h3>
          
          {/* SVG representation for analytics growth */}
          <div style={{ width: '100%', height: '180px' }}>
            <svg viewBox="0 0 500 180" width="100%" height="100%">
              <rect x="30" y="30" width="40" height="120" rx="4" fill="#6C3BFF" />
              <rect x="100" y="50" width="40" height="100" rx="4" fill="#6C3BFF" />
              <rect x="170" y="20" width="40" height="130" rx="4" fill="#6C3BFF" />
              <rect x="240" y="60" width="40" height="90" rx="4" fill="#6C3BFF" />
              <rect x="310" y="40" width="40" height="110" rx="4" fill="#6C3BFF" />
              <rect x="380" y="10" width="40" height="140" rx="4" fill="#6C3BFF" />
              <rect x="450" y="30" width="40" height="120" rx="4" fill="#6C3BFF" />
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF', fontWeight: '700', marginTop: '10px' }}>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Right Card: Engagement insights */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111111', marginBottom: '12px' }}>Event Engagement Insights</h3>
            <p style={{ fontSize: '13.5px', color: '#6B7280', lineHeight: '1.6' }}>
              Your hackathons continue to drive the highest engagement spike, resulting in an average of 350 registrations per event. Workshops see a higher completion rate of 90% in terms of attendance.
            </p>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.04)',
            border: '1px solid rgba(34, 197, 94, 0.15)',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '20px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#22C55E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '13.5px', fontWeight: '750', color: '#22C55E' }}>Engagement Upward Trend</h4>
              <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>Overall platform registration rate is up by 15.4% this week.</p>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .analytics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
