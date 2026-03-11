import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import CompatibilityShowcase from '../components/landing/CompatibilityShowcase';
import Vendors from '../components/landing/Vendors';
import CTA from '../components/landing/CTA';

export default function Home() {
  return (
    <div className="bg-white dark:bg-[#020817] min-h-screen selection:bg-blue-600/30 selection:text-white transition-colors duration-300">
      <Hero />
      <HowItWorks />
      <Features />
      <CompatibilityShowcase />
      <Vendors />
      <CTA />
    </div>
  );
}