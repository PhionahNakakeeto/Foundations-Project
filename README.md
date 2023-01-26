## ERS (EMPLOYEE REIMBURSEMENT SYSTEM) Documentation

## Database
I created 2 tables in DynamoBD i.e., users & tickets.
The partition key for the users table is username.
The partition key for the tickets table is tickets_id and I also created 2 GSIs i.e., username-index and status-index.
The tickets table uses the UUID (Universally Unique Identifier) to auto-generate ticket_ids.

To start the application, simply run npm install to install all necessary node packages, and then node index.js to start the server. The server is configured to run on PORT 8080.

## Endpoints
## Login Endpoint
Request

HTTP Method - POST
URL - /login
Headers - Content-Type: application/json
Body
{
    "username" : "user145",
    "password" : "password145"

}

## Response Scenarios

## Valid username and password provided in request body
Status Code - 200 OK
Body
{
    "message": "Welcome back user145",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxNDUiLCJyb2xlIjoiZW1wbG95ZWUiLCJpYXQiOjE2NzQ2ODY4MzEsImV4cCI6MTY3NDc3MzIzMX0.cGR21XtbSjQ2fq_QNYNNDOhz3WY4Zlfnrwg3F8BAybA"
}
Headers - Content-Type: application/json

## Invalid username
Status Code - 400 Bad Request
Body
{
    "message":  "message" : `User with username ${username} does not exist`
}
Headers - Content-Type: application/json

## Invalid password, valid username
Status Code - 400 Bad Request
Body
{
    "message": "Invalid password!"
}
Headers - Content-Type: application/json

## Register Endpoint
Request

HTTP Method - POST
URL - /register
Headers - Content-Type: application/json
Body
{
     "username" : "user145",
    "password" : "password145",
    "email" : "user145@gmail.com"
}

## Response Scenarios

## Successful registration
Status Code - 200 OK
Body
{
    "message": "Welcome New user"
}
Headers - Content-Type: application/json

## Unsuccessful registration because username is already taken
Status Code - 400 Bad Request
Body
{
    "message": "User already exists"
}
Headers - Content-Type: application/json


## Submit Ticket Endpoint
Request

HTTP Method - POST
URL - /submitticket
Body
{
   
    "amount" : 150,
    "desc" : "Dinner"
}
Headers
Authorization: Bearer "token"
We need to include the JWT as part of the Authorization header so that we can authorize access to add a reimbursement ticket
Content-Type: application/json

## Response Scenarios

## Successfully added reimbursement ticket
Status Code - 200 OK
Body
{
    "message": "Successfully submitted Ticket"
}
Headers - Content-Type: application/json

## Token where role does not equal employee
Status Code - 401 Unauthorized
Body
{
    "message": "You're not a regular employee"
}
Headers - Content-Type: application/json

## Authorization header is not provided
Status Code - 400 Bad Request
Body
{
    "message": "Invalid JWT"
}
Headers - Content-Type: application/json

## JWT is invalid
Status Code - 400 Bad Request
Body
{
    "message": "Invalid JWT"
}
Headers - Content-Type: application/json

## View Previous Tickets Endpoint
Request

HTTP Method - GET
URL - /tickets
Body
{}
Headers
Authorization: Bearer "token"
We need to include the JWT as part of the Authorization header so that we can authorize access to a regular employee to view a past reimbursement ticket and for admins to view pending tickets
Content-Type: application/json

## Response Scenarios

## Successfully retrieved reimbursement ticket(s)
Status Code - 200 Ok
Body
{
   {
        "ticket_id": "67bf86e1-b1bf-47f7-bc31-2d7e127f030c",
        "timestamp": 1674601976,
        "status": "approved",
        "amount": 150,
        "username": "user145",
        "desc": "Dinner"
    }
}
Headers - Content-Type: application/json

## Successfully retrieved employee's reimbursement ticket(s) where status query = 'denied'/'approved'/'pending'
Status Code - 200 Ok
Body
{
        "ticket_id": "1cfc3247-7bce-4ffe-a02f-35d46e1c03fe",
        "status": "denied",
        "timestamp": 1674703885,
        "amount": 150,
        "username": "user145",
        "desc": "Dinner"
    }
Headers - Content-Type: application/json

## Token where role equals admin with a query of status = 'pending'
Status Code - 200 Ok
Body
{
  
        "ticket_id": "1cfc3247-7bce-4ffe-a02f-35d46e1c03fe",
        "status": "pending",
        "timestamp": 1674703885,
        "amount": 150,
        "username": "user145",
        "desc": "Dinner"

}
Headers - Content-Type: application/json

## Token where role equals admin without a query
Status Code - 200 Ok
Body
{
        "ticket_id": "67bf86e1-b1bf-47f7-bc31-2d7e127f030c",
        "status": "approved",
        "timestamp": 1674601976,
        "amount": 150,
        "username": "user145",
        "desc": "Dinner"
    },
    {
        "ticket_id": "T001",
        "status": "approved",
        "timestamp": 1674512181,
        "amount": 100,
        "username": "user123",
        "desc": "Mileage Reimbursement"
    },
    {
        "ticket_id": "b12a26a7-4098-420c-97e2-aede1010cb4f",
        "status": "approved",
        "timestamp": 1674686891,
        "amount": 150,
        "username": "user145",
        "desc": "Dinner"
    },
    {
        "ticket_id": "1cfc3247-7bce-4ffe-a02f-35d46e1c03fe",
        "timestamp": 1674703885,
        "status": "pending",
        "amount": 150,
        "username": "user145",
        "desc": "Dinner"
    },
    {
        "ticket_id": "T123",
        "status": "approved",
        "timestamp": 1674499452,
        "amount": 500,
        "username": "user123",
        "desc": "Relocation assistance"
    }
Headers - Content-Type: application/json


## Approve/Deny Tickets Endpoint
Request

HTTP Method - PATCH
URL - /ticketsbyid/:ticket_id/status
Body
{
    "status" : "approved" or "status" : "denied"
}
Headers
Authorization: Bearer "token"
We need to include the JWT as part of the Authorization header so that we can authorize access only to admins to either approve/deny  tickets
Content-Type: application/json

## Response Scenarios

## Successfully updated ticket status

Status Code - 200 OK
Body
{
    "message" : "Ticket Status Updated"
}

Content-Type: application/json

## If ticket status is already updated as approved/denied

Status Code - 400 Bad Request
Body
{
    "message" : "Ticket status already updated"
}

Content-Type: application/json

## If tickect id is invalid

Status Code - 400 Bad Request
Body
{
   "message" :  "Ticket 67bf86e1-b1bf-47f7-bc31-2d7e127f030 doesn't exist"
}

Content-Type: application/json

## If role is not equal to Admin

Status Code - 400 Bad Request
Body
{
    "message": "You're not an Admin!"
}
Content-Type: application/json
