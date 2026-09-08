import { useEffect, useState, type FormEvent } from 'react'
import { getServers, searchCharacters } from '../services/api'
import type { Character, Server } from '../types/dfo'
import CharacterLink from './CharacterLink'
import { useLanguage } from '../i18n/useLanguage'

function CharacterSearch() {
  const { t } = useLanguage()
  const [servers, setServers] = useState<Server[]>([])
  const [serverId, setServerId] = useState('cain')
  const [characterName, setCharacterName] = useState('')
  const [results, setResults] = useState<Character[]>([])
  const [query, setQuery] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getServers()
      .then(setServers)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : t('loadServersError'))
      })
  }, [t])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const name = characterName.trim()
    if (!name) return

    setLoading(true)
    setError(null)
    try {
      const rows = await searchCharacters(serverId, name)
      setResults(rows)
      setQuery(name)
      setClassFilter('')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('searchError'))
      setResults([])
      setQuery('')
    } finally {
      setLoading(false)
    }
  }

  const classes = new Map<string, string>()
  for (const character of results) {
    if (character.jobId && !classes.has(character.jobId)) {
      classes.set(character.jobId, character.jobName)
    }
  }
  const filtered =
    classFilter === ''
      ? results
      : results.filter((character) => character.jobId === classFilter)

  return (
    <section className="search" aria-label={t('searchAria')}>
      <h2>{t('searchTitle')}</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="char-server">{t('server')}</label>
        <select
          id="char-server"
          value={serverId}
          onChange={(e) => setServerId(e.target.value)}
        >
          {servers.map((server) => (
            <option key={server.serverId} value={server.serverId}>
              {server.serverName}
            </option>
          ))}
        </select>

        <label htmlFor="char-name">{t('characterName')}</label>
        <input
          id="char-name"
          type="search"
          value={characterName}
          placeholder={t('characterNamePlaceholder')}
          onChange={(e) => setCharacterName(e.target.value)}
          maxLength={300}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? t('searching') : t('search')}
        </button>

        {classes.size > 0 && (
          <>
            <label htmlFor="char-class">{t('filterClass')}</label>
            <select
              id="char-class"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="">{t('filterClassAll')}</option>
              {[...classes.entries()].map(([jobId, jobName]) => (
                <option key={jobId} value={jobId}>
                  {jobName}
                </option>
              ))}
            </select>
          </>
        )}
      </form>

      {error && <p className="hint error">{error}</p>}

      {query && !loading && (
        <div className="search-results">
          <h3>
            {filtered.length}{' '}
            {filtered.length === 1 ? t('resultSingular') : t('resultPlural')}{' '}
            {t('for')} “{query}”
          </h3>
          {filtered.length === 0 ? (
            <p className="hint">
              {results.length > 0 ? t('noClassResults') : t('noResults')}
            </p>
          ) : (
            <div className="character-list">
              {filtered.map((character) => (
                <CharacterLink key={character.characterId} character={character} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default CharacterSearch