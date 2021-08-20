const logger = require('./logger')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }

  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).sent({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  logger.error(error.message)

  next(error)
}

module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor
}