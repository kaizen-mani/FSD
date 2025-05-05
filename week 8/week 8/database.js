const { MongoClient } = require('mongodb');//import mongodb module
const url = 'mongodb://127.0.0.1:27017'; 
const client = new MongoClient(url);
let collection;

async function connectDB(dbname, table) {
    let result = await client.connect();//connect to the server
    let db = result.db(dbname);//selects the database(dbname)
    collection = db.collection(table);//selects the collection(table)
    console.log("Database Connected...");//display message
    return collection;
}
//Retreive user data
exports.getData = async function (email) {
    collection = await connectDB("usersDB", "users");//connect usersDB(database) and users(collection)
    let response = await collection.find({ email: email }).toArray();//searches user by email
    return JSON.stringify(response);//array format to string format conversionand return as response
};
//Insert user data
exports.insertData = async function (user) {
    collection = await connectDB("usersDB", "users");
    let response = await collection.insertOne({ name: user.name, email: user.email, password: user.password });
    return JSON.stringify(response);
}