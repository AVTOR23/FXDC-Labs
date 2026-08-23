import { Link } from 'react-router';
import { ArrowRight, Play, Users, Award, BarChart3 } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

const stats = [
  { icon: Users, value: '5,000+', label: 'Active Traders' },
  { icon: Award, value: '98%', label: 'Success Rate' },
  { icon: BarChart3, value: '$2M+', label: 'Profits Generated' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />
      
      {/* Animated Chart Lines (decorative) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute bottom-0 left-0 right-0 h-64 opacity-20" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <path
            fill="none"
            stroke="hsl(160 84% 39%)"
            strokeWidth="2"
            d="M0,192 C120,160 240,224 360,192 C480,160 600,96 720,128 C840,160 960,224 1080,192 C1200,160 1320,128 1440,160"
            className="animate-pulse"
          />
          <path
            fill="none"
            stroke="hsl(43 96% 56%)"
            strokeWidth="2"
            d="M0,256 C120,224 240,288 360,256 C480,224 600,160 720,192 C840,224 960,288 1080,256 C1200,224 1320,192 1440,224"
            className="animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live Trading Workshops Available
            </div>

            {/* Headline */}
            <h1 className="mb-6 flex flex-col items-center lg:items-start gap-1 font-display font-bold leading-tight">
              <span className="text-4xl sm:text-5xl lg:text-6xl">Master the Art</span>
              <span className="text-2xl sm:text-3xl font-medium text-primary" aria-hidden="true">
                —
              </span>
              <span className="text-gradient text-[1.85rem] sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
                Financial Markets
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              Transform your financial future with expert-led courses, live workshops, and a proven trading methodology trusted by thousands.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" className="glow-primary text-base px-8" asChild>
                <Link to="/education">
                  Enroll Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 group" asChild>
                <Link to="/trading-tools">
                  <Play className="w-5 h-5 mr-2 group-hover:text-primary transition-colors" />
                  Watch Free Lesson
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <stat.icon className="w-5 h-5 text-primary" />
                    <span className="font-display font-bold text-2xl sm:text-3xl">{stat.value}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Trading Card Visual */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Main Card */}
              <div className="relative bg-card rounded-2xl border border-border p-6 glow-primary">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Portfolio Value</p>
                    <p className="font-display text-3xl font-bold">$127,432.50</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                    +24.5%
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="h-40 mb-6 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,120 C40,100 80,140 120,100 C160,60 200,80 240,40 C280,0 320,20 360,10 L360,160 L0,160 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M0,120 C40,100 80,140 120,100 C160,60 200,80 240,40 C280,0 320,20 360,10"
                      fill="none"
                      stroke="hsl(160 84% 39%)"
                      strokeWidth="3"
                    />
                  </svg>
                </div>

                {/* Trading Pairs */}
                <div className="space-y-3">
                  {[
                    { pair: 'BTC/USD', price: '$67,234.12', change: '+3.24%', positive: true },
                    { pair: 'EUR/USD', price: '1.0892', change: '+0.45%', positive: true },
                    { pair: 'ETH/USD', price: '$3,456.78', change: '-1.12%', positive: false },
                  ].map((item) => (
                    <div key={item.pair} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="font-medium">{item.pair}</span>
                      <span className="text-muted-foreground">{item.price}</span>
                      <span className={item.positive ? 'text-primary' : 'text-destructive'}>
                        {item.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-display font-bold text-sm glow-accent">
                LIVE DATA
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
