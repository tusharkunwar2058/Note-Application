const mongoose = require('mongoose')

// if we do not provide the password in the arguments
if (process.argv.length < 3) {
    console.log("password must be passed as the arguments");
    process.exit(1)
}

// the arguments is set as a password
const password = process.argv[2]

// the connection string from the mongodb
const url = `mongodb://ashKetchum:${password}@ac-o0lc3eu-shard-00-00.ap8cwvb.mongodb.net:27017,ac-o0lc3eu-shard-00-01.ap8cwvb.mongodb.net:27017,ac-o0lc3eu-shard-00-02.ap8cwvb.mongodb.net:27017/noteApp?ssl=true&replicaSet=atlas-e8w5ns-shard-0&authSource=admin&appName=Cluster0`

// making the query to be not strict
mongoose.set('strictQuery', false)

// setting the connection to the database, since mongodb can only be able to use ipv4, so it's family: 4
mongoose.connect(url, {family: 4})

// defining the schema to be save in the collection
const noteSchema = new mongoose.Schema({
    content : String,
    important: Boolean
})

// setting the model, and it takes 2 arguments the first one is varibale,
//  to name the db (it makes anything you give variable as lowercase and make it plural,
//  if you give Note, it will makes it notes), the second one is schema defined before
const Note = mongoose.model('Note', noteSchema)

// defining the data that should be going to the db
// const note = new Note({
//     content: "There is one truth",
//     important: true
// })

// saving that data to the db
// note.save().then(result => {
//     console.log(result);
//     console.log('note saved');
//     mongoose.connection.close()
// }) 

// retrieving data from the database
Note.find({important: false}).then(result => {
    result.forEach(note => {
        console.log(note);
    })
    mongoose.connection.close()
})