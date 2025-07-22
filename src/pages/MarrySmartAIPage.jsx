import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CalendarDays, Users, Mail, Sparkles, Heart, Gift } from 'lucide-react';
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
    icon: <DollarSign className="w-10 h-10 text-purple-400" />,
    title: "Smart Budget Planning",
    description: "AI-powered tools to help you create, track, and manage your wedding budget efficiently, ensuring you stay on track without stress."
  },
  {
    icon: <CalendarDays className="w-10 h-10 text-purple-400" />,
    title: "Event Scheduling",
    description: "Seamlessly organize all your wedding-related events, from pre-wedding ceremonies to the big day, with smart reminders and timelines."
  },
  {
    icon: <Users className="w-10 h-10 text-purple-400" />,
    title: "Vendor Management",
    description: "Keep track of all your vendors, contracts, payments, and communications in one centralized place. Find and compare top vendors."
  },
  {
    icon: <Mail className="w-10 h-10 text-purple-400" />,
    title: "Invitation Creator",
    description: "Design beautiful, personalized digital and print-ready wedding invitations with our easy-to-use creator. Manage RSVPs effortlessly."
  }
];

const MarrySmartAIPage = () => {
  const { toast } = useToast();

  const handleLearnMore = () => {
    toast({
      title: "MarrySmartAI Coming Soon! 💍",
      description: "Get ready to plan your dream wedding with AI. Sign up for updates!",
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
            <Sparkles className="w-16 h-16 text-pink-400 mx-auto animate-pulse" />
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            MarrySmartAI
            <span className="gradient-text block text-4xl md:text-5xl mt-2">
              Plan Your Perfect Indian Wedding
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            AI-powered planning for the wedding of your dreams. MarrySmartAI simplifies every step, making your journey to "I do" joyful and stress-free.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button
              onClick={handleLearnMore}
              size="lg"
              className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-lg px-10 py-7 glow-effect pulse-glow"
            >
              Learn More & Sign Up <Heart className="ml-2 w-5 h-5" />
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
              Features That Make
              <span className="gradient-text block">Your Wedding Magical</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover how MarrySmartAI's intelligent tools can transform your wedding planning experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {productFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-effect p-8 rounded-2xl hover:glow-effect transition-all duration-300 group flex items-start space-x-6"
              >
                <div className="flex-shrink-0 bg-purple-500/20 p-4 rounded-lg group-hover:scale-110 transition-transform duration-300">
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
          <Gift className="w-16 h-16 text-yellow-400 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Planning Your Dream Wedding?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            MarrySmartAI is launching soon! Be the first to experience the future of wedding planning.
          </p>
          <Button
            onClick={handleLearnMore}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-10 py-7 glow-effect"
          >
            Get Early Access <Sparkles className="ml-2 w-5 h-5" />
          </Button>
        </motion.section>
        
        <motion.div variants={fadeInUp} className="pt-12 text-center">
            <img 
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl glow-effect floating-animation" 
              alt="MarrySmartAI dashboard preview showing wedding planning interface with budget, schedule, and vendor lists" src="https://images.unsplash.com/photo-1663000801741-dc54aa41a39b" />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default MarrySmartAIPage;