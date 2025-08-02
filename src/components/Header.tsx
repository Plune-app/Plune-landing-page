import React from 'react';
import { Download } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="relative z-10 w-full px-6 py-8">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-zinc-500 to-zinc-700 dark:from-zinc-400 dark:to-zinc-600 rounded-lg"></div>
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Plune.app</span>
        </div>
        
        <button className="px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download App</span>
        </button>
      </nav>
    </header>
  );
};