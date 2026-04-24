import { Job } from './KanbanBoard';

interface JobCardProps {
  job: Job;
  onClick?: (job: Job) => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  // Color code based on fit score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (score >= 50) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  };

  return (
    <div 
      onClick={() => onClick(job)}
      className="group relative flex flex-col gap-3 p-4 rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm 
        hover:bg-slate-700/60 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] 
        transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-slate-100 line-clamp-1">{job.title}</h3>
          <p className="text-sm text-slate-400">{job.company}</p>
        </div>
        <div className={`px-2 py-1 rounded-full border text-xs font-bold ${getScoreColor(job.fitPercentage)}`}>
          {Math.round(job.fitPercentage)}% Fit
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {job.location || 'Remote'}
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span>{job.experienceLevel || 'Not specified'}</span>
      </div>
    </div>
  );
}
