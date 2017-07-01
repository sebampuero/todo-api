require('./config/config'); //get the config files
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT;


app.use(bodyParser.json());

app.post('/todos',authenticate,(req,res)=>{
  var todo  = new Todo({
    text : req.body.text,
    _creator : req.user._id
  });
  todo.save().then((todo)=>{
    res.send({todo});
  },(error)=>{
    res.status(400).send(error);
  });
});

app.get('/todos',authenticate,(req,res)=>{
  Todo.find({_creator : req.user._id}).then((todos)=>{
    res.send({todos});
  }, (error)=>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id',authenticate,(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){ //check if id is correct
    return res.status(404).send()
  }
  Todo.findOne({
    _id:id,
    _creator : req.user._id
  }).then((todo)=>{
    if(todo){ //if todo exists
      res.send({todo});
    }else{
      res.status(404).send();
    }
  }).catch((e)=>{ //if error appears
    res.status(400).send();
  })
});

app.delete('/todos/:id',authenticate,(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){ //check if id is correct
    return res.status(404).send()
  }
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(todo)
      return res.send({todo});
    res.status(404).send();
  }).catch((e)=> res.status(400).send());
});

app.patch('/todos/:id',(req,res)=>{
  var id = req.params.id;
  //pick only the required props into the body
  var body = _.pick(req.body,['text','completed']);
  if(!ObjectID.isValid(id)){ //check if id is correct
    return res.status(404).send()
  }
  //check whether completed is boolean and whether is true
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }
  //find the todo by id and update its contents with the body object
  //new: true returns the new updated todo
  Todo.findByIdAndUpdate(id, {
    $set: body
  },{
    new: true
  }).then((todo)=>{
    if(!todo)
      return res.status(404).send();
    res.send({todo});
  }).catch((error)=>{
    res.status(400).send();
  })
});


app.post('/users',(req,res)=>{
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);
  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

app.get('/users/me',authenticate,(req,res)=>{ //use the authenticate middleware to gather data if auth was successful
  res.send(req.user);
});

// post /users/login
app.post('/users/login',(req,res)=>{
  var body = _.pick(req.body,['email','password']);

  User.findByCredentials(body.email,body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth',token).send(user);
    });
  }).catch((e)=>{
    res.status(400).send();
  });
});

app.delete('/users/me/token',authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }).catch((e)=>{
    res.status(400).send();
  });
});



app.listen(port,()=>{
  console.log('Listening on port', port);
})

module.exports = {app};
