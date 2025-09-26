# Lovable Frontend

React frontend application for the Lovable AI-powered no-code web app builder.

## Features

- **Modern React Setup**: Vite + React + TypeScript
- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile-first approach
- **Component Library**: Reusable UI components
- **Real-time Updates**: Socket.IO integration
- **AI Integration**: Component generation interface

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp ../.env.example .env.local
   # Fill in your API keys
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── App.jsx        # Main application component
```

## Key Components

- **Header**: Navigation and user menu
- **Footer**: Site links and information
- **HomePage**: Landing page with features
- **EditorPage**: AI component generation interface
- **ProjectsPage**: Project management dashboard

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe public key

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Contributing

1. Follow the existing code style
2. Use TypeScript for new components
3. Add tests for new features
4. Update documentation as needed