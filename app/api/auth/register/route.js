import { NextResponse } from 'next/server';
import { readUsersDB, writeUsersDB, hashPassword } from '@/lib/users_db';

// ─── POST /api/auth/register ──────────────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, phone, plan, avatar } = body;

    // Validation serveur
    if (!email || !password || !firstName) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants : prénom, email, mot de passe.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit faire au moins 8 caractères.' },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins une majuscule.' },
        { status: 400 }
      );
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins un chiffre.' },
        { status: 400 }
      );
    }

    // Vérifier unicité email
    const users = readUsersDB();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cette adresse email existe déjà.' },
        { status: 409 }
      );
    }

    // Créer le compte
    const now = new Date();
    const newUser = {
      id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      firstName: firstName.trim(),
      lastName: (lastName || '').trim(),
      name: `${firstName.trim()} ${(lastName || '').trim()}`.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      phone: phone || '',
      avatar: avatar || null,
      plan: plan || 'Essentiel',
      status: 'Active',
      role: 'USER',
      createdAt: now.toISOString(),
      joinedAt: now.toLocaleDateString('fr-FR'),
      lastLoginAt: null,
    };

    users.unshift(newUser);
    const saved = writeUsersDB(users);

    if (!saved) {
      return NextResponse.json(
        { error: 'Erreur interne lors de la sauvegarde. Veuillez réessayer.' },
        { status: 500 }
      );
    }

    // Retourner le profil public (sans le hash de mot de passe)
    const { passwordHash, ...publicProfile } = newUser;

    return NextResponse.json(
      {
        success: true,
        message: 'Compte créé avec succès.',
        user: publicProfile,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/auth/register] Erreur inattendue:', err);
    return NextResponse.json(
      { error: 'Erreur serveur inattendue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}

// ─── GET /api/auth/register — liste des membres (admin only) ─────────────────
export async function GET(req) {
  try {
    const users = readUsersDB();
    // Masquer les hash de mots de passe dans la réponse
    const safeUsers = users.map(({ passwordHash, ...u }) => u);
    return NextResponse.json({ success: true, total: safeUsers.length, users: safeUsers });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
