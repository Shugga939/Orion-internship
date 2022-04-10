import ApiError from './../error/ApiError.js'
 
function errorHandler (err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json(err.message)
  }

  return res.status(500).json('Unexpected error')
}

export default errorHandler
