import type { Job, JobGrow } from '../types/dfo'

export function terminalGrow(grow: JobGrow): JobGrow {
  let current = grow
  while (current.next) current = current.next
  return current
}

export function stripNeo(name: string): string {
  return name.replace(/^Neo:\s*/i, '')
}

export function genderSuffix(jobName: string): string {
  return jobName.match(/\(([A-Za-z]+)\)/)?.[1] ?? ''
}

export interface GrowOption {
  jobGrowId: string
  label: string
  rawName: string
}

export function growOptions(jobs: Job[], jobId: string): GrowOption[] {
  const nameCount = new Map<string, number>()
  for (const job of jobs) {
    for (const term of job.rows.map(terminalGrow)) {
      const name = stripNeo(term.jobGrowName)
      nameCount.set(name, (nameCount.get(name) ?? 0) + 1)
    }
  }
  const job = jobs.find((j) => j.jobId === jobId)
  if (!job) return []
  const suffix = genderSuffix(job.jobName)
  return job.rows.map(terminalGrow).map((term) => {
    const name = stripNeo(term.jobGrowName)
    const shared = (nameCount.get(name) ?? 0) > 1
    return {
      jobGrowId: term.jobGrowId,
      label: shared && suffix ? `${name} (${suffix})` : name,
      rawName: name,
    }
  })
}