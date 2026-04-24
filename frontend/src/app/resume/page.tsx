'use client';

import { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ResumePage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/resume/current');
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || '');
      }
    } catch (err) {
      console.error('Failed to fetch resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('http://localhost:8080/api/resume/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (res.ok) {
        setStatus({ type: 'success', msg: 'Resume updated! Jobs are being re-analyzed.' });
      } else {
        setStatus({ type: 'error', msg: 'Failed to update resume.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Network error. Make sure backend is running.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">My Resume</h1>
        <p className="text-slate-400">Paste your resume text below to find the best matching jobs.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your professional summary, skills, and experience here..."
              className="relative w-full h-[500px] bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono text-sm leading-relaxed"
              disabled={loading}
            />
          </div>

          <div className="flex justify-between items-center">
            {status && (
              <div className={`flex items-center gap-2 text-sm font-medium ${status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {status.msg}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={saving || loading || !content.trim()}
              className="ml-auto flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save & Analyze
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              How it works
            </h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 shrink-0">1</div>
                <span>We extract key skills and experience from your text.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 shrink-0">2</div>
                <span>Every job in the database is compared against your profile.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 shrink-0">3</div>
                <span>You get a "Fit Percentage" score for every job opportunity.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl">
            <p className="text-xs text-indigo-300/80 uppercase font-bold tracking-wider mb-2">Pro Tip</p>
            <p className="text-sm text-indigo-200/70">
              The more detailed your resume text, the more accurate the job recommendations will be!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Sparkles as SparklesIcon } from 'lucide-react';
function Sparkles({ className }: { className?: string }) {
    return <SparklesIcon className={className} />
}
