import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: `
        .recrutement-container {
            max-width: 650px;
            margin: 0 auto;
            padding: 0 24px 120px;
        }
        .recrutement-header {
            padding: 120px 0 40px;
            text-align: center;
        }
        .form-group {
            margin-bottom: 24px;
            font-family: 'Inter', sans-serif;
        }
        .form-label {
            display: block;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: 10px;
            color: var(--color-text);
        }
        .form-input {
            width: 100%;
            border: 1px solid var(--color-border);
            padding: 16px;
            font-size: 14px;
            background: var(--color-bg-alt);
            color: var(--color-text);
            border-radius: 4px;
            transition: border-color 0.3s, background-color 0.3s;
            font-family: 'Inter', sans-serif;
        }
        .form-input:focus {
            outline: none;
            border-color: #8B002A;
            background: var(--color-bg);
        }
        .drag-drop-zone {
            border: 1px dashed var(--color-border);
            padding: 40px 20px;
            text-align: center;
            border-radius: 4px;
            background: var(--color-bg-alt);
            position: relative;
            cursor: pointer;
            transition: border-color 0.3s, background-color 0.3s;
        }
        .drag-drop-zone:hover {
            border-color: #8B002A;
            background: rgba(139, 0, 42, 0.02);
        }
        .drag-drop-zone input[type="file"] {
            position: absolute;
            inset: 0;
            opacity: 0;
            cursor: pointer;
            width: 100%;
            height: 100%;
        }
        .btn-submit {
            display: block;
            width: 100%;
            background: #8B002A;
            color: #FFFFFF;
            border: none;
            padding: 18px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-submit:hover {
            background: #A30031;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(139, 0, 42, 0.15);
        }
    ` }} />

    <div className="recrutement-container">
        <header className="recrutement-header">
            <span style={{fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: "600", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B002A", display: "block", marginBottom: "16px"}}>RECRUTEMENT</span>
            <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: "300", lineHeight: "1.2", margin: "0"}}>Soumettre votre profil</h1>
        </header>

        <form id="recruitment-form">
            <div className="form-group">
                <label className="form-label">Nom complet</label>
                <input type="text" className="form-input" required placeholder="Ex. Alessandra Rossi" />
            </div>
            
            <div className="form-group" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px"}}>
                <div>
                    <label className="form-label">Adresse email</label>
                    <input type="email" className="form-input" required placeholder="Ex. alessandra@dona.com" />
                </div>
                <div>
                    <label className="form-label">Téléphone</label>
                    <input type="tel" className="form-input" required placeholder="Ex. +33 6 12 34 56 78" />
                </div>
            </div>
            
            <div className="form-group">
                <label className="form-label">Poste ciblé</label>
                <select id="poste-select" className="form-input" required style={{appearance: "none", backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23888888\' strokeWidth=\'2\' strokeLinecap=\'round\' strokeLinejoin=\'round\'><polyline points=\'6 9 12 15 18 9\'></polyline></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 18px center", backgroundSize: "16px"}}>
                    <option value="spontane">Candidature spontanée</option>
                    <option value="journaliste-mode">Journaliste de Mode & Art de Vivre</option>
                    <option value="concepteur-visuel">Concepteur Visuel / UX Designer</option>
                    <option value="redacteur-culture">Rédacteur Culture & Société</option>
                </select>
            </div>
            
            <div className="form-group">
                <label className="form-label">CV & Portfolio (Fichier requis)</label>
                <div className="drag-drop-zone">
                    <input type="file" required id="portfolio-file" />
                    <span style={{fontSize: "32px", display: "block", marginBottom: "12px", color: "#8B002A"}}>📎</span>
                    <span style={{fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--color-text)"}} id="file-label-main">Glissez votre CV ou cliquez pour parcourir</span>
                    <span style={{fontSize: "11px", color: "var(--color-text-muted)"}} id="file-label-sub">PDF, DOCX, ZIP jusqu'à 15 Mo</span>
                </div>
            </div>
            
            <div className="form-group">
                <label className="form-label">Zone de message libre</label>
                <textarea className="form-input" style={{minHeight: "150px", resize: "vertical"}} placeholder="Partagez-nous votre parcours, votre vision artistique ou vos motivations..."></textarea>
            </div>
            
            <button type="submit" className="btn-submit">Envoyer la candidature</button>
        </form>
    </div>

    <script dangerouslySetInnerHTML={{ __html: `
        // Pre-select job based on URL parameter
        const params = new URLSearchParams(window.location.search);
        const poste = params.get('poste');
        if (poste) {
            const select = document.getElementById('poste-select');
            if (select) {
                select.value = poste;
            }
        }

        function updateFileLabel(input) {
            const labelMain = document.getElementById('file-label-main');
            const labelSub = document.getElementById('file-label-sub');
            if (input.files && input.files.length > 0) {
                labelMain.innerText = "Fichier sélectionné :";
                labelSub.innerText = input.files[0].name + " (" + (input.files[0].size / 1024 / 1024).toFixed(2) + " Mo)";
                labelSub.style.color = "#8B002A";
            } else {
                labelMain.innerText = "Glissez votre CV ou cliquez pour parcourir";
                labelSub.innerText = "PDF, DOCX, ZIP jusqu'à 15 Mo";
                labelSub.style.color = "var(--color-text-muted)";
            }
        }
    ` }} />
    </main>
  );
}
