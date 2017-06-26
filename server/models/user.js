const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
  var token = jwt.sign({_id: user._id.toHexString(), access: access},'acb123').
    toString();
  user.tokens.push({access,token});

  return user.save().then(()=>{ //this in order to chain .then() in server.js
    //promise will also be passed to server js!!
    //if this promise fails, this will be handled i the server!!
    return token; //this will be passed as success value for the next call
  });
};

var User = mongoose.model('User',UserSchema);
module.exports = {User};
