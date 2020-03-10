const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://dev123:dev123@cluster0-e9qc8.mongodb.net/test?retryWrites=true&w=majority';

const dbName = 'parcial';

const client = new MongoClient(url, {useUnifiedTopology : true});


const getDatabase = function(callback){
    client.connect(function(err){
        if(err) throw err;
        console.log("Se conecto a la bd")
        const db = client.db(dbName);

        callback(db, client);
    });
}

const insertOferta = function(db, message, callback){
    const collection = db.collection('ofertas');
    collection.insertMany([message], function (err, result) {
        console.log("Inserting oferta")
        callback(result);
    });
}

const findOfertas = function(db, callback){
    const collection = db.collection('ofertas');
    collection.find({}).toArray(function (err, docs) {
        console.log("Found the following ofertas");
        console.log(docs)
        callback(docs);
    });
}

const deleteOfertas = function(db, callback){
    const collection = db.collection('ofertas');
    collection.remove({});
    callback();
}

exports.getDatabase = getDatabase;
exports.insertOferta = insertOferta;
exports.findOfertas = findOfertas;
exports.deleteOfertas = deleteOfertas;