import React from 'react';
import Link from 'next/link';
import { fetchArticles, fetchMagazinesConfig } from '@/lib/wordpress';
import { magazines as defaultMagazines } from './magazines/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [articles, dynamicConfigs] = await Promise.all([
    fetchArticles(),
    fetchMagazinesConfig()
  ]);

  // Merge dynamic magazine configurations
  const seenSlugs = new Set();
  const magazines = [];

  [...dynamicConfigs, ...defaultMagazines].forEach(m => {
    const cleanSlug = m.slug?.replace(/^magazine-\d{2}-/, '') || m.slug;
    if (!seenSlugs.has(cleanSlug)) {
      seenSlugs.add(cleanSlug);
      const conf = dynamicConfigs.find(c => c.slug === m.slug || c.slug?.replace(/^magazine-\d{2}-/, '') === cleanSlug) || {};
      magazines.push({
        num: String(conf.id || m.id || 1).padStart(2, '0'),
        title: conf.title || m.title,
        slug: m.slug,
        vol: "Vol. I",
        desc: conf.description || conf.subtitle || m.description || m.subtitle || "",
        img: conf.heroImage || m.heroImage || m.img || "/assets/core/img/home_mag_01_1782125759189.png",
        grad: conf.gradient || m.gradient || m.grad || "linear-gradient(135deg, #2b1126, #411d3d)",
        icon: conf.icon || m.icon || ""
      });
    }
  });

  magazines.sort((a, b) => (parseInt(a.num, 10) || 0) - (parseInt(b.num, 10) || 0));
  
  const mainFeature = articles.find(a => a.placementTarget === 'HERO_MAIN') || articles[0] || {
    id: "hero-main-default",
    title: "La Métamorphose du Pouvoir à l'Ère des Algorithmes",
    category: "INTELLIGENCE",
    desc: "Dans un monde en mutation constante, la capacité à naviguer dans l'incertitude devient le premier levier de puissance souveraine.",
    author: "HÉLÈNE GIRARD",
    updated: "8 MIN DE LECTURE",
    coverImage: "/assets/core/img/home_alaune_main_1782125698619.png"
  };

  const sideFeatures = articles.filter(a => a.id !== mainFeature.id).slice(0, 2);
  const side1 = sideFeatures[0] || {
    title: "L'Art de la Transmission",
    category: "HÉRITAGE",
    desc: "Comment préserver les valeurs au-delà du succès matériel.",
    coverImage: "/assets/core/img/home_alaune_side1_1782125709654.png"
  };
  const side2 = sideFeatures[1] || {
    title: "Le Rituel du Matin Solaire",
    category: "AGENDA",
    desc: "Trois étapes pour aligner votre intention quotidienne.",
    coverImage: "/assets/core/img/home_alaune_side2_1782125722981.png"
  };

  // Find magazine slug for an article category
  const getMagSlugForCat = (cat) => {
    const clean = (cat || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = magazines.find(m => {
      const mClean = m.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      const sClean = m.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
      return clean.includes(mClean) || clean.includes(sClean);
    });
    return found ? found.slug : "magazine-01-intelligence";
  };

  return (
    <>
      <section className="home-hero">
        <img src="/assets/core/img/home_hero_1782125665964.png" alt="Femme Solaire" className="home-hero-bg" />
        <div className="home-hero-content">
            <span className="home-hero-overline">ÉDITORIAL • PRINTEMPS 2024</span>
            <h1 className="home-hero-title">DONA :<br />L'Aube de la<br />Femme Solaire</h1>
            <p className="home-hero-subtitle">"Incarnation la puissance sans compromettre la<br />grâce, diriger avec l'évidence de la lumière."</p>
            <Link href="/manifeste" className="btn btn-primary">DÉCOUVRIR LE MANIFESTE</Link>
        </div>
    </section>

    <section className="home-magazines container section-padding">
        <div className="section-header">
            <div className="sh-left">
                <h2 className="section-title">Les {magazines.length} Magazines</h2>
                <p className="section-desc">L'encyclopédie de la souveraineté moderne, déclinée en<br />dimensions fondamentales.</p>
            </div>
            <div className="sh-right">
                <Link href="/magazines" className="link-arrow">Voir tous les magazines</Link>
            </div>
        </div>
        <div className="magazines-grid">
            {magazines.map((mag) => (
              <Link key={mag.slug} href={`/magazines/${mag.slug}`} className="mag-card" style={{ textDecoration: "none" }}>
                <div className="mag-card-top" style={{ background: mag.grad }}>
                  <div className="mag-num">{mag.num}</div>
                  <div className="mag-icon">
                    {typeof mag.icon === 'string' && mag.icon.startsWith('<svg') ? (
                      <div dangerouslySetInnerHTML={{ __html: mag.icon }} />
                    ) : typeof mag.icon === 'string' && mag.icon ? (
                      <span className="material-symbols-outlined">{mag.icon}</span>
                    ) : (
                      mag.icon || <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle></svg>
                    )}
                  </div>
                  <h3 className="mag-title">{mag.title}</h3>
                  <p className="mag-desc">{mag.desc}</p>
                </div>
                <div className="mag-card-img">
                  <img src={mag.img} alt={mag.title} />
                </div>
              </Link>
            ))}
        </div>
    </section>

    <section className="home-alaune section-padding">
        <div className="container">
            <h2 className="section-title-center">À la Une</h2>
            
            <div className="alaune-grid">
                {/* Main Feature */}
                <article className="alaune-main">
                    <Link href={`/magazines/${getMagSlugForCat(mainFeature.category)}/articles/${mainFeature.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="alaune-main-img">
                          <span className="badge badge-red">{mainFeature.category?.toUpperCase() || 'INTELLIGENCE'}</span>
                          <img src={mainFeature.coverImage || "/assets/core/img/home_alaune_main_1782125698619.png"} alt={mainFeature.title} />
                      </div>
                      <h3 className="alaune-main-title">{mainFeature.title}</h3>
                      <p className="alaune-main-desc">{mainFeature.desc}</p>
                      <div className="alaune-meta">PAR {mainFeature.author?.toUpperCase() || 'ÉLÉNA MORETTI'} • {mainFeature.updated || 'RÉCENT'}</div>
                    </Link>
                </article>
                
                {/* Side Features */}
                <div className="alaune-side">
                    <article className="alaune-side-item">
                        <Link href={`/magazines/${getMagSlugForCat(side1.category)}/articles/${side1.id || 'art-1'}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '16px' }}>
                          <img src={side1.coverImage || "/assets/core/img/home_alaune_side1_1782125709654.png"} alt={side1.title} className="alaune-side-img" />
                          <div className="alaune-side-content">
                              <span className="alaune-side-cat">{side1.category?.toUpperCase() || 'HÉRITAGE'}</span>
                              <h4 className="alaune-side-title">{side1.title}</h4>
                              <p className="alaune-side-desc">{side1.desc}</p>
                          </div>
                        </Link>
                    </article>
                    
                    <article className="alaune-side-item">
                        <Link href={`/magazines/${getMagSlugForCat(side2.category)}/articles/${side2.id || 'art-2'}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '16px' }}>
                          <img src={side2.coverImage || "/assets/core/img/home_alaune_side2_1782125722981.png"} alt={side2.title} className="alaune-side-img" />
                          <div className="alaune-side-content">
                              <span className="alaune-side-cat">{side2.category?.toUpperCase() || 'AGENDA'}</span>
                              <h4 className="alaune-side-title">{side2.title}</h4>
                              <p className="alaune-side-desc">{side2.desc}</p>
                          </div>
                        </Link>
                    </article>
                    
                    <div className="alaune-podcast">
                        <div className="podcast-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-accent)"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                            <span>PODCAST • EPISODE 24</span>
                        </div>
                        <h4 className="podcast-title">"Le Silence est un Levier de Force"</h4>
                        <Link href="/studio" className="podcast-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z"/></svg>
                            ÉCOUTER MAINTENANT
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="home-philosophy">
        <div className="container philosophy-grid">
            <div className="philosophy-text">
                <h2 className="phil-title">La femme DONA ne demande pas sa place. Elle l'illumine.</h2>
                <p className="phil-desc">Nous croyons que la puissance féminine n'est pas une conquête, mais une reconnaissance. Une force tranquille qui n'a pas besoin de bruit pour exister.</p>
                <blockquote className="phil-quote">"Le manifeste DONA est un appel à toutes celles qui souhaitent réconcilier ambition radicale et élégance intérieure."</blockquote>
                <p className="phil-desc">Plus qu'un magazine, une académie de l'être. Une alliance de visionnaires prêtes à redéfinir les codes de la réussite.</p>
                <Link href="/abonnement" className="btn btn-primary btn-large">REJOINDRE L'ALLIANCE</Link>
            </div>
            <div className="philosophy-image">
                <img src="assets/core/img/home_philosophy_woman_1782125677007.png" alt="Femme DONA" />
                <div className="philosophy-badge">
                    FONDÉE SUR L'EXCELLENCE, L'INTELLIGENCE ET LA GRÂCE.
                </div>
            </div>
        </div>
    </section>

    <section className="home-pricing">
        <div className="container">
            <div className="pricing-header">
                <h2>Investissez en Votre Souveraineté</h2>
                <p>Choisissez le niveau d'engagement qui correspond à votre trajectoire.</p>
            </div>
            
            <div className="pricing-grid">
                {/* Digitale */}
                <div className="pricing-card">
                    <h3 className="plan-name">Digitale</h3>
                    <div className="plan-price">15€<span>/mois</span></div>
                    <ul className="plan-features">
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Accès aux 16 Magazines</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Newsletter Intelligence</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Archives complètes</li>
                    </ul>
                    <Link href="/abonnement" className="btn btn-outline-red">S'ABONNER</Link>
                </div>
                
                {/* Intégrale */}
                <div className="pricing-card card-featured">
                    <div className="plan-badge">CONSEILLÉ</div>
                    <h3 className="plan-name">Intégrale</h3>
                    <div className="plan-price">29€<span>/mois</span></div>
                    <ul className="plan-features">
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Magazine Print (Trimestriel)</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Accès Digital Illimité</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Invitations aux Webinaires Académie</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Cadeau de bienvenue exclusif</li>
                    </ul>
                    <Link href="/abonnement" className="btn btn-primary">DEVENIR MEMBRE</Link>
                </div>
                
                {/* Cercle */}
                <div className="pricing-card">
                    <h3 className="plan-name">Cercle</h3>
                    <div className="plan-price">950€<span>/an</span></div>
                    <ul className="plan-features">
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Expériences Off-line (Dîners, Retraites)</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Networking Haute-Performance</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Conciergerie DONA</li>
                    </ul>
                    <Link href="/club" className="btn btn-outline-red">POSTULER AU CERCLE</Link>
                </div>
            </div>
        </div>
    </section>

    <section className="home-newsletter">
        <div className="container">
            <div className="newsletter-box">
                <div className="nl-overline">LA LETTRE SOLAIRE</div>
                <h2 className="nl-title">Recevez l'intelligence DONA directement.</h2>
                <p className="nl-desc">Chaque dimanche, une dose de lucidité et d'inspiration pour préparer votre semaine de souveraineté.</p>
                <form className="nl-form">
                    <input type="email" placeholder="votre@email.com" required />
                    <button type="submit" className="btn btn-primary">S'INSCRIRE</button>
                </form>
                <div className="nl-disclaimer">RESPECT DE VOTRE VIE PRIVÉE. DÉSABONNEMENT EN UN CLIC.</div>
            </div>
        </div>
    </section>
    </>
  );
}
