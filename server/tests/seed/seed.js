const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id : userOneId,
  email : 'juan@example.com',
  password : 'senoduro',
  tokens : [{
    access : 'auth',
    token : jwt.sign({_id: userOneId, access : 'auth'},'acb123').toString()
  }]
},
{
  _id : userTwoId,
  email : 'kinjds@caca.com',
  password : 'peneduro'
}]

const todos = [{
  _id : new ObjectID(),
  text : 'first test todo'
},
{
  _id : new ObjectID(),
  text : 'second test todo',
  completed: true,
  completedAt : 2342534
}]

const populateTodos =(done)=>{ //wipe db out before every test
  //nefore each gets executed before every test
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=> done());
};

const populateUsers = (done) =>{
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne,userTwo]);

  }).then(()=>{
    done();
  });
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
