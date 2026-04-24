const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  JOBS: `${API_BASE_URL}/api/jobs`,
  JOBS_SYNC: `${API_BASE_URL}/api/jobs/sync`,
  RESUME_UPLOAD: `${API_BASE_URL}/api/resume/upload`,
  RESUME_CURRENT: `${API_BASE_URL}/api/resume/current`,
};

export default API_BASE_URL;
