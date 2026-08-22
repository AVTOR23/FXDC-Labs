import { 
  Clock, 
  Users, 
  BookOpen, 
  Video, 
  CheckCircle2, 
  ArrowRight,
  Star,
  Zap,
  Crown
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

const courses = [
  {
    id: 'foundation',
    icon: BookOpen,
    badge: 'Best for Beginners',
    badgeColor: 'bg-primary/20 text-primary',
    title: 'Foundation Course',
    subtitle: 'Master the Fundamentals',
    description: 'Build a rock-solid trading foundation. Learn market structure, technical analysis basics, risk management, and the core FXDC methodology.',
    duration: '8 Weeks',
    students: '2,500+',
    modules: '24 Modules',
    level: 'Beginner',
    features: [
      'Market structure & price action basics',
      'Technical analysis fundamentals',
      'Risk management principles',
      'Trading psychology essentials',
      'Introduction to Forex & Crypto markets',
      'Community access & support',
    ],
    price: '$297',
    originalPrice: '$497',
    cta: 'Start Learning',
    featured: false,
  },
  {
    id: 'masterclass',
    icon: Crown,
    badge: 'Most Popular',
    badgeColor: 'bg-accent/20 text-accent',
    title: 'Masterclass Program',
    subtitle: 'Advanced Strategies & Methods',
    description: 'Elevate your trading with institutional-grade strategies. Deep-dive into advanced setups, multi-timeframe analysis, and high-probability trading systems.',
    duration: '12 Weeks',
    students: '1,200+',
    modules: '36 Modules',
    level: 'Intermediate',
    features: [
      'Advanced price action strategies',
      'Institutional trading concepts',
      'Multi-timeframe analysis mastery',
      'High-probability entry & exit systems',
      'Live trade breakdowns & analysis',
      'Private mentorship sessions',
      'VIP signals access included',
    ],
    price: '$697',
    originalPrice: '$997',
    cta: 'Enroll Now',
    featured: true,
  },
  {
    id: 'workshop',
    icon: Video,
    badge: 'Live Sessions',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    title: 'Live Trading Workshops',
    subtitle: 'Trade in Real-Time',
    description: 'Join our expert traders in live market sessions. Watch real trades unfold, ask questions, and learn decision-making in real-time conditions.',
    duration: 'Weekly Sessions',
    students: '800+',
    modules: '4 Live/Month',
    level: 'All Levels',
    features: [
      'Live trading sessions weekly',
      'Real-time market analysis',
      'Interactive Q&A with mentors',
      'Trade setups & execution walkthrough',
      'Session recordings for replay',
      'Community trading chat access',
    ],
    price: '$97',
    originalPrice: '$147',
    cta: 'Join Live',
    featured: false,
    priceLabel: '/month',
  },
];

export default function CoursesSection() {
  return (
    <section id="courses" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Transform Your Trading Journey
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Choose Your
            <span className="text-gradient"> Learning Path</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Structured programs designed to take you from beginner to professional trader. Learn at your own pace with lifetime access.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`relative flex flex-col bg-card rounded-2xl border transition-all duration-300 hover:border-primary/50 ${
                course.featured
                  ? 'border-accent/50 shadow-xl shadow-accent/10 scale-[1.02] lg:scale-105'
                  : 'border-border'
              }`}
            >
              {/* Badge */}
              <div className="absolute -top-3 left-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${course.badgeColor}`}>
                  {course.featured && <Star className="w-3 h-3" />}
                  {course.badge}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 lg:p-8 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    course.featured ? 'bg-accent/20' : 'bg-primary/10'
                  }`}>
                    <course.icon className={`w-7 h-7 ${course.featured ? 'text-accent' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {course.description}
                </p>

                {/* Meta Info */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-secondary/50">
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">{course.duration}</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">{course.students}</p>
                  </div>
                  <div className="text-center">
                    <BookOpen className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">{course.modules}</p>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8 flex-1">
                  {course.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        course.featured ? 'text-accent' : 'text-primary'
                      }`} />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold">{course.price}</span>
                    {course.priceLabel && (
                      <span className="text-muted-foreground text-sm">{course.priceLabel}</span>
                    )}
                    <span className="text-muted-foreground line-through text-sm">{course.originalPrice}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">One-time payment • Lifetime access</p>
                </div>

                {/* CTA */}
                <Button 
                  className={`w-full ${course.featured ? 'glow-accent bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
                  size="lg"
                >
                  {course.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Not sure which course is right for you?
          </p>
          <Button variant="outline" size="lg">
            Book a Free Consultation
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
