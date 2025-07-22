import React from 'react';
import { motion } from 'framer-motion';
import { Users, CalendarCheck, Bell, Shield, Sparkles, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const productFeatures = [
  {
    icon: <Users className="w-10 h-10 text-blue-400" />,
    title: "Delegate Routine Hearings",
    description: "Assign routine court appearances to qualified legal professionals through our platform, saving you time and resources."
  },
  {
    icon: <CalendarCheck className="w-10 h-10 text-blue-400" />,
    title: "Tracks Hearings",
    description: "Stay updated on all your case hearings with our automated tracking system. Never miss an important date."
  },
  {
    icon: <Bell className="w-10 h-10 text-blue-400" />,
    title: "Critical Presence Alerts",
    description: "Receive automatic alerts when your physical presence is absolutely critical for a hearing or court matter."
  },
  {
    icon: <Shield className="w-10 h-10 text-blue-400" />,
    title: "Secure & Confidential",
    description: "Your case information and communications are handled with the utmost security and confidentiality."
  }
];

const CourtMatePage = ({ logoUrl }) => {
  const { toast } = useToast();

  const handleLearnMore = () => {
    toast({
      title: "CourtMate Coming Soon! ⚖️",
      description: "Revolutionize your legal practice. Sign up for early access!",
    });
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
        <motion.section
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center mb-20"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <Briefcase className="w-16 h-16 text-blue-400 mx-auto animate-pulse" />
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            CourtMate
            <span className="gradient-text block text-4xl md:text-5xl mt-2">
              Your On-Demand Legal Appearance Manager
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            CourtMate is an innovative platform that manages your court appearances efficiently, allowing you to delegate routine hearings and focus on critical legal work.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button
              onClick={handleLearnMore}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-10 py-7 glow-effect pulse-glow"
            >
              Explore CourtMate <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.section>

        <motion.section
          id="product-features"
          className="py-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Intelligent Features for
              <span className="gradient-text block">Modern Legal Practice</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover how CourtMate streamlines court appearance management and enhances your productivity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {productFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-effect p-8 rounded-2xl hover:glow-effect transition-all duration-300 group flex items-start space-x-6"
              >
                <div className="flex-shrink-0 bg-blue-500/20 p-4 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="py-20 text-center"
        >
          <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Optimize Your Court Appearances?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            CourtMate is launching soon! Be among the first to transform your legal workflow.
          </p>
          <Button
            onClick={handleLearnMore}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-10 py-7 glow-effect"
          >
            Get Early Access <Briefcase className="ml-2 w-5 h-5" />
          </Button>
        </motion.section>
        
        <motion.div variants={fadeInUp} className="pt-12 text-center">
            <img  
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl glow-effect floating-animation" 
              alt="CourtMate dashboard showing case tracking and hearing delegation options" src="https://images.unsplash.com/photo-1558420488-0ed4bebf615d" />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default CourtMatePage;