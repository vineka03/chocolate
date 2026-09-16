import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Task, TaskStage, PriorityLevel, TaskCategory } from '../types';
import { CheckSquare, X, Thermometer, Clock, Calendar, User, Sparkles } from 'lucide-react';

const CATEGORIES: TaskCategory[] = [
  'Tempering',
  'Ganache & Fillings',
  'Molding & Enrobing',
  'Packaging',
  'Inventory & QA',
  'Shop & Retail',
];

const TEMPERING_PRESETS = [
  'Dark 72%: Melt 52°C, Cool 28°C, Work at 31.8°C',
  'Milk 40%: Melt 45°C, Cool 27°C, Work at 29.5°C',
  'White 34%: Melt 42°C, Cool 26°C, Work at 28.5°C',
  'Ganache Slab: Cast at 32°C, Rest at 16°C for 12h',
  'Polycarbonate Mold: Pre-warm to 21°C before spraying',
];

export const TaskModal: React.FC = () => {
  const { 
    isTaskModalOpen, 
    setIsTaskModalOpen, 
    editingTask, 
    setEditingTask, 
    addTask, 
    updateTask, 
    projects 
  } = useShop();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('high');
  const [stage, setStage] = useState<TaskStage>('todo');
  const [category, setCategory] = useState<TaskCategory>('Tempering');
  const [estimatedHours, setEstimatedHours] = useState(2.0);
  const [assignedTo, setAssignedTo] = useState('Éléonore Laurent');
  const [dueDate, setDueDate] = useState('');
  const [temperingNote, setTemperingNote] = useState('');
  const [batchNumber, setBatchNumber] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setProjectId(editingTask.projectId || projects[0]?.id || 'proj-1');
      setPriority(editingTask.priority);
      setStage(editingTask.stage);
      setCategory(editingTask.category);
      setEstimatedHours(editingTask.estimatedHours || 2.0);
      setAssignedTo(editingTask.assignedTo || 'Éléonore Laurent');
      setDueDate(editingTask.dueDate || new Date().toISOString().split('T')[0]);
      setTemperingNote(editingTask.temperingNote || '');
      setBatchNumber(editingTask.batchNumber || '');
    } else {
      setTitle('');
      setDescription('');
      setProjectId(projects[0]?.id || 'proj-1');
      setPriority('high');
      setStage('todo');
      setCategory('Tempering');
      setEstimatedHours(2.0);
      setAssignedTo('Éléonore Laurent');
      setDueDate(new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]);
      setTemperingNote('');
      setBatchNumber(`LOT-${new Date().getMonth() + 1}${new Date().getDate()}`);
    }
  }, [editingTask, projects, isTaskModalOpen]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask && editingTask.id) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        projectId,
        priority,
        stage,
        category,
        estimatedHours: Number(estimatedHours),
        assignedTo,
        dueDate,
        temperingNote: temperingNote.trim() || undefined,
        batchNumber: batchNumber.trim() || undefined,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        projectId,
        priority,
        stage,
        category,
        estimatedHours: Number(estimatedHours),
        assignedTo,
        dueDate,
        temperingNote: temperingNote.trim() || undefined,
        batchNumber: batchNumber.trim() || undefined,
        subtasks: [],
      });
    }

    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-[#1c1410] border border-[#3d2c22] p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d2019]">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#c8925b]" />
            <h3 className="text-base font-bold font-serif text-[#fdfbf7]">
              {editingTask && editingTask.id ? 'Edit Chocolate Task' : 'New Atelier Batch Task'}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsTaskModalOpen(false);
              setEditingTask(null);
            }}
            className="text-[#8e7a6a] hover:text-[#fdfbf7]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div className="space-y-1">
            <label className="text-[#baa998] font-medium">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Enrobe Fleur de Sel Salted Caramels in 65% Dark"
              className="w-full p-2.5 rounded-xl bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] placeholder-[#8e7a6a] focus:outline-none focus:border-[#c8925b]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#baa998] font-medium">Description & Formulation</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Specific temperatures, chocolate origins, humidity levels..."
              className="w-full p-2.5 rounded-xl bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] placeholder-[#8e7a6a] focus:outline-none focus:border-[#c8925b]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#baa998] font-medium">Project / Collection</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#baa998] font-medium">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#baa998] font-medium">Priority Level</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
              >
                <option value="urgent">Urgent (Immediate Crystallization/Run)</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#baa998] font-medium">Initial Stage</label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Quality Review / QA</option>
                <option value="done">Completed</option>
              </select>
            </div>
          </div>

          {/* Tempering Note with Quick Preset Pills */}
          <div className="space-y-1.5 p-3 rounded-xl bg-[#221813] border border-[#38271e]">
            <label className="text-[#baa998] font-medium flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-sky-400" />
              <span>Tempering Curve & Temperature Note</span>
            </label>
            <input
              type="text"
              value={temperingNote}
              onChange={e => setTemperingNote(e.target.value)}
              placeholder="e.g. Dark 72%: Melt 52°C, Cool 28°C, Work at 31.8°C"
              className="w-full p-2 rounded-lg bg-[#1c130f] border border-[#3d2c22] text-xs text-sky-200 placeholder-[#756253] focus:outline-none focus:border-sky-500"
            />
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[10px] text-[#8e7a6a] self-center">Presets:</span>
              {TEMPERING_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTemperingNote(preset)}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#2e1f18] hover:bg-[#3d2b21] text-[#dfab76] border border-[#443126]"
                >
                  {preset.split(':')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[#baa998] font-medium">Estimated Hours</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={estimatedHours}
                onChange={e => setEstimatedHours(parseFloat(e.target.value) || 1)}
                className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#baa998] font-medium">Assigned Chocolatier</label>
              <input
                type="text"
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#baa998] font-medium">Target Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#251a14] border border-[#3d2e24] text-[#fdfbf7] focus:outline-none focus:border-[#c8925b]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2c1f18]">
            <button
              type="button"
              onClick={() => {
                setIsTaskModalOpen(false);
                setEditingTask(null);
              }}
              className="px-3.5 py-2 rounded-xl text-[#baa998] hover:text-[#fdfbf7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#c8925b] hover:bg-[#d99f66] text-[#120e0c] font-bold text-xs shadow-sm transition-colors"
            >
              {editingTask && editingTask.id ? 'Save Changes' : 'Create Task'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
