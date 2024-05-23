export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getRandomIntegerInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
