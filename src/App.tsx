import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WorkstreamBoard from './components/WorkstreamBoard';
import LawyerSearch from './components/LawyerSearch';
import ListingGenerator from './components/ListingGenerator';
import ContractWhisperer from './components/ContractWhisperer';
import Onboarding from './components/Onboarding';
import LandingPage from './components/LandingPage';
import { Project } from './types';
import { Layout, ChevronRight, Scale } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
      if (data.length > 0) {
        if (!selectedProjectId) setSelectedProjectId(data[0].id);
        setView('app');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOnboardingComplete = (projectId: number) => {
    fetchProjects();
    setSelectedProjectId(projectId);
    setActiveTab('dashboard');
    setView('app');
  };

  if (view === 'landing') {
    return <LandingPage onStart={() => {
      if (projects.length > 0) {
        setView('app');
      } else {
        setView('app');
        setActiveTab('onboarding');
      }
    }} />;
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-emerald-500/30">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          
          {activeTab === 'onboarding' ? (
            <Onboarding onComplete={handleOnboardingComplete} />
          ) : (
            <>
              <header className="mb-12 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium mb-2">
                    <span>Projects</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-zinc-300">{selectedProject?.name || 'Select Project'}</span>
                  </div>
                  <h1 className="text-4xl font-bold text-white tracking-tight">
                    {activeTab === 'dashboard' && 'Command Center'}
                    {activeTab === 'lawyers' && 'Pro-Hunter Legal'}
                    {activeTab === 'listings' && 'Listing Engine'}
                    {activeTab === 'contracts' && 'Contract Whisperer'}
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <select 
                    value={selectedProjectId || ''} 
                    onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                    className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                    {projects.length === 0 && <option disabled>No projects yet</option>}
                  </select>
                </div>
              </header>

              <div className="space-y-12">
                {activeTab === 'dashboard' && (
                  selectedProjectId ? (
                    <div className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Jurisdiction" value={selectedProject?.jurisdiction || 'Unknown'} icon={Scale} />
                        <StatCard title="Status" value="Active Inheritance" icon={Layout} />
                        <StatCard title="Last Update" value="Just now" icon={Layout} />
                      </div>
                      <WorkstreamBoard 
                        projectId={selectedProjectId} 
                        onNavigate={(tab) => setActiveTab(tab)}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                      <p className="text-zinc-500">No projects found. Start by creating a new inheritance.</p>
                      <button 
                        onClick={() => setActiveTab('onboarding')}
                        className="mt-4 text-emerald-500 font-bold hover:text-emerald-400"
                      >
                        Start Onboarding
                      </button>
                    </div>
                  )
                )}

                {activeTab === 'lawyers' && <LawyerSearch />}
                {activeTab === 'listings' && <ListingGenerator />}
                {activeTab === 'contracts' && <ContractWhisperer />}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-4 h-4 text-zinc-500" />
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
