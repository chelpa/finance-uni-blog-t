'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ─── DATA ──────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Eventos', href: '#eventos' },
  { label: 'Blog', href: '/blog' },
  { label: 'Alumni', href: '#alumni' },
  { label: 'Contacto', href: '#contacto' },
]

const STATS = [
  { value: 200, suffix: '+', label: 'Miembros activos' },
  { value: 30, suffix: '+', label: 'Actividades realizadas' },
  { value: 2024, suffix: '', label: 'Año de fundación' },
  { value: 15, suffix: '+', label: 'Empresas socias' },
]

const EVENTS = [
  {
    type: 'Brown Bag Lunch',
    company: 'J.P. Morgan',
    title: 'Mercados de Capital y Perspectivas Globales',
    date: '10 Jul 2026',
    time: '12:30 – 13:30',
    location: 'Sala C-301, FEN UChile',
    logo: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=98,fit=crop/ETAoUm5qKUSv5fCI/j_p_morgan_logo_2008.svg-a819ls0NtIX3KJkT.png',
  },
  {
    type: 'Visita Empresarial',
    company: 'BTG Pactual',
    title: 'Private Equity en Latinoamérica: Oportunidades y Desafíos',
    date: '17 Jul 2026',
    time: '15:00 – 17:00',
    location: 'Oficinas BTG Pactual, Las Condes',
    logo: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=149,fit=crop/ETAoUm5qKUSv5fCI/btg-logo-blue.svg-QV1831Uzp2qj6ml2.png',
  },
  {
    type: 'Charla',
    company: 'Banco Central de Chile',
    title: 'Política Monetaria y Estabilidad Financiera en Chile',
    date: '24 Jul 2026',
    time: '12:30 – 13:30',
    location: 'Auditorio FEN',
    logo: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=375,fit=crop/ETAoUm5qKUSv5fCI/central_bank_of_chile_logo-RPTFokFVseqLt10F.png',
  },
  {
    type: 'Case Study',
    company: 'LarrainVial',
    title: 'Construcción de Portafolios en Mercados Emergentes',
    date: '31 Jul 2026',
    time: '14:00 – 17:00',
    location: 'Sala de Casos, FEN',
    logo: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=98,fit=crop/ETAoUm5qKUSv5fCI/larrainvial_id_-iwe-mg_0-Y4XnuJvYUS7vqrwv.png',
  },
]

const BLOG_POSTS = [
  {
    tag: 'Mercados',
    title: 'Análisis de la TPM: ¿Hacia dónde va la tasa en Chile?',
    excerpt: 'El Banco Central ha mantenido una postura cautelosa frente a la inflación subyacente. Analizamos los escenarios para el segundo semestre.',
    author: 'Equipo CF FEN',
    date: 'Jun 2026',
    readTime: '5 min',
  },
  {
    tag: 'Carreras',
    title: 'Guía de CV para Finanzas: Lo que realmente buscan los reclutadores',
    excerpt: 'Desde Goldman hasta Moneda, recopilamos los criterios que más pesan al momento de filtrar candidatos para prácticas y empleos.',
    author: 'Equipo CF FEN',
    date: 'May 2026',
    readTime: '7 min',
  },
  {
    tag: 'Inversiones',
    title: 'Renta Fija 2026: El regreso de los bonos',
    excerpt: 'Con tasas en niveles históricamente altos, los bonos vuelven a tener sentido en los portafolios de largo plazo. Te explicamos por qué.',
    author: 'Equipo CF FEN',
    date: 'May 2026',
    readTime: '6 min',
  },
]

