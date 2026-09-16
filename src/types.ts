export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';

export type TaskStage = 'todo' | 'in-progress' | 'review' | 'done';

export type TaskCategory = 
  | 'Tempering' 
  | 'Ganache & Fillings' 
  | 'Molding & Enrobing' 
  | 'Packaging' 
  | 'Inventory & QA' 
  | 'Shop & Retail';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  priority: PriorityLevel;
  stage: TaskStage;
  category: TaskCategory;
  estimatedHours: number;
  assignedTo: string;
  dueDate: string;
  temperingNote?: string;
  subtasks?: Subtask[];
  batchNumber?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'planning' | 'in-production' | 'curing' | 'ready-to-ship' | 'completed';
  dueDate: string;
  targetYield: string; // e.g. "300 Boxes", "450 Bars"
  leadChocolatier: string;
  accentColor: string;
  tags: string[];
}

export interface ChocolateProduct {
  id: string;
  name: string;
  cacaoPercentage: number;
  origin: string;
  flavorNotes: string[];
  type: 'Bonbon' | 'Bar' | 'Truffle' | 'Praline' | 'Confection';
  price: number;
  inStock: number;
  batchCode: string;
  temperingTemp: string;
  status: 'Available' | 'In Production' | 'Low Stock';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedTasks?: Partial<Task>[];
}

export type ViewTab = 'dashboard' | 'tasks' | 'projects' | 'priorities' | 'analytics' | 'catalog';
