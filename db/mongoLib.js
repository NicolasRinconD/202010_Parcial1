const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

const dbName = 'parcial';

const client = new MongoClient(url, {useUnifiedTopology : true});


const getDatabase = (callback) => {
    client.connect(function(err){
        if(err) throw err;
        console.log("Se conecto a la bd")
        const db = client.db(dbName);

        callback(db, client);
    });
}

const insertUsuario = (db, callback, message) =>{
    const collection = db.collection('messages');
    
}