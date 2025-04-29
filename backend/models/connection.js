const mongoose = require('mongoose');
const CONNEXION_STRING = process.env.CONNEXION_STRING;
const connectionString = `mongodb+srv://${CONNEXION_STRING}/locapic`;

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
 .then(() => console.log('Database connected'))

  .catch(error => console.error(error));