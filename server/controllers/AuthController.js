const {OAuth2Client} = require('google-auth-library');
const {ObjectId} = require('mongodb');
const clientId = '402397613072-fpijagmlm7mcln8k60h5vnoll5r24ouh.apps.googleusercontent.com'
const client = new OAuth2Client(clientId);
const User = require('../models/User')
const jwt = require('jsonwebtoken')

class AuthController {
  static auth(req, res) {
    let payload = null

    client.verifyIdToken({
      idToken: req.body.idToken,
      audience: clientId
    })
    .then(function(ticket) {
      payload = ticket.getPayload();
      return User.findOne({email: payload['email']})
    })
    .then(function(user) {
      if (!user) {
        let obj = {
          name: payload.name,
          email: payload.email,
          projects: []
        }
        return User.create(obj)
      }
      else {
        payload = {
          _id: ObjectId(user._id),
          name: user.name,
          email: user.email
        }
        let token = jwt.sign(payload, process.env.JWT_SECRET);
        res.status(200).json({
          token: token,
          payload: payload
        })
      }
    })
    .then(function(user) {
      console.log('=======================', user);
      payload = {
        _id: user._id,
        name: user.name,
        email: user.email
      }
      let token = jwt.sign(payload, process.env.JWT_SECRET);
      res.status(200).json({
        token: token,
        id: payload._id
      })
    })
    .catch(function(error) {
      console.log(error.message);
      res.status(500).json({
        message: "Internal server error",
        error: error.message
      })
    })
  }
}

module.exports = AuthController