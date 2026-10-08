// Only the main content area scrolls (see AppLayout), not the whole window
export function getScrollArea() {
  return document.getElementById('main-content')
}

// Move the content area back to the top, smooth: true for a gentle scroll
export function scrollToTop(smooth) {
  const area = getScrollArea()
  if (area) {
    area.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
  }
}
