import { Job } from './KanbanBoard';

interface JobModalProps {
  job: Job;
  onClose: () => void;
  onStatusChange: (status: Job['applicationState']) => void;
}

export default function JobModal({ job, onClose, onStatusChange }: JobModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/30">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-100">{job.title}</h2>
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-semibold">
                {Math.round(job.fitPercentage)}% Match
              </span>
            </div>
            <p className="text-lg text-slate-400">{job.company} • {job.location}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="prose prose-invert max-w-none text-slate-300">
            <h3 className="text-slate-200">Job Description</h3>
            <div className="whitespace-pre-wrap font-light leading-relaxed">{job.description}</div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="flex gap-2">
            <select 
              value={job.applicationState} 
              onChange={e => onStatusChange(e.target.value as Job['applicationState'])}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="SAVED">Saved</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <a 
            href={job.applyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)]"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}
