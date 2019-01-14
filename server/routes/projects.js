var express = require('express');
var router = express.Router();
const ProjectController = require('../controllers/ProjectController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', ProjectController.createProject)

router.get('/:id', ProjectController.getProjectDetail)

router.patch('/:id', ProjectController.update)

router.delete('/:id', ProjectController.delete)

router.post('/addmember', ProjectController.addMember)


module.exports = router;
