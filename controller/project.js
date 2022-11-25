'use strict'

var Project = require('../models/project');
var fs = require('fs');
var path = require('path');


var controller = {
    home : function(req, res){
        return res.status(200).send({
            message:'soy home'
        })
    },
    test: function(req, res){
        return res.status(200).send({
            message:'soy el metodo test'
        })
    },

    saveProject: function(req, res){
        var project = new Project();

        var params = req.body;
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs
        project.image = null

        project.save((err, projectStored)=>{
            if(err) return res.status(500).send({message:'Error al guardar el proyecto'});

            if(!projectStored) return res.status(404).send({message:'no se guardo el proyecto'});

            return res.status(200).send({project:projectStored});
        });

    },
    getProject:function(req, res){
        var projectId = req.params.id;
        if(projectId == null) return res.status(404).send({message: 'El proyecto no existe'});
        
        Project.findById(projectId,(err, project)=>{
            if(err) return res.status(500).send({message: 'error al devolver los datos'});

            if(!project) return res.status(404).send({message: 'El proyecto no existe'});

            return res.status(200).send({
                project
            })
        })
    },

    getProjects: function(req, res){
        Project.find({}).exec((err, projects)=>{
            if(err) return res.status(500).send({message: 'Error al devolver los datos.'});
            if(!projects) return res.status(404).send({message:'No hay proyectos para mostrar'});
            return res.status(200).send({projects})
        })
    },

    upDateProject: function(req, res){
        var projectId = req.params.id;
        var update = req.body;

        Project.findByIdAndUpdate(projectId, update,{new:true}, (err, projectUdate)=>{
            if(err) return res.status(500).send({message:'Error al actualizar'});
            if(!projectUdate) return res.status(400).send({message:'No existe el proyecto para actulizarlo'});
            return res.status(200).send({
                project: projectUdate
            })
        })

    },

    deleteProject: function(req,res){
        var projectId = req.params.id;

        Project.findByIdAndDelete(projectId,(err, projectDelete)=>{
            if(err) return res.status(500).send({message:'Error al Eliminar'});
            if(!projectDelete) return res.status(400).send({message:'No existe el proyecto para eliminar'});
            return res.status(200).send({
                project: projectDelete
            })
        })
    },

    uploadImage : function(req, res){
        var projectId = req.params.id;
        var fileName = 'Imagen no subida... ';

        if(req.files){
            var filePath = req.files.image.path;
            var fileSplite = filePath.split('\\');
            var fileName = fileSplite[1];

            var extSplit = fileName.split('\.');
            var fileExt = extSplit[1];

            if(fileExt == 'png'|| fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                Project.findByIdAndUpdate(projectId, {image: fileName}, {new:true},(err, projectUpdate)=>{
                    if(err) return res.status(500).send({message:'La imagen no se ha subido'});
                    if(!projectUpdate) return res.status(404).send({message:'El proyecto no existe'});
    
                    return res.status(200).send({
                        project: projectUpdate
                    });
                });
            }else{
                fs.unlink(filePath,(err)=>{
                    return res.status(200).send({message:'La extencion no es valida'});
                })
            }

          
        }else{
            return res.status(200).send({
                message:fileName
            })
        }

    },
    getImageFile: function(req,res){
        var file = req.params.image;
        var path_file = './uploads/'+file;

        fs.stat(path_file,(err)=>{
            if(!err){
                return res.sendFile(path.resolve(path_file))
            }else{
              return  res.status(200).send({
                message:'Noexiste la imagen'
              })
            }
        });
    }
   
};

module.exports = controller;