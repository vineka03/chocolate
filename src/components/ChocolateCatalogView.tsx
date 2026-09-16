import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ChocolateProduct } from '../types';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Thermometer, 
  Sparkles, 
  Check, 
  AlertCircle,
  Tag,
  PackageCheck
} from 'lucide-react';

export const ChocolateCatalogView: React.FC = () => {
  const { products, updateProductStock, setEditingTask, setIsTaskModalOpen, projects } = useShop();
  const [filterType, setFilterType] = useState<string>('all');
  const [justAddedNotice, setJustAddedNotice] = useState<string | null>(null);

  const filteredProducts = products.filter(p => {
    if (filterType !== 'all' && p.type !== filterType) return false;
    return true;
  });

  const handleCreateBatchTask = (product: ChocolateProduct) => {
    // Open task modal pre-filled for this product
    setEditingTask({
      id: '',
      title: `Produce Batch: ${product.name} (150 units)`,
      description: `Replenish stock for ${product.name} (${product.origin}). Adhere strictly to tempering at ${product.temperingTemp}. Batch code ${product.batchCode}.`,
      projectId: projects[0]?.id || 'proj-1',
      priority: product.inStock < 40 ? 'urgent' : 'high',
      stage: 'todo',
      category: product.type === 'Bar' ? 'Tempering' : product.type === 'Bonbon' ? 'Molding & Enrobing' : 'Ganache & Fillings',
      estimatedHours: 3.0,
      assignedTo: 'Éléonore Laurent',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      temperingNote: `Working temperature: ${product.temperingTemp}`,
      batchNumber: `${product.batchCode}-NEW`,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#c8925b]/20 text-[#dfab76] border border-[#c8925b]/30">
              Boutique Inventory & Recipes
            </span>
            <span className="text-xs text-[#baa998]">Bean-to-Bar & Confections</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#fdfbf7]">
            Artisan Chocolate Showcase & Catalog
          </h2>
          <p className="text-xs sm:text-sm text-[#baa998] mt-0.5 max-w-2xl">
            Live stock levels, origin traceability, cacao percentage calibrations, and quick-batch production trigger for boutique inventory.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#1b1410] border border-[#33261f] text-xs">
          {['all', 'Bar', 'Bonbon', 'Truffle', 'Praline', 'Confection'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === type
                  ? 'bg-[#c8925b] text-[#120e0c] font-bold shadow-sm'
                  : 'text-[#baa998] hover:text-[#fdfbf7]'
              }`}
            >
              {type === 'all' ? 'All Creations' : `${type}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          return (
            <div
              key={product.id}
              className="rounded-2xl bg-[#1a130f] border border-[#33241c] hover:border-[#4d382c] transition-all shadow-md overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header & Cacao Badge */}
              <div className="p-5 space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#271c16] text-[#dfab76] font-serif font-bold text-xs border border-[#3d2c22]">
                      {product.cacaoPercentage}% Cacao
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#baa998] px-2 py-0.5 rounded bg-[#221813] border border-[#35251d]">
                      {product.type}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    product.status === 'Available'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : product.status === 'In Production'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                  }`}>
                    {product.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-serif text-[#fdfbf7]">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#baa998] mt-1 font-medium">
                    Origin: <span className="text-[#fdfbf7]">{product.origin}</span>
                  </p>
                </div>

                {/* Flavor Notes Tags */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#8e7a6a] font-semibold">Tasting Profile</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.flavorNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-[#251a14] text-[#e0cfbe] border border-[#38281f]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Batch Code & Tempering Temp */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#2a1d17] text-xs">
                  <div className="p-2 rounded-lg bg-[#201611] border border-[#2e2018]">
                    <span className="text-[10px] text-[#8e7a6a] block">Batch Code</span>
                    <strong className="text-[#baa998] font-mono">{product.batchCode}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-sky-950/30 border border-sky-500/20">
                    <span className="text-[10px] text-sky-400 block flex items-center gap-1">
                      <Thermometer className="w-3 h-3" />
                      <span>Working Temp</span>
                    </span>
                    <strong className="text-sky-200">{product.temperingTemp}</strong>
                  </div>
                </div>

                {/* Inventory Stock Controls */}
                <div className="pt-2 border-t border-[#2a1d17] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#8e7a6a] block">Boutique Inventory</span>
                    <div className="text-base font-bold font-serif text-[#fdfbf7]">
                      {product.inStock} <span className="text-xs font-sans font-normal text-[#baa998]">units</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#231813] p-1 rounded-xl border border-[#3a2920]">
                    <button
                      onClick={() => updateProductStock(product.id, product.inStock - 5)}
                      className="w-7 h-7 rounded-lg bg-[#2e2019] hover:bg-[#3d2a20] text-[#fdfbf7] flex items-center justify-center transition-colors"
                      title="Decrease 5 units"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateProductStock(product.id, product.inStock + 10)}
                      className="w-7 h-7 rounded-lg bg-[#2e2019] hover:bg-[#3d2a20] text-[#fdfbf7] flex items-center justify-center transition-colors"
                      title="Add 10 units"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Footer: Trigger Batch Task */}
              <div className="p-4 bg-[#140f0c] border-t border-[#281c15] flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#dfab76]">
                  ${product.price.toFixed(2)}
                </span>

                <button
                  onClick={() => handleCreateBatchTask(product)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#281d17] hover:bg-[#38281e] text-[#dfab76] hover:text-[#fdfbf7] text-xs font-semibold border border-[#443126] transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-[#c8925b]" />
                  <span>Schedule Batch Task</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
