import React from 'react';
import { Home, Scale, FileText, Layout, PlusCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: Layout },
    { id: 'lawyers', label: 'Pro-Hunter', icon: Scale },
    { id: 'listings', label: 'Listing Engine', icon: Home },
    { id: 'contracts', label: 'Contract Whisperer', icon: FileText },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col gap-8 z-50">
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <Scale className="text-zinc-950 w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Inherit AI</span>
      </div>

      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <button 
          onClick={() => setActiveTab('onboarding')}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 rounded-xl transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          New Inheritance
        </button>
      </div>
    </nav>
  );
}
