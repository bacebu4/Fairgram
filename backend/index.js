/**
 * Dependencies
 */

express = require('express')

/**
 * config-express
 */

const app = express()

/**
 * endpoint
 */

app.get('/', (request, response) => {
  response.send('love node!')
})

/**
 * listen
 */

app.listen(3000)