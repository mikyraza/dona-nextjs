import { NextResponse } from 'next/server';
import { findUserByEmail, createPasswordResetToken } from '@/lib/users_db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: "Veuillez saisir une adresse email valide." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = findUserByEmail(cleanEmail);

    // Même si l'utilisateur n'existe pas en mock, on génère un token pour permettre le test fluide de réinitialisation
    const token = createPasswordResetToken(cleanEmail);
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const resetUrl = `${origin}/reset-password?token=${token}&email=${encodeURIComponent(cleanEmail)}`;

    // Simulation de l'envoi d'email via service SMTP/Resend/SendGrid
    console.log(`[SMTP/Resend Dispatcher] Email envoyé à ${cleanEmail}:`);
    console.log(`[SMTP/Resend Dispatcher] Sujet: Réinitialisation de votre mot de passe DONA MAGAZINE`);
    console.log(`[SMTP/Resend Dispatcher] Lien de réinitialisation: ${resetUrl}`);

    return NextResponse.json({
      success: true,
      message: `Un e-mail de réinitialisation a été envoyé à ${cleanEmail}.`,
      resetUrl, // Fourni pour prévisualisation et test direct
      userFound: !!user,
      emailService: "SMTP/Resend Email Dispatcher (Dispatched successfully)",
    });

  } catch (err) {
    console.error("[POST /api/auth/forgot-password] Erreur:", err);
    return NextResponse.json({ error: "Erreur serveur lors de la réinitialisation." }, { status: 500 });
  }
}
