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
      return !this.pendingScore || !this.cardStore.gameStarted
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
      this.cardStore.gameStarted = true
      if (this.pendingScore) {
        this.resetHand()
      }
      this.scores = null
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
      return scores.getScores(diceValues, this.whatCount)
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
    <h1 class="title">Whatzee</h1>
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

<style lang="scss" scoped>
.app {
  padding: 5vw;
  /* font-size: calc(1vw * 0.7); */
  font-family: 'Poetsen One', sans-serif;
  font-weight: 400;
  font-style: normal;

  @media (min-width: 600px) {
    padding: 5vw 15vw;
  }
}

.title {
  font-size: 16rem;
  line-height: 1.5;
  text-align: center;
  color: white;
  text-shadow: 0 0.25rem 0.5rem rgba(51, 51, 51, 0.75);
}

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
