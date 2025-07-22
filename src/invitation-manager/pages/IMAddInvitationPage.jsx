import React from 'react';
import InvitationForm from '@/invitation-manager/components/InvitationForm';
import { motion } from 'framer-motion';

const IMAddInvitationPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-pastel-purple-dark mb-6">Add New Invitation</h1>
      <InvitationForm />
    </motion.div>
  );
};

export default IMAddInvitationPage;