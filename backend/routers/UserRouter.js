const express = require('express');
const Model= require('../models/UserModel.js');

const router = express.Router();

router.post('/add', (req, res) => {
    console.log(req.body);


    new Model(req.body).save()
    .then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    });
});

//getall
router.get('/getall',(req,res)=>{
    Model.find()
      .then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    });
});

//getbycity
router.get('/getbycity/:city',(req,res)=>{
    Model.find({city: req.params.city})
        .then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        res.status(500).json(err);
    });
});

//getbyemail
router.get('/getbyemail/:email',(req,res)=>{
    Model.findOne({email: req.params.email})
        .then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        res.status(500).json(err);
    });
});

//getbyid
    router.get('/getbyid/:id',(req,res)=>{
Model.findById(req.params.id)
  .then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        res.status(500).json(err); 
    });
 });


// Delete
router.delete('/delete/:id',(req,res)=>{
    Model.findByIdAndDelete(req.params.id)
      .then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err); 
    });
});


// Update 
router.put('/update/:id',(req,res)=>{
    Model.findByIdAndUpdate(req.params.id, req.body,{new:true})
    .then((result)=>{
        res.status(200).json(result);
   }).catch((err)=>{
            res.status(500).json(err);
   });
});


module.exports = router;