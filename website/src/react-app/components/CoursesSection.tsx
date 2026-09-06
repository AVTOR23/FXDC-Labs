import {
  Clock,
  BookOpen,
  Video,
  ArrowRight,
  Star,
  Zap,
  Crown,
  Trophy,
  Lock,
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Link } from 'react-router';

const courses = [
  {
    id: 'foundation',
    icon: BookOpen,
    badge: 'Best for Beginners',
    badgeColor: 'bg-primary/20 text-primary',
    title: 'Foundation Course',
    subtitle: 'Master the Fundamentals',
    description:
      'Build a rock-solid trading foundation. Learn market structure, technical analysis basics, risk management, and the core FXDC methodology.',
    duration: '1 week',
    students: '10-15+ Video',
    modules: '10+ Modules',
    price: '$25',
    originalPrice: '$150',
    cta: 'Start Learning',
    featured: false,
    href: '/checkout/foundation',
  },
  {
    id: 'masterclass',
    icon: Crown,
    badge: 'Most Popular',
    badgeColor: 'bg-accent/20 text-accent',
    title: 'Masterclass Program',
    subtitle: 'Advanced Strategies & Methods',
    description:
      'Elevate your trading with institutional-grade strategies. Deep-dive into advanced setups, multi-timeframe analysis, and high-probability trading systems.',
    duration: '1 week',
    students: '10-15+ Video',
    modules: '10+ Modules',
    price: '$885',
    cta: 'Enroll Now',
    featured: true,
    href: '/checkout/masterclass',
  },
  {
    id: 'advance',
    icon: Trophy,
    badge: 'Elite Track',
    badgeColor: 'bg-primary/20 text-primary',
    title: 'Advance Program',
    subtitle: 'Institutional Precision',
    description:
      'The Advanced Program is an elite technical framework designed to take you beyond basic retail patterns. Master market microstructure, order flow mechanics, and institutional liquidity profiling to execute with high-probability precision.',
    duration: '1 week',
    students: '10-15+ Video',
    modules: '10+ Modules',
    price: '$225',
    cta: 'Enroll Now',
    featured: false,
    href: '/checkout/advance',
  },
  {
    id: 'enhancement',
    icon: Lock,
    badge: 'Coming Soon',
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
    title: 'Enhancement Program',
    subtitle: 'Soon to Come',
    description: 'Early Access Program',
    comingSoon: true,
    duration: '',
    students: '',
    modules: '',
    price: '',
    cta: 'Notify Me',
    featured: false,
    href: '/education',
  },
];

export default function CoursesSection() {
  return (
    <section id="courses" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`relative flex flex-col bg-card rounded-2xl border transition-all duration-300 hover:border-primary/50 ${
                course.featured
                  ? 'border-accent/50 shadow-xl shadow-accent/10 scale-[1.02]'
                  : 'border-border'
              }`}
            >
              <div className="absolute -top-3 left-6">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${course.badgeColor}`}
                >
                  {course.featured && <Star className="w-3 h-3" />}
                  {course.badge}
                </span>
              </div>

              <div className="p-6 lg:p-8 flex-1 flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      course.featured ? 'bg-accent/20' : 'bg-primary/10'
                    }`}
                  >
                    <course.icon
                      className={`w-7 h-7 ${course.featured ? 'text-accent' : 'text-primary'}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                  </div>
                </div>

                {course.comingSoon ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                    <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
                      <Lock className="size-10 text-white" />
                    </div>
                    <p className="font-display text-2xl font-bold mb-3">Soon to Come</p>
                    <div className="rounded-lg bg-emerald-400/90 px-6 py-3">
                      <p className="font-semibold text-black leading-snug">
                        Early Access
                        <br />
                        Program
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-1">
                      {course.description}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-secondary/50">
                      <div className="text-center">
                        <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">{course.duration}</p>
                      </div>
                      <div className="text-center">
                        <Video className="w-4 h-4 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">{course.students}</p>
                      </div>
                      <div className="text-center">
                        <BookOpen className="w-4 h-4 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">{course.modules}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-4xl font-bold">{course.price}</span>
                        {'originalPrice' in course && course.originalPrice && (
                          <span className="text-muted-foreground line-through text-sm">
                            {course.originalPrice}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        One-time payment • Lifetime access
                      </p>
                    </div>
                  </>
                )}

                <Button
                  className={`w-full ${
                    course.featured
                      ? 'glow-accent bg-accent text-accent-foreground hover:bg-accent/90'
                      : ''
                  }`}
                  size="lg"
                  asChild
                >
                  <Link to={course.href}>
                    {course.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Not sure which course is right for you?</p>
          <Button variant="outline" size="lg" asChild>
            <Link to="/education">
              Book a Free Consultation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
