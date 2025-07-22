import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

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

const testimonialsData = [
  {
    quote: "Vellmont Services delivered a robust e-commerce platform that exceeded our expectations. Their team is professional and highly skilled.",
    author: "Aaron John",
    role: "CEO",
    company: "GlobalMart Inc.",
    avatar: "Smiling businessman in a suit, diverse background"
  },
  {
    quote: "The SaaS product from Vellmont has revolutionized our project management. It's intuitive, powerful, and has saved us countless hours.",
    author: "Jane Smith",
    role: "Operations Director",
    company: "Innovate Solutions Ltd.",
    avatar: "Confident businesswoman in a modern office, creative professional"
  },
  {
    quote: "Working with Vellmont on our custom AI solution was a game-changer. Their expertise in machine learning is unparalleled.",
    author: "Alex Johnson",
    role: "CTO",
    company: "FutureTech Corp.",
    avatar: "Young tech entrepreneur, casual attire, startup environment"
  }
];

const TestimonialsSection = ({ companyName }) => {
  return (
    <section id="testimonials" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted by
            <span className="gradient-text block">Industry Leaders</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Hear what our clients say about their experience with {companyName}.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonialsData.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="glass-effect p-8 rounded-2xl hover:glow-effect transition-all duration-300"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <img   
                  className="w-12 h-12 rounded-full mr-4" 
                  alt={`${testimonial.author} profile photo, ${testimonial.avatar}`}
                  src="https://images.unsplash.com/photo-1649399045831-40bfde3ef21d" />
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;