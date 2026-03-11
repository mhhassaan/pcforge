import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ScrollProgress } from '../components/ui/ScrollProgress';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen antialiased font-sans bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-300">
      <ScrollProgress className="bg-blue-600" />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
