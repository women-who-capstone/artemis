const randomPoints = (numberPointsRequested, range, lowestValues) => {
  let points = []
  for (let i = 0; i < numberPointsRequested; i++){
    let point = []
    for (let j = 0; j < range; j++) {
      point.push(lowestValues[j] + (range[j] * Math.random()))
    }
    points.push(point)
  }
  return points
}

class KNN {
  constructor(kSize) {
    this.kSize = kSize
    this.points = points
  }
}


