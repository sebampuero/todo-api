const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email : {
      type: String,
      required: true,
      trim:true,
      minlength : 1,
      unique: true,
      validate : {
        validator : (value)=>{
            return validator.isEmail(value);
        },
        message : '{VALUE} is not a valid email'
      }
    },
    password : {
      type: String,
      required: true,
      minlength : 6
    },
    tokens : [{
      access : {
        type : String,
        required : true
      },
      token : {
        type : String,
        required : true
      }
    }]
});

UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();
  //return only necessary data to client from server
  return _.pick(userObject, ['_id','email']);
};

UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access: access},process.env.JWT_SECRET).
    toString();
  user.tokens.push({access,token});

  return user.save().then(()=>{ //this in order to chain .then() in server.js
    //promise will also be passed to server js!!
    //if this promise fails, this will be handled i the server!!
    return token; //this will be passed as success value for the next call
  });
};
UserSchema.statics.findByToken = function(token){
  var User = this; //model methods
  var decoded;

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }catch(e){
    return Promise.reject(); //this rejects the promise right away
    //catch will be fired automatically in server js
  }
  //return a promise
  return User.findOne({
    '_id': decoded._id, //use quotes by _id because those are also defined below
    'tokens.token':token, //<--- query nested objects inside user
    'tokens.access' : 'auth'
  });
}
UserSchema.statics.findByCredentials = function(email,password){
  var User = this;
  return User.findOne({email}).then((user)=>{
    if(!user){
      return Promise.reject();
    }
    //since bcrypt does not support promises, we make a new one and return it so that
    //if this fails, this gets caught in the server js findByCredentials
    return new Promise((resolve,reject)=>{
      bcrypt.compare(password,user.password,(err,res)=>{
        if(res){
          resolve(user);
        }else{
          reject('Invalid credentials');
        }
      });
    });
  });
}
UserSchema.methods.removeToken = function(token){
  var user = this;
  return user.update({
    $pull : { //take only the token object out from the user instance '$pull'
      tokens: {
        token : token
      }
    }
  });
}

UserSchema.pre('save',function(next){
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(user.password,salt,(err,hash)=>{
        user.password = hash;
        next(); //its important to call this inside the callback function
        //because otherwise mongoose saves the data before the password is hashed
      });
    });
  }else{
    next();
  }
});

var User = mongoose.model('User',UserSchema);
module.exports = {User};
