import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as api from '../services/api'
import { useLanguage } from '../i18n/useLanguage'
import type { MessageKey } from '../i18n/messages'
import { useCharacterData, type CharacterDataBundle } from '../hooks/useCharacterData'
import { useWatchlist, watchEntryFromDetail } from '../hooks/useWatchlist'
import {
  keyValuesToStatus,
  rarityClass,
} from '../utils/ui'
import { StatGrid, StatList } from '../components/ui'
import type {
  AvatarItem,
  Buff,
  CreaturePayload,
  EquipmentItem,
  MistPayload,
  OathCrystal,
  OathData,
  OathOption,
  OathPayload,
  SkillDetail,
  SkillRef,
  SkillStylePayload,
  StatusValue,
} from '../types/dfo'

type TabId = 'equipment' | 'avatar' | 'creature' | 'fusion' | 'skills'

interface TabInfo {
  id: TabId
  label: string
  available: boolean
}

function BuffCard({ buff }: { buff: Buff }) {
  const statuses = buff.status ?? []
  const statusText =
    statuses.length > 0 ? statuses.map((s) => `${s.name} ${s.value}`).join(' · ') : null
  return (
    <div className="buff-card">
      <span className="buff-name">
        {buff.name}
        {buff.level != null ? ` (Lv. ${buff.level})` : ''}
      </span>
      {statusText && <span className="buff-status">{statusText}</span>}
    </div>
  )
}

