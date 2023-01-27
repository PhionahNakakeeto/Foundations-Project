const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

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
