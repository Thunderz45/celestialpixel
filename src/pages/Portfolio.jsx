import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Project Data ────────────────────────────────────────────────────────────

const categories = [
  {
    id: 'ecommerce',
    label: 'E-commerce & Business Solutions',
    icon: 'storefront',
    accent: '#5b5ff0',
    accentRgb: '91,95,240',
    description: 'Scalable storefronts and corporate platforms built for growth.',
    projects: [
      {
        title: 'Tisorah Box',
        url: 'https://www.tisorahbox.com/',
        description: 'A robust platform for high-volume online retail and transactional services.',
        tags: ['E-commerce', 'High-volume', 'Retail'],
      },
      {
        title: 'Ekatra',
        url: 'https://www.ekatra.co.in/',
        description: 'Modern, responsive design for a corporate presence focused on key services.',
        tags: ['Corporate', 'Responsive', 'Services'],
      },
      {
        title: 'On3.in',
        url: 'https://www.on3.in/',
        description: 'Streamlined booking and reservation system with integrated user management.',
        tags: ['Booking', 'SaaS', 'UX'],
      },
      {
        title: 'Makewood',
        url: 'https://makewood.vercel.app/',
        description: 'Bespoke e-commerce site emphasizing premium product presentation.',
        tags: ['E-commerce', 'Premium', 'Product'],
      },
      {
        title: 'Interior by Gourav',
        url: 'https://interior-bygourav.vercel.app/',
        description: 'Showcasing high-end interior design services with a visual-first approach.',
        tags: ['Interior', 'Portfolio', 'Visual'],
      },
      {
        title: 'The Life Sports',
        url: 'https://www.thelifesports.in/',
        description: 'Community and commerce platform for sports enthusiasts.',
        tags: ['Sports', 'Community', 'Commerce'],
      },
    ],
  },
  {
    id: 'dynamic',
    label: 'Dynamic Web Applications',
    icon: 'bolt',
    accent: '#a78bfa',
    accentRgb: '167,139,250',
    description: 'Interactive, data-rich applications pushing the limits of the web.',
    projects: [
      {
        title: 'VML India',
        url: 'https://www.vmlindia.in/',
        description: 'A dynamic corporate site focusing on interactive data and reporting.',
        tags: ['Corporate', 'Data', 'Interactive'],
      },
      {
        title: 'AIValytics',
        url: 'https://www.aivalytics.com/',
        description: 'Specialized application for AI-driven data visualization and analytics.',
        tags: ['AI', 'Analytics', 'Visualization'],
      },
      {
        title: 'Arogya Yatri',
        url: 'https://www.arogyayatri.com',
        description: 'Health and wellness tracking application designed for mobile-first user experience.',
        tags: ['Health', 'Mobile-first', 'Wellness'],
      },
      {
        title: 'Dhanushri',
        url: 'https://dhanushri-mauve.vercel.app/',
        description: 'Influencer portfolio with cinematic visuals and dynamic content.',
        tags: ['Influencer', 'Portfolio', 'Creative'],
      },
      {
        title: 'Pragati Events',
        url: 'https://pragati-events.vercel.app/',
        description: 'Event management and ticketing platform with seamless user flow.',
        tags: ['Events', 'Ticketing', 'UX'],
      },
    ],
  },
  {
    id: 'niche',
    label: 'Niche & Specialized Platforms',
    icon: 'explore',
    accent: '#34d399',
    accentRgb: '52,211,153',
    description: 'Purpose-built experiences for specialized industries and communities.',
    projects: [
      {
        title: 'Labbbb',
        url: 'http://labbbb.vercel.app/',
        description: 'Experimental development project demonstrating cutting-edge front-end techniques.',
        tags: ['Experimental', 'Frontend', 'Creative'],
      },
      {
        title: 'Meltech',
        url: 'https://www.meltechmeltingtechnology.in/',
        description: 'Industrial-focused site for specialized B2B technology services.',
        tags: ['B2B', 'Industrial', 'Technology'],
      },
      {
        title: 'Muziclub',
        url: 'https://muziclub.com/',
        description: 'Online community and educational resource for music instruction and collaboration.',
        tags: ['Music', 'Community', 'Education'],
      },
      {
        title: 'Sakhi Home',
        url: 'https://sakhihome.in/',
        description: 'Maid providing services platform connecting homes with trusted help.',
        tags: ['Services', 'Home', 'Platform'],
      },
    ],
  },
];

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, accent, accentRgb, index }) {
  const [hovered, setHovered] = useState(false);
  const hostname = new URL(project.url).hostname.replace('www.', '');

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: 'none' }}
    >
      <div
        className="relative rounded-2xl overflow-hidden h-full flex flex-col"
        style={{
          background: 'rgba(26,29,36,0.5)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: hovered
            ? `1px solid rgba(${accentRgb},0.5)`
            : '1px solid rgba(255,255,255,0.07)',
          boxShadow: hovered
            ? `0 0 40px rgba(${accentRgb},0.15), 0 20px 60px rgba(0,0,0,0.4)`
            : '0 4px 24px rgba(0,0,0,0.3)',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        }}
      >
        {/* Screenshot preview */}
        <div className="relative overflow-hidden" style={{ height: '180px', flexShrink: 0 }}>
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, transparent 50%, rgba(18,19,27,0.95) 100%)`,
            }}
          />
          {/* Accent glow top bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.4s',
              zIndex: 20,
            }}
          />
          <img
            src={`https://api.microlink.io/?url=${encodeURIComponent(project.url)}&screenshot=true&meta=false&embed=screenshot.url`}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover object-top"
            style={{
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
              filter: hovered ? 'brightness(0.9)' : 'brightness(0.7)',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.style.background = `linear-gradient(135deg, rgba(${accentRgb},0.08) 0%, rgba(18,19,27,1) 100%)`;
            }}
          />
          {/* Fallback pattern if no screenshot */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 5, opacity: 0.15 }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(${accentRgb},0.3) 0%, transparent 70%)`,
              }}
            />
          </div>
          {/* Live badge */}
          <div
            className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#34d399',
                display: 'inline-block',
                boxShadow: '0 0 6px #34d399',
              }}
            />
            Live
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-headline font-bold text-base leading-snug"
              style={{
                color: hovered ? accent : '#e4e1ed',
                transition: 'color 0.3s',
              }}
            >
              {project.title}
            </h3>
            <span
              className="material-symbols-outlined text-base flex-shrink-0 mt-0.5"
              style={{
                color: hovered ? accent : 'rgba(255,255,255,0.3)',
                transition: 'color 0.3s, transform 0.3s',
                transform: hovered ? 'translate(2px,-2px)' : 'translate(0,0)',
              }}
            >
              open_in_new
            </span>
          </div>

          {/* Hostname */}
          <span
            className="text-[10px] font-mono tracking-wider"
            style={{ color: `rgba(${accentRgb},0.7)` }}
          >
            {hostname}
          </span>

          {/* Description */}
          <p
            className="text-xs leading-relaxed flex-1"
            style={{ color: 'rgba(228,225,237,0.65)' }}
          >
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  background: `rgba(${accentRgb},0.1)`,
                  color: accent,
                  border: `1px solid rgba(${accentRgb},0.2)`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

// ─── Category Section ─────────────────────────────────────────────────────────

function CategorySection({ category, isActive, onToggle }) {
  const gridRef = useRef(null);

  useEffect(() => {
    if (isActive && gridRef.current) {
      gsap.fromTo(
        gridRef.current.querySelectorAll('.project-card'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    }
  }, [isActive]);

  return (
    <div className="category-section mb-6">
      {/* Category Header */}
      <button
        onClick={onToggle}
        className="w-full text-left group"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div
          className="flex items-center justify-between px-6 py-5 rounded-2xl"
          style={{
            background: isActive
              ? `linear-gradient(135deg, rgba(${category.accentRgb},0.12) 0%, rgba(18,19,27,0.8) 100%)`
              : 'rgba(26,29,36,0.4)',
            backdropFilter: 'blur(12px)',
            border: isActive
              ? `1px solid rgba(${category.accentRgb},0.35)`
              : '1px solid rgba(255,255,255,0.07)',
            transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div className="flex items-center gap-4">
            {/* Icon bubble */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `rgba(${category.accentRgb},0.15)`,
                border: `1px solid rgba(${category.accentRgb},0.3)`,
              }}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ color: category.accent }}
              >
                {category.icon}
              </span>
            </div>

            <div className="text-left">
              <h2
                className="font-headline font-bold text-base md:text-lg leading-tight"
                style={{ color: isActive ? category.accent : '#e4e1ed' }}
              >
                {category.label}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(228,225,237,0.45)' }}>
                {category.projects.length} projects · {category.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full hidden sm:inline-block"
              style={{
                background: `rgba(${category.accentRgb},0.12)`,
                color: category.accent,
                border: `1px solid rgba(${category.accentRgb},0.25)`,
              }}
            >
              {category.projects.length}
            </span>
            <span
              className="material-symbols-outlined text-xl transition-transform duration-400"
              style={{
                color: isActive ? category.accent : 'rgba(255,255,255,0.3)',
                transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), color 0.3s',
              }}
            >
              expand_more
            </span>
          </div>
        </div>
      </button>

      {/* Projects Grid */}
      {isActive && (
        <div
          ref={gridRef}
          className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {category.projects.map((project, i) => (
            <ProjectCard
              key={project.url}
              project={project}
              accent={category.accent}
              accentRgb={category.accentRgb}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Portfolio Page ───────────────────────────────────────────────────────────

export default function Portfolio({ onNavigate }) {
  const [activeCategories, setActiveCategories] = useState({ ecommerce: true, dynamic: false, niche: false });
  const headerRef = useRef(null);
  const statsRef = useRef(null);

  const totalProjects = categories.reduce((acc, c) => acc + c.projects.length, 0);

  useEffect(() => {
    // Header entrance animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.querySelectorAll('.anim-in'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
      );
    }
    // Stats counter animation
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.querySelectorAll('.stat-item'),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.4,
        }
      );
    }
  }, []);

  const toggleCategory = (id) => {
    setActiveCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 overflow-hidden">

      {/* Ambient background blobs */}
      <div
        className="pointer-events-none fixed"
        style={{
          top: '10%',
          left: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,95,240,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="pointer-events-none fixed"
        style={{
          bottom: '10%',
          right: '-10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">

        {/* ── Header ── */}
        <div ref={headerRef} className="mb-14 text-center">
          {/* Badge */}
          <div className="anim-in inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#5b5ff0] animate-pulse" />
            <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
              Our Work
            </span>
          </div>

          {/* Title */}
          <h1 className="anim-in text-4xl md:text-7xl font-extrabold mb-5 leading-tight tracking-tight font-headline">
            Built to{' '}
            <span className="text-gradient-indigo">Perform</span>
          </h1>

          {/* Subtitle */}
          <p
            className="anim-in text-sm md:text-base max-w-xl mx-auto leading-relaxed"
            style={{ color: 'rgba(228,225,237,0.55)' }}
          >
            A curated showcase of digital experiences we've crafted — from ambitious startups to
            established enterprises.
          </p>

          {/* ── Stats Row ── */}
          <div
            ref={statsRef}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            {[
              { value: totalProjects + '+', label: 'Projects Delivered' },
              { value: categories.length, label: 'Specializations' },
              { value: '100%', label: 'Client Satisfaction' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="stat-item flex flex-col items-center px-8 py-4 rounded-2xl"
                style={{
                  background: 'rgba(26,29,36,0.5)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                  minWidth: 120,
                }}
              >
                <span
                  className="font-headline font-black text-2xl md:text-3xl"
                  style={{
                    background: 'linear-gradient(90deg,#fff 0%,#5b5ff0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stat.value}
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold mt-1" style={{ color: 'rgba(228,225,237,0.4)' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="mb-10"
          style={{
            height: 1,
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)',
          }}
        />

        {/* ── Category Accordion ── */}
        <div>
          {categories.map((cat) => (
            <CategorySection
              key={cat.id}
              category={cat}
              isActive={!!activeCategories[cat.id]}
              onToggle={() => toggleCategory(cat.id)}
            />
          ))}
        </div>

        {/* ── CTA Footer ── */}
        <div
          className="mt-16 text-center py-14 px-8 rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(91,95,240,0.1) 0%, rgba(167,139,250,0.06) 50%, rgba(18,19,27,0.8) 100%)',
            border: '1px solid rgba(91,95,240,0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Decorative orb */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(91,95,240,0.15) 0%, transparent 60%)',
            }}
          />
          <div className="relative z-10">
            <span
              className="material-symbols-outlined text-4xl mb-4 block"
              style={{ color: '#5b5ff0' }}
            >
              rocket_launch
            </span>
            <h3 className="font-headline font-bold text-2xl md:text-3xl mb-3">
              Ready to build something{' '}
              <span className="text-gradient-indigo">extraordinary?</span>
            </h3>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'rgba(228,225,237,0.55)' }}>
              Let's collaborate to create your next digital flagship.
            </p>
            <button
              onClick={() => onNavigate('/contact')}
              className="btn-primary px-8 py-4 rounded-full font-label-sm text-sm uppercase tracking-widest font-bold magnetic inline-flex items-center gap-2"
              data-cursor="hover"
            >
              <span className="material-symbols-outlined text-base">arrow_forward</span>
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
