import { NextResponse } from 'next/server';
import { dbCreateOrder, dbGetOrders, dbGetOrdersByEmail } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      plan,
      planName,
      billingCycle,
      subtotal,
      tax,
      discount,
      promoCode,
      total,
      currency,
      paymentMethod,
      cardBrand,
      cardLast4,
      billingAddress,
    } = body;

    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { success: false, error: 'Nom et adresse email requis pour la commande.' },
        { status: 400 }
      );
    }

    const order = dbCreateOrder({
      customerName,
      customerEmail,
      plan: plan || 'Premium',
      planName: planName || `Abonnement DONA — ${plan || 'Premium'}`,
      billingCycle: billingCycle || 'mensuel',
      subtotal: subtotal != null ? Number(subtotal) : undefined,
      tax: tax != null ? Number(tax) : undefined,
      discount: discount != null ? Number(discount) : 0,
      promoCode: promoCode || null,
      total: total != null ? Number(total) : 29.00,
      currency: currency || 'EUR',
      paymentMethod: paymentMethod || 'Carte bancaire',
      cardBrand: cardBrand || 'VISA',
      cardLast4: cardLast4 || '4242',
      billingAddress: billingAddress || '',
      status: 'Completed'
    });

    return NextResponse.json({
      success: true,
      order
    }, { status: 201 });
  } catch (err) {
    console.error('Error creating order in SQLite:', err);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la commande.' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    if (email) {
      const orders = dbGetOrdersByEmail(email);
      return NextResponse.json({ success: true, orders });
    }

    const orders = dbGetOrders(limit);
    return NextResponse.json({ success: true, orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des commandes.' },
      { status: 500 }
    );
  }
}
