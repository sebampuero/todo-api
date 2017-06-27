var {User} = require('./../models/user');


var authenticate = (req,res,next)=>{
  var token = req.header('x-auth');

  User.findByToken(token).then((user)=>{
    if(!user){
      return Promise.reject(); //this send this method directly to catch
    }
    req.user = user; //save these params in the req for route methods
    req.token = token;
    next();
  }).catch((e)=>{
    res.status(401).send();
  });
}

module.exports = {authenticate};
