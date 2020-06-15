const db = require('../database/dbConfig.js');
const Users = require('../auth/auth-model.js');

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