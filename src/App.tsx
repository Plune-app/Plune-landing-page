import { useState } from 'react';
import { SEOHead } from './components/SEOHead';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { Downloads } from './components/Downloads';
import { Demo } from './components/Demo';
import { Router } from './routes/index.routes';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'downloads'>('home');

  const handleDownloadsClick = () => {
    setCurrentPage('downloads');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}

export default App;