import { useState } from 'react';
import { SEOHead } from './components/SEOHead';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Demo } from './components/Demo';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { Downloads } from './components/Downloads';

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
      <SEOHead />
      <ThemeToggle />
      
      {currentPage === 'home' ? (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 transition-colors duration-500">
          {/* Background decoration */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-zinc-200/30 to-transparent dark:from-zinc-800/30 dark:to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-zinc-300/20 to-transparent dark:from-zinc-700/20 dark:to-transparent rounded-full blur-3xl"></div>
          </div>
          
          <Header onDownloadsClick={handleDownloadsClick} />
          <Hero />
          <Features />
          <Demo />
          <Pricing />
          <Footer />
        </div>
      ) : (
        <Downloads onBack={handleBackToHome} />
      )}
    </ThemeProvider>
  );
}

export default App;