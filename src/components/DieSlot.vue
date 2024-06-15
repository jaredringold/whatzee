<script>
import { sleep } from '@/services/utils'

export default {
  props: {
    die: Object,
    stepDuration: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      rollStart: false,
      rollEnd: false,
      isRolling: false
    }
  },
  computed: {
    classes() {
      return { rolling: this.die.rolling, locked: this.die.locked }
    },
    styles() {
      if (this.isRolling) {
        return {
          transform: `rotate(${360 * this.die.steps}deg)`,
          transitionDuration: `${this.die.steps * this.stepDuration}ms`
          // transformOrigin: `${50 + getRandomIntegerInclusive(-5, 5)}% ${50 + getRandomIntegerInclusive(-5, 5)}%`
        }
      }
      return false
    }
  },
  watch: {
    async 'die.rolling'(isRolling, wasRolling) {
      if (isRolling && !wasRolling) {
        this.rollStart = true
        await sleep(10)
        // await this.$nextTick()
        this.rollStart = false
        this.isRolling = true
      }
      if (!isRolling && wasRolling) {
        this.rollEnd = true
        await sleep(10)
        // await this.$nextTick()
        this.rollEnd = false
        this.isRolling = false
      }
    }
  },
  methods: {
    click() {
      this.$emit('dieClicked')
    }
  }
}
</script>

<template>
  <div class="die-slot" :class="{ locked: this.die.locked }">
    <div class="die" :class="classes" :style="styles" :data-value="die.value" @click="click">
      <template v-if="die.value">
        <span v-for="n in die.value" class="dot" :class="`dot-${n}`" :key="n"></span>
      </template>
      <template v-else>
        <span class="default">W</span>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.die-slot {
  aspect-ratio: 1 /1;
  width: 100%;
  // padding: 10%;
  // border: solid 1px rgb(214, 217, 224);
  border-radius: 2em;
  // background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.5));
  // box-shadow: inset 0 0 0 1em rgba(51, 51, 51, 0.25);
  outline: solid 0 red;
  transition: transform 200ms;

  // &.locked {
  //   // outline: solid 1em red;
  //   transform: scale(0.95);
  // }
}

.die {
  aspect-ratio: 1 /1;
  padding: 10%;
  border: solid 0.25em rgb(214, 217, 224);
  border-radius: 2em;
  outline: solid 0 red;
  background-color: #fff;
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
  transition:
    transform 200s,
    outline 100ms;
  transform-origin: center;
  cursor: pointer;

  &.locked {
    outline: solid 1em red;
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

  .default {
    grid-area: span 3 / span 3;
    font-size: 6rem;
    opacity: 0.125;
  }

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
</style>
