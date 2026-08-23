import { Link } from 'react-router';
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Bell, 
  Bot, 
  Briefcase, 
  Rocket, 
  Gift, 
  Megaphone, 
  ArrowLeftRight,
  Sparkles,
  Users,
  Crown
} from 'lucide-react';

const features = [
  
  {
    icon: BookOpen,
    title: 'Foundation Course',
    description: 'Master the fundamentals of Forex and Crypto trading. Learn market structure, analysis techniques, and the core FXDC methodology.',
    category: 'Education',
    href: '/education',
    internal: true,
  },
  {
    icon: Crown,
    title: 'Masterclass Program',
    description:
      'Discover the new level of Institutional grade technical trading approach and more comprehensive learning strategy method.',
    category: 'Education',
    href: '/education',
    internal: true,
  },
  {
    icon: Trophy,
    title: 'Advance Program',
    description:
      'The Advanced Program is an elite technical framework designed to take you beyond basic retail patterns. Master market microstructure, order flow mechanics, and institutional liquidity profiling to execute with high-probability precision.',
    category: 'Education',
    href: '/education',
    internal: true,
  },
  {
    icon: Trophy,
    title: 'Enhancement Program',
    description: 'Soon to Come — Early Access Program',
    category: 'Education',
    href: '/education',
    internal: true,
    badge: 'Coming soon',
  },
  {
    icon: GraduationCap,
    title: 'Live Trading Workshops',
    description: 'Join real-time trading sessions with expert mentors. Watch, learn, and trade alongside professionals in live market conditions.',
    category: 'Education',
    highlight: true,
    href: '/education',
    internal: true,
  },
  
  {
    icon: Bot,
    title: 'Automated Trading Service CEX - MT5',
    description:
      'Fully automated trading bots that helps you configure, optimize & analyze with high precision trading set-up within particular financial instruments. By our expert a.i algorithmic, we deploy backtested and live account data record for consistent profitable results 24/5 or 24/7 via MT5 or CEX.',
    category: 'Trading Tools',
    href: '/trading-tools',
    internal: true,
  },
  {
    icon: Bell,
    title: 'Trading Signals',
    description: 'Get free daily signals plus exclusive VIP alerts with precise entry, stop-loss, and take-profit levels from our analysis team.',
    category: 'Trading Tools',
    highlight: true,
    href: '/trading-tools',
    internal: true,
  },
  {
    icon: Briefcase,
    title: 'Account Management',
    description: 'Let our experienced traders manage your capital. Professional AUM services with transparent reporting and competitive returns.',
    category: 'Asset Management',
    href: '/trading-tools',
    internal: true,
  },
  {
    icon: Rocket,
    title: 'Web3 Incubator',
    description: 'Launch your blockchain project with our sandbox program. Access incubation, acceleration, and mentorship for Web3 startups.',
    category: 'Web3 Services',
  },
  {
    icon: Gift,
    title: 'Airdrop Alerts',
    description: 'Never miss profitable airdrops. Our Crypto-as-a-Service keeps you informed about the best opportunities in the ecosystem.',
    category: 'Web3 Services',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    description: 'Campaign-as-a-Service for crypto projects. Full-stack marketing solutions to amplify your project\'s reach and engagement.',
    category: 'Web3 Services',
  },
  {
    icon: ArrowLeftRight,
    title: 'OTC Trading Desk',
    description: 'Seamless on/off ramp services for large transactions. Convert between fiat and crypto with competitive rates and privacy.',
    category: 'Web3 Services',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[128px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Everything You Need to Succeed
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Comprehensive Trading
            <span className="text-gradient"> Ecosystem</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From beginner courses to advanced automation, we provide every tool and resource you need to become a profitable trader.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const cardClassName = `group relative bg-card rounded-2xl border transition-all duration-300 hover:border-primary/50 block ${
              feature.highlight || ('badge' in feature && feature.badge)
                ? 'border-primary/30 shadow-lg shadow-primary/5'
                : 'border-border'
            }${feature.href ? ' cursor-pointer' : ''}`;

            const cardContent = (
              <>
                {/* Highlight Badge */}
                {(feature.highlight || ('badge' in feature && feature.badge)) && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    {'badge' in feature && feature.badge ? feature.badge : 'Popular'}
                  </div>
                )}

                <div className="p-6 lg:p-8">
                  {/* Category Tag */}
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {feature.category}
                  </span>

                  {/* Icon */}
                  <div className="mt-4 mb-4 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:glow-primary transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </>
            );

            if (feature.href) {
              if ('internal' in feature && feature.internal) {
                return (
                  <Link key={feature.title} to={feature.href} className={cardClassName}>
                    {cardContent}
                  </Link>
                );
              }

              return (
                <a
                  key={feature.title}
                  href={feature.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <div key={feature.title} className={cardClassName}>
                {cardContent}
              </div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl bg-card border border-border">
          {[
            { icon: Users, value: '10+', label: 'Expert Mentors' },
            { icon: GraduationCap, value: '50+', label: 'Course Modules' },
            { icon: Bell, value: '500+', label: 'Signals Monthly' },
            { icon: Trophy, value: '95%', label: 'Student Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="font-display text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
