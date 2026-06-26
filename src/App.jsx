import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import Home from './pages/Home.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/portfolio':
        return 'Work';
      case '/about':
        return 'About';
      case '/contact':
        return 'Contact';
      default:
        return 'CelestialPixel';
    }
  };

  // Mobile Nav State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', sender: 'Celesti', content: 'Greetings, voyager. I am Celesti. How can I assist you with CelestialPixel\'s services today?' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatMessagesEndRef = useRef(null);

  // Setup GSAP magnetic effects
  useEffect(() => {
    const magneticElements = document.querySelectorAll('.magnetic');

    const onMouseMove = (e, el) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const onMouseLeave = (el) => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    magneticElements.forEach((el) => {
      el.addEventListener('mousemove', (e) => onMouseMove(e, el));
      el.addEventListener('mouseleave', () => onMouseLeave(el));
    });

    return () => {
      magneticElements.forEach((el) => {
        el.removeEventListener('mousemove', (e) => onMouseMove(e, el));
        el.removeEventListener('mouseleave', () => onMouseLeave(el));
      });
    };
  }, [chatOpen, location.pathname]);

  // Scroll Chat to Bottom on messages change
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatLoading]);

  // Dynamic full-screen fade transition using GSAP
  const triggerPageTransition = (targetPath) => {
    if (location.pathname === targetPath) {
      setMobileMenuOpen(false);
      return;
    }

    setTimeout(() => {
      setMobileMenuOpen(false);
    }, 50);

    const overlay = document.getElementById('transition-overlay');
    if (!overlay) {
      navigate(targetPath);
      window.scrollTo(0, 0);
      return;
    }

    gsap.timeline()
      .to(overlay, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.inOut',
        onStart: () => {
          overlay.style.pointerEvents = 'all';
          overlay.style.visibility = 'visible';
        },
        onComplete: () => {
          navigate(targetPath);
          window.scrollTo(0, 0);
        }
      })
      .to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        delay: 0.1,
        onComplete: () => {
          overlay.style.pointerEvents = 'none';
          overlay.style.visibility = 'hidden';
        }
      });
  };

  // Chatbot Send Message Handler (Groq proxy local api)
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    setChatInput('');
    const userMessage = { role: 'user', sender: 'You', content: text };
    const updatedHistory = [...chatMessages, userMessage];
    setChatMessages(updatedHistory);
    setChatLoading(true);

    try {
      const apiHistory = updatedHistory.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiHistory })
      });

      const data = await response.json();

      if (response.ok && data.success && data.reply) {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          sender: 'Celesti',
          content: data.reply.content
        }]);
      } else {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          sender: 'Celesti',
          content: data.error || 'Connection compromised. Please try again.'
        }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        sender: 'Celesti',
        content: 'Apologies, I encountered a communication uplink issue.'
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="relative font-body bg-background text-on-surface min-h-screen overflow-x-hidden">

      {/* Page Fade Transition Overlay */}
      <div
        id="transition-overlay"
        className="fixed inset-0 z-[100] bg-[#0B0D12] flex flex-col items-center justify-center pointer-events-none opacity-0 invisible"
      >
        <div className="flex flex-col items-center gap-4">
          <img alt="CelestialPixel Logo" className="h-16 w-auto animate-pulse" src="logo.png" />
          <span className="font-headline text-lg font-bold text-on-surface tracking-widest uppercase animate-pulse">CelestialPixel</span>
        </div>
      </div>

      {/* Grid background overlay */}
      <div className="fixed inset-0 z-[-1] bg-grid opacity-50 pointer-events-none"></div>

      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        {/* Desktop Nav */}
        <div className="bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-2xl md:flex hidden w-full">
          <div className="flex justify-between items-center px-margin-desktop py-2 max-w-container-max mx-auto w-full">
            <button
              onClick={() => triggerPageTransition('/')}
              className="font-headline text-lg font-bold text-on-surface tracking-tighter flex items-center gap-4 magnetic"
              data-cursor="hover"
            >
              <img alt="CelestialPixel Logo" className="h-8 w-auto" src="logo.png" />
              CelestialPixel
            </button>

            <div className="flex items-center gap-8">
              <button
                onClick={() => triggerPageTransition('/')}
                className={`text-on-surface hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold magnetic ${location.pathname === '/' ? 'text-primary border-b border-primary/40 pb-0.5' : ''
                  }`}
                data-cursor="hover"
              >
                Home
              </button>
              <button
                onClick={() => triggerPageTransition('/portfolio')}
                className={`text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold magnetic ${location.pathname === '/portfolio' ? 'text-primary border-b border-primary/40 pb-0.5' : ''
                  }`}
                data-cursor="hover"
              >
                Work
              </button>
              <button
                onClick={() => triggerPageTransition('/about')}
                className={`text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold magnetic ${location.pathname === '/about' ? 'text-primary border-b border-primary/40 pb-0.5' : ''
                  }`}
                data-cursor="hover"
              >
                About
              </button>
              <button
                onClick={() => triggerPageTransition('/contact')}
                className={`text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold magnetic ${location.pathname === '/contact' ? 'text-primary border-b border-primary/40 pb-0.5' : ''
                  }`}
                data-cursor="hover"
              >
                Contact
              </button>
            </div>

            <button
              onClick={() => triggerPageTransition('/contact')}
              className="btn-primary px-4 py-2 text-xs rounded-full font-label-sm uppercase tracking-widest magnetic"
              data-cursor="hover"
            >
              Start Project
            </button>
          </div>
        </div>

        {/* Mobile Nav Header */}
        <div className="flex justify-between items-center px-margin-mobile py-4 md:hidden bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-lg">
          <button
            onClick={() => triggerPageTransition('/')}
            className="font-headline text-md font-bold text-on-surface tracking-tighter flex items-center gap-2"
          >
            <img alt="CelestialPixel Logo" className="h-6 w-auto" src="logo.png" />
            CelestialPixel
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-on-surface focus:outline-none transition-all duration-300 hover:bg-white/10 active:scale-90"
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
          >
            <span className={`material-symbols-outlined text-2xl transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90 text-primary' : ''}`}>
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer - Conditionally rendered to prevent touch blocking */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[45] md:hidden flex flex-col justify-center items-center"
          style={{ backgroundColor: 'rgba(18, 19, 27, 0.98)' }}
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none"></div>

          {/* Glowing Radial Orb decoration */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#5b5ff0]/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="flex flex-col items-center gap-8 text-center relative z-10">
            {/* Menu Links */}
            {[
              { label: 'Home', path: '/' },
              { label: 'Work', path: '/portfolio' },
              { label: 'About', path: '/about' },
              { label: 'Contact', path: '/contact' }
            ].map((link) => (
              <button
                key={link.path}
                onClick={() => triggerPageTransition(link.path)}
                className={`text-3xl font-extrabold uppercase tracking-widest font-headline hover:text-primary transition-colors duration-300 ${
                  location.pathname === link.path ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Start Project CTA */}
            <button
              onClick={() => triggerPageTransition('/contact')}
              className="btn-primary mt-8 px-8 py-3 rounded-full font-label-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform duration-300"
            >
              Start Project
            </button>

            {/* Mobile menu footer */}
            <div className="mt-16 flex flex-col items-center gap-1 text-[11px] text-on-surface-variant tracking-wider opacity-60">
              <span>hello@celestialpixel.com</span>
              <span>© 2026 CelestialPixel. All rights reserved.</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Pages router */}
      <main>
        <Routes>
          <Route path="/" element={<Home onNavigate={triggerPageTransition} />} />
          <Route path="/portfolio" element={<Portfolio onNavigate={triggerPageTransition} />} />
          <Route path="/about" element={<About onNavigate={triggerPageTransition} />} />
          <Route path="/contact" element={<Contact onNavigate={triggerPageTransition} />} />
        </Routes>
      </main>

      {/* Celesti Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-body text-on-surface pointer-events-none">
        {/* Chat Window */}
        <div
          id="chat-window"
          className={`glass-panel w-[360px] max-w-[calc(100vw-2rem)] h-[480px] rounded-2xl flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${chatOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
            }`}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 block absolute top-0 left-0 animate-ping"></span>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm tracking-wide font-headline">Celesti</h4>
                <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">Virtual Concierge</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-on-surface-variant hover:text-white transition-colors duration-200"
              data-cursor="hover"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'self-end items-end text-right' : 'self-start text-left'}`}
              >
                <span className={`text-[9px] font-bold uppercase tracking-wider pl-1 ${msg.role === 'user' ? 'text-[#c0c1ff]' : 'text-[#5b5ff0]'
                  }`}>
                  {msg.sender}
                </span>
                <div className={`px-4 py-3 text-sm ${msg.role === 'user'
                  ? 'bg-[#5b5ff0] border border-[#5b5ff0]/50 rounded-2xl rounded-tr-none text-white'
                  : 'bg-white/5 border border-white/10 rounded-2xl rounded-tl-none text-on-surface'
                  }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex flex-col gap-1 max-w-[85%] self-start text-left">
                <span className="text-[9px] text-[#5b5ff0] font-bold uppercase tracking-wider pl-1">Celesti</span>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-on-surface flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatMessagesEndRef}></div>
          </div>

          {/* Form Input */}
          <form onSubmit={handleChatSubmit} className="p-4 border-t border-white/10 bg-white/5 flex gap-2 items-center">
            <input
              type="text"
              autoComplete="off"
              placeholder="Commune with Celesti..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#5b5ff0] transition-colors duration-300"
            />
            <button
              type="submit"
              className="btn-primary w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105"
              data-cursor="hover"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>

        {/* Floating Bubble Launcher */}
        <button
          onClick={() => setChatOpen(prev => !prev)}
          className="btn-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg relative magnetic pointer-events-auto"
          data-cursor="hover"
        >
          <span className={`material-symbols-outlined text-2xl transition-all duration-300 absolute ${chatOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>chat_bubble</span>
          <span className={`material-symbols-outlined text-2xl transition-all duration-300 absolute ${chatOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>close</span>
        </button>
      </div>
    </div>
  );
}
