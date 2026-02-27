import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Scale, Home, ShieldCheck, Globe } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [showChoices, setShowChoices] = React.useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 overflow-hidden selection:bg-emerald-500/30 flex flex-col items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-4xl px-6"
      >
        {!showChoices ? (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Scale className="w-3 h-3" />
              Inherit AI • Start Screen
            </div>
            
            <h1 className="text-7xl md:text-9xl font-bold text-white tracking-tighter mb-8 leading-[0.9]">
              Inherit <span className="text-emerald-500">AI.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Automate the legal onboarding and marketing of inherited foreign property.
            </p>

            <button 
              onClick={() => setShowChoices(true)}
              className="group bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-12 py-6 rounded-2xl font-bold text-xl transition-all flex items-center gap-3 shadow-lg shadow-emerald-500/20 mx-auto"
            >
              Get Started
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                Congratulations on inheriting a property!
              </h2>
              <p className="text-xl text-zinc-400">What would you like to do next?</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button 
                onClick={() => alert("This feature is coming soon! For now, we focus on helping you sell inherited assets.")}
                className="flex-1 max-w-sm bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-8 rounded-3xl transition-all group text-left"
              >
                <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                  <Home className="w-6 h-6 text-zinc-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">I want to inherit it</h3>
                <p className="text-zinc-500 leading-relaxed">Manage the legal transfer and keep the property in your name.</p>
              </button>

              <button 
                onClick={onStart}
                className="flex-1 max-w-sm bg-emerald-500 hover:bg-emerald-400 p-8 rounded-3xl transition-all group text-left shadow-lg shadow-emerald-500/10"
              >
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-400/20">
                  <ArrowRight className="w-6 h-6 text-zinc-950" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-950 mb-2">Help me sell it</h3>
                <p className="text-emerald-900 leading-relaxed">Automate the legal vetting and market the property for a quick sale.</p>
              </button>
            </div>
            
            <button 
              onClick={() => setShowChoices(false)}
              className="text-zinc-500 hover:text-zinc-300 font-bold text-sm uppercase tracking-widest"
            >
              Back to Start
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-emerald-500/30 transition-colors group">
      <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800 group-hover:border-emerald-500/50 transition-colors">
        <Icon className="w-6 h-6 text-emerald-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
