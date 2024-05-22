<script>
export default {
  data() {
    return {
      dice: [
        { value: 6, locked: false, rolling: false, steps: 0 },
        { value: 6, locked: false, rolling: false, steps: 0 },
        { value: 5, locked: false, rolling: false, steps: 0 },
        { value: 6, locked: false, rolling: false, steps: 0 },
        { value: 6, locked: false, rolling: false, steps: 0 }
      ],
      card: {
        ones: 0,
        twos: 0,
        threes: 0,
        fours: 0,
        fives: 0,
        sixes: 0,
        threeOf: 0,
        fourOf: 0,
        fullHouse: 0,
        smStraight: 0,
        lgStraight: 0,
        yahtzee: 0
      },
      stepDuration: 200,
      rolls: 3,
      score: 0,
      yCount: 1,
      scores: {}
    }
  },
  computed: {
    rolling() {
      return this.dice.filter((die) => die.rolling).length > 0
    },
    disableRoll() {
      if (this.rolls === 0) return true
      if (this.rolling) return true
      const locked = this.dice.filter((die) => die.locked).length
      if (locked === this.dice.length) return true
      return false
    },
    totalScore() {
      return Object.values(this.card).reduce((acc, val) => acc + val, 0)
    }
  },
  watch: {
    rolling(newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        this.scores = this.getScores()
      }
    }
  },
  methods: {
    reset() {
      this.rolls = 3
      this.scores = {}
      this.dice.forEach((die) => {
        die.value = null
        die.locked = false
        die.steps = 0
      })
    },
    roll() {
      this.rolls--
      const activeDice = this.dice.filter((die) => !die.locked)
      if (activeDice.length) {
        for (const die of activeDice) {
          const steps = this.getRandomIntegerInclusive(2, 5)
          die.steps = steps
          this.rollDie(die, steps)
        }
      }
    },
    rollDie(die, steps) {
      if (steps === 0) {
        die.steps = 0
        die.rolling = false
        return
      }
      die.value = this.getRandomIntegerInclusive(1, 6)
      die.rolling = true
      setTimeout(() => this.rollDie(die, --steps), this.stepDuration)
    },
    toggleLocked(index) {
      const die = this.dice[index]
      if (!die.value || die.rolling) {
        return
      }
      die.locked = !die.locked
    },
    getRandomIntegerInclusive(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    getScores() {
      const diceValues = this.dice.map((die) => die.value)
      const aces = this.checkNumber(diceValues, 1)
      const twos = this.checkNumber(diceValues, 2)
      const threes = this.checkNumber(diceValues, 3)
      const fours = this.checkNumber(diceValues, 4)
      const fives = this.checkNumber(diceValues, 5)
      const sixes = this.checkNumber(diceValues, 6)
      const threeOf = this.checkNumberCount(diceValues, 3)
      const fourOf = this.checkNumberCount(diceValues, 4)
      const fullHouse = this.checkFullHouse(diceValues)
      const smStraight = this.checkStraight(diceValues, 4, 30)
      const lgStraight = this.checkStraight(diceValues, 5, 40)
      const yahtzee = this.checkYahtzee(diceValues, this.yCount ? 100 : 50)
      const chance = this.sumValues(diceValues)
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
        yahtzee,
        chance
      }
    },
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
    getDieClasses(die) {
      return { rolling: die.rolling, locked: die.locked }
    },
    getTransitionStyles(die) {
      return {
        transform: `rotate(${360 * die.steps}deg)`,
        transitionDuration: `${die.steps * this.stepDuration}ms`
      }
    }
  }
}
</script>

<template>
  <div class="app">
    <div class="dice">
      <div v-for="(die, index) of dice" :key="index" class="die-slot">
        <div
          class="die"
          :class="getDieClasses(die)"
          :style="getTransitionStyles(die)"
          :data-value="die.value"
          @click="toggleLocked(index)"
        >
          <span v-for="n in die.value" class="dot" :class="`dot-${n}`" :key="n"></span>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button class="button is-large roll-btn" :disabled="disableRoll" @click="roll">Roll</button>
      <button class="button is-large reset-btn" @click="reset">Reset</button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap');

