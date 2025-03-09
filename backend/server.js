const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require('./config/database');
const Vehicule = require ('./models/post.model');
const dotenv = require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const privateKey = require('./auth/private_key');


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

app.use(express.urlencoded({ extended: true }));

app.use (session({
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


 app.use('/post', require('./routes/post.routes'));
 app.use('/user', require('./routes/login'));
 app.use('/admin', require('./routes/admin.crud'));
 app.use('/ville', require('./routes/ville.routes'));
 app.use('/Assurances', require('./routes/assurance.route'));


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