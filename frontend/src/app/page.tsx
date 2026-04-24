import KanbanBoard from '@/components/KanbanBoard';

// Mock data to demonstrate the UI
const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior Java Backend Engineer',
    company: 'TechCorp Solutions',
    location: 'Remote',
    description: 'Looking for an experienced engineer with Spring Boot, Java, and PostgreSQL background...',
    experienceLevel: 'Senior',
    applyUrl: 'https://example.com/apply',
    fitPercentage: 92.5,
    applicationState: 'SAVED' as const
  },
  {
    id: '2',
    title: 'Full Stack React & Node Developer',
    company: 'Innovate Startup',
    location: 'New York, NY',
    description: 'Requires Node.js experience, but Next.js/React is a huge plus.',
    experienceLevel: 'Mid-Level',
    applyUrl: 'https://example.com',
    fitPercentage: 65.0,
    applicationState: 'APPLIED' as const
  },
  {
    id: '3',
    title: 'Microservices Architect (.NET)',
    company: 'Enterprise FinTech',
    location: 'London, UK',
    description: 'Lead the architecture of our new systems using C#, .NET core and SQL Server...',
    experienceLevel: 'Lead',
    applyUrl: 'https://example.com',
    fitPercentage: 88.0,
    applicationState: 'INTERVIEWING' as const
  }
];

export default function Dashboard() {
  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <header className="flex justify-between items-end pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
            JobTracker Pro
          </h1>
          <p className="text-slate-400">Intelligent scraping & tracking dashboard</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-slate-800/50 p-1 rounded-xl flex items-center border border-slate-700/50">
            <button className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm font-medium">All Jobs</button>
            <button className="px-4 py-2 text-slate-400 hover:text-slate-200 rounded-lg text-sm font-medium transition-colors">Matches &gt; 80%</button>
          </div>
          <button className="px-5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-sm font-medium text-slate-200 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Sync Apify
          </button>
        </div>
      </header>

      <div className="flex-1">
        <KanbanBoard initialJobs={MOCK_JOBS} />
      </div>
    </main>
  );
}
