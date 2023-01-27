const express = require('express');
const {createJWT, verifyTokenAndReturnPayload} = require('../jwt');
const router = express.Router();
const {submitTicket, retrieveAllTickets, 
        retrieveTicketsByStatus, retrieveTicketsById, updateTicketsById,
         retrieveTicketsByUsername} = require('../DAO/tickets-dao')
const uuid = require('uuid')

const timestamp = require('unix-timestamp');
timestamp.round = true

// Endpint for Submit Tickets Feature

router.post('/tickets', async(req, res) => {

    try{
        const token = req.headers.authorization.split(' ')[1];
        const payload = await verifyTokenAndReturnPayload(token);
       
        if(payload.role === 'employee'){
    
           try{
                await submitTicket(uuid.v4(), payload.username, timestamp.now(), req.body.amount, req.body.desc);
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
            res.statusCode = 401;
            res.send({
                 "message" : "You're not a regular employee"
            })
        }
        
    }

    catch(err){
        res.statusCode = 400;
        res.send({
            "message" : "Invalid JWT"
        })

    } 


})

// Endpoint for Allowing employees to retrieve previous tickets

router.get('/tickets', async(req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    
   try{
    const payload = await verifyTokenAndReturnPayload(token);
    if(payload.role === 'employee')
    if(req.query.status){
        let data = await retrieveTicketsByStatus(req.query.status);
            res.send(data.Items);
    } else {
       
        let data = await retrieveTicketsByUsername(payload.username);
        res.send(data.Items);

    }else{
        if(req.query.status){
            let data = await retrieveTicketsByStatus(req.query.status);
            res.send(data.Items);
        
         } else{
             let data = await retrieveAllTickets();
            res.send(data.Items);
        }
        
    }

   }
   
   catch(err){
    res.statusCode = 500;
    res.send({
        "message" : err
    })
   }
})

// Endpoint for Allowing managers to retrieve previous tickets by status

// app.get('/ticketsbystatus', async(req, res) => {
//     const token = req.headers.authorization.split(' ')[1];
    
//    try{
//     const payload = await verifyTokenAndReturnPayload(token);
//     if(payload.role === 'admin'){
//         if(req.query.status === 'pending'){
//         let data = await retrieveTicketsByStatus(req.query.status);
//         res.send(data.Items);

//     }else{
//         let data = await retrieveAllTickets();
//         res.send(data.Items);
//     }
// }else {
//     res.send({
//         "message" : "You're not an Admin"
//     })

//     }


//    }
//    catch(err){
//     res.statusCode = 500;
//     res.send({
//         "message" : err
//     })
//    }
// })

// app.get('/ticketsbyid/:ticket_id', async(req, res) => {
//     try{
//         let data = await retrieveTicketsById(req.params.ticket_id);
//         if(data.Item){
//             res.send(data.Item)
//         } else {
//             res.statusCode = 404
//             res.send({
//                 "message" : "Ticket doesn't exist"
//             });
//         }
       
//     } catch(err){
//         res.statusCode = 500
//         res.send()
//     }
   
// })

// Endpoint for approving/denying reimbursement tickets

router.patch('/tickets/:ticket_id/status', async(req, res) => {
    

 try{
    const token = req.headers.authorization.split(' ')[1];
    const payload = await verifyTokenAndReturnPayload(token);
    let data =  await retrieveTicketsById(req.params.ticket_id);
    let userItem = data.Item
    if(payload.role === 'admin')
    if(userItem)
    if(userItem.ticket_id && userItem.status === 'pending'){
    
        await updateTicketsById(req.params.ticket_id, req.body.status);
        res.statusCode = 200
        res.send({
            "message" : "Ticket Status Updated"
        })
        
    } else{
        res.statusCode = 400;
        res.send({
            "message" : "Ticket status already updated"
        })
       
    } else {
        res.statusCode = 400;
        res.send({
            "message" : `Ticket ${req.params.ticket_id} doesn't exist`
        })
    } else {
        res.statusCode = 400;
        res.send({
           
            "message" : "You're not an Admin!"
        })
    }
}
 
 catch(err){
    res.statusCode = 500
    res.send({
        "message" : err
    })
 }
})

module.exports = router;
   

