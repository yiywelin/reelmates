const requireAudio = require.context('../../assets/audios/groups', false, /\.mp3$/)
export const GROUP_SOUNDS = requireAudio.keys().map(requireAudio)