const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';

// bcrypt.genSalt(10, (err,salt)=>{
//   bcrypt.hash(password,salt,(err,hash)=>{
//     console.log(hash);
//   });
// });

var hashedPashword = '$2a$10$OtK3KthgLs9MDJRZq2e4IOM966isBYnJuqXAyopAaioz.tizlABW2';

bcrypt.compare(password,hashedPashword, (err,res)=>{
  console.log(res);
});

// var data = {
//   id : 10
// };
//
//
//
// var token = jwt.sign(data,'123abc');
// console.log(token);
//
//
//
// var decoded = jwt.verify(token,'123abc');
// console.log('String decoded',decoded);
