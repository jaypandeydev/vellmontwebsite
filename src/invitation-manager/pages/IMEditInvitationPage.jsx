import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvitationForm from '@/invitation-manager/components/InvitationForm';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const IMEditInvitationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const storedInvitations = JSON.parse(localStorage.getItem('invitations')) || [];
    const invitationToEdit = storedInvitations.find(inv => inv.id === id);
    if (invitationToEdit) {
      setInitialData(invitationToEdit);
    } else {
      toast({
        title: "Error",
        description: "Invitation not found.",
        variant: "destructive",
      });
      navigate('/invitation-manager');
    }
  }, [id, navigate, toast]);

  if (!initialData) {
    return <div className="text-center py-10">Loading invitation details...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-pastel-purple-dark mb-6">Edit Invitation</h1>
      <InvitationForm initialData={initialData} isEditing={true} />
    </motion.div>
  );
};

export default IMEditInvitationPage;