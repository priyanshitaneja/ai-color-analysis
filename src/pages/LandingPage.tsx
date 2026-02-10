import { HeroSection } from '../components/landing/HeroSection';
import { HowItWorks } from '../components/landing/HowItWorks';

export function LandingPage() {
  return (
    <main className="w-full">
      <HeroSection />
      <HowItWorks />
    </main>
  );
}
