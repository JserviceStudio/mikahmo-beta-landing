'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const mockups = [
  'Screenshot_2026-06-19-11-44-48-055_com.moailte.mikhmonproai-edit.png',
  'Screenshot_2026-06-19-11-45-25-374_com.moailte.mikhmonproai.jpg',
  'Screenshot_2026-06-19-11-49-58-665_com.moailte.mikhmonproai.jpg',
  'Screenshot_2026-06-19-11-50-29-571_com.moailte.mikhmonproai.jpg',
  'Screenshot_2026-06-19-11-53-22-463_com.moailte.mikhmonproai-edit.png',
  'Screenshot_2026-06-19-12-18-07-994_com.moailte.mikhmonproai-edit.png'
];

const translations = {
  fr: {
    audience: "Opérateurs Hotspot Mikrotik & Admins FAI",
    title: "Prenez le contrôle de vos hotspots.",
    subtitle: "Gérez votre réseau Mikrotik grâce à l'IA et au portage mobile automatisé.",
    feat1_title: "Optimisation par IA",
    feat1_desc: "Équilibrage de charge intelligent et détection d'anomalies en temps réel.",
    feat2_title: "Gestion mobile fluide",
    feat2_desc: "Contrôlez toute votre infrastructure MikroTik directement depuis votre smartphone.",
    feat3_title: "Intégration TiketMomo & RADIUS",
    feat3_desc: "Intégration automatisée avec TiketMomo et fonctionnalités avancées de serveur RADIUS.",
    urgency_title: "Accès Bêta Exclusif",
    urgency_desc: "Rejoignez la bêta de 14 jours pour accéder en avant-première aux outils réseau IA et verrouillez votre tarif bêta à vie.",
    form_placeholder: "admin@fai.com",
    form_whatsapp: "Numéro WhatsApp (+237...)",
    form_loading: "Inscription en cours...",
    form_submit: "Je participe.",
    powered_by: "Propulsé par",
    err_network: "Impossible de se connecter au serveur.",
    preview_title: "Aperçu de l'application",
    wa_message: "Bonjour, voici mon rapport de test pour MikahmoAI Beta :",
    biz_title: "Vous êtes un prestataire ou intégrateur MikroTik ?",
    biz_desc: "Déployez MikahmoAI sous votre marque auprès de vos clients. Offre revendeur, API d'intégration et support technique dédié disponibles.",
    biz_item1: "Marque blanche (White-label)",
    biz_item2: "API d'intégration pour vos portails captifs",
    biz_item3: "Tarifs volume pour vos clients ISP",
    biz_cta: "Nous contacter pour un partenariat",
    pro_badge: "Techniciens & Professionnels",
    pro_title: "Vous maintenez ou déployez des réseaux MikroTik ?",
    pro_desc: "Rejoignez la plateforme dédiée aux techniciens et prestataires de maintenance réseau MikroTik. Gérez vos missions, vos clients et vos interventions depuis un seul endroit.",
    pro_item1: "Gestion de parc clients MikroTik",
    pro_item2: "Suivi des interventions et tickets",
    pro_item3: "Outils de diagnostic réseau intégrés",
    pro_cta: "Rejoindre la plateforme pro →"
  },
  en: {
    audience: "Mikrotik Hotspot Operators & ISP Admins",
    title: "Empower your hotspot management.",
    subtitle: "Empower your Mikrotik hotspot management with AI-driven insights and automated mobile porting.",
    feat1_title: "AI-powered network optimization",
    feat1_desc: "Intelligently balance loads and detect anomalies in real-time.",
    feat2_title: "Seamless mobile management",
    feat2_desc: "Control your entire MikroTik infrastructure directly from your smartphone.",
    feat3_title: "TiketMomo & RADIUS",
    feat3_desc: "Automated integration with TiketMomo and advanced RADIUS server capabilities.",
    urgency_title: "Exclusive Beta Access",
    urgency_desc: "Join the 14-day beta to get exclusive early access to AI network tools and lock in lifetime beta pricing.",
    form_placeholder: "admin@isp.com",
    form_whatsapp: "WhatsApp Number (+237...)",
    form_loading: "Registering...",
    form_submit: "I participate.",
    powered_by: "Powered by",
    err_network: "Unable to connect to the server.",
    preview_title: "App Preview",
    wa_message: "Hello, here is my test report for MikahmoAI Beta :",
    biz_title: "Are you a MikroTik service provider or integrator?",
    biz_desc: "Deploy MikahmoAI under your brand for your clients. Reseller offers, integration API, and dedicated technical support available.",
    biz_item1: "White-label solution",
    biz_item2: "Integration API for your captive portals",
    biz_item3: "Volume pricing for your ISP clients",
    biz_cta: "Contact us for a partnership",
    pro_badge: "Technicians & Professionals",
    pro_title: "Do you maintain or deploy MikroTik networks?",
    pro_desc: "Join the dedicated platform for MikroTik network maintenance technicians and service providers. Manage your jobs, clients, and interventions from one place.",
    pro_item1: "MikroTik client fleet management",
    pro_item2: "Job tracking and ticketing",
    pro_item3: "Built-in network diagnostic tools",
    pro_cta: "Join the pro platform →"
  }
};