const ALUMNI_LOGOS = [
  { name: 'HSBC', url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=101,fit=crop/ETAoUm5qKUSv5fCI/hsbc_logo_-2018-.svg-Dolj76l4GyJIdWH9.png' },
  { name: 'BTG Pactual', url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=149,fit=crop/ETAoUm5qKUSv5fCI/btg-logo-blue.svg-QV1831Uzp2qj6ml2.png' },
  { name: 'J.P. Morgan', url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=98,fit=crop/ETAoUm5qKUSv5fCI/j_p_morgan_logo_2008.svg-a819ls0NtIX3KJkT.png' },
  { name: 'Santander', url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=59,fit=crop/ETAoUm5qKUSv5fCI/santander_logo-hRWNrffvJWEvFewL.PNG' },
  { name: 'BCI', url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=176,fit=crop/ETAoUm5qKUSv5fCI/bci_logotype.svg-VQCTncIxX9CimuwB.png' },
  { name: 'Banchile', url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=101,fit=crop/ETAoUm5qKUSv5fCI/banchile-inversiones-nYI10Me5OFA6O68L.png' },
  { name: 'Deloitte', url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=70,fit=crop/ETAoUm5qKUSv5fCI/logo_of_deloitte.svg-N6PCYd2RDJt7oiXt.png' },
  { name: 'Moneda Asset', url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=99,fit=crop/ETAoUm5qKUSv5fCI/nuevo-logo-moneda-Jj0bWIpq1uLOGxyF.png' },
  { name: 'LarrainVial', url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=98,fit=crop/ETAoUm5qKUSv5fCI/larrainvial_id_-iwe-mg_0-Y4XnuJvYUS7vqrwv.png' },
  { name: 'Rothschild', url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=61,fit=crop/ETAoUm5qKUSv5fCI/rothschildco_logo-6SJ6JqZym2WvCHtr.webp' },
  { name: 'Itaú', url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=375,fit=crop/ETAoUm5qKUSv5fCI/itaao_unibanco_logo_2023.svg-zG9EcDs36Uqrr5F6.png' },
  { name: 'SURA', url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=129,fit=crop/ETAoUm5qKUSv5fCI/sura-negro-fEoDNiAllbhz1Rap.webp' },
]

const TICKER_ITEMS = [
  'HSBC', 'BTG PACTUAL', 'J.P. MORGAN', 'SANTANDER', 'BCI', 'BANCHILE',
  'DELOITTE', 'MONEDA ASSET', 'LARRAINVIAL', 'ROTHSCHILD & CO', 'ITAÚ',
  'SURA', 'BANCO CENTRAL', 'BCG', 'MCKINSEY', 'GOLDMAN SACHS',
]

/* ─── ANIMATED COUNTER ──────────────────────────────────────── */
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1600
        const steps = 60
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
          current = Math.min(current + increment, target)
          setCount(Math.floor(current))
          if (current >= target) clearInterval(timer)
        }, duration / steps)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ─── MAIN COMPONENT ────────────────────────────────────────── */
export default function LandingClient() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --black:   #0A0A0A;
          --dark:    #141210;
          --gold:    #C9A84C;
          --gold-lt: #E8C97A;
          --stone:   #F5F4F0;
          --slate:   #6B7280;
          --border:  rgba(255,255,255,0.08);
        }

        .lp * { box-sizing: border-box; margin: 0; padding: 0; }
        .lp { font-family: 'Inter', sans-serif; background: var(--black); color: var(--stone); overflow-x: hidden; }

        /* NAV */
        .lp-nav {
          position: fixed; top: 0; inset-inline: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 2.5rem;
          transition: background 0.4s, padding 0.4s, backdrop-filter 0.4s;
        }
        .lp-nav.scrolled {
          background: rgba(10,10,10,0.92);
          backdrop-filter: blur(16px);
          padding: 0.75rem 2.5rem;
          border-bottom: 1px solid var(--border);
        }
        .lp-logo { height: 36px; width: auto; object-fit: contain; filter: brightness(0) invert(1); }
        .lp-navlinks { display: flex; align-items: center; gap: 2rem; list-style: none; }
        .lp-navlinks a {
          font-size: 0.8125rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(245,244,240,0.65); text-decoration: none;
          transition: color 0.2s;
        }
        .lp-navlinks a:hover { color: var(--stone); }
        .lp-nav-cta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; text-decoration: none;
          border: 1px solid var(--gold); color: var(--gold);
          padding: 0.5rem 1.25rem; border-radius: 2px;
          transition: background 0.2s, color 0.2s;
        }
        .lp-nav-cta:hover { background: var(--gold); color: var(--black); }
        .lp-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
        .lp-hamburger span { display: block; width: 22px; height: 1.5px; background: var(--stone); transition: 0.3s; }

        /* HERO */
        .lp-hero {
          position: relative; height: 100svh; min-height: 600px;
          display: flex; align-items: flex-end;
          padding: 0 2.5rem 5rem;
          overflow: hidden;
        }
        .lp-hero video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .lp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.2) 100%);
        }
        /* Grid overlay — the signature element */
        .lp-hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: linear-gradient(to top, transparent 0%, black 40%, black 70%, transparent 100%);
        }
        .lp-hero-content { position: relative; z-index: 2; max-width: 800px; }
        .lp-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 1.25rem;
          display: flex; align-items: center; gap: 0.75rem;
        }
        .lp-eyebrow::before { content: ''; display: block; width: 32px; height: 1px; background: var(--gold); }
        .lp-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 7vw, 6rem); font-weight: 700;
          line-height: 1.05; letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
        }
        .lp-hero h1 em { font-style: italic; color: var(--gold-lt); }
        .lp-hero-sub {
          font-size: 1.0625rem; font-weight: 300; line-height: 1.7;
          color: rgba(245,244,240,0.7); max-width: 480px; margin-bottom: 2.5rem;
        }
        .lp-hero-actions { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .lp-btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--gold); color: var(--black);
          font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; text-decoration: none;
          padding: 0.875rem 2rem; border-radius: 2px;
          transition: background 0.2s, transform 0.2s;
        }
        .lp-btn-primary:hover { background: var(--gold-lt); transform: translateY(-1px); }
        .lp-btn-ghost {
          display: inline-flex; align-items: center; gap: 0.5rem;
          border: 1px solid rgba(245,244,240,0.3); color: var(--stone);
          font-size: 0.8125rem; font-weight: 500; letter-spacing: 0.06em;
          text-transform: uppercase; text-decoration: none;
          padding: 0.875rem 2rem; border-radius: 2px;
          transition: border-color 0.2s, color 0.2s;
        }
        .lp-btn-ghost:hover { border-color: var(--stone); }

        /* TICKER */
        .lp-ticker {
          background: var(--gold); color: var(--black);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; font-weight: 500; letter-spacing: 0.15em;
          padding: 0.6rem 0; overflow: hidden; white-space: nowrap;
        }
        .lp-ticker-inner {
          display: inline-flex; gap: 0;
          animation: ticker-scroll 30s linear infinite;
        }
        .lp-ticker-item { padding: 0 2rem; }
        .lp-ticker-sep { opacity: 0.5; }
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* SECTIONS */
        .lp-section { padding: 6rem 2.5rem; }
        .lp-section-light { background: var(--stone); color: var(--black); }
        .lp-section-dark  { background: var(--dark); }
        .lp-inner { max-width: 1100px; margin: 0 auto; }
        .lp-section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 1rem;
          display: flex; align-items: center; gap: 0.75rem;
        }
        .lp-section-label::before { content: ''; display: block; width: 24px; height: 1px; background: var(--gold); }
        .lp-section-light .lp-section-label { color: #8B6914; }
        .lp-section-light .lp-section-label::before { background: #8B6914; }
        .lp-h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.25rem); font-weight: 700;
          line-height: 1.1; letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
        }
        .lp-h2 em { font-style: italic; color: var(--gold); }
        .lp-section-light .lp-h2 em { color: #8B6914; }

        /* STATS */
        .lp-stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0; border: 1px solid var(--border); margin-top: 4rem;
        }
        .lp-stat {
          padding: 3rem 2rem; border-right: 1px solid var(--border);
          text-align: center;
        }
        .lp-stat:last-child { border-right: none; }
        .lp-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem; font-weight: 700;
          color: var(--gold); line-height: 1; display: block; margin-bottom: 0.5rem;
        }
        .lp-stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--slate);
        }

        /* ABOUT */
        .lp-about-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center;
          margin-top: 3rem;
        }
        .lp-about-text p {
          font-size: 1.0625rem; line-height: 1.8; color: rgba(245,244,240,0.75);
          margin-bottom: 1.25rem;
        }
        .lp-about-text p:last-child { margin-bottom: 0; }
        .lp-about-aside {
          border-left: 1px solid var(--border); padding-left: 3rem;
          display: flex; flex-direction: column; gap: 2.5rem;
        }
        .lp-about-pillar-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;
          color: var(--stone);
        }
        .lp-about-pillar-text {
          font-size: 0.9rem; line-height: 1.7; color: var(--slate);
        }

        /* EVENTS */
        .lp-events-list { margin-top: 3rem; display: flex; flex-direction: column; gap: 1px; background: var(--border); }
        .lp-event-card {
          display: grid; grid-template-columns: auto 1fr auto;
          align-items: center; gap: 2rem;
          background: var(--dark); padding: 1.75rem 2rem;
          transition: background 0.2s;
          text-decoration: none; color: inherit;
        }
        .lp-event-card:hover { background: #1a1814; }
        .lp-event-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold); border: 1px solid rgba(201,168,76,0.3);
          padding: 0.2rem 0.6rem; border-radius: 2px; white-space: nowrap;
          width: 120px; text-align: center;
        }
        .lp-event-body {}
        .lp-event-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.0625rem; font-weight: 600; margin-bottom: 0.4rem;
        }
        .lp-event-meta {
          font-size: 0.8125rem; color: var(--slate);
          font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em;
        }
        .lp-event-logo {
          height: 28px; width: 100px; object-fit: contain;
          filter: brightness(0) invert(1); opacity: 0.5;
        }
        .lp-event-card:hover .lp-event-logo { opacity: 0.9; }

        /* BLOG */
        .lp-blog-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem; margin-top: 3rem;
        }
        .lp-blog-card {
          background: var(--black); border: 1px solid var(--border);
          padding: 2rem; display: flex; flex-direction: column;
          transition: border-color 0.2s;
        }
        .lp-blog-card:hover { border-color: rgba(201,168,76,0.4); }
        .lp-blog-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 1rem;
        }
        .lp-blog-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.125rem; font-weight: 600; line-height: 1.4;
          margin-bottom: 0.875rem; flex: 1;
        }
        .lp-blog-excerpt {
          font-size: 0.875rem; line-height: 1.7; color: var(--slate);
          margin-bottom: 1.5rem;
        }
        .lp-blog-footer {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.1em; color: var(--slate);
          border-top: 1px solid var(--border); padding-top: 1rem;
          display: flex; justify-content: space-between;
        }

        /* ALUMNI */
        .lp-alumni-grid {
          display: grid; grid-template-columns: repeat(6, 1fr);
          gap: 2.5rem 3rem; align-items: center; justify-items: center;
          margin-top: 3rem;
        }
        .lp-alumni-logo {
          max-height: 32px; max-width: 100px; width: 100%; object-fit: contain;
          opacity: 0.35; transition: opacity 0.2s;
          filter: grayscale(1);
        }
        .lp-alumni-logo:hover { opacity: 0.8; filter: none; }

        /* QUOTE */
        .lp-quote-section {
          position: relative; overflow: hidden;
          padding: 8rem 2.5rem;
          background: var(--dark);
          text-align: center;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .lp-quote-bg {
          position: absolute; inset: 0;
          background-image: url('https://images.unsplash.com/photo-1535479672101-8486af672be0?auto=format&fit=crop&w=1920');
          background-size: cover; background-position: center;
          opacity: 0.06;
        }
        .lp-quote-content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
        .lp-quote-mark {
          font-family: 'Playfair Display', serif;
          font-size: 8rem; line-height: 0.5; color: var(--gold); opacity: 0.2;
          display: block; margin-bottom: 1rem; user-select: none;
        }
        .lp-quote-text {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.75rem, 3.5vw, 2.75rem); font-weight: 600; font-style: italic;
          line-height: 1.25; color: var(--stone);
          margin-bottom: 2rem;
        }
        .lp-quote-attr {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold);
        }

        /* PARTNERS */
        .lp-partners-grid {
          display: flex; flex-wrap: wrap; gap: 1.5rem; margin-top: 3rem;
        }
        .lp-partner-chip {
          border: 1px solid var(--border); padding: 0.875rem 1.5rem;
          display: flex; align-items: center; gap: 0.75rem;
          transition: border-color 0.2s;
        }
        .lp-partner-chip:hover { border-color: rgba(201,168,76,0.4); }
        .lp-partner-chip img {
          height: 24px; max-width: 80px; object-fit: contain;
          filter: brightness(0) invert(1); opacity: 0.6;
        }

        /* FOOTER */
        .lp-footer {
          background: #080808; padding: 5rem 2.5rem 2.5rem;
          border-top: 1px solid var(--border);
        }
        .lp-footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 4rem; max-width: 1100px; margin: 0 auto 4rem;
        }
        .lp-footer-logo { height: 32px; margin-bottom: 1.25rem; filter: brightness(0) invert(1); opacity: 0.8; }
        .lp-footer-about { font-size: 0.875rem; line-height: 1.7; color: var(--slate); }
        .lp-footer-col-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 1.25rem;
        }
        .lp-footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.625rem; }
        .lp-footer-links a {
          font-size: 0.875rem; color: var(--slate); text-decoration: none;
          transition: color 0.2s;
        }
        .lp-footer-links a:hover { color: var(--stone); }
        .lp-footer-contact p {
          font-size: 0.875rem; color: var(--slate); line-height: 1.7; margin-bottom: 0.5rem;
        }
        .lp-footer-contact a { color: var(--slate); text-decoration: none; }
        .lp-footer-contact a:hover { color: var(--stone); }
        .lp-footer-socials { display: flex; gap: 1rem; margin-top: 1rem; }
        .lp-footer-social {
          width: 36px; height: 36px; border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--slate); text-decoration: none; font-size: 0.8rem;
          transition: border-color 0.2s, color 0.2s;
        }
        .lp-footer-social:hover { border-color: var(--gold); color: var(--gold); }
        .lp-footer-bottom {
          max-width: 1100px; margin: 0 auto;
          padding-top: 2rem; border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .lp-footer-copy {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.1em; color: rgba(107,114,128,0.6);
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .lp-nav { padding: 1rem 1.25rem; }
          .lp-nav.scrolled { padding: 0.75rem 1.25rem; }
          .lp-navlinks { display: none; }
          .lp-hamburger { display: flex; }
          .lp-mobile-menu {
            position: fixed; inset: 0; z-index: 99;
            background: var(--black); display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 2rem;
          }
          .lp-mobile-menu a {
            font-size: 1.5rem; font-family: 'Playfair Display', serif;
            color: var(--stone); text-decoration: none;
          }
          .lp-hero { padding: 0 1.25rem 4rem; }
          .lp-section { padding: 4rem 1.25rem; }
          .lp-stats-grid { grid-template-columns: 1fr 1fr; }
          .lp-stat { border-right: none; border-bottom: 1px solid var(--border); }
          .lp-about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .lp-about-aside { border-left: none; border-top: 1px solid var(--border); padding-left: 0; padding-top: 2.5rem; }
          .lp-blog-grid { grid-template-columns: 1fr; }
          .lp-alumni-grid { grid-template-columns: repeat(3, 1fr); }
          .lp-event-card { grid-template-columns: 1fr; gap: 0.75rem; }
          .lp-event-logo { display: none; }
          .lp-footer-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .lp-footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
        }
      `}</style>

      <div className="lp">
        {/* ── NAV ── */}
        <header className={`lp-nav${scrolled ? ' scrolled' : ''}`}>
          <img
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop/ETAoUm5qKUSv5fCI/imagen1-3buBGzJEexkBm56A.png"
            alt="Club de Finanzas FEN"
            className="lp-logo"
          />
          <nav>
            <ul className="lp-navlinks">
              {NAV_LINKS.map(l => (
                <li key={l.href}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
          <a href="/auth/login" className="lp-nav-cta">Ingresar →</a>
          <button className="lp-hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </header>

        {menuOpen && (
          <div className="lp-mobile-menu" onClick={() => setMenuOpen(false)}>
            {NAV_LINKS.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
            <a href="/auth/login" style={{ color: 'var(--gold)' }}>Ingresar →</a>
          </div>
        )}

        {/* ── HERO ── */}
        <section className="lp-hero" id="inicio">
          <video autoPlay muted loop playsInline
            src="https://videos.pexels.com/video-files/15512791/15512791-uhd_3840_2160_30fps.mp4"
          />
          <div className="lp-hero-overlay" />
          <div className="lp-hero-grid" />
          <div className="lp-hero-content">
            <p className="lp-eyebrow">Club de Finanzas FEN · Universidad de Chile</p>
            <h1>Tu puente hacia<br />el mundo<br /><em>financiero</em></h1>
            <p className="lp-hero-sub">
              La comunidad estudiantil de finanzas más activa de Chile. Conectamos talento, industria y visión de largo plazo.
            </p>
            <div className="lp-hero-actions">
              <a href="#nosotros" className="lp-btn-primary">Conocer más</a>
              <a href="#eventos" className="lp-btn-ghost">Ver eventos</a>
            </div>
          </div>
        </section>

        {/* ── TICKER ── */}
        <div className="lp-ticker">
          <div className="lp-ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="lp-ticker-item">
                {item} <span className="lp-ticker-sep">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── STATS + ABOUT ── */}
        <section className="lp-section" id="nosotros">
          <div className="lp-inner">
            <p className="lp-section-label">Quiénes somos</p>
            <h2 className="lp-h2">Formando a la próxima<br />generación de <em>líderes</em></h2>

            <div className="lp-stats-grid">
              {STATS.map(s => (
                <div key={s.label} className="lp-stat">
                  <span className="lp-stat-value">
                    <Counter target={s.value} suffix={s.suffix} />
                  </span>
                  <span className="lp-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="lp-about-grid" style={{ marginTop: '5rem' }}>
              <div className="lp-about-text">
                <p>
                  El Club de Finanzas FEN se ha consolidado como la comunidad estudiantil de finanzas más grande y activa de Chile. A través del trabajo constante de sus miembros y de una agenda continua de iniciativas vinculadas a la industria, el club ha logrado posicionarse como un referente dentro del ecosistema universitario.
                </p>
                <p>
                  Nuestra comunidad reúne a estudiantes con un fuerte interés por los mercados, la inversión y el análisis económico, generando espacios donde el rigor intelectual, la curiosidad y la conexión con el sector financiero permiten ampliar la formación académica.
                </p>
                <a href="#contacto" className="lp-btn-primary" style={{ display: 'inline-flex', marginTop: '2rem' }}>
                  Únete al club →
                </a>
              </div>
              <div className="lp-about-aside">
                {[
                  { title: 'Desarrollar talento', text: 'Promovemos la formación de estudiantes con base analítica sólida y comprensión profunda de los mercados financieros.' },
                  { title: 'Conectar con la industria', text: 'Organizamos Brown Bag Lunches, visitas y charlas con ejecutivos de las principales firmas financieras de Chile y el mundo.' },
                  { title: 'Diversidad e inclusión', text: 'Alianza con WeAreMef para promover mayor participación y liderazgo femenino en el sector financiero.' },
                ].map(p => (
                  <div key={p.title}>
                    <p className="lp-about-pillar-title">{p.title}</p>
                    <p className="lp-about-pillar-text">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── EVENTS ── */}
        <section className="lp-section lp-section-dark" id="eventos">
          <div className="lp-inner">
            <p className="lp-section-label">Agenda</p>
            <h2 className="lp-h2">Próximos <em>eventos</em></h2>
            <div className="lp-events-list">
              {EVENTS.map(ev => (
                <div key={ev.title} className="lp-event-card">
                  <span className="lp-event-tag">{ev.type}</span>
                  <div className="lp-event-body">
                    <p className="lp-event-title">{ev.title}</p>
                    <p className="lp-event-meta">{ev.date} · {ev.time} · {ev.location}</p>
                  </div>
                  <img src={ev.logo} alt={ev.company} className="lp-event-logo" />
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
              <a href="/blog" className="lp-btn-ghost">Ver todos los eventos →</a>
            </div>
          </div>
        </section>

        {/* ── BLOG ── */}
        <section className="lp-section lp-section-light">
          <div className="lp-inner">
            <p className="lp-section-label" style={{ color: '#8B6914' }}>
              <span style={{ width: 24, height: 1, background: '#8B6914', display: 'inline-block', marginRight: '0.75rem' }} />
              Blog
            </p>
            <h2 className="lp-h2" style={{ color: 'var(--black)' }}>
              Análisis y <em style={{ color: '#8B6914' }}>perspectivas</em>
            </h2>
            <div className="lp-blog-grid">
              {BLOG_POSTS.map(post => (
                <div key={post.title} className="lp-blog-card" style={{ background: 'white', borderColor: '#E5E3DE' }}>
                  <p className="lp-blog-tag" style={{ color: '#8B6914' }}>{post.tag}</p>
                  <p className="lp-blog-title" style={{ color: 'var(--black)' }}>{post.title}</p>
                  <p className="lp-blog-excerpt">{post.excerpt}</p>
                  <div className="lp-blog-footer" style={{ borderColor: '#E5E3DE', color: '#9CA3AF' }}>
                    <span>{post.author}</span>
                    <span>{post.date} · {post.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <a href="/blog" className="lp-btn-primary" style={{ background: 'var(--black)', color: 'var(--stone)' }}>
                Leer más artículos →
              </a>
            </div>
          </div>
        </section>

        {/* ── QUOTE ── */}
        <div className="lp-quote-section">
          <div className="lp-quote-bg" />
          <div className="lp-quote-content">
            <span className="lp-quote-mark">"</span>
            <p className="lp-quote-text">Fieles a nuestros principios</p>
            <p className="lp-quote-attr">La base institucional que sostiene nuestra comunidad</p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://assets.zyrosite.com/ETAoUm5qKUSv5fCI/estatutos-y-coidigo-de-honor-del-club-de-finanzas-fen-80ZACBeJJFulW7dd.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn-ghost"
              >
                Leer estatutos
              </a>
            </div>
          </div>
        </div>

        {/* ── ALUMNI ── */}
        <section className="lp-section" id="alumni">
          <div className="lp-inner">
            <p className="lp-section-label">Red de alumni</p>
            <h2 className="lp-h2">Nuestros miembros trabajan en las<br />mejores <em>instituciones</em></h2>
            <div className="lp-alumni-grid">
              {ALUMNI_LOGOS.map(a => (
                <img key={a.name} src={a.url} alt={a.name} className="lp-alumni-logo" />
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer" id="contacto">
          <div className="lp-footer-grid">
            <div>
              <img
                src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop/ETAoUm5qKUSv5fCI/imagen1-3buBGzJEexkBm56A.png"
                alt="Club de Finanzas FEN"
                className="lp-footer-logo"
              />
              <p className="lp-footer-about">
                Comunidad de la Facultad de Economía y Negocios de la Universidad de Chile, orientada a potenciar el talento de estudiantes interesados en finanzas, mercados e industria financiera.
              </p>
              <div className="lp-footer-socials">
                <a href="https://www.instagram.com/clubfinzfen" target="_blank" rel="noopener noreferrer" className="lp-footer-social" aria-label="Instagram">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/105209846" target="_blank" rel="noopener noreferrer" className="lp-footer-social" aria-label="LinkedIn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <p className="lp-footer-col-title">Navegación</p>
              <ul className="lp-footer-links">
                {NAV_LINKS.map(l => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
              </ul>
            </div>
            <div>
              <p className="lp-footer-col-title">Nosotros</p>
              <ul className="lp-footer-links">
                <li><a href="#">¿Qué Hacemos?</a></li>
                <li><a href="#">¿Quiénes Somos?</a></li>
                <li><a href="#">Visitas</a></li>
                <li><a href="#">Charlas</a></li>
                <li><a href="https://wrmef.com/" target="_blank" rel="noopener noreferrer">WeAreMef</a></li>
              </ul>
            </div>
            <div className="lp-footer-contact">
              <p className="lp-footer-col-title">Contacto</p>
              <p>
                <svg style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', opacity: 0.5 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Av. Diagonal Paraguay 257,<br />Santiago de Chile
              </p>
              <p style={{ marginTop: '0.75rem' }}>
                <a href="mailto:clubfinz@fen.uchile.cl">clubfinz@fen.uchile.cl</a>
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <a href="/auth/login" className="lp-nav-cta" style={{ display: 'inline-block' }}>
                  Ingresar al portal →
                </a>
              </div>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <p className="lp-footer-copy">© {new Date().getFullYear()} Club de Finanzas FEN · Universidad de Chile</p>
            <p className="lp-footer-copy">Est. 2024 · Santiago, Chile</p>
          </div>
        </footer>
      </div>
    </>
  )
}
