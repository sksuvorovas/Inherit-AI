import React, { useState } from 'react';
import { geminiService } from '../services/gemini';
import { Image as ImageIcon, Wand2, Globe, Send } from 'lucide-react';
import Markdown from 'react-markdown';

export default function ListingGenerator() {
  const [description, setDescription] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [listing, setListing] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (!description || !targetCountry) return;
    setLoading(true);
    try {
      const result = await geminiService.generateListing(description, images, targetCountry);
      setListing(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">Multilingual Listing Engine</h2>
        <p className="text-zinc-400">Convert photos and basic descriptions into high-end, localized real estate copy.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Target Market / Country</label>
              <div className="relative">
                <Globe className="absolute left-4 top-3.5 w-5 h-5 text-zinc-600" />
                <input
                  type="text"
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  placeholder="e.g. Italy (Lifestyle focus), Germany (Formal)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Property Details (English)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the property, number of rooms, unique features..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors h-40 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Property Photos</label>
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-zinc-800 relative group">
                    <img src={img} alt="Property" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button 
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-lg border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <ImageIcon className="w-6 h-6 text-zinc-600 mb-1" />
                  <span className="text-[10px] font-bold text-zinc-600 uppercase">Add Photo</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !description || !targetCountry}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Generating...' : <><Wand2 className="w-5 h-5" /> Generate Localized Listing</>}
            </button>
          </div>
        </div>

        <div className="bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden flex flex-col min-h-[600px]">
          <div className="bg-zinc-900/50 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">AI Generated Preview</span>
            {listing && (
              <button className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 text-xs font-bold">
                <Send className="w-4 h-4" /> Publish to Portals
              </button>
            )}
          </div>
          <div className="p-8 flex-1 overflow-y-auto">
            {listing ? (
              <div className="prose prose-invert max-w-none">
                <Markdown>{listing}</Markdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                  <Wand2 className="w-8 h-8 text-zinc-700" />
                </div>
                <p className="text-zinc-600 max-w-xs">
                  Your localized listing will appear here after generation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
