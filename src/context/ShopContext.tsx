import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Task, Project, ChocolateProduct, TaskStage, ViewTab, ChatMessage, PriorityLevel } from '../types';
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_PRODUCTS } from '../data/mockData';

interface ShopContextType {
  tasks: Task[];
  projects: Project[];
  products: ChocolateProduct[];
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  
  // Modals & Drawers
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (open: boolean) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStage: (id: string, newStage: TaskStage) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  bulkAddTasks: (newTasks: Array<Omit<Task, 'id' | 'createdAt'>>) => void;

  // Project actions
  addProject: (project: Omit<Project, 'id'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Product actions
  updateProductStock: (id: string, newStock: number) => void;

  // AI Assistant
  chatMessages: ChatMessage[];
  isAiThinking: boolean;
  sendChatMessage: (text: string) => Promise<void>;
  requestAiTaskOrganization: (prompt: string, projectId?: string) => Promise<any[]>;
  requestAiPrioritization: () => Promise<{ recommendation: string; topTaskIds: string[]; bottleneckAlerts: string[] }>;
  requestAiProgressSummary: () => Promise<{ summary: string; highlights: string[]; nextImmediateAction: string }>;
  clearChat: () => void;

  // Metrics
  metrics: {
    totalTasks: number;
    completedCount: number;
    inProgressCount: number;
    todoCount: number;
    urgentCount: number;
    completionRate: number;
    totalHoursEstimated: number;
    activeProjectsCount: number;
  };
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  TASKS: 'modern_choc_tasks_v1',
  PROJECTS: 'modern_choc_projects_v1',
  PRODUCTS: 'modern_choc_products_v1',
  CHAT: 'modern_choc_chat_v1',
};

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load tasks with local storage fallback
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Load projects
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  // Load products
  const [products, setProducts] = useState<ChocolateProduct[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Load chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CHAT);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: `Bonjour! I am **CocoaBot**, your Chocolatier & Operations Assistant at the Modern Chocolate Shop.\n\nI can help you:\n- **Organize & decompose** custom chocolate batch tasks\n- **Prioritize** workflow according to tempering temperature and crystallization windows\n- **Summarize progress** across all ongoing seasonal lines\n\nHow may I support the atelier today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Modals
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [chatMessages]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setIsAiDrawerOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Task Actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      subtasks: taskData.subtasks || [],
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const bulkAddTasks = (newTasks: Array<Omit<Task, 'id' | 'createdAt'>>) => {
    const created = newTasks.map((t, index) => ({
      ...t,
      id: `task-${Date.now()}-${index}`,
      createdAt: new Date().toISOString().split('T')[0],
      subtasks: t.subtasks || [],
    }));
    setTasks(prev => [...created, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTaskStage = (id: string, newStage: TaskStage) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, stage: newStage } : t)));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId || !t.subtasks) return t;
        return {
          ...t,
          subtasks: t.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          ),
        };
      })
    );
  };

  // Project Actions
  const addProject = (projectData: Omit<Project, 'id'>): Project => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    // Also reassign or leave tasks
  };

  // Product Actions
  const updateProductStock = (id: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              inStock: Math.max(0, newStock),
              status: newStock === 0 ? 'Low Stock' : newStock < 40 ? 'Low Stock' : 'Available',
            }
          : p
      )
    );
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedCount = tasks.filter(t => t.stage === 'done').length;
    const inProgressCount = tasks.filter(t => t.stage === 'in-progress').length;
    const todoCount = tasks.filter(t => t.stage === 'todo').length;
    const urgentCount = tasks.filter(t => t.priority === 'urgent' && t.stage !== 'done').length;
    const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    const totalHoursEstimated = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const activeProjectsCount = projects.filter(p => p.status !== 'completed').length;

    return {
      totalTasks,
      completedCount,
      inProgressCount,
      todoCount,
      urgentCount,
      completionRate,
      totalHoursEstimated,
      activeProjectsCount,
    };
  }, [tasks, projects]);

  // AI Chat and Actions
  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAiThinking(true);

    try {
      const urgentTitles = tasks.filter(t => t.priority === 'urgent').map(t => t.title);
      const activeProjNames = projects.map(p => p.name);

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            totalTasks: metrics.totalTasks,
            inProgressCount: metrics.inProgressCount,
            completedCount: metrics.completedCount,
            completionRate: metrics.completionRate,
            urgentTasks: urgentTitles,
            activeProjects: activeProjNames,
          },
        }),
      });

      const data = await res.json();
      const assistantText = data.text || "I'm ready to assist you with the chocolate production workflow.";

      // Check if the user query was asking to organize/make tasks
      let suggestedTasks: any[] | undefined = undefined;
      const lower = text.toLowerCase();
      if (lower.includes('create task') || lower.includes('organize task') || lower.includes('batch plan') || lower.includes('break down')) {
        try {
          const orgRes = await fetch('/api/ai/organize-tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: text,
              projectId: selectedProjectId || projects[0]?.id,
              existingTasks: tasks,
            }),
          });
          const orgData = await orgRes.json();
          if (orgData.tasks && Array.isArray(orgData.tasks) && orgData.tasks.length > 0) {
            suggestedTasks = orgData.tasks;
          }
        } catch (e) {
          console.warn("Organize tasks subcall:", e);
        }
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTasks,
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: "I experienced an issue reaching the atelier intelligence server. Please check your network or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const requestAiTaskOrganization = async (prompt: string, projectId?: string) => {
    setIsAiThinking(true);
    try {
      const res = await fetch('/api/ai/organize-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          projectId: projectId || selectedProjectId || projects[0]?.id,
          existingTasks: tasks,
        }),
      });
      const data = await res.json();
      return data.tasks || [];
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      setIsAiThinking(false);
    }
  };

  const requestAiPrioritization = async () => {
    setIsAiThinking(true);
    try {
      const res = await fetch('/api/ai/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, projects }),
      });
      return await res.json();
    } catch (e) {
      console.error(e);
      return {
        recommendation: "Focus on in-progress batch tempering first, then proceed to packaging assembly.",
        topTaskIds: tasks.slice(0, 3).map(t => t.id),
        bottleneckAlerts: ["Allow 12-hour setting time for all ganache slabs"],
      };
    } finally {
      setIsAiThinking(false);
    }
  };

  const requestAiProgressSummary = async () => {
    setIsAiThinking(true);
    try {
      const res = await fetch('/api/ai/summarize-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, projects, metrics }),
      });
      return await res.json();
    } catch (e) {
      console.error(e);
      return {
        summary: `The atelier is currently executing at ${metrics.completionRate}% completion with ${metrics.completedCount} finished tasks.`,
        highlights: [
          "Single-Origin roasting and winnowing line completed on schedule",
          "Ambient kitchen temperature is ideal at 19.5°C for crystallization",
        ],
        nextImmediateAction: "Complete the continuous tempering calibration before lunch.",
      };
    } finally {
      setIsAiThinking(false);
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history cleared. What chocolate batch or operational schedule would you like to explore?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <ShopContext.Provider
      value={{
        tasks,
        projects,
        products,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedProjectId,
        setSelectedProjectId,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isTaskModalOpen,
        setIsTaskModalOpen,
        editingTask,
        setEditingTask,
        isProjectModalOpen,
        setIsProjectModalOpen,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStage,
        toggleSubtask,
        bulkAddTasks,
        addProject,
        updateProject,
        deleteProject,
        updateProductStock,
        chatMessages,
        isAiThinking,
        sendChatMessage,
        requestAiTaskOrganization,
        requestAiPrioritization,
        requestAiProgressSummary,
        clearChat,
        metrics,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
