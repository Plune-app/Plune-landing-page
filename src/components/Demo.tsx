import React from 'react';
import { Image, LucideIcon, Monitor, Play } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  Icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, Icon, gradientFrom, gradientTo }) => {
  return (
    <div className="group">
      <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 text-center">
        {title}
      </h4>
      <div className="bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md rounded-2xl border border-white/20 dark:border-zinc-700/50 overflow-hidden hover:bg-white/20 dark:hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105">
        <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-zinc-200/30 to-zinc-300/30 dark:from-zinc-800/30 dark:to-zinc-700/30">
          <div className="text-center">
            <div
              className={`w-16 h-16 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="w-8 h-8 text-zinc-700 dark:text-zinc-300" />
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Screenshot placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Demo: React.FC = () => {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          See Plune.app
          <span className="block bg-gradient-to-r from-zinc-600 to-zinc-800 dark:from-zinc-400 dark:to-zinc-600 bg-clip-text text-transparent">
            In Action
          </span>
        </h2>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
          Explore the powerful features and intuitive interface of our workflow management platform
        </p>
      </div>

      {/* Video Demo Section */}
      <div className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
            Product Demo Video
          </h3>
          <div className="relative group bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md rounded-2xl border border-white/20 dark:border-zinc-700/50 overflow-hidden hover:bg-white/20 dark:hover:bg-zinc-800/50 transition-all duration-300">
            <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-zinc-200/30 to-zinc-300/30 dark:from-zinc-800/30 dark:to-zinc-700/30">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-zinc-500/20 to-zinc-600/20 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-10 h-10 text-zinc-700 dark:text-zinc-300 ml-1" />
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                  Demo video will be added here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          title="Organization Management"
          Icon={Monitor}
          gradientFrom="from-blue-500/20"
          gradientTo="to-cyan-500/20"
        />
        <FeatureCard
          title="Form Builder Interface"
          Icon={Image}
          gradientFrom="from-green-500/20"
          gradientTo="to-emerald-500/20"
        />
        <FeatureCard
          title="Visual Workflow Designer"
          Icon={Monitor}
          gradientFrom="from-purple-500/20"
          gradientTo="to-pink-500/20"
        />
        <FeatureCard
          title="Advanced Form Controls"
          Icon={Image}
          gradientFrom="from-yellow-500/20"
          gradientTo="to-orange-500/20"
        />
        <FeatureCard
          title="Forms Management Dashboard"
          Icon={Monitor}
          gradientFrom="from-indigo-500/20"
          gradientTo="to-blue-500/20"
        />
          <FeatureCard
            title="Conditional Logic Builder"
            Icon={Image}
            gradientFrom="from-red-500/20"
            gradientTo="to-rose-500/20"
          />
      </div>
    </section>
  );
};
