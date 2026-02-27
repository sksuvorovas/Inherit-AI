import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Task, Project } from '../types';
import { CheckCircle2, Clock, AlertCircle, MoreVertical } from 'lucide-react';

interface KanbanBoardProps {
  projectId: number;
}

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: number, newColumn: Task['column']) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ column: newColumn }),
      });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, column: newColumn } : t));
    } catch (e) {
      console.error(e);
    }
  };

  const columns: { id: Task['column']; label: string; icon: any; color: string }[] = [
    { id: 'todo', label: 'To Do', icon: AlertCircle, color: 'text-zinc-400' },
    { id: 'in-progress', label: 'In Progress', icon: Clock, color: 'text-amber-400' },
    { id: 'done', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  if (loading) return <div className="p-8 text-zinc-500">Loading Command Center...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => (
        <div key={col.id} className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <col.icon className={`w-4 h-4 ${col.color}`} />
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">{col.label}</h3>
            </div>
            <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full">
              {tasks.filter(t => t.column === col.id).length}
            </span>
          </div>

          <div className="flex flex-col gap-3 min-h-[400px] bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50">
            {tasks
              .filter((t) => t.column === col.id)
              .map((task) => (
                <motion.div
                  layout
                  key={task.id}
                  className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-sm group cursor-pointer hover:border-zinc-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-zinc-200 font-medium text-sm leading-tight">{task.title}</h4>
                    <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    {col.id !== 'todo' && (
                      <button 
                        onClick={() => updateTaskStatus(task.id, col.id === 'done' ? 'in-progress' : 'todo')}
                        className="text-[10px] uppercase tracking-tighter font-bold text-zinc-500 hover:text-zinc-300"
                      >
                        Move Back
                      </button>
                    )}
                    {col.id !== 'done' && (
                      <button 
                        onClick={() => updateTaskStatus(task.id, col.id === 'todo' ? 'in-progress' : 'done')}
                        className="text-[10px] uppercase tracking-tighter font-bold text-emerald-500 hover:text-emerald-400 ml-auto"
                      >
                        {col.id === 'todo' ? 'Start' : 'Complete'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
