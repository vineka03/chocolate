import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, Search, Plus, Thermometer, Droplets, Clock } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    setIsAiDrawerOpen,
    setIsTaskModalOpen,
    setIsProjectModalOpen,
    setIsGlobalSearchOpen,
    setEditingTask,
    metrics,
  } = useShop();

  return (
    <header className="sticky top-0 z-30 border-b border-[#2d221c] bg-[#140f0c]/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand & Ambient Kitchen Telemetry */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c8925b] via-[#8c562e] to-[#452718] flex items-center justify-center shadow-lg shadow-[#c8925b]/10 border border-[#dfab76]/30">
              <span className="text-xl select-none">🍫</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#c8925b]">Artisan Atelier</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#fdfbf7] font-serif">
                Modern Chocolate Shop
              </h1>
            </div>
          </div>

          {/* Mobile Search & AI trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsGlobalSearchOpen(true)}
              className="p-2 rounded-lg bg-[#201814] text-[#d6c7b9] hover:text-[#fdfbf7] border border-[#352821]"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#c8925b] to-[#a86a3d] text-[#120e0c] font-semibold text-xs flex items-center gap-1.5 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI</span>
            </button>
          </div>
        </div>

        {/* Ambient Atelier Stats Pill (Real Chocolatier Environment Data) */}
        <div className="hidden lg:flex items-center gap-4 px-3.5 py-1.5 rounded-full bg-[#1b1410] border border-[#33261f] text-xs text-[#baa998]">
          <div className="flex items-center gap-1.5 text-[#e0cfbe]">
            <Thermometer className="w-3.5 h-3.5 text-[#c8925b]" />
            <span>Kitchen: <strong className="text-[#fdfbf7]">19.4°C</strong></span>
          </div>
          <span className="text-[#3a2c24]">•</span>
          <div className="flex items-center gap-1.5 text-[#e0cfbe]">
            <Droplets className="w-3.5 h-3.5 text-[#5ea4e4]" />
            <span>Humidity: <strong className="text-[#fdfbf7]">46% RH</strong> (Optimal)</span>
          </div>
          <span className="text-[#3a2c24]">•</span>
          <div className="flex items-center gap-1.5 text-[#e0cfbe]">
            <Clock className="w-3.5 h-3.5 text-[#dfab76]" />
            <span>Active: <strong className="text-[#fdfbf7]">{metrics.inProgressCount} Batches</strong></span>
          </div>
        </div>

        {/* Global Search & Action Buttons */}
        <div className="hidden md:flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Search Trigger */}
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="flex items-center gap-3 px-3 py-1.5 text-xs text-[#a99684] bg-[#1e1612] hover:bg-[#271d18] border border-[#352821] hover:border-[#4d3a30] rounded-lg transition-colors shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-[#c8925b]" />
            <span>Search tasks, projects, chocolate...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#2a201a] border border-[#3e3027] text-[#baa998] rounded">⌘K</kbd>
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="group relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#2a1d17] to-[#36251d] hover:from-[#36251d] hover:to-[#452e24] border border-[#c8925b]/40 text-[#fdfbf7] text-xs font-medium transition-all shadow-md hover:shadow-[#c8925b]/10"
          >
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#dfab76] group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#dfab76] animate-ping opacity-75" />
            </div>
            <span>AI Chocolatier</span>
            <kbd className="hidden xl:inline-block px-1 py-0.2 text-[9px] font-mono bg-[#1a130f] text-[#baa998] rounded border border-[#4a372c]">⌘J</kbd>
          </button>

          {/* New Task Button */}
          <button
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#c8925b] hover:bg-[#d99f66] text-[#120e0c] font-semibold text-xs transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>

          {/* New Project Button */}
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#231a15] hover:bg-[#2f221b] border border-[#3d2e24] text-[#e0cfbe] hover:text-[#fdfbf7] font-medium text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#c8925b]" />
            <span className="hidden sm:inline">Project</span>
          </button>
        </div>

      </div>
    </header>
  );
};
