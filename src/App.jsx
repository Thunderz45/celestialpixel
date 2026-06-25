import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import Home from './pages/Home.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Contact from './pages/Contact.jsx';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Cursor coordinates
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef(null);

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', sender: 'Celesti', content: 'Greetings, voyager. I am Celesti. How can I assist you with CelestialPixel\'s services today?' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatMessagesEndRef = useRef(null);

  // References
  const canvasRef = useRef(null);

  // Setup Custom Cursor coordinates
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Update cursor hover states for custom element selections
  useEffect(() => {
    const updateHoverListeners = () => {
      const hovers = document.querySelectorAll('[data-cursor="hover"]');
      hovers.forEach(el => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };
    // Delayed initial hook to allow full rendering
    const timer = setTimeout(updateHoverListeners, 1000);
    return () => clearTimeout(timer);
  }, [chatOpen, location.pathname]);

  // Setup WebGL fluid noise background shader
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animFrameId;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    function syncSize() {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    syncSize();

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
          vec2 uv = v_texCoord;
          float t = u_time * 0.2;
          
          float n1 = snoise(uv * 2.0 + t);
          float n2 = snoise(uv * 3.0 - t * 0.5);
          
          vec3 color1 = vec3(0.043, 0.051, 0.071); // #0B0D12
          vec3 color2 = vec3(0.357, 0.373, 0.941); // #5B5FF0
          vec3 color3 = vec3(0.165, 0.180, 0.216); // #2A2E37
          
          vec3 color = mix(color1, color3, n1 * 0.5 + 0.5);
          color = mix(color, color2, n2 * 0.3 + 0.1);
          
          float dist = distance(uv, vec2(0.5));
          color *= 1.2 - dist;
          
          gl_FragColor = vec4(color, 1.0);
      }
    `;

    function cs(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');

    function render(t) {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animFrameId = requestAnimationFrame(render);
    }
    render(0);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, []);

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
    if (location.pathname === targetPath) return;

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
        className="fixed inset-0 z-[100] bg-[#0B0D12] flex flex-col items-center justify-center pointer-events-none opacity-0"
      >
        <div className="flex flex-col items-center gap-4">
          <img alt="CelestialPixel Logo" className="h-16 w-auto animate-pulse" src="logo.png"/>
          <span className="font-headline text-lg font-bold text-on-surface tracking-widest uppercase animate-pulse">CelestialPixel</span>
        </div>
      </div>

      {/* Custom Cursor */}
      <div 
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? 'hovering' : ''} md:block hidden`}
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      >
        <span className="cursor-text">View</span>
      </div>

      {/* Grid background overlay */}
      <div className="fixed inset-0 z-[-1] bg-grid opacity-50 pointer-events-none"></div>

      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-2xl">
        <div className="flex justify-between items-center px-margin-desktop py-2 max-w-container-max mx-auto md:flex hidden">
          <button 
            onClick={() => triggerPageTransition('/')}
            className="font-headline text-lg font-bold text-on-surface tracking-tighter flex items-center gap-4 magnetic cursor-none" 
            data-cursor="hover"
          >
            <img alt="CelestialPixel Logo" className="h-8 w-auto" src="logo.png"/>
            CelestialPixel
          </button>
          
          <div className="flex items-center gap-8">
            <button 
              onClick={() => triggerPageTransition('/')}
              className={`text-on-surface hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold magnetic cursor-none ${
                location.pathname === '/' ? 'text-primary border-b border-primary/40 pb-0.5' : ''
              }`}
              data-cursor="hover"
            >
              Home
            </button>
            <button 
              onClick={() => triggerPageTransition('/portfolio')}
              className={`text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold magnetic cursor-none ${
                location.pathname === '/portfolio' ? 'text-primary border-b border-primary/40 pb-0.5' : ''
              }`}
              data-cursor="hover"
            >
              Work
            </button>
            <button 
              onClick={() => triggerPageTransition('/contact')}
              className={`text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold magnetic cursor-none ${
                location.pathname === '/contact' ? 'text-primary border-b border-primary/40 pb-0.5' : ''
              }`}
              data-cursor="hover"
            >
              Contact
            </button>
          </div>
          
          <button 
            onClick={() => triggerPageTransition('/contact')}
            className="btn-primary px-4 py-2 text-xs rounded-full font-label-sm uppercase tracking-widest magnetic cursor-none" 
            data-cursor="hover"
          >
            Start Project
          </button>
        </div>

        {/* Mobile Nav */}
        <div className="flex justify-between items-center px-margin-mobile py-4 md:hidden bg-surface/80 backdrop-blur-xl">
          <button 
            onClick={() => triggerPageTransition('/')}
            className="font-headline text-md font-bold text-on-surface tracking-tighter flex items-center gap-2"
          >
            <img alt="CelestialPixel Logo" className="h-6 w-auto" src="logo.png"/>
            CelestialPixel
          </button>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => triggerPageTransition('/')}
              className={`hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold ${
                location.pathname === '/' ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => triggerPageTransition('/portfolio')}
              className={`hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold ${
                location.pathname === '/portfolio' ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              Work
            </button>
            <button 
              onClick={() => triggerPageTransition('/contact')}
              className={`hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold ${
                location.pathname === '/contact' ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Main Pages router */}
      <main>
        <Routes>
          <Route path="/" element={<Home onNavigate={triggerPageTransition} />} />
          <Route path="/portfolio" element={<Portfolio onNavigate={triggerPageTransition} />} />
          <Route path="/contact" element={<Contact onNavigate={triggerPageTransition} />} />
        </Routes>
      </main>

      {/* Celesti Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-body text-on-surface">
        {/* Chat Window */}
        <div 
          id="chat-window" 
          className={`glass-panel w-[360px] max-w-[calc(100vw-2rem)] h-[480px] rounded-2xl flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${
            chatOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
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
                <span className={`text-[9px] font-bold uppercase tracking-wider pl-1 ${
                  msg.role === 'user' ? 'text-[#c0c1ff]' : 'text-[#5b5ff0]'
                }`}>
                  {msg.sender}
                </span>
                <div className={`px-4 py-3 text-sm ${
                  msg.role === 'user' 
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
          className="btn-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg relative cursor-none magnetic"
          data-cursor="hover"
        >
          <span className={`material-symbols-outlined text-2xl transition-all duration-300 absolute ${chatOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>chat_bubble</span>
          <span className={`material-symbols-outlined text-2xl transition-all duration-300 absolute ${chatOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>close</span>
        </button>
      </div>
    </div>
  );
}
