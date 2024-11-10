const requireAudio = require.context('../../assets/audios/friends', false, /\.mp3$/)
export const FRIEND_SOUNDS = requireAudio.keys().map(requireAudio)