const AWS = require('aws-sdk');

AWS.config.update({
    region : "us-west-2"
});

const docClient = new AWS.DynamoDB.DocumentClient();

function submitTicket(username, amount, desc, status = 'pending'){
   const params = { 
    TableName: "tickets",
    Item : {
        username,
        //timestamp,
        amount,
        desc,
        status
    }

}
return docClient.put(params).promise();
}

function retrieveAllTickets(){
    const params = {
        TableName : "tickets"

    }
    return docClient.scan(params).promise();
}

function retrieveTicketsByUsername(username){
    const params = {
        TableName : "tickets",
        Key : {
            username
        }
    }
    return docClient.get(params).promise();
}

function retrieveTicketsByStatus(status){
    const params = {
        TableName : "tickets",
        IndexName : "status-index",
        KeyConditionExpression : "#s = :value",
        ExpressionAttributeNames : {
            "#s" : "status"

        },
        ExpressionAttributeValues : {
            ":value" : status
        }
    }
    return docClient.query(params).promise();

}

function updateTicketsByUsername(username, newStatus){
    const params = {
        TableName : "tickets",
        Key : {
            username
        },
        UpdateExpression : "set #n = :value",
        ExpressionAttributeNames : {
            "#n" : "status"
        },
        ExpressionAttributeValues : {
            ":value" : newStatus
        }
    }
    return docClient.update(params).promise();
}

module.exports = {
    submitTicket,
    retrieveAllTickets,
    retrieveTicketsByStatus,
    updateTicketsByUsername,
    retrieveTicketsByUsername
}