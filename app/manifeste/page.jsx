import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: `
        .manifesto-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 24px 120px;
        }
        .manifesto-header {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 120px 0 60px;
            max-width: 900px;
        }
        .manifesto-text p {
            margin-bottom: 40px;
            font-family: 'Cormorant Garamond', serif;
            font-size: 22px;
            line-height: 1.8;
            text-align: justify;
            color: var(--color-text);
        }
        .manifesto-text p.has-dropcap::first-letter {
            font-family: 'Playfair Display', serif;
            font-size: 80px;
            line-height: 60px;
            padding-top: 4px;
            padding-right: 14px;
            padding-left: 2px;
            float: left;
            color: #8B002A;
            font-weight: 300;
        }
        .manifesto-quote {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-style: italic;
            line-height: 1.4;
            margin: 60px 0;
            padding: 10px 0 10px 40px;
            border-left: 2px solid #8B002A;
            color: var(--color-text);
            text-align: left;
            letter-spacing: -0.01em;
        }
        .manifesto-section-title {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            font-weight: 600;
            margin: 60px 0 24px;
            color: #8B002A;
            font-style: italic;
        }
    ` }} />

    <div className="manifesto-container">
        <header className="manifesto-header">
            <span style={{fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: "600", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B002A", marginBottom: "24px"}}>MANIFESTE DE LA RÉDACTION</span>
            <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: "64px", fontWeight: "300", lineHeight: "1.1", margin: "0", maxWidth: "750px", textAlign: "left"}}>
                L'Éloge du <span style={{fontStyle: "italic", fontWeight: "400"}}>Silence</span> et de la <span style={{fontStyle: "italic", fontWeight: "400"}}>Clarté</span>.
            </h1>
        </header>

        <article className="manifesto-text">
            <p className="has-dropcap">
                À l'ère de l'immédiateté, de la surinformation et du bruit constant, DONA MAGAZINE fait le choix audacieux du recul, de la lenteur et de la clarté. Nous pensons que le luxe ultime réside dans le temps que l'on s'accorde pour penser, contempler et comprendre les forces qui façonnent notre époque.
            </p>

            <blockquote className="manifesto-quote">
                "Nous ne courons pas après la seconde qui passe, nous cherchons la vérité qui demeure."
            </blockquote>

            <h2 className="manifesto-section-title">I. La Rigueur Intellectuelle</h2>
            <p>
                L'intelligence n'est pas un vain mot, c'est notre boussole. Nous refusons les raccourcis simplistes et les consensus faciles. Chaque grand dossier de notre publication explore en profondeur les mutations sociétales, les stratégies économiques d'avant-garde, et l'impact culturel de nos choix collectifs.
            </p>

            <h2 className="manifesto-section-title">II. L'Exigence Esthétique</h2>
            <p>
                Pour DONA, la forme est le vêtement de l'esprit. L'épure de notre design, la sélection rigoureuse de nos visuels et la précision chirurgicale de notre mise en page répondent à une charte esthétique absolue. Le "Quiet Luxury" n'est pas un slogan marketing, c'est une discipline intellectuelle et visuelle de chaque instant.
            </p>

            <h2 className="manifesto-section-title">III. L'Engagement Littéraire</h2>
            <p>
                Nos auteurs et chroniqueurs s'inscrivent dans une tradition d'écriture exigeante. Nous redonnons leurs lettres de noblesse au grand reportage, au portrait fouillé et à la chronique littéraire. Lire DONA doit être une expérience physique, un plaisir des sens autant qu'un exercice de l'esprit.
            </p>
            
            <div style={{borderTop: "1px solid var(--color-border)", paddingTop: "40px", marginTop: "80px", textAlign: "center"}}>
                <p style={{fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px"}}>La Rédaction de DONA</p>
                <p style={{fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "var(--color-text-muted)"}}>Place Vendôme, Paris</p>
            </div>
        </article>
    </div>
    </main>
  );
}
