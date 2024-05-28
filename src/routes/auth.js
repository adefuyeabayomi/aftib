const router = require('express').Router();

const {getUser, addUser} = require('../controllers/auth')

router.post('/login',getUser)

router.post('/signup',addUser) 

module.exports = router