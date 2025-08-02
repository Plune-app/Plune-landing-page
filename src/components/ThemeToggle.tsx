import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md border border-white/20 dark:border-zinc-700/50 transition-all duration-300 hover:bg-white/20 dark:hover:bg-zinc-800/50 hover:scale-110"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
      ) : (
        <Sun className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
      )}
    </button>
  );
};