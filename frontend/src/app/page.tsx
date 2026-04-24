'use client';

import { useState, useEffect } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import { Loader2, RefreshCw } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/api';

export default function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.JOBS);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    // In a real scenario, this would trigger the Apify scraper
    // For now we'll just simulate a delay or call the webhook if we had the data
    setTimeout(() => {
      setSyncing(false);
      fetchJobs();
    }, 2000);
  };

  return (
    <main className="flex flex-col gap-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
            JobTracker Dashboard
          </h1>
          <p className="text-slate-400">Manage your application pipeline and track status.</p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-sm font-medium text-slate-200 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Sync Jobs
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4">
          <KanbanBoard initialJobs={jobs} />
        </div>
      )}
    </main>
  );
}
