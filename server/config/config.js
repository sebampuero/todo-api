var env = process.env.NODE_ENV || 'development';
//in heroku NODE_ENV is set to production, so the defaults take action
//see server.js and mongoose.js

if (env === 'development' || env === 'test'){
  var config = require('./config.json');
  var envConfig = config[env]; //select development or test

  Object.keys(envConfig).forEach((key)=>{
    process.env[key] = envConfig[key];
  }); //gets keys in an object and returns them as array
}

// if(env === 'development'){
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }else if(env === 'test'){
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }

module.exports = {env};
