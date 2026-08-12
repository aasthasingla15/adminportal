import { Users, Mail, CheckCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function RegistrationsPage() {
  const registrationsList = [
    { name: 'Aditi Sharma', email: 'aditi@college.edu', event: 'Web Development Workshop', date: '2026-08-11' },
    { name: 'Rohan Verma', email: 'rohan@college.edu', event: 'Web Development Workshop', date: '2026-08-11' },
    { name: 'Neha Gupta', email: 'neha@college.edu', event: 'AI/ML Bootcamp', date: '2026-08-10' },
    { name: 'Siddharth Sen', email: 'siddharth@college.edu', event: 'Hackathon 2026', date: '2026-08-09' }
  ];

  return (
    <AdminLayout pageTitle="Registrations">
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E9E7F2',
        borderRadius: '14px',
        padding: '28px',
        boxShadow: '0 4px 20px rgba(80,60,150,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111111' }}>Recent Event Registrations</h3>
          <span style={{ fontSize: '13px', color: '#6C3BFF', fontWeight: '600' }}>Total: 1,256</span>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E9E7F2' }}>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase' }}>User</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase' }}>Registered Event</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase' }}>Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {registrationsList.map((user, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E9E7F2', height: '56px' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13.5px', fontWeight: '700', color: '#111111' }}>{user.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6B7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={13} style={{ color: '#9CA3AF' }} />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111111', fontWeight: '600' }}>{user.event}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6B7280' }}>{user.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
