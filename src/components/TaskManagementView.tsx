import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Task, TaskStage, PriorityLevel, TaskCategory } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Kanban, 
  List, 
  Thermometer, 
  Clock, 
  CheckSquare, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const STAGES: { id: TaskStage; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: 'border-slate-500/30 text-slate-300' },
  { id: 'in-progress', label: 'In Progress', color: 'border-amber-500/30 text-amber-300' },
  { id: 'review', label: 'Quality & Tasting QA', color: 'border-sky-500/30 text-sky-300' },
  { id: 'done', label: 'Completed & Packaged', color: 'border-emerald-500/30 text-emerald-300' },
];

const CATEGORIES: TaskCategory[] = [
  'Tempering',
  'Ganache & Fillings',
  'Molding & Enrobing',
  'Packaging',
  'Inventory & QA',
  'Shop & Retail',
];

export const TaskManagementView: React.FC = () => {
  const { 
    tasks, 
    projects, 
    moveTaskStage, 
    deleteTask, 
    toggleSubtask, 
    setEditingTask, 
    setIsTaskModalOpen,
    setIsAiDrawerOpen,
    selectedProjectId,
    setSelectedProjectId
  } = useShop();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filterPriority, setFilterPriority] = useState<PriorityLevel | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (selectedProjectId && t.projectId !== selectedProjectId) return false;
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesAssignee = t.assignedTo.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAssignee) return false;
      }
      return true;
    });
  }, [tasks, selectedProjectId, filterPriority, filterCategory, searchFilter]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const nextStageMap: Record<TaskStage, TaskStage | null> = {
    'todo': 'in-progress',
    'in-progress': 'review',
    'review': 'done',
    'done': null,
  };

  const prevStageMap: Record<TaskStage, TaskStage | null> = {
    'todo': null,
    'in-progress': 'todo',
    'review': 'in-progress',
    'done': 'review',
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#fdfbf7]">
            Artisan Task Management
          </h2>
          <p className="text-xs sm:text-sm text-[#baa998] mt-0.5">
            Stage-by-stage chocolate production tracking from roasting & continuous tempering to enrobing and boutique boxing.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#1b1410] border border-[#33261f]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-[#c8925b] text-[#120e0c] font-bold shadow-sm'
                  : 'text-[#8e7a6a] hover:text-[#baa998]'
              }`}
              title="Kanban Board"
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#c8925b] text-[#120e0c] font-bold shadow-sm'
                  : 'text-[#8e7a6a] hover:text-[#baa998]'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          {/* AI Task Decomposer */}
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2b1f19] hover:bg-[#382820] border border-[#dfab76]/40 text-xs font-semibold text-[#fdfbf7] shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dfab76]" />
            <span className="hidden sm:inline">AI Organize</span>
          </button>

          {/* New Task Button */}
          <button
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c8925b] hover:bg-[#d99f66] text-xs font-bold text-[#120e0c] shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3 sm:p-4 rounded-xl bg-[#1b1410] border border-[#30241c] flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8e7a6a]" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search task title, description, or assigned chocolatier..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#241a15] border border-[#3d2e24] text-[#fdfbf7] placeholder-[#8e7a6a] focus:outline-none focus:border-[#c8925b]"
          />
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#8e7a6a]">Project:</span>
          <select
            value={selectedProjectId || 'all'}
            onChange={e => setSelectedProjectId(e.target.value === 'all' ? null : e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#241a15] border border-[#3d2e24] text-[#e0cfbe] focus:outline-none focus:border-[#c8925b]"
          >
            <option value="all">All Projects ({projects.length})</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#8e7a6a]">Priority:</span>
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-[#241a15] border border-[#3d2e24] text-[#e0cfbe] focus:outline-none focus:border-[#c8925b]"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#8e7a6a]">Category:</span>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-[#241a15] border border-[#3d2e24] text-[#e0cfbe] focus:outline-none focus:border-[#c8925b]"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Reset filters button if active */}
        {(selectedProjectId || filterPriority !== 'all' || filterCategory !== 'all' || searchFilter) && (
          <button
            onClick={() => {
              setSelectedProjectId(null);
              setFilterPriority('all');
              setFilterCategory('all');
              setSearchFilter('');
            }}
            className="text-xs text-[#c8925b] hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Task Views */}
      {viewMode === 'kanban' ? (
        /* KANBAN BOARD */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {STAGES.map(stage => {
            const stageTasks = filteredTasks.filter(t => t.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="rounded-xl bg-[#17110e] border border-[#2e211a] flex flex-col max-h-[820px] shadow-sm"
              >
                {/* Column Header */}
                <div className={`p-3.5 border-b border-[#2a1e17] flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#fdfbf7]">
                      {stage.label}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-[#261c16] text-[#dfab76] border border-[#3d2d23]">
                      {stageTasks.length}
                    </span>
                  </div>
                  
                  {stage.id === 'todo' && (
                    <button
                      onClick={() => {
                        setEditingTask(null);
                        setIsTaskModalOpen(true);
                      }}
                      className="text-[#8e7a6a] hover:text-[#dfab76] p-1 rounded"
                      title="Add task to To Do"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Column Tasks */}
                <div className="p-3 space-y-3 overflow-y-auto custom-scrollbar flex-1 min-h-[220px]">
                  {stageTasks.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#2d2019] rounded-lg text-xs text-[#8e7a6a]">
                      <span>No tasks in this stage</span>
                    </div>
                  ) : (
                    stageTasks.map(task => {
                      const project = projects.find(p => p.id === task.projectId);
                      const subtaskDone = (task.subtasks || []).filter(st => st.completed).length;
                      const subtaskTotal = (task.subtasks || []).length;
                      const nextStage = nextStageMap[task.stage];
                      const prevStage = prevStageMap[task.stage];

                      return (
                        <div
                          key={task.id}
                          className="p-3.5 rounded-xl bg-[#1f1612] hover:bg-[#251b15] border border-[#35271e] hover:border-[#4f3a2d] transition-all shadow-sm space-y-2.5 group"
                        >
                          {/* Priority and Category header */}
                          <div className="flex items-center justify-between gap-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              task.priority === 'urgent'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : task.priority === 'high'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : task.priority === 'medium'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                            }`}>
                              {task.priority}
                            </span>

                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditTask(task)}
                                className="p-1 text-[#8e7a6a] hover:text-[#dfab76] rounded"
                                title="Edit"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-1 text-[#8e7a6a] hover:text-rose-400 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Title & Description */}
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-[#fdfbf7] leading-snug group-hover:text-[#dfab76] transition-colors">
                              {task.title}
                            </h4>
                            <p className="text-[11px] text-[#a99684] mt-1 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          </div>

                          {/* Tempering Note / Special Temperature Tag */}
                          {task.temperingNote && (
                            <div className="p-1.5 rounded bg-sky-950/30 border border-sky-500/20 text-[10px] text-sky-200 flex items-center gap-1.5">
                              <Thermometer className="w-3 h-3 text-sky-400 shrink-0" />
                              <span className="truncate">{task.temperingNote}</span>
                            </div>
                          )}

                          {/* Subtasks Checklist */}
                          {subtaskTotal > 0 && (
                            <div className="space-y-1 pt-1 border-t border-[#2c1f18]">
                              <div className="flex items-center justify-between text-[10px] text-[#8e7a6a]">
                                <span>Checklist</span>
                                <span>{subtaskDone}/{subtaskTotal}</span>
                              </div>
                              <div className="space-y-1">
                                {task.subtasks?.map(st => (
                                  <label
                                    key={st.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSubtask(task.id, st.id);
                                    }}
                                    className="flex items-center gap-2 text-[11px] text-[#baa998] hover:text-[#fdfbf7] cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={st.completed}
                                      onChange={() => {}}
                                      className="rounded border-[#453226] bg-[#291c16] text-[#c8925b] focus:ring-0 w-3 h-3"
                                    />
                                    <span className={st.completed ? 'line-through text-[#756455]' : ''}>
                                      {st.title}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Project Tag & Category */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                            <span className="px-2 py-0.5 rounded bg-[#2a1d17] text-[#c8925b] font-medium border border-[#3e2c22]">
                              {task.category}
                            </span>
                            {project && (
                              <span className="text-[#8e7a6a] truncate max-w-[120px]">
                                {project.name}
                              </span>
                            )}
                          </div>

                          {/* Footer: Assignee & Stage Shifts */}
                          <div className="pt-2 border-t border-[#2a1e17] flex items-center justify-between text-[11px] text-[#8e7a6a]">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#c8925b]" />
                              <span>{task.estimatedHours}h</span>
                              <span className="mx-1">•</span>
                              <span className="truncate max-w-[90px]">{task.assignedTo}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              {prevStage && (
                                <button
                                  onClick={() => moveTaskStage(task.id, prevStage)}
                                  className="p-1 rounded bg-[#2a1d17] hover:bg-[#38261e] text-[#a99684] hover:text-[#fdfbf7] transition-colors"
                                  title={`Move back to ${prevStage}`}
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                              )}
                              {nextStage && (
                                <button
                                  onClick={() => moveTaskStage(task.id, nextStage)}
                                  className="px-2 py-1 rounded bg-[#2e1f18] hover:bg-[#3d2a20] text-[#dfab76] hover:text-[#fdfbf7] font-semibold flex items-center gap-1 transition-colors border border-[#483327]"
                                  title={`Advance to ${nextStage}`}
                                >
                                  <span>Next</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="rounded-xl bg-[#17110e] border border-[#2e211a] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#d6c7b9]">
              <thead className="bg-[#201712] border-b border-[#2d211a] text-[#8e7a6a] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Task & Recipe Details</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Tempering / QA Note</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#261c16]">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#8e7a6a]">
                      No tasks found matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(task => {
                    const project = projects.find(p => p.id === task.projectId);
                    return (
                      <tr key={task.id} className="hover:bg-[#1f1612] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#fdfbf7]">{task.title}</div>
                          <div className="text-[11px] text-[#8e7a6a] line-clamp-1">{task.description}</div>
                        </td>
                        <td className="py-3 px-4 text-[#baa998] font-medium">
                          {project?.name || 'General'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            task.priority === 'urgent'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : task.priority === 'high'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : task.priority === 'medium'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#c8925b]">
                          {task.category}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-sky-300 max-w-[200px] truncate">
                          {task.temperingNote || '—'}
                        </td>
                        <td className="py-3 px-4 text-[#baa998]">
                          {task.assignedTo} ({task.estimatedHours}h)
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={task.stage}
                            onChange={e => moveTaskStage(task.id, e.target.value as TaskStage)}
                            className="px-2 py-1 rounded bg-[#271c16] border border-[#3b2b20] text-xs text-[#fdfbf7] focus:outline-none"
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Review QA</option>
                            <option value="done">Completed</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-1 text-[#8e7a6a] hover:text-[#dfab76]"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 text-[#8e7a6a] hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
