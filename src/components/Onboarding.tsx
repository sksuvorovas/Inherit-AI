import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingProps {
  onComplete: (projectId: number) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [files, setFiles] = useState<{ [key: string]: boolean }>({
    deathCertificate: false,
    propertyDeed: false
  });
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (type: string) => {
    setFiles(prev => ({ ...prev, [type]: true }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, jurisdiction }),
      });
      const data = await res.json();
      onComplete(data.id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="flex justify-center gap-2 mb-12">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`h-1.5 w-16 rounded-full transition-colors ${step >= s ? 'bg-emerald-500' : 'bg-zinc-800'}`} 
          />
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800"
      >
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to Inherit AI</h2>
              <p className="text-zinc-400">Let's start by identifying the property you've inherited.</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Villa in Marbella"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Jurisdiction (Country)</label>
                <input
                  type="text"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  placeholder="e.g. Spain"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!name || !jurisdiction}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Next Step <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Upload Documentation</h2>
              <p className="text-zinc-400">We need these to verify the inheritance and jurisdiction.</p>
            </div>
            <div className="space-y-4">
              <UploadCard 
                title="Death Certificate" 
                uploaded={files.deathCertificate} 
                onUpload={() => handleFileUpload('deathCertificate')} 
              />
              <UploadCard 
                title="Property Deed (Escritura)" 
                uploaded={files.propertyDeed} 
                onUpload={() => handleFileUpload('propertyDeed')} 
              />
              <button
                onClick={() => setStep(3)}
                disabled={!files.deathCertificate || !files.propertyDeed}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => alert("Please refresh to return to the start screen.")} className="w-full text-zinc-500 text-sm font-bold py-2">Back</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Ready to Launch</h2>
              <p className="text-zinc-400 max-w-sm mx-auto">
                We've identified the jurisdiction as <strong>{jurisdiction}</strong>. Your Command Center is ready.
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating Project...' : 'Enter Command Center'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function UploadCard({ title, uploaded, onUpload }: any) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload();
    }
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all ${uploaded ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-zinc-950 border-zinc-800'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${uploaded ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-600'}`}>
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-xs text-zinc-500">{uploaded ? 'Document verified' : 'Supports PDF, JPG, PNG'}</p>
          </div>
        </div>
        {uploaded ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        ) : (
          <label className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer">
            Upload
            <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
          </label>
        )}
      </div>
    </div>
  );
}
