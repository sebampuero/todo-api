const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var port = process.env.PORT || 3000;


app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  var todo  = new Todo({
    text : req.body.text
  });
  todo.save().then((todo)=>{
    res.send({todo});
  },(error)=>{
    res.status(400).send(error);
  });
});

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  }, (error)=>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id',(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){ //check if id is correct
    return res.status(404).send()
  }
  Todo.findById(id).then((todo)=>{
    if(todo){ //if todo exists
      res.send({todo});
    }else{
      res.status(404).send();
    }
  }).catch((e)=>{ //if error appears
    res.status(400).send();
  })
});

app.delete('/todos/:id',(req,res)=>{
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



app.listen(port,()=>{
  console.log('Listening on port', port);
})

module.exports = {app};