export default function Home() {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [currentMockupIndex, setCurrentMockupIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMockupIndex((prev) => {
        let next = Math.floor(Math.random() * mockups.length);
        while (next === prev) {
          next = Math.floor(Math.random() * mockups.length);
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, whatsapp }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        setWhatsapp('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue.');
      }
    } catch (err) {
      setStatus('error');
      setMessage(t.err_network);
    }
  };

  return (
    <main style={{ width: '100%', padding: '1rem 0' }}>
      
      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/22996937864?text=${encodeURIComponent(t.wa_message)}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="floating-whatsapp"
        title="Contact WhatsApp"
      >
        <svg viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>

      {/* Language Toggler (Floating) */}
      <div className="floating-lang-switch">
        <button 
          className={`lang-btn ${lang === 'fr' ? 'active' : ''}`} 
          onClick={() => setLang('fr')}
        >
          FR
        </button>
        <button 
          className={`lang-btn ${lang === 'en' ? 'active' : ''}`} 
          onClick={() => setLang('en')}
        >
          EN
        </button>
      </div>

      <div className="bento-container">

        {/* Main Hero Card */}
        <div className="bento-card col-span-8" style={{ justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '40px', height: '40px', flexShrink: 0 }}>
              <Image src="/assets/icon.png" alt="MikahmoAI Icon" fill sizes="40px" style={{ objectFit: 'contain' }} priority />
            </div>
            <div className="m3-chip" style={{ margin: 0 }}>{t.audience}</div>
          </div>
          
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '1rem', lineHeight: 1.2 }}>
            <div style={{ position: 'relative', width: '200px', height: '48px', marginBottom: '1rem' }}>
               <Image src="/assets/logo.png" alt="MikahmoAI Logo" fill sizes="200px" style={{ objectFit: 'contain', objectPosition: 'left' }} priority />
            </div>
            {t.title}
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '600px', marginBottom: '1rem' }}>
            {t.subtitle}
          </p>
        </div>

        {/* Feature Card 1 */}
        <div className="bento-card col-span-4" style={{ backgroundColor: 'var(--m3-primary-container)' }}>
          <div className="bento-icon-wrapper" style={{ backgroundColor: 'var(--m3-surface)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--m3-on-primary-container)' }}>
            {t.feat1_title}
          </h3>
          <p style={{ color: 'var(--m3-on-primary-container)', opacity: 0.8, fontSize: '0.95rem' }}>
            {t.feat1_desc}
          </p>
        </div>

        {/* Form Card */}
        <div className="bento-card col-span-6">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t.urgency_title}</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {t.urgency_desc}
          </p>
          
          {status === 'success' && (
            <div className="m3-alert m3-alert-success">
              {message}
            </div>
          )}

          {status === 'error' && (
            <div className="m3-alert m3-alert-error">
              {message}
            </div>
          )}

          {status !== 'success' && (
            <form onSubmit={handleSubmit} style={{ marginTop: 'auto' }}>
              <div className="m3-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem' }}>
                <input
                  type="email"
                  required
                  className="m3-input"
                  placeholder={t.form_placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
                <input
                  type="tel"
                  required
                  className="m3-input"
                  placeholder={t.form_whatsapp}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  disabled={status === 'loading'}
                />
              </div>
              <button 
                type="submit" 
                className="m3-btn"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? t.form_loading : t.form_submit}
              </button>
            </form>
          )}
        </div>

        {/* Feature Card 2 & 3 Combined */}
        <div className="bento-card col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div className="bento-icon-wrapper" style={{ margin: 0, width: '40px', height: '40px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.15rem' }}>{t.feat2_title}</h3>
            </div>
            <p className="text-muted" style={{ paddingLeft: '3.5rem', fontSize: '0.95rem' }}>{t.feat2_desc}</p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div className="bento-icon-wrapper" style={{ margin: 0, width: '40px', height: '40px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.15rem' }}>{t.feat3_title}</h3>
            </div>
            <p className="text-muted" style={{ paddingLeft: '3.5rem', fontSize: '0.95rem' }}>{t.feat3_desc}</p>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-end', opacity: 0.6 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{t.powered_by}</span>
            <div style={{ position: 'relative', width: '80px', height: '20px' }}>
              <Image src="/assets/moailt.png" alt="MoailteAI Logo" fill sizes="80px" style={{ objectFit: 'contain' }} />
            </div>
          </div>
        </div>

        {/* App Previews Card */}
        <div className="bento-card col-span-12" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', alignSelf: 'flex-start' }}>{t.preview_title}</h2>
          
          <div style={{ position: 'relative', width: '280px', height: '600px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
            {mockups.map((src, i) => (
              <Image 
                key={i}
                src={`/mockups/${src}`} 
                alt={`App Preview ${i+1}`} 
                fill 
                sizes="280px"
                priority={i === 0}
                style={{ 
                  objectFit: 'cover',
                  opacity: currentMockupIndex === i ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }} 
              />
            ))}
          </div>
        </div>

        {/* Business / Partners Section */}
        <div className="bento-card col-span-12" style={{ background: 'linear-gradient(135deg, var(--m3-primary-container) 0%, var(--m3-surface) 100%)', border: '1.5px solid var(--m3-primary)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div className="bento-icon-wrapper" style={{ margin: 0, background: 'var(--m3-primary)', color: 'var(--m3-on-primary)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--m3-primary)', opacity: 0.8 }}>Business &amp; Partenaires</span>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 0, color: 'var(--m3-on-primary-container)' }}>{t.biz_title}</h2>
            </div>
          </div>

          <p style={{ color: 'var(--m3-on-primary-container)', opacity: 0.85, marginBottom: '1.5rem', maxWidth: '700px', fontSize: '0.97rem' }}>
            {t.biz_desc}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
            {[t.biz_item1, t.biz_item2, t.biz_item3].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--m3-on-primary-container)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {item}
              </div>
            ))}
          </div>

          <a
            href={`https://wa.me/22996937864?text=${encodeURIComponent(lang === 'fr' ? 'Bonjour, je suis un prestataire MikroTik et je souhaite discuter d un partenariat avec MikahmoAI.' : 'Hello, I am a MikroTik service provider and I would like to discuss a partnership with MikahmoAI.')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'var(--m3-primary)', color: 'var(--m3-on-primary)', borderRadius: '999px', padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', transition: 'opacity 0.2s' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            {t.biz_cta}
          </a>
        </div>

        {/* Technician / Pro Platform Section */}
        <div className="bento-card col-span-12" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', border: '1.5px solid #4f46e5', color: '#fff' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div className="bento-icon-wrapper" style={{ margin: 0, background: '#4f46e5', color: '#fff' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#818cf8' }}>{t.pro_badge}</span>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 0, color: '#fff' }}>{t.pro_title}</h2>
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '1.5rem', maxWidth: '700px', fontSize: '0.97rem' }}>
            {t.pro_desc}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
            {[t.pro_item1, t.pro_item2, t.pro_item3].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(79,70,229,0.25)', borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.9rem', fontWeight: 500, color: '#c7d2fe' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {item}
              </div>
            ))}
          </div>

          <a
            href="http://app.mikhmoai.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: '#4f46e5', color: '#fff', borderRadius: '999px', padding: '0.75rem 1.75rem', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(79,70,229,0.4)', transition: 'opacity 0.2s' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            {t.pro_cta}
          </a>
        </div>

      </div>
    </main>
  );
}
