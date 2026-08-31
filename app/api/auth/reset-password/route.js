import { NextResponse } from 'next/server';
import { verifyResetToken, consumeResetToken, updateUserByEmail, hashPassword } from '@/lib/users_db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, email, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Jeton de réinitialisation et nouveau mot de passe requis." }, { status: 400 });
    }

    // 1. Vérification du token
    const tokenCheck = verifyResetToken(token);
    if (!tokenCheck.valid) {
      return NextResponse.json({ error: tokenCheck.reason }, { status: 400 });
    }

    const targetEmail = tokenCheck.email || email;

    // 2. Validation de la complexité
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit faire au moins 8 caractères." }, { status: 400 });
    }
    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins une lettre majuscule." }, { status: 400 });
    }
    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins un chiffre." }, { status: 400 });
    }

    // 3. Hachage et mise à jour dans users_db.json
    const passwordHash = hashPassword(newPassword);
    updateUserByEmail(targetEmail, { passwordHash });

    // 4. Consommer le jeton
    consumeResetToken(token);

    return NextResponse.json({
      success: true,
      message: "Votre mot de passe a été réinitialisé et haché avec succès en base. Vous pouvez désormais vous connecter.",
    });

  } catch (err) {
    console.error("[POST /api/auth/reset-password] Erreur:", err);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour." }, { status: 500 });
  }
}