function EquipmentCard({
  item,
  slotLabel,
  stats,
}: {
  item: EquipmentItem
  slotLabel?: string
  stats?: StatusValue[] | null
}) {
  const { t } = useLanguage()
  const img = api.itemImageUrl(item.itemId)
  const image = img ? (
    <img className="item-img" src={img} alt={item.itemName} loading="lazy" />
  ) : null
  return (
    <div className={`item-card ${rarityClass(item.itemRarity)}`}>
      {image}
      <div className="item-info">
        <span className="item-slot">{slotLabel ?? item.slotName}</span>
        {item.itemName && <span className="item-name">{item.itemName}</span>}
        <span className="item-meta">
          {[item.itemTypeDetail, item.itemRarity, item.itemGradeName]
            .filter(Boolean)
            .join(' · ')}
        </span>
        {(item.reinforce > 0 || item.refine > 0) && (
          <span className="item-upgrades">
            {item.reinforce > 0 && (
              <span className="item-reinforce">+{item.reinforce}</span>
            )}
            {item.refine > 0 && (
              <span>
                {t('refine')} {item.refine}
              </span>
            )}
          </span>
        )}
        {item.amplificationName && (
          <span className="item-meta">{item.amplificationName}</span>
        )}
        {item.setItemName && <span className="item-meta">{item.setItemName}</span>}
        <StatList values={stats ?? null} title={t('itemStats')} />
        <StatList values={item.enchant?.status ?? null} title={t('enchant')} />
        {item.tune != null && item.tune.length > 0 && (
          <div className="stat-block">
            <h3>{t('tune')}</h3>
            <ul className="stat-list">
              {item.tune
                .flatMap((tune) =>
                  (tune.status?.map((value, index) => (
                    <li key={`${tune.level}-${value.name}-${index}`}>
                      <span className="stat-name">{value.name}</span>
                      <span className="stat-value">{value.value}</span>
                    </li>
                  )) ?? []),
                )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function AvatarCard({ avatar }: { avatar: AvatarItem }) {
  const { t } = useLanguage()
  const img = api.itemImageUrl(avatar.itemId)
  const image = img ? (
    <img
      className="item-img"
      src={img}
      alt={avatar.itemName ?? avatar.slotName}
      loading="lazy"
    />
  ) : null
  return (
    <div className={`item-card ${rarityClass(avatar.itemRarity)}`}>
      {image}
      <div className="item-info">
        <span className="item-slot">{avatar.slotName}</span>
        {avatar.itemName && <span className="item-name">{avatar.itemName}</span>}
        {avatar.itemRarity && <span className="item-meta">{avatar.itemRarity}</span>}
        {avatar.clone?.itemName && (
          <span className="item-meta">
            {t('clone')} {avatar.clone.itemName}
          </span>
        )}
        {avatar.optionAbility && (
          <div className="stat-block">
            <h3>{t('optionAbility')}</h3>
            {typeof avatar.optionAbility === 'string' ? (
              <p className="item-meta">{avatar.optionAbility}</p>
            ) : (
              <StatList values={avatar.optionAbility} title={t('optionAbility')} />
            )}
          </div>
        )}
        {avatar.emblems != null && avatar.emblems.length > 0 && (
          <div className="stat-block">
            <h3>{t('emblems')}</h3>
            <ul className="stat-list">
              {avatar.emblems.map((emblem) => (
                <li key={`${avatar.slotId}-${emblem.slotNo}`}>
                  <span className="stat-name">{emblem.slotColor}</span>
                  <span className="stat-value">{emblem.itemName ?? t('empty')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

type GroupKey = 'weapon' | 'armor' | 'accessories' | 'other'

const GROUP_ORDER: GroupKey[] = ['weapon', 'armor', 'accessories', 'other']

const GROUP_LABELS: Record<GroupKey, MessageKey> = {
  weapon: 'groupWeaponTitle',
  armor: 'groupArmor',
  accessories: 'groupAccessories',
  other: 'groupOther',
}

const OTHER_ACCESSORIES = new Set(['Bracelet', 'Ring', 'Necklace'])

function groupOf(item: EquipmentItem): GroupKey {
  if (item.itemType === 'Weapon' || item.itemTypeDetail === 'Title') {
    return 'weapon'
  }
  if (item.itemType === 'Armor') {
    return 'armor'
  }
  if (OTHER_ACCESSORIES.has(item.itemTypeDetail ?? '')) {
    return 'accessories'
  }
  return 'other'
}

function EquipmentTab({ equipment }: { equipment: EquipmentItem[] }) {
  const { t } = useLanguage()
  const groups = new Map<GroupKey, EquipmentItem[]>()
  for (const item of equipment) {
    const key = groupOf(item)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(item)
  }

  const order = GROUP_ORDER.filter((key) => groups.has(key))

  return (
    <div className="eq-groups">
      {order.map((type) => (
        <section className="eq-group" key={type}>
          <h4>{t(GROUP_LABELS[type])}</h4>
          <div className="items-grid">
            {groups.get(type)!.map((item) => (
              <EquipmentCard key={item.slotId} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function CreatureTab({ creaturePayload }: { creaturePayload: CreaturePayload }) {
  const { t } = useLanguage()
  const creature = creaturePayload.creature
  const [statsByItem, setStatsByItem] = useState<Record<string, StatusValue[]>>({})

  useEffect(() => {
    if (!creature) return
    let cancelled = false
    const ids = [creature.itemId, ...creature.artifact.map((a) => a.itemId)].filter(
      (id): id is string => Boolean(id),
    )
    Promise.allSettled(ids.map((id) => api.getItem(id))).then((results) => {
      if (cancelled) return
      const map: Record<string, StatusValue[]> = {}
      ids.forEach((id, i) => {
        if (results[i].status === 'fulfilled') {
          const detail = results[i].value
          map[id] = Array.isArray(detail.itemStatus) ? detail.itemStatus : []
        }
      })
      setStatsByItem(map)
    })
    return () => {
      cancelled = true
    }
  }, [creature])

  if (!creature) return null

  const artifactLabel = (slotColor: string) =>
    `${t('artifactSlot')} (${slotColor})`

  const baseItem: EquipmentItem = {
    slotId: 'CREATURE',
    slotName: t('creature'),
    itemId: creature.itemId ?? '',
    itemName: creature.itemName ?? '',
    itemTypeId: null,
    itemType: null,
    itemTypeDetailId: null,
    itemTypeDetail: null,
    itemAvailableLevel: 0,
    itemRarity: creature.itemRarity,
    setItemId: null,
    setItemName: null,
    reinforce: 0,
    itemGradeName: null,
    enchant: null,
    amplificationName: null,
    refine: 0,
    tune: [],
  }

  return (
    <div className="eq-groups">
      <section className="eq-group">
        <h4>{t('creature')}</h4>
        <div className="items-grid">
          {creature.itemId && (
            <EquipmentCard item={baseItem} stats={statsByItem[creature.itemId] ?? null} />
          )}
        </div>
      </section>
      {creature.artifact.length > 0 && (
        <section className="eq-group">
          <h4>{t('artifacts')}</h4>
          <div className="items-grid">
            {creature.artifact.map((artifact) => (
              <EquipmentCard
                key={artifact.itemId}
                slotLabel={artifactLabel(artifact.slotColor)}
                item={{
                  slotId: artifact.itemId,
                  slotName: artifactLabel(artifact.slotColor),
                  itemId: artifact.itemId,
                  itemName: artifact.itemName,
                  itemTypeId: null,
                  itemType: null,
                  itemTypeDetailId: null,
                  itemTypeDetail: null,
                  itemAvailableLevel: artifact.itemAvailableLevel ?? 0,
                  itemRarity: artifact.itemRarity,
                  setItemId: null,
                  setItemName: null,
                  reinforce: 0,
                  itemGradeName: null,
                  enchant: null,
                  amplificationName: null,
                  refine: 0,
                  tune: [],
                }}
                stats={statsByItem[artifact.itemId] ?? null}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function OathCard({ oath }: { oath: OathData | null }) {
  const { t } = useLanguage()
  if (!oath) return null
  const info = oath.info
  const crystals = oath.crystal ?? []
  return (
    <section className="fusion-panel">
      {info && (
        <div className="fusion-head">
          {api.itemImageUrl(info.itemId) && (
            <img
              className="item-img"
              src={api.itemImageUrl(info.itemId)!}
              alt={info.itemName}
              loading="lazy"
            />
          )}
          <div className="fusion-head-info">
            <span className="item-slot">{t('oath')}</span>
            <span className="fusion-name">{info.itemName}</span>
            <span className="item-meta">
              {info.itemRarity}
              {info.setPoint != null
                ? ` · ${t('setPoints')} ${info.setPoint}`
                : ''}
            </span>
          </div>
        </div>
      )}

      {info?.oathUpgrade && (
        <div className="fusion-block">
          <h5>{t('oathUpgrade')}</h5>
          <StatGrid values={keyValuesToStatus(info.oathUpgrade.status)} />
          {info.oathUpgrade.options != null && info.oathUpgrade.options.length > 0 && (
            <div className="oath-options">
              {info.oathUpgrade.options.map((option, index) => (
                <OathOptionCard key={`${option.optionName}-${index}`} option={option} />
              ))}
            </div>
          )}
        </div>
      )}

      {oath.blessing && (
        <div className="fusion-block">
          <h5>{t('blessing')}</h5>
          <StatGrid values={keyValuesToStatus(oath.blessing.status)} />
        </div>
      )}

      {crystals.length > 0 && (
        <div className="fusion-block">
          <h5>
            {t('crystals')} ({crystals.length})
          </h5>
          <div className="crystal-grid">
            {crystals.map((crystal) => (
              <CrystalCard key={crystal.slotNo} crystal={crystal} />
            ))}
          </div>
        </div>
      )}

      {oath.setInfo && (
        <div className="fusion-block">
          <h5>{oath.setInfo.setName}</h5>
          {oath.setInfo.setOptionName && (
            <span className="item-meta">
              {oath.setInfo.setOptionName} · {oath.setInfo.setRarityName}
            </span>
          )}
          {oath.setInfo.active?.explain && (
            <p className="set-explain">{oath.setInfo.active.explain}</p>
          )}
        </div>
      )}
    </section>
  )
}

function OathOptionCard({ option }: { option: OathOption }) {
  return (
    <div className="oath-option">
      <span className="oath-step">{option.stepName}</span>
      <span className="oath-option-name">{option.optionName}</span>
      <StatGrid values={keyValuesToStatus(option.status)} />
    </div>
  )
}

function CrystalCard({ crystal }: { crystal: OathCrystal }) {
  const { t } = useLanguage()
  const img = api.itemImageUrl(crystal.itemId)
  return (
    <div className={`crystal-card ${rarityClass(crystal.itemRarity)}`}>
      {img && (
        <img className="item-img" src={img} alt={crystal.itemName} loading="lazy" />
      )}
      <div className="item-info">
        <span className="crystal-slot">
          {t('slot')} {crystal.slotNo}
        </span>
        <span className="item-name">{crystal.itemName}</span>
        <span className="item-meta">
          {crystal.itemRarity}
          {crystal.tune
            ? ` · ${t('tune')} ${crystal.tune.level} (${crystal.tune.setPoint} ${t('tunePts')})`
            : ''}
        </span>
      </div>
    </div>
  )
}

function MistCard({ mist }: { mist: MistPayload['mistAssimilation'] }) {
  const { t } = useLanguage()
  if (!mist) return null
  return (
    <section className="fusion-panel">
      <div className="fusion-head">
        <div className="fusion-head-info">
          <span className="item-slot">{t('mist')}</span>
          <div className="fusion-chips">
            <span className="chip">
              {t('mistLevel')} {mist.level}
            </span>
            {mist.expRate != null && (
              <span className="chip">
                {t('mistExp')} {mist.expRate}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="fusion-block">
        <h5>{t('statsShort')}</h5>
        <StatGrid values={mist.status} />
      </div>
    </section>
  )
}

function FusionTab({
  oath,
  mist,
}: {
  oath: OathPayload | null
  mist: MistPayload | null
}) {
  return (
    <div className="fusion-grid">
      {oath?.oath && <OathCard oath={oath.oath} />}
      {mist?.mistAssimilation && <MistCard mist={mist.mistAssimilation} />}
    </div>
  )
}

function SkillGroup({
  skills,
  title,
  details,
}: {
  skills: SkillRef[] | null | undefined
  title: string
  details: Record<string, SkillDetail>
}) {
  const { t } = useLanguage()
  if (!skills || skills.length === 0) return null
  return (
    <section className="eq-group">
      <h4>{title}</h4>
      <div className="skill-grid">
        {skills.map((skill) => {
          const detail = details[skill.skillId]
          return (
            <div className="skill-cell" key={skill.skillId}>
              <div className="skill-head">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-meta">
                  {skill.level != null ? `${t('skillLevel')} ${skill.level}` : ''}
                  {skill.requiredLevel != null
                    ? ` · ${t('skillReq')} ${skill.requiredLevel}`
                    : ''}
                </span>
              </div>
              {detail?.desc && <p className="skill-desc">{detail.desc}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function SkillsTab({ skills }: { skills: SkillStylePayload | null }) {
  const { t } = useLanguage()
  const style = skills?.skill?.style
  const jobId = skills?.jobId
  const [details, setDetails] = useState<Record<string, SkillDetail>>({})

  useEffect(() => {
    if (!jobId || !style) return
    let cancelled = false
    const all = [
      ...(style.active ?? []),
      ...(style.passive ?? []),
      ...(style.chain ?? []),
    ]
    const ids = [...new Set(all.map((skill) => skill.skillId))]
    Promise.allSettled(ids.map((id) => api.getSkillDetail(jobId, id))).then(
      (results) => {
        if (cancelled) return
        const map: Record<string, SkillDetail> = {}
        ids.forEach((id, i) => {
          if (results[i].status === 'fulfilled') map[id] = results[i].value
        })
        setDetails(map)
      },
    )
    return () => {
      cancelled = true
    }
  }, [jobId, style])

  return (
    <div className="eq-groups">
      <SkillGroup skills={style?.active} title={t('skillActive')} details={details} />
      <SkillGroup skills={style?.passive} title={t('skillPassive')} details={details} />
      <SkillGroup skills={style?.chain} title={t('skillChain')} details={details} />
    </div>
  )
}

const FAME_TIER_HIGH = 115000
const FAME_TIER_MID = 100000
const MIN_REINFORCED = 3

function PartyCheckCard({ bundle }: { bundle: CharacterDataBundle }) {
  const { t } = useLanguage()
  const character = bundle.detail
  const equipment = bundle.equipment?.equipment ?? []
  const buffInfo = bundle.buffEquipment?.skill?.buff?.skillInfo

  const fame = character?.fame ?? null
  const fameTier =
    fame == null ? -1 : fame >= FAME_TIER_HIGH ? 2 : fame >= FAME_TIER_MID ? 1 : 0

  const weapon = equipment.find((item) => item.slotId === 'WEAPON')
  const weaponScore =
    weapon && (weapon.reinforce >= 10 || weapon.refine > 0) ? 1 : 0

  const reinforcedCount = equipment.filter(
    (item) => item.reinforce >= 10 || item.refine > 0,
  ).length
  const gearScore = reinforcedCount >= MIN_REINFORCED ? 1 : 0

  const hasBuffGear =
    (bundle.buffEquipment?.skill?.buff?.equipment?.length ?? 0) > 0 ||
    (bundle.buffAvatar?.skill?.buff?.avatar?.length ?? 0) > 0 ||
    (bundle.buffCreature?.skill?.buff?.creature?.length ?? 0) > 0

  const score = (fameTier >= 0 ? fameTier : 0) + weaponScore + gearScore
  const verdict =
    score >= 4 ? t('verdictReady') : score >= 2 ? t('verdictClose') : t('verdictFar')
  const verdictClass =
    score >= 4 ? 'verdict-ready' : score >= 2 ? 'verdict-close' : 'verdict-far'

  return (
    <section className="party-card">
      <h3>{t('partyCheckTitle')}</h3>
      <p className="party-hint">{t('partyCheckHint')}</p>
      <div className={`party-verdict ${verdictClass}`}>{verdict}</div>
      <ul className="party-criteria">
        <li className="party-row">
          <span>{t('fameTier')}</span>
          <strong>
            {character?.fame != null ? character.fame : t('without')}
          </strong>
        </li>
        <li className="party-row">
          <span>
            {t('reinforcedCount')} ({MIN_REINFORCED}+)
          </span>
          <strong>{reinforcedCount}</strong>
        </li>
        <li className="party-row">
          <span>{t('weaponReinforced')}</span>
          <strong>{weaponScore ? t('yes') : t('no')}</strong>
        </li>
        <li className="party-row">
          <span>{t('buffGear')}</span>
          <strong>{hasBuffGear ? t('yes') : t('no')}</strong>
        </li>
        {buffInfo && (
          <li className="party-row">
            <span>{t('buff')}</span>
            <strong>
              {buffInfo.name} (Lv. {buffInfo.option?.level ?? '-'})
            </strong>
          </li>
        )}
      </ul>
    </section>
  )
}

function SnapshotButton({ bundle }: { bundle: CharacterDataBundle }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const text = buildSnapshot(bundle, t)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button type="button" className="btn" onClick={handleCopy}>
      {copied ? t('snapshotCopied') : t('copySnapshot')}
    </button>
  )
}

function WatchlistButton({ bundle }: { bundle: CharacterDataBundle }) {
  const { t } = useLanguage()
  const { has, toggle } = useWatchlist()
  const [flash, setFlash] = useState<'added' | 'removed' | null>(null)
  const character = (bundle.detail ?? bundle.equipment) as import('../types/dfo').CharacterDetail | null

  if (!character) return null

  const isSaved = has(character)

  function handleToggle() {
    const selected = character
    if (!selected) return
    const added = toggle(watchEntryFromDetail(selected))
    setFlash(added ? 'added' : 'removed')
    setTimeout(() => setFlash(null), 2000)
  }

  const label = flash
    ? flash === 'added'
      ? t('addedToWatchlist')
      : t('removedFromWatchlist')
    : isSaved
      ? t('inWatchlist')
      : t('addToWatchlist')

  return (
    <button
      type="button"
      className={`btn ${isSaved ? 'btn-primary' : ''}`}
      onClick={handleToggle}
    >
      {label}
    </button>
  )
}

function StatsPanel({ bundle }: { bundle: CharacterDataBundle }) {
  const { t } = useLanguage()
  const stats = bundle.status?.status ?? null
  const buffs = bundle.status?.buff ?? null
  if (!Array.isArray(stats) && !Array.isArray(buffs)) return null

  return (
    <aside className="stat-panel">
      {Array.isArray(stats) && stats.length > 0 && (
        <>
          <h3>{t('stats')}</h3>
          <StatGrid values={stats} />
        </>
      )}

      {Array.isArray(buffs) && buffs.length > 0 && (
        <div className="buff-list">
          <h3>{t('buff')}</h3>
          {buffs.map((buff, index) => (
            <BuffCard key={`buff-${index}`} buff={buff} />
          ))}
        </div>
      )}
    </aside>
  )
}

function CharacterDetail() {
  const { serverId = '', characterId = '' } = useParams()
  const { t } = useLanguage()
  const bundle = useCharacterData(serverId, characterId, true)

  const [tab, setTab] = useState<TabId>('equipment')

  const identity = `${serverId}/${characterId}`
  const [prevIdentity, setPrevIdentity] = useState(identity)
  if (identity !== prevIdentity) {
    setPrevIdentity(identity)
    setTab('equipment')
  }

  const { loading, error, equipment, avatar, creature, oath, mist, skills } = bundle

  if (loading) return <p className="hint">{t('loadingCharacter')}</p>

  const character = bundle.detail ?? equipment ?? avatar ?? skills

  if (!character) {
    return (
      <div className="character-detail">
        <p className="hint error">{error ?? t('characterNotFound')}</p>
      </div>
    )
  }

  const tabs: TabInfo[] = [
    {
      id: 'equipment',
      label: t('tabEquipment'),
      available: (equipment?.equipment ?? []).length > 0,
    },
    {
      id: 'avatar',
      label: t('tabAvatar'),
      available: (avatar?.avatar ?? []).length > 0,
    },
    { id: 'creature', label: t('tabCreature'), available: creature?.creature != null },
    {
      id: 'fusion',
      label: t('tabFusion'),
      available: oath?.oath != null || mist?.mistAssimilation != null,
    },
    {
      id: 'skills',
      label: t('tabSkills'),
      available: skills?.skill?.style != null,
    },
  ]
  const activeTab = tabs.some((tabItem) => tabItem.id === tab && tabItem.available)
    ? tab
    : (tabs.find((tabItem) => tabItem.available)?.id ?? 'equipment')

  return (
    <div className="character-detail">
      <nav className="breadcrumb">
        <Link to="/">{t('backToSearch')}</Link>
      </nav>

      {error && <p className="hint error">{error}</p>}

      <header className="character-hero">
        <div className="hero-title">
          <h2>{character.characterName}</h2>
          <p className="hero-class">{character.jobGrowName ?? character.jobName}</p>
        </div>
        <div className="hero-chips">
          <span className="chip">
            {t('serverLabel')} {character.serverId}
          </span>
          <span className="chip">
            {t('level')} {character.level}
          </span>
          <span className="chip">{character.jobName}</span>
          {character.fame != null && (
            <span className="chip chip-accent">
              {t('fame')} {character.fame}
            </span>
          )}
          {character.adventureName && (
            <span className="chip">
              {t('adventurer')} {character.adventureName}
            </span>
          )}
          {character.guildName && (
            <span className="chip">
              {t('guild')} {character.guildName}
            </span>
          )}
        </div>
        <div className="hero-actions">
          {character.jobId && (
            <Link
              className="btn btn-small"
              to={`/rankings?job=${encodeURIComponent(character.jobId)}`}
            >
              {t('viewInRanking')}
            </Link>
          )}
          <WatchlistButton bundle={bundle} />
          <SnapshotButton bundle={bundle} />
        </div>
      </header>

      <div className="detail-layout">
        <aside className="detail-side">
          <StatsPanel bundle={bundle} />
          <PartyCheckCard bundle={bundle} />
        </aside>

        <main className="detail-main">
          <nav className="tab-bar" aria-label={t('sectionsAria')}>
            {tabs
              .filter((tabItem) => tabItem.available)
              .map((tabItem) => (
                <button
                  key={tabItem.id}
                  type="button"
                  className={`tab-button ${activeTab === tabItem.id ? 'active' : ''}`}
                  onClick={() => setTab(tabItem.id)}
                >
                  {tabItem.label}
                </button>
              ))}
          </nav>

          {activeTab === 'equipment' && equipment && (
            <EquipmentTab equipment={equipment.equipment} />
          )}
          {activeTab === 'avatar' && avatar && (
            <div className="items-grid">
              {avatar.avatar.map((a) => (
                <AvatarCard key={a.slotId} avatar={a} />
              ))}
            </div>
          )}
          {activeTab === 'creature' && creature && (
            <CreatureTab creaturePayload={creature} />
          )}
          {activeTab === 'fusion' && <FusionTab oath={oath} mist={mist} />}
          {activeTab === 'skills' && <SkillsTab skills={skills} />}
        </main>
      </div>
    </div>
  )
}

function buildSnapshot(
  bundle: CharacterDataBundle,
  t: (key: MessageKey) => string,
): string {
  const character = bundle.detail ?? bundle.equipment
  const lines: string[] = []
  if (!character) return lines.join('\n')

  lines.push(`${character.characterName} · ${character.jobGrowName ?? character.jobName}`)
  lines.push(
    `${t('serverLabel')} ${character.serverId} · ${t('level')} ${character.level}` +
      (character.fame != null ? ` · ${t('fame')} ${character.fame}` : ''),
  )
  if (character.adventureName) lines.push(`${t('adventurer')} ${character.adventureName}`)
  if (character.guildName) lines.push(`${t('guild')} ${character.guildName}`)
  lines.push('')

  const stats = bundle.status?.status ?? []
  if (stats.length > 0) {
    lines.push(`## ${t('stats')}`)
    stats.forEach((s) => lines.push(`- ${s.name}: ${s.value}`))
    lines.push('')
  }

  const buffs = bundle.status?.buff ?? []
  if (buffs.length > 0) {
    lines.push(`## ${t('buff')}`)
    buffs.forEach((buff) => {
      const statusText = (buff.status ?? [])
        .map((s) => `${s.name} ${s.value}`)
        .join(' · ')
      lines.push(`- ${buff.name}${buff.level != null ? ` (Lv. ${buff.level})` : ''}${statusText ? ` — ${statusText}` : ''}`)
    })
    lines.push('')
  }

  const equipment = bundle.equipment?.equipment ?? []
  if (equipment.length > 0) {
    lines.push(`## ${t('tabEquipment')}`)
    equipment.forEach((item) => {
      const upgrades: string[] = []
      if (item.reinforce > 0) upgrades.push(`+${item.reinforce}`)
      if (item.refine > 0) upgrades.push(`${t('refine')} ${item.refine}`)
      const suffix = upgrades.length > 0 ? ` [${upgrades.join(' ')}]` : ''
      lines.push(`- [${item.slotName}] ${item.itemName}${suffix}`)
    })
    lines.push('')
  }

  const creature = bundle.creature?.creature
  if (creature?.itemName) {
    lines.push(`## ${t('creature')}`)
    lines.push(`- ${creature.itemName}${creature.itemRarity ? ` (${creature.itemRarity})` : ''}`)
    lines.push('')
  }

  const oath = bundle.oath?.oath?.info
  if (oath?.itemName) {
    lines.push(`## ${t('oath')}`)
    lines.push(`- ${oath.itemName}`)
  }

  return lines.join('\n')
}

export default CharacterDetail