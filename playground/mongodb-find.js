// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //the same as above



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to MongoDB Server');
  }
  console.log('Connected to MongoDB Server');

  // db.collection('Todos').find({
  //   _id: new ObjectID('594e3c0ffa4db44361698847')
  // }).toArray().then((docs)=>{
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs,undefined,2));
  // },(err)=>{
  //   console.log('Unable to fetch todos',err);
  // });
  // db.collection('Todos').find().count().then((count)=>{
  //   console.log(`Todos count: ${count}`)
  // },(err)=>{
  //   console.log('Unable to fetch todos',err);
  // });
  db.collection('Users').find({name:'Juan'}).toArray().then((docs)=>{
    console.log('Users')
    console.log(JSON.stringify(docs,undefined,1));
  },(err)=>{
    console.log('Error',err);
  });
  
  // db.close();
});
