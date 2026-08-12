import { Tags, Plus, FileText, Sparkles } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function CategoriesPage() {
  const categoriesData = [
    { name: 'Workshop', count: 12, color: '#6C3BFF' },
    { name: 'Hackathon', icon: 'Hackathons', count: 6, color: '#EC4899' },
    { name: 'Bootcamp', count: 3, color: '#4F7CFF' },
    { name: 'Talk', count: 2, color: '#F59E0B' },
    { name: 'Competition', count: 1, color: '#10B981' }
  ];

  return (
    <AdminLayout pageTitle="Categories">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="cat-layout-grid">
        
        {/* Left Card: Category List */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111111' }}>Event Categories</h3>
            <button style={{
              height: '34px',
              backgroundColor: '#6C3BFF',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: '600',
              padding: '0 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Plus size={14} /> Add New
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoriesData.map(c => (
              <div key={c.name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                border: '1px solid #E9E7F2',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c.color }} />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#111111' }}>{c.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>
                  <FileText size={14} />
                  <span>{c.count} Events</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Stats & Information */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111111' }}>Category Insights</h3>
          <p style={{ fontSize: '13.5px', color: '#6B7280', lineHeight: '1.6' }}>
            Categorizing your events correctly helps public users search and filter. The Microsoft Student Chapter hosts technical Workshops most frequently, followed by Hackathons and Bootcamps.
          </p>
          <div style={{
            padding: '16px',
            backgroundColor: '#F8F7FF',
            borderRadius: '10px',
            border: '1px dashed #D8D3E8',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Sparkles size={18} style={{ color: '#6C3BFF' }} />
            <span style={{ fontSize: '13px', color: '#6C3BFF', fontWeight: '600' }}>Workshop is your most active category.</span>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .cat-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
