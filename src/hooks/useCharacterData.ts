import { useEffect, useState } from 'react'
import * as api from '../services/api'
import type {
  AvatarPayload,
  BuffAvatarPayload,
  BuffCreaturePayload,
  BuffEquipmentPayload,
  CharacterDetail,
  CharacterStatus,
  CreaturePayload,
  EquipmentPayload,
  MistPayload,
  OathPayload,
  SkillStylePayload,
} from '../types/dfo'

export interface CharacterDataBundle {
  detail: CharacterDetail | null
  status: CharacterStatus | null
  equipment: EquipmentPayload | null
  avatar: AvatarPayload | null
  creature: CreaturePayload | null
  oath: OathPayload | null
  mist: MistPayload | null
  skills: SkillStylePayload | null
  buffEquipment: BuffEquipmentPayload | null
  buffAvatar: BuffAvatarPayload | null
  buffCreature: BuffCreaturePayload | null
}

const EMPTY_BUNDLE: CharacterDataBundle = {
  detail: null,
  status: null,
  equipment: null,
  avatar: null,
  creature: null,
  oath: null,
  mist: null,
  skills: null,
  buffEquipment: null,
  buffAvatar: null,
  buffCreature: null,
}

function resultValue<T>(result: PromiseSettledResult<T>, fallback: T): T {
  return result.status === 'fulfilled' ? result.value : fallback
}

export interface UseCharacterDataResult extends CharacterDataBundle {
  loading: boolean
  error: string | null
}

export function useCharacterData(
  serverId: string,
  characterId: string,
  withBuff = false,
): UseCharacterDataResult {
  const [bundle, setBundle] = useState<CharacterDataBundle>(EMPTY_BUNDLE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void Promise.resolve().then(() => {
      if (cancelled) return
      setLoading(true)
      setError(null)
      return Promise.allSettled([
      api.getCharacterDetail(serverId, characterId),
      api.getCharacterStatus(serverId, characterId),
      api.getEquipment(serverId, characterId),
      api.getAvatar(serverId, characterId),
      api.getCreature(serverId, characterId),
      api.getOath(serverId, characterId),
      api.getMistAssimilation(serverId, characterId),
      api.getSkillStyle(serverId, characterId),
      ...(withBuff
        ? [
            api.getBuffEquipment(serverId, characterId),
            api.getBuffAvatar(serverId, characterId),
            api.getBuffCreature(serverId, characterId),
          ]
        : []),
    ]).then((results) => {
      if (cancelled) return
      setBundle({
        detail: resultValue(results[0], null),
        status: resultValue(results[1], null),
        equipment: resultValue(results[2], null),
        avatar: resultValue(results[3], null),
        creature: resultValue(results[4], null),
        oath: resultValue(results[5], null),
        mist: resultValue(results[6], null),
        skills: resultValue(results[7], null),
        buffEquipment: withBuff
          ? (resultValue(results[8], null) as BuffEquipmentPayload | null)
          : null,
        buffAvatar: withBuff
          ? (resultValue(results[9], null) as BuffAvatarPayload | null)
          : null,
        buffCreature: withBuff
          ? (resultValue(results[10], null) as BuffCreaturePayload | null)
          : null,
      })
      setLoading(false)
      const firstError = results.find(
        (r) => r.status === 'rejected',
      ) as PromiseRejectedResult | undefined
      if (firstError) {
        setError(
          firstError.reason instanceof Error
            ? firstError.reason.message
            : 'Failed to load character',
        )
      }
    })
    })
    return () => {
      cancelled = true
    }
  }, [serverId, characterId, withBuff])

  return { ...bundle, loading, error }
}