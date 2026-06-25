import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home({ onNavigate }) {
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

  // Setup text reveal and magnetic scroll animations specifically for homepage components
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal-text');
    const triggers = [];

    revealElements.forEach((el) => {
      const anim = gsap.fromTo(el, 
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
      triggers.push(anim.scrollTrigger);
    });

    // Re-trigger cursor updates for magnetic elements loaded dynamically
    const updateHoverListeners = () => {
      const hovers = document.querySelectorAll('[data-cursor="hover"]');
      const cursor = document.getElementById('cursor');
      if (cursor) {
        hovers.forEach(el => {
          el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
          el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
      }
    };
    const timer = setTimeout(updateHoverListeners, 500);

    return () => {
      triggers.forEach(t => t && t.kill());
      clearTimeout(timer);
    };
  }, []);

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

  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 overflow-hidden">
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#5b5ff0] animate-pulse"></span>
            <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant font-semibold">Digital Alchemy</span>
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
            <button 
              onClick={() => onNavigate('portfolio')}
              className="btn-secondary w-full sm:w-auto px-8 py-4 rounded-full font-label-sm text-sm uppercase tracking-widest font-bold magnetic flex items-center justify-center gap-2 cursor-none" 
              data-cursor="hover"
            >
              View Portfolio
            </button>
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
            <div className="w-full lg:w-1/2 text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 reveal-text leading-tight font-headline">
                We fuse raw technical precision with high-end creative artistry.
              </h2>
              <p className="text-md md:text-lg text-on-surface-variant leading-relaxed reveal-text delay-100">
                Our command center operates at the bleeding edge of digital innovation, crafting bespoke solutions for elite tech startups and enterprise clients who demand uncompromising quality.
              </p>
            </div>
            
            <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 reveal-text delay-200 magnetic text-left" data-cursor="hover">
                <span className="text-5xl md:text-6xl font-extrabold text-[#5b5ff0]">25+</span>
                <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">Projects Completed</span>
              </div>
              <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 reveal-text delay-300 magnetic text-left" data-cursor="hover">
                <span className="text-5xl md:text-6xl font-extrabold text-[#5b5ff0]">99%</span>
                <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">Client Satisfaction</span>
              </div>
              <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 md:col-span-2 reveal-text delay-400 magnetic text-left" data-cursor="hover">
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
            <div className="glass-panel rounded-3xl p-10 flex flex-col justify-between md:col-span-2 group relative overflow-hidden min-h-[300px] text-left" data-cursor="hover">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5b5ff0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
              <div className="relative z-10">
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
              className="btn-primary w-full py-3.5 rounded-lg font-label-sm uppercase tracking-widest mt-4 magnetic flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-none"
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
    </>
  );
}
