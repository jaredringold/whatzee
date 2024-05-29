import { bottomSlots, topSlots } from '@/definitions'

const slots = {
  ...topSlots.reduce((acc, slot) => ((acc[slot] = 0), acc), {}),
  ...bottomSlots.reduce((acc, slot) => ((acc[slot] = 0), acc), {})
}
const slotsLocked = {
  ...topSlots.reduce((acc, slot) => ((acc[slot] = false), acc), {}),
  ...bottomSlots.reduce((acc, slot) => ((acc[slot] = false), acc), {})
}

export default {
  slots,
  slotsLocked,
  bonusWhatzee: 0
}
