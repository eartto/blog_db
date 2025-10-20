const errorHandler = (error, request, response, next) => {
  console.error("ERROR: " + error.message)

  if (error.message === 'Validation error: Validation isEmail on username failed') {
    console.log('username must be an email adress')
  }
  if (error.message === 'Validation error: Validation min on year failed') {
    console.log('year must be at least equal to 1991')
  }
  if (error.message === 'Validation error: Validation max on year failed') {
    console.log('year cannot be after current year')
  }

  next(error)
}

module.exports = errorHandler