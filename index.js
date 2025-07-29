const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const Exercise = require('./models/Exercise');
const { ObjectId } = require('mongodb');

mongoose.connect(process.env.MONGO_URI);

app.use(bodyParser.urlencoded({extended: false}));
app.use(cors())
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  try {
    const result = await createNewUser(req.body.username);
    res.send(result);
  } catch (error) {
    res.send({error: error.message})
  }
}).get('/api/users', async (req, res) => {
  const users = await getAllUsers();
  res.send(users);
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    const result = await createNewExercise(req.body[":_id"], req.body.description, req.body.duration, req.body.date);
    res.send({
      _id: result.user_id,
      username: result.username,
      date: result.date.toDateString(),
      duration: result.duration,
      description: result.description
    });

  } catch (error) {
    res.send({error: error.message});
  }
});

app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    const user = await getUserById(req.params._id);
    if (!user) throw new Error("User not found");

    const exercises = await getAllExercises(req.params._id);
    const exercisesTruncated = exercises.map((exercise) => {
      return {
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
      }
    });
    res.send({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log: exercisesTruncated
    });
  } catch (error) {
    res.send({error: error.message});
  }
});

async function createNewUser(username) {
  const newUser = new User({
    username
  });
  return newUser.save();
}

function getAllUsers() {
  return User.find();
}

async function createNewExercise(id, description, duration, date) {
  const user = await getUserById(id);
  const username = user.username;

  if (!date) date = new Date();
  else date = new Date(date);

  const newExercise = new Exercise({
    user_id: id,
    username,
    date,
    duration,
    description
  });
  return newExercise.save();
}

function getUserById(id) {
  return User.findById(id);
}

function getAllExercises(user_id) {
  return Exercise.find({user_id: ObjectId.createFromHexString(user_id)});
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
