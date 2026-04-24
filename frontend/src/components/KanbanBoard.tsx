'use client';

import React, { useState } from 'react';
import JobCard from './JobCard';
import JobModal from './JobModal';

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  experienceLevel: string;
  applyUrl: string;
  fitPercentage: number;
  applicationState: 'SAVED' | 'APPLIED' | 'INTERVIEWING' | 'REJECTED';
};

interface KanbanBoardProps {
  initialJobs: Job[];
}

export default function KanbanBoard({ initialJobs }: KanbanBoardProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const columns = ['SAVED', 'APPLIED', 'INTERVIEWING', 'REJECTED'] as const;

  const handleUpdateStatus = (jobId: string, newState: Job['applicationState']) => {
    setJobs(jobs.map(job => job.id === jobId ? { ...job, applicationState: newState } : job));
  };

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
        {columns.map(column => {
          const columnJobs = jobs.filter(j => j.applicationState === column)
            .sort((a, b) => b.fitPercentage - a.fitPercentage);
          
          return (
            <div key={column} className="flex-none w-80 bg-slate-800/20 rounded-2xl p-4 border border-slate-700/30 snap-center">
              <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="font-semibold text-slate-300 tracking-wide text-sm">{column}</h2>
                <span className="bg-slate-800 text-slate-400 text-xs py-1 px-2 rounded-full border border-slate-700">
                  {columnJobs.length}
                </span>
              </div>
              <div className="flex flex-col gap-3 min-h-[200px]">
                {columnJobs.map(job => (
                  <JobCard key={job.id} job={job} onClick={setSelectedJob} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedJob && (
        <JobModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)}
          onStatusChange={(newState) => handleUpdateStatus(selectedJob.id, newState)}
        />
      )}
    </>
  );
}
