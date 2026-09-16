import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Clock, 
  FolderKanban, 
  Thermometer, 
  ArrowRight, 
  Play, 
  AlertTriangle,
  FileText,
  Boxes
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    tasks, 
    projects, 
    products, 
    metrics, 
    setActiveTab, 
    setIsAiDrawerOpen, 
    setIsTaskModalOpen,
    moveTaskStage,
    requestAiProgressSummary,
    requestAiPrioritization,
  } = useShop();

  const [aiBriefing, setAiBriefing] = useState<{
    summary: string;
    highlights: string[];
    nextImmediateAction: string;
  } | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);

  const [prioritizeNotice, setPrioritizeNotice] = useState<string | null>(null);
  const [loadingPriorities, setLoadingPriorities] = useState(false);

  // Urgent & high priority tasks that are not done
  const urgentQueue = tasks
    .filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.stage !== 'done')
    .slice(0, 4);

  // Active projects
  const activeProjects = projects.filter(p => p.status !== 'completed').slice(0, 3);

  const handleFetchBriefing = async () => {
    setLoadingBriefing(true);
    try {
      const data = await requestAiProgressSummary();
      setAiBriefing(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBriefing(false);
    }
  };

  const handleRunAiPrioritizer = async () => {
    setLoadingPriorities(true);
    try {
      const data = await requestAiPrioritization();
      setPrioritizeNotice(data.recommendation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPriorities(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Hero Welcome & AI Command Center */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f1712] via-[#241a15] to-[#17110e] border border-[#3d2e24] p-5 sm:p-6 shadow-xl">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-[#c8925b]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-[#c8925b]/20 text-[#dfab76] border border-[#c8925b]/30">
                Operations & Atelier HQ
              </span>
              <span className="text-xs text-[#a99684]">Chocolatier Station #1</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#fdfbf7] tracking-tight">
              Artisan Chocolate Production Dashboard
            </h2>
            <p className="text-sm text-[#baa998] mt-1 max-w-2xl leading-relaxed">
              Real-time batch sequencing, ganache crystallization schedules, temperature calibration QA, and AI-assisted workflow optimization.
            </p>
          </div>

          {/* Quick AI Action Pills */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleFetchBriefing}
              disabled={loadingBriefing}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#2b1f19] hover:bg-[#382820] border border-[#4a362a] hover:border-[#dfab76]/50 text-xs font-medium text-[#fdfbf7] transition-all shadow"
            >
              <FileText className="w-3.5 h-3.5 text-[#dfab76]" />
              <span>{loadingBriefing ? 'Generating...' : 'AI Progress Brief'}</span>
            </button>

            <button
              onClick={handleRunAiPrioritizer}
              disabled={loadingPriorities}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#2b1f19] hover:bg-[#382820] border border-[#4a362a] hover:border-amber-500/50 text-xs font-medium text-[#fdfbf7] transition-all shadow"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{loadingPriorities ? 'Analyzing...' : 'AI Prioritize Queue'}</span>
            </button>

            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#c8925b] to-[#a86a3d] hover:from-[#d99f66] hover:to-[#b87849] text-xs font-bold text-[#120e0c] shadow-lg shadow-[#c8925b]/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask CocoaBot</span>
            </button>
          </div>
        </div>

        {/* Live AI Prioritizer Notification Banner if active */}
        {prioritizeNotice && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-100 flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-semibold block mb-0.5">AI Master Chocolatier Sequence Recommendation:</strong>
                <span>{prioritizeNotice}</span>
              </div>
            </div>
            <button
              onClick={() => setPrioritizeNotice(null)}
              className="text-amber-400 hover:text-amber-200 text-xs px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Live AI Briefing Banner if generated */}
        {aiBriefing && (
          <div className="mt-4 p-4 rounded-xl bg-[#1a251e]/80 border border-emerald-500/30 text-xs text-emerald-100 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-emerald-300 uppercase tracking-wider text-[11px]">AI Executive Progress Report</span>
              </div>
              <button onClick={() => setAiBriefing(null)} className="text-emerald-400 hover:text-emerald-200">✕</button>
            </div>
            <p className="text-[#d8ebd9] leading-relaxed mb-3">{aiBriefing.summary}</p>
            {aiBriefing.highlights && (
              <div className="grid sm:grid-cols-3 gap-2 mb-3">
                {aiBriefing.highlights.map((h, i) => (
                  <div key={i} className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-200 flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-2 border-t border-emerald-500/20 flex items-center gap-2 text-emerald-300 font-medium">
              <span>Next Immediate Action:</span>
              <span className="text-emerald-100">{aiBriefing.nextImmediateAction}</span>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Batch Completion */}
        <div className="p-4 rounded-xl bg-[#1c1511] border border-[#33261f] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a99684] font-medium">Progress Rate</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-[#fdfbf7]">{metrics.completionRate}%</span>
            <span className="text-xs text-emerald-400 font-medium">
              {metrics.completedCount}/{metrics.totalTasks} Done
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#2a1e17] rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics.completionRate}%` }}
            />
          </div>
        </div>

        {/* Card 2: In-Progress Batches */}
        <div className="p-4 rounded-xl bg-[#1c1511] border border-[#33261f] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a99684] font-medium">In the Atelier</span>
            <div className="p-1.5 rounded-lg bg-[#c8925b]/10 text-[#dfab76] border border-[#c8925b]/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-[#fdfbf7]">{metrics.inProgressCount}</span>
            <span className="text-xs text-[#a99684]">Active Tasks</span>
          </div>
          <p className="text-[11px] text-[#8e7a6a] mt-3 truncate">
            {metrics.totalHoursEstimated} total estimated hours logged
          </p>
        </div>

        {/* Card 3: Urgent Priority Bottlenecks */}
        <div className="p-4 rounded-xl bg-[#1c1511] border border-[#33261f] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a99684] font-medium">Urgent Queues</span>
            <div className={`p-1.5 rounded-lg border ${metrics.urgentCount > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse' : 'bg-[#2a1e17] text-[#8e7a6a] border-[#382920]'}`}>
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-[#fdfbf7]">{metrics.urgentCount}</span>
            <span className="text-xs text-amber-400 font-medium">Critical Items</span>
          </div>
          <p className="text-[11px] text-[#8e7a6a] mt-3">
            Requires temperature or setting attention
          </p>
        </div>

        {/* Card 4: Continuous Temperer QA */}
        <div className="p-4 rounded-xl bg-[#1c1511] border border-[#33261f] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a99684] font-medium">Tempering QA</span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-[#fdfbf7]">31.8°C</span>
            <span className="text-xs text-sky-400 font-medium">Beta V Crystals</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-3 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Gloss test: Mirror sheen</span>
          </div>
        </div>

      </div>

      {/* Main Content Split: Urgent Critical Path vs Projects In Production */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1 & 2: Urgent Production Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-semibold text-[#fdfbf7] font-serif">
                Today’s High Priority Production Queue
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('priorities')}
              className="text-xs text-[#c8925b] hover:text-[#dfab76] flex items-center gap-1 font-medium"
            >
              <span>View Priority Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {urgentQueue.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-[#1a130f] border border-[#2e2119] text-[#a99684]">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2 opacity-80" />
                <p className="text-sm font-medium text-[#fdfbf7]">All urgent chocolate tasks completed!</p>
                <p className="text-xs mt-1">Review next batch schedule or plan seasonal collections.</p>
              </div>
            ) : (
              urgentQueue.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <div
                    key={task.id}
                    className="group p-4 rounded-xl bg-[#1b1410] hover:bg-[#221914] border border-[#30241c] hover:border-[#4d382c] transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          task.priority === 'urgent'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {task.priority}
                        </span>

                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#261c16] text-[#c8925b] font-medium border border-[#3d2c22]">
                          {task.category}
                        </span>

                        {project && (
                          <span className="text-xs text-[#8e7a6a] truncate">
                            • {project.name}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-[#fdfbf7] group-hover:text-[#dfab76] transition-colors line-clamp-1">
                        {task.title}
                      </h4>

                      <p className="text-xs text-[#a99684] line-clamp-1">
                        {task.description}
                      </p>

                      {task.temperingNote && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-950/40 text-sky-300 border border-sky-500/20 text-[11px]">
                          <Thermometer className="w-3 h-3 text-sky-400" />
                          <span>{task.temperingNote}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className="text-xs text-[#8e7a6a] hidden sm:inline">
                        {task.assignedTo}
                      </span>
                      {task.stage === 'todo' ? (
                        <button
                          onClick={() => moveTaskStage(task.id, 'in-progress')}
                          className="px-3 py-1.5 rounded-lg bg-[#2b1e17] hover:bg-[#38281e] text-[#dfab76] hover:text-[#fdfbf7] border border-[#443126] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Play className="w-3 h-3 text-emerald-400" />
                          <span>Start</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => moveTaskStage(task.id, 'done')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Complete</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Col 3: Active Collections & Lines Snapshot */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#c8925b]" />
              <h3 className="text-base font-semibold text-[#fdfbf7] font-serif">
                Active Projects & Lines
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-[#c8925b] hover:text-[#dfab76] flex items-center gap-1 font-medium"
            >
              <span>All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeProjects.map(proj => {
              const projTasks = tasks.filter(t => t.projectId === proj.id);
              const doneCount = projTasks.filter(t => t.stage === 'done').length;
              const progress = projTasks.length > 0 ? Math.round((doneCount / projTasks.length) * 100) : 0;

              return (
                <div 
                  key={proj.id}
                  className="p-4 rounded-xl bg-[#1b1410] border border-[#30241c] hover:border-[#4d382c] transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#c8925b]">
                        {proj.category}
                      </span>
                      <h4 className="text-sm font-bold text-[#fdfbf7] mt-0.5">
                        {proj.name}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-[#dfab76] bg-[#291e18] px-2 py-0.5 rounded border border-[#3d2e24]">
                      {progress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-[#281c15] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#c8925b] to-[#dfab76] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#8e7a6a] pt-1 border-t border-[#2a1d17]">
                    <span>Target: <strong className="text-[#baa998]">{proj.targetYield}</strong></span>
                    <span>Lead: <strong className="text-[#baa998]">{proj.leadChocolatier}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Launch Callout */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#221813] to-[#18110e] border border-[#38281e] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#dfab76]">
              <Boxes className="w-4 h-4" />
              <span>Need tasks for a new batch?</span>
            </div>
            <p className="text-xs text-[#a99684] leading-relaxed">
              Use CocoaBot to automatically break down single-origin roasting, conching, and molding schedules in seconds.
            </p>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="w-full py-2 rounded-lg bg-[#2d1e16] hover:bg-[#38261c] border border-[#473326] text-xs font-semibold text-[#fdfbf7] transition-colors"
            >
              + Create Custom Task
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
