const express = require('express');
const router = express.Router();
const {createJWT} = require('../jwt');
const {retrieveUserByUsername, addNewUser} = require('../DAO/users-dao');

// Endpoint for Login Feature
router.post('/login', async(req, res) => {
    const username = req.body.username
    const password = req.body.password

    const data = await retrieveUserByUsername(username);
    const userItem = data.Item;

    if(userItem){
        if(userItem.password === password){
            const token = createJWT(userItem.username, userItem.role);

            res.send({
                "message" : `Welcome back ${username}`,
                "token" : token
            })
         } else {
            
            res.statusCode = 400;
            res.send({
                "message" : "Invalid Password"
            })

            }
        }
        else{
            res.statusCode  = 400;
            res.send({
                "message" : `User with username ${username} does not exist`
            })
        }
})

// Endpoint for Register Feature

router.post('/register', async(req, res) => {
    
try{
    const username =req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const data = await retrieveUserByUsername(username);
    const userItem = data.Item;
    if(req.body.username !== " " && req.body.password !== " ")
    if(userItem){
        res.statusCode = 400;
        res.send({
            "message" : "User already exists"
        })
    } else {
       await addNewUser(username, password, email);
      
       res.send({
        message : "Welcome New user"})
       }
       else{
        res.statusCode = 400
        res.send({
            "message" : "Please enter Username/Password!"
        })
       }

    } catch(err) { 
        res.statusCode = 500;
        res.send({
            "message" : err
        })
}
  
    });

    // Endpoint for employees who are not Admins

router.get('/employees', async (req, res) => {
        const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>']
        try {
            const payload = await verifyTokenAndReturnPayload(token);
            if (payload.role === 'employee') {
                res.send({
                    "message": `Welcome, employee ${payload.username}!`
                })
            } else {
                res.statusCode = 401;
                res.send({
                    "message": `You aren't a regular employee. You are a ${payload.role}`
                })
            }
        } catch(err) { // token verification failure
            res.statusCode = 401;
            res.send({
                "message": "Token verification failure"
            })
        }
    });
   
// Endpoint for Admin users
router.get('/admin', async(req, res) => {
        const token = req.headers.authorization.split(' ')[1];

     try{

        const payload = await verifyTokenAndReturnPayload(token)

        if(payload.role === 'admin'){
            res.send({
                "message" : `Welcome ${payload.username}`
            })
        } else {
            res.statusCode = 401;
            res.send({
                "message" : `You're not an Admin, You're a ${payload.role}`
            })
        }

     }
     catch(err){
        res.statusCode = 401
        res.send({
            "message" : "Token verification Failure"
        })

     }


    })

module.exports = router;


