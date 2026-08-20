'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  Check,
  Command,
  Download,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Menu,
  PanelRightOpen,
  SquareArrowOutUpRight,
  X,
} from 'lucide-react';
import { CommandPalette } from '@/components/command-palette';
import { HeroWebGL } from '@/components/hero-webgl';
import { ProjectPreviewWebGL } from '@/components/project-preview-webgl';
import { SpotlightCard } from '@/components/spotlight-card';
import { portfolioData, type RoleType } from '@/content/portfolioData';
import { useMousePosition } from '@/hooks/use-mouse-position';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: 'Overview', href: '#overview' },
  { label: 'Work', href: '#work' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
];

const quickActions = [
  { label: 'Download Resume', action: 'download' },
  { label: 'Email Me', action: 'email' },
  { label: 'View Work', action: 'work' },
];

function MagneticButton({ children, className = '', href, onClick }: { children: React.ReactNode; className?: string; href?: string; onClick?: () => void }) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const mouse = useMousePosition();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 20, mass: 0.7 });
  const springY = useSpring(y, { stiffness: 250, damping: 20, mass: 0.7 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const dx = mouse.x - (rect.left + rect.width / 2);
    const dy = mouse.y - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);
    if (distance < 160) {
      x.set(dx * 0.12);
      y.set(dy * 0.12);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [mouse, x, y]);

  const shared = `inline-flex items-center gap-2 rounded-full border border-[#d9d0c6] bg-white/65 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-[#111111] backdrop-blur-xl transition hover:border-[#111111]/20 hover:bg-white ${className}`;

  if (href) {
    return (
      <motion.a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} style={{ x: springX, y: springY }} className={shared}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button ref={ref as React.RefObject<HTMLButtonElement>} onClick={onClick} style={{ x: springX, y: springY }} className={shared}>
      {children}
    </motion.button>
  );
}

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<RoleType>('All');
  const [showPalette, setShowPalette] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const horizontalRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setShowPalette((prev) => !prev);
      }
      if (event.key === 'Escape') setShowPalette(false);
    };

    const onPointerMove = (event: PointerEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointermove', onPointerMove);

    const ctx = gsap.context(() => {
      const heroLines = gsap.utils.toArray<HTMLElement>('.hero-line');
      gsap.fromTo(
        heroLines,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: 'power4.out' },
      );

      if (heroTitleRef.current) {
        gsap.fromTo(
          heroTitleRef.current,
          { scale: 1.5, clipPath: 'inset(0 0 100% 0 round 1.1rem)' },
          { scale: 1, clipPath: 'inset(0 0 0% 0 round 1.1rem)', duration: 1.4, ease: 'expo.out' },
        );
      }

      if (horizontalRef.current) {
        const panel = horizontalRef.current.parentElement as HTMLElement;
        const distance = horizontalRef.current.scrollWidth - panel.clientWidth;
        gsap.to(horizontalRef.current, {
          x: -distance,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: '+=1800',
            scrub: 1,
            pin: true,
          },
        });
      }

      if (filterRef.current) {
        gsap.fromTo(
          filterRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: filterRef.current, start: 'top 85%' } },
        );
      }
    });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointermove', onPointerMove);
      ctx.revert();
    };
  }, [cursorX, cursorY]);

  const filteredProjects = useMemo(() => {
    if (selectedRole === 'All') return portfolioData.projects;
    return portfolioData.projects.filter((project) => project.category === selectedRole);
  }, [selectedRole]);

  const projectMenuItems = useMemo(
    () =>
      portfolioData.projects.map((project) => ({
        label: project.title,
        type: 'Project',
        action: `project:${project.id}`,
        keywords: `${project.title} ${project.category}`.toLowerCase(),
      })),
    [],
  );

  const handleAction = (action: string) => {
    setShowPalette(false);
    if (action === 'download') window.print();
    if (action === 'email') window.location.href = `mailto:${portfolioData.profile.email}`;
    if (action === 'work') document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (action.startsWith('goto:')) {
      const href = action.replace('goto:', '');
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (action.startsWith('project:')) {
      const target = document.getElementById(action.replace('project:', ''));
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f7f4ee] text-[#111111] antialiased selection:bg-[#dfe7eb] selection:text-[#111111]">
      <motion.div style={{ x: cursorX, y: cursorY }} className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#111111]/30 bg-white/35 shadow-[0_0_35px_rgba(17,17,17,0.08)] md:block" />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(247,244,238,0.6)_32%,_rgba(247,244,238,0.2)_80%)]" />
        <div className="absolute left-[-8%] top-[-10%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,_rgba(148,163,184,0.32),_transparent_68%)] blur-3xl" />
        <div className="absolute right-[8%] top-[18%] h-[25rem] w-[25rem] rounded-full bg-[radial-gradient(circle,_rgba(226,232,240,0.52),_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-10%] left-[30%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(203,213,225,0.38),_transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-5 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-40 border-b border-[#111111]/10 bg-[#f7f4ee]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <a href="#overview" className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#111111]">
              <span className="inline-flex h-8 w-8 items-center justify-center border border-[#111111]/10 bg-white/70 text-[10px] font-medium">MF</span>
              <span>Muhammad Faizan</span>
            </a>

            <nav className="hidden items-center gap-8 md:flex">
              {navItems.map((item) => (
                <MagneticButton key={item.href} href={item.href} className="border-none bg-transparent px-0 py-0 text-[10px] uppercase tracking-[0.22em] text-[#111111]/75 hover:text-[#111111]">
                  {item.label}
                </MagneticButton>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <MagneticButton onClick={() => setShowPalette(true)} className="border border-[#111111]/10 bg-white/70 px-3 py-2 text-[10px] uppercase tracking-[0.2em]">
                <Command size={12} />
                <span>Search</span>
              </MagneticButton>
              <MagneticButton href={`mailto:${portfolioData.profile.email}`} className="border border-[#111111]/10 bg-white/70 px-3 py-2 text-[10px] uppercase tracking-[0.2em]">
                <Mail size={12} />
                Email
              </MagneticButton>
            </div>

            <button onClick={() => setMobileMenuOpen((prev) => !prev)} className="inline-flex h-10 w-10 items-center justify-center border border-[#111111]/10 bg-white/65 md:hidden">
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="border-t border-[#111111]/10 px-4 py-4 md:hidden">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-[11px] uppercase tracking-[0.2em] text-[#111111]/80">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </header>

        <section id="overview" className="relative overflow-hidden pt-12 md:pt-16">
          <div className="absolute inset-0 -z-10 h-[38rem] opacity-80">
            <HeroWebGL />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="pt-8 md:pt-12">
              <p className="mb-5 text-[11px] uppercase tracking-[0.28em] text-[#4b3d35]">Islamabad, Pakistan</p>
              <h1 ref={heroTitleRef} className="max-w-4xl text-5xl font-medium leading-[0.88] tracking-[-0.07em] text-[#111111] md:text-[6.6rem]">
                <span className="hero-line block overflow-hidden">IT Support</span>
                <span className="hero-line block overflow-hidden">& App Developer</span>
              </h1>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#111111]/10 bg-white/70 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#1e1e1e] backdrop-blur-xl">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                  {portfolioData.profile.availability}
                </span>
                <a href="#resume" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#111111]">
                  Resume <ArrowRight size={12} />
                </a>
              </div>

              <p className="mt-8 max-w-xl text-base leading-7 text-[#3a3330] md:text-lg">
                {portfolioData.profile.summary}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <MagneticButton href={`mailto:${portfolioData.profile.email}`} className="border border-[#111111]/10 bg-white/75 px-4 py-3 text-[10px] uppercase tracking-[0.22em]">
                  <Mail size={14} />
                  Email Me
                </MagneticButton>
                <MagneticButton href={portfolioData.profile.github} className="border border-[#111111]/10 bg-white/35 px-4 py-3 text-[10px] uppercase tracking-[0.22em]">
                  <Github size={14} />
                  GitHub
                </MagneticButton>
                <MagneticButton onClick={() => window.print()} className="border border-[#111111]/10 bg-white/35 px-4 py-3 text-[10px] uppercase tracking-[0.22em]">
                  <Download size={14} />
                  Resume PDF
                </MagneticButton>
              </div>
            </div>

            <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative border border-[#d9d2ca] bg-white/60 p-5 shadow-[0_40px_80px_rgba(17,17,17,0.06)] backdrop-blur-xl md:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-[#111111]/10 pb-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#4b3d35]">Profile</p>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#111111]">10 mos</span>
              </div>

              <div className="space-y-5 text-sm text-[#222222]">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 text-[#111111]" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#5a4f49]">Location</p>
                    <p className="mt-1">{portfolioData.profile.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 text-[#111111]" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#5a4f49]">Email</p>
                    <p className="mt-1">{portfolioData.profile.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase size={16} className="mt-0.5 text-[#111111]" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#5a4f49]">Experience</p>
                    <p className="mt-1">{portfolioData.profile.statusNote}</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {portfolioData.stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 * index }} className="border border-[#d9d2ca] bg-white/55 p-5 shadow-[0_18px_45px_rgba(17,17,17,0.04)] backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#685e59]">{stat.label}</p>
              <p className="mt-4 text-2xl tracking-[-0.04em] text-[#111111]">{stat.value}</p>
            </motion.div>
          ))}
        </section>

        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-[#111111]/10 pb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#685e59]">Capabilities</p>
              <h2 className="mt-3 text-3xl tracking-[-0.05em] text-[#111111] md:text-5xl">Product, infrastructure, and execution.</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {portfolioData.capabilityGroups.map((group) => (
              <SpotlightCard key={group.title} className="p-5 shadow-[0_18px_45px_rgba(17,17,17,0.04)]">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#685e59]">{group.title}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.points.map((point) => (
                    <span key={point} className="border border-[#111111]/10 bg-white/65 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#111111]">
                      {point}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        <section id="work" className="mt-20">
          <div ref={filterRef} className="mb-8 flex flex-col gap-4 border-b border-[#111111]/10 pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#685e59]">Selected work</p>
              <h2 className="mt-3 text-3xl tracking-[-0.05em] text-[#111111] md:text-5xl">Project archive.</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {portfolioData.roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.18em] transition ${selectedRole === role ? 'border-[#111111]/25 bg-[#111111] text-white shadow-[0_15px_28px_rgba(17,17,17,0.12)]' : 'border-[#111111]/10 bg-white/55 text-[#111111]/75 hover:border-[#111111]/20'}`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <motion.article key={project.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group">
                <SpotlightCard className="h-full p-4 shadow-[0_18px_45px_rgba(17,17,17,0.04)] sm:p-5">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#685e59]">{project.category}</p>
                    <ExternalLink size={15} className="text-[#111111]/60" />
                  </div>

                  <ProjectPreviewWebGL accent={project.accent} />

                  <div className="mt-5">
                    <h3 className="text-2xl tracking-[-0.04em] text-[#111111] md:text-[2rem]">{project.title}</h3>
                    <p className="mt-4 text-base leading-7 text-[#2d2a29]">{project.description}</p>
                    <p className="mt-4 text-sm text-[#524c49]">{project.impact}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="border border-[#111111]/10 bg-white/75 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#111111]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mt-20 overflow-hidden rounded-[2rem] border border-[#d9d2ca] bg-white/55 p-5 shadow-[0_24px_70px_rgba(17,17,17,0.04)] backdrop-blur-xl md:p-8">
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#111111]/10 pb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#685e59]">System design</p>
              <h2 className="mt-3 text-3xl tracking-[-0.05em] text-[#111111] md:text-5xl">Architecture flow.</h2>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#111111]">Stable</span>
            </div>
          </div>

          <div ref={horizontalRef} className="flex gap-4 md:gap-6">
            {portfolioData.architecture.map((node, index) => (
              <div key={node.id} className="min-w-[18rem] flex-1 rounded-[1.5rem] border border-[#d9d2ca] bg-white/75 p-5 md:min-w-[22rem]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#685e59]">{index + 1}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#111111]">{node.name}</span>
                </div>
                <p className="text-xl font-medium text-[#111111]">{node.label}</p>
                <p className="mt-4 text-sm leading-6 text-[#342f2d]">{node.details}</p>

                <svg viewBox="0 0 300 72" className="mt-5 h-16 w-full overflow-visible">
                  <path d="M10 36 H290" stroke="#111111" strokeOpacity="0.18" strokeWidth="1.5" fill="none" />
                  <circle cx="24" cy="36" r="4" fill="#111111" />
                  <circle cx="290" cy="36" r="4" fill="#111111" />
                  <circle cx="150" cy="36" r="3.5" fill="#111111" className="animate-pulse" />
                </svg>
              </div>
            ))}
          </div>
        </section>

        <section id="resume" className="mt-20">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#111111]/10 pb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#685e59]">Resume</p>
              <h2 className="mt-3 text-3xl tracking-[-0.05em] text-[#111111] md:text-5xl">Professional snapshot.</h2>
            </div>
            <MagneticButton onClick={() => window.print()} className="border border-[#111111]/10 bg-white/70 px-4 py-3 text-[10px] uppercase tracking-[0.2em]">
              <Download size={14} />
              Export PDF
            </MagneticButton>
          </div>

          <div className="border border-[#d9d2ca] bg-white/55 p-6 shadow-[0_20px_60px_rgba(17,17,17,0.04)] backdrop-blur-xl md:p-8">
            <div className="flex flex-col gap-4 border-b border-[#111111]/10 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#685e59]">Muhammad Faizan</p>
                <h3 className="mt-2 text-3xl tracking-[-0.04em] text-[#111111]">IT Support & App Developer</h3>
              </div>
              <div className="text-sm text-[#403b38]">{portfolioData.profile.location} · {portfolioData.profile.email}</div>
            </div>

            <div className="mt-6 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#685e59]">Summary</p>
                <p className="mt-4 text-base leading-7 text-[#2d2a29]">{portfolioData.resume.summary}</p>
                <div className="mt-8">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#685e59]">Skills</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {portfolioData.resume.skills.map((skill) => (
                      <span key={skill} className="border border-[#111111]/10 bg-white/75 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#111111]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#685e59]">Experience</p>
                <div className="mt-4 space-y-4">
                  {portfolioData.experience.map((item) => (
                    <div key={item.title} className="border border-[#111111]/10 bg-white/60 p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <h4 className="text-lg text-[#111111]">{item.title}</h4>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#685e59]">{item.period}</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#403b38]">{item.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-[#111111]/10 pb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#685e59]">Telemetry</p>
              <h2 className="mt-3 text-3xl tracking-[-0.05em] text-[#111111] md:text-5xl">Live system health.</h2>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <SpotlightCard className="p-5 shadow-[0_18px_45px_rgba(17,17,17,0.04)] md:p-6">
              <div className="flex items-center justify-between border-b border-[#111111]/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.8)]" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#111111]">Production</span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#685e59]">{portfolioData.telemetry.uptime}</span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="border border-[#111111]/10 bg-white/65 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#685e59]">Uptime</div>
                  <div className="mt-2 text-xl text-[#111111]">99.98%</div>
                </div>
                <div className="border border-[#111111]/10 bg-white/65 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#685e59]">Version</div>
                  <div className="mt-2 text-xl text-[#111111]">v2.9.4</div>
                </div>
                <div className="border border-[#111111]/10 bg-white/65 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#685e59]">Deploy</div>
                  <div className="mt-2 text-xl text-[#111111]">Live</div>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-5 shadow-[0_18px_45px_rgba(17,17,17,0.04)] md:p-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#685e59]">Review flow</p>
                <PanelRightOpen size={16} className="text-[#111111]" />
              </div>
              <div className="space-y-3">
                {['Application health OK', 'Database latency nominal', 'CI/CD pipeline clean', 'Cloud sync stable'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-full border border-[#111111]/10 bg-white/70 px-3 py-2 text-sm text-[#111111]">
                    <Check size={14} className="text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </section>

        <footer id="contact" className="mt-20 border-t border-[#111111]/10 pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#685e59]">Contact</p>
              <h3 className="mt-3 text-3xl tracking-[-0.05em] text-[#111111] md:text-5xl">Let’s build something useful.</h3>
            </div>

            <div className="flex flex-wrap gap-3">
              <MagneticButton href={`mailto:${portfolioData.profile.email}`} className="border border-[#111111]/10 bg-white/70 px-4 py-3 text-[10px] uppercase tracking-[0.2em]">
                <Mail size={14} />
                Email
              </MagneticButton>
              <MagneticButton href={portfolioData.profile.github} className="border border-[#111111]/10 bg-transparent px-4 py-3 text-[10px] uppercase tracking-[0.2em]">
                <SquareArrowOutUpRight size={14} />
                GitHub
              </MagneticButton>
            </div>
          </div>
        </footer>
      </div>

      <CommandPalette
        isOpen={showPalette}
        navItems={navItems}
        quickActions={quickActions}
        projectItems={projectMenuItems}
        onClose={() => setShowPalette(false)}
        onAction={handleAction}
      />
    </main>
  );
}
