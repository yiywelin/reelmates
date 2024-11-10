import { FRIEND_SOUNDS } from './friendSounds'
import { GROUP_SOUNDS } from './groupSounds'

const SOUND_COLLECTIONS = {
  friend: FRIEND_SOUNDS,
  group: GROUP_SOUNDS
}

export const playRandomSound = (type, options = {}) => {
  const {
    volume = 0.7,
    fadeIn = false,
    fadeInDuration = 500
  } = options

  const soundList = SOUND_COLLECTIONS[type]
  if (!soundList?.length) return

  const randomIndex = Math.floor(Math.random() * soundList.length)
  const audio = new Audio(soundList[randomIndex])
  
  if (fadeIn) {
    audio.volume = 0
    const steps = 20
    const stepTime = fadeInDuration / steps
    const volumeStep = volume / steps
    
    let currentStep = 0
    const fadeInterval = setInterval(() => {
      currentStep++
      audio.volume = Math.min(volume, volumeStep * currentStep)
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval)
      }
    }, stepTime)
  } else {
    audio.volume = volume
  }

  return audio.play().catch(error => {
    console.log('Audio playback failed:', error)
  })
} 