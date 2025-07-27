import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, CalendarDays, Bell, MapPin, LayoutDashboard } from 'lucide-react';

const PlanCard = ({ plan, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { delay: index * 0.2, duration: 0.5 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`glass-effect p-8 rounded-xl shadow-2xl flex flex-col ${plan.featured ? 'border-2 border-purple-500 pulse-glow' : 'border border-white/20'}`}
    >
      <div className="mb-6">
        <h3 className="text-3xl font-bold gradient-text mb-2">{plan.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
        {plan.price ? (
          <p className="text-5xl font-extrabold mb-1">
            {plan.price}
            {plan.period && <span className="text-lg font-normal text-gray-400">/{plan.period}</span>}
          </p>
        ) : (
          <p className={`text-3xl font-extrabold mb-1 text-purple-400 ${plan.comingSoon ? 'pulse-glow-stronger' : ''}`}>{plan.priceText || "Coming Soon"}</p>
        )}
      </div>
      <ul className="space-y-3 mb-8 text-gray-300 flex-grow">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start">
            {feature.icon ? React.createElement(feature.icon, { className: "w-5 h-5 text-purple-400 mr-3 mt-1 flex-shrink-0" }) : <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />}
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
      {plan.comingSoon ? (
        plan.external ? (
          <Button asChild className="w-full mt-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3">
            <a href={plan.ctaLink} target="_blank" rel="noopener noreferrer">{plan.ctaText || "Get Started"}</a>
          </Button>
        ) : (
          <Button
              disabled
              className="w-full mt-auto bg-gray-700 hover:bg-gray-600 text-gray-400 cursor-not-allowed transition-colors duration-300"
              aria-label={`${plan.name} is coming soon`}
          >
            Coming Soon
          </Button>
        )
      ) : (
        <Button asChild className="w-full mt-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3">
          <Link to={plan.ctaLink || "#"}>{plan.ctaText || "Get Started"}</Link>
        </Button>
      )}
    </motion.div>
  );
};

const PricingSection = () => {
  const plans = [
    {
      name: 'MarrySmartlyAI',
      description: 'AI-powered Indian wedding planning. Simplify your dream wedding.',
      priceText: 'Coming Soon',
      features: [
        { icon: CheckCircle, text: 'Smart Budget Planning' },
        { icon: CheckCircle, text: 'Intelligent Event Scheduling' },
        { icon: CheckCircle, text: 'Vendor Management Hub' },
        { icon: CheckCircle, text: 'AI Invitation Creator' },
        { icon: CheckCircle, text: 'Guest List Organizer' },
      ],
      ctaText: 'Visit Website',
      ctaLink: 'https://marrysmartly.com',
      comingSoon: true,
      featured: true,
      external: true,
    },
    {
      name: 'Glowzy',
      description: 'Booking & scheduling for beauty and salon professionals.',
      priceText: 'Coming Soon',
      features: [
        { icon: CheckCircle, text: 'Easy Appointment Scheduling' },
        { icon: CheckCircle, text: 'Online Payment Processing' },
        { icon: CheckCircle, text: 'Membership Management' },
        { icon: CheckCircle, text: 'Nearby Salon Finder' },
        { icon: CheckCircle, text: 'Client Database' },
      ],
      ctaText: 'Learn More',
      ctaLink: '/products/glowzy',
      comingSoon: true,
    },
    {
      name: 'CourtMate',
      description: 'On-demand court appearance management for legal professionals.',
      priceText: 'Coming Soon',
      features: [
        { icon: CheckCircle, text: 'Delegate Routine Hearings' },
        { icon: CheckCircle, text: 'Real-time Hearing Tracker' },
        { icon: CheckCircle, text: 'Critical Presence Alerts' },
        { icon: CheckCircle, text: 'Secure Document Handling' },
        { icon: CheckCircle, text: 'Case Management Integration' },
      ],
      ctaText: 'Discover Features',
      ctaLink: '/products/courtmate',
      comingSoon: true,
    },
    {
      name: 'AI-Powered Medical Queue Management',
      description: 'Streamline patient flow and optimize healthcare operations.',
      priceText: 'Coming Soon',
      features: [
        { icon: CheckCircle, text: 'Appointment Request System' },
        { icon: CheckCircle, text: 'Patient Queue Management' },
        { icon: CheckCircle, text: 'Doctor Dashboard' },
        { icon: CheckCircle, text: 'Patient Notifications' },
        { icon: CheckCircle, text: 'Patient Record Keeping' },
        { icon: CheckCircle, text: 'Receptionist/Admin Panel' },
        { icon: CheckCircle, text: 'Registration via WhatsApp' },
        { icon: CheckCircle, text: 'Real-Time Doctor Availability Status' },
      ],
      ctaText: 'Learn More',
      ctaLink: '/products/medical-queue',
      comingSoon: true,
    },
    {
      name: 'Invitation Manager',
      description: 'Organize all your event invitations in one smart place.',
      priceText: 'Available Now',
      features: [
        { icon: LayoutDashboard, text: 'Visual Card Dashboard' },
        { icon: CalendarDays, text: 'Calendar Sync (Google/Device)' },
        { icon: Bell, text: 'Smart Event Reminders' },
        { icon: MapPin, text: 'Map View for Destinations' },
        { icon: CheckCircle, text: 'OCR for Card Data Extraction' },
      ],
      ctaText: 'Visit Website',
      ctaLink: 'https://invitesync.com',
      comingSoon: false,
      external: true,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="gradient-text">Flexible Plans</span> for Every Need
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect Vellmont solution to power your business or personal projects. Transparent pricing, unmatched value.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <PlanCard key={index} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;