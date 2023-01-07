import jwt from 'jsonwebtoken'

function authMiddleware (req, res, next) {
  
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    const token = req.cookies.token
    if (!token) {
      console.log('Missing JWT token');
      return res.redirect(process.env.URL);
    }
    console.log(token);
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded
    next()
  } catch (e) {
    console.log(e);
    res.redirect(process.env.URL);
  }
}

export default authMiddleware
