'use client';

import { useState, useEffect } from 'react';
import JobCard from '@/components/JobCard';
import { Sparkles, Filter, Search, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/api';

export default function RecommendationsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.JOBS);
      if (res.ok) {
        const data = await res.json();
        // Sort by fit percentage descending
        const sorted = data.sort((a: any, b: any) => b.fitPercentage - a.fitPercentage);
        setJobs(sorted);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-400" />
            Recommended for You
          </h1>
          <p className="text-slate-400 mt-1">Jobs filtered and ranked by your resume match profile.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search matches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64"
            />
          </div>
          <button className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-slate-500 animate-pulse">Analyzing matches...</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300">No matches found</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Try uploading a more detailed resume or syncing new jobs from the dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
