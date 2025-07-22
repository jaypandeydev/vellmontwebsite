import React from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import LandingPage from '@/pages/LandingPage';
import ContactPage from '@/pages/ContactPage';
import MarrySmartAIPage from '@/pages/MarrySmartAIPage';
import GlowzyPage from '@/pages/GlowzyPage';
import CourtMatePage from '@/pages/CourtMatePage';

import InvitationManagerLayout from '@/invitation-manager/components/InvitationManagerLayout';
import IMHomePage from '@/invitation-manager/pages/IMHomePage';
import IMAddInvitationPage from '@/invitation-manager/pages/IMAddInvitationPage';
import IMEditInvitationPage from '@/invitation-manager/pages/IMEditInvitationPage';
import IMEventDetailsPage from '@/invitation-manager/pages/IMEventDetailsPage';

function App() {
  const { toast } = useToast();
  const location = useLocation();

  const handleGetStarted = () => {
    toast({
      title: "Welcome to Vellmont Services! 🚀",
      description: "Let's build something amazing together!",
    });
  };

  const companyName = "Vellmont Services OPC Pvt Ltd";
  const navbarLogoUrl = "https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png";
  const footerLogoUrl = "https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png";

  const isInvitationManagerRoute = location.pathname.startsWith('/invitation-manager');
  const showMainNavbarAndFooter = !isInvitationManagerRoute;

  return (
    <div className="min-h-screen text-white overflow-x-hidden gradient-bg">
      {showMainNavbarAndFooter && <Navbar companyName={companyName} logoUrl={navbarLogoUrl} onGetStarted={handleGetStarted} />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage companyName={companyName} logoUrl={navbarLogoUrl} />} />
          <Route path="/contact" element={<ContactPage companyName={companyName} />} />
          <Route path="/products/marrysmartai" element={<MarrySmartAIPage logoUrl={navbarLogoUrl} />} />
          <Route path="/products/glowzy" element={<GlowzyPage logoUrl={navbarLogoUrl} />} />
          <Route path="/products/courtmate" element={<CourtMatePage logoUrl={navbarLogoUrl} />} />
          
          <Route path="/invitation-manager" element={<InvitationManagerLayout />}>
            <Route index element={<IMHomePage />} />
            <Route path="add" element={<IMAddInvitationPage />} />
            <Route path="edit/:id" element={<IMEditInvitationPage />} />
            <Route path="event/:id" element={<IMEventDetailsPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
      {showMainNavbarAndFooter && <Footer companyName={companyName} logoUrl={footerLogoUrl} />}
      <Toaster />
    </div>
  );
}

export default App;