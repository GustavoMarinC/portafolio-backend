'use stric'

var express = require('express');
var ProjectController = require('../controller/project')

var router = express.Router();

var multipart = require('connect-multiparty');
var multiparteMiddelware = multipart({uploadDir:'./uploads'})

router.get('/home',ProjectController.home);
router.post('/test', ProjectController.test);
router.post('/save-project',ProjectController.saveProject)
router.get('/project/:id?',ProjectController.getProject)
router.get('/projects/',ProjectController.getProjects)
router.put('/project/:id',ProjectController.upDateProject)
router.delete('/project/:id',ProjectController.deleteProject)
router.post('/upload-image/:id', multiparteMiddelware,ProjectController.uploadImage);
router.get('/get-image/:image',ProjectController.getImageFile)

module.exports = router;