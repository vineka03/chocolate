import React from 'react';
import { useShop } from '../context/ShopContext';
import { ViewTab } from '../types';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  Flame, 
  BarChart3, 
  ShoppingBag,
} from 'lucide-react';

interface NavItem {
  id: ViewTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeType?: 'urgent' | 'default';
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, metrics, products } = useShop();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'tasks',
      label: 'Task Management',
      icon: CheckSquare,
      badge: metrics.totalTasks,
    },
    {
      id: 'projects',
      label: 'Projects & Lines',
      icon: FolderKanban,
      badge: metrics.activeProjectsCount,
    },
    {
      id: 'priorities',
      label: 'Priorities Matrix',
      icon: Flame,
      badge: metrics.urgentCount > 0 ? metrics.urgentCount : undefined,
      badgeType: 'urgent',
    },
    {
      id: 'analytics',
      label: 'Progress Analytics',
      icon: BarChart3,
      badge: `${metrics.completionRate}%`,
    },
    {
      id: 'catalog',
      label: 'Chocolate Catalog',
      icon: ShoppingBag,
      badge: products.length,
    },
  ];

  return (
    <nav className="border-b border-[#2d221c] bg-[#16100d]/95 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? 'border-[#c8925b] text-[#fdfbf7] font-semibold bg-[#221813]/60'
                  : 'border-transparent text-[#a69483] hover:text-[#e0cfbe] hover:bg-[#1c1410]/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#c8925b]' : 'text-[#877465]'}`} />
              <span>{item.label}</span>

              {item.badge !== undefined && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.badgeType === 'urgent'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      : isActive
                      ? 'bg-[#c8925b]/20 text-[#dfab76]'
                      : 'bg-[#261c16] text-[#8e7a6a]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
