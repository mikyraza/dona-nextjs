"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import PersistentPlayer from './PersistentPlayer';
import BackgroundSync from '../common/BackgroundSync';
import SubscriptionSimulatorBar from '../SubscriptionSimulatorBar';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main>{children}</main>;
  }

  return (
    <>
      <BackgroundSync />
      <Header />
      <main>{children}</main>
      <Footer />
      <PersistentPlayer />
      <SubscriptionSimulatorBar />
    </>
  );
}
