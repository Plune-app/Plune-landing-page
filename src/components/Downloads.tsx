import React from 'react';
import { Download, Calendar, FileArchive, Shield, ArrowLeft } from 'lucide-react';

const releases = [
  {
    version: '2.1.0',
    date: '2025-01-15',
    size: '125 MB',
    type: 'Stable Release',
    description: 'Latest stable version with new AI integration features and improved performance.',
    downloadUrl: '#',
    changelog: [
      'Added AI-powered form suggestions',
      'Improved workflow performance by 40%',
      'Enhanced organization management',
      'Bug fixes and stability improvements'
    ],
    isLatest: true
  },
  {
    version: '2.0.3',
    date: '2025-01-08',
    size: '122 MB',
    type: 'Bug Fix Release',
    description: 'Critical bug fixes and security updates for version 2.0.',
    downloadUrl: '#',
    changelog: [
      'Fixed form validation issues',
      'Resolved workflow connection problems',
      'Security patches applied',
      'Performance optimizations'
    ],
    isLatest: false
  },
  {
    version: '2.0.0',
    date: '2024-12-20',
    size: '120 MB',
    type: 'Major Release',
    description: 'Major update with new features including visual workflow designer and team organizations.',
    downloadUrl: '#',
    changelog: [
      'New visual workflow designer',
      'Team organizations support',
      'Enhanced form builder',
      'API integration improvements',
      'New user interface design'
    ],
    isLatest: false
  },
  {
    version: '1.9.5',
    date: '2024-12-01',
    size: '115 MB',
    type: 'Legacy Release',
    description: 'Final version of the 1.x series with all accumulated improvements.',
    downloadUrl: '#',
    changelog: [
      'Final bug fixes for 1.x series',
      'Compatibility improvements',
      'Documentation updates',
      'Preparation for 2.0 migration'
    ],
    isLatest: false
  }
];

interface DownloadsProps {
  onBack: () => void;
}

export const Downloads: React.FC<DownloadsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 transition-colors duration-500">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-zinc-200/30 to-transparent dark:from-zinc-800/30 dark:to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-zinc-300/20 to-transparent dark:from-zinc-700/20 dark:to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md rounded-lg border border-white/20 dark:border-zinc-700/50 hover:bg-white/20 dark:hover:bg-zinc-800/50 transition-all duration-300 text-zinc-900 dark:text-zinc-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-zinc-500 to-zinc-700 dark:from-zinc-400 dark:to-zinc-600 rounded-lg"></div>
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Plune.app</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
            Download
            <span className="block bg-gradient-to-r from-zinc-600 to-zinc-800 dark:from-zinc-400 dark:to-zinc-600 bg-clip-text text-transparent">
              Plune.app for Windows
            </span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
            Get the latest version of Plune.app for Windows and start transforming your business workflows
          </p>
        </div>

        {/* System Requirements */}
        <div className="mb-12 p-6 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md rounded-2xl border border-white/20 dark:border-zinc-700/50">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            System Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100">OS:</strong> Windows 8 or later (64-bit)
            </div>
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100">RAM:</strong> 2 GB minimum, 6 GB recommended
            </div>
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100">Storage:</strong> 200 MB available space
            </div>
          </div>
        </div>

        {/* Releases */}
        <div className="space-y-6">
          {releases.map((release, index) => (
            <div
              key={index}
              className={`group p-8 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md rounded-2xl border border-white/20 dark:border-zinc-700/50 hover:bg-white/20 dark:hover:bg-zinc-800/50 transition-all duration-300 ${
                release.isLatest ? 'ring-2 ring-zinc-400 dark:ring-zinc-600' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 mb-6 lg:mb-0">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      Version {release.version}
                    </h3>
                    {release.isLatest && (
                      <span className="px-3 py-1 bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 text-white text-sm font-semibold rounded-full">
                        Latest
                      </span>
                    )}
                    <span className="px-3 py-1 bg-zinc-200/50 dark:bg-zinc-700/50 text-zinc-700 dark:text-zinc-300 text-sm rounded-full">
                      {release.type}
                    </span>
                  </div>
                  
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    {release.description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-zinc-500 dark:text-zinc-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(release.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileArchive className="w-4 h-4" />
                      <span>{release.size}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">What's New:</h4>
                    <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {release.changelog.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="lg:ml-8">
                  <button className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 text-white rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 text-lg font-semibold">
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Need help with installation? Check our documentation or contact support.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-zinc-500 dark:text-zinc-500">
            <span>✓ Free to download</span>
            <span>✓ Regular updates</span>
            <span>✓ 24/7 support</span>
          </div>
        </div>
      </div>
    </div>
  );
};