import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  Shield, LayoutDashboard, ListChecks, CalendarDays, Tags, Users, 
  LineChart, Settings, LogOut, Search, Bell, ChevronDown, Menu, X, Loader2
} from 'lucide-react';
import AdminStyles from '../styles/Admin.module.css';

export default function AdminLayout({ children, pageTitle = "Admin Dashboard" }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();

  // Force light theme and verify auth
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          setAuthenticated(true);
          setAuthChecking(false);
        }
      } catch (err) {
        console.error('Session check error:', err);
        router.push('/admin/login');
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
      router.push('/');
    }
  };

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Events', path: '/admin/events', icon: <ListChecks size={18} /> },
    { name: 'Calendar', path: '/admin/calendar', icon: <CalendarDays size={18} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Tags size={18} /> },
    { name: 'Registrations', path: '/admin/registrations', icon: <Users size={18} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <LineChart size={18} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> }
  ];

  if (authChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#F8F7FF', gap: '12px' }}>
        <Loader2 size={32} style={{ animation: 'spin-slow 1s linear infinite', color: '#6C3BFF' }} />
        <p style={{ color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>Verifying credentials...</p>
        <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#FAFAFC',
      position: 'relative'
    }}>
      <Head>
        <title>{pageTitle} | MSC Events Portal</title>
      </Head>

      {/* Top Mobile Bar */}
      <div className="mobile-header-bar" style={{
        display: 'none',
        height: '60px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #ECEAF3',
        padding: '0 20px',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 900
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} style={{ color: '#6C3BFF' }} />
          <span style={{ fontWeight: '750', fontSize: '15px' }}>MSC EVENTS</span>
        </div>
        <button 
          onClick={() => setMobileSidebarOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111111' }}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Sidebar: Fixed left */}
      <aside 
        className={`dashboard-sidebar-aside ${mobileSidebarOpen ? 'drawer-open' : ''}`}
        style={{
          width: '230px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #ECEAF3',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
          justifyContent: 'space-between',
          transition: 'transform 250ms ease'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Logo brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px' }}>
            <Shield size={20} style={{ color: '#6C3BFF' }} />
            <span style={{ fontWeight: '800', fontSize: '16px', color: '#111111' }}>✦ MSC EVENTS</span>
            {mobileSidebarOpen && (
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Menu links list */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map((item) => {
              const isActive = router.pathname === item.path || (item.path !== '/admin' && router.pathname.startsWith(item.path));
              return (
                <Link key={item.name} href={item.path}>
                  <div 
                    onClick={() => setMobileSidebarOpen(false)}
                    style={{
                      height: '40px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      fontWeight: isActive ? '600' : '500',
                      color: isActive ? '#6C3BFF' : '#6B7280',
                      backgroundColor: isActive ? '#F0ECFF' : 'transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 200ms ease'
                    }}
                    className="sidebar-link-item"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions: Logout */}
        <div style={{ borderTop: '1px solid #ECEAF3', paddingTop: '16px' }}>
          <button 
            onClick={handleLogout}
            style={{
              height: '40px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6B7280',
              background: 'none',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              transition: 'all 200ms ease'
            }}
            className="sidebar-logout-btn"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Panel */}
      <div style={{
        flex: 1,
        marginLeft: '230px',
        padding: '32px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }} className="dashboard-content-wrapper">
        
        {/* Top Header Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }} className="top-header-row">
          
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111111' }}>
              {pageTitle}
            </h1>
          </div>

          {/* Right Header items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input 
                type="text" 
                placeholder="Search..."
                style={{
                  width: '100%',
                  height: '38px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '20px',
                  padding: '0 12px 0 34px',
                  fontSize: '13px',
                  color: '#111111',
                  outline: 'none'
                }}
              />
            </div>
            
            {/* Notification bell */}
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <Bell size={16} style={{ color: '#6B7280' }} />
            </div>

            {/* Profile Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#6C3BFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '14px'
              }}>
                A
              </div>
              <ChevronDown size={14} style={{ color: '#6B7280' }} />
            </div>
          </div>

        </div>

        {/* Content Children pages */}
        <div style={{ flex: 1 }}>
          {children}
        </div>

      </div>

      <style jsx global>{`
        .sidebar-link-item:hover {
          color: #6C3BFF !important;
          background-color: #F8F7FF !important;
        }
        .sidebar-logout-btn:hover {
          background-color: rgba(239, 68, 68, 0.05) !important;
          color: #EF4444 !important;
        }
        @media (max-width: 1024px) {
          .dashboard-sidebar-aside {
            transform: translateX(-100%);
          }
          .dashboard-sidebar-aside.drawer-open {
            transform: translateX(0);
          }
          .mobile-header-bar {
            display: flex !important;
          }
          .dashboard-content-wrapper {
            margin-left: 0 !important;
            padding-top: 92px !important;
          }
        }
        @media (max-width: 640px) {
          .top-header-row {
            flex-direction: column;
            align-items: stretch !important;
          }
        }
      `}</style>
    </div>
  );
}
