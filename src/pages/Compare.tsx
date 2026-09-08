import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import * as api from '../services/api'
import { useLanguage } from '../i18n/useLanguage'
import {
  useCharacterData,
} from '../hooks/useCharacterData'
import { entryKey, useWatchlist } from '../hooks/useWatchlist'
import type { Character, Server } from '../types/dfo'
import { CharacterSummary } from '../components/CharacterSummary'

interface Slot {
  serverId: string
  characterId: string
}

function parseSlot(value: string | null): Slot | null {
  if (!value) return null
  const [serverId, characterId] = value.split('/')
  return serverId && characterId ? { serverId, characterId } : null
}

function CompareSlot({
  label,
  slot,
  onChange,
  onClear,
}: {
  label: string
  slot: Slot | null
  onChange: (slot: Slot) => void
  onClear: () => void
}) {
  const { t } = useLanguage()
  const { entries } = useWatchlist()
  const [servers, setServers] = useState<Server[]>([])
  const [serverId, setServerId] = useState('all')
  const [name, setName] = useState('')
  const [results, setResults] = useState<Character[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.getServers().then(setServers).catch(() => setError(t('loadServersError')))
  }, [t])

  async function handleSearch(event: FormEvent) {
    event.preventDefault()
    const query = name.trim()
    if (!query) return
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      setResults(await api.searchCharacters(serverId, query))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('searchError'))
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="compare-slot">
      <h3>{label}</h3>
      {slot ? (
        <div className="compare-slot-picked">
          <p>
            <strong>{slot.serverId}</strong> ·{' '}
            <code>{slot.characterId.slice(0, 12)}…</code>
          </p>
          <button type="button" className="btn btn-small" onClick={onClear}>
            {t('remove')}
          </button>
        </div>
      ) : (
        <>
          <form className="search-form search-form-compact" onSubmit={handleSearch}>
            <label>
              {t('server')}
              <select value={serverId} onChange={(e) => setServerId(e.target.value)}>
                <option value="all">{t('all')}</option>
                {servers.map((server) => (
                  <option key={server.serverId} value={server.serverId}>
                    {server.serverName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('characterName')}
              <input
                type="search"
                value={name}
                placeholder={t('characterNamePlaceholder')}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? t('loading') : t('search')}
            </button>
          </form>
          {error && <p className="hint error">{error}</p>}
          {searched && !loading && (
            <div className="character-list character-list-small">
              {results.length === 0 && <p className="hint">{t('noResults')}</p>}
              {results.map((character) => (
                <button
                  type="button"
                  key={entryKey(character)}
                  className="result-row-btn"
                  onClick={() =>
                    onChange({
                      serverId: character.serverId,
                      characterId: character.characterId,
                    })
                  }
                >
                  <span className="character-name">{character.characterName}</span>
                  <span className="character-level">Lv.{character.level}</span>
                  <span className="character-class">
                    {character.jobGrowName ?? character.jobName}
                  </span>
                  {character.fame != null && (
                    <span className="character-fame">{character.fame}</span>
                  )}
                  <span className="character-server">{character.serverId}</span>
                </button>
              ))}
            </div>
          )}
          {entries.length > 0 && (
            <div className="compare-from-watchlist">
              <p className="panel-hint">{t('compareFromWatchlist')}</p>
              <div className="watch-chips">
                {entries.map((entry) => (
                  <button
                    type="button"
                    key={entryKey(entry)}
                    className="chip chip-btn"
                    onClick={() =>
                      onChange({ serverId: entry.serverId, characterId: entry.characterId })
                    }
                  >
                    {entry.characterName} · {entry.serverId}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

function SlotFetcher({ slot }: { slot: Slot }) {
  const { t } = useLanguage()
  const data = useCharacterData(slot.serverId, slot.characterId, false)
  if (data.loading) return <p className="hint">{t('loading')}</p>
  if (!data.detail && !data.equipment) {
    return <p className="hint error">{data.error ?? t('characterNotFound')}</p>
  }
  return <CharacterSummary data={data} />
}

function ComparePanel({ slot }: { slot: Slot | null }) {
  const { t } = useLanguage()
  if (!slot) {
    return <p className="hint">{t('chooseTwo')}</p>
  }
  return <SlotFetcher slot={slot} />
}

function Compare() {
  const { t } = useLanguage()
  const [params, setParams] = useSearchParams()
  const slotA = parseSlot(params.get('a'))
  const slotB = parseSlot(params.get('b'))

  const updateSlot = (key: 'a' | 'b', slot: Slot | null) => {
    const next = new URLSearchParams(params)
    if (slot) next.set(key, `${slot.serverId}/${slot.characterId}`)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <h2>{t('compareTitle')}</h2>
        <p className="panel-hint">{t('chooseTwo')}</p>
      </section>
      <div className="compare-grid">
        <div>
          <h2 className="accessibly-hidden">{t('slotA')}</h2>
          <CompareSlot
            label={t('slotA')}
            slot={slotA}
            onChange={(slot) => updateSlot('a', slot)}
            onClear={() => updateSlot('a', null)}
          />
          <ComparePanel slot={slotA} />
        </div>
        <div className="compare-vs">
          <span>{t('compareWith')}</span>
          <Link className="btn btn-small" to="/watchlist">
            {t('navWatchlist')}
          </Link>
        </div>
        <div>
          <h2 className="accessibly-hidden">{t('slotB')}</h2>
          <CompareSlot
            label={t('slotB')}
            slot={slotB}
            onChange={(slot) => updateSlot('b', slot)}
            onClear={() => updateSlot('b', null)}
          />
          <ComparePanel slot={slotB} />
        </div>
      </div>
    </div>
  )
}

export default Compare