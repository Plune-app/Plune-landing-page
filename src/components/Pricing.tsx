import React from 'react';
import { Check, Star, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 'R$ 0',
    period: '/month',
    description: 'Perfect for getting started',
    icon: Star,
    features: [
      '2 users per organization',
      '5 forms',
      '2 templates',
      'Basic support',
      'Community access'
    ],
    gradient: 'from-zinc-500/20 to-zinc-600/20',
    buttonStyle: 'bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md text-zinc-900 dark:text-zinc-100 border border-white/20 dark:border-zinc-700/50 hover:bg-white/20 dark:hover:bg-zinc-800/50',
    popular: false
  },
  {
    name: 'Platinum',
    price: 'R$ 15',
    period: '/month',
    description: 'For growing teams and businesses',
    icon: Crown,
    features: [
      '10 users per organization',
      '20 forms linked to organization',
      '15 templates',
      'Priority support',
      'Advanced integrations',
      'Custom branding',
      'Analytics dashboard'
    ],
    gradient: 'from-yellow-500/20 to-orange-500/20',
    buttonStyle: 'bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 text-white hover:shadow-xl',
    popular: true
  },
  {
    name: 'Diamond',
    price: 'R$ 25',
    period: '/month',
    description: 'For large enterprises and advanced teams',
    icon: Crown,
    features: [
      '30 users per organization',
      '60 forms linked to organization',
      '50 templates',
      'AI integration',
      'Priority support',
      'Advanced integrations',
      'Custom branding',
      'Analytics dashboard',
      'Dedicated account manager'
    ],
    gradient: 'from-blue-500/20 to-purple-500/20',
    buttonStyle: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl',
    popular: false
  }
];

export const Pricing: React.FC = () => {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          Choose Your
          <span className="block bg-gradient-to-r from-zinc-600 to-zinc-800 dark:from-zinc-400 dark:to-zinc-600 bg-clip-text text-transparent">
            Perfect Plan
          </span>
        </h2>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
          Start free and scale as your business grows
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative group p-8 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md rounded-2xl border border-white/20 dark:border-zinc-700/50 hover:bg-white/20 dark:hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              plan.popular ? 'ring-2 ring-zinc-400 dark:ring-zinc-600' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <plan.icon className="w-8 h-8 text-zinc-700 dark:text-zinc-300" />
            </div>
            
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              {plan.name}
            </h3>
            
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              {plan.description}
            </p>
            
            <div className="flex items-baseline mb-8">
              <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                {plan.price}
              </span>
              <span className="text-zinc-600 dark:text-zinc-400 ml-2">
                {plan.period}
              </span>
            </div>
            
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            
            <button className={`w-full px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 font-semibold ${plan.buttonStyle}`}>
              {plan.name === 'Free' ? 'Get Started Free' : 'Start Free Trial'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          All plans include 30-day free trial • No credit card required
        </p>
        <div className="flex items-center justify-center space-x-8 text-sm text-zinc-500 dark:text-zinc-500">
          <span>✓ Cancel anytime</span>
          <span>✓ Secure payments</span>
          <span>✓ 24/7 support</span>
        </div>
      </div>
    </section>
  );
};