* {
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
.app {
  padding: 5%;
  font-size: 1vw;
  font-family: 'Poetsen One', sans-serif;
  font-weight: 400;
  font-style: normal;
}

pre {
  font-size: 2em;
}

.dice {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(1, 1fr);
  gap: 5%;
  margin-bottom: 5%;
}

.die-slot {
  aspect-ratio: 1 /1;
  width: 100%;
  // padding: 10%;
  // border: solid 1px rgb(214, 217, 224);
  // border-radius: 2em;
}

.die {
  aspect-ratio: 1 /1;
  width: 100%;
  padding: 10%;
  border: solid 1px rgb(214, 217, 224);
  border-radius: 2em;
  background-color: rgb(240, 240, 240);
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0));
  box-shadow:
    0 0.25em 0.5em rgba(51, 51, 51, 0.25),
    inset 0 0 0.5em 0.5em rgba(white, 0.75);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    'a b c'
    'd e f'
    'g h i';
  place-items: center;
  transition: transform 0s;
  cursor: pointer;

  &.rolling {
    transform: rotate(720deg);
    transition-duration: 1s;
  }

  &.locked {
    outline: solid 1em red;
    transition: outline 2s;
  }

  // &:nth-of-type(1) {
  //   background-color: rgb(0, 0, 0);
  // }
  // &:nth-of-type(2) {
  //   background-color: rgb(220, 0, 20);
  // }
  // &:nth-of-type(3) {
  //   background-color: rgb(0, 220, 60);
  // }
  // &:nth-of-type(4) {
  //   background-color: rgb(20, 0, 220);
  // }
  // &:nth-of-type(5) {
  //   background-color: rgb(250, 250, 250);
  //   .dot {
  //     background: linear-gradient(to bottom, #000, #999);
  //   }
  // }

  .dot {
    aspect-ratio: 1/1;
    width: 70%;
    border-radius: 50%;
    background: linear-gradient(to bottom, #000, #999);
    // background: linear-gradient(to bottom, #999, #fff);
  }

  &[data-value='1'] {
    .dot-1 {
      grid-area: e;
    }
  }

  &[data-value='2'] {
    .dot-1 {
      grid-area: a;
    }
    .dot-2 {
      grid-area: i;
    }
  }

  &[data-value='3'] {
    .dot-1 {
      grid-area: a;
    }
    .dot-2 {
      grid-area: e;
    }
    .dot-3 {
      grid-area: i;
    }
  }

  &[data-value='4'] {
    .dot-1 {
      grid-area: a;
    }
    .dot-2 {
      grid-area: c;
    }
    .dot-3 {
      grid-area: g;
    }
    .dot-4 {
      grid-area: i;
    }
  }

  &[data-value='5'] {
    .dot-1 {
      grid-area: a;
    }
    .dot-2 {
      grid-area: c;
    }
    .dot-3 {
      grid-area: e;
    }
    .dot-4 {
      grid-area: g;
    }
    .dot-5 {
      grid-area: i;
    }
  }

  &[data-value='6'] {
    .dot-1 {
      grid-area: a;
    }
    .dot-2 {
      grid-area: c;
    }
    .dot-3 {
      grid-area: d;
    }
    .dot-4 {
      grid-area: f;
    }
    .dot-5 {
      grid-area: g;
    }
    .dot-6 {
      grid-area: i;
    }
  }
}

.buttons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5%;
  margin-bottom: 5%;

  .button {
    font-family: 'Poetsen One', sans-serif;
    font-size: 3em;
    padding: 0.5em;
    cursor: pointer;
    border: solid 1px rgb(214, 217, 224);
    border-radius: 2vw;
    background-color: rgb(240, 240, 240);
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0));
    box-shadow:
      0 0.25vw 0.5vw rgba(51, 51, 51, 0.25),
      inset 0 0 0.5vw 0.5vw rgba(white, 0.75);

    &:active {
      transform: translateY(0.125em);
      box-shadow:
        0 0.125vw 0.125vw rgba(51, 51, 51, 0.25),
        inset 0 0 0.5vw 0.5vw rgba(white, 0.75);
    }

    &:disabled {
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  .roll-btn {
    grid-column: 1 / span 3;
  }

  .reset-btn {
    grid-column: 4 / span 2;
  }
}
</style>
