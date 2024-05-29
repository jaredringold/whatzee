<script>
import { defineComponent } from 'vue'
import DieSlot from '@/components/DieSlot.vue'
import ScoreCard from '@/components/ScoreCard.vue'
import useCardStore from './stores/card'
import scores from '@/services/scores'
import { getRandomIntegerInclusive } from '@/services/utils'

export default defineComponent({
  setup() {
    const cardStore = useCardStore()
    return { cardStore }
  },
  components: {
    DieSlot,
    ScoreCard
  },
  data() {
    return {
      dice: [
        { value: 0, locked: false, rolling: false, steps: 0 },
        { value: 0, locked: false, rolling: false, steps: 0 },
        { value: 0, locked: false, rolling: false, steps: 0 },
        { value: 0, locked: false, rolling: false, steps: 0 },
        { value: 0, locked: false, rolling: false, steps: 0 }
      ],
      stepDuration: 200,
      rolls: 3,
      score: 0,
      whatCount: 0,
      scores: null,
      whatzy: false,
      pendingScore: null
    }
  },
  computed: {
    rolling() {
      return this.dice.filter((die) => die.rolling).length > 0
    },
    handActive() {
      return this.rolls < 3
    },
    disableRoll() {
      if (this.cardStore.cardComplete) return true
      if (this.rolls === 0 && !this.pendingScore) return true
      if (this.rolling) return true
      const locked = this.dice.filter((die) => die.locked).length
      if (locked === this.dice.length) return true
      return false
    },
    disableUndo() {
      return !this.pendingScore || !this.cardStore.cardStarted
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
    setScore(pendingScore) {
      this.cardStore.setScore(pendingScore)
    },
    resetHand() {
      if (this.pendingScore) this.setScore(this.pendingScore)
      this.rolls = 3
      this.scores = null
      this.pendingScore = null
      this.dice.forEach((die) => {
        die.value = 0
        die.locked = false
        die.steps = 0
      })
    },
    resetCard() {
      this.resetHand()
      this.cardStore.resetCard()
    },
    undoScore() {
      this.pendingScore = null
    },
    roll() {
      if (this.pendingScore) {
        this.resetHand()
      }
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
      const whatzee = scores.checkYahtzee(diceValues, this.whatCount ? 100 : 50)
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
        whatzee,
        chance
      }
    },
    setPendingScore(payload) {
      this.pendingScore = payload
      if (this.cardStore.slotsRemaining === 1) {
        this.setScore(payload)
      }
    }
  }
})
</script>

<template>
  <div class="app">
    <ScoreCard
      :scores="scores"
      :pendingScore="pendingScore"
      :rolling="rolling"
      :handActive="handActive"
      @setScore="setPendingScore"
    />
    <div class="dice" :class="{ whatzy }">
      <DieSlot
        v-for="(die, index) of dice"
        :key="index"
        :die="die"
        :stepDuration="stepDuration"
        @toggleLocked="toggleLocked(index)"
      />
    </div>
    <div class="buttons">
      <button class="button roll-btn" :disabled="disableRoll" @click="roll">
        Roll <span class="roll-count">{{ rolls }}</span>
      </button>
      <button v-if="cardStore.cardComplete" class="button reset-btn" @click="resetCard">
        Reset
      </button>
      <button v-else class="button undo-btn" :disabled="disableUndo" @click="undoScore">
        Undo
      </button>
      <!-- <button class="button toggle-btn" @click="whatzy = !whatzy">Toggle Whatzy</button> -->
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

:root {
  font-size: calc(1vw * 0.7);
}
* {
  box-sizing: border-box;
}

.app {
  padding: 10%;
  /* font-size: calc(1vw * 0.7); */
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
  gap: 5em;
  margin-bottom: 5em;
  transition: transform 200ms;

  &.whatzy {
    transform: scale(1.125);
  }
}

.buttons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto;
  gap: 5em;
  margin-bottom: 5em;

  .button {
    font-family: 'Poetsen One', sans-serif;
    font-size: 5em;
    line-height: 1;
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

    .roll-count {
      display: inline-block;
      font-size: 75%;
      line-height: 1.5em;
      width: 1.5em;
      vertical-align: middle;
      border-radius: 50%;
      color: #fff;
      background: linear-gradient(to bottom, #000, #999);
      margin: -0.25em 0 -0.125em;
    }
  }

  .reset-btn,
  .undo-btn {
    grid-column: 4 / span 2;
  }

  .toggle-btn {
    grid-column: 1 / span 5;
  }
}
</style>
