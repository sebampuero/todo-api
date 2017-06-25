const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done)=>{ //wipe db out before every test
  //nefore each gets executed before every test
  Todo.remove({}).then(()=>{
    done();
  })
})

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

        Todo.find().then((todos)=>{
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
          expect(todos.length).toBe(0);
          done();
        }).catch((e)=>{
          done(e);
        })
      })
  })
});
