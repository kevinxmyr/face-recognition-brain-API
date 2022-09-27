const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
    //   port : 3306,
      user : 'admin',
      password : '',
      database : 'test'
    }
  });

// console.log(postgres.select('*').from('users'));
//
// db.select('*').from('users').then(data => {
//     console.log(data)
// })

//this will test output the database
// remove the port that is included in the db/postgres/knex variable object -kevin
// user: 'admin' name ng computer mo. sa akin admin ang name.
// database will be test for now, yun ang nagawa ko HAHAHA! should be 'smart-brain' 

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({origin: "*",}));

app.get('/', (req, res) => {
    res.send();
})
//!--used in static database we dont need this route anymore ⬆️

// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'john',
//             email: 'john@gmail.com',
//             password: 'cookies',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'sally',
//             email: 'sally@gmail.com',
//             password: 'bananas',
//             entries: 0,
//             joined: new Date()
//         }
//     ],
//     login: [
//         {
//             id: '987',
//             hash: '',
//             email: 'john@gmail.com'
//         }
//     ]
// }

// $2a$10$1UZs7L2jUu9RHauxj8e7u..Su6VruCLJHbM3sQPuF9ge3ILyndFPi ==> HASH FOR apples

//!--SIGN IN
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
        // console.log(isValid);
        if(isValid){
            return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        // console.log(user)
                        res.json(user[0])
                    })
                .catch(err => res.status.json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials_0')
        }
    })
    .catch(err => res.status(400).json('wrong credentials_1'))
})
    
    //?--before knex--
    // const { email, password } = req.body;
    // if(email === database.users[0].email 
    //     && password === database.users[0].password){
    //         res.json(database.users[0])
    //         res.json('success')
    //     } else {
    //         res.status(404).json('Error logging In')
    //     }
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
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    // bcrypt.compareSync("bacon", hash); // true
    // bcrypt.compareSync("veggies", hash); // false
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                    // res.json(database.users[database.users.length-1]);
                //grabbing the last item on the array
                })
        }).then(trx.commit)
          .catch(trx.rollback);
    })
        .catch(error => {
        res.status(400).json('unable to register, *user exists*');
        })
    // database.users.push({
    //     id: '125',
    //     email: email,
    //     name: name,
    //     entries: 0,
    //     joined: new Date()
    // })
})
//!--profile get id
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        console.log(user)
        if (user.length){
            res.json(user[0]);
        } else {
            res.status(400).json('not found!')
        }
    })
    .catch(err => {
        res.status(400).json('error getting user')
    })
    })
//!--image
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users ').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => {
        res.status(400).json('unable to get entries');
    })


    //?--FIRST CODE--
    // const { id } = req.body;
    // let found = false;
    // database.users.forEach(user => {
    //     if(user.id === id) {
    //         found = true;
    //         user.entries++
    //         return res.json(user.entries)
    //     } 
    // })
    // if(!found){
    //     res.status(404).json('not found')
    // }
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