import { NextResponse } from 'next/server';
import { findUserByEmail, updateUserByEmail, hashPassword, verifyPassword } from '@/lib/users_db';

export async function PUT(req) {
  try {
    const body = await req.json();
    const { email, firstName, lastName, phone, avatar, currentPassword, newPassword } = body;

    if (!email) {
      return NextResponse.json({ error: "L'adresse email est requise." }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé en base." }, { status: 404 });
    }

    const updates = {};

    if (firstName !== undefined) updates.firstName = firstName.trim();
    if (lastName !== undefined) updates.lastName = lastName.trim();
    if (firstName || lastName) {
      updates.name = `${firstName || user.firstName} ${lastName || user.lastName}`.trim();
    }
    if (phone !== undefined) updates.phone = phone.trim();
    if (avatar !== undefined) updates.avatar = avatar;

    // ─── MODIFICATION DU MOT DE PASSE (N°14) ──────────────────────────────────
    if (newPassword) {
      // Si l'utilisateur avait un mot de passe et a fourni un mot de passe actuel, on le vérifie
      if (user.passwordHash && currentPassword) {
        const isValidCurrent = verifyPassword(currentPassword, user.passwordHash);
        if (!isValidCurrent) {
          return NextResponse.json({ error: "Le mot de passe actuel est incorrect." }, { status: 400 });
        }
      }

      // Valider la complexité du nouveau mot de passe
      if (newPassword.length < 8) {
        return NextResponse.json({ error: "Le nouveau mot de passe doit comporter au moins 8 caractères." }, { status: 400 });
      }
      if (!/[A-Z]/.test(newPassword)) {
        return NextResponse.json({ error: "Le nouveau mot de passe doit contenir au moins une lettre majuscule." }, { status: 400 });
      }
      if (!/[0-9]/.test(newPassword)) {
        return NextResponse.json({ error: "Le nouveau mot de passe doit contenir au moins un chiffre." }, { status: 400 });
      }

      // Hachage sécurisé et mise à jour du mot de passe en base serveur
      updates.passwordHash = hashPassword(newPassword);
    }

    const updatedUser = updateUserByEmail(email, updates);

    if (!updatedUser) {
      return NextResponse.json({ error: "Erreur lors de la mise à jour du profil en base." }, { status: 500 });
    }

    const { passwordHash, ...publicUser } = updatedUser;

    return NextResponse.json({
      success: true,
      message: newPassword 
        ? "Profil et mot de passe mis à jour avec succès dans votre compte serveur !" 
        : "Profil mis à jour avec succès !",
      user: publicUser,
    });
  } catch (err) {
    console.error("[PUT /api/auth/profile] Erreur:", err);
    return NextResponse.json({ error: "Erreur serveur inattendue." }, { status: 500 });
  }
}
