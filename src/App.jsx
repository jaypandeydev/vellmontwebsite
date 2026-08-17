import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/pages/LandingPage';

// Everything except the landing page is code-split, so a first-time visitor
// only downloads the homepage bundle. The invitation-manager sub-app in
// particular is a large, separate surface most visitors never open.
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const DesignLibraryPage = lazy(() => import('@/pages/DesignLibraryPage'));

const InvitationManagerLayout = lazy(() =>
  import('@/invitation-manager/components/InvitationManagerLayout')
);
const IMHomePage = lazy(() => import('@/invitation-manager/pages/IMHomePage'));
const IMAddInvitationPage = lazy(() =>
  import('@/invitation-manager/pages/IMAddInvitationPage')
);
const IMEditInvitationPage = lazy(() =>
  import('@/invitation-manager/pages/IMEditInvitationPage')
);
const IMEventDetailsPage = lazy(() =>
  import('@/invitation-manager/pages/IMEventDetailsPage')
);

function App() {
  const location = useLocation();
  const isInvitationManagerRoute = location.pathname.startsWith('/invitation-manager');

  // Invitation Manager keeps its own legacy gradient theme; the redesigned
  // site is light-first (white canvas by default, dark via the theme toggle)
  // driven by the semantic tokens in index.css.
  const wrapperClass = isInvitationManagerRoute
    ? 'min-h-screen text-white overflow-x-clip gradient-bg'
    : 'min-h-screen bg-canvas text-ink overflow-x-clip font-sans antialiased';

  return (
    <div className={wrapperClass}>
      <AnimatePresence mode="wait">
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-brand-500" />
            </div>
          }
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/design-library" element={<DesignLibraryPage />} />

            <Route path="/invitation-manager" element={<InvitationManagerLayout />}>
              <Route index element={<IMHomePage />} />
              <Route path="add" element={<IMAddInvitationPage />} />
              <Route path="edit/:id" element={<IMEditInvitationPage />} />
              <Route path="event/:id" element={<IMEventDetailsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Toaster />
    </div>
  );
}

export default App;
