const AWS = require('aws-sdk');

AWS.config.update({
    region : "us-west-2"
});

const docClient = new AWS.DynamoDB.DocumentClient();

function retrieveUserByUsername(username){
    const params = {
        TableName : "users",
        Key : {
            username
        }
    }
    return docClient.get(params).promise();
}

function addNewUser(username, password, email){
    const params = {
        TableName : "users",
        Item : {
         username,
         password,
         email,
         role : "employee"
        },
       
    }

    
    return docClient.put(params).promise();
    

}

module.exports = {
    retrieveUserByUsername,
    addNewUser
}