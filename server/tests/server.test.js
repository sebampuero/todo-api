const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
//check seed.js
beforeEach(populateTodos);


describe('POST /todos', ()=>{
  it('should create a new todo',(done)=>{
    var text = 'Test todo';

    request(app).
      post('/todos').
      send({
        text:text
      }).
      expect(200).
      expect((res)=>{//expect the result to be the text created
        //the server sends back the just created object
        expect(res.body.todo.text).toBe(text);
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
        expect(res.body.todo.text).toBe(todos[0].text)
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

describe('DELETE /todos/:id',()=>{
  it('should delete a todo',(done)=>{
    request(app)
      .delete(`/todos/${todos[1]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[1].text)
      })
      .end((err,res)=>{
        if(err)
          done(err);

        Todo.find(todos[1].text).then((results)=>{
          expect(results.length).toBe(1);
          expect(todos[1].text).toNotInclude(results);
          done();
        }).catch((error)=> done(error));
      })
  });

  it('should return 404 if todo not found',(done)=>{
    request(app)
      .delete(`/todos/${new ObjectID()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if id not valid',(done)=>{
    request(app)
      .delete('/todos/4234')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id',()=>{
  it('should update the todo',(done)=>{
    var todo = {
      text: 'Updating test',
      completed: true
    }
    request(app)
      .patch(`/todos/${todos[0]._id}`)
      .send(todo)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toNotBe(todos[0].text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      }).end(done);
  });
  it('should clear completedAt when todo is not completed',(done)=>{
      var todo = {
        text : 'Second update',
        completed: false
      }
      request(app)
        .patch(`/todos/${todos[1]._id}`)
        .send(todo)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo.text).toNotBe(todos[1].text);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toNotExist();
        }).end(done);
  });
});

describe('GET /users/me',()=>{
  it('should return user if auth',(done)=>{
    request(app)
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token) //set a header
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      }).
      end(done);
  });
  it('should return a 401 when no auth',(done)=>{
    request(app)
      .get('/users/me')
      .set('x-auth','notrials')
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({});
      }).
      end(done);
  });
});

describe('POST /users',()=>{
  it('should create a user',(done)=>{
    var email = 'example@esd.com';
    var password = 'cacacaca';
    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      }).
      end((err)=>{
        if(err){
          return done(err);
        }
        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        })
      });
  });
  it('should return validation errors if req invalid',(done)=>{
    var email = 'caca';
    var password = 'wrwerwer';
    request(app).
      post('/users').
      send({email,password}).
      expect(400).
      end(done);
  });
  it('should not create user if email in use',(done)=>{
    var password = 'sexoduro';
    request(app).
      post('/users').
      send({email: users[0].email,password}).
      expect(400).
      end(done);
  });
});
