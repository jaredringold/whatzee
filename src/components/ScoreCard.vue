<script>
import { defineComponent } from 'vue'
import useCardStore from '@/stores/card'
import { topSlots, bottomSlots, slotNames } from '@/definitions'

export default defineComponent({
  props: {
    scores: Object,
    pendingScore: Object,
    rolling: Boolean,
    handActive: Boolean
  },
  setup() {
    const cardStore = useCardStore()
    return { cardStore }
  },
  data() {
    return {
      topSlots,
      bottomSlots
    }
  },
  computed: {
    bonus() {
      if (this.cardStore.bonusEarned) {
        return this.cardStore.bonus
      }
      if (this.cardStore.gameStarted) {
        const pending = topSlots.includes(this.pendingScore?.slot) ? this.pendingScore?.score : 0
        return this.cardStore.bonus + pending
      }
      return ' '
    },
    totalUpper() {
      return this.cardStore.cardStarted ? this.cardStore.topScore : ' '
    },
    totalLower() {
      return this.cardStore.cardStarted ? this.cardStore.bottomScore : ' '
    }
  },
  methods: {
    getSlotLabel(slot) {
      return slotNames[slot]
    },
    getSlotValue(slot) {
      if (this.cardStore.slotsLocked[slot]) {
        return this.cardStore.slots[slot]
      }
      return this.scores?.[slot] !== undefined ? this.scores[slot] : ' '
    },
    getSlotClasses(slot) {
      return {
        locked: this.cardStore.slotsLocked[slot] || this.pendingScore?.slot === slot,
        playable: !this.rolling && this.handActive
      }
    },
    setSlotScore(slot) {
      const score = this.scores[slot]
      this.$emit('setScore', { slot, score })
    }
  }
})
</script>

<template>
  <div class="score-card">
    <div class="score-card__column score-card__column--left">
      <template v-for="(slot, index) in topSlots" :key="slot">
        <div class="score-card__slot-label" :class="{ 'top-left': index === 0 }">
          {{ getSlotLabel(slot) }}
        </div>
        <div
          class="score-card__slot-score"
          :class="getSlotClasses(slot)"
          @click="setSlotScore(slot)"
        >
          {{ getSlotValue(slot) }}
        </div>
      </template>
      <div class="score-card__slot-label">BONUS</div>
      <div
        class="score-card__slot-score"
        :class="{ locked: cardStore.topComplete || cardStore.bonusEarned }"
      >
        {{ bonus }}
      </div>
      <div class="score-card__slot-label bottom-left">TOTAL Upper</div>
      <div class="score-card__slot-score total">
        {{ totalUpper }}
      </div>
    </div>
    <div class="score-card__column score-card__column--right">
      <template v-for="(slot, index) in bottomSlots" :key="slot">
        <div class="score-card__slot-label">{{ getSlotLabel(slot) }}</div>
        <div
          class="score-card__slot-score"
          :class="{
            ...getSlotClasses(slot),
            'top-right': index === 0
          }"
          @click="setSlotScore(slot)"
        >
          {{ getSlotValue(slot) }}
        </div>
      </template>
      <div class="score-card__slot-label">TOTAL Lower</div>
      <div class="score-card__slot-score bottom-right total">
        {{ totalLower }}
      </div>
      <!-- <div class="score-card__slot-label last">TOTAL</div> -->
      <!-- <div class="score-card__slot-score last">{{ cardStore.totalScore }}</div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.score-card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  // outline: 0.25rem solid rgb(214, 217, 224);
  border: 0.25rem solid rgb(214, 217, 224);
  border-radius: 2rem;
  margin-bottom: 8rem;
  // overflow: hidden;

  &__column {
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: center;
  }

  &__slot-label {
    font-size: 4rem;
    line-height: 10rem;
    font-weight: 700;
    padding: 0 2rem;
    // outline: 0.125rem solid rgb(214, 217, 224);
    box-shadow: 0 0 0 0.125rem rgb(214, 217, 224);

    &.top-left {
      border-top-left-radius: 1.9rem;
    }
    &.bottom-left {
      border-bottom-left-radius: 1.9rem;
    }
  }

  &__slot-score {
    position: relative;
    font-family: 'Open Sans', sans-serif;
    font-size: 8rem;
    line-height: 10rem;
    font-weight: 400;
    color: rgb(214, 217, 224);
    text-align: end;
    padding: 0 2rem;
    // outline: 0.125rem solid rgb(214, 217, 224);
    box-shadow: 0 0 0 0.125rem rgb(214, 217, 224);

    &.top-right {
      border-top-right-radius: 1.9rem;
    }
    &.bottom-right {
      border-bottom-right-radius: 1.9rem;
    }

    &.playable {
      cursor: pointer;

      &::after {
        content: '';
        position: absolute;
        inset-block-start: -2rem;
        inset-inline-end: -2rem;
        inset-block-end: -2rem;
        inset-inline-start: -2rem;
        z-index: 5;
        border: solid 1rem red;
        border-radius: 3rem;
        pointer-events: none;
        box-shadow: 0 0.25vw 0.5vw rgba(51, 51, 51, 0.5);
        opacity: 0;
        transition: opacity 100ms;
      }

      &:hover::after {
        opacity: 1;
      }
    }

    &.locked {
      color: #000;
      cursor: default;
      pointer-events: none;
    }

    &.total {
      color: #000;
      font-weight: 600;
    }
  }
}
</style>
