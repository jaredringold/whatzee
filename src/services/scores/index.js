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
  checkFullHouse(values, bonus) {
    if (bonus) return 25
    const counts = this.countValues(values)
    const result = counts.sort()
    const valid = result[0] === 2 && result[1] === 3
    return valid ? 25 : 0
  },
  checkStraight(values, length, score, bonus) {
    if (bonus) return score
    const sequences = {
      4: ['1234', '2345', '3456'],
      5: ['12345', '23456']
    }
    const sorted = [...new Set(values.sort())].join('')
    const valid = sequences[length].some((seq) => sorted.includes(seq))
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
  getScores(values, whatzee) {
    const bonus = whatzee ? !!this.checkYahtzee(values, 50) : false
    return {
      aces: this.checkNumber(values, 1),
      twos: this.checkNumber(values, 2),
      threes: this.checkNumber(values, 3),
      fours: this.checkNumber(values, 4),
      fives: this.checkNumber(values, 5),
      sixes: this.checkNumber(values, 6),
      threeOf: this.checkNumberCount(values, 3),
      fourOf: this.checkNumberCount(values, 4),
      fullHouse: this.checkFullHouse(values, bonus),
      smStraight: this.checkStraight(values, 4, 30, bonus),
      lgStraight: this.checkStraight(values, 5, 40, bonus),
      whatzee: this.checkYahtzee(values, 50),
      chance: this.sumValues(values)
    }
  }
}

export default scores
