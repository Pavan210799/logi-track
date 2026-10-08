import { useEffect, useState } from 'react'

// 5 cards on phones, 6 on tablets (2 or 3 columns), 8 on desktops (4 columns)
function getCardsPerPage() {
  if (window.innerWidth < 640) {
    return 5
  }
  if (window.innerWidth < 1280) {
    return 6
  }
  return 8
}

// Gives the number of cards to show, and updates it when the window is resized
function useCardsPerPage() {
  const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage)

  useEffect(function () {
    function handleResize() {
      setCardsPerPage(getCardsPerPage())
    }

    window.addEventListener('resize', handleResize)
    return function () {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return cardsPerPage
}

export default useCardsPerPage
