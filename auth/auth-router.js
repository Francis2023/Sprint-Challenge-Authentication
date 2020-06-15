const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("./secrets.js");

const Users = require("./auth-model.js");
const {isValid} = require("./auth-service.js");

router.post('/register', (req, res) => {
  // implement registration
   const credentials = req.body;

   if (isValid(credentials)) {
     const rounds = process.env.BCRYPT_ROUNDS || 10;

     const hash = bcrypt.hashSync(credentials.password, rounds);

     credentials.password = hash;

     Users.add(credentials)
      .then(user => {
        res.status(201).json({ data: user})
      })
      .catch(error => {
        res.status(500).json({message: error.message});
      });
   } else {
     res.status(400).json({
       message: "Please provide username and password, password should be alphanumeric",
     })
   }
});

router.post('/login', (req, res) => {
  // implement login
  let {username, password} = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username })
     .first()
     .then(user => {
       if(user && bcrypt.compareSync(password, user.password)) {
         const token = generateToken(user);
         res.status(200).json({ message: `welcome ${user.username}`,token})
       } else {
         res.status(401).json({ message: " Invalid credentials"});
       }
    })
    .catch(error => {
      res.status(500).json({ message: 'login failed' });
    });
  } else {
     res.status(400).json({
       message: "Please provide username and password, password should be alphanumeric",
     });
  }
});

function generateToken(user){
  const payload = {
    subject: user.id,
    username: user.username,

  };
  const option ={
    expiresIn: "2h"
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}


module.exports = router;
