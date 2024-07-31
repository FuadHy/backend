const express = require('express')
const app = express()
const PORT = 4000

const database = require('./database')
const relations = require('./models/relations')
const User = require('./models/User')
relations()
database.sync()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Product = require('./models/Product')
const SECRET = '1234@secret'
const cors = require('cors')
const {formidable} = require('formidable')
app.use(cors())
const fs = require('fs')
const path = require('path')

app.use( express.json() )
app.use( express.urlencoded() )

app.post('/register', async (req, res) => {
    const { first_name, last_name, username, password } = req.body
    if(password.length < 6) return res.json({success: false, message: 'password length is less than 6'})
    let hashed = bcrypt.hashSync(password, 10)
    await User.create({ first_name, last_name, username, password: hashed })
    res.json({ success: true })
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body
    const user = await User.findOne({ where: { username } })
    if(!user) return res.json({ success: false, message: 'incorrect username or passworr' })
    console.log(user, password)
    if(bcrypt.compareSync(password, user.password)){
        let token = jwt.sign(user.id, SECRET)
        return res.json({ success: true, token })
    }
    else return res.json({ success: false, message: 'incorrect username or passworr' })
})

app.get('/all-products', async (req, res) => {
    let products = await Product.findAll({ where: {sold: false} })
    res.json({ products })
})

app.use( async (req, res, next) => {
    let header = req.headers['authorization']
    if(!header) return res.sendStatus(403)
    let token = header.split(' ')[1]
    if(!token) return res.sendStatus(403)
    try {
        let id = jwt.verify(token, SECRET)
        req.id = id
        next()
    } catch(e){
        return res.sendStatus(403)
    }
})

app.post('/add-product', async (req, res) => {
   let form = formidable({uploadDir: './uploads'})
   form.parse(req, async  (err, fields, files) => {
       console.log(fields, files)
       const image = files.image[0]
       const ext = image.mimetype.split('/')[1]
       fs.renameSync(image.filepath, image.filepath + '.' + ext)
       await Product.create({
           userid: req.id,
           title: fields.title[0],
           price: fields.price[0],
           company: fields.company[0],
           description: fields.description[0],
           image: '/uploads/' + image.newFilename + '.' + ext
       })
       res.json({success: true})
   })
})

app.get('/my-products', async (req, res) => {
    let products = await Product.findAll({ where: { userid: req.id } })
    res.json({ products })
})

app.delete('/delete-product', async (req, res) => {
    const { id } = req.body
    let product = await Product.findByPk(id)
    if(!product) return res.json({success: false, message: 'product not found'})
    if(product.userid != req.id) return res.json({success: false, })
    await product.destroy()
    res.json({success: true})
})

app.post('/mark-as-sold', async(req, res) => {
    const {id} = req.body
    let product = await Product.findByPk(id)
    if(!product) return res.json({success:false})
    product.sold = true
    await product.save()
    res.json({success: true})
})

app.patch('/update-product', async (req, res) => {
    const {id, title, price, description, company} = req.body
    // get the product
    let product = await Product.findByPk(id)

    // if the product doesnt exist end with false
    if(!product) return res.json({success: false})
    // edit every field
    product.title = title
    product.price = price
    product.description = description
    product.company = company
    // save the changes
    await product.save()
    res.json({success: true})

})

app.listen(PORT, () => console.log('server is running'))