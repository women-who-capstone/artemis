// var retext = require('retext')
// var keywords = require('retext-keywords')
// var nlcstToString = require('nlcst-to-string')
// const rake = require('node-rake')
// const ke = require('keyword-extractor')
// const kestopwords = require('keyword-extractor/lib/stopwords/en').stopwords
var WordPOS = require('wordpos')
let wordpos = new WordPOS({ stopwords: true })

let t1 =
  'A subset of our audience really has an issue with episodes that feature any crimes being done to children.  That\'s understandable, since they are the weakest and most vulnerable members of our society.  But there are cases, however rare, where the "monsters" are the children themselves.\n\nIn this episode we explore three cases in which children killed, seemingly for the sheer pleasure of it.  Beware though, you may not ever want to have children after this episode.'
let t2 =
  'US President Barack Obama has delivered his farewell address, urging Americans to defend their democracy. Mr Obama warned democracy is threatened whenever people take it for granted.'

let t3 =
  'The liberal media continues to praise Obama for his farewell address.  While President Obama continues to bask in the glow of the media praise, he has also found a way to take a few shots and Fox News and Sean.  Sean reacts to this and the ongoing Senate hearings.    The Sean Hannity Show is live Monday through Friday from 3pm - 6pm ET on iHeart Radio and Hannity.com.'

let t4 =
  'Who said Obama didn’t do anything for black folk? The gift of Obama’s legacy to Black folks and 6 things we can learn from it to get us through Trump.'

let t5 = 'In “Mrs. Obama,” Amy Davidson writes about the First Lady’s impact.'

const myStopwords = [
  'episode',
  'episodes',
  'podcast',
  'podcasts',
  'after',
  'While'
]

// helper function
function exclude(text) {
  console.log(text.filter(word => !myStopwords.includes(word)))
}

console.log(
  '\n---------------------------',
  t3,
  '\n---------------------------'
)

// WORDPOS ------------------------------------------------------------------
wordpos.getNouns(t3, exclude) // wordpos

// RAKE ---------------------------------------------------------------------
// const opts = { stopwords: myStopwords } // rake
// const keywords = rake.generate(t3, opts) // rake
// console.log(keywords) // rake
// console.log('\n---------------------------') // rake

// KEYWORD-EXTRACTOR --------------------------------------------------------
// myStopwords = myStopwords.concat(kestopwords) // keyword-extractor
// console.log( // keyword-extractor
//   ke.extract(t3, {
//     language: 'english',
//     remove_digits: 'true',
//     return_changed_case: 'true',
//     remove_duplicates: 'true',
//     stopwords: myStopwords
//   })
// )
// console.log('\n---------------------------') // keyword-extractor

// RETEXT -------------------------------------------------------------------
// retext() // retext
//   .use(keywords)
//   .process(t3, function(err, file) {
//     if (err) throw err

//     console.log('\nkeywords:\n-------------------------')
//     file.data.keywords.forEach(keyword => {
//       console.log(nlcstToString(keyword.matches[0].node))
//     })

//     console.log('\nkey-phrases:\n-------------------------')
//     file.data.keyphrases.forEach(phrase => {
//       console.log(phrase.matches[0].nodes.map(nlcstToString).join(''))
//     })
//   })
// console.log('\n-------------------------') // retext
