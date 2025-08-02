import React from 'react';
import { Download, ExternalLink, Pickaxe } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface HeaderProps {
  onDownloadsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onDownloadsClick }) => {
  return (
    <header className="relative z-10 w-full px-6 py-8">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex flex-col space-y-2 lg:flex-row items-start space-x-2">
          <main className='flex items-center gap-4 lg:gap-2'>
          <div className="w-8 h-8 bg-gradient-to-br from-zinc-500 to-zinc-700 dark:from-zinc-400 dark:to-zinc-600 rounded-lg"></div>
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Plune.app</span>

          </main>

          <Tooltip>
            <TooltipTrigger >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md rounded-full border border-white/20 dark:border-zinc-700/50 mb-8">
                <Pickaxe className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Pre-aplha
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              The entire application will be available for download soon
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex  flex-col lg:flex-row lg:items-start space-y-2 space-x-4">
          <button
            onClick={onDownloadsClick}
            className="px-6 py-3 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md text-zinc-900 dark:text-zinc-100 rounded-lg border border-white/20 dark:border-zinc-700/50 hover:bg-white/20 dark:hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Downloads</span>
          </button>

          <button className="px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Fow windows</span>
          </button>
        </div>
      </nav>
    </header>
  );
};