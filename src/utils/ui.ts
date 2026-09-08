import type { StatusValue } from '../types/dfo'

export function rarityClass(rarity: string | null): string {
  const map: Record<string, string> = {
    common: 'rarity-common',
    uncommon: 'rarity-uncommon',
    rare: 'rarity-rare',
    unique: 'rarity-unique',
    legendary: 'rarity-legendary',
    epic: 'rarity-epic',
    primeval: 'rarity-primeval',
    chronicle: 'rarity-chronicle',
    mythic: 'rarity-mythic',
  }
  const key = (rarity ?? 'common').toLowerCase().replace(/\s+/g, '-')
  return map[key] ?? 'rarity-common'
}

export function keyValuesToStatus(
  values: { key: string; value: number | string }[] | null | undefined,
): StatusValue[] {
  return (values ?? []).map((v) => ({ name: v.key, value: v.value }))
}