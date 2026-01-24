# Vellmont Services Website

**Redefining the standard, delivering excellence**

A modern, responsive website for Vellmont Services, built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern React Application** - Built with React 18 and Vite for optimal performance
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Interactive UI** - Smooth animations with Framer Motion
- **Multiple Product Pages** - MarrySmartAI, Glowzy, CourtMate, and Invitation Manager
- **Contact System** - Integrated contact forms and business information
- **SEO Optimized** - Proper meta tags and semantic HTML structure

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: Radix UI, Lucide React
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite
- **Deployment**: Docker + Nginx

## 🏗️ Project Structure

```
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── landing/      # Landing page components
│   │   └── ui/           # Base UI components
│   ├── pages/            # Page components
│   ├── invitation-manager/ # Invitation Manager module
│   ├── lib/              # Utility functions
│   └── App.jsx           # Main application component
├── public/               # Static assets
├── Dockerfile           # Production container
├── docker-compose.yml   # Container orchestration
└── nginx.conf          # Nginx configuration
```

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Development

```bash
# Run development environment
docker-compose --profile dev up

# Run production environment
docker-compose up
```

## 🐳 Docker Deployment

### Build and Run

```bash
# Build the Docker image
docker build -t vellmont-website .

# Run the container
docker run -p 3000:80 vellmont-website
```

### Using Docker Compose

```bash
# Production deployment
docker-compose up -d

# Development with hot reload
docker-compose --profile dev up
```

## 🌐 Deployment to Coolify

This project is configured for deployment using Coolify on Hostinger VPS.

### Prerequisites

1. Coolify installed on your Hostinger VPS
2. GitHub repository connected to Coolify
3. Domain configured (optional)

### Deployment Steps

1. **Connect Repository**: Link this GitHub repository to your Coolify instance
2. **Configure Build**: Coolify will automatically detect the Dockerfile
3. **Set Environment**: Configure any necessary environment variables
4. **Deploy**: Coolify will build and deploy automatically

### Coolify Configuration

The project includes:
- `Dockerfile` for production builds
- `coolify.yml` for Coolify-specific configuration
- Health checks for monitoring
- Nginx configuration for optimal performance

## 📱 Features Overview

### Landing Page
- Hero section with company branding
- Services showcase
- Pricing information
- Client testimonials
- Contact call-to-action

### Product Pages
- **MarrySmartAI**: AI-powered matchmaking platform
- **Glowzy**: Beauty and wellness solutions
- **CourtMate**: Legal case management system
- **Invitation Manager**: Digital invitation creation tool

### Contact System
- Contact form with validation
- Business information display
- Social media integration
- Location and contact details

## 🎨 Design System

The website uses a custom design system built on Tailwind CSS:

- **Colors**: Deep space blue theme with purple accents
- **Typography**: Modern, readable font hierarchy
- **Components**: Consistent UI components with hover effects
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first responsive design

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
VITE_API_URL=your_api_url_here
VITE_CONTACT_EMAIL=support@vellmontservices.com
```

### Build Configuration

The project uses Vite with custom configuration:
- Path aliases (`@/` points to `src/`)
- Custom plugins for development
- Optimized build settings
- PostCSS with Tailwind CSS

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: Optimized with code splitting
- **Loading Speed**: Fast initial load with lazy loading
- **SEO**: Semantic HTML and meta tags
- **Accessibility**: WCAG 2.1 compliant

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

© 2026 Vellmont Services. All rights reserved.

## 📞 Support

For support and inquiries:
- **Website**: [vellmontservices.com](https://vellmontservices.com)
- **Email**: support@vellmontservices.com
- **Phone**: +91-XXXXXXXXXX

---

**Vellmont Services** - *Redefining the standard, delivering excellence*
