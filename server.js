const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({origin: "*",}));


app.get('/', (req, res) => {
    res.send(database.users);
})

const database = {
    users: [
        {
            id: '123',
            name: 'john',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}



// $2a$10$1UZs7L2jUu9RHauxj8e7u..Su6VruCLJHbM3sQPuF9ge3ILyndFPi ==> HASH FOR apples
//SIGN IN
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if(email === database.users[0].email 
        && password === database.users[0].password){
            res.json(database.users[0])
            res.json('success')
        } else {
            res.status(404).json('Error logging In')
        }
        
    })
    //!-- for sign in route before const desctruture
    // Load hash from your password DB.
    // bcrypt.compare("apples", '$2a$10$1UZs7L2jUu9RHauxj8e7u..Su6VruCLJHbM3sQPuF9ge3ILyndFPi', function(err, res) {
    //     // res == true
    //     console.log('first-guess: ', res)
    // });
    // bcrypt.compare("veggies", '$2a$10$1UZs7L2jUu9RHauxj8e7u..Su6VruCLJHbM3sQPuF9ge3ILyndFPi', function(err, res) {
    //     // res = false
    //     console.log('second-guess: ', res)
    // });
//!--REGISTER
app.post('/register', (req, res) => {
    const { email, name } = req.body;
    database.users.push({
        id: '125',
        email: email,
        name: name,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
    //grabbing the last item on the array
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.json(user)
        } 
    })
    if(!found){
        res.status(404).json('not found')
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries)
        } 
    })
    if(!found){
        res.status(404).json('not found')
    }
})

//!--** bcrypt codes ** --
// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });
// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, () => {
    console.log('Port 3000 connected!');
})


/* WHAT WE ARE GOING TO DO:
 --> res = this is working
 signin --> POST = success/fail
 register --> POST = user
 profile/:id --> GET =user
 image --> PUT --> user
*/