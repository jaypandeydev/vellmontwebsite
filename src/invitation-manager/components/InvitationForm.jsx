import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, User, Image as ImageIcon, FileText, Save, Trash2, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const InvitationForm = ({ initialData, onSubmit, onDelete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: initialData?.id || Date.now().toString(),
    eventTitle: initialData?.eventTitle || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    address: initialData?.address || '',
    hostName: initialData?.hostName || '',
    notes: initialData?.notes || '',
    cardImage: initialData?.cardImage || null,
    imagePreview: initialData?.imagePreview || null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || Date.now().toString(),
        eventTitle: initialData.eventTitle || '',
        date: initialData.date || '',
        time: initialData.time || '',
        address: initialData.address || '',
        hostName: initialData.hostName || '',
        notes: initialData.notes || '',
        cardImage: initialData.cardImage || null,
        imagePreview: initialData.imagePreview || null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, cardImage: file, imagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.eventTitle || !formData.date || !formData.time || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Event Title, Date, Time, Address).",
        variant: "destructive",
      });
      return;
    }
    onSubmit(formData);
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6 p-6 md:p-8 bg-slate-800/30 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          {initialData ? 'Edit Invitation' : 'Add New Invitation'}
        </h2>
        <p className="text-slate-400">
          {initialData ? 'Update the details for your event.' : 'Capture the magic of your next event.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={formItemVariants} className="space-y-2">
          <Label htmlFor="eventTitle" className="text-slate-300 flex items-center"><FileText className="w-4 h-4 mr-2 text-pink-400"/>Event Title</Label>
          <Input id="eventTitle" name="eventTitle" value={formData.eventTitle} onChange={handleChange} placeholder="e.g., Rahul & Pooja's Wedding Reception" className="bg-slate-700/50 border-slate-600 focus:border-pink-500 text-white placeholder-slate-500" />
        </motion.div>

        <motion.div variants={formItemVariants} className="space-y-2">
          <Label htmlFor="hostName" className="text-slate-300 flex items-center"><User className="w-4 h-4 mr-2 text-pink-400"/>Host Name</Label>
          <Input id="hostName" name="hostName" value={formData.hostName} onChange={handleChange} placeholder="e.g., Mr. & Mrs. Sharma" className="bg-slate-700/50 border-slate-600 focus:border-pink-500 text-white placeholder-slate-500" />
        </motion.div>

        <motion.div variants={formItemVariants} className="space-y-2">
          <Label htmlFor="date" className="text-slate-300 flex items-center"><Calendar className="w-4 h-4 mr-2 text-pink-400"/>Date</Label>
          <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} className="bg-slate-700/50 border-slate-600 focus:border-pink-500 text-white placeholder-slate-500" />
        </motion.div>

        <motion.div variants={formItemVariants} className="space-y-2">
          <Label htmlFor="time" className="text-slate-300 flex items-center"><Clock className="w-4 h-4 mr-2 text-pink-400"/>Time</Label>
          <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} className="bg-slate-700/50 border-slate-600 focus:border-pink-500 text-white placeholder-slate-500" />
        </motion.div>
      </div>

      <motion.div variants={formItemVariants} className="space-y-2">
        <Label htmlFor="address" className="text-slate-300 flex items-center"><MapPin className="w-4 h-4 mr-2 text-pink-400"/>Address</Label>
        <Textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Venue Name, Street, City, State, Zip Code" className="bg-slate-700/50 border-slate-600 focus:border-pink-500 text-white placeholder-slate-500" rows={3}/>
      </motion.div>

      <motion.div variants={formItemVariants} className="space-y-2">
        <Label htmlFor="notes" className="text-slate-300 flex items-center"><FileText className="w-4 h-4 mr-2 text-pink-400"/>Notes</Label>
        <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="e.g., Dress code: Traditional, Gift registry link..." className="bg-slate-700/50 border-slate-600 focus:border-pink-500 text-white placeholder-slate-500" rows={3}/>
      </motion.div>

      <motion.div variants={formItemVariants} className="space-y-2">
        <Label htmlFor="cardImage" className="text-slate-300 flex items-center"><ImageIcon className="w-4 h-4 mr-2 text-pink-400"/>Invitation Card Image</Label>
        <div className="flex items-center space-x-4">
          <Input id="cardImage" name="cardImage" type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500/20 file:text-pink-400 hover:file:bg-pink-500/30 cursor-pointer" />
          <Button type="button" variant="outline" className="border-pink-500 text-pink-400 hover:bg-pink-500/20 hover:text-pink-300">
            <Camera className="w-4 h-4 mr-2"/> Scan
          </Button>
        </div>
        {formData.imagePreview && (
          <div className="mt-4">
            <img-replace src={formData.imagePreview} alt="Invitation preview" className="max-h-60 rounded-lg border border-slate-600 shadow-md" />
          </div>
        )}
      </motion.div>
      
      <motion.div variants={formItemVariants} className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
        {initialData && onDelete && (
          <Button type="button" variant="destructive" onClick={() => onDelete(formData.id)} className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        )}
        <Button type="button" variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white">
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
          <Save className="w-4 h-4 mr-2" /> {initialData ? 'Save Changes' : 'Add Invitation'}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default InvitationForm;