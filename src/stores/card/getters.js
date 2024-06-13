import { bottomSlots, topSlots } from '@/definitions'

export default {
  numbersScore(state) {
    const entries = Object.entries(state.slots).filter(([key]) => topSlots.includes(key))
    return sum(entries)
  },
  topStarted(state) {
    const filtered = Object.entries(state.slotsLocked).filter(([key]) => topSlots.includes(key))
    return filtered.some(([_, val]) => val)
  },
  topComplete(state) {
    const filtered = Object.entries(state.slotsLocked).filter(([key]) => topSlots.includes(key))
    return filtered.every(([_, val]) => val)
  },
  bonusEarned() {
    return this.numbersScore >= 63
  },
  bonus() {
    if (this.topComplete || this.bonusEarned) {
      return this.bonusEarned ? 35 : 0
    }
    return (63 - this.numbersScore) * -1
  },
  topScore() {
    const bonus = this.bonusEarned ? this.bonus : 0
    return this.numbersScore + bonus
  },
  bottomScore(state) {
    const entries = Object.entries(state.slots).filter(([key]) => bottomSlots.includes(key))
    return sum(entries)
  },
  totalScore(state) {
    const bonusWhatzeeScore = state.bonusWhatzee * 100
    return this.topScore + this.bottomScore + bonusWhatzeeScore
  },
  cardStarted(state) {
    return Object.values(state.slotsLocked).some((val) => val)
  },
  cardComplete(state) {
    return Object.values(state.slotsLocked).every((val) => val)
  },
  slotsRemaining(state) {
    return Object.values(state.slotsLocked).filter((val) => !val).length
  }
}

const sum = (entries) => entries.reduce((acc, [_, val]) => acc + val, 0)
