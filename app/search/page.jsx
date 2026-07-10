import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: `
        :root, [data-theme="light"] {
            --page-bg: #fff;
            --page-card-bg: #fcfcfb;
            --page-border: #ede8e4;
            --page-border-focus: #1c1b1b;
            --page-text: #1c1b1b;
            --page-text-muted: #888;
            --page-text-light: #aaa;
            --page-btn-hover: #111;
            --page-banner-bg: #f9f6f3;
        }
        [data-theme="dark"] {
            --page-bg: var(--color-bg);
            --page-card-bg: #111;
            --page-border: var(--color-border);
            --page-border-focus: var(--color-accent);
            --page-text: var(--color-text);
            --page-text-muted: var(--color-text-muted);
            --page-text-light: rgba(255, 255, 255, 0.3);
            --page-btn-hover: #333;
            --page-banner-bg: #151515;
        }
    ` }} />


    {/* Page Hero: Centered Title */}
    <section style={{padding: "110px 60px 48px", textAlign: "center"}}>
        <h1 style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "52px", fontWeight: "400", color: "var(--page-text)", margin: "0 0 16px 0", letterSpacing: "-0.01em"}}>Explorer DONA</h1>
        <p style={{fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "var(--page-text-muted)", margin: "0"}}>Recherchez parmi nos 12 Cahiers, articles, experts et ressources</p>
    </section>

    {/* Search Card */}
    <section style={{padding: "0 60px 48px", maxWidth: "960px", margin: "0 auto"}}>
        <div style={{background: "var(--page-bg)", border: "1px solid #e8e4e4", borderRadius: "4px", padding: "32px 36px"}}>

            {/* Search Input Row */}
            <div style={{display: "flex", alignItems: "center", gap: "0", marginBottom: "16px"}}>
                <div style={{display: "flex", alignItems: "center", flex: "1", border: "1px solid #e0dada", borderRadius: "2px 0 0 2px", padding: "0 16px", height: "52px"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B002A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: "0", marginRight: "12px"}}>
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" placeholder="Rechercher un article, un expert, un thème..." style={{flex: "1", border: "none", outline: "none", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", background: "transparent", height: "100%"}} />
                </div>
                <button style={{background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "0 2px 2px 0", height: "52px", padding: "0 24px", fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap"}}>RECHERCHER</button>
            </div>

            {/* Advanced Filters link */}
            <div style={{marginBottom: "24px"}}>
                <Link  href="#" style={{display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#8B002A", textDecoration: "none", fontWeight: "500"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                    Filtres avancés
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </Link>
            </div>

            {/* Divider */}
            <div style={{height: "1px", background: "#f0eaea", marginBottom: "24px"}}></div>

            {/* Two-column suggestions */}
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px"}}>

                {/* Recherches populaires */}
                <div>
                    <h3 style={{fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--page-text)", margin: "0 0 16px 0"}}>RECHERCHES POPULAIRES</h3>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "8px"}}>
                        <Link  href="#" style={{display: "inline-block", background: "var(--color-bg-alt)", border: "none", borderRadius: "2px", padding: "7px 14px", fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "var(--color-text-muted)", textDecoration: "none", cursor: "pointer"}}>Leadership féminin</Link>
                        <Link  href="#" style={{display: "inline-block", background: "var(--color-bg-alt)", border: "none", borderRadius: "2px", padding: "7px 14px", fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "var(--color-text-muted)", textDecoration: "none", cursor: "pointer"}}>Investissement impact</Link>
                        <Link  href="#" style={{display: "inline-block", background: "var(--color-bg-alt)", border: "none", borderRadius: "2px", padding: "7px 14px", fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "var(--color-text-muted)", textDecoration: "none", cursor: "pointer"}}>Bio-hacking</Link>
                        <Link  href="#" style={{display: "inline-block", background: "var(--color-bg-alt)", border: "none", borderRadius: "2px", padding: "7px 14px", fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "var(--color-text-muted)", textDecoration: "none", cursor: "pointer"}}>Networking VIP</Link>
                    </div>
                </div>

                {/* Vos recherches récentes */}
                <div>
                    <h3 style={{fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--page-text)", margin: "0 0 16px 0"}}>VOS RECHERCHES RÉCENTES</h3>
                    <ul style={{listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "12px"}}>
                        <li style={{display: "flex", alignItems: "center", gap: "10px", cursor: "pointer"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B002A" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--color-text-muted)"}}>Dr Clarisse Bama interview</span>
                        </li>
                        <li style={{display: "flex", alignItems: "center", gap: "10px", cursor: "pointer"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B002A" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--color-text-muted)"}}>Cahier Finance é 3</span>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </section>

    {/* Banner Image with Quote */}
    <section style={{maxWidth: "960px", margin: "0 auto 80px", padding: "0 60px", position: "relative"}}>
        <div style={{position: "relative", borderRadius: "4px", overflow: "hidden", height: "340px"}}>
            <img src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop" alt="Bureau d'excellence" style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "brightness(0.7)"}} />
            <div style={{position: "absolute", inset: "0", background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)"}}></div>
            <div style={{position: "absolute", bottom: "40px", left: "40px", right: "40px"}}>
                <p style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "24px", fontStyle: "italic", color: "#fff", margin: "0", lineHeight: "1.4"}}>"L'excellence n'est pas un acte, mais une habitude."</p>
            </div>
        </div>
    </section>
    </main>
  );
}
