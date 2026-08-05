import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Zap, BarChart3, MessageSquare, CheckCircle2, ChevronDown } from 'lucide-react';
import Logo from './Logo';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const navLinkStyle = {
    color: '#94A3B8',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'color 0.15s ease'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070B17', color: '#F1F5F9', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* Subtle background radials */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '30%', width: '560px', height: '560px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.10) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '50%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(34, 211, 238, 0.07) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      {/* Navbar with Matching Logo */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 60px', borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(7, 11, 23, 0.85)', backdropFilter: 'blur(12px)'
      }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Logo size={34} />
        </div>

        <div style={{ display: 'flex', gap: '36px' }}>
          <a href="#features" style={navLinkStyle}>Features</a>
          <a href="#how-it-works" style={navLinkStyle}>How it works</a>
          <a href="#faq" style={navLinkStyle}>FAQ</a>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/login')} className="btn-secondary" style={{ padding: '9px 20px', borderRadius: '8px', fontSize: '14px' }}>
            Sign in
          </button>
          <button onClick={() => navigate('/gateway')} className="btn-primary" style={{ padding: '9px 20px', borderRadius: '8px', fontSize: '14px' }}>
            Get started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '90px 60px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div className="animate-fade-in">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.25)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', color: '#A78BFA', fontWeight: 600, marginBottom: '28px', letterSpacing: '0.02em' }}>
            Classroom participation platform
          </div>

          <h1 style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '20px', color: '#F1F5F9' }}>
            Keep every student<br />
            <span className="text-gradient">engaged and heard.</span>
          </h1>

          <p style={{ fontSize: '17px', color: '#94A3B8', lineHeight: 1.7, marginBottom: '36px', maxWidth: '460px' }}>
            SyncPoll lets instructors run live polls, track class comprehension, and collect anonymous questions in a single interactive room.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/gateway')} className="btn-primary" style={{ padding: '13px 28px', borderRadius: '10px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Get started free <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/gateway')} className="btn-secondary" style={{ padding: '13px 24px', borderRadius: '10px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Play size={15} color="#7C3AED" /> Join session
            </button>
          </div>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="animate-float">
          <div className="glass-card-static" style={{ padding: '28px', border: '1px solid rgba(124, 58, 237, 0.2)', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.5)' }}>
            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-dot" />
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Live Session Room</span>
              </div>
              <span style={{ fontSize: '12px', color: '#22D3EE', background: 'rgba(34,211,238,0.08)', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
                Active Session
              </span>
            </div>

            {/* Comprehension block */}
            <div style={{ background: '#0E1525', borderRadius: '10px', padding: '18px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>Comprehension Pulse</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>Clear</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Real-time student feedback</div>
                </div>
                <span style={{ fontSize: '32px' }}>😀</span>
              </div>
            </div>

            {/* Active poll block */}
            <div style={{ background: '#0E1525', borderRadius: '10px', padding: '18px' }}>
              <div style={{ fontSize: '11px', color: '#A78BFA', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Live Polling</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#F1F5F9', marginBottom: '14px' }}>Instant response collection</div>
              <div>
                <div style={{ height: '6px', background: '#141D30', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #7C3AED, #2563EB)', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" style={{ background: '#0E1525', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '80px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ color: '#7C3AED', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Features</p>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.5px' }}>Built for seamless classroom engagement</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: <Zap size={22} color="#7C3AED" />,
                accent: 'rgba(124,58,237,0.1)',
                title: 'Live Polling',
                desc: 'Broadcast multiple-choice questions and view incoming responses live.'
              },
              {
                icon: <BarChart3 size={22} color="#22D3EE" />,
                accent: 'rgba(34,211,238,0.1)',
                title: 'Comprehension Meter',
                desc: 'Students signal how well they are following along in real time.'
              },
              {
                icon: <MessageSquare size={22} color="#10B981" />,
                accent: 'rgba(16,185,129,0.1)',
                title: 'Q&A Queue',
                desc: 'Students post questions and upvote peer queries anonymously.'
              }
            ].map((f, i) => (
              <div key={i} className="glass-card" style={{ padding: '28px' }}>
                <div style={{ background: f.accent, padding: '10px', borderRadius: '10px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#F1F5F9', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#7C3AED', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>How it works</p>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.5px', marginBottom: '20px' }}>Simple setup for instructors & students</h2>
            <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.7, marginBottom: '28px' }}>
              Instructors create a session and share a room code. Students join directly from their browser on any device.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                'Create a session and share your room code',
                'Students join instantly without account setup',
                'Launch polls and monitor class understanding live'
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: '#CBD5E1', fontSize: '15px' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '36px', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F1F5F9', marginBottom: '20px' }}>Session Management</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#0E1525', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94A3B8', fontSize: '14px' }}>Participant Access</span>
                <strong style={{ color: '#22D3EE', fontSize: '14px' }}>Room Code</strong>
              </div>
              <div style={{ background: '#0E1525', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94A3B8', fontSize: '14px' }}>Feedback Mode</span>
                <strong style={{ color: '#A78BFA', fontSize: '14px' }}>Real-time</strong>
              </div>
              <div style={{ background: '#0E1525', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94A3B8', fontSize: '14px' }}>Privacy</span>
                <strong style={{ color: '#10B981', fontSize: '14px' }}>Protected</strong>
              </div>
            </div>
            <button onClick={() => navigate('/gateway')} className="btn-primary" style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '14px', marginTop: '24px' }}>
              Start a Session
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.5px' }}>Frequently Asked Questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { q: 'Do students need an account to join?', a: 'No. Students join directly using the session room code from any browser.' },
            { q: 'Can questions be submitted anonymously?', a: 'Yes. Students can submit and upvote questions anonymously.' },
            { q: 'Which devices are supported?', a: 'SyncPoll runs in any web browser on desktop, tablet, or mobile devices.' }
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '18px 22px', cursor: 'pointer', userSelect: 'none' }} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '15px', color: '#F1F5F9' }}>
                <span>{item.q}</span>
                <ChevronDown size={18} color="#7C3AED" style={{ transform: activeFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0, marginLeft: '12px' }} />
              </div>
              {activeFaq === i && (
                <p style={{ marginTop: '10px', color: '#94A3B8', fontSize: '14px', lineHeight: 1.65 }}>{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(37,99,235,0.10) 100%)', borderTop: '1px solid rgba(124,58,237,0.2)', padding: '72px 60px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.5px', marginBottom: '14px' }}>Ready to get started?</h2>
        <p style={{ color: '#94A3B8', fontSize: '16px', marginBottom: '32px' }}>Create your interactive classroom session in seconds.</p>
        <button onClick={() => navigate('/gateway')} className="btn-primary" style={{ padding: '14px 36px', borderRadius: '10px', fontSize: '16px', fontWeight: 700 }}>
          Create a Session
        </button>
      </section>

    </div>
  );
};

export default LandingPage;
