<script>
import DieSlot from '@/components/DieSlot.vue'
import scores from '@/services/scores'
import { getRandomIntegerInclusive } from '@/services/utils'

export default {
  components: {
    DieSlot
  },
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
    rolling(isRolling, wasRolling) {
      if (!isRolling && wasRolling) {
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
          const steps = getRandomIntegerInclusive(2, 5)
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
      die.value = getRandomIntegerInclusive(1, 6)
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
    getScores() {
      const diceValues = this.dice.map((die) => die.value)
      const aces = scores.checkNumber(diceValues, 1)
      const twos = scores.checkNumber(diceValues, 2)
      const threes = scores.checkNumber(diceValues, 3)
      const fours = scores.checkNumber(diceValues, 4)
      const fives = scores.checkNumber(diceValues, 5)
      const sixes = scores.checkNumber(diceValues, 6)
      const threeOf = scores.checkNumberCount(diceValues, 3)
      const fourOf = scores.checkNumberCount(diceValues, 4)
      const fullHouse = scores.checkFullHouse(diceValues)
      const smStraight = scores.checkStraight(diceValues, 4, 30)
      const lgStraight = scores.checkStraight(diceValues, 5, 40)
      const yahtzee = scores.checkYahtzee(diceValues, this.yCount ? 100 : 50)
      const chance = scores.sumValues(diceValues)
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
    }
  }
}
</script>

<template>
  <div class="app">
    <div class="dice">
      <DieSlot
        v-for="(die, index) of dice"
        :key="index"
        :die="die"
        :stepDuration="stepDuration"
        @toggleLocked="toggleLocked(index)"
      />
    </div>
    <div class="buttons">
      <button class="button is-large roll-btn" :disabled="disableRoll" @click="roll">Roll</button>
      <button class="button is-large reset-btn" @click="reset">Reset</button>
    </div>
    <pre>{{ scores }}</pre>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap');

* {
  box-sizing: border-box;
}

.app {
  padding: 5%;
  font-size: 1vw;
  font-family: 'Poetsen One', sans-serif;
  font-weight: 400;
  font-style: normal;
}
</style>

<style lang="scss" scoped>
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
