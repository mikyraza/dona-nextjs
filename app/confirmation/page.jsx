import React from 'react';
import { dbGetOrderById, dbGetOrders } from '@/lib/db';
import ConfirmationClient from './ConfirmationClient';

export const dynamic = 'force-dynamic';

export default async function ConfirmationPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const refParam = resolvedSearchParams?.ref;
  const planParam = resolvedSearchParams?.plan || 'premium';

  let initialOrder = null;
  if (refParam) {
    initialOrder = dbGetOrderById(refParam);
  }

  if (!initialOrder) {
    const recent = dbGetOrders(1);
    if (recent && recent.length > 0) {
      initialOrder = recent[0];
    }
  }

  return (
    <ConfirmationClient
      refParam={refParam}
      planParam={planParam}
      initialOrder={initialOrder}
    />
  );
}
