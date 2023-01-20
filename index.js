//Import retrieve function from DAO
// bodyParser middleware for accessing JSON request body
const {retrieveUserByUsername, addNewUser} = require('./DAO/users-dao');
const express = require('express');
const bodyParser = require('body-parser');
const {createJWT, verifyTokenAndReturnPayload} = require('./jwt')

// Creating server
const PORT = 8080;

const app = express();

app.use(bodyParser.json());

app.post('/login', async(req, res) => {
    const username = req.body.username
    const password = req.body.password

    const data = await retrieveUserByUsername(username);
    const userItem = data.Item;

    if(userItem){
        if(userItem.password == password){

            res.send({
                "message" : `Welcome back ${username}`
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

app.post('/register', async(req, res) => {
    const username =req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const role = req.body.role;
try{
    let data = await addNewUser(username, password, email, role);
    if(data){
        if (err && err.code === "ConditionalCheckFailedException"){
        console.log("User Already exists");
     
        }else{ 
            res.send({
        "message" : "Welcome New user"
    })
    }
    }
}  
    
catch(err) {
    res.statusCode = 500
    res.send({
        "message" : err
    })
}
    
    //const userItem = data.Items;
    // if(username){
    //     if(userItem.username != username){
           
    //         res.statusCode = 200
    //     } else {
    //     res.statusCode = 400;
    //     res.send({
    //         "message" : `${username} already exists`
    //     })
    // }

    // } else {
    //     res.send({
    //         "message" : "Please enter valid credentials"
    //     })
    // }
       
        
})















app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
});
