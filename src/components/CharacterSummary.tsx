import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'
import type { CharacterDataBundle } from '../hooks/useCharacterData'
import { StatGrid } from './ui'

export function CharacterSummary({ data }: { data: CharacterDataBundle }) {
  const { t } = useLanguage()
  const character = data.detail ?? data.equipment ?? data.avatar ?? data.skills
  if (!character) return <p className="hint">{t('noData')}</p>

  const equipment = data.equipment?.equipment ?? []
  const reinforced = equipment.filter(
    (item) => item.reinforce >= 10 || item.refine > 0,
  ).length
  const creature = data.creature?.creature
  const oathInfo = data.oath?.oath?.info
  const style = data.skills?.skill?.style
  const skillCount =
    (style?.active?.length ?? 0) +
    (style?.passive?.length ?? 0) +
    (style?.chain?.length ?? 0)

  return (
    <article className="compare-card">
      <div className="compare-card-hero">
        <h3>{character.characterName}</h3>
        <p className="hero-class">
          {character.jobGrowName ?? character.jobName}
        </p>
        <div className="hero-chips">
          <span className="chip">{character.serverId}</span>
          <span className="chip">
            {t('level')} {character.level}
          </span>
          {character.fame != null && (
            <span className="chip chip-accent">
              {t('fame')} {character.fame}
            </span>
          )}
        </div>
      </div>

      <div className="compare-stats">
        <StatGrid values={data.status?.status ?? null} />
      </div>

      <div className="compare-meta">
        <div className="compare-meta-row">
          <span>{t('tabEquipment')}</span>
          <strong>{equipment.length}</strong>
        </div>
        <div className="compare-meta-row">
          <span>{t('reinforcedCount')}</span>
          <strong>{reinforced}</strong>
        </div>
        <div className="compare-meta-row">
          <span>{t('creature')}</span>
          <strong>{creature?.itemName ?? t('without')}</strong>
        </div>
        <div className="compare-meta-row">
          <span>{t('oath')}</span>
          <strong>{oathInfo?.itemName ?? t('without')}</strong>
        </div>
        <div className="compare-meta-row">
          <span>{t('tabSkills')}</span>
          <strong>{skillCount}</strong>
        </div>
        <div className="compare-meta-row">
          <span>{t('buff')}</span>
          <strong>
            {(data.status?.buff ?? []).map((b) => b.name).join(', ') || t('without')}
          </strong>
        </div>
      </div>

      <Link
        className="btn btn-small"
        to={`/character/${character.serverId}/${character.characterId}`}
      >
        {t('viewDetail')} →
      </Link>
    </article>
  )
}