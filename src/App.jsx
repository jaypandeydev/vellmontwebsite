import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/pages/LandingPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsPage from '@/pages/TermsPage';

import InvitationManagerLayout from '@/invitation-manager/components/InvitationManagerLayout';
import IMHomePage from '@/invitation-manager/pages/IMHomePage';
import IMAddInvitationPage from '@/invitation-manager/pages/IMAddInvitationPage';
import IMEditInvitationPage from '@/invitation-manager/pages/IMEditInvitationPage';
import IMEventDetailsPage from '@/invitation-manager/pages/IMEventDetailsPage';

function App() {
  const location = useLocation();
  const isInvitationManagerRoute = location.pathname.startsWith('/invitation-manager');

  // Invitation Manager keeps its own legacy gradient theme; the redesigned
  // site is now dark by default (deep near-black with subtle blue tint).
  const wrapperClass = isInvitationManagerRoute
    ? 'min-h-screen text-white overflow-x-hidden gradient-bg'
    : 'min-h-screen bg-[#050816] text-neutral-100 overflow-x-hidden font-sans antialiased';

  return (
    <div className={wrapperClass}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          <Route path="/invitation-manager" element={<InvitationManagerLayout />}>
            <Route index element={<IMHomePage />} />
            <Route path="add" element={<IMAddInvitationPage />} />
            <Route path="edit/:id" element={<IMEditInvitationPage />} />
            <Route path="event/:id" element={<IMEventDetailsPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <Toaster />
    </div>
  );
}

export default App;
