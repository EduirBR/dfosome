import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  getItemHashtags,
  itemImageUrl,
  searchItems,
  searchSetItems,
} from '../services/api'
import type { ItemRow, SetItemRow } from '../types/dfo'
import { useLanguage } from '../i18n/useLanguage'
import { rarityClass } from '../utils/ui'

const RARITIES = [
  'Common',
  'Uncommon',
  'Rare',
  'Unique',
  'Legendary',
  'Epic',
  'Primeval',
  'Chronicle',
  'Mythic',
]

function DfoPedia() {
  const { t } = useLanguage()
  const [hashtags, setHashtags] = useState<string[]>([])
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null)

  const [itemName, setItemName] = useState('')
  const [minLevel, setMinLevel] = useState('')
  const [maxLevel, setMaxLevel] = useState('')
  const [rarity, setRarity] = useState('')
  const [itemRows, setItemRows] = useState<ItemRow[]>([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const [itemsError, setItemsError] = useState<string | null>(null)
  const [itemsSearched, setItemsSearched] = useState(false)

  const [setName, setSetName] = useState('')
  const [setRows, setSetRows] = useState<SetItemRow[]>([])
  const [setsLoading, setSetsLoading] = useState(false)
  const [setsError, setSetsError] = useState<string | null>(null)
  const [setsSearched, setSetsSearched] = useState(false)

  useEffect(() => {
    getItemHashtags()
      .then(setHashtags)
      .catch(() => setHashtags([]))
  }, [])

  async function handleItemSearch(event: FormEvent) {
    event.preventDefault()
    setItemsLoading(true)
    setItemsError(null)
    setItemsSearched(true)
    try {
      setItemRows(
        await searchItems({
          itemName: itemName.trim() || undefined,
          hashtag: activeHashtag ?? undefined,
          minLevel: minLevel ? Number(minLevel) : undefined,
          maxLevel: maxLevel ? Number(maxLevel) : undefined,
          rarity: rarity || undefined,
          wordType: 'full',
        }),
      )
    } catch (err) {
      setItemsError(err instanceof Error ? err.message : t('searchError'))
      setItemRows([])
    } finally {
      setItemsLoading(false)
    }
  }

  async function handleSetSearch(event: FormEvent) {
    event.preventDefault()
    const query = setName.trim()
    if (!query) return
    setSetsLoading(true)
    setSetsError(null)
    setSetsSearched(true)
    try {
      setSetRows(await searchSetItems(query))
    } catch (err) {
      setSetsError(err instanceof Error ? err.message : t('searchError'))
      setSetRows([])
    } finally {
      setSetsLoading(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <h2>{t('pediaTitle')}</h2>
        {hashtags.length > 0 && (
          <div className="hashtag-row">
            <span className="panel-hint">{t('hashtags')}:</span>
            <div className="watch-chips">
              {hashtags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className={`chip chip-btn ${activeHashtag === tag ? 'chip-active' : ''}`}
                  onClick={() =>
                    setActiveHashtag((prev) => (prev === tag ? null : tag))
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="compare-grid pedia-grid">
        <section className="panel">
          <h3>{t('itemsSection')}</h3>
          <form className="search-form search-form-column" onSubmit={handleItemSearch}>
            <label>
              {t('characterName')}
              <input
                type="search"
                value={itemName}
                placeholder={t('itemNamePh')}
                onChange={(e) => setItemName(e.target.value)}
              />
            </label>
            <div className="filter-row">
              <label>
                {t('minLevel')}
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={minLevel}
                  onChange={(e) => setMinLevel(e.target.value)}
                />
              </label>
              <label>
                {t('maxLevel')}
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={maxLevel}
                  onChange={(e) => setMaxLevel(e.target.value)}
                />
              </label>
            </div>
            <label htmlFor="pedia-rarity">{t('rarityLabel')}</label>
            <select
              id="pedia-rarity"
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
            >
              <option value="">{t('rarityAny')}</option>
              {RARITIES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-accent" disabled={itemsLoading}>
              {itemsLoading ? t('loading') : t('search')}
            </button>
          </form>
          {itemsError && <p className="hint error">{itemsError}</p>}
          {itemsSearched && !itemsLoading && (
            <div className="pedia-results">
              {itemRows.length === 0 ? (
                <p className="hint">{t('noItems')}</p>
              ) : (
                itemRows.map((item) => {
                  const icon = itemImageUrl(item.itemId)
                  return (
                    <Link
                      className={`pedia-row ${rarityClass(item.itemRarity)}`}
                      key={item.itemId}
                      to={`/items/${item.itemId}`}
                    >
                      {icon && (
                        <img
                          className="item-img"
                          src={icon}
                          alt={item.itemName}
                          loading="lazy"
                        />
                      )}
                      <span className="item-name">{item.itemName}</span>
                      <span className="item-meta">
                        {item.itemTypeDetail ?? item.itemType}
                        {item.itemAvailableLevel != null
                          ? ` · Lv. ${item.itemAvailableLevel}`
                          : ''}
                      </span>
                      <span className="chip">{item.itemRarity}</span>
                    </Link>
                  )
                })
              )}
            </div>
          )}
        </section>

        <section className="panel">
          <h3>{t('setsSection')}</h3>
          <form className="search-form search-form-column" onSubmit={handleSetSearch}>
            <label>
              {t('characterName')}
              <input
                type="search"
                value={setName}
                placeholder={t('setSearchPh')}
                onChange={(e) => setSetName(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="btn btn-accent" disabled={setsLoading}>
              {setsLoading ? t('loading') : t('search')}
            </button>
          </form>
          {setsError && <p className="hint error">{setsError}</p>}
          {setsSearched && !setsLoading && (
            <div className="pedia-results">
              {setRows.length === 0 ? (
                <p className="hint">{t('noSets')}</p>
              ) : (
                setRows.map((set) => (
                  <Link
                    className="pedia-row"
                    key={set.setItemId}
                    to={`/sets/${set.setItemId}`}
                  >
                    <span className="item-name">{set.setItemName}</span>
                  </Link>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default DfoPedia