import { NextResponse } from 'next/server';
import { dbUpsertUser, dbUpsertMember, dbGetUserByEmail } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, name, email, password, phone, avatar, plan } = body || {};

    const userEmail = (email || '').trim().toLowerCase();
    if (!userEmail || !userEmail.includes('@')) {
      return NextResponse.json({ success: false, error: "Adresse email invalide" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 });
    }

    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim() || 'Nouveau Membre';
    const selectedPlan = plan || 'Essentiel';

    // 1. Direct persistence in SQLite database: users table (for authentication & security roles)
    const userRole = userEmail.includes('admin@dona.com') ? 'Super-Admin' : 'USER';
    const savedUser = dbUpsertUser({
      name: fullName,
      email: userEmail,
      password: password,
      role: userRole,
      status: 'Actif',
      plan: selectedPlan,
      phone: phone || '',
      avatar: avatar || null
    });

    // 2. Direct persistence in SQLite database: members table (for circle subscription management)
    const savedMember = dbUpsertMember({
      name: fullName,
      email: userEmail,
      phone: phone || '',
      avatar: avatar || null,
      plan: selectedPlan,
      status: 'Active',
      joined: new Date().toLocaleDateString('fr-FR'),
      password: password
    });

    console.log(`[DB Registration] Directly created new user & member in SQLite: ${fullName} (${userEmail})`);

    return NextResponse.json({
      success: true,
      message: "Utilisateur enregistré directement dans la base de données",
      user: savedUser,
      member: savedMember
    });
  } catch (error) {
    console.error("POST /api/signup error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
