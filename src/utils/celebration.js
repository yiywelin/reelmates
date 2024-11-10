import confetti from 'canvas-confetti'

const duration = 3000
const defaults = {
  startVelocity: 30,
  spread: 360,
  ticks: 60,
  zIndex: 0
}

export const celebrate = (type = 'friend') => {
  const animationEnd = Date.now() + duration
  
  const randomInRange = (min, max) => {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    
    // Since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    })
  }, 250)

  // Voice celebration
  const message = type === 'friend' 
    ? "Booyah! You have friends!" 
    : "Booyah! You have a group!"

  // Add a slight delay to sync better with the confetti
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.pitch = 1.5
    utterance.rate = 1.1
    utterance.volume = 0.8
    window.speechSynthesis.speak(utterance)
  }, 100)
} 