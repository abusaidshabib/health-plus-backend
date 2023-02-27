const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
  const token = req.header('Authorization');

  if(!token) return res.status(401).send("Unauthenticated");

  /*
  1. check for authentication token 
  2. if token not found, return a unauth response
  3. if found continue to the next function

  */

  try{
    const user = jwt.verify(token, process.env.JWT_SECRETE)
    console.log(user);
    req.user = user;

    next();
  }
  catch(err){
    res.status(403).send("Invalid token");
  }
}