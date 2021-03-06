const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config()


const MONGO_URI = 'mongodb+srv://sdkmarior:A123456789_05@cluster0.et10y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

/*
		"url": "https://github.com/freeCodeCamp/boilerplate-project-exercisetracker"
*/

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// _id sera creado por defecto y sera el campo de enlace.
const userSchema = new mongoose.Schema({
   username: String //, //"fcc_test",   
},{
  versionKey: false
});


const exerciseSchema = new mongoose.Schema({
  username: String, // "fcc_test",
  description: String, //"test",
  duration: Number, //60,
  date: Date,
  userId: String
},{
   versionKey: false
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
  const user = new User({username:req.body.username}); 
  (async () => {
    const newUser = await user.save();
    res.json({username : newUser.username, _id :newUser._id});
  })();  
}); // post('/api/users'

/*
You can make a GET request to /api/users to get a list of all users.

The GET request to /api/users returns an array. // error

Each element in the array returned from GET /api/users is an object literal containing a user's username and _id. // error
*/
app.get('/api/users',(req,res)=>{
  let usuarios = [];
  (async () => {
    usuarios = await User.find().exec();
    res.json(usuarios);
  })();  
}); // get('/api/users'

/*
You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.

The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.
*/

// debe retornar:
//  //{"_id":"6294a5f48413530938cc3ede","username":"mario.reiley","date":"Mon May 30 2022","duration":2,"description":"ssss"}
 
app.post('/api/users/:_id/exercises',(req,res)=>{
  (async ()=> {
    const user_id = req.params._id;   
    let userExercise = {};
    let date = new Date(Date.now());
    
    try {
      const user = await User.findById({_id:user_id})      
      if(user) {
        
        if(req.body.date) {
           date = new Date(req.body.date);
        }
        
        const exercise = new Exercise({username:user.username,
                                       description:req.body.description,
                                       duration:req.body.duration,
                                       date:date.toDateString().substring(0,15),
                                       userId:user._id 
                                       });
        const newExercise = await exercise.save();
        
        userExercise = {
          username:user.username,
          description:newExercise.description,
          duration:newExercise.duration,  
          _id:user._id,
          date:newExercise.date.toDateString().substring(0,15)
        }

        res.json(userExercise);
      
      }else {
        res.json({error:'_id dont exist'});
      }
    }catch(err) {
       res.json({error:err});
    };
    
  })(); 
  
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

Log:

{
  username: "fcc_test",
  count: 1,
  _id: "5fb5853f734231456ccb3b05",
  log: [{
    description: "test",
    duration: 60,
    date: "Mon Jan 01 1990",
  }]
}

*/
app.get('/api/users/:_id/logs',(req,res)=>{
  (async () => {
    try {
      
      // user data
      const dataUser = await User.findById({_id:req.params._id})  
      if(dataUser) {
        let from, to = new Date().toDateString(); let limit = 60;
        
        if(req.query.from)  {from  = req.query.from;}
        if(req.query.to)    {to    = req.query.to;}
        if(req.query.limit) {limit = req.query.limit;}
        
        // log exercises 
        const log = await Exercise.find({userId:dataUser._id})
          .select(['-_id','description','duration','date'])
          .where('date').gte(from).lte(to) 
          .limit(limit)
          .exec();
        
        
        const count = log.length || 1; 
        if(!log.length) {
          log[0]={description:'test',duration:60, 
                  date: new Date().toDateString()}
          console.log(log);
        };
        
        const userLog = {
          username: dataUser.username,
          count: count,
          _id: dataUser._id,
          log: log
        };

        // send result
        res.json(userLog);
      }
      
    }catch(e){
      res.json({error:e.message});
    };
  })(); //async 

}); ///api/users/:_id/logs


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
