import { useEffect, useState } from 'react'
import { flattenJobGrow, getJobs } from '../services/api'
import type { Job } from '../types/dfo'
import { useLanguage } from '../i18n/useLanguage'

function JobList() {
  const { t } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getJobs()
      .then((data) => {
        if (!cancelled) setJobs(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t('unknownError'))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [t])

  if (loading) return <p className="hint">{t('loadingJobs')}</p>
  if (error) return <p className="hint error">{error}</p>
  if (jobs.length === 0) return <p className="hint">{t('noJobs')}</p>

  return (
    <section className="jobs" aria-label={t('jobsAria')}>
      <h2>{t('jobsTitle')}</h2>
      <div className="jobs-grid">
        {jobs.map((job) => (
          <article className="job-card" key={job.jobId}>
            <h3>{job.jobName}</h3>
            <ul>
              {job.rows.map((grow) => (
                <li key={grow.jobGrowId}>
                  <span className="job-grow">{grow.jobGrowName}</span>
                  {flattenJobGrow(grow)
                    .slice(1)
                    .map((g) => (
                      <span className="job-evolve" key={g.jobGrowId}>
                        → {g.jobGrowName}
                      </span>
                    ))}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default JobList