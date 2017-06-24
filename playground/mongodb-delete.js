// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //the same as above



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to MongoDB Server');
  }
  console.log('Connected to MongoDB Server');

  //delete many
  // db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result)=>{
  //   console.log(result);
  // });
  //delete one
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=>{
  //   console.log(result);
  // });
  //find one and delete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
  //   console.log(result);
  // });

  /*
  USERS
  */
  // db.collection('Users').deleteMany({name:'Juan'}).then((result)=>{
  //   console.log(result);
  // });
  // 
  // db.collection('Users').findOneAndDelete({
  //   _id :new ObjectID('594da72760e6cb2a4c88c7c2')
  // }).then((result)=>{
  //   console.log(result);
  // });


  // db.close();
});
