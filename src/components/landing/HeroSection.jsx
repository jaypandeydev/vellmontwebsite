import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const HeroSection = ({ companyName, tagline, description, onGetStarted, onContactSales, logoUrl }) => {
  return (
    <section className="pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-effect text-sm">
              <img src={logoUrl} alt={`${companyName} logo`} className="h-12 w-auto mr-3" />
              Trusted by leading businesses
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {tagline}
              <span className="gradient-text block">with {companyName}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6 glow-effect pulse-glow"
            >
              Explore Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={onContactSales}
              variant="outline" 
              size="lg" 
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white text-lg px-8 py-6"
            >
              Request a Quote
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="pt-12">
            <img    
              className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl glow-effect floating-animation" 
              alt={`${companyName} dashboard showcasing software solutions and SaaS products`} 
              src="https://images.unsplash.com/photo-1651009188116-bb5f80eaf6aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;