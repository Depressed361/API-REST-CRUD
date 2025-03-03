const express = require('express');
const app = express();
const port = 5000;
const connectDB = require('./config/database');
const Vehicule = require ('./models/post.model');
const dotenv = require('dotenv').config();
const cors = require('cors');



app.use(cors(
    {
        origin: /*'http://localhost:4200'*/'*',

        credentials: true,
        
    }
));

connectDB ();

//app.get('/post', (req, res) => {
 //   res.send('Hello World!');
 //   });

 // middleware qui permet de parser les requêtes

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

 app.use('/post', require('./routes/post.routes'));
 app.use('/user', require('./routes/login'));
 app.use('/admin', require('./routes/admin.crud'));
 app.use('/ville', require('./routes/ville.routes'));


 setInterval(async () => {
  const now = new Date();
  const vehicules = await Vehicule.find({ dateFinLocation: { $lt: now } });
  for (const vehicule of vehicules) {
      vehicule.disponible = true;
      vehicule.dateFinLocation = null;
      await vehicule.save();
  }
}, 60 * 60 * 1000);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});