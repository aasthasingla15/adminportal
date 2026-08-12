import { useState } from 'react';
import { Settings, Shield, User, Lock, Save, Database, Sliders } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function SettingsPage() {
  const [username, setUsername] = useState('admin');
  const [dbStatus, setDbStatus] = useState('Connected');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings updated successfully!');
  };

  return (
    <AdminLayout pageTitle="Settings">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="settings-grid">
        
        {/* Left Column: Configuration Forms */}
        <form onSubmit={handleSave} style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111111', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sliders size={18} style={{ color: '#6C3BFF' }} />
            <span>Administrative Preferences</span>
          </h3>

          {/* Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Admin Username</label>
            <div style={{
              height: '44px',
              border: '1.5px solid #E5E7EB',
              borderRadius: '8px',
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }} className="settings-input-wrapper">
              <User size={15} style={{ color: '#9CA3AF' }} />
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '13.5px', color: '#111111', width: '100%' }}
              />
            </div>
          </div>

          {/* Password update */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Update Password</label>
            <div style={{
              height: '44px',
              border: '1.5px solid #E5E7EB',
              borderRadius: '8px',
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }} className="settings-input-wrapper">
              <Lock size={15} style={{ color: '#9CA3AF' }} />
              <input 
                type="password"
                placeholder="Enter new admin password"
                style={{ border: 'none', outline: 'none', fontSize: '13.5px', color: '#111111', width: '100%' }}
              />
            </div>
          </div>

          {/* Save Button */}
          <button 
            type="submit"
            style={{
              height: '40px',
              backgroundColor: '#6C3BFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 10px rgba(108, 59, 255, 0.15)',
              alignSelf: 'flex-start',
              padding: '0 20px',
              marginTop: '10px'
            }}
          >
            <Save size={14} />
            <span>Save Preferences</span>
          </button>

        </form>

        {/* Right Column: Database Status Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9E7F2',
          borderRadius: '14px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(80,60,150,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111111', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={18} style={{ color: '#6C3BFF' }} />
            <span>Database Status</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
              <span style={{ color: '#6B7280', fontWeight: '500' }}>Mongoose State:</span>
              <span style={{ color: '#22C55E', fontWeight: '700' }}>● Connected</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
              <span style={{ color: '#6B7280', fontWeight: '500' }}>Host connection:</span>
              <span style={{ color: '#111111', fontWeight: '600' }}>127.0.0.1:27017</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
              <span style={{ color: '#6B7280', fontWeight: '500' }}>Database Namespace:</span>
              <span style={{ color: '#111111', fontWeight: '600' }}>msc_events</span>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        .settings-input-wrapper:focus-within {
          border-color: #6C3BFF !important;
        }
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
