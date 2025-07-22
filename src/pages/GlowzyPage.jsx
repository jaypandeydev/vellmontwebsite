import React from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, CreditCard, Users, MapPin, Sparkles, Scissors, Sun } from 'lucide-react';
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
    icon: <CalendarClock className="w-10 h-10 text-pink-400" />,
    title: "Schedule Your Visit",
    description: "Easily book appointments for your favorite beauty and salon services at your preferred time and location."
  },
  {
    icon: <CreditCard className="w-10 h-10 text-pink-400" />,
    title: "Online Payments",
    description: "Secure and hassle-free online payment options for all your bookings. Pay in advance and enjoy a seamless experience."
  },
  {
    icon: <Users className="w-10 h-10 text-pink-400" />,
    title: "Manage Memberships",
    description: "Keep track of your salon memberships, loyalty points, and exclusive offers all in one place."
  },
  {
    icon: <MapPin className="w-10 h-10 text-pink-400" />,
    title: "Find Nearby Salons",
    description: "Discover top-rated salons and beauty parlors near you with our smart location-based search."
  }
];

const GlowzyPage = ({ logoUrl }) => {
  const { toast } = useToast();

  const handleLearnMore = () => {
    toast({
      title: "Glowzy Coming Soon! ✨",
      description: "Get ready to book your glam sessions with ease. Sign up for updates!",
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
            <Scissors className="w-16 h-16 text-pink-400 mx-auto animate-pulse" />
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Glowzy
            <span className="gradient-text block text-4xl md:text-5xl mt-2">
              Your Beauty & Salon Companion
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover, book, and manage all your beauty and salon appointments effortlessly with Glowzy.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button
              onClick={handleLearnMore}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-lg px-10 py-7 glow-effect pulse-glow"
            >
              Discover Glowzy <Sun className="ml-2 w-5 h-5" />
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
              Features to Make You
              <span className="gradient-text block">Shine & Sparkle</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore how Glowzy simplifies your beauty routine and connects you with the best salons.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {productFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-effect p-8 rounded-2xl hover:glow-effect transition-all duration-300 group flex items-start space-x-6"
              >
                <div className="flex-shrink-0 bg-pink-500/20 p-4 rounded-lg group-hover:scale-110 transition-transform duration-300">
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
            Ready to Glow Up?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Glowzy is launching soon! Be the first to experience seamless salon bookings.
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
              alt="Glowzy app interface showing salon booking options and map" src="https://images.unsplash.com/photo-1633681926019-03bd9325ec20" />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default GlowzyPage;