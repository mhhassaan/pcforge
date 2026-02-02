import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Component } from '../types/pcforge';

interface BuildState {
  [category: string]: Component | null;
}

interface BuildContextType {
  build: BuildState;
  addComponent: (component: Component) => void;
  removeComponent: (category: string) => void;
  clearBuild: () => void;
  totalPrice: number;
  isDrawerOpen: boolean;
  toggleDrawer: (open?: boolean) => void;
}

const BuildContext = createContext<BuildContextType | undefined>(undefined);

export function BuildProvider({ children }: { children: ReactNode }) {
  const [build, setBuild] = useState<BuildState>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedBuild = localStorage.getItem('pcforge_build');
    if (savedBuild) {
      try {
        setBuild(JSON.parse(savedBuild));
      } catch (e) {
        console.error("Failed to parse saved build", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('pcforge_build', JSON.stringify(build));
    }
  }, [build, isInitialized]);

  const addComponent = (component: Component) => {
    const rawCategory = component.category.toLowerCase();
    
    // Map database category names to standardized build slots
    const mapping: Record<string, string> = {
        'cpu': 'cpu',
        'motherboards': 'motherboard',
        'ram': 'ram',
        'gpu': 'gpu',
        'ssd': 'storage',
        'psu': 'psu',
        'case': 'case'
    };

    const slotKey = mapping[rawCategory] || rawCategory;

    setBuild(prev => ({
      ...prev,
      [slotKey]: component
    }));
    setIsDrawerOpen(true); // Auto-open drawer on add
  };

  const removeComponent = (category: string) => {
    setBuild(prev => {
      const newState = { ...prev };
      delete newState[category];
      return newState;
    });
  };

  const clearBuild = () => {
    setBuild({});
    localStorage.removeItem('pcforge_build');
  };

  const toggleDrawer = (open?: boolean) => {
    setIsDrawerOpen(prev => open !== undefined ? open : !prev);
  };

  const totalPrice = Object.values(build).reduce((sum, comp) => {
    return sum + (comp?.price_pkr || 0);
  }, 0);

  return (
    <BuildContext.Provider value={{ 
      build, 
      addComponent, 
      removeComponent, 
      clearBuild, 
      totalPrice,
      isDrawerOpen,
      toggleDrawer
    }}>
      {children}
    </BuildContext.Provider>
  );
}

export function useBuild() {
  const context = useContext(BuildContext);
  if (context === undefined) {
    throw new Error('useBuild must be used within a BuildProvider');
  }
  return context;
}
