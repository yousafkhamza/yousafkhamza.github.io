# Yousaf K Hamza - DevOps Engineer Portfolio

A modern, responsive portfolio website showcasing my expertise in DevOps, Cloud Engineering, and Infrastructure Automation. Built with cutting-edge web technologies and featuring an interactive terminal experience.

## 🚀 Features

- **Responsive Design** - Mobile-first approach ensuring perfect display across all devices
- **Interactive Terminal** - Unique command-line interface to explore my profile
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Dark/Light Mode** - Theme toggle for optimal viewing experience
- **Performance Optimized** - Fast loading with modern build tools
- **Accessibility** - WCAG compliant with proper semantic markup

## 🛠️ Tech Stack

- **Frontend Framework** - React 18 with TypeScript
- **Build Tool** - Vite for lightning-fast development
- **Styling** - Tailwind CSS with custom design system
- **UI Components** - Radix UI with shadcn/ui
- **Animations** - CSS animations and transitions
- **Icons** - Lucide React icon library
- **Deployment** - GitHub Pages

## 📋 Prerequisites

- **Node.js** 18+ or **Bun** runtime
- **Git** for version control
- **Modern browser** with ES6+ support

## 🚀 Quick Start

### Using npm (Node.js 18+ required)

```bash
# Clone the repository
git clone https://github.com/yousafkhamza/yousafkhamza.github.io.git

# Navigate to project directory
cd yousafkhamza.github.io

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Using Bun (Recommended)

```bash
# Clone the repository
git clone https://github.com/yousafkhamza/yousafkhamza.github.io.git

# Navigate to project directory
cd yousafkhamza.github.io

# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## 📱 Development

### Available Scripts

| Command         | npm               | Bun               | Description              |
| --------------- | ----------------- | ----------------- | ------------------------ |
| **Development** | `npm run dev`     | `bun run dev`     | Start development server |
| **Build**       | `npm run build`   | `bun run build`   | Build for production     |
| **Preview**     | `npm run preview` | `bun run preview` | Preview production build |
| **Lint**        | `npm run lint`    | `bun run lint`    | Run ESLint checks        |

### Development Server

The development server runs on `http://localhost:8080` with:

- **Hot Module Replacement** - Instant updates without page refresh
- **TypeScript Support** - Real-time type checking
- **CSS Live Reload** - Instant style updates

## 🏗️ Project Structure

```
├── public/                 # Static assets
│   ├── resume.pdf         # Download resume
│   └── *.png             # Company logos & icons
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── contact/      # Contact form components
│   │   └── *.tsx         # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── pages/            # Page components
├── tailwind.config.ts    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Project dependencies
```

## 🎨 Key Components

- **Hero Section** - Interactive introduction with typewriter effect
- **About** - Professional summary with interactive terminal
- **Experience** - Career timeline with detailed descriptions
- **Skills** - Technical expertise with proficiency levels
- **Certifications** - Professional certifications and achievements
- **Contact** - Contact form with social links

## 🔧 Customization

### Theme Configuration

- Edit `tailwind.config.ts` for design system customization
- Modify color scheme in `src/index.css`
- Update component styling in respective `.tsx` files

### Content Updates

- Personal information: `src/components/Hero.tsx`
- Professional experience: `src/components/Experience.tsx`
- Skills and certifications: `src/components/Skills.tsx` & `src/components/Certifications.tsx`

## 🚀 Deployment

### GitHub Pages (Automatic)

This repository is configured for automatic deployment to GitHub Pages on every push to the main branch.

### Manual Deployment

```bash
# Build the project
npm run build  # or bun run build

# Deploy to GitHub Pages
# (Files are automatically deployed from the dist/ folder)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration** - Modern portfolio best practices
- **Development Platform** - Built with [Lovable](https://lovable.dev) for rapid prototyping
- **UI Components** - [shadcn/ui](https://ui.shadcn.com/) component library
- **Icons** - [Lucide](https://lucide.dev/) icon library

## 📞 Contact

**Yousaf K Hamza**  
DevOps Engineer | Cloud Architect

- **Portfolio** - [yousafkhamza.github.io](https://yousafkhamza.github.io)
- **LinkedIn** - [linkedin.com/in/yousafkhamza](https://linkedin.com/in/yousafkhamza)
- **GitHub** - [github.com/yousafkhamza](https://github.com/yousafkhamza)
- **Email** - Available through portfolio contact form

---

⭐ Star this repository if you found it helpful!
