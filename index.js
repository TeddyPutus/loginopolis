const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt');
const {body, checkBody, param, validationResult} = require('express-validator');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

//Number of salt rounds (the higher the number of rounds, the greater the computational cost)
const SALT_ROUNDS = 10;

// POST /register
// Takes req.body of {username, password} and creates a new user with the hashed password
app.post('/register',  
  //Validator functions to check if username field in body is empty, or password too short
  body('username').not().isEmpty().withMessage('username field is empty'),
  body('password').isLength({ min: 6 }).withMessage('password field must be at least 6 characters'),
  
  async (req, res, next) => {
    
    //Handling errors if validation didnt pass 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);  
    //If no errors, create new user
    } else{
      try {
        //hash the password for storage in the database, then create the user
        const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        const newUser = await User.create({
            username : req.body.username,
            password: hashedPassword
        })
        return res.send(`successfully created user ${req.body.username}`);
      } catch (error) {
        return res.send(error);
      }
    }
  })

// // POST /login
// // Takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post('/login',  
  //Validator functions to check if username field in body is empty, or password too short
  body('username').not().isEmpty().withMessage('username field is Empty'),
  body('password').isLength({ min: 6 }).withMessage('password field must be at least 6 characters'),
  
  async (req, res, next) => {
    
    //Handling errors if validation didnt pass 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);  
    //If no errors, create new post
    } else{
      try { 
        //find the user by username
        const newUser = await User.findOne({ where:
          {username : req.body.username}
       })
       if(newUser){ 
          //if the user is found, then compare the given password to the hashed password in the database
          const isMatch = await bcrypt.compare(req.body.password, newUser.password);
          if(isMatch){ 
            //if it's a password match, login was successful
            return res.send(`successfully logged in user ${newUser.username}`);
          }else{ 
            //otherwise passworde is incorrect
            return res.status(401).send('incorrect username or password');
          }
       }else{ 
        //if no username found, username is incorrect
        return res.status(401).send('incorrect username or password');
       }       
      } catch (error) {
        return res.send(400);
      }       
    }
  })

// GET "/me" - authenticate the user, then return associated data!

// we export the app, not listening in here, so that we can run tests
module.exports = app;
