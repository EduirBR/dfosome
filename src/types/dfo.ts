export interface Server {
  serverId: string
  serverName: string
}

export interface JobGrow {
  jobGrowId: string
  jobGrowName: string
  next?: JobGrow
}

export interface Job {
  jobId: string
  jobName: string
  rows: JobGrow[]
}

export interface Character {
  serverId: string
  characterId: string
  characterName: string
  level: number
  jobId: string
  jobGrowId: string | null
  jobName: string
  jobGrowName: string | null
  fame: number | null
}

export interface CharacterDetail extends Character {
  adventureName: string | null
  guildId: string | null
  guildName: string | null
}

export interface StatusValue {
  name: string
  value: number | string
}

export interface Enchant {
  status: StatusValue[]
}

export interface Tune {
  level: number
  setPoint?: number
  status: StatusValue[]
}

export interface EquipmentItem {
  slotId: string
  slotName: string
  itemId: string
  itemName: string
  itemTypeId: string | null
  itemType: string | null
  itemTypeDetailId: string | null
  itemTypeDetail: string | null
  itemAvailableLevel: number
  itemRarity: string | null
  setItemId: string | null
  setItemName: string | null
  reinforce: number
  itemGradeName: string | null
  enchant: Enchant | null
  amplificationName: string | null
  refine: number
  tune: Tune[]
}

export interface EquipmentPayload extends CharacterDetail {
  equipment: EquipmentItem[]
}

export interface Emblem {
  slotNo: number
  slotColor: string
  itemId?: string | null
  itemName?: string | null
  itemRarity?: string | null
}

export interface AvatarItem {
  slotId: string
  slotName: string
  itemId: string | null
  itemName: string | null
  itemRarity: string | null
  clone: { itemId: string | null; itemName: string | null }
  optionAbility: string | StatusValue[] | null
  emblems: Emblem[]
}

export interface AvatarPayload extends CharacterDetail {
  avatar: AvatarItem[]
}

export interface Artifact {
  slotColor: string
  itemId: string
  itemName: string
  itemAvailableLevel: number | null
  itemRarity: string | null
  clone?: { itemId: string | null; itemName: string | null } | null
}

export interface CreatureItem {
  itemId: string | null
  itemName: string | null
  itemRarity: string | null
  clone: { itemId: string | null; itemName: string | null }
  artifact: Artifact[]
}

export interface CreaturePayload extends CharacterDetail {
  creature: CreatureItem | null
}

export interface OathPayload extends CharacterDetail {
  oath: OathData | null
}

export interface StatusKeyValue {
  key: string
  value: number | string
}

export interface OathOption {
  stepName: string
  explain: string | null
  explainDetail: string | null
  optionName: string
  status: StatusKeyValue[] | null
}

export interface OathUpgrade {
  status: StatusKeyValue[] | null
  options: OathOption[] | null
}

export interface OathInfo {
  itemId: string
  itemName: string
  itemRarity: string | null
  setPoint: number | null
  oathUpgrade: OathUpgrade | null
}

export interface OathCrystal {
  slotNo: number
  itemId: string
  itemName: string
  itemRarity: string | null
  tune: { level: number; setPoint: number } | null
}

export interface OathSetInfo {
  setId: number
  setName: string
  setOptionName: string | null
  setRarityName: string | null
  active: { explain: string | null; explainDetail?: string | null } | null
}

export interface OathBlessing {
  status: StatusKeyValue[] | null
}

export interface OathData {
  info: OathInfo | null
  crystal: OathCrystal[] | null
  setInfo: OathSetInfo | null
  blessing: OathBlessing | null
}

export interface MistAssimilationData {
  level: number
  expRate: string | null
  status: StatusValue[] | null
}

export interface MistPayload extends CharacterDetail {
  mistAssimilation: MistAssimilationData | null
}

export interface ItemDetail {
  itemId: string
  itemName: string
  itemRarity: string | null
  itemStatus: StatusValue[] | null
}

export interface Buff {
  name: string
  level?: number | null
  status: StatusValue[]
}

export interface CharacterStatus extends CharacterDetail {
  buff: Buff[] | null
  status: StatusValue[] | null
}

export interface SkillRef {
  skillId: string
  name: string
  level: number | null
  requiredLevel: number | null
}

export interface SkillDetail {
  skillId?: string
  name: string
  type: string | null
  desc: string | null
  descDetail: string | null
  maxLevel: number | null
  requiredLevel: number | null
}

export interface SkillStylePayload extends CharacterDetail {
  skill: {
    hash: string
    style: {
      active: SkillRef[]
      passive: SkillRef[]
      chain: SkillRef[]
    } | null
  } | null
}

export interface FameRange {
  fame: { min: number; max: number }
  rows: Character[]
}

export interface BuffSkillOption {
  level: number
  desc: string | null
  values: (number | string)[] | null
}

export interface BuffSkillInfo {
  skillId: string
  name: string
  option: BuffSkillOption
}

export interface BuffEquipmentPayload extends CharacterDetail {
  skill: { buff: { skillInfo: BuffSkillInfo; equipment: EquipmentItem[] } }
}

export interface BuffAvatarPayload extends CharacterDetail {
  skill: { buff: { skillInfo: BuffSkillInfo; avatar: AvatarItem[] } }
}

export interface BuffCreatureItem {
  itemId: string | null
  itemName: string | null
  itemRarity: string | null
  enchant: { status: StatusValue[] } | null
}

export interface BuffCreaturePayload extends CharacterDetail {
  skill: { buff: { skillInfo: BuffSkillInfo; creature: BuffCreatureItem[] } }
}

export interface ItemRow {
  itemId: string
  itemName: string
  itemRarity: string | null
  itemType: string | null
  itemTypeDetail: string | null
  itemAvailableLevel: number | null
  fame: number | null
}

export interface ItemShopRow {
  name: string
  details: string[] | null
}

export interface ObtainInfoRow {
  type: string
  rows: { name: string; details: string[] | null }[]
}

export interface ItemInfo extends ItemDetail {
  itemName: string
  itemType: string | null
  itemTypeDetail: string | null
  itemAvailableLevel: number | null
  fame: number | null
  itemExplain: string | null
  itemExplainDetail: string | null
  itemFlavorText: string | null
  setItemId: string | null
  setItemName: string | null
  jobs: { jobId: string; jobName: string }[] | null
  obtainInfo: { dungeon: ObtainInfoRow[] } | null
  shop: ItemShopRow[] | null
}

export interface ItemShopInfo {
  itemId: string
  itemName: string
  itemGradeName: string | null
  itemGradeValue: number | null
  itemStatus: StatusValue[] | null
}

export interface SetItemRow {
  setItemId: string
  setItemName: string
}

export interface SetItemMember {
  slotId: string
  slotName: string
  itemId: string
  itemName: string
  itemRarity: string | null
}

export interface SetItemOption {
  setEquipCount: number
  explain: string | null
  detailExplain: string | null
  itemBuff: { explain: string | null; reinforceSkill: unknown[] } | null
}

export interface SetItemInfo {
  setItemId: string
  setItemName: string
  setItems: SetItemMember[]
  setItemOption: SetItemOption[]
}

export interface SkillListItem {
  skillId: string
  name: string
  requiredLevel: number | null
  type: string | null
}

export interface SkillListPayload {
  skills: SkillListItem[]
}