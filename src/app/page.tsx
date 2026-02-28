"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { generateMotivationalMessage } from '@/ai/flows/generate-motivational-message';
import { PixelCard } from '@/components/pixel/PixelCard';
import { PixelButton } from '@/components/pixel/PixelButton';
import { PixelCheckbox } from '@/components/pixel/PixelCheckbox';
import { PixelTrashIcon, PixelPlusIcon, PixelRobotIcon, PixelHeartIcon, PixelCheckIcon } from '@/components/pixel/PixelIcons';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function PixelTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [motivationalMessage, setMotivationalMessage] = useState('Welcome back, cutie! Ready for some pink productivity?');
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);

  // Stats
  const completedCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
  const totalCount = useMemo(() => tasks.length, [tasks]);

  // Load initial motivation
  useEffect(() => {
    if (totalCount > 0) {
      updateMotivation();
    }
  }, [completedCount, totalCount]);

  const updateMotivation = async () => {
    if (totalCount === 0) return;
    setIsLoadingMessage(true);
    try {
      const result = await generateMotivationalMessage({
        completedTasks: completedCount,
        totalTasks: totalCount
      });
      setMotivationalMessage(result.message);
    } catch (error) {
      console.error("Failed to fetch motivation", error);
    } finally {
      setIsLoadingMessage(false);
    }
  };

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTaskText.trim()) return;
    
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text: newTaskText,
      completed: false
    };
    
    setTasks(prev => [...prev, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-4 animate-float">
          <PixelHeartIcon className="w-10 h-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-pixel font-black pixel-text-shadow tracking-tighter uppercase italic text-primary-foreground">
            Pink<span className="text-primary">Tasks</span>
          </h1>
          <PixelHeartIcon className="w-10 h-10 text-primary" />
        </div>
        <p className="text-primary-foreground/70 font-bold uppercase tracking-widest text-sm">
          A Magical Way to Get Things Done
        </p>
      </div>

      {/* Motivational Banner (GenAI) */}
      <PixelCard variant="pastel" className="relative overflow-hidden border-primary">
        <div className="flex items-start gap-6">
          <div className="shrink-0 bg-white p-4 pixel-border-sm animate-pixel-pop">
            <PixelRobotIcon className="w-12 h-12 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-bold uppercase text-xs tracking-widest text-primary-foreground/60 flex items-center gap-2">
              Cute Bot Support
              <PixelHeartIcon className="w-3 h-3" />
            </h3>
            <p className={cn(
              "text-lg md:text-xl font-medium transition-opacity duration-300 italic",
              isLoadingMessage ? "opacity-50" : "opacity-100"
            )}>
              "{motivationalMessage}"
            </p>
          </div>
        </div>
      </PixelCard>

      {/* Task Input */}
      <PixelCard className="bg-white border-primary shadow-pixel">
        <form onSubmit={addTask} className="flex gap-4">
          <Input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Type a new sweet mission..."
            className="flex-1 h-14 pixel-border-sm text-lg font-medium focus-visible:ring-0 border-primary rounded-none placeholder:text-primary-foreground/60"
          />
          <PixelButton type="submit" size="lg" className="h-14 min-w-[120px] justify-center">
            <PixelPlusIcon className="w-6 h-6" />
            Add
          </PixelButton>
        </form>
      </PixelCard>

      {/* Task List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-black uppercase tracking-tight italic text-primary-foreground">
            Current Missions
          </h2>
          <div className="flex gap-4 text-xs font-bold uppercase">
            <span className="bg-primary/30 px-3 py-2 pixel-border-sm flex items-center gap-2">
              <PixelCheckIcon className="w-4 h-4" /> Done: {completedCount}
            </span>
            <span className="bg-secondary px-3 py-2 pixel-border-sm">
              Total: {totalCount}
            </span>
          </div>
        </div>

        {tasks.length === 0 ? (
          <PixelCard className="bg-white/40 border-dashed border-primary/50 py-20 text-center">
            <p className="text-primary-foreground/50 uppercase font-bold tracking-widest">
              No tasks active. Start a new mission, superstar!
            </p>
          </PixelCard>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <PixelCard
                key={task.id}
                className={cn(
                  "bg-white flex items-center gap-4 transition-all hover:translate-x-1 border-primary",
                  task.completed && "opacity-75 bg-pink-50/50 grayscale-[0.2]"
                )}
              >
                <PixelCheckbox
                  checked={task.completed}
                  onToggle={() => toggleTask(task.id)}
                  className="border-primary"
                />
                <span className={cn(
                  "flex-1 text-xl font-bold transition-all text-primary-foreground",
                  task.completed && "line-through decoration-4 decoration-primary"
                )}>
                  {task.text}
                </span>
                <PixelButton
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  className="w-10 h-10 p-0 flex items-center justify-center border-border shadow-none active:translate-y-1"
                >
                  <PixelTrashIcon className="w-5 h-5" />
                </PixelButton>
              </PixelCard>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className="text-center pt-12 pb-8 opacity-40">
        <p className="text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          PinkTasks v2.0 • Made with <PixelHeartIcon className="w-3 h-3" /> and Pixels
        </p>
      </footer>
    </div>
  );
}
