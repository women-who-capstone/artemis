//potentially pre-populate
//add genre to table of has been selected genre every time user selects genre
//only have genres that people have selected before in database
//genre id is position in vector, with each genre's score in the relevant index of the vectot
  //if there is no score, there is a default value of 0.5, things never rated
//every channel has vector
//construct array of arrays for all user's channels
//every user has these channel vectors
//we then have array of all channels for all users
//make database query to get all channel vectors
//create function that takes two channel vectors and returns a number, this will represent a distance between the user's channel and every other channel
//Math.sqrt(((x_1 -y_1)^2 + (x_2-y_2)^2 + ...+(x_k -y_k)) / k)
//then sort by dist (dist(myVec, x) < dist(myVec, y)) ? -1 : 1


