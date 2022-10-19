const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const knex = require('./db/client')

const app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))

app.use(express.urlencoded({extended: true}))

app.use(methodOverride((req, res) => {
  if(req.body && req.body._method) {
    const method = req.body._method
    return method
  }
}))

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    
    const username = req.cookies.username
    res.locals.username = ''

    if(username){
        res.locals.username = username;
    }   
    next(); 
})


app.get("/", (req,res) => {
    knex("clucks")
    .orderBy('id', "desc")
    .then(clucks => {
    res.render("clucks/index", {clucks: clucks})
    })
})

app.post('/sign_in', (req, res) => {
    const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 //a day in milliseconds
    const username = req.body.username
    res.cookie('username', username, {maxAge: COOKIE_MAX_AGE})
    res.redirect("/")
})

app.post('/sign_in_new', (req, res) => {
    const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 //a day in milliseconds
    const username = req.body.username
    res.cookie('username', username, {maxAge: COOKIE_MAX_AGE})
    res.redirect("/clucks/new")
})

app.post('/sign_out', (req, res) => {
    res.clearCookie("username")
    res.redirect("/")
})

const clucksRouter = require("./routes/clucks")
app.use("/clucks", clucksRouter)

const PORT = 3000
const HOST = 'localhost'
app.listen(PORT, HOST, () => {
  console.log(`The server is listening at ${HOST}:${PORT}`);
})


