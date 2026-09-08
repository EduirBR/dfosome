import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as api from '../services/api'
import type { ItemInfo, ItemShopInfo } from '../types/dfo'
import { useLanguage } from '../i18n/useLanguage'
import { StatList } from '../components/ui'
import { rarityClass } from '../utils/ui'

function ItemDetail() {
  const { itemId = '' } = useParams()
  const { t } = useLanguage()
  const [item, setItem] = useState<ItemInfo | null>(null)
  const [shop, setShop] = useState<ItemShopInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void Promise.resolve().then(() => {
      if (cancelled) return
      setLoading(true)
      setError(null)
      return Promise.allSettled([api.getItem(itemId), api.getItemShop(itemId)]).then(
        (results) => {
          if (cancelled) return
          if (results[0].status === 'fulfilled') setItem(results[0].value)
          if (results[1].status === 'fulfilled') setShop(results[1].value)
          const firstError = results.find((r) => r.status === 'rejected')
          if (firstError && firstError.status === 'rejected') {
            setError(
              firstError.reason instanceof Error
                ? firstError.reason.message
                : t('loadCharacterError'),
            )
          }
          setLoading(false)
        },
      )
    })
    return () => {
      cancelled = true
    }
  }, [itemId, t])

  if (loading) return <p className="hint">{t('loading')}</p>
  if (!item) {
    return <p className="hint error">{error ?? t('characterNotFound')}</p>
  }

  const image = api.itemImageUrl(item.itemId)

  return (
    <div className="page-stack">
      <nav className="breadcrumb">
        <Link to="/items">← {t('navItems')}</Link>
      </nav>

      <section className={`panel item-detail ${rarityClass(item.itemRarity)}`}>
        <div className="item-detail-head">
          {image && (
            <img
              className="item-img item-img-lg"
              src={image}
              alt={item.itemName}
              loading="lazy"
            />
          )}
          <div className="item-detail-title">
            <h2>{item.itemName}</h2>
            <span className="item-meta">
              {[item.itemType, item.itemTypeDetail, item.itemRarity]
                .filter(Boolean)
                .join(' · ')}
            </span>
            <span className="chip">
              Lv. {item.itemAvailableLevel ?? '-'} · {t('fame')} {item.fame ?? '-'}
            </span>
          </div>
        </div>

        {item.itemExplain && <p className="item-explain">{item.itemExplain}</p>}
        {item.itemFlavorText && <p className="item-flavor">{item.itemFlavorText}</p>}

        {typeof item.setItemId === 'string' && item.setItemId && (
          <p>
            <Link className="btn btn-small" to={`/sets/${item.setItemId}`}>
              {t('setLink')}: {item.setItemName}
            </Link>
          </p>
        )}

        <StatList values={item.itemStatus ?? null} title={t('stats')} />

        {shop && (
          <div className="stat-block">
            <h3>
              {t('itemShop')}
              {shop.itemGradeName ? ` · ${t('itemGrade')}: ${shop.itemGradeName}` : ''}
            </h3>
            {Array.isArray(shop.itemStatus) && shop.itemStatus.length > 0 && (
              <ul className="stat-list">
                {shop.itemStatus.map((status, index) => (
                  <li key={index}>
                    <span className="stat-name">{status.name}</span>
                    <span className="stat-value">{status.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {item.obtainInfo?.dungeon && item.obtainInfo.dungeon.length > 0 && (
          <div className="stat-block">
            <h3>{t('obtainedFrom')}</h3>
            <ul className="obtain-list">
              {item.obtainInfo.dungeon.map((group) => (
                <li key={group.type}>
                  <strong>{group.type}</strong>
                  <ul>
                    {group.rows.map((row) => (
                      <li key={row.name}>
                        {row.name}
                        {row.details ? ` — ${row.details.join(' · ')}` : ''}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}

export default ItemDetail