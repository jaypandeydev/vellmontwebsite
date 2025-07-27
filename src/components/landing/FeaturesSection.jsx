import React from 'react';
import { motion } from 'framer-motion';
import { Code, Server, Brain, Globe, Shield, Users as UsersIcon, Scissors, Briefcase, Heart, Stethoscope } from 'lucide-react'; // Renamed Users to UsersIcon to avoid conflict
import { Link } from 'react-router-dom';

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

const servicesData = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Custom Software Development",
    description: "Tailored software solutions to meet your unique business requirements and drive growth."
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI & ML Solutions",
    description: "Leverage artificial intelligence and machine learning to unlock new insights and automate processes."
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Cloud Engineering",
    description: "Scalable and secure cloud infrastructure solutions to power your digital transformation."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Cybersecurity Services",
    description: "Protect your digital assets with our comprehensive cybersecurity and compliance services."
  },
  {
    icon: <UsersIcon className="w-8 h-8" />,
    title: "Dedicated Support",
    description: "Expert support and consultation to ensure your success every step of the way."
  }
];

const productsData = [
  {
    icon: <Server className="w-8 h-8" />,
    title: "General SaaS Suite",
    description: "Innovative SaaS products designed to streamline workflows and boost team productivity.",
    link: "/#pricing"
  },
  {
    icon: <Heart className="w-8 h-8 text-pink-400" />,
    title: "MarrySmartlyAI",
    description: "AI-powered wedding planning for your dream Indian wedding.",
    link: "https://marrysmartly.com",
    external: true
  },
  {
    icon: <Scissors className="w-8 h-8 text-rose-400" />,
    title: "Glowzy",
    description: "Booking & scheduling app for the beauty and salon industry.",
    link: "/products/glowzy"
  },
  {
    icon: <Briefcase className="w-8 h-8 text-blue-400" />,
    title: "CourtMate",
    description: "On-demand platform for managing court appearances.",
    link: "/products/courtmate"
  },
  {
    icon: <Stethoscope className="w-8 h-8 text-green-400" />,
    title: "AI-Powered Medical Queue Management",
    description: "Streamline patient flow and optimize healthcare operations.",
    link: "/products/medical-queue"
  }
];


const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our Core
            <span className="gradient-text block">Services</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Delivering excellence in software development to empower your business.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {servicesData.map((feature, index) => (
            <motion.div
              key={`service-${index}`}
              variants={fadeInUp}
              className="glass-effect p-8 rounded-2xl hover:glow-effect transition-all duration-300 group"
            >
              <div className="text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our Innovative
            <span className="gradient-text block">SaaS Products</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our suite of specialized SaaS solutions designed for various industries.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {productsData.map((product, index) => (
            <motion.div
              key={`product-${index}`}
              variants={fadeInUp}
              className="glass-effect p-8 rounded-2xl hover:glow-effect transition-all duration-300 group flex flex-col"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300 self-start">
                {product.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{product.title}</h3>
              <p className="text-gray-300 leading-relaxed flex-grow">{product.description}</p>
              {product.external ? (
                <a href={product.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-purple-400 hover:text-purple-300 font-medium self-start">
                  Learn More &rarr;
                </a>
              ) : (
                <Link to={product.link} className="mt-4 inline-block text-purple-400 hover:text-purple-300 font-medium self-start">
                  Learn More &rarr;
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturesSection;