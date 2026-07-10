import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: `
        .legal-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 24px 120px;
        }
        .legal-header {
            padding: 120px 0 60px;
            text-align: center;
        }
        .legal-content {
            border-top: 1px solid var(--color-border);
            padding-top: 50px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            line-height: 1.8;
            color: var(--color-text);
        }
        .legal-section-title {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 500;
            margin: 40px 0 16px;
            color: var(--color-text);
        }
        .legal-content p {
            margin-bottom: 24px;
            color: var(--color-text-muted);
            text-align: justify;
        }
    ` }} />

    <div className="legal-container">
        <header className="legal-header">
            <span style={{fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: "600", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B002A", display: "block", marginBottom: "16px"}}>RÉGLEMENTATION RGPD</span>
            <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: "300", lineHeight: "1.2", margin: "0"}}>Politique de Confidentialité</h1>
            <p style={{fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--color-text-muted)", marginTop: "12px"}}>Dernière mise à jour : 6 Juillet 2026</p>
        </header>

        <div className="legal-content">
            <h2 className="legal-section-title">1. Collecte des données personnelles</h2>
            <p>
                DONA MAGAZINE s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site donamagazine.com, soient conformes au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés. Les informations recueillies proviennent de l'adhésion au Club, des abonnements numériques, et des formulaires de contact/recrutement.
            </p>

            <h2 className="legal-section-title">2. Droits d'accès des membres VIP</h2>
            <p>
                Chaque membre inscrit ou abonné au Club VIP bénéficie d'un droit d'accès, de rectification, de portabilité et d'effacement de ses données personnelles. Vous pouvez également demander la limitation ou vous opposer au traitement des données vous concernant. Pour exercer ces droits, vous pouvez nous écrire directement via notre hub de contact ou envoyer un courrier à notre siège social.
            </p>

            <h2 className="legal-section-title">3. Utilisation des cookies et traceurs</h2>
            <p>
                Afin d'optimiser l'expérience de lecture, de mémoriser les préférences de thème (Clair/Sombre) et de sécuriser la session des membres connectés, notre site utilise des traceurs fonctionnels et analytiques. Vous pouvez à tout moment configurer votre navigateur pour accepter ou refuser ces cookies, bien que certaines fonctionnalités de l'Espace Lecture puissent être altérées sans ces derniers.
            </p>

            <h2 className="legal-section-title">4. Sécurité et conservation</h2>
            <p>
                Les informations sensibles (telles que les coordonnées de facturation ou les documents de candidature) sont cryptées à l'aide de protocoles de sécurité avancés et stockées dans des environnements sécurisés. Les données de recrutement sont supprimées sous un délai maximum de 24 mois après le dernier contact, sauf demande contraire de votre part.
            </p>
        </div>
    </div>
    </main>
  );
}
