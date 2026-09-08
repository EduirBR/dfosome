import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../services/api'
import { useLanguage } from '../i18n/useLanguage'
import { entryKey, useWatchlist, type WatchEntry } from '../hooks/useWatchlist'

function Watchlist() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { entries, remove, update } = useWatchlist()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [refreshing, setRefreshing] = useState<string | null>(null)

  function toggleSelect(entry: WatchEntry) {
    const key = entryKey(entry)
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else if (next.size < 2) {
        next.add(key)
      }
      return next
    })
  }

  async function refresh(entry: WatchEntry) {
    setRefreshing(entryKey(entry))
    try {
      const detail = await api.getCharacterDetail(entry.serverId, entry.characterId)
      update({
        ...entry,
        characterName: detail.characterName,
        jobGrowName: detail.jobGrowName,
        jobName: detail.jobName,
        level: detail.level,
        fame: detail.fame,
      })
    } catch {
      // keep previous entry
    } finally {
      setRefreshing(null)
    }
  }

  function goCompare() {
    if (selected.size !== 2) return
    const picked = entries.filter((e) => selected.has(entryKey(e)))
    navigate(`/compare?a=${picked[0].serverId}/${picked[0].characterId}&b=${picked[1].serverId}/${picked[1].characterId}`)
  }

  const hasSelection = selected.size === 2

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="watch-head">
          <div>
            <h2>{t('watchlistTitle')}</h2>
            <p className="panel-hint">{t('tapToSelect')}</p>
            {!hasSelection && entries.length >= 2 && (
              <p className="hint">{t('needTwoSelected')}</p>
            )}
          </div>
          <button
            type="button"
            className="btn"
            disabled={!hasSelection}
            onClick={goCompare}
          >
            {t('compareTwo')}
          </button>
        </div>
      </section>

      {entries.length === 0 ? (
        <section className="panel panel-empty">
          <h3>{t('watchlistEmpty')}</h3>
          <p className="panel-hint">{t('watchlistEmptyHint')}</p>
          <Link to="/" className="btn btn-small">
            {t('search')}
          </Link>
        </section>
      ) : (
        <ul className="watch-grid">
          {entries.map((entry) => {
            const key = entryKey(entry)
            const isSelected = selected.has(key)
            const isRefreshing = refreshing === key
            return (
              <li
                key={key}
                className={`watch-card ${isSelected ? 'watch-card-selected' : ''}`}
              >
                <button
                  type="button"
                  className="watch-card-main"
                  onClick={() => toggleSelect(entry)}
                  aria-pressed={isSelected}
                >
                  <span className="watch-check">{isSelected ? '✓' : ''}</span>
                  <span className="watch-info">
                    <span className="watch-name">{entry.characterName}</span>
                    <span className="watch-class">
                      {entry.jobGrowName ?? entry.jobName}
                    </span>
                    <span className="watch-meta">
                      Lv.{entry.level} · {entry.serverId}
                      {entry.fame != null ? ` · ${t('fame')} ${entry.fame}` : ''}
                    </span>
                  </span>
                </button>
                <div className="watch-actions">
                  <Link
                    className="btn btn-small"
                    to={`/character/${entry.serverId}/${entry.characterId}`}
                  >
                    {t('viewDetail')}
                  </Link>
                  <button
                    type="button"
                    className="btn btn-small"
                    disabled={isRefreshing}
                    onClick={() => refresh(entry)}
                  >
                    {isRefreshing ? t('loading') : t('refresh')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-small btn-danger"
                    onClick={() => remove(entry)}
                  >
                    {t('remove')}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Watchlist