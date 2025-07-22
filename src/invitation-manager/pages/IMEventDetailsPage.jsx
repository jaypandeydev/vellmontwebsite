import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, User, Edit, ArrowLeft, Bell, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

const IMEventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitation, setInvitation] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const storedInvitations = JSON.parse(localStorage.getItem('invitations')) || [];
    const foundInvitation = storedInvitations.find(inv => inv.id === id);
    if (foundInvitation) {
      setInvitation(foundInvitation);
      setNotes(foundInvitation.notes || '');
    } else {
      toast({
        title: "Error",
        description: "Invitation not found.",
        variant: "destructive",
      });
      navigate('/invitation-manager');
    }
  }, [id, navigate, toast]);

  const handleSaveNotes = () => {
    if (!invitation) return;
    const updatedInvitation = { ...invitation, notes };
    const storedInvitations = JSON.parse(localStorage.getItem('invitations')) || [];
    const updatedInvitations = storedInvitations.map(inv => 
      inv.id === id ? updatedInvitation : inv
    );
    localStorage.setItem('invitations', JSON.stringify(updatedInvitations));
    setInvitation(updatedInvitation);
    toast({
      title: "Notes Saved",
      description: "Your notes have been successfully saved.",
    });
  };
  
  const handleSetReminder = () => {
    if (!invitation || !invitation.dateTime) {
      toast({ title: "Cannot set reminder", description: "Event date and time not set.", variant: "destructive"});
      return;
    }
    
    const eventDate = new Date(invitation.dateTime);
    const now = new Date();

    if (eventDate <= now) {
      toast({ title: "Cannot set reminder", description: "Event has already passed.", variant: "destructive"});
      return;
    }

    // Simplified: In a real app, this would use Notification API or a service worker
    // For now, just a toast message
    toast({
      title: "Reminder Set (Simulated)",
      description: `You'll be reminded for "${invitation.eventTitle}" 1 day and 2 hours before the event.`,
    });
    // Example: setTimeout for 2 hours before
    // const twoHoursBefore = eventDate.getTime() - now.getTime() - (2 * 60 * 60 * 1000);
    // if (twoHoursBefore > 0) {
    //   setTimeout(() => {
    //     new Notification(`Reminder: ${invitation.eventTitle}`, { body: 'Event starts in 2 hours!' });
    //   }, twoHoursBefore);
    // }
  };


  if (!invitation) {
    return <div className="text-center py-10">Loading event details...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl"
    >
      <Button variant="ghost" onClick={() => navigate('/invitation-manager')} className="mb-6 text-pastel-purple-dark hover:bg-pastel-pink-light">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
      </Button>

      {invitation.imagePreview && (
        <img  
            src={invitation.imagePreview} 
            alt={invitation.eventTitle || "Invitation image"} 
            className="w-full h-64 object-contain rounded-lg mb-6 border border-pastel-blue"
         src="https://images.unsplash.com/photo-1520679189651-cee43b71b663" />
      )}

      <h1 className="text-4xl font-bold text-pastel-purple-dark mb-4">{invitation.eventTitle || 'Untitled Event'}</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6 text-gray-700">
        <div className="flex items-start">
          <CalendarDays className="w-6 h-6 mr-3 text-pastel-pink mt-1" />
          <div>
            <span className="font-semibold">Date & Time:</span>
            <p>{invitation.dateTime ? new Date(invitation.dateTime).toLocaleString() : 'Not specified'}</p>
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="w-6 h-6 mr-3 text-pastel-pink mt-1" />
          <div>
            <span className="font-semibold">Address:</span>
            <p>{invitation.address || 'Not specified'}</p>
            {invitation.address && (
              <a 
                href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(invitation.address)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-pastel-green hover:underline"
              >
                View on OpenStreetMap
              </a>
            )}
          </div>
        </div>
        {invitation.hostName && (
          <div className="flex items-start">
            <User className="w-6 h-6 mr-3 text-pastel-pink mt-1" />
            <div>
              <span className="font-semibold">Host:</span>
              <p>{invitation.hostName}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-pastel-purple-dark mb-2 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-pastel-yellow" /> Notes
        </h2>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any personal notes for this event..."
          className="bg-pastel-blue-extralight border-pastel-blue focus:border-pastel-green"
          rows={4}
        />
        <Button onClick={handleSaveNotes} className="mt-2 bg-pastel-green hover:bg-pastel-green-dark text-white">Save Notes</Button>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <Button asChild className="bg-pastel-yellow hover:bg-pastel-yellow-dark text-white w-full sm:w-auto">
          <Link to={`/invitation-manager/edit/${id}`}>
            <Edit className="w-5 h-5 mr-2" /> Edit Invitation
          </Link>
        </Button>
        <Button onClick={handleSetReminder} className="bg-pastel-pink hover:bg-pastel-pink-dark text-white w-full sm:w-auto">
          <Bell className="w-5 h-5 mr-2" /> Set Reminder (Simulated)
        </Button>
      </div>

      <div className="mt-8 border-t border-pastel-blue pt-6">
        <h3 className="text-lg font-semibold text-pastel-purple-dark mb-2">Map Location (Placeholder)</h3>
        <div className="bg-pastel-blue-extralight h-64 rounded-lg flex items-center justify-center text-gray-500">
          <MapPin className="w-12 h-12 mr-2" />
          <p>Map integration will show here.</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">Actual map requires API integration (e.g., OpenStreetMap or Google Maps).</p>
      </div>

    </motion.div>
  );
};

export default IMEventDetailsPage;