const Project = require('../models/Project')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

class ProjectController {

  static createProject(req, res) {
    if (req.body.token) {
      var decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
      User.findById(decoded._id)
        .then(function(user) {
          if (user) {
            let obj = {
              name: req.body.name,
              description: req.body.description,
              members: decoded._id
            }
            return Project.create(obj)
          }
          else {
            res.status(401).json({
              message: "Unauthorized"
            })
          }
        })
        .then(function(project) {
          return User.findOneAndUpdate({_id: decoded._id}, { $push: { projects: project._id } } )
        })
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
    else {
      res.status(401).json({
        message: "Unauthorized"
      })
    }
  }

  static getProjectDetail(req, res) {
    if (req.body.token) {
      var decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
      User.findById(decoded._id)
        .then(function(user) {
          if (user) {
            return Project.findById(req.params.id)
          }
          else {
            res.status(401).json({
              message: "Unauthorized"
            })
          }
        })
        .then(function(project) {
          res.status(200).json(project)
        })
        .catch(function(error) {
          res.status(500).json({
            message: "Internal server error",
            error: error.message
          })
        })
    }
    else {
      res.status(401).json({
        message: "Unauthorized"
      })
    }
  }

  static update(req, res) {
    if (req.body.token) {
      var decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
      User.findById(decoded._id)
        .then(function(user) {
          if (user) {
            return Project.findOneAndUpdate({_id: req.params.id}, req.body)
          }
          else {
            res.status(401).json({
              message: "Unauthorized"
            })
          }
        })
        .then(function(project) {
          if (project) {
            res.status(200).json(project)
          }
          else {
            res.status(401).json({
              message: "Not found"
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
    else {
      res.status(401).json({
        message: "Unauthorized"
      })
    }
  }

  static delete(req, res) {
    if (req.body.token) {
      var decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
      User.findById(decoded._id)
        .then(function(user) {
          if (user) {
            return Project.findOneAndDelete({_id: req.params.id})
          }
          else {
            res.status(401).json({
              message: "Unauthorized"
            })
          }
        })
        .then(function(project) {
          if (project) {
            res.status(200).json(project)
          }
          else {
            res.status(401).json({
              message: "Not found"
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
    else {
      res.status(401).json({
        message: "Unauthorized"
      })
    }
  }

  static addMember(req, res) {
    if (req.body.token) {
      var decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
      User.findById(decoded._id)
        .then(function(user) {
          if (user) {
            return User.findOne({email: req.body.email})
          }
          else {
            res.status(401).json({
              message: "Unauthorized"
            })
          }
        })
        .then(function(user) {
          if (user) {
            return Project.findOneAndUpdate({_id: req.params.id}, { $push: { members: user._id } })
          }
          else {
            res.status(401).json({
              message: "Not found"
            })
          }
        })
        .then(function(project) {
          if (project) {
            res.status(200).json(project)
          }
          else {
            res.status(401).json({
              message: "Not found"
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
    else {
      res.status(401).json({
        message: "Unauthorized"
      })
    }
  }
}

module.exports = ProjectController