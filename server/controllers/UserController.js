const User = require('../models/User')
const {ObjectId} = require('mongodb');
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(process.env.SALT);
const jwt = require('jsonwebtoken')

class UserController {
  static create(req, res) {
    var password = bcrypt.hashSync(req.body.password, salt);
    let obj = {
      name: req.body.name,
      email: req.body.email,
      password: password,
      projects: []
    }

    User.create(obj)
      .then(function(user) {
        res.status(200).json(user)
      })
      .catch(function(error) {
        res.status(500).json({
          message: "Internal server error",
          error: error.message
        })
      })
  }

  static signin(req, res) {
    User.findOne({email: req.body.email})
      .then(function (user) {
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
          let payload = {
            _id: ObjectId(user._id),
            name: user.name,
            email: user.email
          }

          let token = jwt.sign(payload, process.env.JWT_SECRET);
          res.status(200).json({
            token: token,
            id: payload._id
          })
        }
        else {
          res.status(401).json({
            message: "Wrong email/password",
          })
        }
      })
      .catch(function(error) {
        res.status(500).json({
          message: "Internal server error",
          error: error.message
        })
      })
  }
}

module.exports = UserController