import { NextResponse } from 'next/server';
import { dbGetOrderById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { orderId } = resolvedParams;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Identifiant de commande manquant.' },
        { status: 400 }
      );
    }

    const order = dbGetOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Commande introuvable.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order
    });
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération de la commande.' },
      { status: 500 }
    );
  }
}
