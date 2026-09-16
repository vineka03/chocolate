import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { TaskManagementView } from './components/TaskManagementView';
import { ProjectsView } from './components/ProjectsView';
import { PrioritiesView } from './components/PrioritiesView';
import { AnalyticsView } from './components/AnalyticsView';
import { ChocolateCatalogView } from './components/ChocolateCatalogView';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { TaskModal } from './components/TaskModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Sparkles, Thermometer, Droplets } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setIsAiDrawerOpen } = useShop();

  return (
    <div className="min-h-screen bg-[#120e0c] text-[#f7f2ea] flex flex-col font-sans selection:bg-[#c8925b]/30 selection:text-[#faebd7]">
      {/* Top Header */}
      <Header />

      {/* Navigation Bar */}
      <Navigation />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'tasks' && <TaskManagementView />}
        {activeTab === 'projects' && <ProjectsView />}
        {activeTab === 'priorities' && <PrioritiesView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'catalog' && <ChocolateCatalogView />}
      </main>

      {/* Floating AI Action Button (convenient from any view) */}
      <button
        onClick={() => setIsAiDrawerOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#c8925b] via-[#b57a46] to-[#8f552a] text-[#120e0c] font-bold text-xs sm:text-sm shadow-xl shadow-[#c8925b]/30 hover:scale-105 active:scale-95 transition-all border border-[#dfab76]/50 group"
        aria-label="Open CocoaBot AI Chocolatier Assistant"
      >
        <div className="relative">
          <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#faebd7] animate-ping" />
        </div>
        <span className="font-semibold tracking-wide">CocoaBot AI</span>
      </button>

      {/* Footer */}
      <footer className="border-t border-[#261b15] bg-[#0e0a09] py-4 text-xs text-[#8e7a6a] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#c8925b]">Modern Chocolate Shop</span>
            <span>•</span>
            <span>Atelier Operations & Confectionery Management System</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#baa998]">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-[#c8925b]" /> 19.4°C
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-[#5ea4e4]" /> 46% RH
            </span>
            <span>•</span>
            <span className="text-emerald-400">Beta V Crystal Stable</span>
          </div>
        </div>
      </footer>

      {/* Modals & Slide-out Drawers */}
      <AIAssistantDrawer />
      <TaskModal />
      <GlobalSearchModal />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
