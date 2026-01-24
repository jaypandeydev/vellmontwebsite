import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const ContactPage = ({ companyName }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Uh oh! Something is missing.",
        description: "Please fill out all fields in the contact form.",
        variant: "destructive",
      });
      return;
    }
    // Simulate form submission
    console.log("Form submitted:", formData);
    toast({
      title: "Message Sent! 🚀",
      description: "Thanks for reaching out! We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit={{ opacity: 0, y: -20 }}
      variants={fadeInUp}
      className="pt-32 pb-20 px-6 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
            Get In Touch
            <span className="gradient-text block">With {companyName}</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We're here to help and answer any question you might have. We look forward to hearing from you!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div variants={fadeInUp} className="space-y-8 glass-effect p-8 rounded-2xl">
            <div>
              <h2 className="text-3xl font-semibold mb-6 gradient-text">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-8 h-8 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-medium mb-2">Our Offices</h3>
                    <p className="text-gray-300">VELLMONT IT SERVICES L.L.C</p>
                    <p className="text-gray-300">Building Name/No Rigga Business Centre-3001</p>
                    <p className="text-gray-300">Land Area - Al Murqabat Plot No - 466-0</p>
                    <p className="text-gray-300">Dubai UAE</p>
                    <a 
                      href="https://maps.app.goo.gl/fUaPtF2UWsYZ3KWUA"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors mt-1 inline-block mb-4"
                    >
                      View on Map
                    </a>
                    <br></br>
                    <p className="text-gray-300">Vellmont Services OPC PVT Ltd</p>
                    <p className="text-gray-300">WeWork Rajapushpa Summit, SY. 130P & 115/1P</p>
                    <p className="text-gray-300">Financial District,Nanakramguda Rd,Manikonda Jagir</p>
                    <p className="text-gray-300">Rangareddy Dist.,Hyderabad, Telangana 500032 INDIA</p>
                    <a 
                      href="https://maps.app.goo.gl/GmkTFXkzesuFMvsM9"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors mt-1 inline-block"
                    >
                      View on Map
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="w-8 h-8 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-medium">Email Us</h3>
                    <a href="mailto:support@vellmontservices.com" className="text-gray-300 hover:text-purple-300 transition-colors block">
                      support@vellmontservices.com
                    </a>
                    <a href="mailto:finance@vellmontservices.com" className="text-gray-300 hover:text-purple-300 transition-colors block mt-1">
                      finance@vellmontservices.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-8 h-8 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-medium">Call Us </h3>
                    <p className="text-gray-300">+971 547594261 (Dubai-UAE)</p>
                    <p className="text-gray-300">+91 8143210000 (Hyderabad-India)</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-xl font-medium mb-3">Business Hours</h3>
              <p className="text-gray-300">Monday - Friday: 9 AM - 6 PM </p>
              <p className="text-gray-300">Saturday - Sunday: Closed</p>
            </div>
          </motion.div>

          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="space-y-6 glass-effect p-8 rounded-2xl"
          >
            <h2 className="text-3xl font-semibold mb-6 gradient-text">Send Us A Message</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <Input type="text" name="name" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="bg-background/50 border-white/20 focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <Input type="email" name="email" id="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="bg-background/50 border-white/20 focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
              <Input type="text" name="subject" id="subject" placeholder="How can we help?" value={formData.subject} onChange={handleChange} className="bg-background/50 border-white/20 focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
              <Textarea name="message" id="message" rows={4} placeholder="Your message..." value={formData.message} onChange={handleChange} className="bg-background/50 border-white/20 focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow-effect">
              Send Message <Send className="ml-2 w-5 h-5" />
            </Button>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;