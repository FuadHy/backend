const express = require('express')
const app = express()
const fs = require('fs')
const database = require('./database')
const User = require('./models/user')
database.sync()
// const text = fs.readFileSync('index.html')

app.set('view engine', 'ejs')

function notifier(){
    console.log('server is running')
}



// url encoded middleware
app.use(express.urlencoded())
// json format data reader middleware
app.use(express.json())

function custom_middleware(req, res, next){
    console.log('hello')
    req.data = 'welcome'
    next()
    // res.end('not allowed')
}



function handler(req, res){
    console.log(req.data)
    res.end('home page')
}

app.get('/', handler)




// app.use(custom_middleware)
app.get('/about', custom_middleware, (req, res) => {
    res.end('about page')
})

app.get('/contact', (req, res) => {
    res.render('index')
} )
// s0000pass
app.get('/profile', (req, res) => {
    let cars = ['ford', 'audi', 'toyota']
    res.render('profile', {username: 'hana', car_list: cars})
})

app.get('/search', (req, res) => {
    console.log(req.query)
    res.end('search results for ' + req.query)
})

app.get('/user/:username/:age', (req,res) => {
    console.log(req.params)
    res.end('welcome')
})

app.post('/register', async (req, res) => {
    const {first_name, last_name, age} = req.body
    await User.create({
        first_name: first_name,
        last_name: last_name,
        age: age
    })
    res.end('success')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/get-users', async (req, res) => {
    let data = await User.findAll()
    res.render('users', {users: data})
    // res.json(users)
    //let users = [ {first_name: 'abebe', last_name: 'kebede'}, {} ]
})

app.listen(4000, notifier)
// routes
// http methods
// handlers
// middlewares
// accepting data

// 100 - 200 -> information
// 200 - 299 -> success
// 300 - 399 -> redirection
// 400 - 499 -> client fault
// 500 - 599 -> server fault