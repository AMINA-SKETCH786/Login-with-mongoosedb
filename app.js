const express = require('express')
const app = express()
const userModel = require('./models/user')

const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
require("dotenv").config()

  app.get('/', function (req, res) {
   res.render('index')
  })
  app.get('/login', function (req, res) {
    res.render('login')
   })

  app.post('/create',  function (req, res) {
    let {username, age, email, password} = req.body
    bcrypt.genSalt(10, (err, salt) => {
bcrypt.hash(password, salt, async (err, hash) => {
  let createdUser = await userModel.create({
     username,
      age,
      email,
      password: hash
})

let token = jwt.sign({email}, 'style')
res.cookie('token', token)
res.send(createdUser)
})
    })
    
   })

   app.post('/login', async function (req, res) {
    let {email, password} = req.body
let user = await userModel.findOne({email})
if(!user) return res.status(500).send('Something Went Wrong')

    bcrypt.compare(password, user.password, function(err, result) {
      
      if(result) res.status(200).send ('you can login')
        else res.redirect('/login')
    })
    
   })
   app.get('/logout',  function (req, res) {
    res.cookie('token', '')
    res.redirect('/login')
   })
app.listen(3000)