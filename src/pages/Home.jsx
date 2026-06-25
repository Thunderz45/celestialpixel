import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home({ onNavigate }) {
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

    return () => {
      triggers.forEach(t => t && t.kill());
    };
  }, []);

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
            <button 
              onClick={() => onNavigate('/contact')}
              className="btn-primary w-full sm:w-auto px-8 py-4 rounded-full font-label-sm text-sm uppercase tracking-widest font-bold magnetic flex items-center justify-center gap-2" 
              data-cursor="hover"
            >
              Book a Consultation
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <button 
              onClick={() => onNavigate('portfolio')}
              className="btn-secondary w-full sm:w-auto px-8 py-4 rounded-full font-label-sm text-sm uppercase tracking-widest font-bold magnetic flex items-center justify-center gap-2" 
              data-cursor="hover"
            >
              View Portfolio
            </button>
          </div>
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

      {/* 4. Contact Section */}
      <section className="py-24 relative border-t border-white/5" id="contact">
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 reveal-text font-headline">
            Let's Build Something <span className="text-[#5b5ff0]">Extraordinary.</span>
          </h2>
          <p className="text-on-surface-variant text-sm md:text-base max-w-lg mb-10 leading-relaxed reveal-text">
            Have a project concept or need expert telemetry optimization? Connect with our digital orchestrators and launch your vision today.
          </p>
          <button 
            onClick={() => onNavigate('/contact')}
            className="btn-primary px-8 py-4 rounded-full font-label-sm text-sm uppercase tracking-widest font-bold magnetic flex items-center justify-center gap-2 reveal-text"
            data-cursor="hover"
          >
            Initiate Consultation
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
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
    </>
  );
}
