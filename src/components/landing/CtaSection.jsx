import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CtaSection = ({ title, description, onGetStarted, onContactSales }) => {
  return (
    <section className="py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center glass-effect p-12 rounded-3xl glow-effect"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          {title.split(' ').slice(0, -2).join(' ')}
          <span className="gradient-text block">{title.split(' ').slice(-2).join(' ')}</span>
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6 glow-effect"
          >
            Explore Our Solutions
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            onClick={onContactSales}
            variant="outline" 
            size="lg" 
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white text-lg px-8 py-6"
          >
            Discuss Your Project
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaSection;