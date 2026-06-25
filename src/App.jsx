import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // Cursor coordinates
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Website Development',
    message: '',
    _honey: ''
  });
  const [formStatus, setFormStatus] = useState({ type: null, message: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  // Setup Custom Cursor
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
  }, [chatOpen, formLoading]);

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
  }, [chatOpen, formLoading]);

  // Setup text reveal animations with scroll
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal-text');
    revealElements.forEach((el) => {
      gsap.fromTo(el, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  // Scroll Chat to Bottom on messages change
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatLoading]);

  // Form Submit Handler (Using FormSubmit free AJAX API)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Honeypot spam check
    if (formData._honey) {
      setFormStatus({ type: 'success', message: 'Message sent successfully.' });
      setSubmitted(true);
      return;
    }

    if (submitted) {
      setFormStatus({ type: 'error', message: 'Duplicate submission blocked.' });
      return;
    }

    setFormLoading(true);
    setFormStatus({ type: null, message: '' });

    // Format auto-response mail template
    const autoresponseText = `Hi ${formData.name},

Thank you for contacting us. We have received your inquiry regarding "${formData.service}" and our team will review it shortly.

We will get back to you as soon as possible.

Best Regards,
CelestialPixel`;

    // Construct submission body
    const submissionBody = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'Not Provided',
      service: formData.service,
      message: formData.message,
      _subject: `New Lead Received – ${formData.name}`,
      _autoresponse: autoresponseText,
    };

    try {
      const response = await fetch('https://formsubmit.co/ajax/bhushanpadghan87@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submissionBody)
      });

      const result = await response.json();

      if (response.ok && result.success === 'true') {
        setFormStatus({ type: 'success', message: 'Transmission Successful! Check your inbox shortly.' });
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'Website Development',
          message: '',
          _honey: ''
        });
      } else {
        setFormStatus({ type: 'error', message: result.message || 'Transmission failed. Please try again.' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFormStatus({ type: 'error', message: 'Network error. Please check your connectivity.' });
    } finally {
      setFormLoading(false);
    }
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
      // Map format for groq completions API
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
          <a className="font-headline text-lg font-bold text-on-surface tracking-tighter flex items-center gap-4 magnetic" data-cursor="hover" href="#">
            <img alt="CelestialPixel Logo" className="h-8 w-auto" src="logo.png"/>
            CelestialPixel
          </a>
          <div className="flex items-center gap-8">
            <a className="text-on-surface hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold magnetic" data-cursor="hover" href="#">Home</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold magnetic" data-cursor="hover" href="#contact">Contact</a>
          </div>
          <a className="btn-primary px-4 py-2 text-xs rounded-full font-label-sm uppercase tracking-widest magnetic" data-cursor="hover" href="#contact">Start Project</a>
        </div>

        {/* Mobile Nav */}
        <div className="flex justify-between items-center px-margin-mobile py-4 md:hidden bg-surface/80 backdrop-blur-xl">
          <a className="font-headline text-md font-bold text-on-surface tracking-tighter flex items-center gap-2" href="#">
            <img alt="CelestialPixel Logo" className="h-6 w-auto" src="logo.png"/>
            CelestialPixel
          </a>
          <div className="flex items-center gap-4">
            <a className="text-on-surface hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold" href="#">Home</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-sm uppercase tracking-widest text-xs font-semibold" href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* Main Sections */}
      <main>
        {/* 1. Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 overflow-hidden">
          {/* WebGL Canvas */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-60">
            <canvas ref={canvasRef} className="w-full h-full block"></canvas>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-0"></div>

          <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#5b5ff0] animate-pulse"></span>
              <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">Digital Alchemy</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight max-w-4xl mx-auto tracking-tight font-headline">
              Building Digital <br/><span className="text-gradient-indigo">Experiences</span><br/> That Drive Growth.
            </h1>
            
            <p className="text-md md:text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto leading-relaxed">
              Web Development, SEO, Social Media Management, Product Photography &amp; Meta Advertising.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <a className="btn-primary w-full sm:w-auto px-8 py-4 rounded-full font-label-sm text-sm uppercase tracking-widest font-bold magnetic flex items-center justify-center gap-2" data-cursor="hover" href="#contact">
                Book a Consultation
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
              <a className="btn-secondary w-full sm:w-auto px-8 py-4 rounded-full font-label-sm text-sm uppercase tracking-widest font-bold magnetic flex items-center justify-center gap-2" data-cursor="hover" href="#services">
                View Capabilities
              </a>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <span className="font-label-sm text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
          </div>
        </section>

        {/* 2. About Preview */}
        <section className="py-16 relative overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col lg:flex-row gap-20">
              <div className="w-full lg:w-1/2">
                <h2 className="text-3xl md:text-5xl font-bold mb-8 reveal-text leading-tight font-headline">
                  We fuse raw technical precision with high-end creative artistry.
                </h2>
                <p className="text-md md:text-lg text-on-surface-variant leading-relaxed reveal-text delay-100">
                  Our command center operates at the bleeding edge of digital innovation, crafting bespoke solutions for elite tech startups and enterprise clients who demand uncompromising quality.
                </p>
              </div>
              
              <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 reveal-text delay-200 magnetic" data-cursor="hover">
                  <span className="text-5xl md:text-6xl font-extrabold text-[#5b5ff0]">25+</span>
                  <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">Projects Completed</span>
                </div>
                <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 reveal-text delay-300 magnetic" data-cursor="hover">
                  <span className="text-5xl md:text-6xl font-extrabold text-[#5b5ff0]">99%</span>
                  <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">Client Satisfaction</span>
                </div>
                <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 md:col-span-2 reveal-text delay-400 magnetic" data-cursor="hover">
                  <span className="text-5xl md:text-6xl font-extrabold text-[#5b5ff0]">1M+</span>
                  <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">Campaign Reach</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Services Section (Bento Grid) */}
        <section className="py-16 relative" id="services">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="mb-20 text-center flex flex-col items-center">
              <span className="font-label-sm text-xs uppercase tracking-widest text-[#5b5ff0] mb-4">Capabilities</span>
              <h2 className="text-3xl md:text-5xl font-bold reveal-text font-headline">Our Arsenal</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Web Development */}
              <div className="glass-panel rounded-3xl p-10 flex flex-col justify-between md:col-span-2 group relative overflow-hidden min-h-[300px]" data-cursor="hover">
                <div className="absolute inset-0 bg-gradient-to-br from-[#5b5ff0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                <div className="relative z-10 text-left">
                  <span className="material-symbols-outlined text-4xl mb-6 text-[#5b5ff0]">code</span>
                  <h3 className="text-2xl font-bold mb-4 font-headline">Website Development</h3>
                  <p className="text-sm text-on-surface-variant max-w-md">High-performance, headless architectures and immersive frontend experiences tailored for scale.</p>
                </div>
                <div className="mt-8 flex gap-2 relative z-10">
                  <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 font-label-sm text-[10px] uppercase font-bold text-on-surface-variant">React</span>
                  <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 font-label-sm text-[10px] uppercase font-bold text-on-surface-variant">Vite</span>
                </div>
              </div>

              {/* SEO Optimization */}
              <div className="glass-panel rounded-3xl p-10 flex flex-col justify-between group relative overflow-hidden text-left" data-cursor="hover">
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-4xl mb-6 text-[#5b5ff0]">travel_explore</span>
                  <h3 className="text-xl font-bold mb-4 font-headline">SEO Optimization</h3>
                  <p className="text-sm text-on-surface-variant">Data-driven visibility strategies, keyword intelligence, and technical schema structuring for search dominance.</p>
                </div>
              </div>

              {/* Social Media Handling */}
              <div className="glass-panel rounded-3xl p-10 flex flex-col justify-between group relative overflow-hidden text-left" data-cursor="hover">
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-4xl mb-6 text-[#5b5ff0]">share</span>
                  <h3 className="text-xl font-bold mb-4 font-headline">Social Media</h3>
                  <p className="text-sm text-on-surface-variant">Strategic brand narratives, community building, and automated content scheduling workflows.</p>
                </div>
              </div>

              {/* Product Shoot & Photography */}
              <div className="glass-panel rounded-3xl p-10 flex flex-col justify-between group relative overflow-hidden text-left" data-cursor="hover">
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-4xl mb-6 text-[#5b5ff0]">camera</span>
                  <h3 className="text-xl font-bold mb-4 font-headline">Product Shoot</h3>
                  <p className="text-sm text-on-surface-variant">Cinematic visual assets, post-processing grading, and high-fidelity product representations.</p>
                </div>
              </div>

              {/* Meta Ads Management */}
              <div className="glass-panel rounded-3xl p-10 flex flex-col justify-between group relative overflow-hidden text-left" data-cursor="hover">
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-4xl mb-6 text-[#5b5ff0]">campaign</span>
                  <h3 className="text-xl font-bold mb-4 font-headline">Meta Ads</h3>
                  <p className="text-sm text-on-surface-variant">High-conversion targeted campaigns, pixel tracking telemetry, and A/B ad variant experimentation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Contact Form Section */}
        <section className="py-16 relative border-t border-white/5" id="contact">
          <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 reveal-text font-headline">
              Let's Build Something <span className="text-[#5b5ff0]">Extraordinary.</span>
            </h2>
            
            <form onSubmit={handleFormSubmit} className="mt-16 flex flex-col gap-6 max-w-2xl mx-auto text-left relative">
              {/* Honeypot Spam Protection Field */}
              <input 
                type="text" 
                name="_honey" 
                value={formData._honey} 
                onChange={(e) => setFormData(prev => ({ ...prev, _honey: e.target.value }))} 
                className="hidden" 
                autoComplete="off"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative flex flex-col gap-2">
                  <label htmlFor="contact-name" className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Full Name *</label>
                  <input 
                    id="contact-name" 
                    type="text"
                    required
                    placeholder="e.g. Bhushan Padghan"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-lg px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#5b5ff0] transition-colors duration-300"
                  />
                </div>
                
                <div className="relative flex flex-col gap-2">
                  <label htmlFor="contact-email" className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Email Address *</label>
                  <input 
                    id="contact-email" 
                    type="email"
                    required
                    placeholder="e.g. bhushan@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-lg px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#5b5ff0] transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative flex flex-col gap-2">
                  <label htmlFor="contact-phone" className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Phone Number (Optional)</label>
                  <input 
                    id="contact-phone" 
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-lg px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#5b5ff0] transition-colors duration-300"
                  />
                </div>

                <div className="relative flex flex-col gap-2">
                  <label htmlFor="contact-service" className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Service Interested In *</label>
                  <select 
                    id="contact-service"
                    value={formData.service}
                    onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-[#5b5ff0] transition-colors duration-300 appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center', backgroundSize: '1rem' }}
                  >
                    <option value="Website Development">Website Development</option>
                    <option value="SEO Optimization">SEO Optimization</option>
                    <option value="Social Media Management">Social Media Management</option>
                    <option value="Product Shoot & Photography">Product Shoot &amp; Photography</option>
                    <option value="Meta Ads Management">Meta Ads Management</option>
                  </select>
                </div>
              </div>

              <div className="relative flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Project details *</label>
                <textarea 
                  id="contact-message"
                  required
                  rows="4"
                  placeholder="Outline your goals, timelines, and budgets..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-lg px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#5b5ff0] transition-colors duration-300"
                ></textarea>
              </div>

              <button 
                id="contact-submit" 
                type="submit" 
                disabled={formLoading || submitted}
                className="btn-primary w-full py-3.5 rounded-lg font-label-sm uppercase tracking-widest mt-4 magnetic flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                data-cursor="hover"
              >
                {formLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Transmitting...</span>
                  </>
                ) : submitted ? (
                  <span>Lead Transmitted</span>
                ) : (
                  <span>Initiate Sequence</span>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 flex flex-col items-center justify-center space-y-gutter px-margin-desktop border-t border-white/5">
        <div className="font-headline text-6xl font-extrabold text-on-surface opacity-10 pointer-events-none tracking-widest">
          CELESTIAL
        </div>
        <div className="flex gap-8">
          <a className="text-on-surface-variant hover:text-primary transition-all font-label-sm uppercase tracking-widest text-xs font-semibold magnetic" data-cursor="hover" href="https://www.instagram.com/_celestialpixel_/" target="_blank" rel="noreferrer">Instagram</a>
          <a className="text-on-surface-variant hover:text-primary transition-all font-label-sm uppercase tracking-widest text-xs font-semibold magnetic" data-cursor="hover" href="https://www.linkedin.com/company/celestialpixel/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
        <p className="font-body-md text-xs text-on-surface-variant mt-4">© 2024 CelestialPixel. Digital Alchemy in Motion.</p>
      </footer>

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
                <span class="w-3 h-3 rounded-full bg-emerald-500 block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500 block absolute top-0 left-0 animate-ping"></span>
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
              autocomplete="off"
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

      {/* Floating Status Toast Alert */}
      {formStatus.message && (
        <div 
          className="fixed bottom-8 right-8 z-50 glass-panel px-6 py-4 rounded-xl flex flex-col gap-2 max-w-sm pointer-events-auto shadow-2xl transition-all duration-500"
          style={{ borderColor: formStatus.type === 'success' ? 'rgba(91, 95, 240, 0.6)' : 'rgba(239, 68, 68, 0.6)' }}
        >
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined ${formStatus.type === 'success' ? 'text-[#5b5ff0]' : 'text-red-500'}`}>
              {formStatus.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="font-label-sm uppercase tracking-wider text-xs text-on-surface">{formStatus.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
