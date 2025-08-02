import React from 'react';
import { 
  GitBranch, 
  FileText, 
  Zap, 
  Users, 
  Globe, 
  Settings 
} from 'lucide-react';

const features = [
  {
    icon: GitBranch,
    title: 'Visual Node Connections',
    description: 'Build complex business workflows with intuitive drag-and-drop node connections. Visualize your entire process flow.',
    gradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    icon: FileText,
    title: 'No-Code Forms',
    description: 'Create sophisticated forms without writing a single line of code. Dynamic fields, validation, and conditional logic included.',
    gradient: 'from-green-500/20 to-emerald-500/20'
  },
  {
    icon: Zap,
    title: 'External API Integration',
    description: 'Connect seamlessly with your existing tools and services. RESTful APIs, webhooks, and real-time data synchronization.',
    gradient: 'from-yellow-500/20 to-orange-500/20'
  },
  {
    icon: Users,
    title: 'Team Organizations',
    description: 'Create and manage organizations for your teams. Role-based permissions, collaborative workflows, and centralized control.',
    gradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    icon: Globe,
    title: 'Subdomain Export',
    description: 'Deploy your forms and workflows to custom subdomains. White-label solutions for your clients and partners.',
    gradient: 'from-indigo-500/20 to-blue-500/20'
  },
  {
    icon: Settings,
    title: 'Enterprise Management',
    description: 'Comprehensive business flow management with analytics, monitoring, and optimization tools for peak performance.',
    gradient: 'from-red-500/20 to-rose-500/20'
  }
];

export const CTA: React.FC = () => {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          Powerful Features for
          <span className="block bg-gradient-to-r from-zinc-600 to-zinc-800 dark:from-zinc-400 dark:to-zinc-600 bg-clip-text text-transparent">
            Modern Businesses
          </span>
        </h2>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
          Everything you need to streamline your workflows and boost productivity
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group p-8 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md rounded-2xl border border-white/20 dark:border-zinc-700/50 hover:bg-white/20 dark:hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className="w-8 h-8 text-zinc-700 dark:text-zinc-300" />
            </div>
            
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              {feature.title}
            </h3>
            
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};