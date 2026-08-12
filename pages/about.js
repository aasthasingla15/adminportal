import Head from 'next/head';
import { Laptop, Sparkles, Trophy, Users, BookOpen, Terminal, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const initiatives = [
    { title: 'Workshops', icon: <Laptop size={20} />, desc: 'Hands-on practical development labs to learn frameworks, systems engineering, and programming tools.' },
    { title: 'Hackathons', icon: <Terminal size={20} />, desc: 'Intense 24-48 hour coding competitions to build solutions, prototypes, and iterate with teams.' },
    { title: 'Bootcamps', icon: <BookOpen size={20} />, desc: 'Multi-week structured cohorts diving deep into foundational topics like Web Dev, Cloud, and Machine Learning.' },
    { title: 'Tech Talks', icon: <Sparkles size={20} />, desc: 'Interactive expert seminars featuring technology leaders, research scholars, and industry professionals.' },
    { title: 'Competitions', icon: <Trophy size={20} />, desc: 'Platform competitive hacking, system design challenges, algorithms contests, and college arenas.' },
    { title: 'Community', icon: <Users size={20} />, desc: 'A thriving network of peers, mentors, and student leaders supporting collaborative learning and growth.' }
  ];

  return (
    <div style={{ 
      backgroundColor: isDark ? '#08080C' : '#F8F7FF', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'background-color 300ms ease, color 300ms ease',
      position: 'relative'
    }}>
      <Head>
        <title>About Us | MSC Events</title>
        <meta name="description" content="Learn more about Microsoft Student Chapter events and initiatives at IGDTUW." />
      </Head>

      <Navbar />

      <main style={{ flex: 1, marginTop: '72px', zIndex: 10 }}>
        {/* Section 1: Hero */}
        <section style={{
          padding: '100px 8% 80px 8%',
          backgroundColor: 'transparent',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', letterSpacing: '0.15em', textTransform: 'uppercase' }}>WHO WE ARE</span>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            color: isDark ? '#FFFFFF' : '#111111',
            margin: '16px 0 20px 0'
          }}>
            ABOUT <span style={{ color: isDark ? '#8B5CF6' : '#6D3DF5' }}>MSC EVENTS</span>
          </h1>
          <p style={{
            fontSize: '15.5px',
            color: isDark ? '#A1A1AA' : '#6B7280',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: '1.8',
            fontWeight: '400'
          }}>
            The Microsoft Student Chapter (MSC) at IGDTUW is a premier technical society dedicated to fostering technological literacy, peer-to-peer mentoring, and software innovation among engineering students.
          </p>
        </section>

        {/* Section 2: Our Purpose */}
        <section style={{
          padding: '80px 8%',
          backgroundColor: isDark ? '#111116' : '#FFFFFF',
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5',
          transition: 'all 300ms ease'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '45fr 55fr', gap: '48px', alignItems: 'center' }} className="about-grid">
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>MISSION STATEMENT</span>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', marginTop: '12px', marginBottom: '20px', letterSpacing: '-0.02em' }}>OUR PURPOSE</h2>
              <p style={{ fontSize: '14.5px', color: isDark ? '#A1A1AA' : '#6B7280', lineHeight: '1.7', marginBottom: '16px' }}>
                We believe that learning technology is most effective when done collaboratively. By providing a platform for structured learning and production-level experimentation, we bridge the gap between academic theory and practical software engineering.
              </p>
              <p style={{ fontSize: '14.5px', color: isDark ? '#A1A1AA' : '#6B7280', lineHeight: '1.7' }}>
                Through community-driven hackathons, workshops, and bootcamps, we provide students with hands-on exposure to cloud computing, artificial intelligence, open-source engineering, and modern web systems.
              </p>
            </div>
            {/* Philosophy Flow: Decide -> Learn -> Apply */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { step: 'DECIDE', desc: 'Identify your target domains and connect with core paths in technology.' },
                { step: 'LEARN', desc: 'Participate in workshops, bootcamps and specialized cohorts guided by peers.' },
                { step: 'APPLY', desc: 'Build concrete codebases, contribute to open-source, and launch tools.' }
              ].map((item, idx) => (
                <div key={item.step} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  backgroundColor: isDark ? '#08080C' : '#F8F7FF',
                  padding: '24px',
                  borderRadius: '8px',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #ECEAF5'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : '#F0EDFF',
                    color: isDark ? '#A78BFA' : '#6D3DF5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '14px'
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', marginBottom: '4px' }}>{item.step}</h4>
                    <p style={{ fontSize: '13px', color: isDark ? '#A1A1AA' : '#6B7280', lineHeight: '1.5' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Ecosystem (Asymmetric Layout instead of plain card list) */}
        <section style={{
          padding: '100px 8%',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ECOSYSTEM</span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', marginTop: '12px' }}>OUR EVENT ECOSYSTEM</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '32px'
          }} className="about-grid">
            {initiatives.map((pillar) => (
              <div 
                key={pillar.title} 
                style={{
                  backgroundColor: isDark ? '#111116' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #ECEAF5',
                  borderRadius: '8px',
                  padding: '32px',
                  display: 'flex',
                  gap: '20px',
                  transition: 'all 300ms ease'
                }}
                className="ecosystem-card"
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '6px',
                  backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : '#F0EDFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#A78BFA' : '#6D3DF5',
                  flexShrink: 0
                }}>
                  {pillar.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#111111', marginBottom: '8px' }}>{pillar.title}</h3>
                  <p style={{ fontSize: '13px', color: isDark ? '#A1A1AA' : '#6B7280', lineHeight: '1.6' }}>{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        .ecosystem-card:hover {
          border-color: ${isDark ? '#8B5CF6' : '#6D3DF5'} !important;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}
