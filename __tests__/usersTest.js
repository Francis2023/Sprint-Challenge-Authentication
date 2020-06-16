const db = require('../database/dbConfig.js');
const Users = require('../auth/auth-model.js');
const request = require('supertest');
const userRout = require('../auth/auth-router.js');

describe('users model', () => {
    describe('add()', () => {
       it('should insert the provided user into the DB', async () => {
           await Users.add({ username: 'Don_D', password: 'Don'});
           
           const users = await db('users');
           expect(users).toHaveLength(1);
       });

       it('should return what was inserted', async () => {
           let user = await Users.add({ username: 'Don_D', password: 'Don'});
           expect(user.username).toBe('Don_D');
       });  
       
       beforeEach(async () => {
           await db('users').truncate();
       })
    });
});

describe('POST /login', () => {
    it('responds with json', () => {
        request(userRout)
          .post('/login')
          .send({name: 'Don_D'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end( (err,res) => {
             if (err) return done(err);
             done();
          });
    });
});