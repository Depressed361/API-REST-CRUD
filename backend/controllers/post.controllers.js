// Import the Post model
const Vehicule = require('../models/post.model');
const Post = require('../models/post.model');
// Create and Save a new Post
module.exports.setPosts = async (req, res) => {
    if (!req.body.title) {
        return res.status(400).send({
            message: "Post title can not be empty"
        });
    }
   const post = await Vehicule.create({
        make: req.body.make,
        model: req.body.model,
        speed: req.body.speed,
        year: req.body.year,
        picture: req.body.picture
    });
    res.status(201).json(post);
   } ;


