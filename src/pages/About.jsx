import React, { useEffect } from 'react';
import { gsap } from 'gsap';

export default function About({ onNavigate }) {
  // Setup mount animations
  useEffect(() => {
    // Reveal text items
    gsap.fromTo(".about-reveal", 
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" }
    );

    // Stagger flowchart steps
    gsap.fromTo(".flow-node",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.3, ease: "power2.out" }
    );
  }, []);

  return (
    <section className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full flex flex-col items-center">
        
        {/* Header Block */}
        <div className="about-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#5b5ff0] animate-pulse"></span>
          <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant font-semibold">Our Dossier</span>
        </div>
        
        <h1 className="about-reveal text-4xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight font-headline text-center">
          About <span className="text-gradient-indigo">CelestialPixel</span>
        </h1>
        
        <p className="about-reveal text-sm md:text-lg text-on-surface-variant max-w-2xl mb-16 text-center leading-relaxed font-body">
          Building Digital Experiences That Drive Growth. We combine creativity, technology, and strategic marketing to convert your online presence into a high-octane growth engine.
        </p>

        {/* Narrative Split Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-5xl mb-24 text-left">
          <div className="about-reveal glass-panel p-8 md:p-12 rounded-3xl flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4 font-headline text-[#c0c1ff]">The Digital Alchemy</h3>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed mb-6">
              At CelestialPixel, we help businesses transform their online presence into a powerful growth engine. We combine creativity, technology, and marketing to create digital solutions that attract customers, build trust, and generate measurable results.
            </p>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
              From modern websites and engaging social media content to high-performing advertising campaigns, our goal is simple: help businesses grow faster in the digital world.
            </p>
          </div>

          <div className="about-reveal glass-panel p-8 md:p-12 rounded-3xl flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4 font-headline text-[#c0c1ff]">Brand Narrative</h3>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed mb-6">
              We believe every brand has a unique story. Our job is to bring that story to life through strategic design, compelling content, and data-driven marketing.
            </p>
            <div className="w-full h-[1px] bg-white/15 my-6"></div>
            <p className="text-sm font-semibold text-[#5b5ff0] italic">
              "We don't just build websites or launch ads. We deploy high-conversion visual ecosystems."
            </p>
          </div>
        </div>

        {/* Mission & Vision Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-24 text-left">
          {/* Mission Card */}
          <div className="about-reveal glass-panel p-8 rounded-2xl border-l-4 border-l-[#5b5ff0]">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-[#5b5ff0] text-3xl">rocket_launch</span>
              <h3 className="text-lg md:text-xl font-bold font-headline">Our Mission</h3>
            </div>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
              To empower businesses with innovative digital solutions that increase visibility, generate quality leads, and drive sustainable growth.
            </p>
          </div>

          {/* Vision Card */}
          <div className="about-reveal glass-panel p-8 rounded-2xl border-l-4 border-l-[#c0c1ff]">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-[#c0c1ff] text-3xl">visibility</span>
              <h3 className="text-lg md:text-xl font-bold font-headline">Our Vision</h3>
            </div>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
              To become a trusted digital growth partner for businesses looking to scale their brand and reach new heights online.
            </p>
          </div>
        </div>

        {/* What We Do Capabilities list */}
        <div className="w-full max-w-5xl mb-24 text-center">
          <h2 className="about-reveal text-2xl md:text-4xl font-extrabold mb-10 font-headline">
            What We <span className="text-[#5b5ff0]">Do</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Website Development", icon: "code" },
              { title: "UI/UX Design", icon: "draw" },
              { title: "Social Media", icon: "share" },
              { title: "Instagram Reels", icon: "play_circle" },
              { title: "Photography", icon: "photo_camera" },
              { title: "Meta Ads", icon: "ads_click" },
              { title: "Lead Generation", icon: "group_add" },
              { title: "Brand Strategy", icon: "trending_up" }
            ].map((srv, idx) => (
              <div 
                key={idx} 
                className="about-reveal glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-[#5b5ff0]/50 hover:bg-[#5b5ff0]/5 transition-all duration-300"
              >
                <span className="material-symbols-outlined text-2xl text-[#5b5ff0]">{srv.icon}</span>
                <span className="text-xs md:text-sm font-bold font-headline leading-tight">{srv.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Flowchart Growth Journey Diagram */}
        <div className="w-full max-w-3xl mb-24 text-center">
          <h2 className="about-reveal text-2xl md:text-4xl font-extrabold mb-6 font-headline">
            The Partnership <span className="text-gradient-indigo">Uplink</span>
          </h2>
          <p className="about-reveal text-sm text-on-surface-variant mb-12 max-w-md mx-auto">
            Observe the programmatic growth sequences fired when aligning telemetry with CelestialPixel.
          </p>

          <div className="flex flex-col items-center">
            
            {/* Step 1: Warning Node */}
            <div className="flow-node glass-panel w-full sm:w-[380px] p-6 rounded-2xl text-center border-red-500/20 bg-red-950/5 relative group hover:border-red-500/40 transition-all duration-300">
              <span className="material-symbols-outlined text-red-500 mb-2 text-xl animate-pulse">report_problem</span>
              <h4 className="font-bold text-xs uppercase tracking-widest text-red-400 mb-1">State 01: Vulnerability</h4>
              <p className="text-sm font-bold text-on-surface">Low Visibility &amp; Limited Leads</p>
            </div>

            {/* Glowing Arrow 1 */}
            <div className="flow-node flex flex-col items-center py-4">
              <span className="material-symbols-outlined text-[#5b5ff0] text-2xl animate-bounce">arrow_downward</span>
            </div>

            {/* Step 2: Connection Node */}
            <div className="flow-node glass-panel w-full sm:w-[380px] p-6 rounded-2xl text-center border-[#5b5ff0]/40 bg-[#5b5ff0]/5 relative group hover:border-[#5b5ff0]/70 transition-all duration-300 shadow-[0_0_15px_rgba(91,95,240,0.15)]">
              <span className="material-symbols-outlined text-[#5b5ff0] mb-2 text-xl animate-pulse">handshake</span>
              <h4 className="font-bold text-xs uppercase tracking-widest text-[#5b5ff0] mb-1">State 02: Alignment</h4>
              <p className="text-sm font-bold text-on-surface">Business Partners With CelestialPixel</p>
            </div>

            {/* Glowing Arrow 2 */}
            <div className="flow-node flex flex-col items-center py-4">
              <span className="material-symbols-outlined text-[#5b5ff0] text-2xl animate-bounce">arrow_downward</span>
            </div>

            {/* Step 3: Action Node */}
            <div className="flow-node glass-panel w-full sm:w-[380px] p-6 rounded-2xl text-center border-white/10 hover:border-white/20 transition-all duration-300 relative">
              <span className="material-symbols-outlined text-white/60 mb-2 text-xl">architecture</span>
              <h4 className="font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-1">State 03: Deployment</h4>
              <p className="text-sm font-bold text-on-surface">Professional Website + Strong Branding + Strategic Marketing</p>
            </div>

            {/* Glowing Arrow 3 */}
            <div className="flow-node flex flex-col items-center py-4">
              <span className="material-symbols-outlined text-[#5b5ff0] text-2xl animate-bounce">arrow_downward</span>
            </div>

            {/* Step 4: Expansion Node */}
            <div className="flow-node glass-panel w-full sm:w-[380px] p-6 rounded-2xl text-center border-white/10 hover:border-white/20 transition-all duration-300 relative">
              <span className="material-symbols-outlined text-[#c0c1ff] mb-2 text-xl">groups</span>
              <h4 className="font-bold text-xs uppercase tracking-widest text-[#c0c1ff] mb-1">State 04: Velocity</h4>
              <p className="text-sm font-bold text-on-surface">More Traffic, More Engagement, More Leads</p>
            </div>

            {/* Glowing Arrow 4 */}
            <div className="flow-node flex flex-col items-center py-4">
              <span className="material-symbols-outlined text-emerald-400 text-2xl animate-bounce">arrow_downward</span>
            </div>

            {/* Step 5: Goal Node */}
            <div className="flow-node glass-panel w-full sm:w-[380px] p-6 rounded-2xl text-center border-emerald-500/30 bg-emerald-950/5 relative group hover:border-emerald-500/50 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <span className="material-symbols-outlined text-emerald-400 mb-2 text-xl animate-pulse">workspace_premium</span>
              <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-400 mb-1">State 05: Domination</h4>
              <p className="text-sm font-bold text-on-surface">Increased Sales, Stronger Brand Presence, Business Growth</p>
            </div>

          </div>
        </div>

        {/* Growth Journey Comparison Block */}
        <div className="w-full max-w-5xl mb-24">
          <h2 className="about-reveal text-2xl md:text-4xl font-extrabold mb-12 text-center font-headline">
            The Growth <span className="text-[#5b5ff0]">Journey</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Before Panel */}
            <div className="about-reveal glass-panel p-8 md:p-10 rounded-3xl bg-red-950/5 border-red-500/10 hover:border-red-500/20 transition-colors duration-500">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-red-500 text-3xl">cancel</span>
                <h3 className="text-lg md:text-xl font-bold font-headline text-red-400">Before CelestialPixel</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Outdated or no website layout",
                  "Low online visibility metrics",
                  "Inconsistent branding telemetry",
                  "Few customer inquiries",
                  "Limited business growth capability"
                ].map((txt, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm md:text-base text-on-surface-variant">
                    <span className="material-symbols-outlined text-red-500/50 text-sm mt-1">remove_circle</span>
                    <span>{txt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After Panel */}
            <div className="about-reveal glass-panel p-8 md:p-10 rounded-3xl bg-emerald-950/5 border-emerald-500/10 hover:border-emerald-500/30 transition-colors duration-500 shadow-[0_10px_30px_rgba(16,185,129,0.05)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-emerald-400 text-3xl font-bold">check_circle</span>
                <h3 className="text-lg md:text-xl font-bold font-headline text-emerald-400">After CelestialPixel</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Modern professional high-speed website",
                  "Strong social media presence",
                  "High-converting marketing campaigns",
                  "Consistent automated lead generation",
                  "Increased revenue and brand recognition"
                ].map((txt, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm md:text-base text-on-surface">
                    <span className="material-symbols-outlined text-emerald-400 text-sm mt-1">check</span>
                    <span>{txt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="about-reveal glass-panel p-8 md:p-12 rounded-3xl max-w-4xl w-full text-center mb-12">
          <h3 className="text-xl md:text-2xl font-bold mb-4 font-headline">Why Choose CelestialPixel?</h3>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-6">
            We don't just create websites or run advertisements. We build digital ecosystems that help businesses attract, engage, and convert customers. Every project is focused on one goal: Helping your business grow through the power of digital innovation.
          </p>
          <div className="text-md font-extrabold uppercase tracking-widest text-[#5b5ff0] font-headline mb-8">
            Turning Ideas Into Growth.
          </div>
          <button 
            onClick={() => onNavigate('/contact')}
            className="btn-primary px-8 py-4 rounded-full font-label-sm text-sm uppercase tracking-widest font-bold magnetic flex items-center justify-center gap-2 mx-auto"
            data-cursor="hover"
          >
            Launch Uplink
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

      </div>
    </section>
  );
}
