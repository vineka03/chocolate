import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Project } from '../types';
import { 
  FolderKanban, 
  Plus, 
  Sparkles, 
  Calendar, 
  Package, 
  User, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Trash2,
  Edit2
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    tasks, 
    addProject, 
    deleteProject, 
    setSelectedProjectId, 
    setActiveTab,
    setIsTaskModalOpen,
    requestAiTaskOrganization,
    bulkAddTasks,
  } = useShop();

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [aiGeneratingProjectId, setAiGeneratingProjectId] = useState<string | null>(null);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [showAiModalForProject, setShowAiModalForProject] = useState<Project | null>(null);

  // New project form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Seasonal Collection',
    status: 'planning' as Project['status'],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    targetYield: '300 Boxes',
    leadChocolatier: 'Éléonore Laurent',
    accentColor: '#c8925b',
    tags: 'Single Origin, Handcrafted',
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addProject({
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      status: formData.status,
      dueDate: formData.dueDate,
      targetYield: formData.targetYield,
      leadChocolatier: formData.leadChocolatier,
      accentColor: formData.accentColor,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    });

    setIsNewProjectModalOpen(false);
    setFormData({
      name: '',
      description: '',
      category: 'Seasonal Collection',
      status: 'planning',
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      targetYield: '300 Boxes',
      leadChocolatier: 'Éléonore Laurent',
      accentColor: '#c8925b',
      tags: 'Single Origin, Handcrafted',
    });
  };

  const handleGenerateAiTasksForProject = async (project: Project) => {
    setAiGeneratingProjectId(project.id);
    const prompt = aiPromptInput.trim() || `Complete production and launch schedule for ${project.name} (${project.description})`;
    
    try {
      const generated = await requestAiTaskOrganization(prompt, project.id);
      if (generated && generated.length > 0) {
        bulkAddTasks(
          generated.map((gt: any) => ({
            title: gt.title || 'Chocolate Batch Task',
            description: gt.description || 'Follow standard operating procedure.',
            projectId: project.id,
            priority: gt.priority || 'high',
            stage: gt.stage || 'todo',
            category: gt.category || 'Tempering',
            estimatedHours: gt.estimatedHours || 2.0,
            assignedTo: project.leadChocolatier,
            dueDate: project.dueDate,
            temperingNote: gt.temperingNote,
            batchNumber: `${project.name.slice(0, 3).toUpperCase()}-B01`,
            subtasks: [],
          }))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiGeneratingProjectId(null);
      setShowAiModalForProject(null);
      setAiPromptInput('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#fdfbf7]">
            Chocolate Collections & Projects
          </h2>
          <p className="text-xs sm:text-sm text-[#baa998] mt-0.5">
            Manage high-end seasonal releases, micro-batch lines, and confections with automated task decomposition.
          </p>
        </div>

        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c8925b] hover:bg-[#d99f66] text-[#120e0c] font-bold text-xs shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection / Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => {
          const projTasks = tasks.filter(t => t.projectId === project.id);
          const doneTasks = projTasks.filter(t => t.stage === 'done');
          const inProgressTasks = projTasks.filter(t => t.stage === 'in-progress');
          const todoTasks = projTasks.filter(t => t.stage === 'todo');
          const progress = projTasks.length > 0 ? Math.round((doneTasks.length / projTasks.length) * 100) : 0;

          return (
            <div
              key={project.id}
              className="rounded-2xl bg-[#1a130f] border border-[#30231b] hover:border-[#4d382c] transition-all shadow-md overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header & Status */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c8925b] px-2 py-0.5 rounded bg-[#261c16] border border-[#3d2e24]">
                        {project.category}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                        project.status === 'in-production'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : project.status === 'curing'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : project.status === 'ready-to-ship'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                      }`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-serif text-[#fdfbf7] mt-1.5">
                      {project.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-[#8e7a6a] hover:text-rose-400 p-1 rounded"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-[#baa998] leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#241a15] text-[#dfab76] border border-[#38281f]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Progress Bar and Task Counts */}
                <div className="space-y-1.5 pt-2 border-t border-[#2a1d17]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#a99684]">Overall Completion</span>
                    <strong className="text-[#fdfbf7]">{progress}%</strong>
                  </div>

                  <div className="w-full h-2 bg-[#251a14] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#c8925b] to-[#dfab76] rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8e7a6a] pt-1">
                    <span>{projTasks.length} total tasks</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{todoTasks.length} to do</span>
                      <span>•</span>
                      <span className="text-amber-400">{inProgressTasks.length} active</span>
                      <span>•</span>
                      <span className="text-emerald-400">{doneTasks.length} done</span>
                    </div>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#2a1d17] text-[11px] text-[#baa998]">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#c8925b]" />
                    <span className="truncate">Yield: {project.targetYield}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#c8925b]" />
                    <span className="truncate">{project.leadChocolatier}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#c8925b]" />
                    <span className="truncate">{project.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-[#150f0c] border-t border-[#2a1d17] flex items-center justify-between gap-2">
                <button
                  onClick={() => setShowAiModalForProject(project)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#271c16] hover:bg-[#34251d] text-[#dfab76] text-xs font-semibold border border-[#433024] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Generate Tasks</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setActiveTab('tasks');
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#c8925b] hover:bg-[#d99f66] text-[#120e0c] text-xs font-bold transition-colors"
                >
                  <span>Open Tasks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Generate Tasks Modal */}
      {showAiModalForProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#1c1511] border border-[#3d2e24] p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#dfab76]" />
                <h3 className="text-base font-bold text-[#fdfbf7] font-serif">
                  AI Task Generation
                </h3>
              </div>
              <button
                onClick={() => setShowAiModalForProject(null)}
                className="text-[#8e7a6a] hover:text-[#fdfbf7]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#baa998] leading-relaxed">
              CocoaBot will generate realistic artisan chocolate tasks (tempering, ganache infusion, mold polishing, enrobing, and packaging) tailored for:
              <br />
              <strong className="text-[#fdfbf7] font-serif">{showAiModalForProject.name}</strong>
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#baa998]">
                Custom Prompt / Focus (Optional):
              </label>
              <textarea
                value={aiPromptInput}
                onChange={e => setAiPromptInput(e.target.value)}
                placeholder="e.g. Focus on hand-piping passionfruit ganache, 12h curing, and gold-leaf stamped ballotin boxing."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-[#251a14] border border-[#3d2e24] text-xs text-[#fdfbf7] placeholder-[#8e7a6a] focus:outline-none focus:border-[#c8925b]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2c1f18]">
              <button
                type="button"
                onClick={() => setShowAiModalForProject(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs text-[#baa998] hover:text-[#fdfbf7]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleGenerateAiTasksForProject(showAiModalForProject)}
                disabled={aiGeneratingProjectId !== null}
                className="px-4 py-2 rounded-lg bg-[#c8925b] hover:bg-[#d99f66] text-[#120e0c] font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{aiGeneratingProjectId ? 'Generating Batch Tasks...' : 'Decompose & Add Tasks'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-[#1c1511] border border-[#3d2e24] p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[#c8925b]" />
                <h3 className="text-base font-bold text-[#fdfbf7] font-serif">
                  New Chocolate Collection / Project
                </h3>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="text-[#8e7a6a] hover:text-[#fdfbf7]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[#baa998] font-medium">Project / Line Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Autumn Truffle & Ganache Tasting Box"
                  className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#baa998] font-medium">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Aromatic profile, single-origin sourcing, presentation..."
                  className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#baa998] font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
                  >
                    <option value="Seasonal Collection">Seasonal Collection</option>
                    <option value="Retail Bars">Retail Bars</option>
                    <option value="Confections">Confections</option>
                    <option value="Showpiece">Showpiece</option>
                    <option value="Catering & Events">Catering & Events</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#baa998] font-medium">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
                  >
                    <option value="planning">Planning</option>
                    <option value="in-production">In Production</option>
                    <option value="curing">Curing</option>
                    <option value="ready-to-ship">Ready to Ship</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#baa998] font-medium">Target Yield</label>
                  <input
                    type="text"
                    value={formData.targetYield}
                    onChange={e => setFormData({ ...formData, targetYield: e.target.value })}
                    placeholder="e.g. 500 Ballotins"
                    className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#baa998] font-medium">Lead Chocolatier</label>
                  <input
                    type="text"
                    value={formData.leadChocolatier}
                    onChange={e => setFormData({ ...formData, leadChocolatier: e.target.value })}
                    className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#baa998] font-medium">Target Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#baa998] font-medium">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2c1f18]">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-[#baa998] hover:text-[#fdfbf7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#c8925b] hover:bg-[#d99f66] text-[#120e0c] font-bold shadow-sm"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
