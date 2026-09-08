import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as api from '../services/api'
import type { SetItemInfo } from '../types/dfo'
import { useLanguage } from '../i18n/useLanguage'
import { rarityClass } from '../utils/ui'

function SetDetail() {
  const { setItemId = '' } = useParams()
  const { t } = useLanguage()
  const [set, setSet] = useState<SetItemInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void Promise.resolve().then(() => {
      if (cancelled) return
      setLoading(true)
      setError(null)
      return api
        .getSetItem(setItemId)
        .then((data) => {
          if (!cancelled) setSet(data)
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : t('loadCharacterError'))
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    })
    return () => {
      cancelled = true
    }
  }, [setItemId, t])

  if (loading) return <p className="hint">{t('loading')}</p>
  if (!set) return <p className="hint error">{error ?? t('characterNotFound')}</p>

  return (
    <div className="page-stack">
      <nav className="breadcrumb">
        <Link to="/items">← {t('navItems')}</Link>
      </nav>

      <section className="panel">
        <h2>{set.setItemName}</h2>

        <div className="stat-block">
          <h3>
            {t('setPieces')} ({set.setItems.length})
          </h3>
          <div className="items-grid">
            {set.setItems.map((member) => (
              <Link
                key={`${member.itemId}-${member.slotId}`}
                className={`item-card ${rarityClass(member.itemRarity)}`}
                to={`/items/${member.itemId}`}
              >
                {api.itemImageUrl(member.itemId) && (
                  <img
                    className="item-img"
                    src={api.itemImageUrl(member.itemId)!}
                    alt={member.itemName}
                    loading="lazy"
                  />
                )}
                <div className="item-info">
                  <span className="item-slot">{member.slotName}</span>
                  <span className="item-name">{member.itemName}</span>
                  <span className="item-meta">{member.itemRarity}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {set.setItemOption.length > 0 && (
          <div className="stat-block">
            <h3>{t('setOptions')}</h3>
            <ul className="set-option-list">
              {set.setItemOption.map((option) => (
                <li key={option.setEquipCount} className="set-option">
                  <span className="chip chip-active">
                    {option.setEquipCount} {t('setEquipCount')}
                  </span>
                  {option.explain && (
                    <p className="set-explain">{option.explain}</p>
                  )}
                  {option.itemBuff?.explain && (
                    <p className="set-explain">{option.itemBuff.explain}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}

export default SetDetail