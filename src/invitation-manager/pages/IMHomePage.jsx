import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Edit, Eye, Trash2, CalendarDays, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const IMHomePage = () => {
  const [invitations, setInvitations] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedInvitations = JSON.parse(localStorage.getItem('invitations')) || [];
    const sortedInvitations = storedInvitations.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    setInvitations(sortedInvitations);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this invitation?")) {
      const updatedInvitations = invitations.filter(inv => inv.id !== id);
      localStorage.setItem('invitations', JSON.stringify(updatedInvitations));
      setInvitations(updatedInvitations);
      toast({
        title: "Invitation Deleted",
        description: "The invitation has been successfully deleted.",
        variant: "destructive",
      });
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pastel-purple-dark">My Invitations</h1>
        <Button asChild className="bg-pastel-green hover:bg-pastel-green-dark text-white">
          <Link to="/invitation-manager/add">
            <PlusCircle className="w-5 h-5 mr-2" /> Add New Invitation
          </Link>
        </Button>
      </div>

      {invitations.length === 0 ? (
        <div className="text-center py-12">
          <CalendarDays className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">No invitations yet.</p>
          <p className="text-gray-500">Click "Add New Invitation" to get started!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((inv, index) => (
            <motion.div
              key={inv.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className="p-6">
                {inv.imagePreview && (
                  <img  
                    src={inv.imagePreview} 
                    alt={inv.eventTitle || "Invitation image"} 
                    className="w-full h-40 object-cover rounded-md mb-4"
                   src="https://images.unsplash.com/photo-1647470224867-92f9075aca1d" />
                )}
                <h2 className="text-xl font-semibold text-pastel-purple-dark mb-2">{inv.eventTitle || 'Untitled Event'}</h2>
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-pastel-pink" /> {inv.dateTime ? new Date(inv.dateTime).toLocaleString() : 'No date'}</p>
                  <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-pastel-pink" /> {inv.address || 'No address'}</p>
                  {inv.hostName && <p>Host: {inv.hostName}</p>}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild className="border-pastel-green text-pastel-green hover:bg-pastel-green hover:text-white">
                    <Link to={`/invitation-manager/event/${inv.id}`}><Eye className="w-4 h-4 mr-1" /> View</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="border-pastel-yellow text-pastel-yellow hover:bg-pastel-yellow hover:text-white">
                    <Link to={`/invitation-manager/edit/${inv.id}`}><Edit className="w-4 h-4 mr-1" /> Edit</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(inv.id)} className="border-red-400 text-red-500 hover:bg-red-500 hover:text-white">
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default IMHomePage;