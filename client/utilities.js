import axios from 'axios';

export const getRandomIndex = length => {
  return Math.floor(Math.random() * length)
}

//keys in resulting object are episode ids
export const convertPlayedEpisodesArrayToObject = playedEpisodesArr => {
  let playedEpisodes = {}
  playedEpisodesArr.forEach(episode => {
    playedEpisodes[episode.id] = true
  })
  return playedEpisodes
}

export const getRandomNonRepeatingIndices = length => {
  let indices = {}
  let currentIndex
  while (Object.keys(indices) < length) {
    currentIndex = Math.floor(Math.random() * length)
    indices[currentIndex] = true
  }

  return Object.keys(indices)
}
