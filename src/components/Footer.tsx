import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-white/10 dark:border-zinc-800/30">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div className="w-6 h-6 bg-gradient-to-br from-zinc-500 to-zinc-700 dark:from-zinc-400 dark:to-zinc-600 rounded-lg"></div>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Plune.app</span>
        </div>
        
        <div className="flex items-center space-x-8 text-sm text-zinc-600 dark:text-zinc-400">
          <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Support
          </a>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-500">
        © 2025 Plune.app. All rights reserved.
      </div>
    </footer>
  );
};