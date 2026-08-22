import Navbar from '@/react-app/components/Navbar';
import HeroSection from '@/react-app/components/HeroSection';
import FeaturesSection from '@/react-app/components/FeaturesSection';
import CoursesSection from '@/react-app/components/CoursesSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CoursesSection />
      </main>
    </div>
  );
}
