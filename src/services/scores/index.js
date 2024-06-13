const scores = {
  checkNumber(values, numberToCheck) {
    const result = values.filter((val) => val === numberToCheck)
    return this.sumValues(result)
  },
  checkNumberCount(values, count) {
    const counts = this.countValues(values)
    const valid = !!counts.find((val) => val >= count)
    return valid ? this.sumValues(values) : 0
  },
  checkFullHouse(values) {
    const counts = this.countValues(values)
    const result = counts.sort()
    const valid = result[0] === 2 && result[1] === 3
    return valid ? 25 : 0
  },
  checkStraight(values, length, score) {
    const sorted = [...new Set(values.sort())]
    const sequence = sorted.filter((val, idx) => val === sorted[0] + idx)
    const valid = sequence.length >= length
    return valid ? score : 0
  },
  checkYahtzee(values, score) {
    const counts = this.countValues(values)
    const valid = !!counts.find((val) => val === 5)
    return valid ? score : 0
  },
  countValues(values) {
    const counts = values.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {})
    return Object.values(counts)
  },
  sumValues(values) {
    return values.reduce((acc, val) => acc + val, 0)
  },
  getScores(values, whatCount) {
    const aces = this.checkNumber(values, 1)
    const twos = this.checkNumber(values, 2)
    const threes = this.checkNumber(values, 3)
    const fours = this.checkNumber(values, 4)
    const fives = this.checkNumber(values, 5)
    const sixes = this.checkNumber(values, 6)
    const threeOf = this.checkNumberCount(values, 3)
    const fourOf = this.checkNumberCount(values, 4)
    const fullHouse = this.checkFullHouse(values)
    const smStraight = this.checkStraight(values, 4, 30)
    const lgStraight = this.checkStraight(values, 5, 40)
    const whatzee = this.checkYahtzee(values, whatCount ? 100 : 50)
    const chance = this.sumValues(values)
    return {
      aces,
      twos,
      threes,
      fours,
      fives,
      sixes,
      threeOf,
      fourOf,
      fullHouse,
      smStraight,
      lgStraight,
      whatzee,
      chance
    }
  }
}

export default scores
