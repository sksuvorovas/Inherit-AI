import React, { useState } from 'react';
import { geminiService } from '../services/gemini';
import { Lawyer } from '../types';
import { Search, Star, MapPin, Mail, Copy, Check, Scale } from 'lucide-react';
import { motion } from 'motion/react';

export default function LawyerSearch() {
  const [jurisdiction, setJurisdiction] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jurisdiction || !postalCode) return;
    
    setLoading(true);
    try {
      const results = await geminiService.findLawyers(jurisdiction, postalCode);
      setLawyers(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">Pro-Hunter Legal Vetting</h2>
        <p className="text-zinc-400">Find and vet top-rated local probate lawyers with cross-border expertise.</p>
      </div>

      <form onSubmit={handleSearch} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-12 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Jurisdiction (Country)</label>
          <input
            type="text"
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            placeholder="e.g. Spain, Italy, Portugal"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Postal Code / Region</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="e.g. 28001, Tuscany"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Searching...' : <><Search className="w-5 h-5" /> Search Lawyers</>}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers.map((lawyer, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">{lawyer.name}</h3>
                <p className="text-emerald-400 text-sm font-medium">{lawyer.firm}</p>
              </div>
              <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-zinc-300">{lawyer.rating}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-start gap-2 text-zinc-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{lawyer.location}</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-400 text-sm">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="break-all">{lawyer.contact}</span>
              </div>
              <p className="text-zinc-500 text-sm italic leading-relaxed">
                "{lawyer.description}"
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Inquiry Draft</span>
                <button 
                  onClick={() => copyToClipboard(lawyer.emailDraft, idx)}
                  className="text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 max-h-32 overflow-y-auto scrollbar-hide">
                <p className="text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed">
                  {lawyer.emailDraft}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {lawyers.length === 0 && !loading && (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
          <Scale className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">Enter a jurisdiction to find vetted legal experts.</p>
        </div>
      )}
    </div>
  );
}


