const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User}  = require('./../server/models/user')

// Todo.remove({}).then((result)=>{
//   console.log(result);
// });

// Todo.findOneAndRemove()

// Todo.findByIdAndRemove()

Todo.findOneAndRemove({
  id: '5950202d856a8f71c4e68bdb'
}).then((doc)=>{
  console.log(doc);
})

Todo.findByIdAndRemove('5950202d856a8f71c4e68bdb').then((doc)=>{
  console.log(doc);
})
