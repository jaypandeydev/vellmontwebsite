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
          <motion.div variants={fadeInUp} className="space-y-6">
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-effect text-sm font-medium">
              <img src={logoUrl} alt={`${companyName} logo`} className="h-8 w-auto mr-3" />
              <span className="text-purple-400">Trusted by leading businesses</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight max-w-6xl mx-auto">
              <span className="block mb-4">{tagline.replace(/,/g, ' ')}</span>
              <span className="gradient-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">with {companyName}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
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

          <motion.div variants={fadeInUp} className="pt-16">
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
