import { useCallback, useEffect, useState } from 'react'
import type { CharacterDetail } from '../types/dfo'

export interface WatchEntry {
  serverId: string
  characterId: string
  characterName: string
  jobGrowName: string | null
  jobName: string
  level: number
  fame: number | null
}

const STORAGE_KEY = 'dfosome-watchlist'

export function entryKey(entry: { serverId: string; characterId: string }): string {
  return `${entry.serverId}/${entry.characterId}`
}

function loadEntries(): WatchEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as WatchEntry[]) : []
  } catch {
    return []
  }
}

function saveEntries(entries: WatchEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // ignore storage errors
  }
}

export function useWatchlist() {
  const [entries, setEntries] = useState<WatchEntry[]>(loadEntries)

  useEffect(() => {
    saveEntries(entries)
  }, [entries])

  const has = useCallback(
    (entry: { serverId: string; characterId: string }) =>
      entries.some((e) => entryKey(e) === entryKey(entry)),
    [entries],
  )

  const add = useCallback((entry: WatchEntry) => {
    setEntries((prev) =>
      prev.some((e) => entryKey(e) === entryKey(entry))
        ? prev
        : [...prev, entry],
    )
  }, [])

  const remove = useCallback((entry: { serverId: string; characterId: string }) => {
    const key = entryKey(entry)
    setEntries((prev) => prev.filter((e) => entryKey(e) !== key))
  }, [])

  const toggle = useCallback(
    (entry: WatchEntry) => {
      if (has(entry)) {
        remove(entry)
        return false
      }
      add(entry)
      return true
    },
    [has, add, remove],
  )

  const update = useCallback((entry: WatchEntry) => {
    setEntries((prev) =>
      prev.map((e) => (entryKey(e) === entryKey(entry) ? entry : e)),
    )
  }, [])

  return { entries, has, add, remove, toggle, update }
}

export function watchEntryFromDetail(
  detail: CharacterDetail,
): WatchEntry {
  return {
    serverId: detail.serverId,
    characterId: detail.characterId,
    characterName: detail.characterName,
    jobGrowName: detail.jobGrowName,
    jobName: detail.jobName,
    level: detail.level,
    fame: detail.fame,
  }
}