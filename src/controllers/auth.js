const User = require('../models/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const generateID = require('../utils/generateID')
const validateEmail = require('../utils/validate')

const addUser = (req, res, next) => {
    let {email,password} = req.body
    //validate email and password
    if(!validateEmail(email)){
        return res.status(400).send({error: 'Email is not valid',status: 400,message: 'Bad Request'})
    }
    if(password.length < 7 ){
        return res.status(400).send({error: 'Password should be more than 8 characters',status: 400,message: 'Bad Request'})
    }
    // create user
    let userId = generateID()
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    let UserDoc = new User({email,hash,userId})
    // save user
    UserDoc.save()
    .then(data => {
        // save success: generate and send JWT
        let userForToken = {
            email: email,
            id : userId
        }
        let token = jwt.sign(userForToken,process.env.SECRET,{ expiresIn: 60*60*6 })
        res.status(200).send({token})
    })
    .catch(err=>{
        // save error: send error message
        res.status(500).send({error: 'Unable to add user'})
    })
}

const getUser = async (req,res,next) => {
    let {email,password} = req.body
    let user = await User.findOne({email})
    const passwordCorrect = user === null ? false: await bcrypt.compare(password, user.hash)
    
    if (!(user && passwordCorrect)) {
        return res.status(401).json({
          error: 'invalid username or password'
        })
    }

    const userForToken = {
        email: user.email,
        id: user.userId,
    }
    
    const token = jwt.sign(userForToken, process.env.SECRET)
    return res.status(200).send({ token })    
}


module.exports = {
    addUser,
    getUser
}