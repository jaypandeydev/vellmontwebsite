import React from 'react';
import { Outlet } from 'react-router-dom';
import IMNavbar from '@/invitation-manager/components/IMNavbar';

const InvitationManagerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-pastel-blue-light text-gray-800">
      <IMNavbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-pastel-purple text-white text-center p-4">
        <p>&copy; {new Date().getFullYear()} Invitation Card Manager by Vellmont Services</p>
      </footer>
    </div>
  );
};

export default InvitationManagerLayout;