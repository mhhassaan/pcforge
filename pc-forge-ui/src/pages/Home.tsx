import Hero from '../components/landing/Hero';
import ComponentRange from '../components/landing/ComponentRange';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import CompatibilityShowcase from '../components/landing/CompatibilityShowcase';
import Vendors from '../components/landing/Vendors';
import StarterBuilds from '../components/landing/StarterBuilds';
import CTA from '../components/landing/CTA';

export default function Home() {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen selection:bg-blue-600/30 selection:text-white transition-colors duration-300">
      <Hero />
      <ComponentRange />
      <HowItWorks />
      <Features />
      <CompatibilityShowcase />
      <Vendors />
      <StarterBuilds />
      <CTA />
    </div>
  );
}
