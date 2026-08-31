import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'lib', 'applications_db.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'cv');

function readApplicationsDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, '[]', 'utf8');
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error('[applications_db] Erreur lecture applications_db.json:', e);
    return [];
  }
}

function writeApplicationsDB(applications) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(applications, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('[applications_db] Erreur écriture applications_db.json:', e);
    return false;
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const fullName = formData.get('fullName') || '';
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || '';
    const jobTarget = formData.get('jobTarget') || 'spontane';
    const message = formData.get('message') || '';
    const file = formData.get('file');

    if (!fullName || !email || !file) {
      return NextResponse.json(
        { error: 'Nom complet, adresse email et fichier de CV/Portfolio sont obligatoires.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
    }

    // ─── 1. TÉLÉVERSEMENT ET SAUVEGARDE DU FICHIER SUR LE SERVEUR ───────────────
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const fileBytes = await file.arrayBuffer();
    const buffer = Buffer.from(fileBytes);

    const timestamp = Date.now();
    const originalName = file.name || 'cv.pdf';
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const savedFileName = `${timestamp}_${sanitizedName}`;
    const filePathOnDisk = path.join(UPLOAD_DIR, savedFileName);

    await fs.promises.writeFile(filePathOnDisk, buffer);

    const fileSizeMb = (buffer.length / 1024 / 1024).toFixed(2);
    const publicFilePath = `/uploads/cv/${savedFileName}`;

    // ─── 2. SAUVEGARDE EN BASE DE DONNÉES SERVEUR ──────────────────────────────
    const now = new Date();
    const appId = `CAND-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newApplication = {
      id: appId,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      jobTarget: jobTarget.trim(),
      message: message.trim(),
      cvFileName: originalName,
      cvSavedName: savedFileName,
      cvFilePath: publicFilePath,
      fileSizeMb,
      status: 'En attente d\'examen',
      appliedAt: now.toISOString(),
      dateFormatted: now.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    const apps = readApplicationsDB();
    apps.unshift(newApplication);
    writeApplicationsDB(apps);

    console.log(`[Recrutement API] Nouvelle candidature enregistrée: ${fullName} (${appId}) - Fichier: ${publicFilePath}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Candidature et document enregistrés avec succès sur le serveur DONA MAGAZINE.',
        application: newApplication,
      },
      { status: 201 }
    );

  } catch (err) {
    console.error('[POST /api/recrutement] Erreur:', err);
    return NextResponse.json(
      { error: 'Erreur serveur lors du téléversement du fichier.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const apps = readApplicationsDB();
    return NextResponse.json({ success: true, total: apps.length, applications: apps });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
