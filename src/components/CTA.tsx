import React from 'react';
import { Download, ArrowRight, Github } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
      <div className="text-center p-12 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md rounded-3xl border border-white/20 dark:border-zinc-700/50">
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          Ready to Transform
          <span className="block bg-gradient-to-r from-zinc-600 to-zinc-800 dark:from-zinc-400 dark:to-zinc-600 bg-clip-text text-transparent">
            Your Workflows?
          </span>
        </h2>
        
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
          Join thousands of businesses already using Plune.app to streamline their operations
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 text-white rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 text-lg font-semibold">
            <Download className="w-5 h-5" />
            <span>Download for Desktop</span>
          </button>
          
          <a 
            href="https://github.com/LuscaCid/plune.app/releases" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md text-zinc-900 dark:text-zinc-100 rounded-lg border border-white/20 dark:border-zinc-700/50 hover:bg-white/20 dark:hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105 flex items-center space-x-2 text-lg font-semibold"
          >
            <Github className="w-5 h-5" />
            <span>View on GitHub</span>
          </a>
          
          <button className="px-8 py-4 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md text-zinc-900 dark:text-zinc-100 rounded-lg border border-white/20 dark:border-zinc-700/50 hover:bg-white/20 dark:hover:bg-zinc-800/50 transition-all duration-300 flex items-center space-x-2 text-lg font-semibold">
            <span>Learn More</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-zinc-500 dark:text-zinc-500">
          <span>✓ Free 30-day trial</span>
          <span>✓ No credit card required</span>
          <span>✓ Full feature access</span>
        </div>
      </div>
    </section>
  );
};