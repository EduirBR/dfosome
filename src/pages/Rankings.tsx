import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getJobs, searchByFame, getServers } from '../services/api'
import type { Character, Job, Server } from '../types/dfo'
import { useLanguage } from '../i18n/useLanguage'
import { entryKey } from '../hooks/useWatchlist'
import { useWatchlist } from '../hooks/useWatchlist'
import { growOptions, stripNeo } from '../services/jobTree'

type Role = 'all' | 'dps' | 'buffer'

const BUFFER_CLASSES: Record<string, string[]> = {
  'Priest (F)': ['Crusader'],
  'Priest (M)': ['Crusader'],
  'Mage (F)': ['Enchantress'],
  'Gunner (F)': ['Paramedic'],
  Archer: ['Muse'],
}

function isBuffer(row: Pick<Character, 'jobName' | 'jobGrowName'>): boolean {
  const terms = BUFFER_CLASSES[row.jobName]
  if (!terms) return false
  return terms.includes(stripNeo(row.jobGrowName ?? row.jobName))
}

function isPriestMCrusader(row: Pick<Character, 'jobName' | 'jobGrowName'>): boolean {
  return row.jobName === 'Priest (M)' && stripNeo(row.jobGrowName ?? '') === 'Crusader'
}

function Rankings() {
  const { t } = useLanguage()
  const { has, toggle } = useWatchlist()
  const [searchParams] = useSearchParams()
  const [servers, setServers] = useState<Server[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [serverId, setServerId] = useState('cain')
  const [jobId, setJobId] = useState(
    () => searchParams.get('job') ?? '',
  )
  const [growId, setGrowId] = useState('')
  const [role, setRole] = useState<Role>('all')
  const [limit, setLimit] = useState(50)
  const [rows, setRows] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getServers()
      .then(setServers)
      .catch(() => setError(t('loadServersError')))
  }, [t])

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
  }, [])

  const subclassOptions = useMemo(() => growOptions(jobs, jobId), [jobs, jobId])

  const selectedJob = jobs.find((job) => job.jobId === jobId)

  const bufferNames = useMemo(
    () => (selectedJob ? BUFFER_CLASSES[selectedJob.jobName] ?? [] : []),
    [selectedJob],
  )

  const visibleJobs = useMemo(() => {
    if (role === 'buffer') return jobs.filter((job) => Boolean(BUFFER_CLASSES[job.jobName]))
    return jobs
  }, [jobs, role])

  const visibleSubclasses = useMemo(() => {
    if (role === 'all') return subclassOptions
    if (role === 'buffer') {
      return subclassOptions.filter((option) => bufferNames.includes(option.rawName))
    }
    const excluded =
      selectedJob && selectedJob.jobName !== 'Priest (M)'
        ? BUFFER_CLASSES[selectedJob.jobName] ?? []
        : []
    return subclassOptions.filter((option) => !excluded.includes(option.rawName))
  }, [role, subclassOptions, bufferNames, selectedJob])

  function handleRoleChange(value: Role) {
    setRole(value)
    if (value === 'all') return
    if (value === 'buffer') {
      if (!selectedJob || !BUFFER_CLASSES[selectedJob.jobName]) {
        setJobId('')
        setGrowId('')
        return
      }
      const allowed = BUFFER_CLASSES[selectedJob.jobName] ?? []
      if (!subclassOptions.some((o) => o.jobGrowId === growId && allowed.includes(o.rawName))) {
        setGrowId('')
      }
      return
    }
    if (selectedJob) {
      const excluded =
        selectedJob.jobName !== 'Priest (M)'
          ? BUFFER_CLASSES[selectedJob.jobName] ?? []
          : []
      if (subclassOptions.some((o) => o.jobGrowId === growId && excluded.includes(o.rawName))) {
        setGrowId('')
      }
    }
  }

  async function loadRanking() {
    setLoading(true)
    setError(null)
    try {
      const data = await searchByFame(serverId, {
        limit: 100,
        isBuff: role === 'buffer' ? true : null,
        jobId: jobId || undefined,
      })
      const filtered = data
        .filter((row) =>
          role === 'buffer'
            ? isBuffer(row)
            : role === 'dps'
              ? !isBuffer(row) || isPriestMCrusader(row)
              : true,
        )
        .filter((row) => (growId ? row.jobGrowId === growId : true))
        .slice(0, limit)
      setRows(filtered)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('rankError'))
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRanking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId, role, jobId, growId, limit, t])

  const distribution = new Map<string, number>()
  for (const row of rows) {
    const key = row.jobGrowName ?? row.jobName
    distribution.set(key, (distribution.get(key) ?? 0) + 1)
  }
  const distributionList = [...distribution.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
  const total = rows.length || 1

  return (
    <div className="page-stack">
      <section className="panel">
        <h2>{t('rankingsTitle')}</h2>
        <p className="panel-hint">{t('rankingsHint')}</p>
        <form
          className="ranking-form"
          onSubmit={(e) => {
            e.preventDefault()
            loadRanking()
          }}
        >
          <label htmlFor="rank-server">{t('server')}</label>
          <select
            id="rank-server"
            value={serverId}
            onChange={(e) => setServerId(e.target.value)}
          >
            {servers.map((server) => (
              <option key={server.serverId} value={server.serverId}>
                {server.serverName}
              </option>
            ))}
          </select>

          <label htmlFor="rank-role">{t('rankRole')}</label>
          <select
            id="rank-role"
            value={role}
            onChange={(e) => handleRoleChange(e.target.value as Role)}
          >
            <option value="all">{t('roleAll')}</option>
            <option value="dps">{t('roleDps')}</option>
            <option value="buffer">{t('roleBuffer')}</option>
          </select>

          <label htmlFor="rank-class">{t('filterClass')}</label>
          <select
            id="rank-class"
            value={jobId}
            onChange={(e) => {
              setJobId(e.target.value)
              setGrowId('')
            }}
          >
            <option value="">{t('filterClassAll')}</option>
            {visibleJobs.map((job) => (
              <option key={job.jobId} value={job.jobId}>
                {job.jobName}
              </option>
            ))}
          </select>

          <label htmlFor="rank-subclass">{t('rankSub')}</label>
          <select
            id="rank-subclass"
            value={growId}
            onChange={(e) => setGrowId(e.target.value)}
            disabled={!jobId}
          >
            <option value="">{t('subAll')}</option>
            {visibleSubclasses.map((option) => (
              <option key={option.jobGrowId} value={option.jobGrowId}>
                {option.label}
              </option>
            ))}
          </select>

          <label htmlFor="rank-limit">{t('rankLimit')}</label>
          <select
              id="rank-limit"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? t('loading') : t('rankButton')}
          </button>
        </form>
        {error && <p className="hint error">{error}</p>}
        {growId && !error && <p className="hint">{t('rankSubHint')}</p>}
      </section>

      {loading ? (
        <p className="hint">{t('rankLoading')}</p>
      ) : (
        <div className="rank-layout">
          <section className="panel">
            <ol className="rank-list">
              {rows.map((row, index) => {
                const saved = has(row)
                return (
                  <li key={entryKey(row)} className="rank-row">
                    <span className="rank-pos">{index + 1}</span>
                    <Link
                      className="rank-name"
                      to={`/character/${row.serverId}/${row.characterId}`}
                    >
                      {row.characterName}
                    </Link>
                    <span className="rank-class">
                      {row.jobGrowName ?? row.jobName}
                    </span>
                    <span className="rank-level">Lv.{row.level}</span>
                    <span className="chip chip-accent">
                      {t('fame')} {row.fame}
                    </span>
                    <button
                      type="button"
                      className={`btn btn-small ${saved ? 'btn-primary' : ''}`}
                      onClick={() => toggle(row)}
                    >
                      {saved ? t('inWatchlist') : t('addToWatchlist')}
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>

          <section className="panel">
            <h3>{t('distributionTitle')}</h3>
            <p className="panel-hint">{t('distributionHint')}</p>
            {distributionList.length === 0 ? (
              <p className="hint">{t('noData')}</p>
            ) : (
              <ul className="dist-list">
                {distributionList.map(([name, count]) => {
                  const pct = Math.round((count / total) * 100)
                  return (
                    <li className="dist-row" key={name}>
                      <span className="dist-name">{name}</span>
                      <span className="dist-bar">
                        <span className="dist-fill" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="dist-count">
                        {count} ({pct}%)
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default Rankings