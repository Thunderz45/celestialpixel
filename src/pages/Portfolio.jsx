import React, { useEffect } from 'react';
import { gsap } from 'gsap';

export default function Portfolio({ onNavigate }) {
  // Trigger text transitions on mount
  useEffect(() => {
    gsap.fromTo(".portfolio-item", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
    );

    // Setup custom cursor bindings
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

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 overflow-hidden">
      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center flex flex-col items-center">
        {/* Subheader */}
        <div className="portfolio-item inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#5b5ff0] animate-pulse"></span>
          <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant font-semibold">Visual Archives</span>
        </div>
        
        {/* Title */}
        <h1 className="portfolio-item text-4xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight font-headline">
          Case <span className="text-gradient-indigo">Studies</span>
        </h1>
        
        {/* Description Box (Glassmorphic) */}
        <div className="portfolio-item glass-panel p-8 md:p-12 rounded-3xl max-w-xl mx-auto mb-10 text-center">
          <span className="material-symbols-outlined text-4xl mb-4 text-[#5b5ff0] animate-spin [animation-duration:6s]">hourglass_empty</span>
          <p className="text-sm md:text-base text-on-surface leading-relaxed mb-6">
            Our creative digital case studies and media assets are currently being cataloged and structured. The archives will unlock shortly.
          </p>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto"></div>
        </div>

        {/* Back CTA Button */}
        <div className="portfolio-item">
          <button 
            onClick={() => onNavigate('home')}
            className="btn-primary px-8 py-4 rounded-full font-label-sm text-sm uppercase tracking-widest font-bold magnetic flex items-center justify-center gap-2 cursor-none"
            data-cursor="hover"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Core
          </button>
        </div>
      </div>
    </section>
  );
}
