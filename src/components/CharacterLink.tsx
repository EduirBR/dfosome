import { Link } from 'react-router-dom'
import type { Character } from '../types/dfo'
import { useLanguage } from '../i18n/useLanguage'

interface CharacterSearchProps {
  character: Character
}

function CharacterLink({ character }: CharacterSearchProps) {
  const { t } = useLanguage()
  return (
    <Link
      className="character-card"
      to={`/character/${character.serverId}/${character.characterId}`}
    >
      <span className="character-name">{character.characterName}</span>
      <span className="character-level">Lv.{character.level}</span>
      <span className="character-class">
        {character.jobGrowName ?? character.jobName}
      </span>
      {character.fame != null && (
        <span className="character-fame">
          {t('fame')} {character.fame}
        </span>
      )}
      <span className="character-server">{character.serverId}</span>
    </Link>
  )
}

export default CharacterLink