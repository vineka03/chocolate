import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Task, PriorityLevel } from '../types';
import { 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Thermometer, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Zap
} from 'lucide-react';

export const PrioritiesView: React.FC = () => {
  const { 
    tasks, 
    projects, 
    moveTaskStage, 
    requestAiPrioritization, 
    setIsTaskModalOpen,
    setEditingTask 
  } = useShop();

  const [aiPriorities, setAiPriorities] = useState<{
    recommendation: string;
    topTaskIds: string[];
    bottleneckAlerts: string[];
  } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    try {
      const res = await requestAiPrioritization();
      setAiPriorities(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Split tasks by quadrant
  const quadrantUrgentHigh = tasks.filter(t => t.priority === 'urgent' && t.stage !== 'done');
  const quadrantHigh = tasks.filter(t => t.priority === 'high' && t.stage !== 'done');
  const quadrantMedium = tasks.filter(t => t.priority === 'medium' && t.stage !== 'done');
  const quadrantLow = tasks.filter(t => t.priority === 'low' && t.stage !== 'done');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header with AI Prioritization Engine Callout */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Kitchen Critical Path
            </span>
            <span className="text-xs text-[#baa998]">Thermal & Crystallization Sequencing</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#fdfbf7]">
            Priorities & Bottleneck Matrix
          </h2>
          <p className="text-xs sm:text-sm text-[#baa998] mt-0.5 max-w-2xl">
            In chocolate confectionery, priority is dictated by crystallization kinetics: liquid tempered chocolate must be poured within 25 minutes, while ganache requires 12 hours of uninterrupted ambient resting.
          </p>
        </div>

        <button
          onClick={handleRunOptimization}
          disabled={isOptimizing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-[#c8925b] hover:from-amber-500 hover:to-[#dfab76] text-[#120e0c] font-bold text-xs shadow-lg shadow-amber-900/30 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isOptimizing ? 'Evaluating Batch Constraints...' : 'AI Optimize Sequence'}</span>
        </button>
      </div>

      {/* AI Recommendation Banner */}
      {aiPriorities && (
        <div className="p-5 rounded-2xl bg-[#221812] border border-amber-500/40 shadow-xl space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 font-serif">
                CocoaBot Sequential Production Directive
              </h3>
            </div>
            <button
              onClick={() => setAiPriorities(null)}
              className="text-amber-400 hover:text-amber-200 text-xs"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#faebd7] leading-relaxed font-medium">
            {aiPriorities.recommendation}
          </p>

          {aiPriorities.bottleneckAlerts && aiPriorities.bottleneckAlerts.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-amber-500/20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Detected Atelier Bottlenecks:</span>
              </span>
              <div className="grid sm:grid-cols-2 gap-2">
                {aiPriorities.bottleneckAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2"
                  >
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{alert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2x2 Priority Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Quadrant 1: Urgent & Temperature-Critical */}
        <div className="rounded-2xl bg-[#1c130f] border border-rose-500/30 p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
          <div className="space-y-1 border-b border-[#2d1c16] pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h3 className="text-sm font-bold text-rose-300 font-serif uppercase tracking-wider">
                  Quadrant I: Critical & Time-Sensitive
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-300">
                {quadrantUrgentHigh.length} Tasks
              </span>
            </div>
            <p className="text-[11px] text-[#baa998]">
              Active enrobing runs, mold pouring, or continuous temperer calibration.
            </p>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[380px] custom-scrollbar flex-1">
            {quadrantUrgentHigh.length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-center text-xs text-[#8e7a6a]">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-1 opacity-80" />
                <span>No urgent bottlenecks right now</span>
              </div>
            ) : (
              quadrantUrgentHigh.map(task => (
                <PriorityTaskItem key={task.id} task={task} />
              ))
            )}
          </div>
        </div>

        {/* Quadrant 2: High Value & Curing Schedules */}
        <div className="rounded-2xl bg-[#1c1511] border border-amber-500/30 p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
          <div className="space-y-1 border-b border-[#2d211a] pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-amber-300 font-serif uppercase tracking-wider">
                  Quadrant II: High Importance / Curing
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300">
                {quadrantHigh.length} Tasks
              </span>
            </div>
            <p className="text-[11px] text-[#baa998]">
              Ganache emulsion stabilization (12h), bean roasting curves, water-activity QA.
            </p>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[380px] custom-scrollbar flex-1">
            {quadrantHigh.length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-center text-xs text-[#8e7a6a]">
                <span>No high-priority tasks pending</span>
              </div>
            ) : (
              quadrantHigh.map(task => (
                <PriorityTaskItem key={task.id} task={task} />
              ))
            )}
          </div>
        </div>

        {/* Quadrant 3: Medium Priority - Assembly & Packaging */}
        <div className="rounded-2xl bg-[#18120e] border border-[#33261f] p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-sm">
          <div className="space-y-1 border-b border-[#281c16] pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-sky-300 font-serif uppercase tracking-wider">
                  Quadrant III: Packaging & Assembly
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-sky-500/20 text-sky-300">
                {quadrantMedium.length} Tasks
              </span>
            </div>
            <p className="text-[11px] text-[#baa998]">
              Ballotin box folding, gold-foil wrapping, and gift tag embossing.
            </p>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[380px] custom-scrollbar flex-1">
            {quadrantMedium.length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-center text-xs text-[#8e7a6a]">
                <span>No packaging tasks pending</span>
              </div>
            ) : (
              quadrantMedium.map(task => (
                <PriorityTaskItem key={task.id} task={task} />
              ))
            )}
          </div>
        </div>

        {/* Quadrant 4: Low Priority - Shop Maintenance & Displays */}
        <div className="rounded-2xl bg-[#16100d] border border-[#2d211a] p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-sm">
          <div className="space-y-1 border-b border-[#251913] pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-300 font-serif uppercase tracking-wider">
                  Quadrant IV: Boutique Maintenance & Display
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-500/20 text-slate-300">
                {quadrantLow.length} Tasks
              </span>
            </div>
            <p className="text-[11px] text-[#baa998]">
              Boutique sample restocking, allergen origin signage, inventory count.
            </p>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[380px] custom-scrollbar flex-1">
            {quadrantLow.length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-center text-xs text-[#8e7a6a]">
                <span>No low priority backlog</span>
              </div>
            ) : (
              quadrantLow.map(task => (
                <PriorityTaskItem key={task.id} task={task} />
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

interface PriorityTaskItemProps {
  task: Task;
}

const PriorityTaskItem: React.FC<PriorityTaskItemProps> = ({ task }) => {
  const { moveTaskStage, projects, setEditingTask, setIsTaskModalOpen } = useShop();
  const project = projects.find(p => p.id === task.projectId);

  return (
    <div className="p-3 rounded-xl bg-[#221813] hover:bg-[#2a1e18] border border-[#38271e] transition-all space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-semibold text-[#c8925b] uppercase tracking-wider">
            {task.category}
          </span>
          <h4 
            onClick={() => {
              setEditingTask(task);
              setIsTaskModalOpen(true);
            }}
            className="text-xs font-bold text-[#fdfbf7] hover:text-[#dfab76] cursor-pointer mt-0.5"
          >
            {task.title}
          </h4>
        </div>

        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2c1e17] text-[#baa998] border border-[#3e2c22] shrink-0">
          {task.stage}
        </span>
      </div>

      {task.temperingNote && (
        <div className="p-1 rounded bg-sky-950/40 border border-sky-500/20 text-[10px] text-sky-200 flex items-center gap-1">
          <Thermometer className="w-3 h-3 text-sky-400" />
          <span className="truncate">{task.temperingNote}</span>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-[#8e7a6a] pt-1.5 border-t border-[#2e2019]">
        <span>{task.assignedTo} ({task.estimatedHours}h)</span>
        
        {task.stage !== 'done' && (
          <button
            onClick={() => moveTaskStage(task.id, task.stage === 'todo' ? 'in-progress' : 'done')}
            className="px-2 py-0.5 rounded bg-[#2e1f18] hover:bg-[#3d2a20] text-[#dfab76] text-[10px] font-bold border border-[#443126] flex items-center gap-1"
          >
            <span>{task.stage === 'todo' ? 'Start' : 'Done'}</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    </div>
  );
};
