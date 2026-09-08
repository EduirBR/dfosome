import { useEffect, useMemo, useState } from 'react'
import * as api from '../services/api'
import type { Job, SkillDetail, SkillListItem } from '../types/dfo'
import { useLanguage } from '../i18n/useLanguage'
import { growOptions, terminalGrow } from '../services/jobTree'

function SkillGuide() {
  const { t } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobId, setJobId] = useState('')
  const [growId, setGrowId] = useState('')
  const [skills, setSkills] = useState<SkillListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [details, setDetails] = useState<Record<string, SkillDetail>>({})
  const [open, setOpen] = useState<Set<string>>(new Set())

  useEffect(() => {
    api
      .getJobs()
      .then((data) => {
        setJobs(data)
        if (data.length > 0 && data[0].rows.length > 0) {
          setJobId(data[0].jobId)
          setGrowId(terminalGrow(data[0].rows[0]).jobGrowId)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const grows = useMemo(() => growOptions(jobs, jobId), [jobs, jobId])

  useEffect(() => {
    if (!jobId) return
    let cancelled = false
    void Promise.resolve().then(() => {
      if (cancelled) return
      setLoading(true)
      setError(null)
      setDetails({})
      setOpen(new Set())
      return api
        .getSkillList(jobId, growId || undefined)
        .then((data) => {
          if (!cancelled) setSkills(data)
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : t('unknownError'))
            setSkills([])
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    })
    return () => {
      cancelled = true
    }
  }, [jobId, growId, t])

  const groups = useMemo(() => {
    const map = new Map<string, SkillListItem[]>()
    for (const skill of skills) {
      const type = skill.type ?? 'other'
      if (!map.has(type)) map.set(type, [])
      map.get(type)!.push(skill)
    }
    return map
  }, [skills])

  const typeTitle = (type: string): string => {
    if (type === 'active') return t('skillActive')
    if (type === 'passive') return t('skillPassive')
    if (type === 'chain') return t('skillChain')
    return type
  }

  async function loadDetail(job: string, skill: SkillListItem) {
    if (details[skill.skillId]) {
      toggle(skill.skillId)
      return
    }
    try {
      const detail = await api.getSkillDetail(job, skill.skillId)
      setDetails((prev) => ({ ...prev, [skill.skillId]: detail }))
      setOpen((prev) => new Set(prev).add(skill.skillId))
    } catch {
      // ignore
    }
  }

  function toggle(skillId: string) {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(skillId)) next.delete(skillId)
      else next.add(skillId)
      return next
    })
  }

  if (!loading && jobs.length === 0) {
    return <p className="hint">{t('noJobs')}</p>
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <h2>{t('skillGuideTitle')}</h2>
        <form
          className="search-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="sg-base">{t('skillBaseClass')}</label>
          <select
            id="sg-base"
            value={jobId}
            onChange={(e) => {
              setJobId(e.target.value)
              const job = jobs.find((j) => j.jobId === e.target.value)
              setGrowId(
                job && job.rows.length > 0
                  ? terminalGrow(job.rows[0]).jobGrowId
                  : '',
              )
            }}
          >
            {jobs.map((job) => (
              <option key={job.jobId} value={job.jobId}>
                {job.jobName}
              </option>
            ))}
          </select>
        <label htmlFor="sg-subclass">{t('skillSubclass')}</label>
        <select
          id="sg-subclass"
          value={growId}
          onChange={(e) => setGrowId(e.target.value)}
        >
              {grows.map((grow) => (
                <option key={grow.jobGrowId} value={grow.jobGrowId}>
                  {grow.label}
                </option>
              ))}
            </select>
        </form>
        {error && <p className="hint error">{error}</p>}
      </section>

      {loading ? (
        <p className="hint">{t('loading')}</p>
      ) : (
        <div className="eq-groups">
          {[...groups.entries()].map(([type, list]) => (
            <section className="eq-group" key={type}>
              <h4>
                {typeTitle(type)} ({list.length} {t('skillsCount')})
              </h4>
              <div className="skill-grid">
                {list.map((skill) => {
                  const detail = details[skill.skillId]
                  const expanded = open.has(skill.skillId)
                  return (
                    <div className="skill-cell skill-cell-guide" key={skill.skillId}>
                      <div className="skill-head">
                        <span className="skill-name">{skill.name}</span>
<span className="skill-meta">
  {t('skillReq')} <span className="skill-req">{skill.requiredLevel ?? '-'}</span>
</span>
                        <button
                          type="button"
                          className="btn btn-small"
                          onClick={() => loadDetail(jobId, skill)}
                        >
                          {expanded ? t('hideDesc') : t('showDesc')}
                        </button>
                      </div>
                      {expanded && detail?.desc && (
                        <p className="skill-desc">{detail.desc}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

export default SkillGuide