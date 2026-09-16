import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  PieChart, 
  Layers, 
  FileText,
  AlertCircle,
  Thermometer
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { tasks, projects, metrics, requestAiProgressSummary } = useShop();

  const [aiReport, setAiReport] = useState<{
    summary: string;
    highlights: string[];
    nextImmediateAction: string;
  } | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    try {
      const res = await requestAiProgressSummary();
      setAiReport(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReport(false);
    }
  };

  // Category distribution
  const categories = [
    'Tempering',
    'Ganache & Fillings',
    'Molding & Enrobing',
    'Packaging',
    'Inventory & QA',
    'Shop & Retail',
  ];

  const categoryStats = categories.map(cat => {
    const total = tasks.filter(t => t.category === cat).length;
    const completed = tasks.filter(t => t.category === cat && t.stage === 'done').length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { name: cat, total, completed, pct };
  });

  // Stage distribution
  const stageStats = [
    { label: 'To Do', count: metrics.todoCount, color: 'bg-slate-500' },
    { label: 'In Progress', count: metrics.inProgressCount, color: 'bg-amber-500' },
    { label: 'Review QA', count: tasks.filter(t => t.stage === 'review').length, color: 'bg-sky-500' },
    { label: 'Completed', count: metrics.completedCount, color: 'bg-emerald-500' },
  ];

  // Priority distribution
  const priorityStats = [
    { label: 'Urgent', count: tasks.filter(t => t.priority === 'urgent').length, color: 'bg-rose-500' },
    { label: 'High', count: tasks.filter(t => t.priority === 'high').length, color: 'bg-amber-500' },
    { label: 'Medium', count: tasks.filter(t => t.priority === 'medium').length, color: 'bg-sky-500' },
    { label: 'Low', count: tasks.filter(t => t.priority === 'low').length, color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header with AI Report Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#fdfbf7]">
            Production Velocity & Progress Analytics
          </h2>
          <p className="text-xs sm:text-sm text-[#baa998] mt-0.5">
            Throughput telemetry across chocolate stages, labor estimates, and QA compliance.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={loadingReport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c8925b] to-[#a86a3d] hover:from-[#d99f66] hover:to-[#b87849] text-[#120e0c] font-bold text-xs shadow-lg shadow-[#c8925b]/20 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loadingReport ? 'Compiling Executive Report...' : 'Generate AI Executive Report'}</span>
        </button>
      </div>

      {/* AI Executive Summary Card */}
      {aiReport && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1a251e] to-[#121a14] border border-emerald-500/40 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300 font-serif">
                AI Atelier Executive Production Report
              </h3>
            </div>
            <button
              onClick={() => setAiReport(null)}
              className="text-emerald-400 hover:text-emerald-200 text-xs"
            >
              Dismiss
            </button>
          </div>

          <p className="text-sm text-[#e2f0e3] leading-relaxed">
            {aiReport.summary}
          </p>

          {aiReport.highlights && aiReport.highlights.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-emerald-500/20">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Key Atelier Milestones:
              </span>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {aiReport.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-100 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-[#142017] border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Recommended Immediate Shift Focus:</span>
            </div>
            <span className="text-emerald-100 font-medium">{aiReport.nextImmediateAction}</span>
          </div>
        </div>
      )}

      {/* Top Progress Rings & Velocity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-[#1b1410] border border-[#30231b] shadow-sm">
          <span className="text-xs text-[#8e7a6a] font-medium">Batch Completion Rate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-serif text-[#fdfbf7]">{metrics.completionRate}%</span>
            <span className="text-xs text-emerald-400 font-medium">{metrics.completedCount} finished</span>
          </div>
          <div className="w-full h-2 bg-[#261c16] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${metrics.completionRate}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1b1410] border border-[#30231b] shadow-sm">
          <span className="text-xs text-[#8e7a6a] font-medium">Allocated Labor Hours</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-serif text-[#fdfbf7]">{metrics.totalHoursEstimated}h</span>
            <span className="text-xs text-[#baa998]">Across {metrics.totalTasks} tasks</span>
          </div>
          <p className="text-[11px] text-[#8e7a6a] mt-3">
            Average {(metrics.totalHoursEstimated / (metrics.totalTasks || 1)).toFixed(1)}h per batch task
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#1b1410] border border-[#30231b] shadow-sm">
          <span className="text-xs text-[#8e7a6a] font-medium">Active Production Lines</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-serif text-[#fdfbf7]">{metrics.activeProjectsCount}</span>
            <span className="text-xs text-[#dfab76]">Collections</span>
          </div>
          <p className="text-[11px] text-[#8e7a6a] mt-3">
            {projects.length} total scheduled lines
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#1b1410] border border-[#30231b] shadow-sm">
          <span className="text-xs text-[#8e7a6a] font-medium">Quality Compliance</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-serif text-emerald-400">100%</span>
            <span className="text-xs text-[#baa998]">Zero Bloom Defect</span>
          </div>
          <p className="text-[11px] text-[#8e7a6a] mt-3">
            All batches verified under Form V Beta crystals
          </p>
        </div>

      </div>

      {/* Deep Dives: Category Breakdown & Pipeline Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Completion Bar Charts */}
        <div className="p-5 rounded-2xl bg-[#1a130f] border border-[#30231b] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c8925b]" />
              <h3 className="text-base font-bold font-serif text-[#fdfbf7]">
                Throughput by Artisan Craft Discipline
              </h3>
            </div>
            <span className="text-xs text-[#8e7a6a]">Completed / Total</span>
          </div>

          <div className="space-y-3.5">
            {categoryStats.map(stat => (
              <div key={stat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#fdfbf7] font-medium">{stat.name}</span>
                  <span className="text-[#baa998]">
                    <strong className="text-[#dfab76]">{stat.completed}</strong> of {stat.total} ({stat.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#251a14] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#c8925b] to-[#dfab76] rounded-full"
                    style={{ width: `${stat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Stages & Priority Allocation */}
        <div className="space-y-6">
          
          {/* Stage Pipeline Breakdown */}
          <div className="p-5 rounded-2xl bg-[#1a130f] border border-[#30231b] space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#c8925b]" />
              <h3 className="text-base font-bold font-serif text-[#fdfbf7]">
                Production Stage Distribution
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stageStats.map(stage => {
                const pct = metrics.totalTasks > 0 ? Math.round((stage.count / metrics.totalTasks) * 100) : 0;
                return (
                  <div key={stage.label} className="p-3 rounded-xl bg-[#221813] border border-[#35271e] text-center space-y-1">
                    <span className="text-[11px] text-[#8e7a6a] font-medium">{stage.label}</span>
                    <div className="text-xl font-bold font-serif text-[#fdfbf7]">{stage.count}</div>
                    <div className="text-[10px] text-[#baa998]">{pct}% of queue</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Allocation Breakdown */}
          <div className="p-5 rounded-2xl bg-[#1a130f] border border-[#30231b] space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#c8925b]" />
              <h3 className="text-base font-bold font-serif text-[#fdfbf7]">
                Priority Load Distribution
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {priorityStats.map(pr => {
                return (
                  <div key={pr.label} className="p-3 rounded-xl bg-[#221813] border border-[#35271e] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${pr.color}`} />
                      <span className="text-[11px] text-[#baa998] font-medium">{pr.label}</span>
                    </div>
                    <div className="text-xl font-bold font-serif text-[#fdfbf7]">{pr.count}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
