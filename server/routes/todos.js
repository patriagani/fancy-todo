var express = require('express');
var router = express.Router();
const TodoController = require('../controllers/TodoController')

router.post('/', TodoController.createTodo)

router.get('/:id', TodoController.getTodoDetail)

router.patch('/:id', TodoController.update)

router.delete('/:id', TodoController.delete)

router.get('/personal/:userId', TodoController.getTodo)

router.get('/project/:projectId', TodoController.getTodoProject)



module.exports = router;
