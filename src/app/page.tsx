"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { generateMotivationalMessage } from '@/ai/flows/generate-motivational-message';
import { PixelCard } from '@/components/pixel/PixelCard';
import { PixelButton } from '@/components/pixel/PixelButton';
import { PixelCheckbox } from '@/components/pixel/PixelCheckbox';
import { PixelTrashIcon, PixelPlusIcon, PixelRobotIcon } from '@/components/pixel/PixelIcons';
import { Input } from '@/components/ui/input';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function PixelTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [motivationalMessage, setMotivationalMessage] = useState('Welcome to PixelTasks! Start by adding your first mission.');
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
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-headline font-black pixel-text-shadow tracking-tighter uppercase italic">
          Pixel<span className="text-primary">Tasks</span>
        </h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">
          Level Up Your Productivity
        </p>
      </div>

      {/* Motivational Banner (GenAI) */}
      <PixelCard variant="pastel" className="relative overflow-hidden">
        <div className="flex items-start gap-6">
          <div className="shrink-0 bg-secondary p-4 pixel-border-sm animate-pixel-pop">
            <PixelRobotIcon className="w-12 h-12" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-bold uppercase text-xs tracking-widest text-secondary-foreground">
              Mission Support AI
            </h3>
            <p className={cn(
              "text-lg md:text-xl font-medium transition-opacity duration-300",
              isLoadingMessage ? "opacity-50" : "opacity-100"
            )}>
              "{motivationalMessage}"
            </p>
          </div>
        </div>
      </PixelCard>

      {/* Task Input */}
      <PixelCard className="bg-white">
        <form onSubmit={addTask} className="flex gap-4">
          <Input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Enter a new mission..."
            className="flex-1 h-14 pixel-border-sm text-lg font-medium focus-visible:ring-0 border-black rounded-none"
          />
          <PixelButton type="submit" size="lg" className="h-14">
            <PixelPlusIcon className="w-6 h-6 mr-2" />
            Add
          </PixelButton>
        </form>
      </PixelCard>

      {/* Task List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-black uppercase tracking-tight italic">
            Current Missions
          </h2>
          <div className="flex gap-4 text-sm font-bold uppercase">
            <span className="bg-primary/20 px-3 py-1 pixel-border-sm">
              Done: {completedCount}
            </span>
            <span className="bg-secondary/20 px-3 py-1 pixel-border-sm">
              Total: {totalCount}
            </span>
          </div>
        </div>

        {tasks.length === 0 ? (
          <PixelCard className="bg-white/50 border-dashed border-gray-400 py-20 text-center">
            <p className="text-muted-foreground uppercase font-bold tracking-widest">
              No tasks active. Start a new mission!
            </p>
          </PixelCard>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <PixelCard
                key={task.id}
                className={cn(
                  "bg-white flex items-center gap-4 transition-all hover:translate-x-1",
                  task.completed && "opacity-75 bg-gray-50 grayscale-[0.5]"
                )}
              >
                <PixelCheckbox
                  checked={task.completed}
                  onToggle={() => toggleTask(task.id)}
                />
                <span className={cn(
                  "flex-1 text-xl font-bold transition-all",
                  task.completed && "line-through decoration-4 decoration-primary"
                )}>
                  {task.text}
                </span>
                <PixelButton
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  className="w-10 h-10 p-0 flex items-center justify-center"
                >
                  <PixelTrashIcon className="w-5 h-5" />
                </PixelButton>
              </PixelCard>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className="text-center pt-12 pb-8 opacity-50">
        <p className="text-xs font-bold uppercase tracking-widest">
          PixelTasks v1.0 • Built for Pixel Perfectionists
        </p>
      </footer>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
