import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Sparkles, 
  X, 
  Send, 
  Trash2, 
  Bot, 
  User, 
  PlusCircle, 
  Thermometer, 
  Clock, 
  Check,
  Flame,
  FileText
} from 'lucide-react';
import { Task } from '../types';

export const AIAssistantDrawer: React.FC = () => {
  const { 
    isAiDrawerOpen, 
    setIsAiDrawerOpen, 
    chatMessages, 
    sendChatMessage, 
    isAiThinking, 
    clearChat,
    addTask,
    projects
  } = useShop();

  const [inputVal, setInputVal] = useState('');
  const [addedTaskIndices, setAddedTaskIndices] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAiDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiThinking, isAiDrawerOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isAiThinking) return;
    sendChatMessage(inputVal.trim());
    setInputVal('');
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isAiThinking) return;
    sendChatMessage(prompt);
  };

  const handleAddSuggestedTask = (taskSuggestion: Partial<Task>, key: string) => {
    addTask({
      title: taskSuggestion.title || 'Artisan Chocolate Batch Task',
      description: taskSuggestion.description || 'Follow standard kitchen procedure.',
      projectId: taskSuggestion.projectId || projects[0]?.id || 'proj-1',
      priority: taskSuggestion.priority || 'high',
      stage: taskSuggestion.stage || 'todo',
      category: taskSuggestion.category || 'Tempering',
      estimatedHours: taskSuggestion.estimatedHours || 1.5,
      assignedTo: taskSuggestion.assignedTo || 'Éléonore Laurent',
      dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      temperingNote: taskSuggestion.temperingNote,
      subtasks: [],
    });
    setAddedTaskIndices(prev => ({ ...prev, [key]: true }));
  };

  if (!isAiDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAiDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#18110e] border-l border-[#35261e] shadow-2xl flex flex-col justify-between animate-slideLeft">
          
          {/* Drawer Header */}
          <div className="p-4 border-b border-[#2d2019] bg-[#1c1410] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c8925b] to-[#8a5229] flex items-center justify-center text-[#120e0c] font-bold shadow">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold font-serif text-[#fdfbf7]">
                    CocoaBot Assistant
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-[#baa998]">
                  Powered by Gemini • Atelier Operations & Recipes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg text-[#8e7a6a] hover:text-[#baa998] hover:bg-[#251b15]"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#8e7a6a] hover:text-[#fdfbf7] hover:bg-[#251b15]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2.5 bg-[#140e0b] border-b border-[#261b15] overflow-x-auto no-scrollbar flex items-center gap-1.5 text-[11px]">
            <button
              onClick={() => handleQuickPrompt("Organize tasks for a 100-box Valentine's Raspberry Ganache batch")}
              className="px-2.5 py-1 rounded-full bg-[#221813] hover:bg-[#2f2019] text-[#dfab76] border border-[#3b2b20] whitespace-nowrap transition-colors"
            >
              ✨ Organize Tasks
            </button>
            <button
              onClick={() => handleQuickPrompt("Prioritize today's kitchen workflow to prevent chocolate bloom")}
              className="px-2.5 py-1 rounded-full bg-[#221813] hover:bg-[#2f2019] text-amber-300 border border-[#3b2b20] whitespace-nowrap transition-colors"
            >
              ⚡ Prioritize Workflow
            </button>
            <button
              onClick={() => handleQuickPrompt("Summarize atelier progress and batch completions")}
              className="px-2.5 py-1 rounded-full bg-[#221813] hover:bg-[#2f2019] text-emerald-300 border border-[#3b2b20] whitespace-nowrap transition-colors"
            >
              📊 Summarize Progress
            </button>
            <button
              onClick={() => handleQuickPrompt("Provide exact tempering curves for 70% dark, milk, and white chocolate")}
              className="px-2.5 py-1 rounded-full bg-[#221813] hover:bg-[#2f2019] text-sky-300 border border-[#3b2b20] whitespace-nowrap transition-colors"
            >
              🌡️ Tempering Curves
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
            {chatMessages.map((msg, idx) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAssistant ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs ${
                      isAssistant
                        ? 'bg-gradient-to-br from-[#c8925b] to-[#7f4a24] text-[#120e0c] font-bold'
                        : 'bg-[#3b2a21] text-[#fdfbf7]'
                    }`}
                  >
                    {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`space-y-2 max-w-[85%] ${isAssistant ? '' : 'text-right'}`}>
                    <div
                      className={`p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap ${
                        isAssistant
                          ? 'bg-[#221813] border border-[#38271e] text-[#fdfbf7] shadow-sm rounded-tl-sm'
                          : 'bg-[#c8925b] text-[#120e0c] font-medium shadow-sm rounded-tr-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* If message has suggested tasks decomposed by AI */}
                    {msg.suggestedTasks && msg.suggestedTasks.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#dfab76] block text-left">
                          Suggested Atelier Tasks ({msg.suggestedTasks.length}):
                        </span>
                        <div className="space-y-1.5 text-left">
                          {msg.suggestedTasks.map((t, tIdx) => {
                            const key = `${msg.id}-${tIdx}`;
                            const isAdded = addedTaskIndices[key];

                            return (
                              <div
                                key={tIdx}
                                className="p-2.5 rounded-xl bg-[#2a1d17] border border-[#443126] space-y-1"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c8925b]">
                                    {t.category || 'Tempering'}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e140f] text-[#baa998]">
                                    {t.priority || 'high'}
                                  </span>
                                </div>

                                <div className="font-semibold text-xs text-[#fdfbf7]">
                                  {t.title}
                                </div>
                                <div className="text-[11px] text-[#baa998] line-clamp-2">
                                  {t.description}
                                </div>

                                {t.temperingNote && (
                                  <div className="text-[10px] text-sky-300 flex items-center gap-1">
                                    <Thermometer className="w-3 h-3" />
                                    <span>{t.temperingNote}</span>
                                  </div>
                                )}

                                <div className="pt-1 flex items-center justify-end">
                                  {isAdded ? (
                                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                                      <Check className="w-3 h-3" /> Added to Board
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleAddSuggestedTask(t, key)}
                                      className="px-2.5 py-1 rounded bg-[#c8925b] hover:bg-[#d99f66] text-[#120e0c] font-bold text-[11px] flex items-center gap-1 transition-colors"
                                    >
                                      <PlusCircle className="w-3 h-3" />
                                      <span>Add Task</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-[#8e7a6a] px-1">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isAiThinking && (
              <div className="flex items-center gap-2 text-xs text-[#dfab76] bg-[#221813] border border-[#38271e] p-3 rounded-2xl w-fit">
                <Sparkles className="w-4 h-4 animate-spin text-[#c8925b]" />
                <span>CocoaBot is consulting chocolate formulation curves...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-[#1a130f] border-t border-[#2e2019] space-y-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Ask to organize tasks, prioritize, or summarize..."
                className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#241a14] border border-[#3d2e24] text-xs text-[#fdfbf7] placeholder-[#8e7a6a] focus:outline-none focus:border-[#c8925b]"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isAiThinking}
                className="absolute right-1.5 p-1.5 rounded-lg bg-[#c8925b] hover:bg-[#d99f66] text-[#120e0c] disabled:opacity-30 transition-all"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[10px] text-[#8e7a6a] flex items-center justify-between px-1">
              <span>Press Enter to send</span>
              <span>Gemini 3.8 Flash</span>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
