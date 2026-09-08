import axios from 'axios'
import type {
  AvatarPayload,
  BuffAvatarPayload,
  BuffCreaturePayload,
  BuffEquipmentPayload,
  Character,
  CharacterDetail,
  CharacterStatus,
  CreaturePayload,
  EquipmentPayload,
  ItemInfo,
  ItemRow,
  ItemShopInfo,
  Job,
  JobGrow,
  MistPayload,
  OathPayload,
  Server,
  SetItemInfo,
  SetItemRow,
  SkillDetail,
  SkillListPayload,
  SkillStylePayload,
} from '../types/dfo'

const BASE_DIRECT_API = 'https://api.dfoneople.com'
const DIRECT_KEY = import.meta.env.DFO_API_KEY as string | undefined

const BRIDGE_URL = (import.meta.env.BRIDGE_URL as string | undefined) || ''

function httpStatus(err: unknown): number {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    (err as { response?: { status?: unknown } }).response
  ) {
    const status = (err as { response: { status?: unknown } }).response.status
    if (typeof status === 'number') return status
  }
  return 0
}

async function apiFetch<T>(path: string): Promise<T> {
  try {
    const { data } = await axios.get<T>(`${BRIDGE_URL}/df${path}`)
    return data
  } catch (proxyErr) {
    const proxyStatus = httpStatus(proxyErr)
    if (DIRECT_KEY) {
      try {
        const { data } = await axios.get<T>(`${BASE_DIRECT_API}/df${path}`, {
          headers: { apikey: DIRECT_KEY },
        })
        console.warn(`[api] ${path}: proxy HTTP ${proxyStatus || 'red'}, usando Neople directo`)
        return data
      } catch (directErr) {
        console.error(
          `[api] ${path}: proxy HTTP ${proxyStatus || 'red'}, directo HTTP ${httpStatus(directErr) || 'red'}`,
        )
        throw new Error(
          `DFO API error ${httpStatus(directErr) || 'red'}: ${path} (proxy y directo fallaron)`,
        )
      }
    }
    if (proxyStatus) {
      console.error(
        `[api] ${path}: HTTP ${proxyStatus} (no hay VITE_DFO_API_KEY para el fallback)`,
      )
      throw new Error(
        `DFO API error ${proxyStatus}: ${path} (sin VITE_DFO_API_KEY para fallback)`,
      )
    }
    console.error(`[api] ${path}: error de red al contactar el proxy`)
    throw new Error(`DFO API error de red: ${path} (proxy no responde)`)
  }
}

async function getRows<T>(path: string): Promise<T[]> {
  const body = await apiFetch<{ rows?: T[]; error?: { code: string; message: string } }>(
    path,
  )
  if (body.error) {
    console.error(`[api] ${path}: DFO API error`, body.error)
    throw new Error(`DFO API error: ${body.error.message}`)
  }
  return body.rows ?? []
}

async function getJson<T>(path: string): Promise<T> {
  return apiFetch<T>(path)
}

async function getCached<T>(cacheKey: string, path: string): Promise<T[]> {
  try {
    const raw = sessionStorage.getItem(cacheKey)
    if (raw) {
      const cached = JSON.parse(raw) as T[]
      if (cached.length > 0) {
        console.log(`[api] cache hit: ${cacheKey} (${path})`)
        return cached
      }
    }
  } catch (err) {
    console.error(`[api] cache read error: ${cacheKey}`, err)
  }
  console.log(`[api] fetch ${path}`)
  const data = await getRows<T>(path)
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(data))
  } catch (err) {
    console.error(`[api] cache write error: ${cacheKey}`, err)
  }
  return data
}

export function getServers(): Promise<Server[]> {
  return getCached<Server>('dfosome-servers', '/servers')
}

export function getJobs(): Promise<Job[]> {
  return getCached<Job>('dfosome-jobs', '/jobs')
}

export function searchCharacters(
  serverId: string,
  characterName: string,
): Promise<Character[]> {
  const params = new URLSearchParams({ characterName, limit: '20', wordType: 'full' })
  return getRows<Character>(`/servers/${serverId}/characters?${params.toString()}`)
}

export function getCharacterDetail(
  serverId: string,
  characterId: string,
): Promise<CharacterDetail> {
  return getJson<CharacterDetail>(
    `/servers/${serverId}/characters/${characterId}`,
  )
}

export function getCharacterStatus(
  serverId: string,
  characterId: string,
): Promise<CharacterStatus> {
  return getJson<CharacterStatus>(
    `/servers/${serverId}/characters/${characterId}/status`,
  )
}

export function getEquipment(
  serverId: string,
  characterId: string,
): Promise<EquipmentPayload> {
  return getJson<EquipmentPayload>(
    `/servers/${serverId}/characters/${characterId}/equip/equipment`,
  )
}

export function getAvatar(
  serverId: string,
  characterId: string,
): Promise<AvatarPayload> {
  return getJson<AvatarPayload>(
    `/servers/${serverId}/characters/${characterId}/equip/avatar`,
  )
}

