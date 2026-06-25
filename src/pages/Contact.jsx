import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';

export default function Contact({ onNavigate }) {
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

  // Trigger GSAP reveal animation on mount
  useEffect(() => {
    gsap.fromTo(".contact-item", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" }
    );

    // Setup custom cursor hover bindings
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
    updateHoverListeners();
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
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 overflow-hidden">
      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center flex flex-col items-center w-full">
        {/* Subheader */}
        <div className="contact-item inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#5b5ff0] animate-pulse"></span>
          <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant font-semibold">Uplink Protocol</span>
        </div>
        
        {/* Title */}
        <h1 className="contact-item text-4xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight font-headline">
          Initiate <span className="text-gradient-indigo">Contact</span>
        </h1>

        <p className="contact-item text-sm md:text-base text-on-surface-variant max-w-lg mb-10 leading-relaxed">
          Fill out the secure ledger below. Our digital orchestrators will reply via telemetry in short order.
        </p>
        
        {/* Form Container (Glassmorphic) */}
        <div className="contact-item glass-panel p-8 md:p-12 rounded-3xl w-full max-w-2xl mx-auto mb-10 text-left">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6 relative">
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

        {/* Back CTA Button */}
        <div className="contact-item">
          <button 
            onClick={() => onNavigate('/')}
            className="btn-secondary px-8 py-4 rounded-full font-label-sm text-sm uppercase tracking-widest font-bold magnetic flex items-center justify-center gap-2 cursor-none"
            data-cursor="hover"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Core
          </button>
        </div>
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
    </section>
  );
}
