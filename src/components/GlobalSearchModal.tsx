import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, X, CheckSquare, FolderKanban, ShoppingBag, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isGlobalSearchOpen, 
    setIsGlobalSearchOpen, 
    tasks, 
    projects, 
    products, 
    setActiveTab, 
    setSelectedProjectId,
    setEditingTask,
    setIsTaskModalOpen
  } = useShop();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isGlobalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isGlobalSearchOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        matchedTasks: tasks.slice(0, 3),
        matchedProjects: projects.slice(0, 2),
        matchedProducts: products.slice(0, 2),
      };
    }

    const matchedTasks = tasks.filter(t => 
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.temperingNote && t.temperingNote.toLowerCase().includes(q)) ||
      t.assignedTo.toLowerCase().includes(q)
    );

    const matchedProjects = projects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(tag => tag.toLowerCase().includes(q))
    );

    const matchedProducts = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.origin.toLowerCase().includes(q) ||
      p.flavorNotes.some(f => f.toLowerCase().includes(q))
    );

    return { matchedTasks, matchedProjects, matchedProducts };
  }, [query, tasks, projects, products]);

  if (!isGlobalSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl rounded-2xl bg-[#1a130f] border border-[#3d2e24] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#2d2019] flex items-center gap-3 bg-[#201712]">
          <Search className="w-5 h-5 text-[#c8925b]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search across chocolate tasks, collections, products, recipes, or tempering notes..."
            className="flex-1 bg-transparent text-sm text-[#fdfbf7] placeholder-[#8e7a6a] focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-[#2b1f19] border border-[#3e2d23] text-[#baa998] rounded">
            ESC
          </kbd>
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="p-1 text-[#8e7a6a] hover:text-[#fdfbf7]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-5 custom-scrollbar text-xs">
          
          {/* Tasks Group */}
          {searchResults.matchedTasks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#c8925b]">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Atelier Tasks ({searchResults.matchedTasks.length})</span>
              </div>
              <div className="space-y-1.5">
                {searchResults.matchedTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      setEditingTask(task);
                      setIsTaskModalOpen(true);
                    }}
                    className="p-2.5 rounded-xl bg-[#221813] hover:bg-[#2b1f19] border border-[#35271e] hover:border-[#4d382c] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#fdfbf7]">{task.title}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2e1f18] text-[#c8925b]">
                          {task.stage}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8e7a6a] line-clamp-1 mt-0.5">{task.description}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8e7a6a] shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Group */}
          {searchResults.matchedProjects.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#dfab76]">
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Collections & Projects ({searchResults.matchedProjects.length})</span>
              </div>
              <div className="space-y-1.5">
                {searchResults.matchedProjects.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      setSelectedProjectId(proj.id);
                      setActiveTab('projects');
                    }}
                    className="p-2.5 rounded-xl bg-[#221813] hover:bg-[#2b1f19] border border-[#35271e] hover:border-[#4d382c] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-[#fdfbf7]">{proj.name}</div>
                      <p className="text-[11px] text-[#8e7a6a] line-clamp-1 mt-0.5">{proj.description}</p>
                    </div>
                    <span className="text-[10px] text-[#dfab76] px-2 py-0.5 rounded bg-[#2c1f18]">
                      {proj.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Group */}
          {searchResults.matchedProducts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#e0cfbe]">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Chocolate Catalog & Recipes ({searchResults.matchedProducts.length})</span>
              </div>
              <div className="space-y-1.5">
                {searchResults.matchedProducts.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      setActiveTab('catalog');
                    }}
                    className="p-2.5 rounded-xl bg-[#221813] hover:bg-[#2b1f19] border border-[#35271e] hover:border-[#4d382c] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#fdfbf7]">{prod.name}</span>
                        <span className="text-[10px] text-[#dfab76] font-bold">{prod.cacaoPercentage}% Cacao</span>
                      </div>
                      <p className="text-[11px] text-[#8e7a6a] line-clamp-1 mt-0.5">
                        Origin: {prod.origin} • Notes: {prod.flavorNotes.join(', ')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-[#dfab76]">${prod.price.toFixed(2)}</div>
                      <div className="text-[10px] text-[#8e7a6a]">{prod.inStock} in stock</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.matchedTasks.length === 0 &&
            searchResults.matchedProjects.length === 0 &&
            searchResults.matchedProducts.length === 0 && (
              <div className="py-8 text-center text-[#8e7a6a]">
                No matching results found for "{query}".
              </div>
            )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#17110e] border-t border-[#2d2019] text-[11px] text-[#8e7a6a] flex items-center justify-between">
          <span>Navigate with mouse or keyboard</span>
          <span>Modern Chocolate Shop Atelier</span>
        </div>

      </div>
    </div>
  );
};