export function getCreature(
  serverId: string,
  characterId: string,
): Promise<CreaturePayload> {
  return getJson<CreaturePayload>(
    `/servers/${serverId}/characters/${characterId}/equip/creature`,
  )
}

export function getOath(
  serverId: string,
  characterId: string,
): Promise<OathPayload> {
  return getJson<OathPayload>(
    `/servers/${serverId}/characters/${characterId}/equip/oath`,
  )
}

export function getMistAssimilation(
  serverId: string,
  characterId: string,
): Promise<MistPayload> {
  return getJson<MistPayload>(
    `/servers/${serverId}/characters/${characterId}/equip/mist-assimilation`,
  )
}

export function getSkillStyle(
  serverId: string,
  characterId: string,
): Promise<SkillStylePayload> {
  return getJson<SkillStylePayload>(
    `/servers/${serverId}/characters/${characterId}/skill/style`,
  )
}

export function getItem(itemId: string): Promise<ItemInfo> {
  return getJson<ItemInfo>(`/items/${itemId}`)
}

export interface FameSearchParams {
  minFame?: number
  maxFame?: number
  jobId?: string
  isBuff?: boolean | null
  limit?: number
}

export function searchByFame(
  serverId: string,
  params: FameSearchParams = {},
): Promise<Character[]> {
  const query = new URLSearchParams()
  if (params.minFame != null) query.set('minFame', String(params.minFame))
  if (params.maxFame != null) query.set('maxFame', String(params.maxFame))
  if (params.jobId) query.set('jobId', params.jobId)
  if (params.isBuff != null) query.set('isBuff', String(params.isBuff))
  query.set('limit', String(params.limit ?? 10))
  return getRows<Character>(
    `/servers/${serverId}/characters-fame?${query.toString()}`,
  )
}

export function getItemHashtags(): Promise<string[]> {
  return getRows<string>('/item-hashtag')
}

export interface ItemSearchParams {
  itemName?: string
  hashtag?: string
  minLevel?: number
  maxLevel?: number
  rarity?: string
  wordType?: 'match' | 'front' | 'full'
  limit?: number
}

export function searchItems(params: ItemSearchParams = {}): Promise<ItemRow[]> {
  const query = new URLSearchParams()
  if (params.itemName) query.set('itemName', params.itemName)
  if (params.hashtag) query.set('hashtag', params.hashtag)
  if (params.minLevel != null) query.set('minLevel', String(params.minLevel))
  if (params.maxLevel != null) query.set('maxLevel', String(params.maxLevel))
  if (params.rarity) query.set('rarity', params.rarity)
  if (params.wordType) query.set('wordType', params.wordType)
  query.set('limit', String(params.limit ?? 30))
  return getRows<ItemRow>(`/items?${query.toString()}`)
}

export function getItemShop(itemId: string): Promise<ItemShopInfo> {
  return getJson<ItemShopInfo>(`/items/${itemId}/shop`)
}

export function searchSetItems(
  setItemName: string,
  wordType: 'match' | 'front' | 'full' = 'full',
  limit = 30,
): Promise<SetItemRow[]> {
  const query = new URLSearchParams({
    setItemName,
    wordType,
    limit: String(limit),
  })
  return getRows<SetItemRow>(`/setitems?${query.toString()}`)
}

export function getSetItem(setItemId: string): Promise<SetItemInfo> {
  return getJson<SetItemInfo>(`/setitems/${setItemId}`)
}

export function getSkillList(
  jobId: string,
  jobGrowId?: string,
): Promise<SkillListPayload['skills']> {
  const query = jobGrowId ? `?jobGrowId=${encodeURIComponent(jobGrowId)}` : ''
  return getJson<SkillListPayload>(`/skills/${jobId}${query}`).then(
    (payload) => payload.skills ?? [],
  )
}

export function getBuffEquipment(
  serverId: string,
  characterId: string,
): Promise<BuffEquipmentPayload> {
  return getJson<BuffEquipmentPayload>(
    `/servers/${serverId}/characters/${characterId}/skill/buff/equip/equipment`,
  )
}

export function getBuffAvatar(
  serverId: string,
  characterId: string,
): Promise<BuffAvatarPayload> {
  return getJson<BuffAvatarPayload>(
    `/servers/${serverId}/characters/${characterId}/skill/buff/equip/avatar`,
  )
}

export function getBuffCreature(
  serverId: string,
  characterId: string,
): Promise<BuffCreaturePayload> {
  return getJson<BuffCreaturePayload>(
    `/servers/${serverId}/characters/${characterId}/skill/buff/equip/creature`,
  )
}

export function getSkillDetail(
  jobId: string,
  skillId: string,
): Promise<SkillDetail> {
  return getJson<SkillDetail>(`/skills/${jobId}/${skillId}`)
}

export function flattenJobGrow(grow: JobGrow): JobGrow[] {
  const result: JobGrow[] = []
  let current: JobGrow | undefined = grow
  while (current) {
    result.push(current)
    current = current.next
  }
  return result
}

export function itemImageUrl(itemId: string | null | undefined): string | null {
  return itemId ? `https://img-api.dfoneople.com/df/items/${itemId}` : null
}