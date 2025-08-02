import { SEOHead } from './components/SEOHead';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Pricing } from './components/Pricing';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { Demo } from './components/Demo';

function App() {
  return (
    <ThemeProvider>
      <SEOHead />
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 transition-colors duration-500">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-zinc-200/30 to-transparent dark:from-zinc-800/30 dark:to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-zinc-300/20 to-transparent dark:from-zinc-700/20 dark:to-transparent rounded-full blur-3xl"></div>
        </div>

        <ThemeToggle />
        <Header />
        <Hero />
        <CTA />
        <Demo />
        <Pricing />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;