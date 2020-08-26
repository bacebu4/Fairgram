/**
 * Dependencies
 */

express = require('express')

/**
 * config-express
 */

const app = express()

/**
 * endpoint - posts
 */

app.get('/posts', (request, response) => {
  const posts = [
    {
      caption: 'Golden Gate Bridge',
      location: 'San Francisco'
    },
    {
      caption: 'London Eye',
      location: 'London'
    },
  ]
  response.send(posts)
})

/**
 * listen
 */

app.listen(3000)