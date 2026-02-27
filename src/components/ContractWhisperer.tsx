import React, { useState } from 'react';
import { geminiService } from '../services/gemini';
import { ContractAnalysis } from '../types';
import { FileText, ShieldAlert, BadgePercent, Landmark, AlertTriangle, Upload, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContractWhisperer() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await geminiService.analyzeContract(image);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">The Contract Whisperer</h2>
        <p className="text-zinc-400">OCR + AI Analysis to flag liabilities, taxes, and commissions in plain English.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="bg-zinc-900 p-8 rounded-3xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
            {image ? (
              <div className="absolute inset-0">
                <img src={image} alt="Contract" className="w-full h-full object-contain opacity-50" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
                  <button 
                    onClick={() => setImage(null)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Document'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
                  <Upload className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Upload Contract or "Arras"</h3>
                <p className="text-zinc-500 max-w-xs mb-8">
                  Upload a clear photo or scan of the legal document for instant analysis.
                </p>
                <label className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-xl font-bold cursor-pointer transition-colors">
                  Select File
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleUpload} />
                </label>
              </>
            )}
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl flex items-start gap-4">
            <ShieldAlert className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-emerald-400 font-bold text-sm mb-1">Safety First</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                This analysis is for informational purposes only. Always discuss these findings with your local probate lawyer before signing any binding agreements.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {analysis ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Executive Summary
                </h3>
                <p className="text-zinc-300 leading-relaxed">{analysis.summary}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <AnalysisCard 
                  title="Seller Liabilities" 
                  items={analysis.liabilities} 
                  icon={AlertTriangle} 
                  color="text-amber-400" 
                  bgColor="bg-amber-400/5"
                  borderColor="border-amber-400/20"
                />
                <AnalysisCard 
                  title="Tax Withholding" 
                  items={analysis.taxes} 
                  icon={Landmark} 
                  color="text-blue-400" 
                  bgColor="bg-blue-400/5"
                  borderColor="border-blue-400/20"
                />
                <AnalysisCard 
                  title="Commissions" 
                  items={analysis.commissions} 
                  icon={BadgePercent} 
                  color="text-emerald-400" 
                  bgColor="bg-emerald-400/5"
                  borderColor="border-emerald-400/20"
                />
                <AnalysisCard 
                  title="Red Flags" 
                  items={analysis.redFlags} 
                  icon={AlertTriangle} 
                  color="text-red-400" 
                  bgColor="bg-red-400/5"
                  borderColor="border-red-400/20"
                />
              </div>
            </motion.div>
          ) : (
            <div className="h-full bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-center p-12">
              <FileText className="w-12 h-12 text-zinc-800 mb-4" />
              <p className="text-zinc-600">Analysis results will appear here after document processing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnalysisCard({ title, items, icon: Icon, color, bgColor, borderColor }: any) {
  return (
    <div className={`${bgColor} ${borderColor} border p-5 rounded-2xl`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-5 h-5 ${color}`} />
        <h4 className={`font-bold text-sm ${color} uppercase tracking-wider`}>{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.length > 0 ? items.map((item: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-zinc-600 flex-shrink-0" />
            <span>{item}</span>
          </li>
        )) : (
          <li className="text-zinc-500 text-sm italic">No specific items detected.</li>
        )}
      </ul>
    </div>
  );
}
