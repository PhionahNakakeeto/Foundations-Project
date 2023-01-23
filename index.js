//Import retrieve function from DAO
// bodyParser middleware for accessing JSON request body
const {retrieveUserByUsername, addNewUser} = require('./DAO/users-dao');
const express = require('express');
const bodyParser = require('body-parser');
const {createJWT, verifyTokenAndReturnPayload} = require('./jwt')
const {submitTicket, retrieveAllTickets, 
    retrieveTicketsByStatus, updateTicketsByUsername,
     retrieveTicketsByUsername} = require('./DAO/tickets-dao');
const timestamp = require('unix-timestamp');
timestamp.round = true     

// Creating server
const PORT = 8080;

const app = express();

app.use(bodyParser.json());

// Endpoint for Login Feature
app.post('/login', async(req, res) => {
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

app.post('/register', async(req, res) => {
    
try{
    const username =req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const role = req.body.role;
    const data = await retrieveUserByUsername(username);
    const userItem = data.Item;
    if(userItem){
        res.send({
            "message" : "User already exists"
        })
    } else {
       await addNewUser(username, password, email, role);
       res.send({
        message : "Welcome New user"})
       }

    } catch(err) { 
        res.statusCode = 500;
        res.send({
            "message" : err
        })
}
  
    });

    // Endpoint for employees who are not Admins

app.get('/employees', async (req, res) => {
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
app.get('/admin', async(req, res) => {
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

// Endpint for Submit Tickets Feature

app.post('/submitticket', async(req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try{
        const payload = await verifyTokenAndReturnPayload(token);
        if(payload.role === 'employee'){
           try{
                await submitTicket(payload.username, req.body.amount, req.body.desc);
                res.send({
                    "message" : "Successfully submitted Ticket"
                })
            } catch(err){
                res.statusCode = 500; 
                res.send({
                    "message": err
                });
            }
              
        } else {
            res.send({
                "message" : "You're not a regular employee"
            })
        }
    }

    catch(err){
        res.statusCode = 401;
        res.send({
            "message" : err
        })
    }


})

// Endpoint for Retrieving all pending tickets

app.get('/tickets', async(req, res) => {

   try{
    if(req.query.status){
        let data = await retrieveTicketsByStatus(req.query.status);
        res.send(data.Items);
    } else{
        let data = await retrieveAllTickets();
        res.send(data.Items);
    }

   }
   catch(err){
    res.statusCode = 500;
    res.send({
        "message" : err
    })
   }
})

app.get('/tickets', async(req, res) => {
    try{
        let data = await retrieveTicketsByUsername(req.params.username);
        if(data.Item){
            res.send(data.Item)
        } else {
            res.statusCode = 404
            res.send();
        }
       
    } catch(err){
        res.statusCode = 500
        res.send()
    }
   
})

app.patch('/tickets/:username/status', async(req, res) => {

 try{
    let data =  await retrieveTicketsByUsername(req.params.username);

    if(data.Item){
        await updateTicketsByUsername(req.params.username, req.body.status);
        res.statusCode = 200
        res.send({
            "message" : "Ticket Approved"
        })
        
    } else{
        res.statusCode = 400;
        res.send({
            "message" : "Ticket doesn't exist"
        })
       
    }
 }
 catch(err){
    res.send({
        "message" : err
    })
 }
})
   


app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
});
