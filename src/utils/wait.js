// Shortest time the skeleton stays on screen, so it does not just flash
export const skeletonTime = 800

// Waits for the given milliseconds
export function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms)
  })
}
