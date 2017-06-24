// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //the same as above



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to MongoDB Server');
  }
  console.log('Connected to MongoDB Server');

// db.collection('Todos').findOneAndUpdate({
//   _id : new ObjectID('594ee1af849e7b3214912e64')
// },{
//   $set: { //update mongo operator
//     completed: true
//   }
// },{
//   returnOriginal : false
// }).then((result)=>{
//   console.log(result);
// });

  db.collection('Users').findOneAndUpdate({
    _id : new ObjectID('594ee1911d3a812cfc09ec08')
  },{
    $set:{
      name : 'Sebastian'
    },
    $inc:{
      age : 6
    }
  },{
    returnOriginal : false
  }).then((result)=>{
    console.log(result);
  })

  // db.close();
});
