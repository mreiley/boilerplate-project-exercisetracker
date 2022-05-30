const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()


const MONGO_URI = 'mongodb+srv://sdkmarior:A123456789_05@cluster0.et10y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

/*
		"url": "https://github.com/freeCodeCamp/boilerplate-project-exercisetracker"
*/

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// _id sera creado por defecto y sera el campo de enlace.
const userSchema = new mongoose.Schema({
   username: String, //"fcc_test",
  _id: mongoose.SchemaTypes.ObjectId //"5fb5853f734231456ccb3b05"
});

const exerciseSchema = new mongoose.Schema({
  username: String, // "fcc_test",
  description: String, //"test",
  duration: Number, //60,
  date: Date,
  _id: mongoose.SchemaTypes.ObjectId,
  _idUser : mongoose.SchemaTypes.ObjectId
});

let User = mongoose.model("User", userSchema);
let Exercise = mongoose.model("Excercise",exerciseSchema);


/*
You can POST to /api/users with form data username to create a new user.

The returned response from POST /api/users with form data username will be an object with username and _id properties.
*/
//Debe retornar:
//{"username":"mario.reiley","_id":"6294a66e8413530938cc3ee3"}
app.post('/api/users',(req,res)=>{
  
}); // post('/api/users'

/*
You can make a GET request to /api/users to get a list of all users.

The GET request to /api/users returns an array.

Each element in the array returned from GET /api/users is an object literal containing a user's username and _id.
*/
app.get('/api/users',(req,res)=>{
  
}); // get('/api/users'


/*
You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.

The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.
*/

// debe retornat:
//  //{"_id":"6294a5f48413530938cc3ede","username":"mario.reiley","date":"Mon May 30 2022","duration":2,"description":"ssss"}
app.post('/api/users/:_id/exercises',(req,res)=>{

}) //app.post :_id/exercises


/*
You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.

A request to a user's log GET /api/users/:_id/logs returns a user object with a count property representing the number of exercises that belong to that user.

A GET request to /api/users/:id/logs will return the user object with a log array of all the exercises added.

Each item in the log array that is returned from GET /api/users/:id/logs is an object that should have a description, duration, and date properties.

The description property of any object in the log array that is returned from GET /api/users/:id/logs should be a string.

The duration property of any object in the log array that is returned from GET /api/users/:id/logs should be a number.

The date property of any object in the log array that is returned from GET /api/users/:id/logs should be a string.. Use the dateString format of the Date API.

You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
*/

/*
GET user's exercise log: GET /api/users/:_id/logs?[from][&to][&limit]

[ ] = optional

from, to = dates (yyyy-mm-dd); limit = number
*/
app.get('/api/users/:_id/logs',(req,res)=>{
  
}); ///api/users/:_id/logs


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
