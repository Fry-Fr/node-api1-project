// BUILD YOUR SERVER HERE
const express = require('express');
const model = require('./users/model');

const server = express();
server.use(express.json())

// Gets an array of users.
server.get('/api/users', (req, res) => {
    model.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({message: "The users information could not be retrieved"})
    })
});

// Gets user by sending an id in params.
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    model.findById(id)
    .then(user => {
        user
        ? res.status(200).json(user)
        : res.status(404).json({message: `The user with the specified ID ${id} does not exist`})
    })
    .catch(err => {
        res.status(500).json({message: "The user information could not be retrieved"})
    })
});

// Updates a user with id and body in req.
server.put('/api/users/:id', (req, res) => {
    const changes = req.body;
    const { id } = req.params;

    if (!changes.name || !changes.bio) {
        res.status(400).json({message: 'Please provide name and bio for the user'})
    }else{
        model.update(id, changes)
        .then(userUpdated => {
            userUpdated
            ? res.status(200).json(userUpdated)
            : res.status(404).json({message: `The user with the specified ID ${id} does not exist`})
        })
        .catch(err => {
            res.status(500).json({error: err.message})
        })
    }
});

// Takes the request body to create a new user in the db.
server.post('/api/users', (req, res) => {
    const user = req.body;

    if (!user.name || !user.bio){
        res.status(400).json({message: "Please provide name and bio for the user"})
    }else{
        model.insert(user)
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(err => {
            res.status(500).json({message: "There was an error while saving the user to the database"})
        })
    }
});

// Delete user with request id in params.
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    model.remove(id)
    .then(deleted => {
        if (deleted) {
            res.status(200).json(deleted)
        }else{
            res.status(404).json({message: `The user with the specified ID ${id} does not exist`})
        }
    })
    .catch(err => {
        res.status(500).json({message: "The user could not be removed"})
    })
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
