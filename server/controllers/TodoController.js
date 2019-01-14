const Todo = require('../models/Todo')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

class TodoController {
  static getTodo(req, res) {
    User.findById(req.params.userId)
    .then(function(user) {
      if (user) {
        return Todo.find({creator: req.params.userId, project: null })
      }
      else {
        res.status(401).json({
          message: "Unauthorized"
        })
      }
    })
    .then(function(todos) {
      res.status(200).json(todos)
    })
    .catch(function(error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message
      })
    })
  }


  static getTodoProject(req, res) {
    if (req.body.token) {
      var decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
      User.findById(decoded._id)
        .then(function(user) {
          if (user) {
            return Todo.find({creator: decoded._id, project: req.params.projectId })
            .populate('User')
          }
          else {
            res.status(401).json({
              message: "Unauthorized"
            })
          }
        })
        .then(function(todos) {
          res.status(200).json(todos)
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

  static getTodoDetail(req, res) {
    if (req.body.token) {
      var decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
      User.findById(decoded._id)
        .then(function(user) {
          if (user) {
            return Todo.findById(req.params.id)
          }
          else {
            res.status(401).json({
              message: "Unauthorized"
            })
          }
        })
        .then(function(todo) {
          res.status(200).json(todo)
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

  static createTodo(req, res) {
    if (req.body.token) {
      var decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
      User.findById(decoded._id)
        .then(function(user) {
          if (user) {
            let obj = {
              name: req.body.name,
              description: req.body.description,
              status: "Uncomplete",
              due_date: req.body.due_date,
              creator: decoded._id,
              project: req.body.project || null
            }
            return Todo.create(obj)
          }
          else {
            res.status(401).json({
              message: "Unauthorized"
            })
          }
        })
        .then(function(todo) {
          res.status(200).json(todo)
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
            return Todo.findOneAndUpdate({_id: req.params.id}, req.body)
          }
          else {
            res.status(401).json({
              message: "Unauthorized"
            })
          }
        })
        .then(function(todo) {
          if (todo) {
            return Todo.findById(req.params.id)
          }
          else {
            res.status(404).json({
              message: "Not found"
            })
          }
        })
        .then(function(member) {
          res.status(200).json(member)
        })
        .catch(function(err) {
          res.status(500).json({
            message: "Internal server error",
            err: error.message
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
    Todo.findOneAndDelete({_id: req.params.id})
    .then(function(todo) {
      if (todo) {
        res.status(200).json(todo)
      }
      else {
        res.status(404).json({
          message: "Not found"
        })
      }
    })
    .catch(function(err) {
      res.status(500).json({
        message: "Internal server error",
        err: error.message
      })
    })
  }

}

module.exports = TodoController