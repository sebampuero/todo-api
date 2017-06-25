const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


const todos = [{
  _id : new ObjectID(),
  text : 'first test todo'
},
{
  _id : new ObjectID(),
  text : 'second test todo'
}]

beforeEach((done)=>{ //wipe db out before every test
  //nefore each gets executed before every test
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=> done());
});

describe('POST /todos', ()=>{
  it('should create a new todo',(done)=>{
    var text = 'Test todo';

    request(app).
      post('/todos').
      send({text}).
      expect(200).
      expect((res)=>{//expect the result to be the text created
        //the server sends back the just created object
        expect(res.body.text).toBe(text);
      }).
      end((err,res)=>{
        if(err){
          return done(err);
        }

        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=> done(e));
      })
  });

  it('should not create new todo',(done)=>{
    var text = '';
    request(app).
      post('/todos').
      send({text}).
      expect(400).
      expect((res)=>{
        expect(res.body.text).toNotBe(text);
      }).
      end((err,res)=>{
        if(err){
          return done(err);
        }

        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=>{
          done(e);
        })
      })
  })
});

describe('GET /todos route',()=>{
  it('should get all todos',(done)=>{
    request(app).
      get('/todos').
      expect(200).
      expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      }).
      end(done);
  });
});

describe('GET/todos/:id',()=>{
  it('should return todo doc',(done)=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(todos[0].text)
      }).
      end(done);
  });

  it('should return a 404 if todo not found',(done)=>{
    var hexId = new ObjectID().toHexString();
    request(app).
      get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if invalid id',(done)=>{
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});
