import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Task } from '../types';
import { 
  Scale, 
  Home, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  User,
  Cpu,
  Briefcase
} from 'lucide-react';

interface WorkstreamBoardProps {
  projectId: number;
  onNavigate: (tab: string) => void;
}

export default function WorkstreamBoard({ projectId, onNavigate }: WorkstreamBoardProps) {
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

  const updateTaskStatus = async (taskId: number, newStatus: Task['status']) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (e) {
      console.error(e);
    }
  };

  const workstreams = [
    { 
      id: 'legal', 
      label: 'Legal Stream', 
      focus: 'Inheritance Title', 
      icon: Scale, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/5',
      borderColor: 'border-blue-400/20'
    },
    { 
      id: 'admin', 
      label: 'Admin Stream', 
      focus: 'Taxes & IDs', 
      icon: ShieldCheck, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/5',
      borderColor: 'border-purple-400/20'
    },
    { 
      id: 'market', 
      label: 'Market Stream', 
      focus: 'The Sale', 
      icon: Home, 
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/5',
      borderColor: 'border-emerald-400/20'
    },
  ];

  if (loading) return <div className="p-8 text-zinc-500">Loading Command Center...</div>;

  return (
    <div className="space-y-12">
      {workstreams.map((ws) => (
        <div key={ws.id} className="space-y-6">
          <div className="flex items-end justify-between px-2">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${ws.bgColor} ${ws.borderColor} border rounded-2xl flex items-center justify-center`}>
                <ws.icon className={`w-6 h-6 ${ws.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{ws.label}</h3>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Focus: {ws.focus}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Stream Health</span>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`w-4 h-1 rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks
              .filter((t) => t.workstream === ws.id)
              .map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onUpdateStatus={updateTaskStatus} 
                  onNavigate={onNavigate}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskCard({ task, onUpdateStatus, onNavigate }: { task: Task, onUpdateStatus: any, onNavigate: any }) {
  const getExecutorIcon = (type: string) => {
    switch (type) {
      case 'ai': return Cpu;
      case 'professional': return Briefcase;
      case 'user': return User;
      default: return User;
    }
  };

  const getExecutorLabel = (type: string) => {
    switch (type) {
      case 'ai': return 'AI-Managed';
      case 'professional': return 'Professional';
      case 'user': return 'User-Action';
      default: return 'Action';
    }
  };

  const ExecutorIcon = getExecutorIcon(task.executor);

  return (
    <motion.div
      layout
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800">
          <ExecutorIcon className="w-3 h-3 text-zinc-500" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
            {getExecutorLabel(task.executor)}: {task.executorName}
          </span>
        </div>
        <StatusBadge status={task.status} />
      </div>

      <h4 className="text-zinc-200 font-bold text-sm leading-snug mb-6 min-h-[40px]">
        {task.title}
      </h4>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
        {task.connection ? (
          <button 
            onClick={() => onNavigate(task.connection!)}
            className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-widest transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Go to {task.connection}
          </button>
        ) : <div />}

        <div className="flex gap-2">
          {task.status === 'pending' && (
            <button 
              onClick={() => onUpdateStatus(task.id, 'active')}
              className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest"
            >
              Start
            </button>
          )}
          {task.status === 'active' && (
            <button 
              onClick={() => onUpdateStatus(task.id, 'completed')}
              className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-widest"
            >
              Complete
            </button>
          )}
          {task.status === 'completed' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: Task['status'] }) {
  switch (status) {
    case 'completed':
      return (
        <div className="flex items-center gap-1 text-emerald-500">
          <CheckCircle2 className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Done</span>
        </div>
      );
    case 'active':
      return (
        <div className="flex items-center gap-1 text-amber-500">
          <Clock className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Active</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1 text-zinc-600">
          <AlertCircle className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Pending</span>
        </div>
      );
  }
}
