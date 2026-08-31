import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'lib', 'contacts_db.json');

function readContactsDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, '[]', 'utf8');
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error('[contact_db] Erreur lecture contacts_db.json:', e);
    return [];
  }
}

function writeContactsDB(contacts) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(contacts, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('[contact_db] Erreur écriture contacts_db.json:', e);
    return false;
  }
}

// ─── POST /api/contact ────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, subject, message } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: 'Prénom, adresse email et message sont obligatoires.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
    }

    const now = new Date();
    const refId = `CNT-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newContact = {
      id: refId,
      firstName: firstName.trim(),
      lastName: (lastName || '').trim(),
      name: `${firstName.trim()} ${(lastName || '').trim()}`.trim(),
      email: email.toLowerCase().trim(),
      subject: subject || 'Autre demande',
      message: message.trim(),
      status: 'Nouveau',
      createdAt: now.toISOString(),
      dateFormatted: now.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    const contacts = readContactsDB();
    contacts.unshift(newContact);
    const saved = writeContactsDB(contacts);

    if (!saved) {
      return NextResponse.json(
        { error: 'Erreur interne lors de la sauvegarde du message.' },
        { status: 500 }
      );
    }

    console.log(`[Contact API] Nouveau message reçu de ${newContact.email} (${refId})`);

    return NextResponse.json(
      {
        success: true,
        message: 'Votre message a été transmis et enregistré avec succès auprès de la rédaction DONA.',
        contact: newContact,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/contact] Erreur:', err);
    return NextResponse.json(
      { error: 'Erreur serveur inattendue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}

// ─── GET /api/contact ─────────────────────────────────────────────────────────
export async function GET() {
  try {
    const contacts = readContactsDB();
    return NextResponse.json({ success: true, total: contacts.length, contacts });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
