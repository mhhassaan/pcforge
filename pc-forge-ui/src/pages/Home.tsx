import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import CompatibilityShowcase from '../components/landing/CompatibilityShowcase';
import Vendors from '../components/landing/Vendors';
import CTA from '../components/landing/CTA';

export default function Home() {
  return (
    <div className="bg-brand-bg min-h-screen selection:bg-brand-primary/30 selection:text-white">
      <Hero />
      <HowItWorks />
      <Features />
      <CompatibilityShowcase />
      <Vendors />
      <CTA />
    </div>
  );
}