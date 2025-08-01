import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md rounded-full border border-white/20 dark:border-zinc-700/50 mb-8">
          <Zap className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Next-generation workflow management
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 leading-tight">
          Transform Your
          <span className="block bg-gradient-to-r from-zinc-600 to-zinc-800 dark:from-zinc-400 dark:to-zinc-600 bg-clip-text text-transparent">
            Business Workflows
          </span>
        </h1>
        
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          Streamline your enterprise operations with visual node-based workflows, 
          no-code forms, and seamless API integrations. Built for modern teams.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 text-white rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 text-lg font-semibold">
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button className="px-8 py-4 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md text-zinc-900 dark:text-zinc-100 rounded-lg border border-white/20 dark:border-zinc-700/50 hover:bg-white/20 dark:hover:bg-zinc-800/50 transition-all duration-300 text-lg font-semibold">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
};