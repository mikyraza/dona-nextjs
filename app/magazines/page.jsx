import React from 'react';
import Link from 'next/link';

export default function Page() {
  const magazines = [
    {
      num: "01",
      title: "Intelligence",
      slug: "intelligence",
      vol: "Vol. I",
      desc: "Stratégies et analyses pour un esprit affûté.",
      img: "/assets/core/img/home_mag_01_1782125759189.png",
      grad: "linear-gradient(135deg, #2b1126, #411d3d)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20m0-20a9 9 0 019 9m-9-9a9 9 0 00-9 9m9 11a9 9 0 01-9-9m9 9a9 9 0 009-9M2 12h20"></path></svg>
    },
    {
      num: "02",
      title: "Power Lab",
      slug: "power-lab",
      vol: "Vol. I",
      desc: "L'innovation et la performance redéfinies.",
      img: "/assets/core/img/home_mag_02_1782125769846.png",
      grad: "linear-gradient(135deg, #a33827, #cf5c49)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
    },
    {
      num: "03",
      title: "L'Alliance",
      slug: "alliance",
      vol: "Vol. I",
      desc: "Le pouvoir des réseaux et des connexions.",
      img: "/assets/core/img/home_mag_03_1782125780328.png",
      grad: "linear-gradient(135deg, #6c1626, #9c2741)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0zm6 10v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"></path></svg>
    },
    {
      num: "04",
      title: "L'Agenda",
      slug: "agenda",
      vol: "Vol. I",
      desc: "Maîtrisez votre temps, orchestrez votre succès.",
      img: "/assets/core/img/home_mag_04_1782125793170.png",
      grad: "linear-gradient(135deg, #b09159, #cfb17d)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>
    },
    {
      num: "05",
      title: "Passions",
      slug: "passions",
      vol: "Vol. I",
      desc: "Ce qui nous anime au plus profond.",
      img: "/assets/core/img/home_mag_05_1782125844017.png",
      grad: "linear-gradient(135deg, #c3847e, #dfa29d)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg>
    },
    {
      num: "06",
      title: "Art de Vivre",
      slug: "art-de-vivre",
      vol: "Vol. I",
      desc: "L'élégance dans chaque détail du quotidien.",
      img: "/assets/core/img/home_mag_06_1782125858971.png",
      grad: "linear-gradient(135deg, #c37b56, #e4976f)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path></svg>
    },
    {
      num: "07",
      title: "Académie",
      slug: "academie",
      vol: "Vol. I",
      desc: "L'apprentissage continu pour les esprits exigeants.",
      img: "/assets/core/img/france_1.png",
      grad: "linear-gradient(135deg, #7c4c47, #a1645e)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"></path></svg>
    },
    {
      num: "08",
      title: "Patrimoine",
      slug: "patrimoine",
      vol: "Vol. I",
      desc: "Construire et préserver pour demain.",
      img: "/assets/core/img/france_2.png",
      grad: "linear-gradient(135deg, #998357, #bdab7d)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
    },
    {
      num: "09",
      title: "Longevity",
      slug: "longevity",
      vol: "Vol. I",
      desc: "La science et l'art de vivre mieux, plus longtemps.",
      img: "/assets/core/img/home_hero_1782125665964.png",
      grad: "linear-gradient(135deg, #e69e85, #f0b4a1)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20a8 8 0 100-16 8 8 0 000 16z"></path><path d="M12 14a2 2 0 100-4 2 2 0 000 4z"></path></svg>
    },
    {
      num: "10",
      title: "Impact",
      slug: "impact",
      vol: "Vol. I",
      desc: "L'influence positive sur le monde qui nous entoure.",
      img: "/assets/core/img/home_alaune_main_1782125698619.png",
      grad: "linear-gradient(135deg, #284c3c, #3d6a56)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path><path d="M2 12h20"></path></svg>
    },
    {
      num: "11",
      title: "Culture & Médias",
      slug: "culture-medias",
      vol: "Vol. I",
      desc: "Décrypter les récits qui façonnent notre époque.",
      img: "/assets/core/img/home_alaune_side1_1782125709654.png",
      grad: "linear-gradient(135deg, #3d4052, #575b70)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><path d="M8 4v16"></path><path d="M16 4v16"></path></svg>
    },
    {
      num: "12",
      title: "Le Cercle",
      slug: "cercle",
      vol: "Vol. I",
      desc: "Entretiens intimes avec ceux qui osent.",
      img: "/assets/core/img/home_alaune_side2_1782125722981.png",
      grad: "linear-gradient(135deg, #781d33, #9c2a45)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
    },
    {
      num: "13",
      title: "Amour",
      slug: "amour",
      vol: "Vol. I",
      desc: "Les dynamiques de la relation humaine.",
      img: "/assets/core/img/home_philosophy_woman_1782125677007.png",
      grad: "linear-gradient(135deg, #d92055, #f24b78)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg>
    },
    {
      num: "14",
      title: "Beauté",
      slug: "beaute",
      vol: "Vol. I",
      desc: "L'esthétique de l'âme et du corps.",
      img: "/assets/core/img/france_3_1782121595894.png",
      grad: "linear-gradient(135deg, #e8a39c, #f5c5c0)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20m0-20a9 9 0 019 9m-9-9a9 9 0 00-9 9m9 11a9 9 0 01-9-9m9 9a9 9 0 009-9M2 12h20"></path></svg>
    },
    {
      num: "15",
      title: "Mariages",
      slug: "mariages",
      vol: "Vol. I",
      desc: "Célébrer l'engagement avec panache.",
      img: "/assets/core/img/home_hero_1782125665964.png",
      grad: "linear-gradient(135deg, #7a3f47, #9e555e)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14" stroke="currentColor" strokeWidth="1.5"></path><path d="M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5"></path></svg>
    },
    {
      num: "16",
      title: "Santé",
      slug: "sante",
      vol: "Vol. I",
      desc: "L'équilibre physique et mental absolu.",
      img: "/assets/core/img/france_1.png",
      grad: "linear-gradient(135deg, #2b9c8d, #45bdae)",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    }
  ];

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hover transitions & optimizations for the chosen magazine layout */
        .mag-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, opacity 0.3s ease !important;
          border-radius: 40px 0 40px 0 !important;
          overflow: hidden !important;
          height: 400px !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .mag-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(163, 6, 38, 0.15);
          opacity: 0.95;
        }

        .mag-card-img {
          overflow: hidden !important;
          height: 220px !important;
          width: 100% !important;
        }

        .mag-card-img img {
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        .mag-card:hover .mag-card-img img {
          transform: scale(1.06);
        }

        .mag-num {
          display: flex !important;
          align-items: baseline !important;
          gap: 6px !important;
        }

        .mag-vol-tag {
          font-size: 0.7rem !important;
          letter-spacing: 1px !important;
          text-transform: uppercase !important;
          opacity: 0.6 !important;
          font-weight: 500 !important;
          font-family: var(--font-primary) !important;
        }

        /* Ensure clean layout text without default blue overrides */
        .mags-list .mag-card {
          color: #FFF !important;
        }

        .mags-cta .btn-primary {
          background-color: var(--color-accent) !important;
          color: #ffffff !important;
          transition: background-color 0.3s ease, transform 0.2s ease !important;
        }

        .mags-cta .btn-primary:hover {
          background-color: #a31830 !important;
          transform: translateY(-2px);
        }
      ` }} />

      <section className="mags-hero">
        <div className="mags-hero-bg"></div>
        <div className="mags-hero-content container">
            <span className="mags-overline">100% DIGITAL & INTERACTIF</span>
            <h1 className="mags-title">DÉCOUVREZ NOS 16<br />MAGAZINES</h1>
            <p className="mags-desc">Chaque magazine est une expérience unique conçue pour votre excellence. Une collection pensée pour élever chaque aspect de votre vie.</p>
        </div>
      </section>

      <section className="mags-list section-padding">
        <div className="container magazines-grid">
          {magazines.map((mag) => (
            <Link key={mag.slug} href={`/magazines/${mag.slug}`} className="mag-card" style={{textDecoration: "none"}}>
              <div className="mag-card-top" style={{background: mag.grad}}>
                <div className="mag-num">
                  {mag.num}
                  <span className="mag-vol-tag">{mag.vol}</span>
                </div>
                <div className="mag-icon">
                  {mag.icon}
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

      <section className="mags-cta">
        <div className="container text-center">
            <h2 className="cta-title">Prête à explorer ?</h2>
            <p className="cta-desc">Rejoignez notre cercle de lecteurs privilégiés et accédez à l'intégralité de nos 16 magazines thématiques.</p>
            <Link href="/abonnement" className="btn btn-primary">DEVENIR MEMBRE PREMIUM</Link>
        </div>
      </section>
    </main>
  );
}
