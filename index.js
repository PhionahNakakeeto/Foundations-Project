//Import retrieve function from DAO
// bodyParser middleware for accessing JSON request body
// const {retrieveUserByUsername, addNewUser} = require('./DAO/users-dao');

// const {createJWT, verifyTokenAndReturnPayload} = require('./jwt')
// const {submitTicket, retrieveAllTickets, 
//     retrieveTicketsByStatus, retrieveTicketsById, updateTicketsById,
//      retrieveTicketsByUsername} = require('./DAO/tickets-dao');

const express = require('express');
const bodyParser = require('body-parser');

const usersRouter = require('./Routes/users-routes');
const ticketsRouter = require('./Routes/tickets-routes');

    

// Creating server
const PORT = 8080;

const app = express();

app.use(bodyParser.json());
app.use(usersRouter);
app.use(ticketsRouter);


app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
});
