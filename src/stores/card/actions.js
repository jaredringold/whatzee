export default {
  setScore({ slot, score }) {
    if (this.slotsLocked[slot]) {
      return
    }
    this.slots[slot] = score
    this.slotsLocked[slot] = true
  },
  resetCard() {
    Object.keys(this.slots).forEach((key) => (this.slots[key] = 0))
    Object.keys(this.slotsLocked).forEach((key) => (this.slotsLocked[key] = false))
  }
}
