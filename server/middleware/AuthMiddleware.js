import jwt from 'jsonwebtoken'

function authMiddleware (req, res, next) {
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    const token = req.cookies.token
    if (!token) {
      res.redirect('http://localhost:3000/');
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded
    next()
  } catch (e) {
    res.redirect('http://localhost:3000/');
  }
}

export default authMiddleware
