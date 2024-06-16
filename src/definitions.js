export const slotKeysObj = {
  aces: 'aces',
  twos: 'twos',
  threes: 'threes',
  fours: 'fours',
  fives: 'fives',
  sixes: 'sixes',
  threeOf: 'threeOf',
  fourOf: 'fourOf',
  fullHouse: 'fullHouse',
  smStraight: 'smStraight',
  lgStraight: 'lgStraight',
  whatzee: 'whatzee',
  chance: 'chance'
}

export const topSlots = [
  slotKeysObj.aces,
  slotKeysObj.twos,
  slotKeysObj.threes,
  slotKeysObj.fours,
  slotKeysObj.fives,
  slotKeysObj.sixes
]
export const bottomSlots = [
  slotKeysObj.threeOf,
  slotKeysObj.fourOf,
  slotKeysObj.fullHouse,
  slotKeysObj.smStraight,
  slotKeysObj.lgStraight,
  slotKeysObj.whatzee,
  slotKeysObj.chance
]

export const slotNames = Object.freeze({
  [slotKeysObj.aces]: 'Aces',
  [slotKeysObj.twos]: 'Twos',
  [slotKeysObj.threes]: 'Threes',
  [slotKeysObj.fours]: 'Fours',
  [slotKeysObj.fives]: 'Fives',
  [slotKeysObj.sixes]: 'Sixes',
  [slotKeysObj.threeOf]: '3 of a kind',
  [slotKeysObj.fourOf]: '4 of a kind',
  [slotKeysObj.fullHouse]: 'Full House',
  [slotKeysObj.smStraight]: 'Sm. Straight',
  [slotKeysObj.lgStraight]: 'Lg. Straight',
  [slotKeysObj.whatzee]: 'WHATZEE',
  [slotKeysObj.chance]: 'Chance'
})
