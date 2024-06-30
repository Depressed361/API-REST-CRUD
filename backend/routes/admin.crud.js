//les requetes que seul l'admin est autorisé à faire

const express = require('express');
const router = express.Router();

const Vehicule = require('../models/post.model');
const session = require('express-session');
require('dotenv').config();
const Assurance = require('../models/assurance.model');

const bcrypt = require('bcrypt');
const auth = require('../auth/auth');
const Admin = require('../models/admin.model');
const jwt = require ('jsonwebtoken');
const privateKey = require('../auth/private_key');





router.use (session({
    name : process.env.SESSION_NAME,
   resave : false,
   saveUninitialized : false,
   secret : privateKey,
    cookie : {
        maxAge : 1000 * 60 * 60 * 2,
       sameSite : true,
        secure : process.env.NODE_ENV === 'production'
    }

}))


router.post("/login", async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email }); // Change 'user' to 'User'
        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }
        const validPassword = await bcrypt.compare(req.body.password, admin.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }
        
        const token = jwt.sign({ id: admin._id }, privateKey, { expiresIn: 60 * 60 * 2 });

        req.session.admin = admin;
        return res.status(200).json({admin:admin,token:token});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


//inscription

router.post ("/inscription", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await Admin.create({...req.body, password: hashedPassword});
         
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.post("/createVehicule",auth, async (req, res) => {
    try {
      const vehicule = await Vehicule.create(req.body)
      res.status(201).json(vehicule);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  router.put("/Vehicules/:id",auth , async  (req, res) => {
    try {
      const { id } = req.params;
      const vehicule = await Vehicule.findByIdAndUpdate
        (id, req.body, { new: true });
        res.status(200).json(vehicule);
    } catch (error) {
        res.status(500).json({ message: error.message });
        }
    });
  
  router.delete("/delete/:id", auth, async (req, res) => {
      try{
          const{id}=req.params;
          const vehicule = await Vehicule.findByIdAndDelete(id);
  
          res.status(200).json(vehicule);
      }catch (error){
          res.status(500).json({ message: error.message });
      }
      
  });


  router.post("/createAssurance", async (req, res) => {
    try {
      const assurance = await Assurance.create(req.body)
      res.status(201).json(assurance);
    } catch (error) {
        res.status(400).json({ message: error.message });
        }
    }
    );
  
  router.patch("/:id", (req, res) => {
      console.log(req.params.id);
      console.log(req.body);
  
      res.json({message: `You patched post ${req.params.make.model}`});
  });

  


module.exports = router;